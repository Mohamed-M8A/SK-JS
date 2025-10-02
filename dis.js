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
    if (discountEl) {
      const percentage = Math.round(((original - discounted) / original) * 100);
      discountEl.textContent = `${percentage}%`;
    }

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
// ✅ تنسيق الأسعار (مع العملة)
// ===================================================
document.querySelectorAll(".price-original, .price-discounted, .price-saving").forEach(el => {
  const text = el.innerText.trim();

  if (el.classList.contains("price-saving") && text.includes("وفر:")) {
    const match = text.match(/وفر:\s*([\d.,]+)/);
    if (match && match[1]) {
      const formatted = parseFloat(match[1]).toLocaleString('en-US', { minimumFractionDigits: 2 });
      el.innerText = `وفر: ${formatted} ${getCurrencySymbol()}`;
    }
    return;
  }

  const numberOnly = text.match(/[\d.,]+/);
  if (numberOnly) {
    const formatted = parseFloat(numberOnly[0]).toLocaleString('en-US', { minimumFractionDigits: 2 });
    el.innerText = `${formatted} ${getCurrencySymbol()}`;
  }
});

// ==============================
// ✅ حساب التوفير + ألوان + الجيف
// ==============================
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

      discountValueEl.innerHTML = `
        <span class="save-label">وفر: </span>
        <span class="save-amount">${formattedDiff} ${getCurrencySymbol()}</span>
      `;

      let color = "#2c3e50";
      if (difference >= 100 && difference < 200) color = "#1abc9c";
      else if (difference < 400) color = "#2ecc71";
      else if (difference < 600) color = "#e67e22";
      else if (difference < 1000) color = "#c0392b";
      else if (difference < 1500) color = "#f5008b";
      else if (difference < 2000) color = "#8e44ad";
      else color = "#f39c12";

      discountValueEl.style.fontWeight = "bold";
      discountValueEl.style.color = color;

      discountValueEl.setAttribute(
        "title",
        `الفرق بين السعر القديم (${oldPrice.toFixed(2)}) والجديد (${newPrice.toFixed(2)})`
      );

      if (difference >= 500) {
        const fireGif = document.createElement("img");
        fireGif.src = "https://blogger.googleusercontent.com/img/.../fire.gif";
        fireGif.alt = "🔥🔥🔥";
        fireGif.style.width = "25px";
        fireGif.style.height = "25px";
        fireGif.style.verticalAlign = "middle";
        fireGif.style.margin = "0"; 
        discountValueEl.querySelector(".save-amount").appendChild(fireGif);
      }
    }
  } else {
    discountValueEl.textContent = "";
  }
}
