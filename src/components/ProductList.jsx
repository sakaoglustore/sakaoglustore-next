'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/ProductList.module.css'; // Eğer CSS varsa bunu da oluştururuz

export default function ProductList({ category }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetch(`https://api.sakaoglustore.net/api/gifts/all`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    if (userId) {
      fetch(`https://api.sakaoglustore.net/api/cart/${userId}`)
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

  const updateCart = (id, newQty) => {
    const updated = { ...cart };
    if (newQty <= 0) delete updated[id];
    else updated[id] = newQty;
    setCart(updated);

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    if (userId) {
      fetch('https://api.sakaoglustore.net/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId: id, quantity: newQty })
      })
        .then(res => res.json())
        .then(() => console.log('Sepet Güncellendi ✅'))
        .catch(err => console.error('Sepet Hata:', err));
    }
  };

  return (
    <div className={styles.productList || 'product-list'}>
      <h2>{category} Kategorisindeki Ürünler</h2>
      <div className={styles.products || 'products'}>
        {products.map(p => {
          const qty = cart[p._id] || 0;
          return (
            <div className={styles.productCard || 'product-card'} key={p._id}>
              <img src={p.image} alt={p.name} />
              <h4>{p.name}</h4>
              <p>{p.description}</p>
              <p className={styles.price || 'price'}>{p.price} TL</p>

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
