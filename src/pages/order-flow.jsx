'use client';
import { useEffect, useState } from 'react';
import styles from '@/styles/OrderFlowPage.module.css';

export default function OrderFlowPage() {
  const [user, setUser] = useState(null);
  const userId = user?.id || user?._id;
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({ title: '', fullAddress: '' });
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [mesafeliAccepted, setMesafeliAccepted] = useState(false);  const [popupType, setPopupType] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchAddresses();
    }
  }, [user]);

  const fetchCart = () => {
    fetch(`https://api.sakaoglustore.net/api/cart/${userId}`)
      .then(res => res.json())
      .then(data => {
        const cart = Array.isArray(data) ? data : data.cart || [];
        setCartItems(cart);
      })
      .catch(err => console.error('Sepet alınamadı:', err));
  };

  const fetchAddresses = () => {
    setAddresses(user?.addresses || []);
  };

  const calcTotals = () => {
    let totalBoxFee = 0;
    let totalShipping = 0;
    let totalVAT = 0;
    let net = 0;

    cartItems.forEach(item => {
      const product = item.productId;
      const qty = item.quantity;

      const price = Number(product.price) || 0;
      const kdvOrani = Number(product.kdvOrani) || 0;
      const kutuUcreti = Number(product.kutuUcreti) || 0;
      const kargoUcreti = Number(product.kargoUcreti) || 0;

      const raw = price * qty;
      const boxFee = kutuUcreti * qty;
      const shipping = kargoUcreti * qty;
      const vat = raw * kdvOrani;
      const netPrice = raw;

      totalBoxFee += boxFee;
      totalShipping += shipping;
      totalVAT += vat;
      net += netPrice;
    });

    const finalTotal = net + totalVAT + totalBoxFee + totalShipping;

    return {
      totalBoxFee,
      totalShipping,
      totalVAT,
      net,
      finalTotal
    };
  };

  const totals = calcTotals();

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return;
    fetch('https://api.sakaoglustore.net/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, quantity: newQty })
    }).then(() => fetchCart());
  };

  const removeItem = (productId) => {
    fetch(`https://api.sakaoglustore.net/api/cart/remove/${userId}/${productId}`, {
      method: 'DELETE'
    }).then(() => fetchCart());
  };  
  const handlePurchase = async () => {
  if (!userId) {
    setPopupType('login-purchase');
    setPopupVisible(true);
    return;
  }
  if (selectedAddressIndex === null) {
    alert('Lütfen bir adres seçin.');
    return;
  }
  if (!kvkkAccepted || !mesafeliAccepted) {
    alert('Lütfen KVKK ve Mesafeli Satış sözleşmelerini kabul edin.');
    return;
  }  try {
    const cartTotal = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const selectedAddress = addresses[selectedAddressIndex];
    const addressId = selectedAddress?._id;
    
    const orderRes = await fetch(`https://api.sakaoglustore.net/api/box/open-box/${userId}/${addressId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        quantity: cartTotal,
        totalPrice: totals.finalTotal
      })
    });

    const orderData = await orderRes.json();

    if (!orderRes.ok) {
      alert(orderData.message || 'Sipariş sırasında hata oluştu.');
      return;
    }    await fetch(`https://api.sakaoglustore.net/api/cart/clear/${userId}`, {
      method: 'DELETE'
    });    setCartItems([]);    const orderId = orderData.orders[0]?.orderId;
    window.location.href = `/payment-details?orderId=${orderId}&total=${Math.round(totals.finalTotal)}`;

  } catch (err) {
    console.error('Satın alma hatası:', err);
    alert('Sunucu hatası.');
  }
};

