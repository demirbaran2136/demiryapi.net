(function () {
  const categories = window.demirYapiProjectCategories || [];
  const projects = window.demirYapiProjects || [];
  const container = document.querySelector("[data-project-detail]");
  const slug = new URLSearchParams(window.location.search).get("proje");
  const project = projects.find((item) => item.slug === slug);
  if (!container) return;
  if (!project) {
    container.innerHTML = `<section class="project-not-found"><p class="eyebrow">Proje bulunamadı</p><h1>Bu proje mevcut değil.</h1><a class="button dark" href="projelerimiz.html">Tüm projelere dön</a></section>`;
    return;
  }
  const esc = (value) => String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const category = categories.find((item) => item.slug === project.serviceSlug);
  document.title = `${project.title} | Demir Yapı Projeleri`;
  const tags = (project.tags || []).map((tag) => `<span>${esc(tag)}</span>`).join("");
  container.innerHTML = `
    <section class="project-detail-hero">
      <div class="project-detail-copy"><p class="eyebrow">${esc(project.category)}</p><h1>${esc(project.title)}</h1>
        <p>${esc(project.summary)}</p><div class="project-detail-meta"><span>${esc(project.location)}</span>${project.date ? `<span>${esc(project.date)}</span>` : ""}</div>
        <div class="project-tags">${tags}</div>
        <a class="button primary" href="${category ? esc(category.servicePage) : "hizmetlerimiz.html"}">Bu hizmet hakkında bilgi</a>
      </div><img src="${esc(project.image)}" alt="${esc(project.alt || project.title)}">
    </section>
    <section class="project-detail-body"><p class="eyebrow">Uygulama Özeti</p><h2>Proje kapsamı</h2><p>${esc(project.description || project.summary)}</p>
      <a class="button dark" href="projelerimiz.html?hizmet=${encodeURIComponent(project.serviceSlug)}">${esc(project.category)} projelerinin tümü</a>
    </section>`;
})();
