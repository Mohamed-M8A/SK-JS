// ==============================
// ✅ تنظيف الرابط (عشان ما يتكرر)
// ==============================
function cleanUrl(url) {
  return url.split("?")[0]; // يشيل أي باراميتر زي ?m=0
}

// ==============================
// ✅ إشعارات Toast للعربة
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
