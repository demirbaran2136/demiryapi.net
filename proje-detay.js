(function () {
  const categories = window.demirYapiProjectCategories || [];
  const projects = window.demirYapiProjects || [];
  const container = document.querySelector("[data-project-detail]");
  const staticSlug = document.body.dataset.projectSlug || "";
  const slug = staticSlug || new URLSearchParams(window.location.search).get("proje");
  const project = projects.find((item) => item.slug === slug);
  if (!container) return;

  const esc = (value) => String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
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

  if (project && !staticSlug && project.page) {
    window.location.replace(project.page);
    return;
  }

  if (!project) {
    document.title = "Proje Bulunamadı | Demir Yapı";
    setMeta('meta[name="description"]', "content", "Aradığınız proje kaydı bulunamadı.");
    setMeta('meta[name="robots"]', "content", "noindex, follow");
    container.innerHTML = '<section class="project-not-found"><p class="eyebrow">Proje bulunamadı</p><h1>Bu proje mevcut değil.</h1><a class="button dark" href="projelerimiz.html">Projelerimize dön</a></section>';
    return;
  }

  const category = categories.find((item) => item.slug === project.serviceSlug);
  const serviceProjects = projects.filter((item) => item.serviceSlug === project.serviceSlug);
  const projectNumber = serviceProjects.findIndex((item) => item.slug === project.slug) + 1;
  const configuredGallery = Array.isArray(project.gallery) ? project.gallery : [];
  const generatedStages = window.demirYapiProjectProgress?.[slug] || [];
  const generatedGallery = generatedStages.map((stage, index) => ({
    stage: index + 1,
    phaseSlug: index < 2 ? "baslangic" : index === 7 ? "bitis" : "uygulama",
    title: stage[0],
    caption: stage[1],
    image: `assets/projects/${slug}/asama-${String(index + 1).padStart(2, "0")}.webp`,
    alt: `${project.title} için temsili ${stage[0].toLocaleLowerCase("tr-TR")} aşaması`
  }));
  const gallery = configuredGallery.length ? configuredGallery : generatedGallery;
  const pageTitle = staticSlug && document.title ? document.title : project.title + " | Demir Yapı Projeleri";
  const pageDescription = project.seoDescription || project.description || project.summary || "Demir Yapı proje kapsamı ve uygulama süreci.";
  const imageUrl = new URL(project.image, window.location.href).href;

  document.title = pageTitle;
  container.classList.add("project-detail-page");
  setMeta('meta[name="description"]', "content", pageDescription);
  setMeta('meta[property="og:title"]', "content", pageTitle);
  setMeta('meta[property="og:description"]', "content", pageDescription);
  setMeta('meta[property="og:url"]', "content", window.location.href);
  setMeta('meta[property="og:image"]', "content", imageUrl);
  setMeta('meta[property="og:image:alt"]', "content", project.alt || project.title);
  setMeta('meta[name="twitter:image:alt"]', "content", project.alt || project.title);
  setMeta('meta[name="robots"]', "content", "index, follow");

  function renderProjectPhoto(item, loading, decorative) {
    const alt = decorative ? "" : esc(item.alt || item.title);
    const image = '<img src="' + esc(item.image) + '" alt="' + alt + '" width="960" height="640" loading="' + loading + '" decoding="async">';
    if (!Number.isInteger(item.frameIndex)) return image;
    return '<div class="project-contact-photo" style="--tile-left:-' + ((item.frameIndex % 3) * 100) + '%;--tile-top:-' + (Math.floor(item.frameIndex / 3) * 100) + '%">' + image + '</div>';
  }

  function renderProjectAnimation() {
    const slides = gallery.map((item, index) =>
      '<div class="project-animation-frame" style="--frame-delay:' + (index * 3) + 's">' + renderProjectPhoto(item, "lazy", true) + '</div>'
    ).join("");
    return '<section class="project-animation" aria-labelledby="project-animation-title">' +
      '<div class="project-animation-heading"><div><p class="eyebrow">Proje sürecinin hareketli özeti</p><h2 id="project-animation-title">Aşamaları izleyin</h2></div><button class="project-animation-toggle" type="button" data-animation-toggle aria-pressed="false">Duraklat</button></div>' +
      '<div class="project-animation-viewer" aria-hidden="true">' + slides + '</div>' +
      '<p class="project-animation-caption">Temsili aşama görselleri sırayla gösterilir.</p>' +
      '</section>';
  }

  function renderGallery() {
    if (!gallery.length) return "";
    const phases = [
      { slug: "baslangic", title: "Başlangıç", hint: "İnceleme ve ön hazırlık" },
      { slug: "uygulama", title: "Uygulama süreci", hint: "İş kalemleri ve uygulama adımları" },
      { slug: "bitis", title: "Bitiş", hint: "Son kontrol ve teslim hazırlığı" }
    ];
    const links = phases.map((phase) => {
      const length = gallery.filter((item) => item.phaseSlug === phase.slug).length;
      if (!length) return "";
      return '<a href="#phase-' + phase.slug + '">' + esc(phase.title) + ' <span>' + length + ' görsel</span></a>';
    }).join("");
    const sections = phases.map((phase) => {
      const items = gallery.filter((item) => item.phaseSlug === phase.slug);
      if (!items.length) return "";
      const figures = items.map((item) =>
        '<figure class="project-progress-photo">' +
          renderProjectPhoto(item, "lazy", false) +
          '<figcaption><span>Aşama ' + esc(item.stage) + ' / ' + gallery.length + '</span><strong>' + esc(item.title) + '</strong><p>' + esc(item.caption) + '</p></figcaption>' +
        '</figure>'
      ).join("");
      return '<section class="project-progress-phase" id="phase-' + phase.slug + '">' +
        '<div class="project-progress-phase-heading"><div><p class="eyebrow">' + esc(phase.hint) + '</p><h3>' + esc(phase.title) + '</h3></div><span>' + items.length + ' görsel</span></div>' +
        '<div class="project-progress-grid">' + figures + '</div>' +
      '</section>';
    }).join("");
    return '<section class="project-progress-gallery" aria-labelledby="project-gallery-title">' +
      '<div class="section-heading"><p class="eyebrow">Proje ' + projectNumber + ' · Aşama görselleri</p><h2 id="project-gallery-title">Başlangıçtan tamamlanmaya</h2><p>Bu temsili akış, başlangıç hazırlığından tamamlanma adımlarına uzanır.</p></div>' +
      '<nav class="project-progress-nav" aria-label="Proje aşamalarına git">' + links + '</nav>' + renderProjectAnimation() + sections +
    '</section>';
  }

  function renderProjectFlow() {
    const flows = {
      "insaat-muteahhitlik": [
        { phase: "Başlangıç", title: "Keşif ve saha hazırlığı", text: "İhtiyaçlar, çalışma alanı ve uygulama sırası değerlendirilir." },
        { phase: "Uygulama", title: "Temel ve taşıyıcı sistem", text: "İş programına göre temel, kaba yapı ve ilgili saha işleri ilerler." },
        { phase: "Sonuç", title: "İnce işler ve son kontrol", text: "Uygulama kalemleri gözden geçirilir, teslim hazırlığı yapılır." }
      ],
      "insaat-malzemeleri": [
        { phase: "Başlangıç", title: "İhtiyaç listesi", text: "Ürün türü, miktar ve teslim noktası proje ihtiyacına göre belirlenir." },
        { phase: "Uygulama", title: "Ürün seçimi ve hazırlık", text: "Malzemeler kontrol edilir, sevkiyata uygun şekilde ayrılır." },
        { phase: "Sonuç", title: "Sevkiyat ve teslim", text: "Sipariş, planlanan teslimat akışına göre sahaya ulaştırılır." }
      ],
      "anahtar-teslim-tadilat": [
        { phase: "Başlangıç", title: "Keşif ve iş programı", text: "Mekân, ihtiyaçlar, kapsam ve uygulama sırası netleştirilir." },
        { phase: "Uygulama", title: "Altyapı ve yenileme", text: "Söküm, tesisat, yüzey ve seçilen imalatlar aşamalı yürütülür." },
        { phase: "Sonuç", title: "Montaj ve teslim kontrolü", text: "Son montajlar ve iş kalemleri birlikte kontrol edilir." }
      ],
      "boya-tadilat": [
        { phase: "Başlangıç", title: "Yüzey hazırlığı", text: "Koruma, tamirat ve yüzey hazırlığı uygulamaya göre tamamlanır." },
        { phase: "Uygulama", title: "Boya ve zemin işleri", text: "Renk, malzeme ve yüzey kararlarına göre iç mekân yenilenir." },
        { phase: "Sonuç", title: "Temizlik ve son kontrol", text: "Boya ve zemin detayları gözden geçirilerek alan kullanıma hazırlanır." }
      ],
      "peyzaj-havuz": [
        { phase: "Başlangıç", title: "Alan ve ihtiyaç planı", text: "Bahçe ölçüleri, zemin, drenaj ve kullanım ihtiyaçları değerlendirilir." },
        { phase: "Uygulama", title: "Altyapı ve dış mekân işleri", text: "Zemin, sulama, taş ve havuz çevresi uygulamaları sırayla ilerler." },
        { phase: "Sonuç", title: "Bitkilendirme ve son düzen", text: "Bitki, aydınlatma ve çevre detaylarıyla alan tamamlanır." }
      ],
      "villa-tadilati": [
        { phase: "Başlangıç", title: "Villa keşfi ve kapsam", text: "İç ve dış mekân ihtiyaçları birlikte değerlendirilir." },
        { phase: "Uygulama", title: "İç mekân ve dış alan", text: "Seçilen yenileme işleri planlanan sırayla uygulanır." },
        { phase: "Sonuç", title: "Detay kontrolü ve teslim", text: "Teras, cephe ve iç mekân son kontrolleri yapılır." }
      ],
      "hafriyat": [
        { phase: "Başlangıç", title: "Saha inceleme ve organizasyon", text: "Çalışma alanı, erişim ve taşıma ihtiyacı planlanır." },
        { phase: "Uygulama", title: "Kazı ve nakliye", text: "Kazı, dolgu veya moloz taşıma işleri saha koşullarına göre yürütülür." },
        { phase: "Sonuç", title: "Tesviye ve alan kontrolü", text: "Çalışma alanı düzenlenir ve sonraki uygulamaya hazırlanır." }
      ]
    };
    const steps = flows[project.serviceSlug] || [];
    if (!steps.length) return "";
    const cards = steps.map((step, index) =>
      '<li><span class="project-flow-number">0' + (index + 1) + '</span><p class="eyebrow">' + esc(step.phase) + '</p><h3>' + esc(step.title) + '</h3><p>' + esc(step.text) + '</p></li>'
    ).join("");
    return '<section class="project-process-flow" aria-labelledby="project-flow-title">' +
      '<div class="section-heading"><p class="eyebrow">' + esc(project.category) + '</p><h2 id="project-flow-title">Başlangıçtan son kontrole</h2><p>Uygulama adımlarının düzenli akışı.</p></div>' +
      '<ol>' + cards + '</ol></section>';
  }

  const tags = (project.tags || []).map((tag) => "<span>" + esc(tag) + "</span>").join("");
  const projectMeta = project.isRepresentative ? "<span>Temsili örnek</span>" : "<span>" + esc(project.location) + "</span>" + (project.date ? "<span>" + esc(project.date) + "</span>" : "");
  const projectDisclosure = project.isRepresentative
    ? '<p class="project-visual-note"><strong>Temsili sunum:</strong> Bu proje örneği yapay zekâ ile hazırlanmış görsel ve süreç anlatımıdır; gerçek saha kaydı değildir.</p>'
    : "";
  container.innerHTML =
    '<section class="project-detail-hero">' +
      '<div class="project-detail-copy">' +
        '<p class="eyebrow">' + esc(project.category) + '</p>' +
        (project.isRepresentative ? '<span class="project-number-badge">PROJE ' + projectNumber + '</span>' : "") +
        '<h1>' + esc(project.title) + '</h1>' +
        '<p>' + esc(project.summary) + '</p>' +
        '<div class="project-detail-meta">' + projectMeta + '</div>' +
        '<div class="project-tags">' + tags + '</div>' +
        '<a class="button primary" href="' + (category ? esc(category.servicePage) : "hizmetlerimiz.html") + '">Bu hizmet hakkında bilgi</a>' +
      '</div>' +
      '<img src="' + esc(project.image) + '" alt="' + esc(project.alt || project.title) + '" width="960" height="640" fetchpriority="high" decoding="async">' +
    '</section>' +
    projectDisclosure +
    '<section class="project-detail-body"><p class="eyebrow">Uygulama Özeti</p><h2>Proje kapsamı</h2><p>' + esc(project.description || project.summary) + '</p>' +
      '<a class="button dark" href="' + (category ? esc(category.page) : "projelerimiz.html") + '">' + esc(project.category) + ' projelerinin tümü</a>' +
    '</section>' +
    (gallery.length ? renderGallery() : renderProjectFlow());

  const animationToggle = container.querySelector("[data-animation-toggle]");
  if (animationToggle) {
    animationToggle.addEventListener("click", () => {
      const animation = animationToggle.closest(".project-animation");
      const paused = animation.classList.toggle("is-paused");
      animationToggle.setAttribute("aria-pressed", String(paused));
      animationToggle.textContent = paused ? "Oynat" : "Duraklat";
    });
  }
})();
