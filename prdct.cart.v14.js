/***********************
 * دالة توست عامة
 ***********************/
function showCartToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "cart-toast";
  toast.textContent = message;

  // لون حسب النوع
  if (type === "error") {
    toast.style.background = "#e74c3c"; // أحمر
  } else if (type === "success") {
    toast.style.background = "#2ecc71"; // أخضر
  } else {
    toast.style.background = "#555"; // رمادي
  }

  document.body.appendChild(toast);

  // إظهار
  setTimeout(() => toast.classList.add("show"), 50);

  // إخفاء
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/***********************
 * تنظيف الرابط (إزالة الباراميترات)
 ***********************/
function normalizeUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    url.search = ""; // 🔥 شيل كل الباراميترات
    return url.toString();
  } catch {
    return rawUrl;
  }
}

/***********************
 * إدارة العربة
 ***********************/
function addToCart(productUrl, clean = false) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const finalUrl = clean ? normalizeUrl(productUrl) : productUrl;

  const exists = cart.some(item => item.productUrl === finalUrl);
  if (exists) {
    showCartToast("المنتج موجود بالفعل في العربة!", "error");
  } else {
    cart.push({ productUrl: finalUrl });
    localStorage.setItem("cart", JSON.stringify(cart));
    showCartToast("تمت إضافة المنتج إلى العربة بنجاح!", "success");
  }
}

/***********************
 * أحداث العربة
 ***********************/
document.addEventListener("click", function (e) {
  const postCard = e.target.closest(".post-card");
  if (postCard) {
    // زر العربة في الويدجت
    const cartButton = e.target.closest(".external-cart-button");
    if (cartButton) {
      const productUrl = postCard.getAttribute("data-product-url");
      addToCart(productUrl, false); // 🔹 بدون تنظيف
      e.preventDefault();
    }
  }
});

// زر في صفحة المنتج نفسه
function handleAddToCart() {
  const productUrl = window.location.href;
  addToCart(productUrl, true); // 🔹 تنظيف الرابط
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.removeEventListener("click", handleAddToCart);
    btn.addEventListener("click", handleAddToCart);
  });
});

/***********************
 * نسخ الكوبون
 ***********************/
window.copyCoupon = function () {
  const code = document.getElementById("couponCode")?.innerText;
  if (!code) return;

  navigator.clipboard.writeText(code)
    .then(() => showCartToast("تم نسخ الكوبون: " + code, "success"))
    .catch(() => showCartToast("فشل نسخ الكوبون!", "error"));
};
