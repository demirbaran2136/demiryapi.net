(function () {
  const phone = "905452362136";

  function trackEvent(eventName, details) {
    const payload = Object.assign({ event: eventName }, details || {});

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);

    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, details || {});
    }
  }

  function addMobileContactBar() {
    if (document.querySelector(".mobile-contact-bar")) return;

    const bar = document.createElement("nav");
    bar.className = "mobile-contact-bar";
    bar.setAttribute("aria-label", "H\u0131zl\u0131 ileti\u015fim");
    bar.innerHTML = `
      <a href="tel:+${phone}" data-track="phone_click" data-track-label="Mobil Alt Bar">Ara</a>
      <a href="https://wa.me/${phone}?text=Merhaba%20Demir%20Yap%C4%B1%2C%20bilgi%20almak%20istiyorum." target="_blank" rel="noopener" data-track="whatsapp_click" data-track-label="Mobil Alt Bar">WhatsApp</a>
      <a href="teklif-al.html" data-track="quote_click" data-track-label="Mobil Alt Bar">Teklif Al</a>
    `;
    document.body.appendChild(bar);
  }

  function setupQuoteForm() {
    const form = document.querySelector("#quote-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const service = data.get("service") || "";
      const message = [
        "Merhaba Demir Yap\u0131, teklif almak istiyorum.",
        "",
        `Ad Soyad: ${data.get("name") || ""}`,
        `Telefon: ${data.get("phone") || ""}`,
        `Hizmet: ${service}`,
        `\u0130l\u00e7e / Konum: ${data.get("district") || ""}`,
        `A\u00e7\u0131klama: ${data.get("message") || ""}`
      ].join("\n");

      trackEvent("quote_form_submit", {
        event_category: "lead",
        event_label: service || "Teklif Formu"
      });

      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    });
  }

  function setupClickTracking() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a, button");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      let eventName = link.dataset.track || "";

      if (!eventName && href.startsWith("tel:")) eventName = "phone_click";
      if (!eventName && href.includes("wa.me")) eventName = "whatsapp_click";
      if (!eventName && href.includes("teklif-al.html")) eventName = "quote_click";

      if (!eventName) return;

      trackEvent(eventName, {
        event_category: "lead",
        event_label: link.dataset.trackLabel || link.textContent.trim() || href,
        page_path: window.location.pathname
      });
    });
  }

  addMobileContactBar();
  setupQuoteForm();
  setupClickTracking();
}());
