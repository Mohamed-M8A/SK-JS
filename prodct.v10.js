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

                            // ===================================================
  // ✅ الرسم البياني + الإحصائيات
  // ===================================================
  document.addEventListener("DOMContentLoaded", function () {
    if (typeof priceData === "undefined" || !Array.isArray(priceData)) return;

    // 🔹 دمج القيم لنفس التاريخ (متوسط)
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

    // 🔹 أسهم ↑ ↓
    const getArrow = (value, compare) => {
      if (value > compare) return `<span class="stat-arrow arrow-up">▲</span>`;
      if (value < compare) return `<span class="stat-arrow arrow-down">▼</span>`;
      return "";
    };

    // 🔹 الإحصائيات
    const stats = `
      <div class="price-stats">
        <div class="stat-item current"><strong>السعر الحالي:</strong> ${endPrice} ${getCurrencySymbol()} ${getArrow(endPrice, prevPrice)} <small style="font-size:12px;color:#666;">(${(endPrice - prevPrice).toFixed(2)} ${getCurrencySymbol()})</small></div>
        <div class="stat-item"><strong>المتوسط:</strong> ${avg} ${getCurrencySymbol()} ${getArrow(avg, endPrice)}</div>
        <div class="stat-item"><strong>أقل سعر:</strong> ${min} ${getCurrencySymbol()} ${getArrow(min, endPrice)}</div>
        <div class="stat-item"><strong>أعلى سعر:</strong> ${max} ${getCurrencySymbol()} ${getArrow(max, endPrice)}</div>
      </div>
    `;
    document.getElementById("priceChart")?.insertAdjacentHTML("afterend", stats);

    // 🔹 التولتيب المخصص
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
        <div class="tooltip-line">السعر: ${value} ${getCurrencySymbol()}</div>
        <div class="tooltip-line">التغير: ${arrow} ${diff} ${getCurrencySymbol()}</div>
        <div class="tooltip-line">النسبة: ${percent}%</div>
      `;

      const position = chart.canvas.getBoundingClientRect();
      const tooltipWidth = 160;
      const pageWidth = window.innerWidth;
      const chartLeft = position.left + window.pageXOffset;
      const pointX = chartLeft + tooltip.caretX;

      if (pointX > pageWidth * 0.7) {
        el.style.left = (pointX - tooltipWidth - 20) + "px";
      } else {
        el.style.left = (pointX + 10) + "px";
      }

      el.style.top = position.top + window.pageYOffset + tooltip.caretY - 40 + "px";
    };

    // 🔹 إنشاء الرسم البياني
    const ctx = document.getElementById("priceChart")?.getContext("2d");
    if (ctx) {
      new Chart(ctx, {
        type: "line",
        data: {
          labels: dates,
          datasets: [{
            label: `السعر (${getCurrencySymbol()})`,
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
            mode: "index",
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
                text: `السعر (${getCurrencySymbol()})`,
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
