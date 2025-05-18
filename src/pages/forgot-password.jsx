'use client';
import { useState } from 'react';
import styles from '@/styles/Auth.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(''); // 'success' veya 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      
      if (res.ok) {
        setStatus('success');
        setMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen kontrol edin.');
      } else {
        setStatus('error');
        setMessage(data.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles['auth-form']}>
      <h2>Şifremi Unuttum</h2>
      <p className={styles.formInfo}>
        E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-posta adresiniz"
        required
      />
      <button type="submit">Şifre Sıfırlama Bağlantısı Gönder</button>
      {message && (
        <p className={`${styles.message} ${styles[status]}`}>
          {message}
        </p>
      )}
      <div className={styles.authLinks}>
        <a href="/login">Giriş Yap</a>
        <span> | </span>
        <a href="/signup">Kayıt Ol</a>
      </div>
    </form>
  );
}
