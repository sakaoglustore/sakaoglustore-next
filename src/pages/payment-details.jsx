'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/PaymentDetails.module.css';

export default function PaymentDetails() {
  const router = useRouter();
  const { orderId, total } = router.query;
  const [orderInfo, setOrderInfo] = useState(null);

  // Get order info if needed
  useEffect(() => {
    if (orderId) {
      // You can fetch order details here if needed
      setOrderInfo({
        id: orderId,
        total: total || '0',
      });
    }
  }, [orderId, total]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('IBAN kopyalandı!');
  };
  const copyRef =(text) => {
    navigator.clipboard.writeText(text);
    alert('Referans numarası kopyalandı!');
  }
  return (
    <div className={styles.paymentDetailsPage}>
      <div className={styles.container}>
        <h1>Ödeme Bilgileri</h1>
        
        <div className={styles.paymentCard}>
          <div className={styles.ibanSection}>
            <h2>Banka Hesap Bilgileri</h2>
            <div className={styles.ibanInfo}>
              <p><strong>Banka:</strong> X BANKASI</p>
              <p><strong>Hesap Sahibi:</strong> SAKAOGLU STORE</p>
              <div className={styles.ibanBox}>
                <span><strong>IBAN:</strong> TR00 0000 0000 0000 0000 0000 00</span>
                <button 
                  onClick={() => copyToClipboard('TR00 0000 0000 0000 0000 0000 00')}
                  className={styles.copyButton}
                >
                  Kopyala
                </button>
              </div>
            </div>
          </div>

          <div className={styles.orderInfo}>            <h2>Sipariş Özeti</h2>
            <div className={styles.ibanBox}>
              <span><strong>Referans Numarası:</strong> {orderInfo?.id}</span>
              <button 
                onClick={() => copyRef(orderInfo?.id)}
                className={styles.copyButton}
              >
                Referans Numaranızı Kopyala
              </button>
            </div>
            <p><strong>Ödenecek Tutar:</strong> {orderInfo?.total} TL</p>
          </div>

          <div className={styles.instructions}>
            <h2>Ödeme Talimatları</h2>
            <ol>
              <li>Yukarıdaki IBAN numarasına ödemeyi yapın</li>
              <li>Açıklama kısmına sadece sipariş numaranızı yazmayı unutmayın</li>
              <li>Ödemeniz kontrol edildikten sonra siparişiniz onaylanacaktır</li>
              <li>Sipariş durumunuzu "Siparişlerim" sayfasından takip edebilirsiniz</li>
            </ol>
          </div>

          <div className={styles.buttons}>
            <button 
              onClick={() => router.push('/order-history')}
              className={styles.primaryButton}
            >
              Siparişlerime Git
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
