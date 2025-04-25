import { useEffect, useState } from 'react';
import styles from '@/styles/ProfilePage.module.css';

export function ProfileInfo() {
  const [storedUser, setStoredUser] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setStoredUser(user);
        setForm({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || ''
        });
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!storedUser || !storedUser._id) {
      setMessage('Kullanıcı bilgisi eksik veya oturum geçersiz ❌');
      return;
    }

    try {
      const res = await fetch(`https://api.sakaoglustore.net/api/user/update-profile/${storedUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone
        })
      });

      const data = await res.json();
      if (res.ok) {
        const updatedUser = {
          ...storedUser,
          firstName: data.updatedUser.firstName,
          lastName: data.updatedUser.lastName,
          phone: data.updatedUser.phone
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setStoredUser(updatedUser);
        setMessage('Bilgiler başarıyla güncellendi ✅');
      } else {
        setMessage(data.message || 'Güncelleme başarısız ❌');
      }
    } catch (err) {
      console.error('Update error:', err);
      setMessage('Sunucu hatası ❌');
    }
  };

  return (
    <div className={styles['profile-section']}>
      <h3>Bilgilerim</h3>
      <input
        type="text"
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
        placeholder="Ad"
      />
      <input
        type="text"
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        placeholder="Soyad"
      />
      <input
        type="email"
        name="email"
        value={form.email}
        placeholder="Email"
        disabled
      />
      <input
        type="text"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Telefon"
      />
      <button className={styles['update-btn']} onClick={handleUpdate}>
        Güncelle
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
