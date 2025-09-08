/***********************
 * البحث في المنتجات
 ***********************/
function searchProducts(query) {
  const resultsContainer = document.getElementById("product-posts");
  if (!resultsContainer) return;

  resultsContainer.innerHTML = "";

  if (!query || query.trim() === "") {
    resultsContainer.innerHTML = `<p style="text-align:center; padding:20px;">اكتب كلمة للبحث أولاً</p>`;
    return;
  }

  // البحث في كل البوستات
  const filteredPosts = allPosts.filter(post => {
    // تجاهل التصنيفات الممنوعة
    if (getPostCategories(post).some(cat => bannedCategories.includes(cat))) {
      return false;
    }
    const title = getPostTitle(post).toLowerCase();
    return title.includes(query.toLowerCase());
  });

  if (filteredPosts.length === 0) {
    resultsContainer.innerHTML = `<p style="text-align:center; padding:20px;">لا توجد نتائج لبحثك</p>`;
    return;
  }

  // توليد النتائج باستخدام core.js
  const batch = filteredPosts.map(post => generatePostHTML(post, false));
  resultsContainer.innerHTML = batch.join("");

  lazyLoadImages();
}

/***********************
 * قراءة query من الرابط
 ***********************/
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("query"); // ?query=...
  if (query) {
    searchProducts(query);
  } else {
    document.getElementById("product-posts").innerHTML =
      `<p style="text-align:center; padding:20px;">لا توجد كلمة بحث</p>`;
  }
});
