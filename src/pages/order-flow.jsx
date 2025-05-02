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
  const [contractAccepted, setContractAccepted] = useState(false);

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
    fetch(`http://localhost:5000/api/cart/${userId}`)
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

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return;
    fetch('http://localhost:5000/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, quantity: newQty })
    }).then(() => fetchCart());
  };

  const removeItem = (productId) => {
    fetch(`http://localhost:5000/api/cart/remove/${userId}/${productId}`, {
      method: 'DELETE'
    }).then(() => fetchCart());
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

  const handlePurchase = async () => {
    if (!selectedAddressId) return alert('Lütfen bir adres seçin.');
    if (!kvkkAccepted || !contractAccepted) return alert('Sözleşmeleri onaylamadan devam edemezsiniz.');

    try {
      const orderId = `ORDER-${Date.now()}`;
      const response = await fetch('http://localhost:5000/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, totalAmount: totals.finalTotal.toFixed(2), orderId })
      });
      const html = await response.text();
      const newWindow = window.open('', '_blank');
      newWindow.document.write(html);
      newWindow.document.close();
    } catch (err) {
      alert('Sunucu hatası');
    }
  };

  const handlePopupOpen = (index = null) => {
    setEditingIndex(index);
    setForm(index !== null ? addresses[index] : { title: '', fullAddress: '' });
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
    const updatedAddresses = [...addresses];
    if (editingIndex !== null) updatedAddresses[editingIndex] = form;
    else updatedAddresses.push(form);

    const res = await fetch(`http://localhost:5000/api/user/update-addresses/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addresses: updatedAddresses })
    });

    const data = await res.json();
    if (res.ok) {
      setAddresses(data.updatedUser.addresses);
      localStorage.setItem('user', JSON.stringify(data.updatedUser));
      handlePopupClose();
    }
  };

  const deleteAddress = async index => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    const res = await fetch(`http://localhost:5000/api/user/update-addresses/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addresses: updatedAddresses })
    });

    const data = await res.json();
    if (res.ok) {
      setAddresses(data.updatedUser.addresses);
      localStorage.setItem('user', JSON.stringify(data.updatedUser));
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
                      )}
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}>+</button>
                    </div>
                    <p>Fiyat: {totals.finalTotal.toFixed(2)} TL</p>
                  </div>
                </div>
              ))}
              <h3>Toplam: {totals.finalTotal.toFixed(2)} TL</h3>
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
                    <button onClick={(e) => { e.stopPropagation(); handlePopupOpen(index); }}>Düzenle</button>
                    <button onClick={(e) => { e.stopPropagation(); deleteAddress(index); }}>Sil</button>
                  </div>
                </div>
              ))}
              <button onClick={() => handlePopupOpen()}>Yeni Adres Ekle</button>
            </div>
          </div>
        </div>
        <div className={styles.orderSummary}>
          <h3>Fiyat Özeti</h3>
          <p>Kutu Ücreti: {totals.totalBoxFee.toFixed(2)} TL</p>
          <p>Kargo Ücreti: {totals.totalShipping.toFixed(2)} TL</p>
          <p>KDV: {totals.totalVAT.toFixed(2)} TL</p>
          <p>Net Fiyat: {totals.net.toFixed(2)} TL</p>
          <hr />
          <p><strong>Toplam: {totals.finalTotal.toFixed(2)} TL</strong></p>
          <div className={styles.contractChecks}>
            <label>
              <input type="checkbox" checked={kvkkAccepted} onChange={e => setKvkkAccepted(e.target.checked)} />
              <a href="/kvkk" target="_blank"> KVKK Aydınlatma Metni</a>’ni okudum ve kabul ediyorum.
            </label>
            <label>
              <input type="checkbox" checked={contractAccepted} onChange={e => setContractAccepted(e.target.checked)} />
              <a href="/mesafeli-satis-sozlesmesi" target="_blank"> Mesafeli Satış Sözleşmesi</a>’ni okudum ve kabul ediyorum.
            </label>
          </div>
          <button onClick={handlePurchase} className={styles.purchaseBtn}>Satın Al</button>
        </div>
      </div>

      {popupVisible && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h3>{editingIndex !== null ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}</h3>
            <input name="title" value={form.title} placeholder="Başlık (Ev, İş...)" onChange={handleFormChange} />
            <textarea name="fullAddress" value={form.fullAddress} placeholder="Adres" onChange={handleFormChange} />
            <div className={styles.popupActions}>
              <button onClick={saveAddress}>Kaydet</button>
              <button onClick={handlePopupClose}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
