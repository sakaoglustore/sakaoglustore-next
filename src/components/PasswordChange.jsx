import { useState } from 'react';
import styles from '@/styles/ProfilePage.module.css';

export function PasswordChange() {
  const [form, setForm] = useState({ current: '', newPass: '' });
  const [msg, setMsg] = useState('');
  // Kullanıcıyı localStorage'dan çek
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('user')) : null;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePasswordChange = async () => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z]).{6,16}$/;
    if (!regex.test(form.newPass)) {
      setMsg('Zayıf şifre! En az 6-16 karakter, büyük ve küçük harf içermeli.');
      return;
    }
    if (!user) {
      setMsg('Kullanıcı bulunamadı. Lütfen tekrar giriş yap.');
      return;
    }
    setMsg(''); // eski mesajı temizle
    // Şifre değişikliği için backend'e istek at
    try {
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id || user._id,
          current: form.current,
          newPass: form.newPass
        })
      });
      const data = await res.json();
      setMsg(data.message || 'Bir hata oluştu');
    } catch (err) {
      setMsg('Sunucu hatası!');
    }
  };

  return (
    <div className={styles['profile-section']}>
      <h3>Şifre Değiştir</h3>
      <input
        name="current"
        type="password"
        placeholder="Mevcut Şifre"
        onChange={handleChange}
        value={form.current}
      />
      <input
        name="newPass"
        type="password"
        placeholder="Yeni Şifre"
        onChange={handleChange}
        value={form.newPass}
      />
      <button onClick={handlePasswordChange}>Güncelle</button>
      <p>{msg}</p>
    </div>
  );
}
