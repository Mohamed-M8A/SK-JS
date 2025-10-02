// ==============================
// ✅ الرسم البياني
// ==============================
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
        interaction: { mode: 'index', intersect: false },
        plugins: { tooltip: { enabled: false, external: externalTooltipHandler } },
        scales: {
          x: { title: { display: true, text: "التاريخ" }, ticks: { color: "#333" } },
          y: { title: { display: true, text: "السعر (ر.س)" }, ticks: { color: "#333" } }
        }
      }
    });
  }
}
