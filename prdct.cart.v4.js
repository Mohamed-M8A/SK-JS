// ==============================
// ✅ تنظيف الرابط (يشيل أي باراميتر)
// ==============================
function cleanUrl(url) {
  try {
    const u = new URL(url, window.location.origin);
    return u.origin + u.pathname; // نحتفظ فقط بالمسار بدون query
  } catch (e) {
    return url.split("?")[0]; // fallback لو فيه خطأ
  }
}

// ==============================
// ✅ إشعارات Toast عامة
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

  toast.style.color = "#fff";
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "6px";
  toast.style.zIndex = "999999";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.3s ease";

  document.body.appendChild(toast);

  setTimeout(() => (toast.style.opacity = "1"), 100);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ==============================
// ✅ إضافة المنتج إلى العربة
// ==============================
function addToCart(productUrl) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const clean = cleanUrl(productUrl);

  const exists = cart.some(item => item.productUrl === clean);
  if (exists) {
    showCartToast("المنتج موجود بالفعل في العربة!", "error");
  } else {
    cart.push({ productUrl: clean });
    localStorage.setItem("cart", JSON.stringify(cart));
    showCartToast("تمت إضافة المنتج إلى العربة بنجاح!", "success");
  }
}

// ==============================
// ✅ زر في صفحة المنتج
// ==============================
function handleAddToCart(event) {
  const productUrl = cleanUrl(window.location.href);
  addToCart(productUrl);
}

// ==============================
// ✅ ربط الأزرار في أي صفحة
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  // أزرار صفحة المنتج
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.removeEventListener("click", handleAddToCart);
    btn.addEventListener("click", handleAddToCart);
  });

  // أزرار من الرئيسية / القوائم
  document.addEventListener("click", function (e) {
    const postCard = e.target.closest(".post-card");
    if (!postCard) return;

    const cartButton = e.target.closest(".external-cart-button");
    if (cartButton) {
      e.preventDefault();
      const productUrl = cleanUrl(postCard.getAttribute("data-product-url"));
      addToCart(productUrl);
    }
  });
});

// ==============================
// ✅ نسخ الكوبون مع Toast
// ==============================
window.copyCoupon = function () {
  const code = document.getElementById("couponCode")?.innerText;
  if (!code) return;

  navigator.clipboard
    .writeText(code)
    .then(() => showCartToast("تم نسخ الكوبون: " + code, "success"))
    .catch(err => {
      console.error("فشل النسخ: ", err);
      showCartToast("فشل نسخ الكوبون!", "error");
    });
};
