/* -------------------------------------------------
   ThemeScript.js
   - Lazyload
   - Dark Mode Toggle
   - Back To Top
   - Google Ads Loader
   - instant.page (Prefetch Links)
------------------------------------------------- */

(function ThemeScript(){
    var M = window,
        doc = document,
        store = localStorage,
        au = "-rw",
        undefinedType = "undefined";

    /* ------------------------
       Helpers
    ------------------------ */
    function hasClass(el, cls){ return (" "+el.className+" ").indexOf(" "+cls+" ") > -1 }
    function addClass(el, cls){ if(!hasClass(el,cls)) el.className += (el.className ? " " : "")+cls }
    function removeClass(el, cls){ el.className = el.className.replace(new RegExp("(?:^|\\s)"+cls+"(?!\\S)"),"").trim() }
    function toggleClass(el, cls){ hasClass(el,cls)? removeClass(el,cls) : addClass(el,cls) }

    /* ------------------------
       Lazyload for images
    ------------------------ */
    var lazyFlag = store !== null && 1 == store.getItem("lazy");
    var lazyHandler = function(img){
        if(img.tagName == "IMG"){
            var dataSrc = img.getAttribute("data-src");
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
       Dark Mode Toggle
    ------------------------ */
    var darkBtn = doc.getElementById("dark-toggler"),
        bodyEl = doc.querySelector("body"),
        iconMoon = doc.querySelector(".icon-moon"),
        iconSun = doc.querySelector(".icon-sun");

    function applyTheme(theme){
        if(theme === "dark"){
            addClass(bodyEl,"dark");
            if(iconMoon) iconMoon.style.display = "none";
            if(iconSun) iconSun.style.display = "inline";
        } else {
            removeClass(bodyEl,"dark");
            if(iconMoon) iconMoon.style.display = "inline";
            if(iconSun) iconSun.style.display = "none";
        }
    }

    // ✅ طبّق الثيم المخزن مباشرة عند التحميل
    var savedTheme = store ? store.getItem("theme") : null;
    applyTheme(savedTheme || "light");

    if(darkBtn){
        darkBtn.addEventListener("click",function(e){
            e.preventDefault();
            if(hasClass(bodyEl,"dark")){
                applyTheme("light");
                if(store) store.setItem("theme","light");
            } else {
                applyTheme("dark");
                if(store) store.setItem("theme","dark");
            }
        });
    }

    /* ------------------------
       Back To Top
    ------------------------ */
    var backTop = doc.getElementById("back-to-top");
    M.addEventListener("scroll",function(){
        (this.pageYOffset >= 1000 && backTop !== null ? removeClass : addClass)(backTop,"d-none")
    },false);

    /* ------------------------
       Google Ads Loader
    ------------------------ */
    var adsId = typeof caPubAdsense!==undefinedType ? caPubAdsense.replace(/^\D+/g,"") : false,
        clientId = adsId ? "ca-pub-"+adsId : false;
    (function(){
        if(clientId){
            if(typeof adsbygoogle===undefinedType) adsbygoogle=[];
            Defer.js("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="+clientId,"adsbygoogle",100);
        }
    })();

    /* ------------------------
       Lazyload Handler
    ------------------------ */
    Defer.dom(".lazyload",1,"loaded",lazyHandler);

})();

/* -------------------------------------------------
   instant.page v5.2.0 (Prefetch Links)
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
