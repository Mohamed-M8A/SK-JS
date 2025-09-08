/***********************
 * البحث الذكي 🔍
 ***********************/
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const searchLoader = document.getElementById("search-loader");

let searchIndex = []; // قاعدة بيانات البحث

/***********************
 * تجهيز قاعدة البيانات للبحث
 ***********************/
function prepareSearchData() {
  const cached = sessionStorage.getItem("cachedPosts");
  if (cached) {
    const posts = JSON.parse(cached);
    searchIndex = posts.map(post => {
      const url = getPostUrl(post);
      const title = post.title?.$t || "";
      const content = post.content?.$t || "";

      // استخراج أول h2
      const h2Match = content.match(/<h2[^>]*>([^<]+)<\/h2>/i);
      const firstH2 = h2Match ? h2Match[1] : "";

      // استخراج الوصف المختصر
      const descMatch = content.match(/<p class="short-description"[^>]*>([^<]+)<\/p>/i);
      const shortDesc = descMatch ? descMatch[1] : "";

      return {
        url,
        title,
        firstH2,
        shortDesc,
        categories: getPostCategories(post).join(","),
        content,
        postObj: post
      };
    });
  } else {
    console.warn("⚠️ مفيش كاش بوستات، اعمل fetch الأول!");
  }
}

/***********************
 * فلترة ذكية
 ***********************/
function smartFilter(query) {
  query = query.toLowerCase().trim();
  if (!query) return [];

  return searchIndex.filter(item => {
    return (
      (item.title && item.title.toLowerCase().includes(query)) ||
      (item.firstH2 && item.firstH2.toLowerCase().includes(query)) ||
      (item.shortDesc && item.shortDesc.toLowerCase().includes(query)) ||
      (item.categories && item.categories.toLowerCase().includes(query)) ||
      (item.content && item.content.toLowerCase().includes(query))
    );
  });
}

/***********************
 * عرض النتائج
 ***********************/
function displaySearchResults(results) {
  searchResults.innerHTML = "";

  if (results.length === 0) {
    searchResults.innerHTML = `<div class="no-results">🙄 مفيش نتائج للبحث ده!</div>`;
    return;
  }

  const html = results.slice(0, 20).map(r => generatePostHTML(r.postObj, true)).join("");
  searchResults.innerHTML = html;

  // تشغيل اللايزي لود
  lazyLoadImages();
}

/***********************
 * حدث الكتابة (Real-time)
 ***********************/
searchInput.addEventListener("input", function() {
  const query = this.value;
  searchLoader.style.display = "block";

  setTimeout(() => {
    const results = smartFilter(query);
    displaySearchResults(results);
    searchLoader.style.display = "none";
  }, 300);
});

/***********************
 * بدء التشغيل
 ***********************/
window.addEventListener("DOMContentLoaded", () => {
  prepareSearchData();
});
