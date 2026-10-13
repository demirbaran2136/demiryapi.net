# Demir Yapi Reklam Olcum Kurulumu

Bu site Google Ads donusum olcumune hazirdir. Google Ads panelinden kimlik ve donusum etiketleri alindiktan sonra sadece `site.js` dosyasindaki alanlar doldurulur.

## 1. Google Ads Etiketi

Google Ads panelinde:

1. Araclar > Donusumler bolumune girin.
2. Yeni donusum islemi olusturun.
3. Web sitesi secin.
4. Alan adi olarak `demiryapi.net` yazin.
5. Google etiketi kisminda `AW-` ile baslayan Google Ads kimligini alin.

`site.js` icinde su alana yazin:

```js
const googleAdsId = "AW-XXXXXXXXXX";
```

## 2. Donusum Etiketleri

Ayri ayri su donusumleri olusturun:

- Telefon tiklamasi
- WhatsApp tiklamasi
- Teklif al butonu
- Teklif formu gonderimi

Google Ads her donusum icin bir etiket verir. Etiketleri `site.js` icinde su alanlara yazin:

```js
const conversionLabels = {
  phone: "TELEFON_ETIKETI",
  whatsapp: "WHATSAPP_ETIKETI",
  quote: "TEKLIF_BUTONU_ETIKETI",
  form: "TEKLIF_FORMU_ETIKETI"
};
```

## 3. Reklam Baslamadan Once Kontrol

Google Ads Tag Assistant ile kontrol edin:

- Google etiketi gorunuyor mu?
- Telefon tiklamasi donusum olarak gidiyor mu?
- WhatsApp tiklamasi donusum olarak gidiyor mu?
- Teklif formu gonderimi donusum olarak gidiyor mu?

## 4. Ilk Kampanya Mantigi

Ilk reklam kampanyalari hizmet sayfalarina yonlenmelidir:

- `insaat-malzemeleri.html`
- `anahtar-teslim-tadilat.html`
- `boya-tadilat.html`
- `hafriyat.html`
- `peyzaj-havuz.html`
- `villa-tadilati.html`

Ana hedefler:

- Telefon aramasi
- WhatsApp mesaji
- Teklif formu

