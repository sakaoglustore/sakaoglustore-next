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

    const res = await fetch('https://api.sakaoglustore.net/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.status === 201) {
      const loginRes = await fetch('https://api.sakaoglustore.net/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: form.email, password: form.password })
      });

      const loginData = await loginRes.json();
      if (loginRes.status === 200) {
        localStorage.setItem('user', JSON.stringify(loginData.user));
        router.push('/');
      } else {
        setMessage(loginData.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles['auth-form']}>
      <h2>Kayıt Ol</h2>
      <input name="firstName" placeholder="Ad" onChange={handleChange} required />
      <input name="lastName" placeholder="Soyad" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="phone" placeholder="Telefon" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Şifre" onChange={handleChange} required />
      <button type="submit">Kayıt Ol</button>
      <p>{message}</p>
    </form>
  );
}