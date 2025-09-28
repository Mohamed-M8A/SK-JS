/***********************
 * ✅ إشعارات Toast
 ***********************/
function showCartToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "cart-toast";
  toast.textContent = message;

  toast.style.background = (type === "error") ? "#e74c3c" : "#2ecc71";

  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/***********************
 * ✅ تخزين العربة (مع منع التكرار)
 ***********************/
function addToCart(productUrl, clean = false) {
  if (clean) {
    const urlObj = new URL(productUrl);
    urlObj.search = ""; // نحذف كل الباراميترات
    productUrl = urlObj.toString();
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // منع التكرار بأي شكل
  const exists = cart.some(item => item.productUrl === productUrl);
  console.log("محاولة إضافة:", productUrl, " - موجود بالفعل؟", exists);

  if (exists) {
    showCartToast("المنتج موجود بالفعل في العربة!", "error");
    return;
  }

  cart.push({ productUrl });
  localStorage.setItem("cart", JSON.stringify(cart));
  showCartToast("تمت إضافة المنتج إلى العربة بنجاح!", "success");
}

/***********************
 * ✅ زر صفحة المنتج
 ***********************/
function handleAddToCart(event) {
  event.preventDefault();
  event.stopPropagation();

  const productUrl = window.location.href;
  console.log("زر صفحة المنتج - URL:", productUrl);

  addToCart(productUrl, true); // تنظيف الرابط
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.replaceWith(btn.cloneNode(true)); // إزالة أي event handlers قديمة
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
    console.log("زر الويدجت - URL:", productUrl);

    addToCart(productUrl, false);
    e.preventDefault();
  }
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
  const couponBtn = document.getElementById("copyCouponBtn");
  if (couponBtn) {
    couponBtn.removeEventListener("click", copyCoupon);
    couponBtn.addEventListener("click", copyCoupon);
  }

  // في حالة الزر مكتوب فيه onclick="copyCoupon()"
  window.copyCoupon = copyCoupon;
});
