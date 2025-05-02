'use client';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [approvalCode, setApprovalCode] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setApprovalCode(params.get('code') || 'Yok');
  }, []);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>✅ Ödeme Başarılı</h1>
      <p>Onay Kodu: <strong>{approvalCode}</strong></p>
      <p>Siparişiniz başarıyla alındı. Teşekkür ederiz!</p>
    </div>
  );
}
