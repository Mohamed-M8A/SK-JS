document.addEventListener("DOMContentLoaded", () => {
  // ==============================
// ✅ إضافة المنتج إلى العربة
// ==============================

function addToCart(productUrl) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const exists = cart.some(item => item.productUrl === productUrl);

  if (exists) {
    showToast("المنتج موجود بالفعل في العربة!", "error");
  } else {
    cart.push({ productUrl });
    localStorage.setItem("cart", JSON.stringify(cart));
    showToast("تمت إضافة المنتج إلى العربة بنجاح!", "success");
  }
}

function handleAddToCart(event) {
  const productUrl = window.location.href;
  addToCart(productUrl);
}

document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.removeEventListener("click", handleAddToCart);
  btn.addEventListener("click", handleAddToCart);
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

// ==============================
// ✅ إشعارات Toast 
// ==============================

// ✅ دالة توست عامة
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
    toast.style.background = "#555"; // افتراضي رمادي
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
});
