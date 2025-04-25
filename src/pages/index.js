import Head from 'next/head';
import ProductList from '@/components/ProductList';

export default function Home() {
  return (
    <>
      <Head>
        <title>SakaogluStore - Hediye Kutuları</title>
        <meta name="description" content="En güzel hediye kutularını SakaogluStore'da keşfedin." />
      </Head>
      <div className="home-container">
        <ProductList category="Gift Box" />
      </div>
    </>
  );
}