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
       Dark Mode Toggle (جديد)
    ------------------------ */
    var darkBtn = doc.getElementById("dark-toggler"),
        bodyEl = doc.querySelector("body"),
        iconMoon = doc.querySelector(".icon-moon"),
        iconSun = doc.querySelector(".icon-sun");

    if(darkBtn){
        // اضغط الزر
        darkBtn.addEventListener("click",function(e){
            e.preventDefault();
            toggleClass(bodyEl,"dark");

            // تبديل الأيقونات
            if(hasClass(bodyEl,"dark")){
                iconMoon.style.display = "none";
                iconSun.style.display = "inline";
                if(store) store.setItem("theme","dark");
            } else {
                iconMoon.style.display = "inline";
                iconSun.style.display = "none";
                if(store) store.setItem("theme","light");
            }
        });

        // تحميل أول مرة حسب التخزين
        var savedTheme = store ? store.getItem("theme") : null;
        if(savedTheme === "dark"){
            addClass(bodyEl,"dark");
            iconMoon.style.display = "none";
            iconSun.style.display = "inline";
        } else {
            iconMoon.style.display = "inline";
            iconSun.style.display = "none";
        }
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
