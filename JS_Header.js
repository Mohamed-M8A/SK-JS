document.addEventListener("DOMContentLoaded", function () {
  // =================== 🛒 تحديث عربة التسوق ===================
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

  // =================== 🔍 البحث ===================
  const searchPageURL = "https://souq-alkul.blogspot.com/p/search.html";
  const input = document.getElementById("searchInput");

  function startSearch() {
    if (!input) return;
    const query = input.value.trim();
    if (query) {
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

  // =================== ✨ تدوير الـ placeholder ===================
  if (input) {
    const placeholders = [
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

    let currentIndex = 0;
    function rotatePlaceholder() {
      input.setAttribute("placeholder", placeholders[currentIndex]);
      currentIndex = (currentIndex + 1) % placeholders.length;
    }

    rotatePlaceholder();
    setInterval(rotatePlaceholder, 45000);
  }
});
