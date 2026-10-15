(function () {
  const categories = window.demirYapiProjectCategories || [];
  const key = "demirYapiProjectsDraft";
  const form = document.querySelector("[data-admin-form]");
  const list = document.querySelector("[data-admin-list]");
  const status = document.querySelector("[data-admin-status]");
  let projects;
  try { projects = JSON.parse(localStorage.getItem(key)) || window.demirYapiProjects || []; }
  catch (_) { projects = window.demirYapiProjects || []; }
  projects = projects.map((project) => ({ ...project }));
  const esc = (value) => String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const slugify = (value) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  form.elements.serviceSlug.innerHTML = categories.map((item) => `<option value="${esc(item.slug)}">${esc(item.title)}</option>`).join("");

  function render() {
    list.innerHTML = projects.length ? projects.map((item) => `<article class="admin-project-row"><div><strong>${esc(item.title)}</strong><span>${esc(item.category)} · ${esc(item.location)}</span></div><div class="admin-row-actions"><button type="button" data-edit="${esc(item.slug)}">Düzenle</button><button type="button" data-file="${esc(item.slug)}">Proje HTML dosyası</button><button type="button" data-delete="${esc(item.slug)}">Sil</button></div></article>`).join("") : "<p>Henüz proje kaydı yok.</p>";
  }
  function save(message) { localStorage.setItem(key, JSON.stringify(projects)); render(); status.textContent = message; }
  function setForm(item = {}) {
    ["slug", "serviceSlug", "title", "location", "date", "image", "alt", "summary", "description"].forEach((name) => { form.elements[name].value = item[name] || ""; });
    form.elements.tags.value = (item.tags || []).join(", ");
    document.querySelector("[data-form-title]").textContent = item.slug ? "Projeyi düzenle" : "Yeni proje ekle";
  }
  function download(name, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  function detailFile(project) {
    const category = categories.find((item) => item.slug === project.serviceSlug);
    const tags = (project.tags || []).map((tag) => `<span>${esc(tag)}</span>`).join("");
    return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(project.title)} | Demir Yapı</title><meta name="description" content="${esc(project.summary)}"><link rel="stylesheet" href="styles.css"></head><body><header class="site-header"><a class="brand" href="index.html"><img src="assets/demir-yapi-logo.jpeg" alt="Demir Yapı logosu"><span>Demir Yapı</span></a><nav class="nav"><a href="hizmetlerimiz.html">Hizmetlerimiz</a><a href="projelerimiz.html">Projelerimiz</a><a href="iletisim.html">İletişim</a></nav><a class="quote-button" href="teklif-al.html">Teklif Al</a></header><main><section class="project-detail-hero"><div class="project-detail-copy"><p class="eyebrow">${esc(project.category)}</p><h1>${esc(project.title)}</h1><p>${esc(project.summary)}</p><div class="project-detail-meta"><span>${esc(project.location)}</span><span>${esc(project.date)}</span></div><div class="project-tags">${tags}</div><a class="button primary" href="${esc(category?.servicePage || "hizmetlerimiz.html")}">Bu hizmet hakkında bilgi</a></div><img src="${esc(project.image)}" alt="${esc(project.alt || project.title)}"></section><section class="project-detail-body"><p class="eyebrow">Uygulama Özeti</p><h2>Proje kapsamı</h2><p>${esc(project.description || project.summary)}</p><a class="button dark" href="projelerimiz.html?hizmet=${encodeURIComponent(project.serviceSlug)}">Hizmet projelerine dön</a></section></main><footer class="site-footer"><a href="projelerimiz.html">Tüm projeler</a><a href="iletisim.html">İletişim</a></footer></body></html>`;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    const category = categories.find((item) => item.slug === values.serviceSlug);
    let slug = values.slug || slugify(values.title);
    if (!values.slug && projects.some((item) => item.slug === slug)) slug += `-${Date.now().toString().slice(-4)}`;
    const item = { slug, title: values.title.trim(), serviceSlug: values.serviceSlug, category: category?.title || "", location: values.location.trim() || "İstanbul", date: values.date.trim(), image: values.image.trim(), alt: values.alt.trim() || values.title.trim(), summary: values.summary.trim(), description: values.description.trim(), tags: values.tags.split(",").map((tag) => tag.trim()).filter(Boolean) };
    const index = projects.findIndex((project) => project.slug === slug);
    if (index < 0) projects.unshift(item); else projects[index] = item;
    save("Proje bu tarayıcıya kaydedildi. Yayına almak için veri dosyasını indirin."); setForm();
  });
  document.querySelector("[data-reset]").addEventListener("click", () => setForm());
  document.querySelector("[data-export]").addEventListener("click", () => {
    const content = `window.demirYapiProjectCategories = ${JSON.stringify(categories, null, 2)};\n\nwindow.demirYapiProjects = ${JSON.stringify(projects, null, 2)};\n`;
    download("projeler-data.js", content, "text/javascript;charset=utf-8");
    status.textContent = "Veri dosyası indirildi. Proje HTML dosyalarını da ayrı ayrı indirip site kök klasörüne ekleyin.";
  });
  list.addEventListener("click", (event) => {
    const button = event.target.closest("button"); if (!button) return;
    const item = projects.find((project) => project.slug === (button.dataset.edit || button.dataset.file || button.dataset.delete));
    if (!item) return;
    if (button.dataset.edit) { setForm(item); form.scrollIntoView({ behavior: "smooth", block: "start" }); }
    if (button.dataset.file) download(`proje-${item.slug}.html`, detailFile(item), "text/html;charset=utf-8");
    if (button.dataset.delete) { projects = projects.filter((project) => project.slug !== item.slug); save("Proje tarayıcı kaydından silindi. Yayındaki dosyayı güncellemek için veri dosyasını yeniden indirin."); }
  });
  render();
})();
