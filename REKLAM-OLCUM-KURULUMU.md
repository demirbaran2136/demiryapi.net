# Demir Yapi Reklam Olcum Kurulumu

Site, kullanici tercihine bagli Google Ads donusum olcumunu destekler. Kimlik ve etiketler bos oldugu icin reklam etiketi su anda etkin degildir; gercek bilgiler girilmeden etiket yuklenmez.

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
- WhatsApp teklif taslagi acilmasi

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

Teklif formu sunucuya kayit yapmaz; WhatsApp'ta onceden doldurulmus bir taslak acar. Bu nedenle bu eylem gercek bir mesaj gonderimi veya kesinlesmis musteri adayi gibi raporlanmamali.

Google Ads etiketi yalnizca kullanici cerez tercih panelinde reklam olcumune izin verirse yuklenir. Tercih, tarayici yerel depolamasinda en fazla 180 gun tutulur; reddedildiginde etiket yuklenmez. Kimlik ve etiket alanlari bosken olcum istegi gonderilmez.

Google Ads Tag Assistant ile kontrol edin:

- Google etiketi gorunuyor mu?
- Telefon tiklamasi donusum olarak gidiyor mu?
- WhatsApp tiklamasi donusum olarak gidiyor mu?
- WhatsApp teklif taslaginin acilmasi gercek mesaj gonderimi gibi raporlanmiyor mu?

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

