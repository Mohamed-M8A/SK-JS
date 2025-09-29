/***********************
 * ✅ إشعارات Toast عامة
 ***********************/
function showCartToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "cart-toast";
  toast.textContent = message;

  toast.style.background = (type === "error") ? "#e74c3c" : "#2ecc71";

  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/***********************
 * ✅ تخزين العربة (مع تنظيف الروابط)
 ***********************/
function addToCart(productUrl, clean = false) {
  if (clean) {
    const urlObj = new URL(productUrl);
    urlObj.search = ""; // حذف أي باراميترات
    productUrl = urlObj.toString();
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // 🛑 منع التكرار
  const exists = cart.some(item => item.productUrl === productUrl);
  if (exists) {
    showCartToast("المنتج موجود بالفعل في العربة!", "error");
    return;
  }

  cart.push({ productUrl });
  localStorage.setItem("cart", JSON.stringify(cart));
  showCartToast("✅ تمت إضافة المنتج إلى العربة بنجاح!", "success");
}

/***********************
 * ✅ زر صفحة المنتج فقط
 ***********************/
function handleAddToCart(event) {
  event.preventDefault();
  event.stopPropagation();

  const cleanUrl = window.location.origin + window.location.pathname; 
  addToCart(cleanUrl, false); // نضيف الرابط بدون باراميتر نهائيًا
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.replaceWith(btn.cloneNode(true)); // إزالة أي event handlers قديمة
  });

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", handleAddToCart);
  });
});

/***********************
 * ✅ زر الويدجت (الرئيسية) فقط
 ***********************/
document.addEventListener("click", function (e) {
  const postCard = e.target.closest(".post-card");
  if (!postCard) return;

  const cartButton = e.target.closest(".external-cart-button");
  if (cartButton) {
    const productUrl = postCard.getAttribute("data-product-url");
    addToCart(productUrl, false); // نخزن الرابط كما هو
    e.preventDefault();
  }
});

/***********************
 * ✅ إشعارات Toast للكوبون
 ***********************/
function showCouponToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "cart-toast";
  toast.textContent = message;

  toast.style.background = (type === "error") ? "#e74c3c" : "#2ecc71";

  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/***********************
 * ✅ نسخ الكوبون
 ***********************/
window.copyCoupon = function () {
  const codeEl = document.getElementById("couponCode");
  const code = codeEl ? codeEl.innerText.trim() : "";

  if (!code) {
    showCouponToast("لا يوجد كوبون للنسخ!", "error");
    return;
  }

  navigator.clipboard.writeText(code)
    .then(() => {
      showCouponToast("✅ تم نسخ الكوبون: " + code, "success");
    })
    .catch(() => {
      showCouponToast("فشل نسخ الكوبون!", "error");
    });
};
