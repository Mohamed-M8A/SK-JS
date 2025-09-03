/* -------------------------------------------------
   ThemeScript.js
   - Lazyload
   - Dark Mode Toggle (no-reload, dual-target)
   - Back To Top
   - Google Ads Loader
   - instant.page (Prefetch Links)
------------------------------------------------- */

(function ThemeScript(){
  var M = window,
      doc = document,
      au = "-rw",
      UNDEF = "undefined";

  /* ------------------------
     Helpers
  ------------------------ */
  function hasClass(el, cls){ return el && (" "+el.className+" ").indexOf(" "+cls+" ") > -1 }
  function addClass(el, cls){ if(el && !hasClass(el,cls)) el.className += (el.className ? " " : "")+cls }
  function removeClass(el, cls){ if(el) el.className = el.className.replace(new RegExp("(?:^|\\s)"+cls+"(?!\\S)","g"),"").trim() }

  // localStorage safe wrappers (علشان لو متعطل)
  var store = (function(){
    try { return window.localStorage } catch(e){ return null }
  })();
  function stGet(k){ try{ return store ? store.getItem(k) : null }catch(e){ return null } }
  function stSet(k,v){ try{ if(store) store.setItem(k,v) }catch(e){} }

  /* ------------------------
     Lazyload for images
  ------------------------ */
  var lazyFlag = store !== null && 1 == stGet("lazy");
  var lazyHandler = function(img){
    if(img.tagName == "IMG"){
      var dataSrc = img.getAttribute("data-src") || "";
      if(/(bp.blogspot|googleusercontent)/.test(dataSrc)){
        var ratio = lazyFlag ? (M.devicePixelRatio && M.devicePixelRatio > 1 ? M.devicePixelRatio : 1.5) : 1;
        var newWidth = (img.offsetWidth*ratio).toFixed(0);
        var sizeStr = "s"+newWidth+au;
        dataSrc = dataSrc.replace(/\/s\d+/, "/"+sizeStr);
        img.setAttribute("data-src",dataSrc);
      }
    }
  };

  /* ------------------------
     Dark Mode (dual binding)
     - يطبّق على html[data-theme] + body.dark
     - يبدّل الأيقونات بـ hidden لتفادي تعارض CSS
     - يعمل فورًا بدون ريلود
  ------------------------ */
  var htmlEl = doc.documentElement;
  var bodyEl = doc.body;

  function queryIcons(){
    var btn = doc.getElementById("dark-toggler");
    // جوه الزر بنلاقي الـ <use> بحسب كلاساتها
    return {
      btn: btn,
      sun: btn ? btn.querySelector(".icon-sun") : null,
      moon: btn ? btn.querySelector(".icon-moon") : null
    };
  }

  function applyIcons(theme){
    var icons = queryIcons();
    if(!icons.btn) return;
    var isDark = theme === "dark";
    if(icons.sun) icons.sun.hidden = !isDark;  // في الداكن نعرض الشمس
    if(icons.moon) icons.moon.hidden = isDark; // وفي الفاتح نعرض القمر
  }

  function applyTheme(theme, persist){
    var t = (theme === "dark") ? "dark" : "light";
    // html[data-theme]
    htmlEl.setAttribute("data-theme", t);
    // body.dark (توافق مع CSS قديم)
    if(t === "dark"){ addClass(bodyEl,"dark"); } else { removeClass(bodyEl,"dark"); }
    // أيقونات
    applyIcons(t);
    if(persist) stSet("theme", t);
  }

  // حدد الثيم الابتدائي فورًا
  var initialTheme = stGet("theme");
  if(!initialTheme){
    // fallback لنظام المستخدم
    initialTheme = M.matchMedia && M.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  applyTheme(initialTheme, false);

  // ربط الكليك بأسلوب delegation (يشتغل حتى لو الزر اتضاف بعدين)
  doc.addEventListener("click", function(ev){
    var btn = ev.target.closest && ev.target.closest("#dark-toggler");
    if(!btn) return;
    ev.preventDefault();
    var current = htmlEl.getAttribute("data-theme") === "dark" ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark", true);
  }, {passive:false, capture:false});

  // لو اتغيّر تفضيل النظام أثناء الجلسة ومفيش تخزين سابق، نتابعه
  if(!stGet("theme") && M.matchMedia){
    try{
      var mm = M.matchMedia("(prefers-color-scheme: dark)");
      mm.addEventListener ? mm.addEventListener("change", function(e){
        applyTheme(e.matches ? "dark" : "light", false);
      }) : mm.addListener && mm.addListener(function(e){
        applyTheme(e.matches ? "dark" : "light", false);
      });
    }catch(e){}
  }

  /* ------------------------
     Back To Top
  ------------------------ */
  var backTop = doc.getElementById("back-to-top");
  M.addEventListener("scroll", function(){
    if(!backTop) return;
    // لو عايز العكس بدّل الشرط
    if(this.pageYOffset >= 1000){
      removeClass(backTop,"d-none");
    } else {
      addClass(backTop,"d-none");
    }
  }, false);

  /* ------------------------
     Google Ads Loader
  ------------------------ */
  var caId = (typeof M.caPubAdsense !== UNDEF) ? (M.caPubAdsense || "").replace(/^\D+/g,"") : "";
  var clientId = caId ? "ca-pub-" + caId : "";

  (function(){
    if(!clientId) return;
    if(typeof M.adsbygoogle === UNDEF) M.adsbygoogle = [];
    // استخدم محملك لو عندك (Defer.js). لو مش موجود، نضيف سكربت عادي.
    if(typeof M.Defer !== UNDEF && M.Defer.js){
      M.Defer.js("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="+clientId, "adsbygoogle", 100);
    } else {
      var s = doc.createElement("script");
      s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="+clientId;
      s.async = true;
      s.crossOrigin = "anonymous";
      doc.head.appendChild(s);
    }
  })();

  /* ------------------------
     Lazyload Handler
     (لو عندك Defer.dom، هنستخدمه؛ وإلا هنفعل Fallback بسيط)
  ------------------------ */
  if(typeof M.Defer !== UNDEF && M.Defer.dom){
    M.Defer.dom(".lazyload", 1, "loaded", lazyHandler);
  } else {
    // Fallback بسيط باستخدام IntersectionObserver
    if("IntersectionObserver" in M){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            var el = entry.target;
            lazyHandler(el);
            var ds = el.getAttribute("data-src");
            if(ds){ el.setAttribute("src", ds); el.removeAttribute("data-src"); }
            io.unobserve(el);
          }
        });
      });
      doc.querySelectorAll(".lazyload").forEach(function(el){ io.observe(el); });
    }
  }

})();
  
