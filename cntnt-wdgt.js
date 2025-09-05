// 
// ========================================================================
//     منطق JavaScript
// ========================================================================
// 

/***********************
 * ✅ 1. إعداد البيانات العامة والمتغيرات الأساسية
 ***********************/
const allPostsLimit = 60;
const batchSize = 10;
const interactionsKey = "user_interactions";
let allPosts = [];
let orderedFeed = [];
let displayPointer = 0;
let currentStartIndex = 1;
let displayedPosts = new Set(JSON.parse(sessionStorage.getItem("displayedPosts")) || []);
const productpostsElement = document.getElementById("product-posts");
const loadMoreButton = document.getElementById("load-more");
const loaderElement = document.getElementById("loader");

/***********************
 * ✅ 2. إدارة التفاعل مع التصنيفات (LocalStorage)
 ***********************/
const categoryLevels = {
  "إلكترونيات": 0.5,
  "كوبونات خصم": 0.5,
  "مقالات": 0.5
};

function getUserInteractions() {
  return JSON.parse(localStorage.getItem(interactionsKey) || "{}");
}

function setUserInteractions(data) {
  localStorage.setItem(interactionsKey, JSON.stringify(data));
}

function recordCategoryInteraction(categoriesArray) {
  let interactions = getUserInteractions();
  let currentDate = new Date().toISOString();
  categoriesArray.forEach(cat => {
    if (!cat || cat.trim() === "") cat = "غير مصنف";
    const addValue = categoryLevels.hasOwnProperty(cat) ? categoryLevels[cat] : 1;
    if (interactions[cat]) {
      interactions[cat].weight += addValue;
      interactions[cat].lastInteraction = currentDate;
    } else {
      interactions[cat] = { weight: addValue, lastInteraction: currentDate };
    }
  });
  setUserInteractions(interactions);
}

function cleanOldInteractions() {
  let interactions = getUserInteractions();
  const currentTime = new Date().getTime();
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
  Object.keys(interactions).forEach(cat => {
    const lastTime = new Date(interactions[cat].lastInteraction).getTime();
    if ((currentTime - lastTime) > thirtyDaysInMs) {
      delete interactions[cat];
    }
  });
  setUserInteractions(interactions);
}

setInterval(cleanOldInteractions, 10 * 60 * 1000);

/***********************
 * ✅ 3. استخراج بيانات المنشورات (السعر - الصورة - التصنيفات)
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
  const discountedPriceMatch = content.match(/<span class="price-discounted">([^<]+)<\/span>/);
  const originalPriceMatch = content.match(/<span class="price-original">([^<]+)<\/span>/);

  if (originalPriceMatch && discountedPriceMatch) {
    return {
      hasDiscount: true,
      discountedPrice: discountedPriceMatch[1],
      originalPrice: originalPriceMatch[1]
    };
  } else if (discountedPriceMatch) {
    return {
      hasDiscount: false,
      discountedPrice: discountedPriceMatch[1]
    };
  }
  return null;
}

function getPostImage(post) {
  const defaultImage = "https://via.placeholder.com/380x225";
  const content = post.content?.$t || "";
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : defaultImage;
}

// ✅ النسخة المصححة لاستخراج البيانات الإضافية
function getExtraProductData(post) {
  const content = post.content?.$t || "";

  // ✅ التقييم (نجمة واحدة + رقم فقط)
  const ratingMatch = content.match(/<span class="rating-value"[^>]*>([^<]+)<\/span>/);
  const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

  // ✅ الطلبات
  const ordersMatch = content.match(/<div class="info-box orders-info">[\s\S]*?<span class="value">([^<]+)<\/span>/);
  const orders = ordersMatch ? ordersMatch[1] : null;

  // ✅ الشحن
  const shippingMatch = content.match(/<div class="info-box shipping-time">[\s\S]*?<span class="value">([^<]+)<\/span>/);
  const shipping = shippingMatch ? shippingMatch[1] : null;

  return {
    rating: rating,
    orders: orders,
    shipping: shipping
  };
}

/***********************
 * ✅ 4. بناء أزرار ومنشورات HTML
 ***********************/
function generatePostHTML(post) {
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
  let extraHtml = '';

  if (priceData) {
    const originalPrice = priceData.originalPrice ? `<span class="original-price">${priceData.originalPrice} ر.س</span>` : '';
    priceHtml = `
      <div class="price-display">
        <span class="discounted-price">${priceData.discountedPrice} ر.س</span>
        ${originalPrice}
      </div>
    `;
    if (priceData.originalPrice) {
      const discountedPriceValue = parseFloat(priceData.discountedPrice.replace(/[^\d.]/g, ''));
      const originalPriceValue = parseFloat(priceData.originalPrice.replace(/[^\d.]/g, ''));
      const discountPercentage = originalPriceValue > 0 ? ((originalPriceValue - discountedPriceValue) / originalPriceValue) * 100 : 0;
      discountBadge = `<div class="discount-badge">خصم ${discountPercentage.toFixed(0)}%</div>`;
    }
  }

  if (extraData.rating || extraData.orders || extraData.shipping) {
    extraHtml = '<div class="product-meta-details">';
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
    extraHtml += '</div>';
  }

  return `
<div class="post-card" data-categories="${categories}" data-product-url="${url}">
  <a href="${url}" target="_blank" class="image-container">
    <img class="post-image" src="${image}" alt="${title}" loading="lazy">
    ${discountBadge}
    <div class="external-cart-button">
      <svg class="icon" width="18" height="18">
        <use xlink:href="#i-cart"></use>
      </svg>
    </div>
  </a>
</div>
      <div class="post-content">
        <a href="${url}" target="_blank">
          <h3 class="post-title">${title}</h3>
        </a>
        ${priceHtml}
        ${extraHtml}
      </div>
    </div>
  `;
}

