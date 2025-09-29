/***********************
 * ✅ إشعارات Toast موحدة
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

  // 🛑 منع التكرار
  const exists = cart.some(item => item.productUrl === productUrl);

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
 * ✅ نسخ الكوبون (إصدار مضمون 100%)
 ***********************/
function copyCoupon() {
  const codeEl = document.getElementById("couponCode");
  const code = codeEl ? codeEl.innerText.trim() : "";

  if (!code) {
    showCartToast("لا يوجد كوبون للنسخ!", "error");
    return;
  }

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        // ✅ أول ما يتم النسخ
        setTimeout(() => {
          showCartToast("تم نسخ الكوبون: " + code, "success");
        }, 50);
      }).catch(() => {
        fallbackCopy(code);
      });
    } else {
      fallbackCopy(code);
    }
  } catch (e) {
    fallbackCopy(code);
  }
}

/***********************
 * ✅ fallback نسخ للكوبون
 ***********************/
function fallbackCopy(code) {
  const textarea = document.createElement("textarea");
  textarea.value = code;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  // ✅ نعرض التوست بعد النسخ
  setTimeout(() => {
    showCartToast("تم نسخ الكوبون: " + code, "success");
  }, 50);
}
