(function () {
  const categories = window.demirYapiProjectCategories || [];
  const projects = window.demirYapiProjects || [];
  const list = document.querySelector("[data-project-list]");
  const filters = document.querySelector("[data-project-filters]");
  const count = document.querySelector("[data-project-count]");
  if (!list || !filters || !count) return;

  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get("hizmet") || "";
  const pageService = document.body.dataset.projectService || "";
  const requested = pageService || requestedService;
  const active = categories.some((category) => category.slug === requested) ? requested : "";
  const esc = (value) => String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

  function renderCard(project) {
    return `
      <a class="project-card photo project-card-link" href="${esc(project.page || ("proje-" + (project.slug || "") + ".html"))}">
        <img src="${esc(project.image)}" alt="${esc(project.alt || project.title)}" width="960" height="640" loading="lazy" decoding="async">
        <div class="project-card-copy"><span class="project-category">${esc(project.category)}</span>
          <h5>${esc(project.title)}</h5><p>${esc(project.summary)}</p>
          <span class="project-meta">${project.isRepresentative ? "Temsili proje akışı" : `${esc(project.location)}${project.date ? ` · ${esc(project.date)}` : ""}`}</span>
          <span class="project-more">Proje detayını görüntüle →</span>
        </div>
      </a>`;
  }

  filters.classList.add("project-service-tiles");
  filters.setAttribute("aria-label", "Projeleri hizmet alanına göre seçin");
  filters.hidden = Boolean(active);
  filters.style.display = active ? "none" : "grid";
  filters.innerHTML = categories.map((category, index) =>
    `<a class="project-service-tile${active === category.slug ? " active" : ""}" href="${esc(category.page || ("projeler-" + category.slug + ".html"))}"${active === category.slug ? ' aria-current="page"' : ""}>` +
      `<img src="${esc(category.image)}" alt="" width="960" height="640" loading="lazy" decoding="async"><span class="project-service-tile-shade"></span>` +
      `<span class="project-service-tile-copy"><span class="project-service-tile-number">HİZMET ${String(index + 1).padStart(2, "0")}</span><strong>${esc(category.title)}</strong><span class="project-service-tile-action">Projeleri görüntüle →</span></span></a>`
  ).join("");

  const shownCategories = active ? categories.filter((category) => category.slug === active) : [];
  const visibleProjects = projects.filter((project) => !active || project.serviceSlug === active);
  const selected = categories.find((category) => category.slug === active);
  const hero = document.querySelector(".page-hero");
  const sectionTitle = document.querySelector(".projects-section .section-heading h2");

  const canonicalUrl = selected && pageService
    ? "https://demiryapi.net/projeler-" + encodeURIComponent(selected.slug) + ".html"
    : "https://demiryapi.net/projelerimiz.html";
  const pageTitle = selected && pageService
    ? selected.title + " Projeleri | Demir Yapı İstanbul"
    : "İnşaat ve Tadilat Projelerimiz | Demir Yapı İstanbul";
  const pageDescription = selected && pageService
    ? "İstanbul\u0027da " + selected.title + ": " + selected.summary
    : "Demir Yapı projeleri; İstanbul\u0027da inşaat, tadilat, villa yenileme, peyzaj, havuz ve hafriyat alanlarında planlı uygulama örneklerini gösterir.";
  document.title = pageTitle;
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = canonicalUrl;
  const setMetaContent = (selector, value) => {
    const meta = document.querySelector(selector);
    if (meta) meta.setAttribute("content", value);
  };
  setMetaContent('meta[name="description"]', pageDescription);
  setMetaContent('meta[property="og:title"]', pageTitle);
  setMetaContent('meta[property="og:description"]', pageDescription);
  setMetaContent('meta[property="og:url"]', canonicalUrl);
  setMetaContent('meta[name="twitter:title"]', pageTitle);
  setMetaContent('meta[name="twitter:description"]', pageDescription);
  const structuredData = document.querySelector('script[type="application/ld+json"]');
  if (structuredData) {
    try {
      const pageSchema = JSON.parse(structuredData.textContent);
      pageSchema.name = selected && pageService ? pageTitle : "Demir Yapı Projelerimiz";
      pageSchema.url = canonicalUrl;
      pageSchema.description = selected && pageService ? pageDescription : "Demir Yapı\u0027nın inşaat, tadilat, villa yenileme, peyzaj, havuz ve hafriyat uygulama örnekleri.";
      structuredData.textContent = JSON.stringify(pageSchema);
    } catch (error) {
      // Keep the static structured data if it cannot be updated.
    }
  }

  if (selected && hero) {
    hero.querySelector(".eyebrow").textContent = `${selected.title} Projeleri`;
    hero.querySelector("h1").textContent = `${selected.title} Uygulamaları`;
    hero.querySelector("p:last-child").textContent = selected.summary;
  }
  if (sectionTitle) {
    sectionTitle.textContent = "Uygulama Alanları";
  }

  count.textContent = selected
    ? `${visibleProjects.length} temsili proje akışı · ${selected.title}`
    : `${categories.length} hizmet alanı · projeleri görüntülemek için bir kutu seçin`;

  list.innerHTML = shownCategories.map((category) => {
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
    const groups = grouped.map((subcategory) => `
      <section class="project-subcategory" id="subcategory-${category.slug}-${subcategory.slug}">
        <h4>${esc(subcategory.title)}</h4>
        <div class="project-grid visual-grid">${subcategory.projects.map(renderCard).join("")}</div>
      </section>`).join("");

    return `
      <section class="project-service-group" id="${sectionId}" aria-labelledby="${sectionId}-title">
        <div class="project-service-heading">
          <p class="eyebrow">Hizmet ${String(categories.indexOf(category) + 1).padStart(2, "0")}</p>
          <div><h3 id="${sectionId}-title">${esc(category.title)}</h3><p>${esc(category.summary)}</p></div>
          <a class="button dark" href="${esc(category.servicePage)}">Hizmet detayına git</a>
        </div>
        <div class="project-subcategory-grid">${groups}</div>
      </section>`;
  }).join("") || (selected ? `<div class="project-empty"><h3>Bu hizmet alanında henüz proje örneği bulunmuyor.</h3><p>Hizmetin kapsamını inceleyebilir veya projeniz için bizimle iletişime geçebilirsiniz.</p><div class="project-empty-actions"><a class="button dark" href="${esc(selected.servicePage)}">Hizmet detayına git</a><a class="button primary" href="teklif-al.html">Teklif al</a></div></div>` : "");

})();
