'use client';
import React from 'react';
import styles from '@/styles/ContactUs.module.css';

const ContactUs = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>İletişim</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Bize Ulaşın</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}><strong>E-posta:</strong> info@sakaoglustore.net</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Yardım ve Destek</h2>
        <p className={styles.text}>
          Hizmetlerimizle ilgili sorularınız için bizimle iletişime geçmekten çekinmeyin. Size yardımcı olmaktan memnuniyet duyarız!
        </p>
      </section>
    </div>
  );
};

export default ContactUs;