const handlePopupOpen = (index = null) => {
  if (!user) {
    setPopupType('login-required');
    setPopupVisible(true);
    return;
  }

  setEditingIndex(index);
  setForm(index !== null ? addresses[index] : { title: '', fullAddress: '', city: '', district: '', phone: '' });
  setPopupType('address-form');
  setPopupVisible(true);
};

  const handlePopupClose = () => {
    setPopupVisible(false);
    setEditingIndex(null);
  };

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const saveAddress = async () => {
  if (!form.title || !form.city || !form.district || !form.fullAddress || !form.phone || !user?._id) {
    alert('Lütfen tüm alanları doldurun.');
    return;
  }

  const url = editingIndex !== null
    ? `https://api.sakaoglustore.net/api/user/address/update/${user._id}/${editingIndex}`
    : `https://api.sakaoglustore.net/api/user/address/add/${user._id}`;

  const method = editingIndex !== null ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form)
  });

  const data = await res.json();
  if (res.ok) {
    const updatedUser = { ...user, addresses: data.addresses };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setAddresses(data.addresses);
    handlePopupClose();
  } else {
    alert(data.message || 'İşlem başarısız.');
  }
};


  return (
    <div className={styles.orderFlowPage}>
      <div className={styles.orderContainer}>
        <div className={styles.orderLeft}>
          <h2>Alışveriş Tamamlama</h2>
          {cartItems.length === 0 ? (
            <p>Sepetiniz boş.</p>
          ) : (
            <div className={styles.cartItems}>
              {cartItems.map(item => (
                <div className={styles.cartItem} key={item.productId._id}>
                  <img src={item.productId.image} alt={item.productId.name} />
                  <div className={styles.cartDetails}>
                    <h4>{item.productId.name}</h4>
                    <p>{item.productId.description}</p>
                    <div className={styles.quantityControls}>
                      {item.quantity > 1 ? (
                        <button onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}>-</button>
                      ) : (
                        <button className={styles.removeBtn} onClick={() => removeItem(item.productId._id)}>Kaldır</button>
                      )}                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}>+</button>
                    </div>
                    <p>Fiyat: {Math.round(totals.finalTotal)} TL</p>
                  </div>
                </div>
              ))}
              <h3>Toplam: {Math.round(totals.finalTotal)} TL</h3>
            </div>
          )}
          <div className={styles.addressPage}>
            <div className={styles.addressList}>
              {addresses.map((addr, index) => (
                <div
                  key={index}
                  className={`${styles.addressCard} ${selectedAddressIndex === index ? styles.selected : ''}`}
                  onClick={() => {
                    setSelectedAddressIndex(index);
                    setSelectedAddressId(addresses[index]?._id);
                  }}
                >
                  <h4>{addr.title}</h4>
                  <p>{addr.fullAddress}</p>
                  <div className={styles.actionButtons}>
                    <button onClick={(e) => { e.stopPropagation(); handlePopupOpen(index); }}>Düzenle</button>                  </div>
                </div>
              ))}
              <button 
                className={styles.addAddressBtn} 
                onClick={() => handlePopupOpen()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Yeni Adres Ekle
              </button>
            </div>
          </div>
        </div>        <div className={styles.orderSummary}>
          <h3>Fiyat Özeti</h3>
          <p>Ambalaj bedeli: {Math.round(totals.totalBoxFee)} TL</p>
          <p>Kargo Ücreti: {Math.round(totals.totalShipping)} TL</p>
          <p>KDV: {Math.round(totals.totalVAT)} TL</p>          
          <p>Net Fiyat: {Math.round(totals.net)} TL</p>
          <hr />
          <p><strong>Toplam: {Math.round(totals.finalTotal)} TL</strong></p>          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="kvkk"
              checked={kvkkAccepted}
              onChange={() => setKvkkAccepted(!kvkkAccepted)}
            />            <label htmlFor="kvkk">
              KVKK Aydınlatma Metnini okudum ve kabul ediyorum.
              <button
                id="kvkkViewBtn"
                className={styles.viewButton}
                onClick={(e) => {
                  e.preventDefault();
                  window.open('/kvkk', '_blank');
                }}
              >
                Görüntüle
              </button>
            </label>
          </div>

          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="mesafeli"
              checked={mesafeliAccepted}
              onChange={() => setMesafeliAccepted(!mesafeliAccepted)}
            />            <label htmlFor="mesafeli">
              Mesafeli Satış Sözleşmesini okudum ve kabul ediyorum.
              <button
                id="mesafeliViewBtn"
                className={styles.viewButton}
                onClick={(e) => {
                  e.preventDefault();
                  window.open('/mesafeli-satis-sozlesmesi', '_blank');
                }}
              >
                Görüntüle
              </button>
            </label>
          </div>

          <button
            onClick={handlePurchase}
            className={styles.purchaseBtn}
            disabled={!(kvkkAccepted && mesafeliAccepted)}
          >
            Satın Al
          </button></div>
{popupVisible && (
  <div className={styles.popupOverlay}>
    <div className={styles.popupContent}>
      {popupType === 'login-required' ? (
        <>
          <h3>İşlem yapmak için giriş yapmanız gerekiyor</h3>
          <p>
            Hesabınız var mı?{' '}
            <span onClick={() => { window.location.href = '/login'; }} className={styles.link}>Giriş Yap</span> |{' '}
            <span onClick={() => { window.location.href = '/signup'; }} className={styles.link}>Kayıt Ol</span>
          </p>
          <button onClick={() => setPopupVisible(false)} className={styles.closeBtn}>Kapat</button>
        </>
      ): popupType === 'address-form' ? (
        <>
          <h3>{editingIndex !== null ? 'Adres Düzenle' : 'Yeni Adres Ekle'}</h3>
          <input
            name="title"
            value={form.title}
            onChange={handleFormChange}
            placeholder="Başlık (Ev/İş)"
          />
          <input
            name="city"
            value={form.city}
            onChange={handleFormChange}
            placeholder="İl"
          />
          <input
            name="district"
            value={form.district}
            onChange={handleFormChange}
            placeholder="İlçe"
          />
          <textarea
            name="fullAddress"
            value={form.fullAddress}
            onChange={handleFormChange}
            placeholder="Adres"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleFormChange}
            placeholder="Telefon (5xx xxx xxxx)"
          />
          <div className={styles.popupActions}>
            <button onClick={saveAddress}>Kaydet</button>
            <button onClick={() => setPopupVisible(false)} className={styles.cancelBtn}>
              İptal
            </button>
          </div>
        </>
      ): null}

      {popupType === 'login-purchase' && (
        <>
          <h3>İşlem yapmak için giriş yapmanız gerekiyor</h3>
          <p>
            Hesabınız var mı?{' '}
            <span onClick={() => { window.location.href = '/login'; }} className={styles.link}>Giriş Yap</span> |{' '}
            <span onClick={() => { window.location.href = '/signup'; }} className={styles.link}>Kayıt Ol</span>
          </p>
          <button onClick={() => setPopupVisible(false)} className={styles.closeBtn}>Kapat</button>
        </>
      )}
    </div>
  </div>
)}

      </div>
    </div>
  );
}