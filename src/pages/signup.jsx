// src/pages/signup.jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Auth.module.css';

export default function Signup() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: ''
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    const allFieldsFilled = Object.values(form).every(field => field.trim() !== '');
    if (!allFieldsFilled) return setMessage('Lütfen tüm alanları doldurun.');
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,16}$/;
    if (!passwordRegex.test(form.password)) {
      return setMessage('Şifre geçersiz: 1 büyük, 1 küçük harf ve 6-16 karakter olmalı.');
    }
    
    // Telefon numarası doğrulama
    const phoneRegex = /^5[0-9]{9}$/;
    if (!phoneRegex.test(form.phone)) {
      return setMessage('Telefon numarası geçersiz: 5 ile başlamalı ve 10 haneli olmalı.');
    }

    const res = await fetch('https://api.sakaoglustore.net/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    setMessage(data.message);
    setIsSuccess(res.status === 201);

    if (res.status === 201) {
      setTimeout(() => {
        router.push('/login');
      }, 4000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles['auth-form']}>
      <h2>Kayıt Ol</h2>      <input name="firstName" placeholder="Ad" onChange={handleChange} required />
      <input name="lastName" placeholder="Soyad" onChange={handleChange} required />
      <input name="email" placeholder="Email (Büyük ve küçük harf e dikkat ediniz)" onChange={handleChange} required />
      <input 
        name="phone" 
        placeholder="5555555555 (+90 ya da 0 koymayınız)" 
        onChange={(e) => {
          // Sadece rakam girilmesine izin ver
          const value = e.target.value.replace(/[^0-9]/g, '');
          // İlk karakterin 5 olduğundan emin ol
          if (value && value.charAt(0) !== '5') {
            setForm({ ...form, phone: '5' + value.substring(value.charAt(0) === '5' ? 1 : 0) });
          } else {
            setForm({ ...form, phone: value });
          }
        }} 
        value={form.phone}
        maxLength={10}
        required 
      />
      <input name="password" type="password" placeholder="Şifre" onChange={handleChange} required />
      <button type="submit">Kayıt Ol</button>
      
      {message && (
        <div className={`${styles.message} ${isSuccess ? styles.success : styles.error}`}>
          {isSuccess ? (
            <p className={styles.successMessage}>{message}</p>
          ) : (
            <p>{message}</p>
          )}
        </div>
      )}
    </form>
  );
}