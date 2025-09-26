document.addEventListener('DOMContentLoaded', () => {


  // ==============================
  // ✅ إعداد السلايدر الرئيسي
  // ==============================

const container = document.querySelector('.main-image-container');
const thumbnails = [...document.querySelectorAll('.thumbnail-container img')];
const thumbContainer = document.querySelector('.thumbnail-container');
const scrollAmount = 240;
let currentIndex = 0;

const mainImg = document.getElementById('mainImage');

// ✅ تغيير الصورة
function changeImage(index) {
  if (index === currentIndex) return;
  currentIndex = index;

  mainImg.src = thumbnails[index].src;
  Object.assign(mainImg.style, {
    objectFit: 'contain',
    backgroundColor: 'black',
    width: '100%',
    height: '100%'
  });

  thumbnails.forEach(img => img.classList.toggle('active-thumb', img === thumbnails[index]));
  scrollThumbnailIntoView(index);
}

// ✅ تمرير المصغّرات
function scrollThumbnailIntoView(index) {
  const thumb = thumbnails[index];
  const cRect = thumbContainer.getBoundingClientRect();
  const tRect = thumb.getBoundingClientRect();
  const isRTL = getComputedStyle(thumbContainer).direction === 'rtl';

  if (isRTL) {
    thumbContainer.scrollLeft += (tRect.left < cRect.left) 
      ? tRect.left - cRect.left - 10 
      : (tRect.right > cRect.right) ? tRect.right - cRect.right + 10 : 0;
  } else {
    thumbContainer.scrollLeft += (tRect.left < cRect.left) 
      ? -(cRect.left - tRect.left + 10) 
      : (tRect.right > cRect.right) ? tRect.right - cRect.right + 10 : 0;
  }
}

// ✅ أزرار التحريك
document.getElementById('thumbsRight')?.addEventListener('click', () => thumbContainer.scrollLeft += scrollAmount);
document.getElementById('thumbsLeft')?.addEventListener('click', () => thumbContainer.scrollLeft -= scrollAmount);

// ✅ الأسهم الكبيرة
document.getElementById('mainImageRightArrow')?.addEventListener('click', () => changeImage((currentIndex - 1 + thumbnails.length) % thumbnails.length));
document.getElementById('mainImageLeftArrow')?.addEventListener('click', () => changeImage((currentIndex + 1) % thumbnails.length));

// ✅ المصغّرات
thumbnails.forEach((img, i) => img.addEventListener('click', () => changeImage(i)));

// ✅ أول صورة
changeImage(0);

  // ==============================
  // ✅ Modal لتكبير الصورة
  // ==============================

function createModal() {
  if (document.getElementById("imageModal")) return;

  const modalHTML = `
    <div id="imageModal" class="modal">
      <span class="close" onclick="closeModal()">&times;</span>
      <img class="modal-content" id="modalImage" />
      <span class="arrow left" onclick="navigateModal('prev')"></span>
      <span class="arrow right" onclick="navigateModal('next')"></span>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

createModal(); 

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");

window.openModal = function (index) {
  if (!modal || !modalImage) return;
  modal.style.display = "flex";
  modalImage.src = thumbnails[index].src;

  // ✅ ضبط الصورة داخل الـ Modal بنفس طريقة 1:1
  modalImage.style.objectFit = 'contain';
  modalImage.style.backgroundColor = 'black';
  modalImage.style.width = '100%';
  modalImage.style.height = '100%';

  currentIndex = index;
};

window.closeModal = function () {
  if (modal) modal.style.display = "none";
};

window.navigateModal = function (direction) {
  if (!thumbnails.length || !modalImage) return;
  currentIndex = direction === "next"
    ? (currentIndex + 1) % thumbnails.length
    : (currentIndex - 1 + thumbnails.length) % thumbnails.length;
  modalImage.src = thumbnails[currentIndex].src;

  // ✅ نفس ضبط 1:1 داخل المودال
  modalImage.style.objectFit = 'contain';
  modalImage.style.backgroundColor = 'black';
  modalImage.style.width = '100%';
  modalImage.style.height = '100%';
};
  
// ==============================
// ✅ إضافة المنتج إلى العربة
// ==============================

function addToCart(productUrl) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const exists = cart.some(item => item.productUrl === productUrl);

  if (exists) {
    showToast("المنتج موجود بالفعل في العربة!", "error");
  } else {
    cart.push({ productUrl });
    localStorage.setItem("cart", JSON.stringify(cart));
    showToast("تمت إضافة المنتج إلى العربة بنجاح!", "success");
  }
}

function handleAddToCart(event) {
  const productUrl = window.location.href;
  addToCart(productUrl);
}

document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.removeEventListener("click", handleAddToCart);
  btn.addEventListener("click", handleAddToCart);
});

// ==============================
// ✅ نسخ الكوبون
// ==============================

window.copyCoupon = function () {
  const code = document.getElementById("couponCode")?.innerText;
  if (!code) return;

  navigator.clipboard.writeText(code)
    .then(() => showToast("تم نسخ الكوبون: " + code, "success"))
    .catch(err => {
      console.error("فشل النسخ: ", err);
      showToast("فشل نسخ الكوبون!", "error");
    });
};

// ==============================
// ✅ إشعارات Toast 
// ==============================

// ✅ دالة توست عامة
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  // ألوان حسب النوع
  if (type === "error") {
    toast.style.background = "#e74c3c"; // أحمر
  } else if (type === "success") {
    toast.style.background = "#2ecc71"; // أخضر
  } else {
    toast.style.background = "#555"; // افتراضي رمادي
  }

  toast.style.color = "#fff";
  document.body.appendChild(toast);

  // إظهار
  setTimeout(() => toast.classList.add("show"), 100);

  // إخفاء
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

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

// ✅ دالة تجيب رمز العملة حسب الدولة المخزنة
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

// ==============================
// ✅ حساب نسبة الخصم والتوفير
// ==============================
window.updateDiscount = function () {
  const originalEl = document.querySelector(".price-original");
  const discountedEl = document.querySelector(".price-discounted");
  const discountEl = document.querySelector(".discount-percentage");
  const savingEl = document.querySelector(".price-saving");

  if (!originalEl || !discountedEl) return;

  const original = parseFloat(originalEl.textContent.trim()) || 0;
  const discounted = parseFloat(discountedEl.textContent.trim()) || 0;

  if (original > 0 && discounted > 0 && discounted < original) {
    // ✅ نسبة الخصم
    if (discountEl) {
      const percentage = Math.round(((original - discounted) / original) * 100);
      discountEl.textContent = `${percentage}%`;
    }

    // ✅ قيمة التوفير
    if (savingEl) {
      const difference = (original - discounted).toFixed(2);
      savingEl.textContent = `وفر: ${difference}`;
    }
  } else {
    if (discountEl) discountEl.textContent = "";
    if (savingEl) savingEl.textContent = "";
  }
};

// ===================================================
// ✅ تنسيق الأسعار (مع العملة حسب الدولة)
// ===================================================
document.querySelectorAll(".price-original, .price-discounted, .price-saving").forEach(el => {
  const text = el.innerText.trim();

  // ✅ حالة التوفير: "وفر: ..."
  if (el.classList.contains("price-saving") && text.includes("وفر:")) {
    const match = text.match(/وفر:\s*([\d.,]+)/);
    if (match && match[1]) {
      const formatted = formatPrice(match[1]);
      el.innerText = `وفر: ${formatted} ${getCurrencySymbol()}`;
    }
    return;
  }

  // ✅ الأسعار العادية
  const numberOnly = text.match(/[\d.,]+/);
  if (numberOnly) {
    const formatted = formatPrice(numberOnly[0]);
    el.innerText = `${formatted} ${getCurrencySymbol()}`;
  }
});

// ==============================
// ✅ حساب التوفير
// ==============================
document.addEventListener("DOMContentLoaded", function () {
  const oldPriceEl = document.querySelector(".price-original");
  const newPriceEl = document.querySelector(".price-discounted");
  const discountValueEl = document.querySelector(".price-saving");

  if (oldPriceEl && newPriceEl && discountValueEl) {
    const oldPrice = parseFloat(oldPriceEl.textContent.replace(/[^\d.]/g, ""));
    const newPrice = parseFloat(newPriceEl.textContent.replace(/[^\d.]/g, ""));

    if (!isNaN(oldPrice) && !isNaN(newPrice) && oldPrice > newPrice) {
      const difference = oldPrice - newPrice;

      if (difference < 50) {
        discountValueEl.textContent = "";
      } else {
        const formattedDiff = difference.toFixed(2);

        // بدون أي مسافة أو margin جنب الجيف
        discountValueEl.innerHTML = `
          <span class="save-label">وفر: </span>
          <span class="save-amount">${formattedDiff} ${getCurrencySymbol()}</span>
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

        discountValueEl.style.fontWeight = "bold";
        discountValueEl.style.color = color;

        discountValueEl.setAttribute(
          "title",
          `هذا المبلغ هو الفرق بين السعر القديم (${oldPrice.toFixed(2)}) والجديد (${newPrice.toFixed(2)})`
        );

        if (difference >= 500) {
          const fireGif = document.createElement("img");
          fireGif.src = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj5J9EL4a9cV3VWmcK1ZYD6OYEB-1APv9gggocpaa7jAJXdgvX8Q7QiaAZC9NxcN25f8MTRSYD6SKwT1LSjL0SB1ovJH1SSkRmqH2y3f1NzWGkC0BE-gpj5bTc1OKi3Rfzh44sAAJSvOS5uq7Ut9ETN-V9LgKim0dkmEVmqUWa-2ZGA7FvMAYrVaJgn/w199-h200/fire%20(1).gif";
          fireGif.alt = "🔥🔥🔥";
          fireGif.style.width = "25px";
          fireGif.style.height = "25px";
          fireGif.style.verticalAlign = "middle";
          fireGif.style.margin = "0"; 

          const saveAmountEl = discountValueEl.querySelector(".save-amount");
          saveAmountEl.appendChild(fireGif);
        }
      }
    } else {
      discountValueEl.textContent = "";
    }
  }
});

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
      <div class="stat-item current"><strong>السعر الحالي:</strong> ${endPrice} ر.س ${getArrow(endPrice, prevPrice)} <small style="font-size:12px;color:#666;">(${(endPrice - prevPrice).toFixed(2)} ر.س)</small></div>
      <div class="stat-item"><strong>المتوسط:</strong> ${avg} ر.س ${getArrow(avg, endPrice)}</div>
      <div class="stat-item"><strong>أقل سعر:</strong> ${min} ر.س ${getArrow(min, endPrice)}</div>
      <div class="stat-item"><strong>أعلى سعر:</strong> ${max} ر.س ${getArrow(max, endPrice)}</div>
    </div>
  `;
  document.getElementById("priceChart")?.insertAdjacentHTML("afterend", stats);

  const tooltipEl = document.createElement("div");
  tooltipEl.id = "chart-tooltip";
  document.body.appendChild(tooltipEl);

  const externalTooltipHandler = (context) => {
    const { chart, tooltip } = context;
    const el = tooltipEl;

    if (tooltip.opacity === 0) {
  el.style.opacity = 0;
  el.style.display = "none";
  return;
}

el.style.display = "block";
el.style.opacity = 1;


    const dataIndex = tooltip.dataPoints[0].dataIndex;
    const value = tooltip.dataPoints[0].raw;
    const prev = dataIndex > 0 ? finalData[dataIndex - 1].price : value;
    const diff = +(value - prev).toFixed(2);
    const percent = prev !== 0 ? ((diff / prev) * 100).toFixed(1) : 0;

    const arrow = diff > 0
      ? `<span class="stat-arrow arrow-up">▲</span>`
      : diff < 0
        ? `<span class="stat-arrow arrow-down">▼</span>`
        : `<span class="stat-arrow">-</span>`;

    const date = finalData[dataIndex].date;

el.innerHTML = `
  <div class="tooltip-line" style="font-weight:bold;">${date}</div>
  <div class="tooltip-line">السعر: ${value} ر.س</div>
  <div class="tooltip-line">التغير: ${arrow} ${diff} ر.س</div>
  <div class="tooltip-line">النسبة: ${percent}%</div>
