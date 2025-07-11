// AddressManager.jsx
'use client';
import { useEffect, useState } from 'react';
import styles from '@/styles/ProfilePage.module.css';

export function AddressManager() {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ title: '', city: '', district: '', fullAddress: '', phone: '' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser);
      setAddresses(storedUser?.addresses || []);
    }
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?._id) return;
      try {
        const res = await fetch(`https://api.sakaoglustore.net/api/user/addresses/${user._id}`);
        const data = await res.json();
        if (res.ok) {
          setAddresses(data.addresses);
          const updatedUser = { ...user, addresses: data.addresses };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      } catch (err) {
        console.error('Adresler alınamadı:', err);
      }
    };

    fetchAddresses();
  }, [user?._id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const openAddPopup = () => {
    setForm({ title: '', city: '', district: '', fullAddress: '' });
    setEditIndex(null);
    setPopupOpen(true);
  };

  const openEditPopup = (index) => {
    const addr = addresses[index];
    setForm({
      title: addr.title || '',
      city: addr.city || '',
      district: addr.district || '',
      fullAddress: addr.fullAddress || '',
      phone: addr.phone || ''
    });
    setEditIndex(index);
    setPopupOpen(true);
  };

  const saveAddress = async () => {
    if (!form.title || !form.city || !form.district || !form.fullAddress || !user?._id) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }
    const phoneRegex = /^5\d{2}\s?\d{3}\s?\d{4}$/;

    if (!phoneRegex.test(form.phone)) {
      alert('Telefon numarası 5xx xxx xxxx formatında olmalıdır (başında sıfır yok).');
      return;
    }

    const url = editIndex !== null
      ? `https://api.sakaoglustore.net/api/user/address/update/${user._id}/${editIndex}`
      : `https://api.sakaoglustore.net/api/user/address/add/${user._id}`;

    const method = editIndex !== null ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (res.ok) updateUser(data.addresses);
    else alert(data.message || 'İşlem başarısız.');
    setPopupOpen(false);
  };

  const deleteAddress = async (index) => {
    if (!user?._id) return;
    const res = await fetch(`https://api.sakaoglustore.net/api/user/address/delete/${user._id}/${index}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (res.ok) updateUser(data.addresses);
    else alert(data.message || 'Silinemedi.');
  };

  const updateUser = (updatedAddresses) => {
    const updatedUser = { ...user, addresses: updatedAddresses };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setAddresses(updatedAddresses);
  };

  return (
    <div className={styles['profile-section']}>
      <h3>Adreslerim</h3>
      {addresses.map((addr, i) => (
        <div key={i} className={styles['address-item']}>
          <strong>{addr.title}</strong><br />
          {addr.city}, {addr.district}<br />
          {addr.fullAddress}
          <div className={styles['btn-group']}>
            <button onClick={() => openEditPopup(i)}>Düzenle</button>
            <button onClick={() => deleteAddress(i)}>Sil</button>
          </div>
        </div>
      ))}
      <button onClick={openAddPopup}>Yeni Adres Ekle</button>

      {popupOpen && (
        <div className={styles['popup']}>
          <div className={styles['popup-content']}>
            <h3>{editIndex !== null ? 'Adres Düzenle' : 'Yeni Adres Ekle'}</h3>
            <input name="title" placeholder="Başlık (Ev/İş)" value={form.title} onChange={handleChange} />
            <input name="city" placeholder="İl" value={form.city} onChange={handleChange} />
            <input name="district" placeholder="İlçe" value={form.district} onChange={handleChange} />
            <textarea name="fullAddress" placeholder="Adres" value={form.fullAddress} onChange={handleChange} />
            <input
              name="phone"
              placeholder="Telefon (5xx xxx xxxx)"
              value={form.phone}
              onChange={handleChange}
            />
            <div className={styles['popup-actions']}>
              <button onClick={saveAddress}>Kaydet</button>
              <button onClick={() => setPopupOpen(false)}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
