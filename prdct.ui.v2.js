// ==============================
// ✅ إضافة نجوم التقييم
// ==============================
function renderStarsFromValue() {
  const ratingValueEl = document.getElementById("ratingValue");
  const starsContainer = document.getElementById("stars");
  if (!ratingValueEl || !starsContainer) return;

  let rating = parseFloat(ratingValueEl.textContent);
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

  starsContainer.innerHTML = starsHTML;
}

// ✅ استدعاء الدالة
renderStarsFromValue();

// ===================================================
// ✅ عرض عدد التقييمات
// ===================================================
const ratingCount = document.getElementById("goToReviews");
if (ratingCount) {
  const count = ratingCount.getAttribute("data-count") || "0";
  ratingCount.textContent = `${count} تقييمات`;
}

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

    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const stickyHeight = document.querySelector('.tab-buttons')?.offsetHeight || 0;

    setTimeout(() => {
      if (enableInitialScroll) {
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

// ==================================
// ✅ التوجيه لتاب التقييمات رقم (5)
// ==================================
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

// ===================================================
// ✅ تغيير نصوص الأزرار (شراء + إضافة للعربة)
// ===================================================
const buyBtn = document.querySelector(".buy-button");
if (buyBtn) buyBtn.textContent = "اطلب الآن";

const cartBtn = document.querySelector(".add-to-cart");
if (cartBtn) cartBtn.textContent = "أضف للعربة";

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
// ✅ معالجة معلومات المنتج
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
