/***********************
 * ✅ إشعارات Toast عامة
 ***********************/
function showCartToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "cart-toast";
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
 * ✅ إدارة العربة
 ***********************/
function addToCart(productUrl, clean = false) {
  // 🔹 تنظيف الرابط لو مطلوب
  if (clean) {
    const urlObj = new URL(productUrl);
    urlObj.search = ""; // نشيل أي باراميتر
    productUrl = urlObj.toString();
  }

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

/***********************
 * ✅ زر صفحة المنتج
 ***********************/
function handleAddToCart(event) {
  event.preventDefault();
  event.stopPropagation();

  const productUrl = window.location.href;
  addToCart(productUrl, true); // 🔹 هنا بينضف الرابط
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.removeEventListener("click", handleAddToCart);
    btn.addEventListener("click", handleAddToCart);
  });
});

/***********************
 * ✅ زر من الويدجت (الرئيسية)
 ***********************/
document.addEventListener("click", function (e) {
  const postCard = e.target.closest(".post-card");
  if (!postCard) return;

  const cartButton = e.target.closest(".external-cart-button");
  if (cartButton) {
    try {
      const productUrl = postCard.getAttribute("data-product-url");
      addToCart(productUrl, false); // 🔹 هنا ما بننضفش الرابط
    } catch (err) {
      console.error("خطأ في إضافة المنتج للعربة:", err);
      showCartToast("حدث خطأ أثناء الإضافة!", "error");
    }
    e.preventDefault();
  }
});

/***********************
 * ✅ نسخ الكوبون
 ***********************/
window.copyCoupon = function () {
  const codeEl = document.getElementById("couponCode");
  const code = codeEl ? codeEl.innerText.trim() : "";

  if (!code) {
    showCartToast("لا يوجد كوبون للنسخ!", "error");
    return;
  }

  navigator.clipboard.writeText(code)
    .then(() => showCartToast("تم نسخ الكوبون: " + code, "success"))
    .catch(() => showCartToast("فشل نسخ الكوبون!", "error"));
};
