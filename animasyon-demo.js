(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const elements = document.querySelectorAll(".motion-reveal");
  if (!elements.length) return;

  document.documentElement.classList.add("motion-ready");

  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("motion-visible");
      activeObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -24px 0px"
  });

  elements.forEach((element) => observer.observe(element));
})();
