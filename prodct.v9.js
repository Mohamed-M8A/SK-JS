document.addEventListener("DOMContentLoaded", () => {
  // ===================================================
  // ✅ تحميل بيانات المنتج من JSON
  // ===================================================
  const currentCountry = localStorage.getItem("Cntry") || "SA";
  const dataScript = document.getElementById("product-data");
  if (!dataScript) return;

  let productData;
  try { 
    productData = JSON.parse(dataScript.textContent || "{}"); 
  } catch (e) { 
    console.error("product-data JSON parse error", e); 
    return; 
  }

  const countryData = productData.countries?.[currentCountry];
  if (!countryData) return;

  // ===================================================
  // ✅ خريطة العملات + دالة التنسيق
  // ===================================================
  const currencySymbols = {
    "SA": "ر.س", // السعودية
    "AE": "د.إ", // الإمارات
    "OM": "ر.ع", // عُمان
    "MA": "د.م", // المغرب
    "DZ": "د.ج", // الجزائر
    "TN": "د.ت"  // تونس
  };

  function getCurrencySymbol() {
    return currencySymbols[currentCountry] || "ر.س";
  }

  function formatPrice(num) {
    const number = parseFloat(num.toString().replace(/,/g, ""));
    if (isNaN(number)) return num;
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
    // ===================================================
  // ✅ تحديث عناصر الصفحة
  // ===================================================
  const setText = (sel, val, addCurrency = false) => {
    const el = document.querySelector(sel);
    if (!el) return;

    if (val === 0 && sel.includes("shipping-fee .value")) {
      el.textContent = "مجاناً";
    } else {
      const formatted = formatPrice(val);
      el.textContent = addCurrency 
        ? `${formatted} ${getCurrencySymbol()}` 
        : formatted;
    }
  };

  // ✅ الأسعار
  setText(".price-discounted", countryData["price-discounted"], true);
  setText(".price-original", countryData["price-original"], true);

  // ✅ تكلفة الشحن
  setText(".shipping-fee .value", countryData["shipping-fee"], true);

  // ✅ مدة الشحن: عكس الترتيب + إضافة "أيام"
  const stEl = document.querySelector(".shipping-time .value");
  if (stEl) {
    stEl.textContent = `${countryData["shipping-max-days"]}-${countryData["shipping-min-days"]} أيام`;
  }

  // ✅ إمكانية الشحن (متاح/غير متاح)
  const countryShippingEl = document.querySelector(".country-shipping .value");
  if (countryShippingEl) {
    countryShippingEl.textContent = countryData["country-shipping"];
  }

  // ✅ حالة المنتج
  const availabilityEl = document.querySelector(".product-availability .value");
  if (availabilityEl) {
    availabilityEl.textContent = countryData["product-availability"];
  }
  // ===================================================
  // ✅ حساب نسبة الخصم والتوفير
  // ===================================================
  window.updateDiscount = function () {
    const originalEl = document.querySelector(".price-original");
    const discountedEl = document.querySelector(".price-discounted");
    const discountEl = document.querySelector(".discount-percentage");
    const savingEl = document.querySelector(".price-saving");

    if (!originalEl || !discountedEl) return;

    const original = parseFloat(originalEl.textContent.replace(/[^\d.]/g, "")) || 0;
    const discounted = parseFloat(discountedEl.textContent.replace(/[^\d.]/g, "")) || 0;

    if (original > 0 && discounted > 0 && discounted < original) {
      // ✅ نسبة الخصم
      if (discountEl) {
        const percentage = Math.round(((original - discounted) / original) * 100);
        discountEl.textContent = `${percentage}%`;
      }

      // ✅ قيمة التوفير
      if (savingEl) {
        const difference = (original - discounted).toFixed(2);
        savingEl.innerHTML = `
          <span class="save-label">وفر: </span>
          <span class="save-amount">${difference} ${getCurrencySymbol()}</span>
        `;

        // ✅ اختيار اللون حسب القيمة
        let color = "#2c3e50";
        if (difference >= 100 && difference < 200) {
          color = "#1abc9c";
        } else if (difference < 400) {
          color = "#2ecc71";
        } else if (difference < 600) {
          color = "#e67e22";
        } else if (difference < 1000) {
          color = "#c0392b";
        } else if (difference < 1500) {
          color = "#f5008b";
        } else if (difference < 2000) {
          color = "#8e44ad";
        } else if (difference >= 2000) {
          color = "#f39c12";
        }

        savingEl.style.fontWeight = "bold";
        savingEl.style.color = color;

        // ✅ إضافة 🔥 لو التوفير كبير
        if (difference >= 500) {
          const fireGif = document.createElement("img");
          fireGif.src = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj5J9EL4a9cV3VWmcK1ZYD6OYEB-1APv9gggocpaa7jAJXdgvX8Q7QiaAZC9NxcN25f8MTRSYD6SKwT1LSjL0SB1ovJH1SSkRmqH2y3f1NzWGkC0BE-gpj5bTc1OKi3Rfzh44sAAJSvOS5uq7Ut9ETN-V9LgKim0dkmEVmqUWa-2ZGA7FvMAYrVaJgn/w199-h200/fire%20(1).gif";
          fireGif.alt = "🔥";
          fireGif.style.width = "20px";
          fireGif.style.height = "20px";
          fireGif.style.verticalAlign = "middle";
          fireGif.style.margin = "0";

          const saveAmountEl = savingEl.querySelector(".save-amount");
          if (saveAmountEl) saveAmountEl.appendChild(fireGif);
        }
      }
    } else {
      if (discountEl) discountEl.textContent = "";
      if (savingEl) savingEl.textContent = "";
    }
  };
