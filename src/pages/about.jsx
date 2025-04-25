// src/pages/about.jsx
import Head from 'next/head';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '1rem' }}>
      <Head>
        <title>Hakkımızda - SakaogluStore</title>
        <meta name="description" content="SakaogluStore hakkında daha fazla bilgi edinin." />
      </Head>
      <h1>Hakkımızda</h1>
      <p>
        SakaogluStore, kullanıcılarına benzersiz sürpriz hediye kutuları sunan yenilikçi bir alışveriş platformudur.
        Müşteri memnuniyetini en üst düzeyde tutmayı hedefleyen ekibimiz, her bir ürünü özenle seçer ve kullanıcı deneyimini
        sürekli geliştirir.
      </p>
      <p>
        Misyonumuz, insanlara sevdiklerine özel sürprizler yapmanın mutluluğunu yaşatmaktır. İster doğum günü olsun, ister
        özel bir kutlama, SakaogluStore her zaman yanınızda.
      </p>
    </div>
  );
}
