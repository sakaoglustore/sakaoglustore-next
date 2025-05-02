// src/pages/order-history.jsx
'use client';
import { useEffect, useState } from 'react';
import styles from '@/styles/OrderHistory.module.css';
import axios from 'axios';

export default function OrderHistoryPage() {
  const [groupedOrders, setGroupedOrders] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
  
    const userId = user.id || user._id; // ✅ Hataları engeller
  
    axios.get(`https://api.sakaoglustore.net/api/user/orders/${userId}`)
      .then(res => {
        const orders = res.data;
        const grouped = {};
  
        for (const order of orders) {
          const key = order.trackingNumber || 'NO_TRACKING';
  
          if (!grouped[key]) {
            grouped[key] = {
              trackingNumber: order.trackingNumber,
              confirmationCodes: [],
              orderMap: {},
              createdAt: order.createdAt,
              itemsMap: {},
            };
          }
  
          grouped[key].confirmationCodes.push(order.confirmationCode);
          grouped[key].orderMap[order.confirmationCode] = order._id;
  
          for (const item of order.items) {
            const id = item.product?._id || 'NO_ID';
            if (!grouped[key].itemsMap[id]) {
              grouped[key].itemsMap[id] = {
                product: item.product,
                quantity: 0
              };
            }
            grouped[key].itemsMap[id].quantity += item.quantity;
          }
        }
  
        const groupedArray = Object.values(grouped).map(group => ({
          ...group,
          items: Object.values(group.itemsMap)
        }));
  
        setGroupedOrders(groupedArray);
      })
      .catch(err => console.error('❌ Siparişler alınamadı:', err));
  }, []);
  

  const extractTrackingNumber = (url) => {
    if (url === 'İptal Edildi') return null;
    const match = url?.match(/code=(\d+)/);
    return match ? match[1] : null;
  };

  return (
    <div className={styles.orderHistory}>
      <h3>🎁 Onaylanmış Siparişler</h3>
      {groupedOrders.length === 0 ? (
        <p>Henüz siparişiniz yok.</p>
      ) : (
        groupedOrders.map((group, i) => (
          <div key={i} className={styles.orderCard}>
            {group.items.map((item, j) => {
              const product = item.product;
              return product ? (
                <div key={j} className={styles.orderProductCard}>
                  <img src={product.image} alt={product.name} />
                  <div className={styles.orderProductInfo}>
                    <h4>{product.name}</h4>
                    <p className={styles.desc}>{product.description}</p>
                    <p>Adet: <strong>{item.quantity}</strong></p>
                    <p>Fiyat: <strong>{(product.price * item.quantity).toLocaleString()} TL</strong></p>
                  </div>
                </div>
              ) : (
                <p key={j}>Ürün bilgisi bulunamadı.</p>
              );
            })}
            <div className={styles.orderMeta}>
              <div className={styles.confirmations}>
                <strong>Onay Kodları:</strong>
                {group.confirmationCodes.map((code, idx) => (
                  <div key={idx} className={styles.confirmationEntry}>
                    <code>{code}</code>

                  </div>
                ))}
              </div>
              <p><strong>Sipariş Durumu:</strong>
                {group.trackingNumber === 'İptal Edildi' ? (
                  <span style={{ color: 'red', fontWeight: 'bold' }}>İptal Edildi</span>
                ) : (
                  <a href={group.trackingNumber} target="_blank" rel="noreferrer">
                    {extractTrackingNumber(group.trackingNumber) || "Takip bağlantısı yok"}
                  </a>
                )}
              </p>
              <p><small>{new Date(group.createdAt).toLocaleString()}</small></p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}