import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import ChatBot from '@/components/ChatBot';
import Footer from '@/components/Footer'; // Footer bileşenini dahil ediyoruz

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <main>
        <Component {...pageProps} />
      </main>
      <ChatBot />
      <Footer />
    </>
  );
}
