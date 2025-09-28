// ==============================
// ✅ إضافة المنتج إلى العربة (بدون تعديل)
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

function copyCoupon() {
  const code = document.getElementById("couponCode")?.innerText?.trim();
  if (!code) {
    showToast("لا يوجد كوبون للنسخ!", "error");
    return;
  }

  navigator.clipboard.writeText(code)
    .then(() => showToast("✅ تم نسخ الكوبون: " + code, "success"))
    .catch(err => {
      console.error("فشل نسخ الكوبون:", err);
      showToast("فشل نسخ الكوبون!", "error");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  // يدعم الزر بالـ id
  const couponBtn = document.getElementById("copyCouponBtn");
  if (couponBtn) {
    couponBtn.removeEventListener("click", copyCoupon);
    couponBtn.addEventListener("click", copyCoupon);
  }

  // يدعم onclick="copyCoupon()" في HTML
  window.copyCoupon = copyCoupon;

  // يدعم أي زر class="copy-button"
  document.querySelectorAll(".copy-button").forEach(btn => {
    btn.removeEventListener("click", copyCoupon);
    btn.addEventListener("click", copyCoupon);
  });
});

// ==============================
// ✅ إشعارات Toast موحدة
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
    toast.style.background = "#555"; // رمادي افتراضي
  }

  // شكل التوست
  toast.style.color = "#fff";
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.padding = "10px 15px";
  toast.style.borderRadius = "5px";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.4s ease";

  document.body.appendChild(toast);

  // إظهار
  setTimeout(() => { toast.style.opacity = "1"; }, 100);

  // إخفاء
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}
