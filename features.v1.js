/***********************
 * إشعارات Toast للعربة
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
 * أحداث العربة
 ***********************/
document.addEventListener("click", function (e) {
  const postCard = e.target.closest(".post-card");
  if (!postCard) return;

  const cartButton = e.target.closest(".external-cart-button");
  if (cartButton) {
    try {
      const productUrl = postCard.getAttribute("data-product-url");
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      const exists = cart.some(item => item.productUrl === productUrl);
      if (exists) {
        showCartToast("المنتج موجود بالفعل في العربة!", "error");
      } else {
        cart.push({ productUrl: productUrl });
        localStorage.setItem("cart", JSON.stringify(cart));
        showCartToast("تمت إضافة المنتج إلى العربة بنجاح!", "success");
      }
    } catch (err) {
      console.error("خطأ في إضافة المنتج للعربة:", err);
      showCartToast("حدث خطأ أثناء الإضافة!", "error");
    }
    e.preventDefault();
  }
});
