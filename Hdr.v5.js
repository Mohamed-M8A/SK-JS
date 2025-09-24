/* -------------------------------------------------
   ThemeScript Fixed
   - Dark Mode Toggle
   - Back To Top
   - Cart Widget
   - Search + Firebase Logging
   - Placeholder Rotation
   - Remove ?m=0 / ?m=1 from URL
------------------------------------------------- */

// =================== ✅ Firebase Config ===================
(function(){
  // CDN SDK v8 (لازم يكون متضاف في <head> بتاع القالب أو هنا من GitHub)
  var script1 = document.createElement("script");
  script1.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js";
  var script2 = document.createElement("script");
  script2.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js";
  document.head.appendChild(script1);
  document.head.appendChild(script2);

  script2.onload = function(){
    var firebaseConfig = {
      apiKey: "AIzaSyAMk4xzuUqrEEy8A2JHhFDfNNa55WHNvwg",
      authDomain: "search-cc1c2.firebaseapp.com",
      projectId: "search-cc1c2",
      storageBucket: "search-cc1c2.appspot.com",
      messagingSenderId: "190343616699",
      appId: "1:190343616699:web:c2ff8bc77d2bb360caf19e",
      measurementId: "G-ZL4G6P35NF"
    };
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore();
  };
})();

document.addEventListener("DOMContentLoaded", function () {
  // =================== ✅ Cart Widget ===================
  function updateCartWidget() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCountElement = document.getElementById("cart-count");
    if (!cartCountElement) return;

    cartCountElement.textContent = cart.length;
    if (cart.length > 0) {
      cartCountElement.classList.add("active");
    } else {
      cartCountElement.classList.remove("active");
    }
  }

  updateCartWidget();
  window.addEventListener("storage", function (event) {
    if (event.key === "cart") {
      updateCartWidget();
    }
  });
  setInterval(updateCartWidget, 1000);

  const cartWidget = document.getElementById("cart-widget-header");
  if (cartWidget) {
    cartWidget.addEventListener("click", function () {
      window.location.href = "/p/cart.html";
    });
  }

  // 🆔 visitorId بسيط
  function getVisitorId() {
    let id = localStorage.getItem("visitorId");
    if (!id) {
      id = "v_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 9);
      localStorage.setItem("visitorId", id);
    }
    return id;
  }
  const visitorId = getVisitorId();

  // 🔄 دالة تسجيل البحث
  async function saveSearch(query) {
    if (!window.db) return;
    try {
      const ref = window.db.collection("searches").doc(visitorId);
      await ref.set({
        queries: firebase.firestore.FieldValue.arrayUnion({
          q: query,
          t: new Date()
        })
      }, { merge: true });
    } catch (err) {
      console.error("saveSearch error:", err);
    }
  }

  // =================== ✅ البحث ===================
  const searchPageURL = "https://souq-alkul.blogspot.com/p/search.html";
  const input = document.getElementById("searchInput");

  async function startSearch() {
    if (!input) return;
    const query = input.value.trim();
    if (query) {
      await saveSearch(query); // 📝 حفظ البحث
      window.location.href = `${searchPageURL}?q=${encodeURIComponent(query)}`;
    }
  }

  const form = document.querySelector(".search-box-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      startSearch();
    });
  }

  // =================== ✅ Placeholder Rotation ===================
  if (input) {
    const placeholders = [
      "ماكينة قهوة ديلونجي",
      "سماعات بلوتوث جالكسي بودز",
      "مكنسة روبوت ذكية",
      "شاحن مغناطيسي للآيفون",
      "ستاند لابتوب قابل للطي",
      "مكواة بخار محمولة",
      "عصارة فواكه كهربائية",
      "كاميرا مراقبة واي فاي",
      "ماوس لاسلكي لابتوب",
      "منظف وجه كهربائي",
      "لوح مفاتيح ميكانيكي RGB",
      "فرامة خضار يدوية",
      "ميزان ذكي للحمية",
      "سماعات رأس للألعاب"
    ];

    let currentIndex = 0;
    function rotatePlaceholder() {
      input.setAttribute("placeholder", placeholders[currentIndex]);
      currentIndex = (currentIndex + 1) % placeholders.length;
    }

    rotatePlaceholder();
    setInterval(rotatePlaceholder, 45000);
  }

  // =================== ✅ Dark Mode Toggle ===================
  var htmlEl = document.documentElement,
      darkBtn = document.getElementById("dark-toggler"),
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
      htmlEl.classList.add("dark-mode");
      htmlEl.setAttribute("data-theme","dark");
    } else {
      htmlEl.classList.remove("dark-mode");
      htmlEl.setAttribute("data-theme","light");
    }
    switchIcon(theme);
    if(persist) {
      try { localStorage.setItem("theme", theme); } catch(e){}
    }
  }

  var savedTheme;
  try { savedTheme = localStorage.getItem("theme"); } catch(e){ savedTheme = null; }
  if(!savedTheme){
    savedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  applyTheme(savedTheme,false);

  if(darkBtn){
    darkBtn.addEventListener("click",function(e){
      e.preventDefault();
      var isDark = htmlEl.classList.contains("dark-mode");
      applyTheme(isDark ? "light" : "dark", true);
    });
  }

  // =================== ✅ Back To Top ===================
  var backTop = document.getElementById("back-to-top");
  window.addEventListener("scroll",function(){
    if(!backTop) return;
    if(this.pageYOffset >= 1000){
      backTop.classList.remove("d-none");
    } else {
      backTop.classList.add("d-none");
    }
  },false);

  // =================== ✅ Remove ?m=0 / ?m=1 from URL ===================
  function rmurl(e,t){
      var r=new RegExp(/\?m=0|&m=0|\?m=1|&m=1/g);
      if(r.test(e)){
          e = e.replace(r,"");
          if(t) window.history.replaceState({},document.title,e);
      }
      return e;
  }
  rmurl(location.toString(),!0);

});
