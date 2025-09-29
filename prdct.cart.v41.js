/***********************
 * ✅ إشعارات Toast موحدة (مع زر نسخ كوبون)
 ***********************/
function showCartToast(message, type = "success", couponCode = null) {
  const toast = document.createElement("div");
  toast.className = "cart-toast";
  toast.style.background = (type === "error") ? "#e74c3c" : "#2ecc71";

  // نضيف الرسالة الأساسية
  const msgSpan = document.createElement("span");
  msgSpan.textContent = message;
  toast.appendChild(msgSpan);

  // ✅ لو فيه كوبون، نضيف زر نسخ
  if (couponCode) {
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "📋 نسخ";
    copyBtn.style.marginLeft = "10px";
    copyBtn.style.padding = "4px 8px";
    copyBtn.style.border = "none";
    copyBtn.style.borderRadius = "6px";
    copyBtn.style.cursor = "pointer";
    copyBtn.style.fontSize = "12px";
    copyBtn.style.background = "#fff";
    copyBtn.style.color = "#333";
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(couponCode).then(() => {
        alert("تم نسخ الكوبون: " + couponCode);
      }).catch(() => {
        alert("فشل نسخ الكوبون!");
      });
    });
    toast.appendChild(copyBtn);
  }

  // ✅ إظهار التوست
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
 * ✅ نسخ الكوبون (نسخة مضمونة)
 ***********************/
function copyCoupon() {
  const codeEl = document.getElementById("couponCode");
  const code = codeEl ? codeEl.innerText.trim() : "";

  if (!code) {
    showCartToast("لا يوجد كوبون للنسخ!", "error");
    return;
  }

  // نحاول النسخ بالطريقة الحديثة
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code)
      .catch(() => {
        // fallback لو فشل
        const textarea = document.createElement("textarea");
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      })
      .finally(() => {
        // ✅ نعرض التوست بأي حال
        showCartToast("تم نسخ الكوبون: " + code, "success");
      });
  } else {
    // fallback للمتصفحات القديمة
    const textarea = document.createElement("textarea");
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    showCartToast("تم نسخ الكوبون: " + code, "success");
  }
}
