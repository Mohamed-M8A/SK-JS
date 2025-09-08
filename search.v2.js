/***********************
 * البحث في المنتجات
 ***********************/
function searchProducts(query) {
  const resultsContainer = document.getElementById("product-posts");
  if (!resultsContainer) return;

  // تفريغ النتائج السابقة
  resultsContainer.innerHTML = "";

  if (!query || query.trim() === "") {
    showToast("اكتب كلمة للبحث أولاً", "error");
    return;
  }

  // البحث في العناوين
  const filteredPosts = allPosts.filter(post => {
    // منع التصنيفات الممنوعة
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

  // تشغيل lazy load للصور
  lazyLoadImages();
}

/***********************
 * ربط البحث بالإنبوت
 ***********************/
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  if (searchInput && searchButton) {
    searchButton.addEventListener("click", function () {
      searchProducts(searchInput.value);
    });

    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        searchProducts(searchInput.value);
      }
    });
  }
});
