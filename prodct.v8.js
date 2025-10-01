document.addEventListener('DOMContentLoaded', () => {
// ===================================================
// ✅ خريطة العملات + فورمات الأسعار
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

function formatPrice(num) {
  const number = parseFloat(num.toString().replace(/,/g, ""));
  if (isNaN(number)) return num;
  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
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

// ===================================================
// ✅ حساب نسبة الخصم + قيمة التوفير + تنسيق الأسعار
// ===================================================
window.updateDiscount = function () {
  const originalEl = document.querySelector(".price-original");
  const discountedEl = document.querySelector(".price-discounted");
  const discountEl = document.querySelector(".discount-percentage");
  const savingEl = document.querySelector(".price-saving");

  if (!originalEl || !discountedEl) return;

  const original = parseFloat(originalEl.textContent.replace(/[^\d.]/g, "")) || 0;
  const discounted = parseFloat(discountedEl.textContent.replace(/[^\d.]/g, "")) || 0;
  const symbol = getCurrencySymbol();

  // ✅ تنسيق السعرين بالعملة
  if (originalEl) originalEl.textContent = `${formatPrice(original)} ${symbol}`;
  if (discountedEl) discountedEl.textContent = `${formatPrice(discounted)} ${symbol}`;

  if (original > 0 && discounted > 0 && discounted < original) {
    // ✅ نسبة الخصم
    if (discountEl) {
      const percentage = Math.round(((original - discounted) / original) * 100);
      discountEl.textContent = `${percentage}%`;
    }

    // ✅ قيمة التوفير
    if (savingEl) {
      const difference = original - discounted;
      if (difference < 50) {
        savingEl.textContent = "";
      } else {
        const formattedDiff = formatPrice(difference);
        savingEl.innerHTML = `
          <span class="save-label">وفر: </span>
          <span class="save-amount">${formattedDiff} ${symbol}</span>
        `;

        // 🎨 ألوان حسب قيمة التوفير
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

        savingEl.setAttribute(
          "title",
          `هذا المبلغ هو الفرق بين السعر القديم (${formatPrice(original)}) والجديد (${formatPrice(discounted)})`
        );

        // 🔥 إضافة الجيف لو التوفير كبير
        if (difference >= 500) {
          const fireGif = document.createElement("img");
          fireGif.src = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj5J9EL4a9cV3VWmcK1ZYD6OYEB-1APv9gggocpaa7jAJXdgvX8Q7QiaAZC9NxcN25f8MTRSYD6SKwT1LSjL0SB1ovJH1SSkRmqH2y3f1NzWGkC0BE-gpj5bTc1OKi3Rfzh44sAAJSvOS5uq7Ut9ETN-V9LgKim0dkmEVmqUWa-2ZGA7FvMAYrVaJgn/w199-h200/fire%20(1).gif";
          fireGif.alt = "🔥🔥🔥";
          fireGif.style.width = "25px";
          fireGif.style.height = "25px";
          fireGif.style.verticalAlign = "middle";
          fireGif.style.margin = "0";

          const saveAmountEl = savingEl.querySelector(".save-amount");
          saveAmountEl.appendChild(fireGif);
        }
      }
    }
  } else {
    if (discountEl) discountEl.textContent = "";
    if (savingEl) savingEl.textContent = "";
  }
};

// ===================================================
// ✅ الرسم البياني
// ===================================================
if (typeof priceData !== "undefined" && Array.isArray(priceData)) {
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
  const symbol = getCurrencySymbol();

  const getArrow = (value, compare) => {
    if (value > compare) return `<span class="stat-arrow arrow-up">▲</span>`;
    if (value < compare) return `<span class="stat-arrow arrow-down">▼</span>`;
    return "";
  };

  const stats = `
    <div class="price-stats">
      <div class="stat-item current"><strong>السعر الحالي:</strong> ${formatPrice(endPrice)} ${symbol} ${getArrow(endPrice, prevPrice)} <small style="font-size:12px;color:#666;">(${formatPrice(endPrice - prevPrice)} ${symbol})</small></div>
      <div class="stat-item"><strong>المتوسط:</strong> ${formatPrice(avg)} ${symbol} ${getArrow(avg, endPrice)}</div>
      <div class="stat-item"><strong>أقل سعر:</strong> ${formatPrice(min)} ${symbol} ${getArrow(min, endPrice)}</div>
      <div class="stat-item"><strong>أعلى سعر:</strong> ${formatPrice(max)} ${symbol} ${getArrow(max, endPrice)}</div>
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
      <div class="tooltip-line">السعر: ${formatPrice(value)} ${symbol}</div>
      <div class="tooltip-line">التغير: ${arrow} ${formatPrice(diff)} ${symbol}</div>
      <div class="tooltip-line">النسبة: ${percent}%</div>
    `;

    const position = chart.canvas.getBoundingClientRect();
    const tooltipWidth = 160;
    const pageWidth = window.innerWidth;
    const chartLeft = position.left + window.pageXOffset;
    const pointX = chartLeft + tooltip.caretX;

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
          label: `السعر (${symbol})`,
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
        interaction: { mode: 'index', intersect: false },
        plugins: { tooltip: { enabled: false, external: externalTooltipHandler } },
        scales: {
          x: {
            title: { display: true, text: "التاريخ", color: "#333", font: { size: 14 } },
            ticks: { color: "#333" },
            grid: { color: "rgba(0, 0, 0, 0.05)" }
          },
          y: {
            title: { display: true, text: `السعر (${symbol})`, color: "#333", font: { size: 14 } },
            ticks: { color: "#333" },
            grid: { color: "rgba(0, 0, 0, 0.05)" }
          }
        }
      }
    });
  }
}

  // ==============================
  // ✅ نهاية الإسكربت
  // ==============================
});
