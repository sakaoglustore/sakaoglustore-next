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

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return;
    fetch('https://api.sakaoglustore.net/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, quantity: newQty })
    })
      .then(res => res.json())
      .then(() => fetchCart())
      .catch(err => console.error('❌ Güncelleme Hata:', err));
  };

  const removeItem = (productId) => {
    fetch(`https://api.sakaoglustore.net/api/cart/remove/${userId}/${productId}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => fetchCart())
      .catch(err => console.error('❌ Kaldırma Hata:', err));
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = Number(item.productId?.price) || 0;
    return sum + price * item.quantity;
  }, 0);

  const totalBoxes = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const boxFee = totalBoxes * 10;
  const netPrice = (totalPrice - boxFee) / 1.2;
  const vat = totalPrice - boxFee - netPrice;

  const handlePurchase = async () => {
    if (!selectedAddressId) {
      alert('Lütfen bir adres seçin.');
      return;
    }

    try {
      const quantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

      const res = await fetch(`https://api.sakaoglustore.net/api/box/open-box/${userId}/${selectedAddressId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = '/';
      } else {
        alert(data.message || 'Sipariş sırasında hata oluştu.');
      }
    } catch (err) {
      console.error('Satın alma hatası:', err);
      alert('Sunucu hatası.');
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
    if (editingIndex !== null) {
      updatedAddresses[editingIndex] = form;
    } else {
      updatedAddresses.push(form);
    }

    const res = await fetch(`https://api.sakaoglustore.net/api/user/update-addresses/${userId}`, {
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
    const res = await fetch(`https://api.sakaoglustore.net/api/user/update-addresses/${userId}`, {
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
                    <p>Fiyat: {(item.productId.price * item.quantity).toFixed(2)} TL</p>
                  </div>
                </div>
              ))}
              <h3>Toplam: {totalPrice.toFixed(2)} TL</h3>
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
                    <button className={styles.addBtn} onClick={(e) => { e.stopPropagation(); handlePopupOpen(index); }}>Düzenle</button>
                    <button className={styles.addBtn} onClick={(e) => { e.stopPropagation(); deleteAddress(index); }}>Sil</button>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.actionButtons}>
              <button className={styles.addBtn} onClick={() => handlePopupOpen()}>Yeni Adres Ekle</button>
            </div>
          </div>
        </div>

        <div className={styles.orderSummary}>
          <h3>Fiyat Özeti</h3>
          <p>Kutu Ücreti: {boxFee.toFixed(2)} TL</p>
          <p>KDV (%20): {vat.toFixed(2)} TL</p>
          <p>Net Fiyat: {netPrice.toFixed(2)} TL</p>
          <hr />
          <p><strong>Toplam: {totalPrice.toFixed(2)} TL</strong></p>
          <button onClick={handlePurchase} className={styles.purchaseBtn}>Satın Al</button>
        </div>
      </div>

      {popupVisible && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h3>{editingIndex !== null ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}</h3>
            <input
              name="title"
              value={form.title}
              placeholder="Başlık (Ev, İş...)"
              onChange={handleFormChange}
            />
            <textarea
              name="fullAddress"
              value={form.fullAddress}
              placeholder="Adres"
              onChange={handleFormChange}
            />
            <div className={styles.popupActions}>
              <button className={styles.saveBtn} onClick={saveAddress}>Kaydet</button>
              <button className={styles.cancelBtn} onClick={handlePopupClose}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
