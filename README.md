# Sakaoglu Store Next.js

Sakaoglu Store, Next.js ile geliştirilmiş modern bir e-ticaret uygulamasıdır. Kullanıcılar ürünleri inceleyebilir, sepetine ekleyebilir, adres yönetimi yapabilir ve sipariş verebilir. Arkadaş davet sistemiyle kullanıcılar birbirlerine özel indirim kodları gönderebilir ve hem davet eden hem de davet edilen kişi indirim kazanır.

## Özellikler
- Next.js tabanlı modern frontend
- Kişiye özel indirim kodu sistemi
- Arkadaş davet/referral ile çift taraflı indirim
- Adres yönetimi (ekle, düzenle, sil)
- Sepet ve sipariş akışı
- KVKK ve Mesafeli Satış Sözleşmesi onayı
- Responsive ve kullanıcı dostu arayüz

## Kurulum

### 1. Gerekli Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

### 3. Backend Gereksinimi
Bu frontend, [sakaoglustoreBackend](https://github.com/sakaoglu/sakaoglustoreBackend) ile birlikte çalışır. Backend'i de başlatmayı unutmayın.

## Kullanıcı Akışı
- Kayıt olan her kullanıcıya otomatik bir indirim kodu atanır.
- Kullanıcılar profil sayfasında kendi kodunu görebilir ve paylaşabilir.
- Yeni kullanıcılar ilk siparişlerinde başka birinin kodunu kullanarak 50 TL indirim alır.
- Kod sahibi de her yeni kullanımda 50 TL indirim kazanır.
- Kullanıcı kendi kodunu kullanamaz, her kullanıcı sadece bir kez başka bir kod kullanabilir.

## Geliştirici Notları
- Kodlar ve stiller modern ve sade tutulmuştur.
- Tüm API istekleri `http://localhost:5000` backend adresine yönlendirilmiştir.
- Çevrimdışı geliştirme için backend ve frontend aynı anda çalıştırılmalıdır.

## Katkı
Katkıda bulunmak için pull request gönderebilir veya issue açabilirsiniz.

---

Daha fazla bilgi için [Next.js dokümantasyonu](https://nextjs.org/docs) ve [Vercel](https://vercel.com/) kaynaklarını inceleyebilirsiniz.
