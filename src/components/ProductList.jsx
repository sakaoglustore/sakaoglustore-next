
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/ProductList.module.css';

export default function ProductList({ category }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5000/api/gifts/all')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id || user?._id;
    if (userId) {
      fetch(`http://localhost:5000/api/cart/${userId}`)
        .then(res => res.json())
        .then(data => {
          const qtyMap = {};
          data.forEach(item => {
            qtyMap[item.productId._id] = item.quantity;
          });
          setCart(qtyMap);
        })
        .catch(err => console.error('Cart Fetch Error:', err));
    }
  }, [category]);

  const updateCart = (productId, newQty) => {
    const updated = { ...cart };
    if (newQty <= 0) delete updated[productId];
    else updated[productId] = newQty;
    setCart(updated);

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?._id || user?.id;

    if (!userId || !productId) {
      console.error('❌ Eksik userId veya productId');
      return;
    }

    fetch('http://localhost:5000/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, quantity: newQty })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) console.log('✅ Sepet Güncellendi:', data.message);
      })
      .catch(err => console.error('❌ Sepet Güncellenemedi:', err));
  };

  const calculateFullPrice = (p) => {
    const price = Number(p.price || 0);
    const kdv = Number(p.kdvOrani || 0);
    const kutuUcreti = Number(p.kutuUcreti || 0);
    const kargoUcreti = Number(p.kargoUcreti || 0);
    return price + price * kdv + kutuUcreti + kargoUcreti;
  };

  return (
    <div className={styles.productList || 'product-list'}>
      <h2>{category} Kategorisindeki Ürünler</h2>
      <div className={styles.products || 'products'}>
        {products.map(p => {
          const qty = cart[p._id] || 0;
          const unitPrice = calculateFullPrice(p);
          const totalPrice = unitPrice * qty;

          return (
            <div className={styles.productCard || 'product-card'} key={p._id}>
              <img src={p.image} alt={p.name} />
              <h4>{p.name}</h4>
              <p>{p.description}</p>
              <p className={styles.price || 'price'}>Birim Fiyat: {unitPrice.toFixed(2)} TL</p>
              {qty > 0 && <p>Toplam: {(totalPrice).toFixed(2)} TL</p>}

              <div className={styles['quantity-control'] || 'quantity-control'}>
                <button onClick={() => updateCart(p._id, Math.max(qty - 1, 0))} disabled={qty === 0}>-</button>
                <span>{qty}</span>
                <button onClick={() => updateCart(p._id, qty + 1)}>+</button>
              </div>

              {qty > 0 ? (
                <button className={styles.buyBtn} onClick={() => router.push('/order-flow')}>
                  Sepete Git
                </button>
              ) : (
                <button className={styles.buyBtn || 'buy-btn'} onClick={() => updateCart(p._id, 1)}>
                  Sepete Ekle
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
