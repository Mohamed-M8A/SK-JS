/***********************
 * إعداد المتغيرات الأساسية
 ***********************/
const allPostsLimit = 60;
const batchSize = 10;
let allPosts = [];
let productFeed = [];
let displayPointer = 0;
let currentStartIndex = 1;
let displayedPosts = new Set(JSON.parse(sessionStorage.getItem("displayedPosts")) || []);
const productpostsElement = document.getElementById("product-posts");
const loadMoreButton = document.getElementById("load-more");
const loaderElement = document.getElementById("loader");

/***********************
 * مصفوفة التصنيفات الممنوعة
 ***********************/
const bannedCategories = ["مقالات", "إعلانات"];

/***********************
 * دوال المساعدة لاستخراج البيانات
 ***********************/
function getPostCategories(post) {
  return (post.category && post.category.length > 0)
    ? post.category.map(catObj => catObj.term)
    : ["غير مصنف"];
}

function getPostUrl(post) {
  return post.link.find(link => link.rel === "alternate")?.href;
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
    return { hasDiscount: false, discountedPrice: parseFloat(discounted[1]) };
  }
  return null;
}

function getPostImage(post, size = 320) {
  const defaultImage = `https://via.placeholder.com/${size}x${size}/ffffff/ffffff.png`; // أبيض
  const content = post.content?.$t || "";
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (!imgMatch) return defaultImage;

  let imgUrl = imgMatch[1];

  if (/blogger\.googleusercontent\.com/.test(imgUrl) && /\.webp$/i.test(imgUrl)) {
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
 * بناء كارت المنتج
 ***********************/
function generatePostHTML(post, lazy = false) {
  const url = getPostUrl(post);
  if (!url) return '';
  const content = post.content?.$t || "";
  const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
  const title = titleMatch ? titleMatch[1] : post.title.$t;
  const image = getPostImage(post);
  const priceData = getPostPrice(post);
  const extraData = getExtraProductData(post);
  const categories = getPostCategories(post).join(",");

  let priceHtml = '';
  let discountBadge = '';
  if (priceData) {
    const originalPrice = priceData.originalPrice ? `<span class="original-price">${priceData.originalPrice.toFixed(2)} ر.س</span>` : '';
    priceHtml = `
      <div class="price-display">
        <span class="discounted-price">${priceData.discountedPrice.toFixed(2)} ر.س</span>
        ${originalPrice}
      </div>
    `;
    if (priceData.originalPrice) {
      const discountedValue = priceData.discountedPrice;
      const originalValue = priceData.originalPrice;
      const discountPercentage = originalValue > 0 ? ((originalValue - discountedValue) / originalValue) * 100 : 0;
      discountBadge = `<div class="discount-badge">خصم ${discountPercentage.toFixed(0)}%</div>`;
    }
  }

  let extraHtml = '';
  if (extraData.rating || extraData.orders || extraData.shipping) {
    extraHtml = '<div class="product-meta-details">';
    if (extraData.rating) {
      extraHtml += `<div class="meta-item"><span class="meta-star">★</span><span class="meta-rating">${extraData.rating}</span></div>`;
    }
    if (extraData.orders) {
      extraHtml += `<div class="meta-item">تم البيع <span class="meta-orders">${extraData.orders}</span></div>`;
    }
    if (extraData.shipping) {
      extraHtml += `<div class="meta-item">شحن في <span class="meta-shipping">${extraData.shipping}</span> أيام</div>`;
    }
    extraHtml += '</div>';
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
        <svg class="icon" width="18" height="18"><use xlink:href="#i-cart"></use></svg>
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
 * عرض المنشورات
 ***********************/
function displayBatch() {
  const batch = [];
  let count = 0;
  while (count < batchSize && displayPointer < productFeed.length) {
    const post = productFeed[displayPointer];
    const url = getPostUrl(post);

    if (getPostCategories(post).some(cat => bannedCategories.includes(cat))) {
      displayPointer++;
      continue;
    }

    if (url && !displayedPosts.has(url)) {
      displayedPosts.add(url);
      batch.push(generatePostHTML(post, displayPointer >= batchSize)); 
      count++;
    }
    displayPointer++;
  }
  if (batch.length > 0) {
    productpostsElement.insertAdjacentHTML('beforeend', batch.join(""));
    sessionStorage.setItem("displayedPosts", JSON.stringify([...displayedPosts]));
  }
  if (displayPointer >= productFeed.length) lazyLoadImages();
}

/***********************
 * Lazy Loading بالـ IntersectionObserver
 ***********************/
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll("img.lazy-img[data-src]");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        img.classList.remove("lazy-img");
        obs.unobserve(img);
      }
    });
  }, { rootMargin: "100px" });

  lazyImages.forEach(img => observer.observe(img));
}

/***********************
 * جلب المنشورات + كاش
 ***********************/
function computeProductFeed(posts) {
  return posts.sort((a, b) => new Date(b.published.$t) - new Date(a.published.$t));
}

function fetchAllPosts() {
  loaderElement.style.display = "block";
  loadMoreButton.style.display = 'none';

  const cached = sessionStorage.getItem("cachedPosts");
  if (cached) {
    const parsed = JSON.parse(cached);
    allPosts = parsed;
    productFeed = computeProductFeed(allPosts);
    displayPointer = 0;
    displayBatch();
    loaderElement.style.display = "none";
    return;
  }

  const url = `https://souq-alkul.blogspot.com/feeds/posts/default?alt=json&start-index=${currentStartIndex}&max-results=${allPostsLimit}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const posts = data.feed.entry || [];
      allPosts = allPosts.concat(posts);
      sessionStorage.setItem("cachedPosts", JSON.stringify(allPosts));
      productFeed = computeProductFeed(allPosts);
      displayPointer = 0;
      displayBatch();
      currentStartIndex += allPostsLimit;
    })
    .finally(() => {
      loaderElement.style.display = "none";
    });
}

/***********************
 * إشعارات Toast
 ***********************/
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  if (type === "error") {
    toast.style.background = "#e74c3c";
  } else {
    toast.style.background = "#2ecc71";
  }
  
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/***********************
 * الأحداث
 ***********************/
function loadMorePosts() {
  fetchAllPosts();
}

loadMoreButton.addEventListener("click", loadMorePosts);

window.addEventListener("scroll", function () {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300) {
    if (displayPointer < productFeed.length) {
      displayBatch();
    } else {
      loadMoreButton.style.display = "block";
    }
  }
});

productpostsElement.addEventListener("click", function(e) {
  const postCard = e.target.closest(".post-card");
  if (!postCard) return;
  const cartButton = e.target.closest(".external-cart-button");
  if (cartButton) {
    try {
      const productUrl = postCard.getAttribute("data-product-url");
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const exists = cart.some(item => item.productUrl === productUrl);
      if (exists) {
        showToast("المنتج موجود بالفعل في العربة!", "error");
      } else {
        cart.push({ productUrl: productUrl });
        localStorage.setItem("cart", JSON.stringify(cart));
        showToast("تمت إضافة المنتج إلى العربة بنجاح!", "success");
      }
    } catch(err) {
      console.error("خطأ في إضافة المنتج للعربة:", err);
    }
    e.preventDefault();
  }
});

window.onload = function() {
  displayedPosts = new Set();
  sessionStorage.setItem("displayedPosts", JSON.stringify([]));
  fetchAllPosts();
};
