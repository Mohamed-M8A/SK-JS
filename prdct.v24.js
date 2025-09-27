document.addEventListener("DOMContentLoaded", function () {

  // ==============================
  // ✅ إضافة نجوم التقييم
  // ==============================

function renderStarsFromValue() {
  let rating = parseFloat(document.getElementById("ratingValue").textContent);

  let fullStars = Math.floor(rating);          
  let hasHalf = (rating % 1 !== 0) ? 1 : 0;    
  let emptyStars = 5 - fullStars - hasHalf;   

  let starsHTML = "";

  for (let i = 0; i < fullStars; i++) {
    starsHTML += `<span class="star">★</span>`; 
  }

  if (hasHalf) {
    starsHTML += `<span class="star half">★</span>`; 
  }

  for (let i = 0; i < emptyStars; i++) {
    starsHTML += `<span class="star empty">★</span>`; 
  }

  document.getElementById("stars").innerHTML = starsHTML;
}

renderStarsFromValue();
  
  // ==============================
  // ✅ التبويبات الذكية
  // ==============================

let enableInitialScroll = false; 

function showTab(id, btn) {
  document.querySelectorAll('[id^="tab"]').forEach(t => t.style.display = 'none');
  document.querySelectorAll('.tab-buttons button').forEach(b => b.classList.remove('active'));

  const target = document.getElementById(id);
  if (target) {
    target.style.display = 'block';

    // Scroll لأعلى التاب تلقائيًا (الكود موجود لكن بيتحكم فيه المتغير)
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const stickyHeight = document.querySelector('.tab-buttons')?.offsetHeight || 0;

    setTimeout(() => {
      if (enableInitialScroll) { // ✅ الشرط هنا
        window.scrollTo({
          top: targetTop - stickyHeight - 10,
          behavior: 'smooth'
        });
      }
    }, 100);
  }

  if (btn) btn.classList.add('active');
}

let tabCheck = setInterval(() => {
  const firstBtn = document.querySelector('.tab-buttons button');
  const firstTab = document.getElementById('tab1');

  if (firstBtn && firstTab) {
    showTab('tab1', firstBtn);

    document.querySelectorAll('.tab-buttons button').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('onclick')?.match(/'(.*?)'/)?.[1];
        if (id) showTab(id, btn);
      });
    });

    clearInterval(tabCheck);
  }
}, 100);

setTimeout(() => clearInterval(tabCheck), 5000);

});

  // ==================================
  // ✅ التوجيه لتاب التقييمات رقم (5)
  // =============================

  function showTab(id, btn) {
    document.querySelectorAll('[id^="tab"]').forEach(t => t.style.display = 'none');
    
    document.querySelectorAll('.tab-buttons button').forEach(b => b.classList.remove('active'));

    const target = document.getElementById(id);
    if (target) {
      target.style.display = 'block';

      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      const stickyHeight = document.querySelector('.tab-buttons')?.offsetHeight || 0;

      setTimeout(() => {
        window.scrollTo({
          top: targetTop - stickyHeight - 10,
          behavior: 'smooth'
        });
      }, 100);
    }

    if (btn) btn.classList.add('active');
  }

  window.addEventListener("DOMContentLoaded", function () {
    const goToReviewsBtn = document.getElementById("goToReviews");

    if (goToReviewsBtn) {
      goToReviewsBtn.addEventListener("click", function (e) {
        e.preventDefault();

        const tabButtons = document.querySelectorAll('.tab-buttons button');
        const targetButton = Array.from(tabButtons).find(btn =>
          btn.getAttribute('onclick')?.includes("'tab5'")
        );

        if (targetButton) {
          showTab('tab5', targetButton);

          setTimeout(() => {
            const reviewsSection = document.getElementById('tab5');
            if (reviewsSection) {
              reviewsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }, 300);
        }
      });
    }
  });

  // ==============================
  // ✅ إضافة صور افتراضية للعملاء 
  // ==============================

  const avatarURL = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgwYjQ3P3sS7yC15Dqs4gAPU3sEGpftVMbqMLwaUbIk5lgxsDIxG5LseYewSYgx9ugKh5wI8ZvMZL_Oh2qZd6FD6lvHbSenXP148Iy3AHvflDx8cO6ysEGc3_nOjv4wbs9USnFA2qdgIvy-WX_ybSngrHNRqpuMSACdhRX19hoQztPYC70WNNpU8zEd/w200-h200/6VBx3io.png";

  document.querySelectorAll(".avatar-placeholder").forEach(placeholder => {
    const img = document.createElement("img");
    img.src = avatarURL;
    img.alt = "أفاتار";
    img.className = "reviewer-img";
    placeholder.appendChild(img);
  });

// ===================================================
// ✅ دالة لتنسيق الأرقام: تضيف الفاصلة لكل 3 أرقام
//    وتعرض رقم عشري مكون من خانتين
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
// ✅ تغيير نصوص الأزرار (شراء + إضافة للعربة)
// ===================================================
const buyBtn = document.querySelector(".buy-button");
if (buyBtn) buyBtn.textContent = "اطلب الآن";

const cartBtn = document.querySelector(".add-to-cart");
if (cartBtn) cartBtn.textContent = "أضف للعربة";

// ===================================================
// ✅ عرض عدد التقييمات: جلب العدد من data-count
//    وتنسيقه ليظهر بجانب كلمة "تقييمات"
// ===================================================
const ratingCount = document.getElementById("goToReviews");
if (ratingCount) {
  const count = ratingCount.getAttribute("data-count") || "0";
  ratingCount.textContent = `${count} تقييمات`;
}

// ===================================================
// ✅ تنسيق مدة الشحن: إضافة كلمة "أيام" بعد الرقم
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
// ✅ تلوين تكلفة الشحن إذا كانت "مجانا" باللون الأخضر
//    وإذا لم تكن مجانية يتم استخدام اللون الافتراضي
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
// ✅ عند تحميل الصفحة: معالجة معلومات المنتج
//    - تلوين حالة التوفر (متاح/غير متاح)
//    - التحقق من الشحن والمنتج
//    - إخفاء مدة الشحن إذا المنتج غير متوفر
// ===================================================
document.addEventListener("DOMContentLoaded", function () {
  const boxes = document.querySelectorAll(".info-box");

  let shippingStatus = null;
  let availability = null;
  let shippingTimeBox = null;

  boxes.forEach(box => {
    const value = box.querySelector(".value");
    if (!value) return;

    const text = value.textContent.trim();

    // ✅ تلوين النص إذا المنتج متوفر أو غير متوفر
    if (/متاح|متوفر/.test(text)) {
      Object.assign(value.style, { color: "#2e7d32", fontWeight: "bold" });
    } else if (/غير متاح|غير متوفر/.test(text)) {
      Object.assign(value.style, { color: "#c62828", fontWeight: "bold" });
    }

    // ✅ تخزين العناصر المستخدمة لاحقًا
    if (box.classList.contains("shipping-status")) shippingStatus = text;
    if (box.classList.contains("product-availability")) availability = text;
    if (box.classList.contains("shipping-time")) shippingTimeBox = value;
  });

  // ✅ إذا المنتج غير متوفر أو لا يشحن → نخفي مدة الشحن
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
});

// ===================================================
// ✅ خريطة العملات
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
  const country = localStorage.getItem("Cntry") || "SA";
  return currencySymbols[country] || "ر.س";
}