/* -------------------------------------------------
   instant.page v5.2.0 (Prefetch Links)
   (نفس الكود بتاعك، بدون لمس)
------------------------------------------------- */
(function(){
  let allowQuery, allowExternal, whitelist, lastEvent, hoverTimer, chromeVer = null,
      hoverDelay = 65, prefetched = new Set;
  const threshold = 1111;

  function onTouchStart(ev) {
    lastEvent = performance.now();
    const link = ev.target.closest("a");
    if (isValid(link)) prefetch(link.href, "high");
  }

  function onMouseOver(ev) {
    if (performance.now() - lastEvent < threshold) return;
    if (!("closest" in ev.target)) return;
    const link = ev.target.closest("a");
    if (isValid(link)) {
      link.addEventListener("mouseout", onMouseOut, { passive: true });
      hoverTimer = setTimeout(() => {
        prefetch(link.href, "high");
        hoverTimer = void 0;
      }, hoverDelay);
    }
  }

  function onMouseDown(ev) {
    const link = ev.target.closest("a");
    if (isValid(link)) prefetch(link.href, "high");
  }

  function onMouseOut(ev) {
    if (ev.relatedTarget && ev.target.closest("a") == ev.relatedTarget.closest("a")) return;
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = void 0;
    }
  }

  function onClick(ev) {
    if (performance.now() - lastEvent < threshold) return;
    const link = ev.target.closest("a");
    if (ev.which > 1 || ev.metaKey || ev.ctrlKey) return;
    if (!link) return;
    link.addEventListener("click",function(e2){
      if (e2.detail != 1337) e2.preventDefault();
    },{ capture: true, passive: false, once: true });
    const fake = new MouseEvent("click",{view: window,bubbles: true,cancelable: false,detail: 1337});
    link.dispatchEvent(fake);
  }

  function isValid(link) {
    if (link && link.href && (!whitelist || "instant" in link.dataset)) {
      if (link.origin != location.origin) {
        if (!(allowExternal || "instant" in link.dataset) || !chromeVer) return;
      }
      if (
        ["http:","https:"].includes(link.protocol) &&
        (link.protocol != "http:" || location.protocol != "https:") &&
        (allowQuery || !link.search || "instant" in link.dataset) &&
        !(link.hash && link.pathname+link.search==location.pathname+location.search) &&
        !("noInstant" in link.dataset)
      ) {
        return true;
      }
    }
  }

  function prefetch(href, priority = "auto") {
    if (prefetched.has(href)) return;
    const el = document.createElement("link");
    el.rel = "prefetch";
    el.href = href;
    el.fetchPriority = priority;
    el.as = "document";
    document.head.appendChild(el);
    prefetched.add(href);
  }

  !function init() {
    if (!document.createElement("link").relList.supports("prefetch")) return;

    const varyAccept = "instantVaryAccept" in document.body.dataset || "Shopify" in window;
    const chromeIdx = navigator.userAgent.indexOf("Chrome/");
    if (chromeIdx > -1) {
      chromeVer = parseInt(navigator.userAgent.substring(chromeIdx + "Chrome/".length));
    }
    if (varyAccept && chromeVer && chromeVer < 110) return;

    const hasMousedownShortcut = "instantMousedownShortcut" in document.body.dataset;
    allowQuery = "instantAllowQueryString" in document.body.dataset;
    allowExternal = "instantAllowExternalLinks" in document.body.dataset;
    whitelist = "instantWhitelist" in document.body.dataset;

    const opts = { capture: true, passive: true };
    let useMousedown = false, mousedownOnly = false, viewportMode = false;

    if ("instantIntensity" in document.body.dataset) {
      const val = document.body.dataset.instantIntensity;
      if (val.startsWith("mousedown")) {
        useMousedown = true;
        if (val === "mousedown-only") mousedownOnly = true;
      } else if (val.startsWith("viewport")) {
        const saveData = navigator.connection && navigator.connection.saveData;
        const slow2g = navigator.connection && navigator.connection.effectiveType && navigator.connection.effectiveType.includes("2g");
        if (!saveData && !slow2g) {
          if (val === "viewport") {
            if (document.documentElement.clientWidth*document.documentElement.clientHeight < 450000) viewportMode = true;
          } else if (val === "viewport-all") viewportMode = true;
        }
      } else {
        const nVal = parseInt(val);
        if (!isNaN(nVal)) hoverDelay = nVal;
      }
    }

    if (!mousedownOnly) document.addEventListener("touchstart", onTouchStart, opts);
    if (useMousedown) {
      if (!hasMousedownShortcut) {
        document.addEventListener("mousedown", onMouseDown, opts);
      }
    } else {
      document.addEventListener("mouseover", onMouseOver, opts);
    }
    if (hasMousedownShortcut) document.addEventListener("mousedown", onClick, opts);

    if (viewportMode) {
      let ric = window.requestIdleCallback;
      if (!ric) ric = (cb)=>{cb();};
      ric(function(){
        const io = new IntersectionObserver((entries)=>{
          entries.forEach((entry)=>{
            if (entry.isIntersecting) {
              const aEl = entry.target;
              io.unobserve(aEl);
              prefetch(aEl.href);
            }
          });
        });
        document.querySelectorAll("a").forEach((aEl)=>{
          if (isValid(aEl)) io.observe(aEl);
        });
      },{timeout:1500});
    }
  }();
})();
