(function () {
  const phone = "905452362136";
  const quoteMessage = "Merhaba Demir Yap\u0131, web sitenizden teklif almak istiyorum. Projem hakk\u0131nda bilgi payla\u015faca\u011f\u0131m.";
  const quoteWhatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(quoteMessage)}`;
  const isQuotePage = /(^|\/)teklif-al\.html$/i.test(window.location.pathname);
  const consentStorageKey = "demirYapiCookieConsent";
  const consentMaxAge = 180 * 24 * 60 * 60 * 1000;
  let sessionConsent = null;
  const googleAdsId = "";
  const conversionLabels = {
    phone: "",
    whatsapp: "",
    quote: "",
    form: ""
  };

  function setupGoogleAdsTag() {
    if (!hasAdsConsent() || !googleAdsId || !googleAdsId.startsWith("AW-") || window.googleAdsTagLoaded) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      wait_for_update: 500
    });
    window.gtag("js", new Date());
    window.gtag("config", googleAdsId);
    window.gtag("consent", "update", getGoogleConsentState(true));
    window.googleAdsTagLoaded = true;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAdsId)}`;
    document.head.appendChild(script);
  }

  function hasAdsConsent() {
    const consent = readConsent();
    return Boolean(consent && consent.ads === true);
  }

  function readConsent() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(consentStorageKey) || "null");
      if (!saved || typeof saved.ads !== "boolean" || !Number.isFinite(saved.savedAt)) return null;
      if (Date.now() - saved.savedAt > consentMaxAge) {
        window.localStorage.removeItem(consentStorageKey);
        return null;
      }
      return saved;
    } catch (error) {
      return sessionConsent;
    }
  }

  function getGoogleConsentState(granted) {
    return {
      ad_storage: granted ? "granted" : "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied"
    };
  }

  function clearAdvertisingCookies() {
    const names = document.cookie.split(";").map((cookie) => cookie.split("=")[0].trim());
    names.filter((name) => name.startsWith("_gcl_") || name.startsWith("_gac_")).forEach((name) => {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${window.location.hostname}; SameSite=Lax`;
    });
  }

  function saveConsent(ads) {
    const consent = { ads: Boolean(ads), savedAt: Date.now() };
    sessionConsent = consent;
    try {
      window.localStorage.setItem(consentStorageKey, JSON.stringify(consent));
    } catch (error) {
      // The site remains usable when browser storage is unavailable.
    }

    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", getGoogleConsentState(consent.ads));
    }
    if (consent.ads) setupGoogleAdsTag();
    else clearAdvertisingCookies();
    return consent;
  }

  function addLegalFooterLinks() {
    const footerBottom = document.querySelector(".footer-bottom");
    if (!footerBottom || footerBottom.querySelector(".footer-legal-controls")) return;

    const controls = document.createElement("nav");
    controls.className = "footer-legal-controls";
    controls.setAttribute("aria-label", "Gizlilik ve çerez tercihleri");
    controls.innerHTML = '<a href="gizlilik-ve-cerez-politikasi.html">Gizlilik ve Çerez Politikası</a><button type="button" data-open-cookie-settings>Çerez Tercihleri</button>';
    footerBottom.appendChild(controls);
  }

  function setupCookieConsent() {
    const panel = document.createElement("aside");
    panel.className = "cookie-consent";
    panel.setAttribute("aria-label", "Çerez tercihleri");
    panel.hidden = true;
    panel.innerHTML = `
      <div class="cookie-consent__copy">
        <strong>Gizlilik tercihiniz</strong>
        <p>Reklam ölçüm etiketleri, Google Ads hesabı bağlandıktan sonra yalnızca izninizle yüklenir. Zorunlu site işlevleri için tercih kaydı tarayıcınızda saklanır.</p>
        <a href="gizlilik-ve-cerez-politikasi.html">Gizlilik ve Çerez Politikası</a>
      </div>
      <div class="cookie-consent__actions">
        <button type="button" data-cookie-accept>İsteğe bağlıları kabul et</button>
        <button type="button" data-cookie-reject>Reddet</button>
        <button type="button" data-cookie-manage aria-expanded="false">Tercihleri yönet</button>
      </div>
      <div class="cookie-consent__details" hidden>
        <label><input type="checkbox" data-cookie-ads> Google Ads reklam ölçümü</label>
        <p>Bu ayar kapalıyken Google Ads etiketi yüklenmez. Tercihinizi daha sonra sayfanın altındaki “Çerez Tercihleri” bağlantısından değiştirebilirsiniz.</p>
        <div class="cookie-consent__details-actions">
          <button type="button" data-cookie-save>Seçimi kaydet</button>
          <button type="button" data-cookie-reject>İsteğe bağlıları reddet</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    const details = panel.querySelector(".cookie-consent__details");
    const adsToggle = panel.querySelector("[data-cookie-ads]");
    const manageButton = panel.querySelector("[data-cookie-manage]");
    const currentConsent = readConsent();
    adsToggle.checked = Boolean(currentConsent && currentConsent.ads);

    function openPreferences(showDetails) {
      const saved = readConsent();
      adsToggle.checked = Boolean(saved && saved.ads);
      panel.hidden = false;
      details.hidden = !showDetails;
      manageButton.setAttribute("aria-expanded", String(showDetails));
      if (showDetails) adsToggle.focus();
    }

    panel.querySelector("[data-cookie-accept]").addEventListener("click", () => {
      saveConsent(true);
      panel.hidden = true;
    });
    panel.querySelectorAll("[data-cookie-reject]").forEach((button) => {
      button.addEventListener("click", () => {
        saveConsent(false);
        panel.hidden = true;
      });
    });
    manageButton.addEventListener("click", () => openPreferences(true));
    panel.querySelector("[data-cookie-save]").addEventListener("click", () => {
      saveConsent(adsToggle.checked);
      panel.hidden = true;
    });
    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-open-cookie-settings]")) openPreferences(true);
    });

    if (!currentConsent) openPreferences(false);
    else if (currentConsent.ads) setupGoogleAdsTag();
  }

  function trackEvent(eventName, details) {
    if (!hasAdsConsent() || !googleAdsId || typeof window.gtag !== "function") return;

    const payload = Object.assign({ event: eventName }, details || {});

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);

    window.gtag("event", eventName, details || {});
  }

  function trackConversion(type, eventName, details) {
    trackEvent(eventName, details);

    const label = conversionLabels[type];
    if (!hasAdsConsent() || !googleAdsId || !label || typeof window.gtag !== "function") return;

    window.gtag("event", "conversion", {
      send_to: `${googleAdsId}/${label}`,
      event_category: "lead",
      event_label: details && details.event_label ? details.event_label : type
    });
  }

  function addMobileContactBar() {
    if (document.querySelector(".mobile-contact-bar")) return;

    const bar = document.createElement("nav");
    bar.className = "mobile-contact-bar";
    bar.setAttribute("aria-label", "H\u0131zl\u0131 ileti\u015fim");
    const mobileQuoteHref = isQuotePage ? "#quote-form" : quoteWhatsappUrl;
    const mobileQuoteTarget = isQuotePage ? "" : ' target="_blank" rel="noopener"';
    bar.innerHTML = `
      <a href="tel:+${phone}" data-track="phone_click" data-track-label="Mobil Alt Bar">Ara</a>
      <a href="https://wa.me/${phone}?text=Merhaba%20Demir%20Yap%C4%B1%2C%20bilgi%20almak%20istiyorum." target="_blank" rel="noopener" data-track="whatsapp_click" data-track-label="Mobil Alt Bar">WhatsApp</a>
      <a href="${mobileQuoteHref}"${mobileQuoteTarget} data-track="quote_click" data-track-label="Mobil Alt Bar">${isQuotePage ? "Forma Git" : "Teklif Al"}</a>
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

      trackConversion("form", "quote_form_whatsapp_open", {
        event_category: "lead",
        event_label: service || "Teklif Formundan WhatsApp Acildi"
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

      if (!isQuotePage && href.includes("teklif-al.html") && link.dataset.directForm !== "true") {
        event.preventDefault();
        window.open(quoteWhatsappUrl, "_blank", "noopener");
      }

      const conversionType = eventName === "phone_click"
        ? "phone"
        : eventName === "whatsapp_click"
          ? "whatsapp"
          : "quote";

      trackConversion(conversionType, eventName, {
        event_category: "lead",
        event_label: link.dataset.trackLabel || link.textContent.trim() || href,
        page_path: window.location.pathname
      });
    });
  }

  addLegalFooterLinks();
  setupCookieConsent();
  addMobileContactBar();
  setupQuoteForm();
  setupClickTracking();
}());
