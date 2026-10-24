(function(){
  var query = window.matchMedia("(prefers-reduced-motion: reduce)");
  var selector = [".hero-content",".about-section > img",".about-copy",".page-hero > *",".service-page-hero > img",".service-page-hero > div",".section-heading",".image-card",".service-card",".service-detail",".related-service-card",".trust-strip > *",".trust-section > article",".why-grid > article",".service-process-grid > article",".service-faq-grid > article",".service-gallery figure",".service-page-content > *",".blog-lead-card",".blog-topic-grid > article",".blog-card-link",".blog-service-tiles > a",".blog-service-content > *",".blog-faq-grid > details",".blog-related-link",".blog-service-hint",".project-service-heading",".project-count",".project-empty",".project-service-prompt",".project-service-tiles > a",".project-service-group",".project-subcategory-grid > *",".project-grid > a",".project-card-link",".project-detail-hero > *",".project-detail-body > *",".article-content-inner",".related-guides",".quote-copy",".quote-form-card",".quote-benefits > article",".contact-copy",".contact-panel",".map-card",".map-card-copy",".privacy-content > article",".landing-cta-inner > *",".blog-form-cta-inner > *",".detail-section > article",".stats-section > *",".stat-card",".mobile-contact-bar > a"].join(",");
  var observer = null;
  var mutations = null;
  var order = 0;
  function teardown(){if(observer){observer.disconnect();observer=null}if(mutations){mutations.disconnect();mutations=null}document.documentElement.classList.remove("motion-pending")}
  function start(){
    teardown();
    if(query.matches || !("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("motion-pending");
    observer = new IntersectionObserver(function(entries, active){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add("motion-visible");active.unobserve(entry.target)}})},{threshold:.1,rootMargin:"0px 0px -28px 0px"});
    var register = function(node){if(!node || node.nodeType!==1 || node.classList.contains("motion-reveal")) return;var rect=node.getBoundingClientRect();if(rect.bottom>0 && rect.top<window.innerHeight)return;node.classList.add("motion-reveal");node.style.setProperty("--motion-delay",((order++%5)*45)+"ms");observer.observe(node)};
    var scan = function(root){if(root.nodeType===1 && root.matches(selector)) register(root);if(root.querySelectorAll) root.querySelectorAll(selector).forEach(register)};
    scan(document);
    mutations = new MutationObserver(function(records){records.forEach(function(record){record.addedNodes.forEach(scan)})});
    mutations.observe(document.querySelector("main") || document.body,{childList:true,subtree:true});
  }
  if(query.addEventListener) query.addEventListener("change",start); else if(query.addListener) query.addListener(start);
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start,{once:true}); else start();
})();
