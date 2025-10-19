/***********************
 * إعدادات أساسية
 ***********************/
const bannedCategories = ["مقالات", "إعلانات"];

/***********************
 * دوال المساعدة (عملة الدولة)
 ***********************/
function getCurrencySymbol() {
  const countrySymbols = {
    SA: "ر.س",
    AE: "د.إ",
    OM: "ر.ع",
    MA: "د.م",
    DZ: "د.ج",
    TN: "د.ت"
  };
  const country = localStorage.getItem("Cntry") || "SA";
  return countrySymbols[country] || "ر.س";
}

/***********************
 * دوال استخراج البيانات
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

/***********************
 * 💰 السعر + 🛍️ بيانات إضافية من JSON
 ***********************/
function getPostPrice(post) {
  const content = post.content?.$t || "";

  // 🔍 نبحث عن JSON داخل <script id="product-data">
  const jsonMatch = content.match(/<script[^>]+id=["']product-data["'][^>]*>([\s\S]*?)<\/script>/);
  if (!jsonMatch) return null;

  try {
    const data = JSON.parse(jsonMatch[1]);
    const country = localStorage.getItem("Cntry") || "SA";
    const countryData = data.countries?.[country];

    if (!countryData) return null;

    const discounted = parseFloat(countryData["price-discounted"]);
    const original = parseFloat(countryData["price-original"]);

    return {
      hasDiscount: !!(original && discounted < original),
      discountedPrice: discounted,
      originalPrice: original,
      shippingMin: +countryData["shipping-min-days"] || 0,
      shippingMax: +countryData["shipping-max-days"] || 0
    };
  } catch (err) {
    console.warn("⚠️ خطأ في قراءة JSON داخل المنتج:", err);
    return null;
  }
}

function getExtraProductData(post) {
  const content = post.content?.$t || "";

  // ⭐ التقييم والطلبات من الدوم كما هو
  const ratingMatch = content.match(/<span class="rating-value"[^>]*>([^<]+)<\/span>/);
  const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

  const ordersMatch = content.match(/<div class="info-box orders-info">[\s\S]*?<span class="value">([^<]+)<\/span>/);
  const orders = ordersMatch ? ordersMatch[1] : null;

  // 🚚 أيام الشحن من JSON (الدالة السابقة)
  const priceData = getPostPrice(post);
  const shipping =
    priceData && (priceData.shippingMin || priceData.shippingMax)
      ? `${priceData.shippingMin}-${priceData.shippingMax}`
      : null;

  return { rating, orders, shipping };
}

/***********************
 * 🖼️ الصورة
 ***********************/
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

/***********************
 * 🧩 بناء بطاقة المنتج
 ***********************/
function generatePostHTML(post, lazy = false) {
  const url = getPostUrl(post);
  if (!url) return "";

  // تجاهل التصنيفات الممنوعة
  if (getPostCategories(post).some(cat => bannedCategories.includes(cat))) {
    return "";
  }

  const title = getPostTitle(post);
  const image = getPostImage(post);
  const priceData = getPostPrice(post);
  const extraData = getExtraProductData(post);
  const categories = getPostCategories(post).join(",");
  const currency = getCurrencySymbol();

  let priceHtml = "";
  let discountBadge = "";

  if (priceData) {
    const originalPrice = priceData.originalPrice
      ? `<span class="original-price">${priceData.originalPrice.toFixed(2)} ${currency}</span>`
      : "";

    priceHtml = `
      <div class="price-display">
        <span class="discounted-price">${priceData.discountedPrice.toFixed(2)} ${currency}</span>
        ${originalPrice}
      </div>
    `;

    if (priceData.originalPrice && priceData.discountedPrice < priceData.originalPrice) {
      const discountedValue = priceData.discountedPrice;
      const originalValue = priceData.originalPrice;
      const discountPercentage = ((originalValue - discountedValue) / originalValue) * 100;
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
      extraHtml += `<div class="meta-item">شحن خلال <span class="meta-shipping">${extraData.shipping}</span> أيام</div>`;
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
 * Lazy Loading للصور
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
