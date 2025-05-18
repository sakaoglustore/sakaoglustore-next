'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Auth.module.css';

export default function Login() {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        // ✅ identifier doğrudan e-posta olarak kullanılır
        const userInfoRes = await fetch(`http://localhost:5000/api/user/by-email/${form.identifier}`);
        const userInfo = await userInfoRes.json();

        if (userInfo?.user) {
          localStorage.setItem('user', JSON.stringify(userInfo.user));
          router.push('/');
        } else {
          setMessage('Kullanıcı verileri alınamadı.');
        }
      } else {
        setMessage(data.message || 'Giriş başarısız.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage('Bir hata oluştu.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles['auth-form']}>
      <h2>Giriş Yap</h2>      <input
        name="identifier"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Şifre"
        onChange={handleChange}
        required      />
      <button type="submit">Giriş Yap</button>
      <p>{message}</p>
      <div className={styles.authLinks}>
        <a href="/signup">Kayıt Ol</a>
        <span> | </span>
        <a href="/forgot-password">Şifremi Unuttum</a>
      </div>
    </form>
  );
}
