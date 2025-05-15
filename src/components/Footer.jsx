'use client';

import styles from '@/styles/Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.socialLinks}>
          <Link href="https://www.instagram.com/sakaoglu.store/?hl=en" className={styles.socialLink}>Instagram</Link>
        </div>

        <div className={styles.legalLinks}>
          <Link href="/privacy-policy" className={styles.legalLink}>Gizlilik Politikası  |  </Link>
          <Link href="/terms-of-service" className={styles.legalLink}>Hizmet Şartları  |  </Link>
          <Link href="/contact" className={styles.legalLink}>İletişim</Link>
        </div>

        <div className={styles.footerLogo}>
          <p className={styles.footerText}>
            SakaogluStore - Tüm hakları saklıdır © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
