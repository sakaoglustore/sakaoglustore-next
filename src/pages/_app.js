import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import ChatBot from '@/components/ChatBot'; // ⬅️ ekledik

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <ChatBot /> {/* ⬅️ sabit olarak tüm sayfalarda gözükecek */}
    </>
  );
}
