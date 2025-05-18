'use client';
import { useState } from 'react';
import styles from '@/styles/ChatBot.module.css';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Merhaba! Size nasıl yardımcı olabilirim? Aşağıdaki sorulardan birini seçebilirsiniz:',
      options: [
        'Sipariş verdim ama ürünüm gelmedi',
        'Kutudan ne çıkıyor?',
        'İade veya değişim yapabilir miyim?',
        'Sakaoğlu Store Gizemli Kutusu neden zarar ettirmez?'
      ],
      clickable: true
    }
  ]);  const scrollToLatestAnswer = () => {
    setTimeout(() => {
      const messagesDiv = document.querySelector(`.${styles.messages}`);
      if (messagesDiv) {
        const scrollHeight = messagesDiv.scrollHeight;
        const height = messagesDiv.clientHeight;
        const maxScroll = scrollHeight - height;
        messagesDiv.scrollTo({
          top: maxScroll / 2,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const addInitialOptions = () => {
    return {
      from: 'bot',
      text: 'Başka bir konuda yardım edebilir miyim?',
      options: [
        'Sipariş verdim ama ürünüm gelmedi',
        'Kutudan ne çıkıyor?',
        'İade veya değişim yapabilir miyim?',
        'Sakaoğlu Store Gizemli Kutusu neden zarar ettirmez?'
      ],
      clickable: true
    };
  };

  const handleOptionClick = (option) => {
    setMessages(prev => [...prev, { from: 'user', text: option }]);

    if (option === 'Sipariş verdim ama ürünüm gelmedi') {
      setMessages(prev => [...prev, {
        from: 'bot',
        text: '📦 Siparişiniz 2-5 iş günü içinde teslim edilmediyse, destek@sakaoglustore.net adresine mail atabilirsiniz.'
      }, addInitialOptions()]);
    } else if (option === 'Kutudan ne çıkıyor?') {
      setMessages(prev => [...prev, {
        from: 'bot',
        text: '🎁 Bluetooth kulaklık, akıllı saat, hoparlör, macbook, iphone serileri, kamp çadırı, blender, airpods, tablet, airfryer, drone, apple vision pro, game box ürünlerinden bir tanesi ile kesin karşılaşırsınız.'
      }, addInitialOptions()]);
    } else if (option === 'İade veya değişim yapabilir miyim?') {
      setMessages(prev => [...prev, {
        from: 'bot',
        text: '🔁 Gizemli kutu elinize ulaştıktan sonra diye düzeltelim iade/değişim kapsamına girmez. Ancak ürün arızalıysa iade yapılabilir.'
      }, addInitialOptions()]);
    }
    else if (option === 'Sakaoğlu Store Gizemli Kutusu neden zarar ettirmez?') {
      setMessages(prev => [...prev, {
        from: 'bot',
        text: `Sakaoğlu Store, sizlerden gelen yoğun talepler sonucunda ürünleri toptan ve yüklü miktarda tedarik eder. Talep yoğunluğu sayesinde piyasanın %50 altında fiyattan stok alır.
%20 KDV, %15 yüksek kademe hediyeler, %15 Sakaoğlu Store kazancıdır. 
Edinilen kazancın yüksek miktarı ile lojistik ve yerli üretim noktasında yatırımlar sağlanır.

Tüm gelir ve giderlerin ekstresi PDF dijital ekstre ve fatura olarak her ay düzenli şekilde topluluğun denetimine açık olarak paylaşılır. Topluluk, tüm giriş çıkışları denetler ve hesaplamalar sonucu tasarrufa giden yolda fikirler veya teklifler verebilir.`      }, addInitialOptions()]);
    }
    scrollToLatestAnswer();
  };

  return (
    <div className={styles.chatbot}>      {isOpen && (
        <div className={styles.chatWindow}>
          <button className={styles.closeButton} onClick={() => setIsOpen(false)}>✖️</button>
          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} className={msg.from === 'bot' ? styles.bot : styles.user}>
                {!msg.clickable ? (
                  msg.text
                ) : (
                  <>
                    <p>{msg.text}</p>
                    {msg.options.map((opt, index) => (
                      <button
                        key={index}
                        className={styles.chatOption}
                        onClick={() => handleOptionClick(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </>
                )}              </div>
            ))}
          </div>
        </div>
      )}
      <button
        className={styles.fab}
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>
    </div>
  );
}