`;

    const position = chart.canvas.getBoundingClientRect();
    el.style.opacity = 1;
    const tooltipWidth = 160; // تقديري – حسب تصميم التولتيب
const pageWidth = window.innerWidth;
const chartLeft = position.left + window.pageXOffset;
const pointX = chartLeft + tooltip.caretX;

// لو النقطة قربت من طرف اليمين (أبعد من 70% من الشاشة) → خليه يفتح ناحية الشمال
if (pointX > pageWidth * 0.7) {
  el.style.left = (pointX - tooltipWidth - 20) + 'px';
} else {
  el.style.left = (pointX + 10) + 'px';
}

el.style.top = position.top + window.pageYOffset + tooltip.caretY - 40 + 'px';
  };

  const ctx = document.getElementById("priceChart")?.getContext("2d");
  if (ctx) {
    new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [{
          label: "السعر (ر.س)",
          data: finalData.map(d => d.price),
          borderColor: "#2c3e50",
          backgroundColor: "rgba(44,62,80,0.1)",
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.2
        }]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          tooltip: {
            enabled: false,
            external: externalTooltipHandler
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "التاريخ",
              color: "#333",
              font: { size: 14 }
            },
            ticks: { color: "#333" },
            grid: { color: "rgba(0, 0, 0, 0.05)" }
          },
          y: {
            title: {
              display: true,
              text: "السعر (ر.س)",
              color: "#333",
              font: { size: 14 }
            },
            ticks: { color: "#333" },
            grid: { color: "rgba(0, 0, 0, 0.05)" }
          }
        }
      }
    });
  }
});

  // ==============================
  // ✅ نهاية الإسكربت
  // ==============================


