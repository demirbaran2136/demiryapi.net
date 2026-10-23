(function () {
  const categories = window.demirYapiProjectCategories || [];
  const projects = window.demirYapiProjects || [];
  const list = document.querySelector("[data-project-list]");
  const count = document.querySelector("[data-project-count]");
  if (!list || !count) return;

  const esc = (value) => String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

  function renderCard(project) {
    const service = categories.find((item) => item.slug === project.serviceSlug);
    const subcategory = service?.subcategories?.find((item) => item.slug === project.subcategorySlug);
    return `
      <a class="project-card photo project-card-link" href="proje-detay.html?proje=${encodeURIComponent(project.slug || "")}">
        <img src="${esc(project.image)}" alt="${esc(project.alt || project.title)}" width="960" height="640" loading="lazy" decoding="async">
        <div class="project-card-copy"><span class="project-card-number">PROJE ${projects.filter((item) => item.serviceSlug === project.serviceSlug).findIndex((item) => item.slug === project.slug) + 1}</span><span class="project-category">${esc(subcategory?.title || project.category)}</span>
          <h5>${esc(project.title)}</h5><p>${esc(project.summary)}</p>
          <span class="project-meta">${esc(project.location)}${project.date ? ` · ${esc(project.date)}` : ""}</span>
          <span class="project-more">Proje detayını görüntüle →</span>
        </div>
      </a>`;
  }

  const shownCategories = categories;
  const visibleProjects = projects;
  const sectionTitle = document.querySelector(".projects-section .section-heading h2");
  if (sectionTitle) {
    sectionTitle.textContent = "Hizmet alanlarına göre proje akışı";
  }

  count.textContent = categories.length + " hizmet alanı · " + projects.length + " temsili proje akışı";

  list.innerHTML = shownCategories.map((category) => {
    const categoryProjects = visibleProjects.filter((project) => project.serviceSlug === category.slug);
    if (!categoryProjects.length) return "";

    const sectionId = `service-${category.slug}`;

    return `
      <section class="project-service-group" id="${sectionId}" aria-labelledby="${sectionId}-title">
        <div class="project-service-heading">
          <p class="eyebrow">Hizmet ${String(categories.indexOf(category) + 1).padStart(2, "0")}</p>
          <div><h3 id="${sectionId}-title">${esc(category.title)}</h3><p>${esc(category.summary)}</p></div>
          <a class="button dark" href="${esc(category.servicePage)}">Hizmet detayına git</a>
        </div>
        <div class="project-grid visual-grid project-service-projects">${categoryProjects.map(renderCard).join("")}</div>
      </section>`;
  }).join("") || '<p class="project-empty">Henüz proje kaydı bulunmuyor.</p>';

  const requestedService = new URLSearchParams(window.location.search).get("hizmet");
  if (requestedService) {
    document.getElementById(`service-${requestedService}`)?.scrollIntoView({ block: "start" });
  }

})();
