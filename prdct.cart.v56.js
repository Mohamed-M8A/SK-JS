/***********************
 * ✅ إشعارات Toast موحدة (جذرية)
 ***********************/
function showCartToast(message, type = "success") {
  // لو مفيش كونتينر للتوست، نعمل واحد
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    Object.assign(container.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      zIndex: "9999"
    });
    document.body.appendChild(container);
  }

  // نعمل التوست
  const toast = document.createElement("div");
  toast.textContent = message;
  Object.assign(toast.style, {
    background: type === "error" ? "#e74c3c" : "#2ecc71",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    opacity: "0",
    transform: "translateX(100%)",
    transition: "all 0.4s ease",
    fontFamily: "sans-serif",
    fontSize: "14px",
    minWidth: "200px",
    textAlign: "center"
  });

  container.appendChild(toast);

  // تشغيل الأنيميشن
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(0)";
  }, 50);

  // إخفاء التوست
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
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

  // ✅ ربط زر الكوبون
  const couponBtn = document.querySelector(".copy-button");
  if (couponBtn) {
    couponBtn.addEventListener("click", (e) => {
      e.preventDefault();
      copyCoupon();
    });
  }
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
        showCartToast("فشل نسخ الكوبون!", "error");
      });
  } else {
    // ✅ fallback للمتصفحات القديمة
    const textarea = document.createElement("textarea");
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      showCartToast("تم نسخ الكوبون: " + code, "success");
    } catch (err) {
      showCartToast("فشل نسخ الكوبون!", "error");
    }
    document.body.removeChild(textarea);
  }
}
