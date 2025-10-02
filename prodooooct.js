// ===================================================
// ✅ دالة لتنسيق الأرقام
// ===================================================
function formatPrice(num) {
  const number = parseFloat(num.toString().replace(/,/g, ''));
  if (isNaN(number)) return num;
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// ===================================================
// ✅ تغيير نصوص الأزرار
// ===================================================
const buyBtn = document.querySelector(".buy-button");
if (buyBtn) buyBtn.textContent = "اطلب الآن";

const cartBtn = document.querySelector(".add-to-cart");
if (cartBtn) cartBtn.textContent = "أضف للعربة";

// ===================================================
// ✅ عرض عدد التقييمات
// ===================================================
const ratingCount = document.getElementById("goToReviews");
if (ratingCount) {
  const count = ratingCount.getAttribute("data-count") || "0";
  ratingCount.textContent = `${count} تقييمات`;
}

// ===================================================
// ✅ تنسيق مدة الشحن
// ===================================================
const shippingTime = document.querySelector(".shipping-time .value");
if (shippingTime) {
  const text = shippingTime.innerText.trim();
  const match = text.match(/[\d\s\-–]+/);
  if (match) {
    shippingTime.innerText = `${match[0]} أيام`;
  }
}

// ===================================================
// ✅ تلوين تكلفة الشحن
// ===================================================
const shippingBox = document.querySelector(".shipping-fee .value");
if (shippingBox) {
  if (/مجانا|مجاناً/.test(shippingBox.innerText.trim())) {
    Object.assign(shippingBox.style, { color: "#2e7d32", fontWeight: "bold" });
  } else {
    Object.assign(shippingBox.style, { color: "#222", fontWeight: "normal" });
  }
}

// ===================================================
// ✅ حالة التوفر + الشحن
// ===================================================
const boxes = document.querySelectorAll(".info-box");
let shippingStatus = null;
let availability = null;
let shippingTimeBox = null;

boxes.forEach(box => {
  const value = box.querySelector(".value");
  if (!value) return;

  const text = value.textContent.trim();

  if (/متاح|متوفر/.test(text)) {
    Object.assign(value.style, { color: "#2e7d32", fontWeight: "bold" });
  } else if (/غير متاح|غير متوفر/.test(text)) {
    Object.assign(value.style, { color: "#c62828", fontWeight: "bold" });
  }

  if (box.classList.contains("shipping-status")) shippingStatus = text;
  if (box.classList.contains("product-availability")) availability = text;
  if (box.classList.contains("shipping-time")) shippingTimeBox = value;
});

const negativeKeywords = ["غير", "غير متاح", "غير متوفر", "لا يشحن"];
if (
  negativeKeywords.some(word => shippingStatus?.includes(word)) ||
  negativeKeywords.some(word => availability?.includes(word))
) {
  if (shippingTimeBox) {
    shippingTimeBox.textContent = "-";
    Object.assign(shippingTimeBox.style, { color: "#000", fontWeight: "normal" });
  }
}

// ===================================================
// ✅ خريطة العملات
// ===================================================
const currencySymbols = {
  "SA": "ر.س",
  "AE": "د.إ",
  "OM": "ر.ع",
  "MA": "د.م",
  "DZ": "د.ج",
  "TN": "د.ت"
};

function getCurrencySymbol() {
  const country = localStorage.getItem("Cntry") || "SA";
  return currencySymbols[country] || "ر.س";
}

// ===================================================
// ✅ تنسيق تكلفة الشحن
// ===================================================
const shippingFee = document.querySelector(".shipping-fee .value");
if (shippingFee) {
  const text = shippingFee.innerText.trim();
  const match = text.match(/[\d.,\-–]+/);
  if (match) {
    const formatted = formatPrice(match[0]);
    shippingFee.innerText = `${formatted} ${getCurrencySymbol()}`;
  }
}
