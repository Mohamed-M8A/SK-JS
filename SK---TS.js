/* -------------------------------------------------
   ThemeScript.js
   - Lazyload
   - Dark Mode Toggle (فوري + أيقونات بالكلاسات)
   - Back To Top
   - Google Ads Loader
   - instant.page (Prefetch Links)
------------------------------------------------- */

(function ThemeScript(){
  var M = window,
      doc = document;

  /* ------------------------
     Helpers
  ------------------------ */
  function hasClass(el, cls){ return el && (" "+el.className+" ").indexOf(" "+cls+" ") > -1 }
  function addClass(el, cls){ if(el && !hasClass(el,cls)) el.className += (el.className ? " " : "")+cls }
  function removeClass(el, cls){ if(el) el.className = el.className.replace(new RegExp("(?:^|\\s)"+cls+"(?!\\S)","g"),"").trim() }

  // localStorage safe
  var store;
  try{ store = window.localStorage }catch(e){ store = null }
  function stGet(k){ try{ return store ? store.getItem(k) : null }catch(e){ return null } }
  function stSet(k,v){ try{ if(store) store.setItem(k,v) }catch(e){} }

  /* ------------------------
     Dark Mode Toggle
  ------------------------ */
  var htmlEl = doc.documentElement,
      bodyEl = doc.body,
      darkBtn = doc.getElementById("dark-toggler");

  function applyTheme(theme, persist){
    if(theme === "dark"){
      addClass(bodyEl,"dark");
      htmlEl.setAttribute("data-theme","dark");
      if(darkBtn) darkBtn.classList.add("is-dark"); // 👈 لتبديل الأيقونات
    } else {
      removeClass(bodyEl,"dark");
      htmlEl.setAttribute("data-theme","light");
      if(darkBtn) darkBtn.classList.remove("is-dark");
    }
    if(persist) stSet("theme", theme);
  }

  // أول تحميل → استرجاع الثيم
  var savedTheme = stGet("theme");
  if(!savedTheme){
    savedTheme = M.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  applyTheme(savedTheme,false);

  // عند الضغط → تبديل فوري
  if(darkBtn){
    darkBtn.addEventListener("click",function(e){
      e.preventDefault();
      var isDark = hasClass(bodyEl,"dark");
      applyTheme(isDark ? "light" : "dark", true);
    });
  }

  /* ------------------------
     Back To Top
  ------------------------ */
  var backTop = doc.getElementById("back-to-top");
  M.addEventListener("scroll",function(){
    if(!backTop) return;
    if(this.pageYOffset >= 1000){
      removeClass(backTop,"d-none");
    } else {
      addClass(backTop,"d-none");
    }
  },false);

  /* ------------------------
     Lazyload Handler
  ------------------------ */
  function lazyHandler(img){
    if(img.tagName == "IMG"){
      var ds = img.getAttribute("data-src");
      if(ds){ img.src = ds; img.removeAttribute("data-src"); }
    }
  }
  if("IntersectionObserver" in M){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          lazyHandler(entry.target);
          io.unobserve(entry.target);
        }
      });
    });
    doc.querySelectorAll("img.lazyload").forEach(function(el){ io.observe(el); });
  }

  /* ------------------------
     Google Ads Loader
  ------------------------ */
  var caId = (typeof M.caPubAdsense !== "undefined") ? (M.caPubAdsense || "").replace(/^\D+/g,"") : "";
  var clientId = caId ? "ca-pub-" + caId : "";
  if(clientId){
    var s = doc.createElement("script");
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="+clientId;
    s.async = true;
    s.crossOrigin = "anonymous";
    doc.head.appendChild(s);
  }

})();

/* -------------------------------------------------
   instant.page v5.2.0 (Prefetch Links)
------------------------------------------------- */
(function(){
  let lastEvent, hoverTimer, prefetched = new Set;
  const threshold = 1111, hoverDelay = 65;

  function onTouchStart(ev) {
    lastEvent = performance.now();
    const link = ev.target.closest("a");
    if (isValid(link)) prefetch(link.href, "high");
  }
  function onMouseOver(ev) {
    if (performance.now() - lastEvent < threshold) return;
    const link = ev.target.closest("a");
    if (isValid(link)) {
      link.addEventListener("mouseout", onMouseOut, { passive: true });
      hoverTimer = setTimeout(() => {
        prefetch(link.href, "high");
        hoverTimer = void 0;
      }, hoverDelay);
    }
  }
  function onMouseOut() { if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = void 0; } }
  function onMouseDown(ev) { const link = ev.target.closest("a"); if (isValid(link)) prefetch(link.href,"high"); }

  function isValid(link) {
    return link && link.href && ["http:","https:"].includes(link.protocol) && link.origin===location.origin;
  }
  function prefetch(href, priority = "auto") {
    if (prefetched.has(href)) return;
    const el = document.createElement("link");
    el.rel = "prefetch"; el.href = href; el.fetchPriority = priority; el.as = "document";
    document.head.appendChild(el);
    prefetched.add(href);
  }

  if (!document.createElement("link").relList.supports("prefetch")) return;
  document.addEventListener("touchstart", onTouchStart, { capture: true, passive: true });
  document.addEventListener("mouseover", onMouseOver, { capture: true, passive: true });
  document.addEventListener("mousedown", onMouseDown, { capture: true, passive: true });
})();
