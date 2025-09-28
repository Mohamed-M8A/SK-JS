// ==============================
// ✅ إشعارات Toast عامة
// ==============================
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  // ألوان حسب النوع
  if (type === "error") {
    toast.style.background = "#e74c3c"; // أحمر
  } else if (type === "success") {
    toast.style.background = "#2ecc71"; // أخضر
  } else {
    toast.style.background = "#555"; // رمادي
  }

  toast.style.color = "#fff";
  document.body.appendChild(toast);

  // إظهار
  setTimeout(() => toast.classList.add("show"), 100);

  // إخفاء
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ==============================
// ✅ إدارة العربة
// ==============================
function addToCart(productUrl) {
  const cleanUrl = new URL(productUrl);
  cleanUrl.search = ""; // 🔥 شيل أي باراميتر (زي country=SA)

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const exists = cart.some(item => item.productUrl === cleanUrl.toString());

  if (exists) {
    showToast("المنتج موجود بالفعل في العربة!", "error");
  } else {
    cart.push({ productUrl: cleanUrl.toString() });
    localStorage.setItem("cart", JSON.stringify(cart));
    showToast("تمت إضافة المنتج إلى العربة بنجاح!", "success");
  }
}

// ==============================
// ✅ أحداث العربة (قائمة المنتجات)
// ==============================
document.addEventListener("click", function (e) {
  const postCard = e.target.closest(".post-card");
  if (!postCard) return;

  const cartButton = e.target.closest(".external-cart-button");
  if (cartButton) {
    e.preventDefault();
    const productUrl = postCard.getAttribute("data-product-url");
    addToCart(productUrl);
  }
});

// ==============================
// ✅ زر في صفحة المنتج
// ==============================
function handleAddToCart(event) {
  event.preventDefault();
  event.stopPropagation(); // 🔥 يمنع تداخل الحدث مع كود القائمة

  const btn = event.currentTarget;
  const productUrl = btn.getAttribute("data-product-url") || window.location.href;

  addToCart(productUrl);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.removeEventListener("click", handleAddToCart);
    btn.addEventListener("click", handleAddToCart);
  });
});

// ==============================
// ✅ نسخ الكوبون
// ==============================
window.copyCoupon = function () {
  const code = document.getElementById("couponCode")?.innerText;
  if (!code) return;

  navigator.clipboard.writeText(code)
    .then(() => showToast("تم نسخ الكوبون: " + code, "success"))
    .catch(err => {
      console.error("فشل النسخ: ", err);
      showToast("فشل نسخ الكوبون!", "error");
    });
};
