'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Auth.module.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      // Token'ın geçerliliğini kontrol et
      validateToken();
    }
  }, [token]);

  const validateToken = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/validate-reset-token/${token}`);
      const data = await res.json();
      
      if (!res.ok) {
        setStatus('error');
        setMessage('Bu bağlantı geçersiz veya süresi dolmuş.');
        setIsValidToken(false);
      } else {
        setIsValidToken(true);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Token doğrulaması sırasında bir hata oluştu.');
      setIsValidToken(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Şifreler eşleşmiyor.');
      return;
    }    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,16}$/;
    if (!passwordRegex.test(password)) {
      setStatus('error');
      setMessage('Şifre geçersiz: 1 büyük, 1 küçük harf ve 6-16 karakter olmalı.');
      return;
    }
    
    console.log('Şifre sıfırlama isteği gönderiliyor, token:', token);

    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await res.json();
      
      if (res.ok) {
        setStatus('success');
        setMessage('Şifreniz başarıyla değiştirildi. Yönlendiriliyorsunuz...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Şifre değiştirilemedi. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
    }
  };

  if (!isValidToken) {
    return (
      <div className={styles['auth-form']}>
        <h2>Şifre Sıfırlama</h2>
        <p className={`${styles.message} ${styles.error}`}>{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles['auth-form']}>
      <h2>Yeni Şifre Belirleme</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Yeni şifre"
        required
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Yeni şifre (tekrar)"
        required
      />
      <button type="submit">Şifreyi Değiştir</button>
      {message && (
        <p className={`${styles.message} ${styles[status]}`}>
          {message}
        </p>
      )}
    </form>
  );
}
