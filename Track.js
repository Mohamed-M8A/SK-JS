document.addEventListener("DOMContentLoaded", () => {
  const _0x4a21 = "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J5OHhPVTRFeXJzUElsLWhGMC1QeVVFMmdEQnFLRC1kc05JVGROYTNkY0dnOVVUOVVqMEJmU01rZ1Y0dDNfa0ZVTUU2dy9leGVj";
  const webAppUrl = atob(_0x4a21);
  let actionsList = ["Entry"]; 
  let exitUrl = "Closed Tab/Direct";
  let isSent = false;

  const visitorId = UIDManager.getPersistentId();

  function getCleanUrl(url) {
    if (!url) return "";
    return url.replace("https://souq-alkul.blogspot.com", "") || "/";
  }

  function detectOS() {
    const ua = navigator.userAgent;
    if (ua.indexOf("Android") !== -1) return "Android";
    if (ua.indexOf("like Mac") !== -1) return "iOS";
    if (ua.indexOf("Win") !== -1) return "Windows";
    if (ua.indexOf("Mac") !== -1) return "MacOS";
    if (ua.indexOf("Linux") !== -1) return "Linux";
    return "Unknown OS";
  }

  function prepareData() {
    const ua = navigator.userAgent.toLowerCase();
    const { width, height } = window.screen;
    let browser = ua.includes("edg") ? "Edge" : ua.includes("opr") ? "Opera" : ua.includes("chrome") ? "Chrome" : ua.includes("firefox") ? "Firefox" : "Safari";

    return JSON.stringify({
      entryTime: new Date().toLocaleString('sv-SE'),
      visitorId: visitorId,
      action: actionsList.join(" -> "),
      pageUrl: getCleanUrl(window.location.href),
      referrer: document.referrer || "Direct Search",
      exitDestination: exitUrl,
      os: detectOS(),
      browser: browser,
      screenRes: `${width}x${height}`,
      token: "SECURE_BY_DOMAIN"
    });
  }

  function sendFinalData() {
    if (isSent) return;
    const data = prepareData();
    navigator.sendBeacon(webAppUrl, data);
    isSent = true;
  }

  function setupListeners() {
    document.querySelectorAll("a").forEach(link => {
      link.addEventListener("mousedown", () => {
        if (!link.href.includes("souq-alkul.blogspot.com")) {
          exitUrl = link.href;
          if (!actionsList.includes("Exit Click")) actionsList.push("Exit Click");
        }
      });
    });

    const selectors = [
      { sel: ".buy-button", label: "Buy" },
      { sel: ".add-to-cart", label: "Cart" },
      { sel: ".copy-button", label: "Coupon" },
      { sel: ".tab-buttons button", label: "T:" }
    ];

    selectors.forEach(item => {
      document.querySelectorAll(`${item.sel}:not([data-listened])`).forEach(btn => {
        btn.addEventListener("click", () => {
          const label = item.sel.includes("button") ? item.label + btn.innerText.trim() : item.label;
          if (!actionsList.includes(label)) actionsList.push(label);
        });
        btn.setAttribute("data-listened", "true");
      });
    });
  }

  window.addEventListener("pagehide", sendFinalData);
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") sendFinalData();
  });

  const observer = new MutationObserver(() => {
    clearTimeout(window.__listenerTimeout);
    window.__listenerTimeout = setTimeout(setupListeners, 500);
  });

  observer.observe(document.body, { childList: true, subtree: true });
  setupListeners();
});
