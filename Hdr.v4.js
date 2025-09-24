/* -------------------------------------------------
   ThemeScript Removed Parts + Extra Features
   - Dark Mode Toggle
   - Back To Top
   - Cart Widget
   - Search
   - Placeholder Rotation
   - Remove ?m=0 / ?m=1 from URL
------------------------------------------------- */

document.addEventListener("DOMContentLoaded", function () {
  // =================== ✅ تحديث عربة التسوق ===================
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

// ====== Firebase ======
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js";
import { getFirestore, doc, setDoc, updateDoc, arrayUnion, serverTimestamp } 
  from "https://www.gstatic.com/firebasejs/9.24.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMk4xzuUqrEEy8A2JHhFDfNNa55WHNvwg",
  authDomain: "search-cc1c2.firebaseapp.com",
  projectId: "search-cc1c2",
  storageBucket: "search-cc1c2.appspot.com", // ✅ تم التعديل هنا
  messagingSenderId: "190343616699",
  appId: "1:190343616699:web:c2ff8bc77d2bb360caf19e",
  measurementId: "G-ZL4G6P35NF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
  try {
    const ref = doc(db, "searches", visitorId);
    await updateDoc(ref, {
      queries: arrayUnion({ q: query, t: serverTimestamp() })
    }).catch(async () => {
      await setDoc(ref, {
        queries: [{ q: query, t: serverTimestamp() }]
      });
    });
  } catch (err) {
    console.error("saveSearch error:", err);
  }
}

// ====== ✅ البحث ======
const searchPageURL = "https://souq-alkul.blogspot.com/p/search.html";
const input = document.getElementById("searchInput");

async function startSearch() {
  if (!input) return;
  const query = input.value.trim();
  if (query) {
    // 📝 نحفظ البحث في Firebase
    await saveSearch(query);

    // 🔗 نوجّه للنتائج
    window.location.href = `${searchPageURL}?q=${encodeURIComponent(query)}`;
  }
}

// وصل الدالة للفورم
const form = document.querySelector(".search-box-form");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    startSearch();
  });
}

// ====== ✅ تدوير الـ placeholder ======
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
  const currentUrl = rmurl(location.toString(),!0);

});
