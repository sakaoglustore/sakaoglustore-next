'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/Navbar.module.css';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userFromStorage = JSON.parse(localStorage.getItem('user'));
      setUser(userFromStorage);
    }
  }, [router.pathname]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={() => router.push('/')}>
        sakaoglustore
      </div>

      <button className={styles['menu-toggle']} onClick={toggleMenu}>
        ☰
      </button>

      <ul className={`${styles['nav-links']} ${menuOpen ? styles.open : ''}`}>
        <li><Link href="/about">Hakkımızda</Link></li>
        <li><button className={styles['cart-btn']} onClick={() => router.push('/order-flow')}>Sepetim</button></li>
        {user ? (
          <>
            <li><Link href="/order-history">Siparişlerim</Link></li>
            <li><Link href="/profile">Profil ({user.name})</Link></li>
          </>
        ) : (
          <>
            <li><Link href="/login">Giriş</Link></li>
            <li><Link href="/signup">Kayıt</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
