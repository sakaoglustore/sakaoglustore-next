'use client';
import { useState, useRef, useEffect } from 'react';
import styles from '@/styles/ChatBot.module.css';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [orientation, setOrientation] = useState('bottom-right');
  const buttonRef = useRef();

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
        text: '🎁 Gizemli kutularımızda iPhone, MacBook, kulaklık, ses bombası gibi ürünler bulunabilir. İçerik kutu fiyatına göre değişir.'
      }]);
    } else if (option === 'İade veya değişim yapabilir miyim?') {
      setMessages(prev => [...prev, {
        from: 'bot',
        text: '🔁 Gizemli kutular açıldıktan sonra iade/değişim kapsamına girmez. Ancak ürün arızalıysa iade yapılabilir.'
      }]);
    }
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    const rect = buttonRef.current.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      setPosition({ x: newX, y: newY });

      const width = window.innerWidth;
      const height = window.innerHeight;

      const horizontal = newX > width / 2 ? 'right' : 'left';
      const vertical = newY > height / 2 ? 'bottom' : 'top';
      setOrientation(`${vertical}-${horizontal}`);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, offset]);

  return (
    <div className={styles.chatbot} style={{ left: position.x, top: position.y }}>
      {isOpen && (
        <div
          className={styles.chatWindow}
          style={{
            position: 'fixed',
            top: position.y < window.innerHeight / 2 ? position.y + 60 : 'auto',
            bottom: position.y >= window.innerHeight / 2 ? window.innerHeight - position.y + 60 : 'auto',
            left: position.x < window.innerWidth / 2 ? position.x : 'auto',
            right: position.x >= window.innerWidth / 2 ? window.innerWidth - position.x : 'auto',
          }}
        >
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
        ref={buttonRef}
        className={styles.fab}
        onClick={() => setIsOpen(!isOpen)}
        onMouseDown={handleMouseDown}
      >
        💬
      </button>
    </div>
  );
}
