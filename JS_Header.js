/* ===========================
   Cart Widget Logic
=========================== */
function updateCartWidget() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCountElement = document.getElementById("cart-count");

  cartCountElement.textContent = cart.length;
  if (cart.length > 0) {
    cartCountElement.classList.add("active");
  } else {
    cartCountElement.classList.remove("active");
  }
}
updateCartWidget();

// تحديث عند تغيير localStorage
window.addEventListener("storage", function (event) {
  if (event.key === "cart") {
    updateCartWidget();
  }
});

// تحديث دوري (احتياطي)
setInterval(updateCartWidget, 1000);

// عند الضغط على الأيقونة يفتح صفحة العربة
document.getElementById("cart-widget-header").addEventListener("click", function() {
  window.location.href = "/p/cart.html";
});

/* ===========================
   Search Box Logic
=========================== */
const searchPageURL = 'https://souq-alkul.blogspot.com/p/search.html';

function startSearch() {
  const query = document.getElementById('searchInput').value.trim();
  if (query) {
    window.location.href = `${searchPageURL}?q=${encodeURIComponent(query)}`;
  }
}

// Placeholder Rotator
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
const input = document.getElementById('searchInput');

function rotatePlaceholder() {
  input.setAttribute('placeholder', placeholders[currentIndex]);
  currentIndex = (currentIndex + 1) % placeholders.length;
}

rotatePlaceholder();
setInterval(rotatePlaceholder, 45000);
