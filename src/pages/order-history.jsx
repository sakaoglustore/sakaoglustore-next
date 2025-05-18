// src/pages/order-history.jsx
'use client';
import { useEffect, useState } from 'react';
import styles from '@/styles/OrderHistory.module.css';
import axios from 'axios';

export default function OrderHistoryPage() {
  const [pendingOrders, setPendingOrders] = useState([]); // Ödeme bekleyenler
  const [confirmedOrders, setConfirmedOrders] = useState([]); // Onaylanmış ama kargolanmamış
  const [shippedOrders, setShippedOrders] = useState([]); // Kargoya verilmiş

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
  
    const userId = user.id || user._id;
  
    axios.get(`https://api.sakaoglustore.net/api/user/orders/${userId}`)
      .then(res => {
        const orders = res.data;
        const grouped = {};
  
        for (const order of orders) {
          const key = order._id; // Her siparişi ayrı göster
          
          if (!grouped[key]) {
            grouped[key] = {
              trackingNumber: order.trackingNumber,
              confirmationCode: order.confirmationCode,
              orderMap: {},
              createdAt: order.createdAt,
              itemsMap: {},
              status: order.status,
              _id: order._id
            };
          }
  
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

        // Siparişleri üç kategoriye ayır
        const pending = groupedArray.filter(order => 
          order.status === 'pending' || order.status === 'rejected'
        );
        
        const confirmed = groupedArray.filter(order => 
          order.status === 'confirmed' && 
          order.confirmationCode && 
          (!order.trackingNumber || order.trackingNumber === '')
        );
        
        const shipped = groupedArray.filter(order => 
          order.status === 'confirmed' && 
          order.trackingNumber && 
          order.trackingNumber !== 'İptal Edildi'
        );
  
        setPendingOrders(pending);
        setConfirmedOrders(confirmed);
        setShippedOrders(shipped);
      })
      .catch(err => console.error('❌ Siparişler alınamadı:', err));
  }, []);

  const OrderCard = ({ group, isConfirmed }) => (
    <div className={`${styles.orderCard} ${isConfirmed ? styles.confirmedOrder : ''}`}>
      {group.items.map((item, j) => {
        const product = item.product;
        return product ? (
          <div key={j} className={styles.orderProductCard}>
            <img src={product.image} alt={product.name} />
            <div className={styles.orderProductInfo}>
              <h4>{product.name}</h4>
              <p className={styles.desc}>{product.description}</p>
              <p>Adet: <strong>{item.quantity}</strong></p>              <p>Toplam Fiyat: <strong>{Math.round((product.price + (product.price * (product.kdvOrani || 0)) + (product.kutuUcreti || 0) + (product.kargoUcreti || 0)) * item.quantity)} TL</strong></p>
            </div>
          </div>
        ) : (
          <p key={j}>Ürün bilgisi bulunamadı.</p>
        );
      })}
      <div className={styles.orderMeta}>
        <div className={styles.confirmations}>
          <strong>Sipariş Durumu:</strong>
          <div className={styles.confirmationEntry}>
            {group.status === 'confirmed' ? (
              <>
                <span style={{ color: 'green' }}>✓ Onaylandı</span>
                {group.confirmationCode && (
                  <div>
                    <strong>Onay Kodu: </strong>
                    <code>{group.confirmationCode}</code>
                  </div>
                )}
              </>
            ) : group.status === 'rejected' ? (
              <span style={{ color: 'red' }}>✗ Reddedildi</span>
            ) : (
              <span style={{ color: 'orange' }}>⏳ Onay Bekliyor</span>
            )}
          </div>
        </div>
        <p>
          <strong>Kargo Durumu: </strong>
          {group.trackingNumber === 'İptal Edildi' ? (
            <span style={{ color: 'red' }}>İptal Edildi</span>
          ) : group.trackingNumber ? (
            <a href={group.trackingNumber} target="_blank" rel="noopener noreferrer">
              Kargoyu Takip Et
            </a>
          ) : (
            <span>Henüz kargolanmadı</span>
          )}
        </p>
        <p><small>{new Date(group.createdAt).toLocaleString()}</small></p>
      </div>
    </div>
  );

  return (
    <div className={styles.orderHistory}>
      {pendingOrders.length === 0 && confirmedOrders.length === 0 && shippedOrders.length === 0 ? (
        <p>Henüz siparişiniz yok.</p>
      ) : (
        <>
          {pendingOrders.length > 0 && (
            <div className={styles.orderSection}>
              <h3>⏳ Ödeme Bekleyen Siparişler</h3>
              {pendingOrders.map((group, i) => (
                <OrderCard key={group._id} group={group} isConfirmed={false} />
              ))}
            </div>
          )}

          {confirmedOrders.length > 0 && (
            <div className={styles.orderSection}>
              <h3>✅ Onaylanmış Siparişler</h3>
              {confirmedOrders.map((group, i) => (
                <OrderCard key={group._id} group={group} isConfirmed={true} />
              ))}
            </div>
          )}

          {shippedOrders.length > 0 && (
            <div className={styles.orderSection}>
              <h3>📦 Kargoya Verilmiş Siparişler</h3>
              {shippedOrders.map((group, i) => (
                <OrderCard key={group._id} group={group} isConfirmed={true} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}