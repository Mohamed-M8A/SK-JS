/* -------------------------------------------------
   ThemeScript.js
   - Lazyload
   - Dark Mode Toggle (فوري + أيقونة تتبدل)
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
      darkBtn = doc.getElementById("dark-toggler"),
      iconUse = darkBtn ? darkBtn.querySelector("use") : null;

  function switchIcon(theme){
    if(!iconUse) return;
    if(theme === "dark"){
      iconUse.setAttribute("xlink:href","#i-sun");
      iconUse.setAttribute("href","#i-sun");
    } else {
      iconUse.setAttribute("xlink:href","#i-moon");
      iconUse.setAttribute("href","#i-moon");
    }
  }

  function applyTheme(theme, persist){
    if(theme === "dark"){
      addClass(htmlEl,"dark-mode");
      htmlEl.setAttribute("data-theme","dark");
    } else {
      removeClass(htmlEl,"dark-mode");
      htmlEl.setAttribute("data-theme","light");
    }
    switchIcon(theme);
    if(persist) stSet("theme", theme);
  }

  // استرجاع الثيم عند أول تحميل
  var savedTheme = stGet("theme");
  if(!savedTheme){
    savedTheme = M.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  applyTheme(savedTheme,false);

  // الضغط على الزر
  if(darkBtn){
    darkBtn.addEventListener("click",function(e){
      e.preventDefault();
      var isDark = htmlEl.classList.contains("dark-mode");
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
    return link && link.href && ["http:","https:"].includes(link.protocol);
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
