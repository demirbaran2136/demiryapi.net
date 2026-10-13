# GitHub + Vercel + GoDaddy Yayına Alma

Bu proje Vercel üzerinde statik site olarak yayınlanmaya hazırdır.

## 1. GitHub reposu oluştur

1. GitHub hesabına gir.
2. `New repository` seç.
3. Repo adı olarak örneğin `demiryapi.net` yaz.
4. Public veya Private seçebilirsin.
5. Repo oluştur.

## 2. Site dosyalarını GitHub'a yükle

Bu klasördeki dosyaları repoya yükle:

- `index.html`
- `hizmetlerimiz.html`
- `biz-kimiz.html`
- `projelerimiz.html`
- `blog.html`
- `iletisim.html`
- `teklif-al.html`
- `404.html`
- `styles.css`
- `vercel.json`
- `robots.txt`
- `sitemap.xml`
- `assets/`

Not: Vercel için `.htaccess` gerekmez. O dosya sadece cPanel/Apache yayınları içindir.

## 3. Vercel'e GitHub reposunu bağla

1. Vercel hesabına gir.
2. `Add New` > `Project` seç.
3. GitHub hesabını bağla.
4. `demiryapi.net` reposunu seç.
5. Framework Preset: `Other`
6. Build Command: boş bırak.
7. Output Directory: boş bırak.
8. `Deploy` butonuna bas.

## 4. Domaini Vercel'e ekle

1. Vercel'de projeye gir.
2. `Settings` > `Domains` bölümünü aç.
3. `demiryapi.net` ekle.
4. Vercel genelde `www.demiryapi.net` için de ekleme önerir; onu da ekle.
5. Vercel'in verdiği DNS kayıtlarını GoDaddy DNS alanına gir.

## 5. GoDaddy DNS bağlantısı

GoDaddy'de:

1. Domain ürününü aç.
2. DNS yönetimine gir.
3. Vercel'in istediği kayıtları ekle veya düzenle.

Genel yapı şu şekildedir:

- Kök domain `demiryapi.net` için `A` kaydı kullanılır.
- `www.demiryapi.net` için `CNAME` kaydı kullanılır.

Kesin değerleri Vercel ekranında gördüğün kayıtlarla aynı gir.

## 6. Yayın sonrası kontrol

1. `https://demiryapi.net` açılıyor mu?
2. `https://www.demiryapi.net` doğru adrese yönleniyor mu?
3. Menü sayfaları çalışıyor mu?
4. WhatsApp, telefon ve e-posta bağlantıları çalışıyor mu?
5. Google Search Console'a `https://demiryapi.net/sitemap.xml` gönder.

