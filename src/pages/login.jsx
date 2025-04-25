'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Auth.module.css';

export default function Login() {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('http://13.53.182.174:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setMessage(data.message);

    if (res.status === 200) {
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles['auth-form']}>
      <h2>Giriş Yap</h2>
      <input name="identifier" placeholder="Email veya Telefon" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Şifre" onChange={handleChange} required />
      <button type="submit">Giriş Yap</button>
      <p>{message}</p>
    </form>
  );
}