// ===================================================
// ✅ حقن البيانات من JSON + data-raw
// ===================================================
document.addEventListener("DOMContentLoaded", () => {
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

  // نكتب الرقم كـ data-raw بدل ما نكسر التنسيقات
  const setRaw = (sel, val) => {
    const el = document.querySelector(sel);
    if (!el) return;

    if (val === 0 && sel.includes("shipping-fee .value")) {
      el.textContent = "مجانا";
      el.removeAttribute("data-raw");
    } else {
      el.setAttribute("data-raw", val);
      el.textContent = val; // fallback SEO
    }
  };

  setRaw(".price-discounted", countryData["price-discounted"]);
  setRaw(".price-original", countryData["price-original"]);
  setRaw(".shipping-fee .value", countryData["shipping-fee"]);

  // مدة الشحن
  const stEl = document.querySelector(".shipping-time .value");
  if (stEl) {
    stEl.setAttribute("data-min", countryData["shipping-min-days"]);
    stEl.setAttribute("data-max", countryData["shipping-max-days"]);
    stEl.textContent = `${countryData["shipping-min-days"]}-${countryData["shipping-max-days"]}`;
  }

  const countryShippingEl = document.querySelector(".country-shipping .value");
  if (countryShippingEl) countryShippingEl.textContent = countryData["country-shipping"];

  const availabilityEl = document.querySelector(".product-availability .value");
  if (availabilityEl) availabilityEl.textContent = countryData["product-availability"];

  // بيانات الرسم البياني
  if (Array.isArray(countryData["price-history"])) {
    window.priceData = countryData["price-history"];
  }

  // إطلاق الحدث
  window.dispatchEvent(new CustomEvent('productDataInjected', { 
    detail: { country: currentCountry, countryData } 
  }));
});

// ===================================================
// ✅ تنسيقات + حساب الخصومات
// ===================================================
window.addEventListener("productDataInjected", () => {
  if (typeof window.updateDiscount === "function") {
    window.updateDiscount();
  }

  // تنسيق الأسعار من data-raw
  document.querySelectorAll("[data-raw]").forEach(el => {
    const raw = parseFloat(el.getAttribute("data-raw"));
    if (!isNaN(raw)) {
      el.textContent = `${raw.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${getCurrencySymbol()}`;
    }
  });

  // تنسيق مدة الشحن من data-min / data-max
  document.querySelectorAll(".shipping-time .value").forEach(el => {
    const min = parseInt(el.getAttribute("data-min"), 10);
    const max = parseInt(el.getAttribute("data-max"), 10);
    if (!isNaN(min) && !isNaN(max)) {
      el.textContent = `${min}-${max}`;
    }
  });
});

