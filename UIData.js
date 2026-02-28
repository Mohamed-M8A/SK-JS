(function() {
    // ==========================================
    // ✅ Shelf Injection
    // ==========================================
    const UILayout = {
        injectEmptyShelf() {
            const root = document.getElementById('dynamic-shelf');
            if (!root) return;
            root.innerHTML = `
                <div class="rating-strip">
                    <div class="stars-group" id="stars"></div>
                    <span class="rating-value" id="ratingValue"></span>
                    <span class="divider">|</span>
                    <a class="rating-count" href="#" id="goToReviews"></a>
                </div>
                <hr class="clean-divider">
                <div class="price-box">
                    <div class="top-row">
                        <div class="price-info">
                            <span class="price-discounted"></span>
                            <span class="discount-percentage"></span>
                        </div>
                        <span class="price-saving"></span>
                    </div>
                    <span class="price-original"></span>
                </div>
                <div class="info-boxes-wrapper">
                   <div class="info-box product-variant"><span class="label">الموديل</span><span class="value variant-value">_</span></div>
                    <div class="info-box orders-count-box"><span class="label">عدد الطلبات</span><span class="value orders-count">_</span></div>
                    <div class="info-box product-availability"><span class="label">حالة المنتج</span><span class="value value">_</span></div>
                    <div class="info-box country-shipping"><span class="label">الشحن إلى</span><span class="value value">_</span></div>
                    <div class="info-box shipping-time"><span class="label">مدة التوصيل</span><span class="value value">_</span></div>
                    <div class="info-box shipping-fee"><span class="label">رسوم التوصيل</span><span class="value value">_</span></div>
                </div>
                <hr class="clean-divider">
            `;
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => UILayout.injectEmptyShelf());
    } else {
        UILayout.injectEmptyShelf();
    }

    // ==========================
    // ✅ Country
    // ==========================
    const countryInfo = {
        "SA": { name: "السعودية", symbol: "ر.س", rate: 1 },
        "AE": { name: "الإمارات", symbol: "د.إ", rate: 0.98 },
        "OM": { name: "عُمان", symbol: "ر.ع", rate: 0.10 },
        "MA": { name: "المغرب", symbol: "د.م", rate: 2.70 },
        "DZ": { name: "الجزائر", symbol: "د.ج", rate: 36.00 },
        "TN": { name: "تونس", symbol: "د.ت", rate: 0.83 },
    };

    const activeCountry = localStorage.getItem("Cntry") || "SA";
    const formatPrice = num => parseFloat(num).toLocaleString("en-US");

    window.applyImageStyle = function(img) {
        if (!img) return;
        Object.assign(img.style, {
            objectFit: 'contain',
            backgroundColor: 'black',
            width: '100%',
            height: '100%'
        });
    };

    // ==========================
    // ✅ Data
    // ==========================
    window.injectData = function(data) {
        const config = countryInfo[activeCountry] || countryInfo["SA"];
        const weight = config.rate || 1; 
        const symbol = config.symbol;
        const countryName = config.name;

        const pOriginal = data.priceOriginal;
        const pDiscounted = data.priceDiscounted;
        const diff = pOriginal - pDiscounted;

        document.querySelectorAll(".price-original").forEach(el => el.textContent = `${formatPrice(pOriginal)} ${symbol}`);
        document.querySelectorAll(".price-discounted").forEach(el => el.textContent = `${formatPrice(pDiscounted)} ${symbol}`);

        const savingEl = document.querySelector(".price-saving");
        const discountEl = document.querySelector(".discount-percentage");

        if (diff > 0 && savingEl) {
            savingEl.innerHTML = `<span class="save-label">وفر:</span> <span class="save-amount">${formatPrice(diff)} ${symbol}</span>`;
            
            const weightedDiff = diff / weight; 
            let color = "#7f8c8d";
            if (weightedDiff >= 100) color = "#16a085";
            else if (weightedDiff < 400) color = "#1abc9c";
            else if (weightedDiff < 600) color = "#2ecc71";
            else if (weightedDiff < 900) color = "#f1c40f";
            else if (weightedDiff < 1200) color = "#e67e22";
            else if (weightedDiff < 1600) color = "#c0392b";
            else if (weightedDiff < 2000) color = "#f5008b";
            else if (weightedDiff < 3000) color = "#8e44ad";
            else color = "#f39c12";
            
            savingEl.style.color = color;
            savingEl.style.fontWeight = "bold";

            if (weightedDiff >= 500) {
                const saveAmount = savingEl.querySelector(".save-amount");
                if (saveAmount && !saveAmount.querySelector(".fire-gif")) {
                    const fireGif = document.createElement("img");
                    fireGif.src = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj5J9EL4a9cV3VWmcK1ZYD6OYEB-1APv9gggocpaa7jAJXdgvX8Q7QiaAZC9NxcN25f8MTRSYD6SKwT1LSjL0SB1ovJH1SSkRmqH2y3f1NzWGkC0BE-gpj5bTc1OKi3Rfzh44sAAJSvOS5uq7Ut9ETN-V9LgKim0dkmEVmqUWa-2ZGA7FvMAYrVaJgn/w199-h200/fire%20(1).gif";
                    fireGif.style.width = "20px";
                    fireGif.style.verticalAlign = "middle";
                    fireGif.classList.add("fire-gif");
                    saveAmount.appendChild(fireGif);
                }
            }
            if (discountEl) discountEl.textContent = `${Math.round((diff / pOriginal) * 100)}%`;
        }

        if (document.querySelector(".UID")) document.querySelector(".UID").textContent = data.id;

        const shippingLabel = document.querySelector(".country-shipping .label");
        if (shippingLabel) shippingLabel.textContent = `الشحن إلى ${countryName}:`;
        
        document.querySelectorAll(".shipping-fee .value").forEach(el => {
            el.textContent = data.shippingFee === 0 ? "مجاني" : `${formatPrice(data.shippingFee)} ${symbol}`;
        });
        
        document.querySelectorAll(".shipping-time .value").forEach(el => {
            el.textContent = `${data.minDelivery}-${data.maxDelivery} أيام`;
        });

        document.querySelectorAll(".product-availability .value").forEach(el => {
            el.textContent = (data.minDelivery > 0) ? "متوفر" : "غير متوفر";
            el.style.color = (data.minDelivery > 0) ? "#2e7d32" : "#c62828";
        });

        const ordersEl = document.querySelector(".orders-count");
        if (ordersEl) ordersEl.textContent = `(+${data.orders})`;
        
        const scoreEl = document.querySelector(".rating-score");
        if (scoreEl) scoreEl.textContent = data.score;
        
        const starsContainer = document.getElementById("stars");
        if (starsContainer && data.score) {
            starsContainer.setAttribute("data-rating", data.score);
            if (typeof window.renderStars === 'function') window.renderStars(starsContainer);
        }
    };
})();
