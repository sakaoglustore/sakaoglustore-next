'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/Navbar.module.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        sakaoglustore
      </Link>

      <button className={styles.menuToggle} onClick={toggleMenu}>
        ☰
      </button>

      <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
        <li className={styles.closeBtn} onClick={closeMenu}>×</li>
        <li><Link href="/about" onClick={closeMenu}>Hakkımızda</Link></li>
        <li><Link href="/orders" onClick={closeMenu}>Siparişlerim</Link></li>
        <li><Link href="/profile" onClick={closeMenu}>Profil</Link></li>
        <li><Link href="/kvkk" onClick={closeMenu}>KVKK Aydınlatma Metni</Link></li>
        <li>
          <Link href="/cart" onClick={closeMenu}>
            <button className={styles.cartBtn}>Sepetim</button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
