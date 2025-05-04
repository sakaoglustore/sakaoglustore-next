import React from 'react';

const ContactUs = () => {
  return (
    <div className="container">
      <h1>İletişim</h1>
      <section>
        <h2>Bizimle iletişime geçmek için aşağıdaki yöntemleri kullanabilirsiniz:</h2>
        <ul>
          <li><strong>Telefon:</strong> +90 541 614 20 17</li>
          <li><strong>E-posta:</strong> eyilerege@gmail.com</li>
          <li><strong>Adres:</strong> Yeşilbahçe Mah. 1450 Sok. Dr. Eyiler Apt. No: 25/25, [Şehir Adı, Ülke]</li>
        </ul>
      </section>
      <section>
        <h2>Yardım ve Destek</h2>
        <p>
          Eğer herhangi bir konuda yardıma ihtiyacınız varsa ya da hizmetlerimizle ilgili sorularınız varsa, lütfen bizimle iletişime geçmekten çekinmeyin. Sizi dinlemekten memnuniyet duyarız!
        </p>
      </section>
    </div>
  );
};

export default ContactUs;
