import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styles from '@/styles/SingleProduct.module.css';

export default function SingleProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeSlide, setActiveSlide] = useState(0);
  const [isExplanationsOpen, setIsExplanationsOpen] = useState(false);
  const [activeExplanation, setActiveExplanation] = useState(0);

  const explanations = [
    {
      title: "Sakaoğlu Store Gizemli Kutu etkinliği / yarışması 🎁",
      content: `( Taklitlerimizden kaçının, yurtdışı veya yurt içinde yapıldığı gibi 2. El ürün, aparat, ihtiyaca dayalı olmayan ürünler veya boş kutu yoktur. )

      Gizemli kutu, hiçbir alıcıya zarar ettirmez. Sizlerin yoğun Talepleri sayesinde toptan ürün tedariğinde çok ucuz miktarlara stok alabiliyor ve sizlere bol hediyeler dağıtabiliyoruz.
      
      Katılım gösterenler, minimum olarak ödedikleri ücrete eş değer bir ürün ile kesin karşılaşırken,
      
      sipariş verenlerden her 
      10 Kişide 1 kişi, 2 kat değerde bir ürün ile karşılaşır.
      Her 400 siparişte 1 kişi 10 kat değerde bir ürün ile karşılaşır.
      Her 2.000 siparişte 1 kişi 100 kat değerde bir ürün ile karşılaşır.
      
      Mates e-ticaret limited şirketi
      ( Marka, Sakaoğlu Store, tek yetkili şirket sahibi ve yönetim kurulu başkanı Murat Sakaoğlu)`
    },
    {
      title: "YERLİ ÜRETİM 🇹🇷",
      content: `Gizemli Kutu gelirleri ile Sakaoğlu Store çatısında A'dan Z'ye yerli üretim yapıyor veya yapmak isteyen kişi veya kurumlara, tanıtım, pazar alanı, geliştirme vb teşvikler sağlanır.

      Tüm yerli üreticiler, müşteri bilgilerinin kısıtlı ve güvenli gözüktüğü hali ile ( şirket hesap hareketlerini ) aylık, tüm gelir ve gider ekstresi olarak, Her ay Dekont Takip grubunda paylaşmalıdır.
      
      Denetmenler, ayrıca hediyelendirilir, oylamalar sonucu ikramiyeler kazanabilir, teftiş ile doğru tespitleri sonucunda mükafat kazancı sağlayabilirler.`
    }
  ];

  useEffect(() => {
    if (id) {
      fetch(`https://api.sakaoglustore.net/api/gifts/${id}`)
        .then(res => res.json())
        .then(data => setProduct(data))
        .catch(err => console.error('Ürün yüklenirken hata:', err));
    }
  }, [id]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        router.push('/login');
        return;
      }

      const response = await fetch('https://api.sakaoglustore.net/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          productId: product._id,
          quantity
        })
      });

      if (response.ok) {
        router.push('/order-flow');
      }
    } catch (error) {
      console.error('Sepete eklenirken hata:', error);
    }
  };

  if (!product) return <div className={styles.loading}>Yükleniyor...</div>;

  const calculateTotalPrice = (p) => {
    const price = Number(p.price || 0);
    const kdv = Number(p.kdvOrani || 0);
    const kutuUcreti = Number(p.kutuUcreti || 0);
    const kargoUcreti = Number(p.kargoUcreti || 0);
    return price + (price * kdv) + kutuUcreti + kargoUcreti;
  };

  const totalPrice = calculateTotalPrice(product);

  return (
    <div className={styles.productPage}>
      <div className={styles.productContainer}>
        <div className={styles.imageSection}>
          <img src={product.image} alt={product.name} />
        </div>
        <div className={styles.infoSection}>
          <h1>{product.name}</h1>
          
          <div className={styles.price}>
            {totalPrice.toFixed(2)} TL
          </div>

          <div className={styles.priceDetails}>
            <p><span>KDV:</span> <span>{(product.price * (product.kdvOrani || 0)).toFixed(2)} TL</span></p>
            <p><span>Kutu Ücreti:</span> <span>{product.kutuUcreti || 0} TL</span></p>
            <p><span>Kargo Ücreti:</span> <span>{product.kargoUcreti || 0} TL</span></p>
          </div>

          <div className={styles.quantityControl}>
            <button onClick={() => handleQuantityChange(-1)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantityChange(1)}>+</button>
          </div>

          <button className={styles.addToCartBtn} onClick={handleAddToCart}>
            Sepete Ekle
          </button>

          <div className={styles.accordion}>
            <button 
              className={`${styles.accordionButton} ${isExplanationsOpen ? styles.active : ''}`}
              onClick={() => setIsExplanationsOpen(!isExplanationsOpen)}
            >
              Açıklamalar {isExplanationsOpen ? '▼' : '▶'}
            </button>
            
            {isExplanationsOpen && (
              <div className={styles.accordionContent}>
                <div className={styles.explanationTabs}>
                  {explanations.map((exp, index) => (
                    <button
                      key={index}
                      className={`${styles.explanationTab} ${activeExplanation === index ? styles.active : ''}`}
                      onClick={() => setActiveExplanation(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <div className={styles.explanationContent}>
                  <h3>{explanations[activeExplanation].title}</h3>
                  {explanations[activeExplanation].content.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph.trim()}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.possibleItems}>
          <h3>Neler Çıkabilir?</h3>
          <ul>
            <li>Bluetooth kulaklık</li>
            <li>Akıllı saat</li>
            <li>Hoparlör</li>
            <li>Macbook</li>
            <li>iPhone serileri</li>
            <li>Kamp çadırı</li>
            <li>Blender</li>
            <li>Airpods</li>
            <li>Tablet</li>
            <li>Airfryer</li>
            <li>Drone</li>
            <li>Apple vision pro</li>
            <li>Game box</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
