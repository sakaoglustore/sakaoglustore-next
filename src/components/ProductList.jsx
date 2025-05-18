'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/ProductList.module.css';

export default function ProductList({ category }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5000/api/gifts/all')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Product Fetch Error:', err));

    const user = JSON.parse(localStorage.getItem('user'));
    const id = user?.id || user?._id;
    if (id) {
      setUserId(id);
      fetch(`http://localhost:5000/api/cart/${id}`)
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
    if (!userId) {
      setShowLoginPopup(true);
      return;
    }

    const updated = { ...cart };
    if (newQty <= 0) delete updated[productId];
    else updated[productId] = newQty;
    setCart(updated);

    fetch('http://localhost:5000/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, quantity: newQty })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) console.log('Sepet Güncellendi:', data.message);
      })
      .catch(err => console.error('Sepet Güncellenemedi:', err));
  };

  const calculateFullPrice = (p) => {
    const price = Number(p.price || 0);
    const kdv = Number(p.kdvOrani || 0);
    const kutuUcreti = Number(p.kutuUcreti || 0);
    const kargoUcreti = Number(p.kargoUcreti || 0);
    return price + price * kdv + kutuUcreti + kargoUcreti;
  };

  const closePopup = () => setShowLoginPopup(false);
  const goToProductDetail = (productId) => {
    router.push(`/product/${productId}`);
  };

  return (
    <div className={styles.productList}>
      <h2>{category} Kategorisindeki Ürünler</h2>
      <div className={styles.products}>
        {products.map(p => {
          const qty = cart[p._id] || 0;
          const unitPrice = calculateFullPrice(p);
          const totalPrice = unitPrice * qty;

          return (
            <div
              key={p._id}
              className={styles.productCard}
              onMouseEnter={() => setHoveredProduct(p._id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div 
                className={styles.productInfo} 
                onClick={() => goToProductDetail(p._id)}
              >                <img src={p.image} alt={p.name} />
                <h4>{p.name}</h4>
                <p className={styles.price}>Birim Fiyat: {Math.round(unitPrice)} TL</p>
                <p>Görsele tıkla ve neler çıkabilir gör!</p>
                {qty > 0 && <p>Toplam: {Math.round(totalPrice)} TL</p>}
              </div>

              <div className={styles.quantityControl}>
                <button onClick={() => updateCart(p._id, Math.max(qty - 1, 0))} disabled={qty === 0}>-</button>
                <span>{qty}</span>
                <button onClick={() => updateCart(p._id, qty + 1)}>+</button>
              </div>

              {qty > 0 ? (
                <button className={styles.buyBtn} onClick={() => router.push('/order-flow')}>
                  Sepete Git
                </button>
              ) : (
                <button className={styles.buyBtn} onClick={() => updateCart(p._id, 1)}>
                  Sepete Ekle
                </button>
              )}

              {hoveredProduct === p._id && (
                <div className={styles.productHoverInfo}>
                  <h4>Neler çıkabilir?</h4>
                  <ul>
                    {p.whatInside
                      ? p.whatInside.split(',').map((item, idx) => (
                          <li key={idx}>{item.trim()}</li>
                        ))
                      : <li>Bilgi bulunamadı</li>}
                  </ul>
                  <p>ürünlerinden bir tanesi ile kesin karşılaşırsınız</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h3>Ürün eklemek için giriş yapmalısınız</h3>
            <p>Hesabınız var mı?{' '}
              <span onClick={() => router.push('/login')} className={styles.link}>Giriş Yap</span> |{' '}
              <span onClick={() => router.push('/signup')} className={styles.link}>Kayıt Ol</span>
            </p>
            <button onClick={closePopup} className={styles.closeBtn}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
}
