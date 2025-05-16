"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Checkout.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { total, addressId } = router.query;

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    let value = e.target.value;
    
    // Kart numarası formatlaması
    if (e.target.name === 'cardNumber') {
      value = value.replace(/\s/g, '')
                   .replace(/(\d{4})/g, '$1 ')
                   .trim();
    }
    
    // Son kullanma tarihi formatlaması
    if (e.target.name === 'expiry') {
      value = value.replace(/\D/g, '')
                   .replace(/(\d{2})(\d{2})/, '$1/$2');
    }

    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Burada gerçek ödeme işlemi yapılacak
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simüle edilmiş işlem
      
      // Başarılı ödeme sonrası
      router.push('/success');
    } catch (error) {
      alert('Ödeme işlemi sırasında bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <h1>Ödeme Bilgileri</h1>
      <div className={styles.totalAmount}>
        <h2>Toplam Tutar: {total} TL</h2>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.checkoutForm}>
        <div className={styles.formGroup}>
          <label>Kart Numarası</label>
          <input
            type="text"
            name="cardNumber"
            placeholder="0000 0000 0000 0000"
            value={formData.cardNumber}
            onChange={handleChange}
            maxLength="19"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Kart Üzerindeki İsim</label>
          <input
            type="text"
            name="cardHolder"
            placeholder="AD SOYAD"
            value={formData.cardHolder}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Son Kullanma Tarihi</label>
            <input
              type="text"
              name="expiry"
              placeholder="AA/YY"
              value={formData.expiry}
              onChange={handleChange}
              maxLength="5"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>CVV</label>
            <input
              type="text"
              name="cvv"
              placeholder="***"
              value={formData.cvv}
              onChange={handleChange}
              maxLength="3"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
        </button>
      </form>
    </div>
  );
}