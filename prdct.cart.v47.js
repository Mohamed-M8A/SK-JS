/***********************
 * ✅ تجهيز container للتوست (مرة واحدة)
 ***********************/
function getToastContainer() {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    document.body.appendChild(container);
  }
  return container;
}

/***********************
 * ✅ إشعارات Toast موحدة
 ***********************/
function showCartToast(message, type = "success") {
  const container = getToastContainer();

  const toast = document.createElement("div");
  toast.className = "cart-toast";
  toast.textContent = message;
  toast.style.background = (type === "error") ? "#e74c3c" : "#2ecc71";
  toast.style.color = "#fff";
  toast.style.padding = "12px 20px";
  toast.style.borderRadius = "10px";
  toast.style.fontSize = "14px";
  toast.style.fontWeight = "500";
  toast.style.opacity = "0";
  toast.style.transform = "translateX(120%)";
  toast.style.transition = "all 0.4s ease";

  container.appendChild(toast);

  // trigger show
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(0)";
  }, 50);

  // auto hide
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(120%)";
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/***********************
 * ✅ زر صفحة المنتج
 ***********************/
function handleAddToCart(event) {
  event.preventDefault();
  event.stopPropagation();

  const productUrl = window.location.href;
  addToCart(productUrl, true); // تنظيف الرابط
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.replaceWith(btn.cloneNode(true)); // 🛑 إزالة أي event handlers قديمة
  });

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", handleAddToCart);
  });
});

/***********************
 * ✅ زر الويدجت (الرئيسية)
 ***********************/
document.addEventListener("click", function (e) {
  const postCard = e.target.closest(".post-card");
  if (!postCard) return;

  const cartButton = e.target.closest(".external-cart-button");
  if (cartButton) {
    const productUrl = postCard.getAttribute("data-product-url");
    addToCart(productUrl, false);
    e.preventDefault();
  }
});

/***********************
 * ✅ نسخ الكوبون
 ***********************/
function copyCoupon() {
  const codeEl = document.getElementById("couponCode");
  const code = codeEl ? codeEl.innerText.trim() : "";

  if (!code) {
    showCartToast("لا يوجد كوبون للنسخ!", "error");
    return;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code)
      .then(() => {
        showCartToast("تم نسخ الكوبون: " + code, "success");
      })
      .catch(() => {
        fallbackCopy(code);
      });
  } else {
    fallbackCopy(code);
  }
}

function fallbackCopy(code) {
  const textarea = document.createElement("textarea");
  textarea.value = code;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  showCartToast("تم نسخ الكوبون: " + code, "success");
}
