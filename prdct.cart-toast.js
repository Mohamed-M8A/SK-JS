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
// ✅ إشعارات Toast 
// ==============================
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  if (type === "error") {
    toast.style.background = "#e74c3c"; 
  } else if (type === "success") {
    toast.style.background = "#2ecc71"; 
  } else {
    toast.style.background = "#555"; 
  }

  toast.style.color = "#fff";
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}
