import { useState } from 'react';
import styles from '@/styles/ProfilePage.module.css';

export function PasswordChange() {
  const [form, setForm] = useState({ current: '', newPass: '' });
  const [msg, setMsg] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePasswordChange = () => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,16}$/;
    if (!regex.test(form.newPass)) {
      setMsg('Zayıf şifre! En az 6-16 karakter, B/K harf ve sembol içermeli.');
      return;
    }
    alert('Backend şifre değişim entegrasyonu eklenecek.');
    setMsg('Yeni şifre başarıyla kaydedildi.');
  };

  return (
    <div className={styles['profile-section']}>
      <h3>Şifre Değiştir</h3>
      <input name="current" type="password" placeholder="Mevcut Şifre" onChange={handleChange} />
      <input name="newPass" type="password" placeholder="Yeni Şifre" onChange={handleChange} />
      <button onClick={handlePasswordChange}>Güncelle</button>
      <p>{msg}</p>
    </div>
  );
}
