// ==============================
// ✅ إشعارات Toast عامة (شغالة زي ما هي)
// ==============================
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  if (type === "error") {
    toast.style.background = "#e74c3c"; // أحمر
  } else if (type === "success") {
    toast.style.background = "#2ecc71"; // أخضر
  } else {
    toast.style.background = "#555"; // رمادي
  }

  toast.style.color = "#fff";
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ==============================
// ✅ إدارة العربة
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

// ==============================
// ✅ أحداث العربة (الويدجت) — زي ما هو
// ==============================
document.addEventListener("click", function (e) {
  const postCard = e.target.closest(".post-card");
  if (!postCard) return;

  const cartButton = e.target.closest(".external-cart-button");
  if (cartButton) {
    e.preventDefault();
    const productUrl = postCard.getAttribute("data-product-url"); // 🔥 يفضل المصدر الأساسي
    addToCart(productUrl);
  }
});

// ==============================
// ✅ زر في صفحة المنتج (هنا التعديل الأساسي)
// ==============================
function handleAddToCart(event) {
  event.preventDefault();

  // 🔥 بدل window.location.href → نخزن من data-product-url
  const productUrl = document.querySelector(".add-to-cart")?.getAttribute("data-product-url");
  if (productUrl) {
    addToCart(productUrl);
  } else {
    console.error("⚠️ مفيش data-product-url على الزر!");
    showToast("لا يمكن إضافة المنتج: رابط مفقود", "error");
  }
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
