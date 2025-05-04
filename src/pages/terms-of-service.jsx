import React from 'react';
import styles from '@/styles/TermsOfService.module.css'; // CSS modül dosyasını içe aktar

const TermsOfService = () => {
  return (
    <div className="container">
      <h1>Hizmet Şartları</h1>
      <section>
        <h2>1. Hizmetin Sunumu</h2>
        <p>
          Web sitemiz, kullanıcıların çeşitli hizmetlere erişim sağlamalarını amaçlayan bir platformdur. Hizmetler, zaman zaman değişiklik gösterebilir ve siteye erişiminiz, bu değişikliklere bağlı olarak da farklılık gösterebilir.
        </p>
      </section>
      <section>
        <h2>2. Hesap Güvenliği</h2>
        <p>
          Kullanıcılar, hesaplarının güvenliğinden sorumludur. Hesabınızla yapılan işlemler, sizin sorumluluğunuzdadır. Hesabınıza izinsiz erişim olduğunu düşünüyorsanız, derhal bizimle iletişime geçmelisiniz.
        </p>
      </section>
      <section>
        <h2>3. Kullanıcı Davranışı</h2>
        <p>
          Web sitemizi kullanırken, yasadışı, saldırgan, yanıltıcı, cinsel içerikli, nefret söylemi içeren veya üçüncü şahıslara zarar veren herhangi bir içerik yayınlayamazsınız. Bu tür davranışlar, kullanıcı erişiminizin kısıtlanmasına veya askıya alınmasına yol açabilir.
        </p>
      </section>
      <section>
        <h2>4. Fikri Mülkiyet</h2>
        <p>
          Web sitemiz üzerindeki tüm içerikler, yazılımlar ve tasarımlar telif hakkıyla korunmaktadır. Kullanıcılar, bu içerikleri yalnızca belirli izinlerle kullanabilirler.
        </p>
      </section>
      <section>
        <h2>5. Sorumluluk Reddi</h2>
        <p>
          Web sitemiz, sağladığı hizmetlerin kesintisiz ve hatasız olacağını garanti etmemektedir. Kullanıcılar, siteyi kullanırken ortaya çıkabilecek olası kayıplardan kendi sorumlulukları altındadır.
        </p>
      </section>
      <section>
        <h2>6. Değişiklikler</h2>
        <p>
          Bu hizmet şartları, zaman zaman güncellenebilir. Bu değişiklikler, web sitesinde yayımlandığı tarihten itibaren geçerlidir. Kullanıcılar, bu şartları düzenli olarak kontrol etmelidir.
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;