// ✅ النسخة الجديدة من عرض المنشورات
function displayBatch() {
  let firstBatch = true;

  function addNextBatch() {
    const batch = [];
    while (batch.length < batchSize && displayPointer < orderedFeed.length) {
      const post = orderedFeed[displayPointer];
      const url = getPostUrl(post);
      if (getPostCategories(post).includes("مقالات")) {
        displayPointer++;
        continue;
      }
      if (url && !displayedPosts.has(url)) {
        displayedPosts.add(url);

        // ✅ أول دفعة بالصور عادي
        if (firstBatch) {
          batch.push(post);
        } else {
          // ✅ باقي الدفعات Placeholder
          const modifiedPost = { ...post, lazy: true };
          batch.push(modifiedPost);
        }
      }
      displayPointer++;
    }

    if (batch.length > 0) {
      productpostsElement.insertAdjacentHTML('beforeend', batch.map(p => {
        const html = generatePostHTML(p);
        if (p.lazy) {
          return html.replace(
            /<img([^>]+)src="([^"]+)"/,
            `<img$1src="https://via.placeholder.com/380x225?text=Loading..." data-src="$2" class="lazy-img"`
          );
        }
        return html;
      }).join(""));
      sessionStorage.setItem("displayedPosts", JSON.stringify([...displayedPosts]));
    }

    if (firstBatch) {
      firstBatch = false; // ✅ أول دفعة اتعرضت
    }

    // ✅ خلصنا 60 → شغل تحميل الصور التدريجي
    if (displayPointer >= orderedFeed.length) {
      clearInterval(batchInterval);
      lazyLoadImages();
    }
  }

  // ✅ أول دفعة مباشرة
  addNextBatch();

  // ✅ بعد كدا كل 1.5 ثانية دفعة جديدة
  const batchInterval = setInterval(addNextBatch, 1500);
}

// ✅ تحميل الصور المؤجل
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll("img.lazy-img[data-src]");
  let i = 0;

  const interval = setInterval(() => {
    if (i >= lazyImages.length) {
      clearInterval(interval);
      return;
    }
    const img = lazyImages[i];
    img.src = img.dataset.src;
    img.removeAttribute("data-src");
    i++;
  }, 1500); // كل 1.5 ثانية صورة
}

/***********************
 * ✅ 5. منطق جلب المنشورات والترتيب
 ***********************/
function computeOrderedFeed(posts) {
  posts.sort((a, b) => new Date(b.published.$t) - new Date(a.published.$t));
  const interactions = getUserInteractions();
  if (Object.keys(interactions).length === 0) {
    return posts;
  }
  const sortedCats = Object.keys(interactions)
    .sort((a, b) => interactions[b].weight - interactions[a].weight)
    .slice(0, 3);
  const selectedPosts = [];
  const selectedPostsUrls = new Set();
  sortedCats.forEach(cat => {
    const catPosts = posts.filter(post => getPostCategories(post).includes(cat));
    catPosts.forEach(post => {
      const url = getPostUrl(post);
      if (url && !selectedPostsUrls.has(url) && selectedPosts.length < 18) {
        selectedPosts.push(post);
        selectedPostsUrls.add(url);
      }
    });
  });
  const remainingPosts = posts.filter(post => !selectedPostsUrls.has(getPostUrl(post)));
  return selectedPosts.concat(remainingPosts);
}

function fetchAllPosts() {
  loaderElement.style.display = "block";
  loadMoreButton.style.display = 'none';
  const url = `https://souq-alkul.blogspot.com/feeds/posts/default?alt=json&start-index=${currentStartIndex}&max-results=${allPostsLimit}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const posts = data.feed.entry || [];
      allPosts = allPosts.concat(posts);
      orderedFeed = computeOrderedFeed(allPosts);
      displayPointer = 0;
      displayBatch();
      currentStartIndex += allPostsLimit;
    })
    .catch(error => console.error("❌ خطأ في جلب المنشورات:", error))
    .finally(() => {
      loadMoreButton.style.display = 'block';
    });
}

/***********************
 * ✅ 6. الأحداث والبدء
 ***********************/
function loadMorePosts() {
  if (displayPointer < orderedFeed.length) {
    // ✅ فيه بوستات لسه متعرضتش
    displayBatch();
  } else {
    // ✅ لو خلصنا كل البوستات الحالية → نجيب دفعة جديدة
    fetchAllPosts();
  }
}

loadMoreButton.addEventListener("click", loadMorePosts);

productpostsElement.addEventListener("click", function(e) {
  const postCard = e.target.closest(".post-card");
  if (!postCard) return;
  
  const cats = postCard.getAttribute("data-categories");
  const catsArray = cats ? cats.split(",") : ["غير مصنف"];
  recordCategoryInteraction(catsArray);

  const cartButton = e.target.closest(".external-cart-button");
  if (cartButton) {
    try {
      const postLink = postCard.querySelector('.image-container');
      const productUrl = postLink.getAttribute('href');
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const exists = cart.some(item => item.productUrl === productUrl);
      if (exists) {
        alert("المنتج موجود بالفعل في العربة!");
      } else {
        cart.push({ productUrl: productUrl });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("تمت إضافة المنتج إلى العربة بنجاح!");
      }
    } catch(err) {
      console.error("خطأ في قراءة رابط المنتج:", err);
    }
    e.preventDefault();
  }
});

window.onload = function() {
  displayedPosts = new Set();
  sessionStorage.setItem("displayedPosts", JSON.stringify([]));
  fetchAllPosts(); // ✅ أول تحميل يجيب أول دفعة ويفعل النظام الجديد
};
