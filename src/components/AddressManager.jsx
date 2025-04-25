import { useEffect, useState } from 'react';
import styles from '@/styles/ProfilePage.module.css';

export function AddressManager() {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ title: '', fullAddress: '' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser);
      setAddresses(storedUser?.addresses || []);
    }
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`http://13.53.182.174:5000/api/user/addresses/${user.id}`);
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
  }, [user?.id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const openAddPopup = () => {
    setForm({ title: '', fullAddress: '' });
    setEditIndex(null);
    setPopupOpen(true);
  };

  const openEditPopup = (index) => {
    setForm(addresses[index]);
    setEditIndex(index);
    setPopupOpen(true);
  };

  const saveAddress = async () => {
    if (!form.title || !form.fullAddress || !user?.id) return;

    const url = editIndex !== null
      ? `http://13.53.182.174:5000/api/user/address/update/${user.id}/${editIndex}`
      : `http://13.53.182.174:5000/api/user/address/add/${user.id}`;

    const method = editIndex !== null ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (res.ok) updateUser(data.addresses);
    setPopupOpen(false);
  };

  const deleteAddress = async (index) => {
    if (!user?.id) return;
    const res = await fetch(`http://13.53.182.174:5000/api/user/address/delete/${user.id}/${index}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (res.ok) updateUser(data.addresses);
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
            <textarea name="fullAddress" placeholder="Adres" value={form.fullAddress} onChange={handleChange} />
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
