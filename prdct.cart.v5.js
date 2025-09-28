/***********************
 * تنظيف الرابط (إزالة أي باراميتر)
 ***********************/
function cleanUrl(url) {
  try {
    const u = new URL(url, window.location.origin);
    return u.origin + u.pathname; // فقط الدومين + المسار
  } catch (e) {
    return url.split("?")[0]; // fallback
  }
}

/***********************
 * إشعارات Toast للعربة والكوبون
 ***********************/
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

/***********************
 * إدارة العربة
 ***********************/
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

/***********************
 * زر في صفحة المنتج
 ***********************/
function handleAddToCart(event) {
  const productUrl = cleanUrl(window.location.href);
  addToCart(productUrl);
}

/***********************
 * ربط الأزرار
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
  // أزرار صفحة المنتج
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.removeEventListener("click", handleAddToCart);
    btn.addEventListener("click", handleAddToCart);
  });

  // أزرار القائمة / الرئيسية
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

/***********************
 * نسخ الكوبون
 ***********************/
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
