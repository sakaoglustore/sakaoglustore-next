'use client';
import React from 'react';
import styles from '@/styles/TermsOfService.module.css';

const TermsOfService = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hizmet Şartları</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Hizmetin Sunumu</h2>
        <p className={styles.text}>
          Web sitemiz, kullanıcıların çeşitli hizmetlere erişim sağlamalarını amaçlayan bir platformdur. Hizmetler zamanla değişebilir.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Hesap Güvenliği</h2>
        <p className={styles.text}>
          Kullanıcılar, hesaplarının güvenliğinden ve hesapları üzerinden yapılan işlemlerden sorumludur.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Kullanıcı Davranışı</h2>
        <p className={styles.text}>
          Web sitemizi kullanırken yasa dışı, saldırgan veya yanıltıcı içerikler paylaşamazsınız. Bu tür davranışlar erişiminizin engellenmesine sebep olabilir.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Fikri Mülkiyet</h2>
        <p className={styles.text}>
          Web sitemizdeki tüm içerikler telif hakkı ile korunmaktadır. İçerikler izinsiz kullanılamaz.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Sorumluluk Reddi</h2>
        <p className={styles.text}>
          Web sitemiz, hizmetlerin kesintisiz veya hatasız olacağını garanti etmemektedir. Kullanım riskleri kullanıcıya aittir.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>6. Değişiklikler</h2>
        <p className={styles.text}>
          Hizmet şartları zaman zaman güncellenebilir. Değişiklikler yayım tarihinden itibaren geçerli olur.
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