// ===================================================
// ✅ دالة حساب الخصومات
// ===================================================
window.updateDiscount = function () {
  const originalEl = document.querySelector(".price-original");
  const discountedEl = document.querySelector(".price-discounted");
  const discountEl = document.querySelector(".discount-percentage");
  const savingEl = document.querySelector(".price-saving");

  if (!originalEl || !discountedEl) return;

  const original = parseFloat(originalEl.getAttribute("data-raw")) || 0;
  const discounted = parseFloat(discountedEl.getAttribute("data-raw")) || 0;

  if (original > 0 && discounted > 0 && discounted < original) {
    // نسبة الخصم
    if (discountEl) {
      const percentage = Math.round(((original - discounted) / original) * 100);
      discountEl.textContent = `${percentage}%`;
    }

    // قيمة التوفير
    if (savingEl) {
      const difference = (original - discounted).toFixed(2);
      savingEl.innerHTML = `
        <span class="save-label">وفر: </span>
        <span class="save-amount">${difference} ${getCurrencySymbol()}</span>
      `;

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
      } else {
        color = "#f39c12";
      }

      savingEl.style.fontWeight = "bold";
      savingEl.style.color = color;

      if (difference >= 500) {
        const fireGif = document.createElement("img");
        fireGif.src = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj5J9EL4a9cV3VWmcK1ZYD6OYEB-1APv9gggocpaa7jAJXdgvX8Q7QiaAZC9NxcN25f8MTRSYD6SKwT1LSjL0SB1ovJH1SSkRmqH2y3f1NzWGkC0BE-gpj5bTc1OKi3Rfzh44sAAJSvOS5uq7Ut9ETN-V9LgKim0dkmEVmqUWa-2ZGA7FvMAYrVaJgn/w199-h200/fire%20(1).gif";
        fireGif.alt = "🔥🔥🔥";
        fireGif.style.width = "25px";
        fireGif.style.height = "25px";
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

  // ==============================
  // ✅ الرسم البياني
  // ==============================

document.addEventListener('DOMContentLoaded', function () {
  if (typeof priceData === "undefined" || !Array.isArray(priceData)) return;

  const merged = {};
  priceData.forEach(item => {
    if (!merged[item.date]) merged[item.date] = { total: 0, count: 0 };
    merged[item.date].total += item.price;
    merged[item.date].count += 1;
  });

  const finalData = Object.keys(merged).map(date => ({
    date,
    price: +(merged[date].total / merged[date].count).toFixed(2)
  }));

  const prices = finalData.map(x => x.price);
  const dates = finalData.map(x => x.date);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = +(prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2);
  const endPrice = prices[prices.length - 1];
  const prevPrice = prices[prices.length - 2] || endPrice;

  const getArrow = (value, compare) => {
    if (value > compare) return `<span class="stat-arrow arrow-up">▲</span>`;
    if (value < compare) return `<span class="stat-arrow arrow-down">▼</span>`;
    return "";
  };

  const stats = `
    <div class="price-stats">
      <div class="stat-item current"><strong>السعر الحالي:</strong> ${endPrice} ر.س ${getArrow(endPrice, prevPrice)} <small style="font-size:12px;color:#666;">(${dates[dates.length-1]})</small></div>
      <div class="stat-item avg"><strong>المتوسط:</strong> ${avg} ر.س</div>
      <div class="stat-item min"><strong>الأقل:</strong> ${min} ر.س <small style="font-size:12px;color:#666;">(${dates[prices.indexOf(min)]})</small></div>
      <div class="stat-item max"><strong>الأعلى:</strong> ${max} ر.س <small style="font-size:12px;color:#666;">(${dates[prices.indexOf(max)]})</small></div>
    </div>
  `;

  document.getElementById("price-stats").innerHTML = stats;

  Highcharts.chart('price-chart', {
    chart: { type: 'area', backgroundColor: '#fff' },
    title: { text: '' },
    xAxis: { categories: dates, tickInterval: Math.ceil(dates.length / 6), title: { text: '' } },
    yAxis: { title: { text: 'السعر (ر.س)' } },
    tooltip: {
      formatter: function() {
        const pointPrice = this.y;
        const pointDate = this.x;

        const avgDiff = pointPrice - avg;
        const minDiff = pointPrice - min;
        const maxDiff = pointPrice - max;

        return `
          <b>التاريخ:</b> ${pointDate}<br/>
          <b>السعر:</b> ${pointPrice} ر.س<br/>
          <b>الفرق عن المتوسط:</b> ${avgDiff > 0 ? "+" : ""}${avgDiff.toFixed(2)} ر.س<br/>
          <b>الفرق عن الأقل:</b> ${minDiff > 0 ? "+" : ""}${minDiff.toFixed(2)} ر.س<br/>
          <b>الفرق عن الأعلى:</b> ${maxDiff > 0 ? "+" : ""}${maxDiff.toFixed(2)} ر.س
        `;
      }
    },
    series: [{
      name: 'السعر',
      data: prices,
      color: '#007bff',
      fillOpacity: 0.3
    }],
    credits: { enabled: false }
  });
});

