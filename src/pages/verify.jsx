// src/pages/verify.jsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function VerifyPage() {
  const router = useRouter();
  const { token, email } = router.query;
  const [message, setMessage] = useState('Doğrulama yapılıyor...');

  useEffect(() => {
    if (!token || !email) return;

    const verifyUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/verify?token=${token}&email=${email}`);
        const text = await res.text();
        setMessage(text);
        if (res.status === 200) {
          setTimeout(() => router.push('/login'), 3000); // 3 saniye sonra giriş sayfasına yönlendir
        }
      } catch (err) {
        setMessage('Doğrulama sırasında hata oluştu.');
      }
    };

    verifyUser();
  }, [token, email]);

  return (
    <div style={{ padding: '3rem', textAlign: 'center' }}>
      <h2>{message}</h2>
    </div>
  );
}
