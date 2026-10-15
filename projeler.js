(function () {
  const categories = window.demirYapiProjectCategories || [];
  const projects = window.demirYapiProjects || [];
  const list = document.querySelector("[data-project-list]");
  const filters = document.querySelector("[data-project-filters]");
  const count = document.querySelector("[data-project-count]");
  if (!list || !filters || !count) return;

  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get("hizmet") || "";
  const active = categories.some((category) => category.slug === requestedService) ? requestedService : "";
  const esc = (value) => String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

  function renderCard(project) {
    return `
      <a class="project-card photo project-card-link" href="proje-detay.html?proje=${encodeURIComponent(project.slug || "")}">
        <img src="${esc(project.image)}" alt="${esc(project.alt || project.title)}" loading="lazy">
        <div class="project-card-copy"><span class="project-category">${esc(project.category)}</span>
          <h3>${esc(project.title)}</h3><p>${esc(project.summary)}</p>
          <span class="project-meta">${esc(project.location)}${project.date ? ` · ${esc(project.date)}` : ""}</span>
          <span class="project-more">Proje detayını görüntüle →</span>
        </div>
      </a>`;
  }

  filters.innerHTML = `<a class="project-filter${active ? "" : " active"}" href="projelerimiz.html">Tüm Hizmetler</a>` + categories.map((category) =>
    `<a class="project-filter${active === category.slug ? " active" : ""}" href="projelerimiz.html?hizmet=${encodeURIComponent(category.slug)}">${esc(category.title)}</a>`
  ).join("");

  const shownCategories = categories.filter((category) => !active || category.slug === active);
  const visibleProjects = projects.filter((project) => !active || project.serviceSlug === active);
  const selected = categories.find((category) => category.slug === active);
  const hero = document.querySelector(".page-hero");
  if (selected && hero) {
    hero.querySelector(".eyebrow").textContent = `${selected.title} Projeleri`;
    hero.querySelector("h1").textContent = `${selected.title} Uygulamaları`;
    hero.querySelector("p:last-child").textContent = selected.summary;
  }

  count.textContent = selected
    ? `${visibleProjects.length} proje · ${selected.title}`
    : `${visibleProjects.length} proje · ${shownCategories.length} hizmet alanı`;

  list.innerHTML = shownCategories.map((category, categoryIndex) => {
    const categoryProjects = visibleProjects.filter((project) => project.serviceSlug === category.slug);
    const subcategories = category.subcategories || [];
    const grouped = subcategories.map((subcategory) => ({
      ...subcategory,
      projects: categoryProjects.filter((project) => project.subcategorySlug === subcategory.slug)
    })).filter((subcategory) => subcategory.projects.length);
    const ungrouped = categoryProjects.filter((project) => !subcategories.some((item) => item.slug === project.subcategorySlug));
    if (ungrouped.length) grouped.push({ slug: "diger-uygulamalar", title: "Diğer uygulamalar", projects: ungrouped });
    if (!categoryProjects.length) return "";

    const sectionId = `service-${category.slug}`;
    const subcategoryNav = grouped.length > 1
      ? `<nav class="project-subcategory-nav" aria-label="${esc(category.title)} alt kategorileri">${grouped.map((subcategory) => `<a href="#subcategory-${category.slug}-${subcategory.slug}">${esc(subcategory.title)}</a>`).join("")}</nav>`
      : "";
    const groups = grouped.map((subcategory) => `
      <section class="project-subcategory" id="subcategory-${category.slug}-${subcategory.slug}">
        <h3>${esc(subcategory.title)}</h3>
        <div class="project-grid visual-grid">${subcategory.projects.map(renderCard).join("")}</div>
      </section>`).join("");

    return `
      <section class="project-service-group" id="${sectionId}" aria-labelledby="${sectionId}-title">
        <div class="project-service-heading">
          <p class="eyebrow">Hizmet ${String(categoryIndex + 1).padStart(2, "0")}</p>
          <div><h2 id="${sectionId}-title">${esc(category.title)}</h2><p>${esc(category.summary)}</p></div>
          <a class="button dark" href="${esc(category.servicePage)}">Hizmet detayına git</a>
        </div>
        ${subcategoryNav}
        ${groups}
      </section>`;
  }).join("") || `<div class="project-empty"><h3>Bu hizmet alanında henüz proje örneği bulunmuyor.</h3><p>Hizmetin kapsamını inceleyebilir veya projeniz için bizimle iletişime geçebilirsiniz.</p><div class="project-empty-actions"><a class="button dark" href="${esc(selected ? selected.servicePage : "hizmetlerimiz.html")}">Hizmet detayına git</a><a class="button primary" href="teklif-al.html">Teklif al</a></div></div>`;
})();
