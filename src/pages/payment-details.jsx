// src/pages/payment-details.jsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/PaymentDetails.module.css';

export default function PaymentDetails() {
  const router = useRouter();
  const { orderId, total } = router.query;
  const [orderInfo, setOrderInfo] = useState({ id: '', total: '0.00' });

  useEffect(() => {
    // Hem orderId hem total varsa, total'i düzgün formatla
    if (orderId) {
      let shownTotal = total;
      if (!shownTotal || isNaN(Number(shownTotal))) shownTotal = "0.00";
      else shownTotal = Number(shownTotal).toFixed(2);

      setOrderInfo({
        id: orderId,
        total: shownTotal,
      });
    }
  }, [orderId, total]);


  const copyName = (text) => {
    navigator.clipboard.writeText(text);
    alert('Alıcı ismi kopyalandı!');
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('IBAN kopyalandı!');
  };
  const copyRef = (text) => {
    navigator.clipboard.writeText(text);
    alert('Referans numarası kopyalandı!');
  };

  return (
    <div className={styles.paymentDetailsPage}>
      <div className={styles.container}>
        <h1>Ödeme Bilgileri</h1>
        <div className={styles.paymentCard}>
          {/* BANKA */}
          <div className={styles.ibanSection}>
            <h2>Banka Hesap Bilgileri</h2>
            <div className={styles.ibanInfo}>
              <p><strong>Banka:</strong> Vakıfbank</p>
              <div className={styles.ibanBox}>
                <span><strong>İsim:</strong> Mates e-ticaret limited şirketi</span>
                <button
                  onClick={() => copyName('Mates e-ticaret limited şirketi')}
                  className={styles.copyButton}
                >
                  Kopyala
                </button>
                <span><strong>IBAN:</strong> TR31 0001 5001 5800 7324 3802 41</span>
                <button
                  onClick={() => copyToClipboard('TR31 0001 5001 5800 7324 3802 41')}
                  className={styles.copyButton}
                >
                  Kopyala
                </button>
              </div>
            </div>
          </div>
          {/* SİPARİŞ ÖZETİ */}
          <div className={styles.orderInfo}>
            <h2>Sipariş Özeti</h2>
            <div className={styles.ibanBox}>
              <span><strong>Referans Numarası:</strong> {orderInfo.id}</span>
              <button
                onClick={() => copyRef(orderInfo.id)}
                className={styles.copyButton}
              >
                Referans Numaranızı Kopyala
              </button>
            </div>
            <p><strong>Ödenecek Tutar:</strong> {orderInfo.total} TL</p>
          </div>
          {/* TALİMATLAR */}
          <div className={styles.instructions}>
            <h2>Ödeme Talimatları</h2>
            <ol>
              <li>Yukarıdaki IBAN numarasına ödemeyi yapın</li>
              <li>Açıklama kısmına sadece referans numaranızı yazmayı unutmayın</li>
              <li>Ödemeniz kontrol edildikten sonra siparişiniz onaylanacaktır</li>
              <li>Sipariş durumunuzu "Siparişlerim" sayfasından takip edebilirsiniz</li>
            </ol>
          </div>
          {/* BUTTON */}
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
