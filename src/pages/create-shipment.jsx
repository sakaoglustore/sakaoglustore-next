'use client';
import { useState } from 'react';

export default function CreateShipment() {
  const [form, setForm] = useState({
    cargoKey: '',
    invoiceKey: '',
    receiverName: '',
    receiverAddress: '',
    receiverPhone: '',
    cityName: '',
    townName: '',
    email: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('https://api.sakaoglustore.net/api/shipment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Kargo oluşturuldu ve mail gönderildi.');
      } else {
        setMessage('❌ Hata: ' + data.message);
      }
    } catch (err) {
      setMessage('❌ Bir hata oluştu.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
      <h2>Kargo Oluştur</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="cargoKey" placeholder="Kargo Kodu" onChange={handleChange} required />
        <input type="text" name="invoiceKey" placeholder="Fatura No" onChange={handleChange} required />
        <input type="text" name="receiverName" placeholder="Alıcı Adı" onChange={handleChange} required />
        <input type="text" name="receiverAddress" placeholder="Adres" onChange={handleChange} required />
        <input type="text" name="receiverPhone" placeholder="Telefon" onChange={handleChange} required />
        <input type="text" name="cityName" placeholder="Şehir" onChange={handleChange} required />
        <input type="text" name="townName" placeholder="İlçe" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <button type="submit" style={{ marginTop: '1rem' }}>Gönderi Oluştur</button>
      </form>
      {message && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}
