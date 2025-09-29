/***********************
 * ✅ إنشاء طبقة التوست العالمية
 ***********************/
function initToastLayer() {
  let layer = document.getElementById("global-toast-layer");
  if (!layer) {
    layer = document.createElement("div");
    layer.id = "global-toast-layer";
    document.body.prepend(layer); // نحطها في أول الـ body

    Object.assign(layer.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      width: "auto",
      zIndex: "9999999",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      pointerEvents: "none"
    });
  }
  return layer;
}

/***********************
 * ✅ دالة التوست الموحد
 ***********************/
function showToast(message, type = "success") {
  const layer = initToastLayer();

  const toast = document.createElement("div");
  toast.textContent = message;

  Object.assign(toast.style, {
    minWidth: "220px",
    maxWidth: "300px",
    background: type === "error" ? "#e74c3c" : "#2ecc71",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
    opacity: "0",
    transform: "translateX(120%)",
    transition: "all 0.4s ease",
    pointerEvents: "auto"
  });

  layer.appendChild(toast);

  // إظهار التوست
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(0)";
  });

  // إخفاء بعد 3 ثواني
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(120%)";
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/***********************
 * ✅ دالة العربة
 ***********************/
function addToCart(productUrl, clean = false) {
  if (clean) {
    const urlObj = new URL(productUrl);
    urlObj.search = ""; // نحذف الباراميترات
    productUrl = urlObj.toString();
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // منع التكرار
  const exists = cart.some(item => item.productUrl === productUrl);

  if (exists) {
    showToast("المنتج موجود بالفعل في العربة!", "error");
    return;
  }

  cart.push({ productUrl });
  localStorage.setItem("cart", JSON.stringify(cart));
  showToast("تمت إضافة المنتج إلى العربة بنجاح!", "success");
}

// زر إضافة للعربة
function handleAddToCart(event) {
  event.preventDefault();
  event.stopPropagation();

  const productUrl = window.location.href;
  addToCart(productUrl, true);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.replaceWith(btn.cloneNode(true)); // إزالة الهاندلرز القديمة
  });

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", handleAddToCart);
  });
});

// زر الويدجت (الرئيسية)
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
 * ✅ زر نسخ الكوبون
 ***********************/
function copyCoupon() {
  const codeEl = document.getElementById("couponCode");
  const code = codeEl ? codeEl.innerText.trim() : "";

  if (!code) {
    showToast("لا يوجد كوبون للنسخ!", "error");
    return;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code)
      .then(() => {
        showToast("تم نسخ الكوبون: " + code, "success");
      })
      .catch(() => {
        showToast("فشل نسخ الكوبون!", "error");
      });
  } else {
    // fallback للمتصفحات القديمة
    const textarea = document.createElement("textarea");
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      showToast("تم نسخ الكوبون: " + code, "success");
    } catch (err) {
      showToast("فشل نسخ الكوبون!", "error");
    }
    document.body.removeChild(textarea);
  }
}
