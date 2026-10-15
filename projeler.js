(function () {
  const categories = window.demirYapiProjectCategories || [];
  const projects = window.demirYapiProjects || [];
  const list = document.querySelector("[data-project-list]");
  const filters = document.querySelector("[data-project-filters]");
  const count = document.querySelector("[data-project-count]");
  if (!list || !filters) return;

  const params = new URLSearchParams(window.location.search);
  let active = params.get("hizmet") || "";
  const esc = (value) => String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

  filters.innerHTML = `<a class="project-filter${active ? "" : " active"}" href="projelerimiz.html">Tüm Hizmetler</a>` + categories.map((category) =>
    `<a class="project-filter${active === category.slug ? " active" : ""}" href="projelerimiz.html?hizmet=${encodeURIComponent(category.slug)}">${esc(category.title)}</a>`
  ).join("");

  const selected = categories.find((category) => category.slug === active);
  const visible = projects.filter((project) => !active || project.serviceSlug === active);
  if (selected) {
    const hero = document.querySelector(".page-hero");
    if (hero) {
      hero.querySelector(".eyebrow").textContent = `${selected.title} Projeleri`;
      hero.querySelector("h1").textContent = `${selected.title} Uygulamalarımız`;
      hero.querySelector("p:last-child").textContent = selected.summary;
    }
  }

  count.textContent = `${visible.length} proje gösteriliyor`;
  list.innerHTML = visible.length ? visible.map((project) => `
    <a class="project-card photo project-card-link" href="proje-detay.html?proje=${encodeURIComponent(project.slug || "")}">
      <img src="${esc(project.image)}" alt="${esc(project.alt || project.title)}" loading="lazy">
      <div class="project-card-copy"><span class="project-category">${esc(project.category)}</span>
        <h3>${esc(project.title)}</h3><p>${esc(project.summary)}</p>
        <span class="project-meta">${esc(project.location)}${project.date ? ` · ${esc(project.date)}` : ""}</span>
        <span class="project-more">Proje detayını görüntüle →</span>
      </div>
    </a>`).join("") : `<div class="project-empty"><h3>Bu hizmet için henüz proje eklenmemiş.</h3><p>Yeni proje eklemek için Proje Yönetimi ekranını kullanabilirsiniz.</p></div>`;
})();
