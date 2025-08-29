(function(){
  var DEBUG = false; // لو عايز لوقات روح حط true

  // رابط صفحة البحث (استخدم المتغير العالمي لو معرف مسبقاً)
  var searchPageURL = window.searchPageURL || "https://souq-alkul.blogspot.com/p/search.html";

  // نضمن وجود دالة عامة startSearch حتى لو الفورم عنده onsubmit
  window.startSearch = window.startSearch || function(){
    var inp = document.getElementById("searchInput");
    if (!inp) {
      if (DEBUG) console.warn("startSearch: searchInput not found");
      return false;
    }
    var q = inp.value.trim();
    if (q) {
      window.location.href = searchPageURL + "?q=" + encodeURIComponent(q);
    }
    return false;
  };

  // placeholders افتراضي لو مش معرف من مكان تاني
  window.placeholders = window.placeholders || [
    "خلنا نساعدك تلاقي اللي يناسبك",
    "جاهز تلاقي شي يغير يومك",
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
    "سماعات رأس للألعاب",
    "اختر منتجك وابدأ اكتشاف الأفضل"
  ];

  // محاولة التهيئة: ترجع true لو نجحت
  function tryInitSearch() {
    var input = document.getElementById("searchInput");
    if (!input) return false;

    // تأكيد عدم تهيئة مرتين
    if (window.__searchInitialized) {
      if (DEBUG) console.log("search already initialized");
      return true;
    }
    window.__searchInitialized = true;

    // ربط الفورم ببديلة submit آمنة (لو الفورم موجود)
    var form = input.closest("form");
    if (form) {
      form.addEventListener("submit", function(e){
        e.preventDefault();
        try { window.startSearch(); } catch (err) { if (DEBUG) console.error(err); }
      }, { passive: false });
    }

    // دعم Enter على الموبايل
    input.addEventListener("keydown", function(e){
      if (e.key === "Enter" || e.keyCode === 13) {
        e.preventDefault();
        try { window.startSearch(); } catch (err) { if (DEBUG) console.error(err); }
      }
    });

    // تدوير الـ placeholders
    try {
      var idx = 0;
      function rotate() {
        try {
          input.setAttribute("placeholder", window.placeholders[idx]);
        } catch(e){ if (DEBUG) console.error(e); }
        idx = (idx + 1) % window.placeholders.length;
      }
      // بداية + interval (نمنع تكرار الانترڤال لو كان معرف)
      rotate();
      if (!window.__searchPlaceholderInterval) {
        window.__searchPlaceholderInterval = setInterval(rotate, 45000);
      }
    } catch (err) {
      if (DEBUG) console.error("placeholder rotation failed", err);
    }

    if (DEBUG) console.log("search initialized");
    return true;
  }

  // 1) حاول فوراً (لو السكربت محطوط بعد الـ HTML)
  if (tryInitSearch()) return;

  // 2) لو لسه العنصر يتولد بعد تحميل الصفحة: راقب DOM للتغيير
  var mo = new MutationObserver(function(mutations){
    if (tryInitSearch()) {
      try { mo.disconnect(); } catch(e){}
    }
  });
  try {
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
  } catch (e) {
    if (DEBUG) console.warn("MutationObserver not available", e);
  }

  // 3) fallback بفحص متكرر (حتى لو الـ MutationObserver مش يمسك)
  var attempts = 0;
  var maxAttempts = 60; // حوالي 30 ثانية (الانترڤال 500ms)
  var poll = setInterval(function(){
    attempts++;
    if (tryInitSearch() || attempts > maxAttempts) {
      clearInterval(poll);
      try { mo.disconnect(); } catch(e){}
    }
  }, 500);

  // أخيراً: لو عايز تفعيل لوقات تصحيحية شغّل DEBUG = true
})();
