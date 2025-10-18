/***********************
 * ⚙️ إعدادات أساسية
 ***********************/
const bannedCategories = ["مقالات", "إعلانات"];

/***********************
 * 💱 بيانات العملات + التحويل
 ***********************/
const countryInfo = {
  SA: { symbol: "ر.س", name: "السعودية" },
  AE: { symbol: "د.إ", name: "الإمارات" },
  OM: { symbol: "ر.ع", name: "عُمان" },
  MA: { symbol: "د.م", name: "المغرب" },
  DZ: { symbol: "د.ج", name: "الجزائر" },
  TN: { symbol: "د.ت", name: "تونس" }
};

const exchangeRates = {
  SA: 1,
  AE: 1.02,
  OM: 9.74,
  MA: 0.38,
  DZ: 0.028,
  TN: 1.21
};

/***********************
 * 🧩 دوال مساعدة
 ***********************/
function getCurrencySymbol() {
  const country = localStorage.getItem("Cntry") || "SA";
  return countryInfo[country]?.symbol || "ر.س";
}

function formatPrice(num) {
  const n = parseFloat(num);
  if (isNaN(n)) return "";
  return n.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

/***********************
 * 🔍 دوال استخراج البيانات
 ***********************/
function getPostCategories(post) {
  return (post.category && post.category.length > 0)
    ? post.category.map(catObj => catObj.term)
    : ["غير مصنف"];
}

function getPostUrl(post) {
  return post.link.find(link => link.rel === "alternate")?.href;
}

function getPostTitle(post) {
  const content = post.content?.$t || "";
  const titleMatch = content.match(/<h2[^>]*class=["']product-title["'][^>]*>([^<]+)<\/h2>/);
  return titleMatch ? titleMatch[1] : post.title?.$t || "بدون عنوان";
}

function getPostPrice(post) {
  const content = post.content?.$t || "";

  const discounted = content.match(/<span class="price-discounted">([^<]+)<\/span>/);
  const original = content.match(/<span class="price-original">([^<]+)<\/span>/);

  if (original && discounted) {
    return {
      hasDiscount: true,
      discountedPrice: parseFloat(discounted[1]),
      originalPrice: parseFloat(original[1])
    };
  } else if (discounted) {
    return {
      hasDiscount: false,
      discountedPrice: parseFloat(discounted[1])
    };
  }
  return null;
}

function getPostImage(post, size = 320) {
  const defaultImage = `https://via.placeholder.com/${size}x${size}/ffffff/ffffff.png`;
  const content = post.content?.$t || "";
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);

  if (!imgMatch) return defaultImage;

  let imgUrl = imgMatch[1];

  if (/blogger\.googleusercontent\.com/.test(imgUrl)) {
    if (/\/s\d+/.test(imgUrl)) {
      imgUrl = imgUrl.replace(/\/s\d+/, `/s${size}`);
    } else if (/\/w\d+-h\d+/.test(imgUrl)) {
      imgUrl = imgUrl.replace(/\/w\d+-h\d+/, `/w${size}-h${size}`);
    } else {
      imgUrl = imgUrl.replace(/\/([^/]+)$/, `/s${size}/$1`);
    }
  }
  return imgUrl;
}

function getExtraProductData(post) {
  const content = post.content?.$t || "";

  const ratingMatch = content.match(/<span class="rating-value"[^>]*>([^<]+)<\/span>/);
  const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

  const ordersMatch = content.match(/<div class="info-box orders-info">[\s\S]*?<span class="value">([^<]+)<\/span>/);
  const orders = ordersMatch ? ordersMatch[1] : null;

  const shippingMatch = content.match(/<div class="info-box shipping-time">[\s\S]*?<span class="value">([^<]+)<\/span>/);
  const shipping = shippingMatch ? shippingMatch[1] : null;

  return { rating, orders, shipping };
}

/***********************
 * 🧱 بناء بطاقة المنتج
 ***********************/
function generatePostHTML(post, lazy = false) {
  const url = getPostUrl(post);
  if (!url) return "";

  if (getPostCategories(post).some(cat => bannedCategories.includes(cat))) {
    return "";
  }

  const title = getPostTitle(post);
  const image = getPostImage(post);
  const priceData = getPostPrice(post);
  const extraData = getExtraProductData(post);
  const categories = getPostCategories(post).join(",");

  const symbol = getCurrencySymbol();
  const country = localStorage.getItem("Cntry") || "SA";
  const rate = exchangeRates[country] || 1;

  let priceHtml = "";
  let discountBadge = "";

  if (priceData) {
    const discountedConverted = priceData.discountedPrice * rate;
    const originalConverted = priceData.originalPrice
      ? priceData.originalPrice * rate
      : null;

    const originalPrice = originalConverted
      ? `<span class="original-price">${formatPrice(originalConverted)} ${symbol}</span>`
      : "";

    priceHtml = `
      <div class="price-display">
        <span class="discounted-price">${formatPrice(discountedConverted)} ${symbol}</span>
        ${originalPrice}
      </div>
    `;

    if (priceData.originalPrice) {
      const discountPercentage = priceData.originalPrice > 0
        ? ((priceData.originalPrice - priceData.discountedPrice) / priceData.originalPrice) * 100
        : 0;

      discountBadge = `<div class="discount-badge">خصم ${discountPercentage.toFixed(0)}%</div>`;
    }
  }

  let extraHtml = "";
  if (extraData.rating || extraData.orders || extraData.shipping) {
    extraHtml = `<div class="product-meta-details">`;

    if (extraData.rating) {
      extraHtml += `
        <div class="meta-item">
          <span class="meta-star">★</span>
          <span class="meta-rating">${extraData.rating}</span>
        </div>
      `;
    }

    if (extraData.orders) {
      extraHtml += `<div class="meta-item">تم البيع <span class="meta-orders">${extraData.orders}</span></div>`;
    }

    if (extraData.shipping) {
      extraHtml += `<div class="meta-item">شحن في <span class="meta-shipping">${extraData.shipping}</span> أيام</div>`;
    }

    extraHtml += `</div>`;
  }

  const imgTag = lazy
    ? `<img class="post-image lazy-img" src="https://via.placeholder.com/320x320/ffffff/ffffff.png" data-src="${image}" alt="${title}" width="320" height="320" loading="lazy">`
    : `<img class="post-image" src="${image}" alt="${title}" width="320" height="320" loading="lazy">`;

  return `
    <div class="post-card" data-categories="${categories}" data-product-url="${url}">
      <a href="${url}" target="_blank" class="post-link">
        <div class="image-container">
          ${imgTag}
          ${discountBadge}
          <div class="external-cart-button">
            <svg class="icon" width="18" height="18">
              <use xlink:href="#i-cart"></use>
            </svg>
          </div>
        </div>
        <div class="post-content">
          <h3 class="post-title">${title}</h3>
          ${priceHtml}
          ${extraHtml}
        </div>
      </a>
    </div>
  `;
}

/***********************
 * 💤 Lazy Loading للصور
 ***********************/
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll("img.lazy-img[data-src]");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          img.classList.remove("lazy-img");
          obs.unobserve(img);
        }
      });
    },
    { rootMargin: "100px" }
  );

  lazyImages.forEach(img => observer.observe(img));
}
