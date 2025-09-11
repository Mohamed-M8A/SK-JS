let allPosts = [];
let productFeed = [];
let displayedPosts = new Set();
let displayPointer = 0;

let currentStartIndex = 1;
const allPostsLimit = 50;
const batchSize = 10;

const productpostsElement = document.getElementById("product-posts");
const loadMoreButton = document.getElementById("load-more");
const loaderElement = document.getElementById("loader");


/***********************
 * جلب وترتيب المنشورات
 ***********************/
function computeProductFeed(posts) {
  return posts.sort(
    (a, b) => new Date(b.published.$t) - new Date(a.published.$t)
  );
}

/***********************
 * جلب كل البوستات
 ***********************/
function fetchAllPosts() {
  loaderElement.style.display = "block";
  loadMoreButton.style.display = "none";

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
 * عرض المنشورات (دفعات)
 ***********************/
function displayBatch() {
  const batch = [];
  let count = 0;

  while (count < batchSize && displayPointer < productFeed.length) {
    const post = productFeed[displayPointer];
    const url = getPostUrl(post);

    // تجاهل الكاتيجوري الممنوعة
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
    productpostsElement.insertAdjacentHTML("beforeend", batch.join(""));
    sessionStorage.setItem("displayedPosts", JSON.stringify([...displayedPosts]));
    lazyLoadImages(); // مهم للصور
  }
}

/***********************
 * زر تحميل المزيد
 ***********************/
function loadMorePosts() {
  fetchAllPosts();
}

if (loadMoreButton) {
  loadMoreButton.addEventListener("click", loadMorePosts);
}

/***********************
 * Auto Load عند Scroll
 ***********************/
window.addEventListener("scroll", function () {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300) {
    if (displayPointer < productFeed.length) {
      displayBatch();
    } else {
      if (loadMoreButton) loadMoreButton.style.display = "block";
    }
  }
});

/***********************
 * بدء التحميل عند فتح الصفحة
 ***********************/
window.onload = function () {
  displayedPosts = new Set();
  sessionStorage.setItem("displayedPosts", JSON.stringify([]));
  fetchAllPosts();
};

