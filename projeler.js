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
          <h5>${esc(project.title)}</h5><p>${esc(project.summary)}</p>
          <span class="project-meta">${esc(project.location)}${project.date ? ` · ${esc(project.date)}` : ""}</span>
          <span class="project-more">Proje detayını görüntüle →</span>
        </div>
      </a>`;
  }

  filters.classList.add("project-service-tiles");
  filters.setAttribute("aria-label", "Projeleri hizmet alanına göre seçin");
  filters.hidden = Boolean(active);
  filters.innerHTML = categories.map((category, index) =>
    `<a class="project-service-tile${active === category.slug ? " active" : ""}" href="projelerimiz.html?hizmet=${encodeURIComponent(category.slug)}" target="_blank" rel="noopener"${active === category.slug ? ' aria-current="page"' : ""}>` +
      `<img src="${esc(category.image)}" alt="" loading="lazy"><span class="project-service-tile-shade"></span>` +
      `<span class="project-service-tile-copy"><span class="project-service-tile-number">HİZMET ${String(index + 1).padStart(2, "0")}</span><strong>${esc(category.title)}</strong><span>${esc(category.summary)}</span><span class="project-service-tile-action">Projeleri görüntüle →</span></span></a>`
  ).join("");

  const shownCategories = active ? categories.filter((category) => category.slug === active) : [];
  const visibleProjects = projects.filter((project) => !active || project.serviceSlug === active);
  const selected = categories.find((category) => category.slug === active);
  const hero = document.querySelector(".page-hero");
  const sectionTitle = document.querySelector(".projects-section .section-heading h2");
  if (selected && hero) {
    hero.querySelector(".eyebrow").textContent = `${selected.title} Projeleri`;
    hero.querySelector("h1").textContent = `${selected.title} Uygulamaları`;
    hero.querySelector("p:last-child").textContent = selected.summary;
  }
  if (sectionTitle) {
    sectionTitle.textContent = "Uygulama Alanları";
  }

  count.textContent = selected
    ? `${visibleProjects.length} proje · ${selected.title}`
    : `${categories.length} hizmet alanı · projeler yeni sekmede açılır`;

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
    const tabList = grouped.length > 1
      ? `<div class="project-subcategory-tabs" role="tablist" aria-label="${esc(category.title)} uygulama alanları">${grouped.map((subcategory, index) => { const tabId = `tab-${category.slug}-${subcategory.slug}`; const panelId = `subcategory-${category.slug}-${subcategory.slug}`; return `<button class="project-subcategory-tab${index === 0 ? " active" : ""}" type="button" role="tab" id="${tabId}" aria-controls="${panelId}" aria-selected="${index === 0}" tabindex="${index === 0 ? "0" : "-1"}" data-project-tab>${esc(subcategory.title)}</button>`; }).join("")}</div>`
      : "";
    const groups = grouped.map((subcategory, index) => `
      <section class="project-subcategory${grouped.length > 1 ? " project-subcategory-panel" : ""}" id="subcategory-${category.slug}-${subcategory.slug}"${grouped.length > 1 ? ` role="tabpanel" aria-labelledby="tab-${category.slug}-${subcategory.slug}"${index === 0 ? "" : " hidden"}` : ""}>
        ${grouped.length > 1 ? "" : `<h4>${esc(subcategory.title)}</h4>`}
        <div class="project-grid visual-grid">${subcategory.projects.map(renderCard).join("")}</div>
      </section>`).join("");

    return `
      <section class="project-service-group" id="${sectionId}" aria-labelledby="${sectionId}-title">
        <div class="project-service-heading">
          <p class="eyebrow">Hizmet ${String(categories.indexOf(category) + 1).padStart(2, "0")}</p>
          <div><h3 id="${sectionId}-title">${esc(category.title)}</h3><p>${esc(category.summary)}</p></div>
          <a class="button dark" href="${esc(category.servicePage)}">Hizmet detayına git</a>
        </div>
        ${tabList}
        ${groups}
      </section>`;
  }).join("") || (selected ? `<div class="project-empty"><h3>Bu hizmet alanında henüz proje örneği bulunmuyor.</h3><p>Hizmetin kapsamını inceleyebilir veya projeniz için bizimle iletişime geçebilirsiniz.</p><div class="project-empty-actions"><a class="button dark" href="${esc(selected.servicePage)}">Hizmet detayına git</a><a class="button primary" href="teklif-al.html">Teklif al</a></div></div>` : `<div class="project-empty project-service-prompt"><p>İlgili projeleri görmek için yukarıdaki hizmet kutularından birini seçin.</p></div>`);

  list.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-project-tab]");
    if (!tab) return;
    const tabList = tab.closest('[role="tablist"]');
    const panelId = tab.getAttribute("aria-controls");
    const panel = document.getElementById(panelId);
    tabList.querySelectorAll('[role="tab"]').forEach((item) => {
      const isActive = item === tab;
      item.setAttribute("aria-selected", String(isActive));
      item.tabIndex = isActive ? 0 : -1;
      item.classList.toggle("active", isActive);
    });
    tabList.parentElement.querySelectorAll('[role="tabpanel"]').forEach((item) => { item.hidden = item !== panel; });
  });

  list.addEventListener("keydown", (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const tabs = [...tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]')];
    const currentIndex = tabs.indexOf(tab);
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (currentIndex + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    event.preventDefault();
    tabs[nextIndex].focus();
    tabs[nextIndex].click();
  });
})();
