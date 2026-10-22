(function () {
  const categories = window.demirYapiProjectCategories || [];
  const filters = document.querySelector("[data-blog-services]");
  const content = document.querySelector("[data-blog-content]");
  const articles = document.querySelector("[data-blog-articles]");
  const count = document.querySelector("[data-blog-count]");
  if (!filters || !content || !articles || !count) return;

  const guides = {
    "insaat-muteahhitlik": {
      articles: ["blog-santiye-hazirligi.html", "blog-insaat-is-programi.html"],
      questions: [
        ["İnşaat projesine başlamadan önce hangi hazırlıklar yapılır?", "İhtiyaç programı, arsa veya mevcut yapının durumu, yaklaşık bütçe ve hedef takvim netleştirilir. Ardından keşif ve uygulama kapsamı hazırlanır."],
        ["Kaba inşaat ve ince işler hangi sırayla ilerler?", "Genel olarak temel ve taşıyıcı sistemden sonra duvar, tesisat altyapısı, sıva ve şap; ardından kaplama, boya, doğrama ve son montaj işleri yürütülür. Projeye göre iş sırası değişebilir."],
        ["Şantiye hazırlığında neler planlanır?", "Saha erişimi, geçici depolama, iş güvenliği, ekip ve malzeme akışı ile uygulama takvimi birlikte değerlendirilir."],
        ["Dış cephe uygulaması öncesi nelere bakılır?", "Mevcut yüzey, nem ve çatlak durumu, cephe erişimi, kullanılacak sistem ve çevresel koşullar keşifte incelenir."],
        ["İnşaat süresi nasıl belirlenir?", "Yapının büyüklüğü, uygulama kapsamı, ruhsat ve proje süreçleri, malzeme tedariki ve hava koşulları süreyi etkiler. Net takvim keşif sonrasında oluşturulur."],
        ["İnşaat için teklif alırken hangi bilgiler gerekir?", "Konum, yapı türü, yaklaşık alan, yapılacak işler ve varsa proje çizimleri ya da saha fotoğrafları ilk değerlendirmeyi kolaylaştırır."]
      ]
    },
    "insaat-malzemeleri": {
      articles: ["blog-insaat-malzemeleri.html", "blog-maltepe-yapi-malzemeleri.html"],
      questions: [
        ["Yapı malzemesi seçerken nelere dikkat edilmeli?", "Ürünün kullanım yeri, teknik özellikleri, ilgili standart ve belgeleri, uygulama uyumu ve üretici tavsiyeleri birlikte kontrol edilmelidir."],
        ["Malzeme fiyat teklifi için hangi bilgiler gerekir?", "Ürün adı veya teknik özelliği, miktar, teslimat adresi ve istenen teslim tarihi teklifin doğru hazırlanmasına yardımcı olur."],
        ["Proje bazlı malzeme tedariği nasıl planlanır?", "İş kalemleri ve uygulama takvimine göre ürün listesi çıkarılır; miktarlar ve teslimat aşamaları sahadaki ihtiyaçla eşleştirilir."],
        ["Malzemeler şantiyeye nasıl teslim edilir?", "Teslimat planı; ürün miktarı, araç erişimi, indirme alanı ve şantiyenin iş programı dikkate alınarak belirlenir."],
        ["Yalıtım malzemesi seçimi neye göre yapılır?", "Uygulama alanı, beklenen ısı veya su yalıtım ihtiyacı, mevcut yüzey ve sistem detayları uzman keşfiyle değerlendirilmelidir."],
        ["Malzeme firesini azaltmak için ne yapılabilir?", "Uygulama ölçülerinin doğru alınması, kesim ve bindirme paylarının hesaba katılması, ürünlerin işe uygun miktarda ve aşamalı sipariş edilmesi fireyi azaltır."]
      ]
    },
    "anahtar-teslim-tadilat": {
      articles: ["blog-anahtar-teslim-tadilat.html", "blog-istanbul-tadilat-firmasi.html"],
      questions: [
        ["Anahtar teslim tadilat neleri kapsar?", "Kapsam; keşif ve iş listesine göre değişir. Yıkım, tesisat, yüzey hazırlığı, kaplama, boya ve montaj gibi kalemler teklif öncesinde açıkça tanımlanmalıdır."],
        ["Tadilat öncesi keşif neden önemlidir?", "Keşif, mevcut durumu ve beklentileri görerek iş kapsamını, olası teknik ihtiyaçları ve yaklaşık uygulama sırasını belirlemeye yardımcı olur."],
        ["Mutfak yenileme ne kadar sürer?", "Süre; dolap üretimi, tesisat değişikliği, tezgâh ve kaplama seçimi ile iş kapsamına bağlıdır. Kesin takvim ölçü ve keşif sonrası paylaşılır."],
        ["Banyo tadilatında su yalıtımı neden önemlidir?", "Islak hacimlerde doğru yüzey hazırlığı ve uygun yalıtım detayları, suyun yapı elemanlarına ilerlemesi riskini azaltmaya yardımcı olur."],
        ["Tadilat sırasında evde oturulabilir mi?", "Bu karar işin kapsamına bağlıdır. Birden fazla alanın aynı anda yenilenmesi, toz, gürültü ve tesisat kesintileri kullanım konforunu etkileyebilir."],
        ["Tadilat teklifi almak için ne paylaşmalıyım?", "Adres veya ilçe, alanın yaklaşık ölçüsü, yapılacak işler, tercih edilen malzemeler ve mevcut durumu gösteren fotoğraflar ilk değerlendirmeyi hızlandırır."]
      ]
    },
    "boya-tadilat": {
      articles: ["blog-boya-zemin-yenileme.html", "blog-anahtar-teslim-tadilat.html"],
      questions: [
        ["Boya öncesi duvar hazırlığı nasıl yapılır?", "Yüzey temizlenir; kabaran boya, çatlak ve bozuk alanlar uygun şekilde onarılır. Astar ve boya seçimi yüzey durumuna göre belirlenir."],
        ["Boya yapılırken mobilyalar nasıl korunur?", "Mümkünse eşyalar odadan çıkarılır; kalan mobilyalar ve zemin uygulama öncesi örtüyle korunur. Priz ve sabit donanımlar da maskeleme ile güvenceye alınır."],
        ["Parke değişimi boya işinden önce mi yapılır?", "Genellikle toz çıkaran zemin söküm ve montaj işleri boyadan önce planlanır; son kat boya ve rötuşlar iş programının sonuna bırakılabilir."],
        ["Boya miktarı nasıl hesaplanır?", "Duvar ve tavan yüzey alanı, kat sayısı, yüzeyin emiciliği ve ürünün kapatıcılığı dikkate alınır. Üretici sarfiyat bilgisi esas alınmalıdır."],
        ["Küf veya nem olan duvar doğrudan boyanır mı?", "Önce nemin kaynağı belirlenip giderilmelidir. Sorun çözülmeden yapılan boya kısa sürede kabarma veya lekelenme gösterebilir."],
        ["İç mekân tadilatında hangi işler birlikte planlanmalı?", "Elektrik ve su tesisatı, alçı ve yüzey hazırlığı, zemin kaplaması, boya ve sabit mobilya montajı birbirini etkileyecek şekilde sıraya konmalıdır."]
      ]
    },
    "peyzaj-havuz": {
      articles: ["blog-peyzaj-havuz.html", "blog-havuz-yapimi-planlama.html"],
      questions: [
        ["Bahçe peyzajı planlamasına nereden başlanır?", "Kullanım beklentisi, güneş ve gölge durumu, mevcut zemin, drenaj ve bakım için ayrılabilecek zaman değerlendirilir."],
        ["Bahçede drenaj neden önemlidir?", "Doğru drenaj, yağmur ve sulama suyunun kontrollü uzaklaşmasına yardımcı olur; bitkileri ve sert zeminleri su birikmesinden korur."],
        ["Bitki seçerken hangi koşullar dikkate alınır?", "İklim, güneş alma süresi, toprak yapısı, sulama imkânı, bitkinin büyüme boyutu ve bakım ihtiyacı birlikte ele alınır."],
        ["Havuz yapımından önce hangi teknik konular değerlendirilir?", "Yer seçimi, zemin ve altyapı, su ve elektrik bağlantıları, filtrasyon, drenaj ve çevre düzenlemesi proje başında planlanır."],
        ["Havuz çevresi zemininde hangi özellikler aranır?", "Dış mekâna uygunluk, kayma direnci, suya ve sıcaklık değişimlerine dayanım ile yüzey eğimi değerlendirilmelidir."],
        ["Peyzaj uygulaması için teklif nasıl hazırlanır?", "Alan ölçüsü, mevcut durum fotoğrafları, istenen bitki ve sert zemin alanları, sulama ve aydınlatma beklentileri paylaşılmalıdır."]
      ]
    },
    "villa-tadilati": {
      articles: ["blog-villa-tadilati-istanbul.html", "blog-villa-tadilat-is-sirasi.html"],
      questions: [
        ["Villa tadilatı daire tadilatından nasıl farklıdır?", "Villa işlerinde iç mekânın yanında dış cephe, teras, bahçe ve havuz gibi alanlar da kapsama girebilir; bu nedenle koordinasyon ve keşif kapsamı genişler."],
        ["Villa yenileme bütçesini hangi unsurlar etkiler?", "Yenilenecek alanların büyüklüğü, tesisat değişimleri, seçilen malzemeler, özel imalatlar ve dış alan işleri bütçeyi etkiler."],
        ["Villa iç ve dış mekân işleri birlikte yapılmalı mı?", "Birlikte planlama; altyapı, cephe ve bahçe bağlantılarının uyumunu sağlar. Uygulama aşamaları ise yaşam düzenine ve iş programına göre bölünebilir."],
        ["Villa dış cephe yenilemesinde ne incelenir?", "Mevcut kaplama, çatlak ve nem durumu, ısı yalıtımı ihtiyacı, doğramalar, iskele erişimi ve mimari detaylar incelenir."],
        ["Teras yenilemesinde su yalıtımı neden önemlidir?", "Terasın eğimi, giderleri, birleşim detayları ve seçilen üst kaplama birlikte doğru çözülmezse su sızıntısı riski oluşabilir."],
        ["Villa tadilatı için keşif nasıl planlanır?", "Yenilenecek iç ve dış alanların listesi, mevcut planlar, fotoğraflar ve kullanım beklentileri hazırlanarak yerinde değerlendirme yapılır."]
      ]
    },
    "hafriyat": {
      articles: ["blog-hafriyat.html", "blog-anadolu-yakasi-hafriyat.html"],
      questions: [
        ["Hafriyat öncesi saha keşfinde neler kontrol edilir?", "Alan ölçüsü, zemin koşulları, kotlar, çevre yapılar, araç erişimi, mevcut altyapı hatları ve kazı malzemesinin taşınma planı değerlendirilir."],
        ["Temel kazısı için hangi bilgilere ihtiyaç vardır?", "Proje veya kazı ölçüleri, hedef derinlik, zemin bilgisi, saha fotoğrafları ve iş makinesi erişim koşulları gerekir."],
        ["Hafriyat toprağı ve moloz nasıl yönetilir?", "Malzeme türü ve miktarı belirlenerek uygun yükleme, araç organizasyonu ve mevzuata uygun taşıma planı yapılmalıdır."],
        ["İş makinesi seçimi neye göre yapılır?", "Kazı derinliği ve hacmi, saha genişliği, zemin yapısı, çalışma alanına erişim ve yükleme ihtiyacı makine seçiminde belirleyicidir."],
        ["Saha tesviyesi neden yapılır?", "Tesviye, zemini proje kotlarına ve sonraki uygulamalara uygun hale getirmeye yardımcı olur. Dolgu ve sıkıştırma ihtiyacı saha koşullarına göre belirlenir."],
        ["Hafriyat teklifi almak için hangi belgeler veya görseller gerekir?", "Konum, ölçüler, varsa aplikasyon veya proje çizimi, hedef kazı derinliği ve sahayı gösteren fotoğraflar ön değerlendirmeyi kolaylaştırır."]
      ]
    }
  };

  const esc = (value) => String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const requested = new URLSearchParams(window.location.search).get("hizmet") || "";
  const active = categories.some((category) => category.slug === requested) ? requested : "";
  const setMeta = (selector, attribute, value) => {
    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement("meta");
      const match = selector.match(/\[(name|property)=["']([^"']+)["']\]/);
      if (match) element.setAttribute(match[1], match[2]);
      document.head.appendChild(element);
    }
    element.setAttribute(attribute, value);
  };
  filters.classList.add("project-service-tiles");
  filters.setAttribute("aria-label", "Rehberleri hizmet alanına göre seçin");
  filters.innerHTML = categories.map((category, index) => `<a class="project-service-tile${active === category.slug ? " active" : ""}" href="blog.html?hizmet=${encodeURIComponent(category.slug)}"${active === category.slug ? ' aria-current="page"' : ""}><img src="${esc(category.image)}" alt="" loading="lazy" decoding="async"><span class="project-service-tile-shade"></span><span class="project-service-tile-copy"><span class="project-service-tile-number">HİZMET ${String(index + 1).padStart(2, "0")}</span><strong>${esc(category.title)}</strong><span class="project-service-tile-action">Rehber ve soruları görüntüle →</span></span></a>`).join("");
  const title = document.querySelector(".blog-services-section .section-heading h2");
  if (active) {
    const category = categories.find((item) => item.slug === active);
    const guide = guides[active];
    const pageTitle = `${category.title} Rehberi ve Sık Sorulan Sorular | Demir Yapı`;
    const pageDescription = `${category.title}: ${category.summary} Sık sorulan soruların yanıtlarını ve ilgili rehber yazılarını inceleyin.`;
    const canonicalUrl = `https://demiryapi.net/blog.html?hizmet=${encodeURIComponent(active)}`;
    document.title = pageTitle;
    setMeta('meta[name="description"]', "content", pageDescription);
    setMeta('meta[property="og:title"]', "content", pageTitle);
    setMeta('meta[property="og:description"]', "content", pageDescription);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
    const hero = document.querySelector(".page-hero");
    if (hero) {
      hero.querySelector(".eyebrow").textContent = `${category.title} Rehberi`;
      hero.querySelector("h1").textContent = `${category.title} Rehberi ve Sık Sorulan Sorular`;
      hero.querySelector("p:last-child").textContent = category.summary;
    }
    if (title) title.textContent = `${category.title} rehberi ve sık sorulan sorular`;
    count.textContent = `${guide.questions.length} açık soru · ${guide.articles.length} rehber yazısı · ${category.title}`;
    filters.hidden = true;
    const articleCards = guide.articles.map((href) => {
      const link = articles.querySelector(`a[href="${href}"]`);
      return link ? `<a class="blog-related-link" href="${esc(href)}">${link.querySelector("h3")?.textContent || "İlgili rehberi oku"} →</a>` : "";
    }).join("");
    content.innerHTML = `<div class="blog-selected-heading"><p class="eyebrow">${esc(category.title)}</p><p>${esc(category.summary)}</p><a class="button secondary" href="blog.html">← Tüm hizmet alanları</a></div><div class="blog-faq-grid">${guide.questions.map(([question, answer]) => `<details class="blog-faq-item" open><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join("")}</div><div class="blog-related"><h3>İlgili yazılar</h3>${articleCards || '<p>Bu hizmet için yeni rehber yazıları hazırlanıyor.</p>'}<a class="button primary" href="teklif-al.html">Hizmet için teklif al</a></div>`;
    articles.hidden = true;
    const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": guide.questions.map(([question, answer]) => ({ "@type": "Question", "name": question, "acceptedAnswer": { "@type": "Answer", "text": answer } })) };
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(schema);
  } else {
    if (title) title.textContent = "İlgilendiğiniz hizmeti seçin";
    count.textContent = `${categories.length} hizmet alanı · rehber ve soruları görüntülemek için bir kutu seçin`;
    content.innerHTML = "";
  }
})();
