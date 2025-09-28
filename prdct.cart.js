// ==============================
// ✅ إشعارات Toast للعربة فقط
// ==============================
function showCartToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "cart-toast"; // 👈 كلاس مختلف عن البلد
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
    showCartToast("المنتج موجود بالفعل في العربة!", "error");
  } else {
    cart.push({ productUrl });
    localStorage.setItem("cart", JSON.stringify(cart));
    showCartToast("تمت إضافة المنتج إلى العربة بنجاح!", "success");
  }
}

document.addEventListener("click", function (e) {
  // زر في بطاقة المنتج
  const postCard = e.target.closest(".post-card");
  const cardBtn = e.target.closest(".external-cart-button");

  if (postCard && cardBtn) {
    e.preventDefault();
    const productUrl = postCard.getAttribute("data-product-url");
    if (productUrl) addToCart(productUrl);
    return;
  }

  // زر في صفحة المنتج
  const productBtn = e.target.closest(".add-to-cart");
  if (productBtn) {
    e.preventDefault();
    const productUrl = window.location.href;
    addToCart(productUrl);
  }
});
