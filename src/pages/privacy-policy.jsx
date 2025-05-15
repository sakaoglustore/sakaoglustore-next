'use client';
import React from 'react';
import styles from '@/styles/PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gizlilik Politikası</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Topladığımız Bilgiler</h2>
        <p className={styles.text}>
          Web sitemizi kullandığınızda, adınız, e-posta adresiniz, telefon numaranız gibi kişisel bilgileri toplarız.
          Ayrıca IP adresiniz, tarayıcı türünüz gibi kullanım verileri de toplanabilir.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Bilgilerin Kullanımı</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>Hizmetlerimizi sunmak ve geliştirmek</li>
          <li className={styles.listItem}>Kullanıcı taleplerini yerine getirmek</li>
          <li className={styles.listItem}>Kullanıcı deneyimini iyileştirmek</li>
          <li className={styles.listItem}>Kampanya ve duyurular için iletişim kurmak</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Bilgilerin Korunması</h2>
        <p className={styles.text}>
          Verileriniz endüstri standartlarına uygun şifreleme ve güvenlik önlemleriyle korunmaktadır.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Üçüncü Taraflarla Paylaşım</h2>
        <p className={styles.text}>
          Kişisel bilgileriniz yalnızca yasal zorunluluklar veya güvenlik nedenleriyle üçüncü taraflarla paylaşılabilir.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Çerezler</h2>
        <p className={styles.text}>
          Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır.
          Çerezler, tercihlerinizi hatırlamamıza yardımcı olur.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>6. Veri Koruma Hakları</h2>
        <p className={styles.text}>
          Kişisel bilgilerinize erişme, düzeltme, silme veya taşınmasını talep etme hakkına sahipsiniz.
          Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
