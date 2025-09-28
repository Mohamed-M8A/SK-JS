/***********************
 * ✅ Toast مشترك
 ***********************/
function showCartToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "cart-toast";
  toast.textContent = message;

  // ألوان
  toast.style.background = type === "error" ? "#e74c3c" : "#2ecc71";

  document.body.appendChild(toast);

  // Force reflow علشان الـ transition يشتغل
  void toast.offsetWidth;

  // إظهار
  toast.classList.add("show");

  // إخفاء
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/***********************
 * ✅ إضافة للعربة
 ***********************/
function normalizeUrl(url) {
  try {
    const u = new URL(url, window.location.origin);
    u.search = ""; // نشيل أي باراميتر
    return u.toString();
  } catch {
    return url;
  }
}

function addToCart(productUrl) {
  const cleanUrl = normalizeUrl(productUrl);
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const exists = cart.some(item => item.productUrl === cleanUrl);

  if (exists) {
    showCartToast("⚠️ المنتج موجود بالفعل في العربة!", "error");
  } else {
    cart.push({ productUrl: cleanUrl });
    localStorage.setItem("cart", JSON.stringify(cart));
    showCartToast("✅ تمت إضافة المنتج إلى العربة بنجاح!", "success");
  }
}

// زر في صفحة المنتج (button.add-to-cart)
function handleAddToCart() {
  const productUrl = window.location.href;
  addToCart(productUrl);
}

document.addEventListener("DOMContentLoaded", () => {
  // ربط أزرار صفحة المنتج
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.removeEventListener("click", handleAddToCart);
    btn.addEventListener("click", handleAddToCart);
  });

  // ربط أزرار الـ external-cart-button في الويدجت
  document.addEventListener("click", function (e) {
    const postCard = e.target.closest(".post-card");
    if (!postCard) return;

    const cartButton = e.target.closest(".external-cart-button");
    if (cartButton) {
      const productUrl = postCard.getAttribute("data-product-url");
      addToCart(productUrl);
      e.preventDefault();
    }
  });
});

/***********************
 * ✅ نسخ كوبون الخصم
 ***********************/
window.copyCoupon = function () {
  const codeEl = document.getElementById("couponCode");
  const code = codeEl ? codeEl.innerText.trim() : "";

  if (!code) {
    showCartToast("⚠️ لا يوجد كوبون!", "error");
    return;
  }

  navigator.clipboard.writeText(code)
    .then(() => {
      showCartToast("✅ تم نسخ الكوبون: " + code, "success");
    })
    .catch(() => {
      showCartToast("❌ فشل نسخ الكوبون!", "error");
    });
};
