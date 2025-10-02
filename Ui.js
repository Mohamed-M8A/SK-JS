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
