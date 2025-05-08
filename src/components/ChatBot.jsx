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
        'İade veya değişim yapabilir miyim?'
      ],
      clickable: true
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: input }]);
    setInput('');
  };

  const handleOptionClick = (option) => {
    setMessages(prev => [...prev, { from: 'user', text: option }]);

    if (option === 'Sipariş verdim ama ürünüm gelmedi') {
      setMessages(prev => [...prev, {
        from: 'bot',
        text: '📦 Siparişiniz 2-5 iş günü içinde teslim edilmediyse, destek@sakaoglustore.net adresine mail atabilirsiniz.'
      }]);
    } else if (option === 'Kutudan ne çıkıyor?') {
      setMessages(prev => [...prev, {
        from: 'bot',
        text: '🎁 Bluetooth kulaklık, akıllı saat, hoparlör, macbook, iphone serileri, kamp çadırı, blender, airpods, tablet, airfryer, drone, apple vision pro, game box ürünlerinden bir tanesi ile kesin karşılaşırsınız.'
      }]);
    } else if (option === 'İade veya değişim yapabilir miyim?') {
      setMessages(prev => [...prev, {
        from: 'bot',
        text: '🔁 Gizemli kutular açıldıktan sonra iade/değişim kapsamına girmez. Ancak ürün arızalıysa iade yapılabilir.'
      }]);
    }
    else if (option === 'Sakaoğlu Store Gizemli Kutusu neden zarar ettirmez?') {
      setMessages(prev => [...prev, {
        from: 'bot',
text: `Sakaoğlu Store, sizlerden gelen yoğun talepler sonucunda ürünleri toptan ve yüklü miktarda tedarik eder. Talep yoğunluğu sayesinde piyasanın %50 altında fiyattan stok alır.
%20 KDV, %15 yüksek kademe hediyeler, %15 Sakaoğlu Store kazancıdır. 
Edinilen kazancın yüksek miktarı ile lojistik ve yerli üretim noktasında yatırımlar sağlanır.

Tüm gelir ve giderlerin ekstresi PDF dijital ekstre ve fatura olarak her ay düzenli şekilde topluluğun denetimine açık olarak paylaşılır. Topluluk, tüm giriş çıkışları denetler ve hesaplamalar sonucu tasarrufa giden yolda fikirler veya teklifler verebilir.`,
      }]);
    }
  };

  return (
    <div className={styles.chatbot}>
      {isOpen && (
        <div className={styles.chatWindow}>
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
                )}
              </div>
            ))}
          </div>
          <div className={styles.inputRow}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Bir şey yazın..."
            />
            <button onClick={handleSend}>Gönder</button>
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