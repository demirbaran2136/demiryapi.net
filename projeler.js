(function () {
  const grid = document.querySelector("[data-project-list]");

  if (!grid || !Array.isArray(window.demirYapiProjects)) {
    return;
  }

  grid.innerHTML = window.demirYapiProjects.map((project) => {
    const tags = (project.tags || []).map((tag) => `<span>${tag}</span>`).join("");

    return `
      <article class="project-card photo">
        <img src="${project.image}" alt="${project.alt}" loading="lazy">
        <div class="project-meta">
          <span>${project.category}</span>
          <span>${project.location}</span>
          <span>${project.date}</span>
        </div>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <div class="project-tags">${tags}</div>
      </article>
    `;
  }).join("");
}());
