// ==============================
// ✅ دالة لتطبيع الرابط (إزالة البراميترات)
// ==============================
function normalizeUrl(url) {
  try {
    const u = new URL(url);
    return u.origin + u.pathname; // يرجع الرابط بدون باراميترات
  } catch (err) {
    return url;
  }
}

// ==============================
// ✅ إشعارات Toast للعربة والكوبون
// ==============================
function showCartToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "toast cart-toast";
  toast.textContent = message;

  if (type === "error") {
    toast.style.background = "#e74c3c"; // أحمر
  } else {
    toast.style.background = "#2ecc71"; // أخضر
  }

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ==============================
// ✅ إضافة المنتج إلى العربة
// ==============================
function addToCart(productUrl) {
  const cleanUrl = normalizeUrl(productUrl); // 🔥 رابط نظيف
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const exists = cart.some(item => item.productUrl === cleanUrl);

  if (exists) {
    showCartToast("المنتج موجود بالفعل في العربة!", "error");
  } else {
    cart.push({ productUrl: cleanUrl });
    localStorage.setItem("cart", JSON.stringify(cart));
    showCartToast("تمت إضافة المنتج إلى العربة بنجاح!", "success");
  }
}

// ==============================
// ✅ زر في صفحة المنتج
// ==============================
function handleAddToCart(event) {
  const productUrl = window.location.href;
  addToCart(productUrl);
}

// ==============================
// ✅ ربط الأزرار في أي صفحة (قائمة أو منتج)
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.removeEventListener("click", handleAddToCart);
    btn.addEventListener("click", handleAddToCart);
  });
});

// ==============================
// ✅ نسخ الكوبون مع توست
// ==============================
window.copyCoupon = function () {
  const code = document.getElementById("couponCode")?.innerText;
  if (!code) return;

  navigator.clipboard.writeText(code)
    .then(() => showCartToast("تم نسخ الكوبون: " + code, "success"))
    .catch(err => {
      console.error("فشل النسخ: ", err);
      showCartToast("فشل نسخ الكوبون!", "error");
    });
};
