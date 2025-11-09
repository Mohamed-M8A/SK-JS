/***********************
 * 🔍 منطق البحث
 ***********************/
async function searchAndFilterResults() {
  const container = document.getElementById("search-posts");
  const loader = document.getElementById("loader");
  loader.style.display = "block";
  container.innerHTML = "";

  try {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    const label = params.get("label");
    const min = parseFloat(params.get("min")) || 0;
    const max = parseFloat(params.get("max")) || Infinity;
    const discount = parseFloat(params.get("discount")) || 0;

    // 🔹 جلب البيانات (بحث أو تصنيف)
    let entries = await fetchPosts({ query, label });

    // 🔹 فلترة النتائج
    entries = filterByPriceAndDiscount(entries, { min, max, discount });

    loader.style.display = "none";
    if (!entries.length) {
      container.innerHTML = "<p>لم يتم العثور على نتائج مطابقة</p>";
      return;
    }

    // 🔹 عرض النتائج
    container.innerHTML = entries.map(p => generatePostHTML(p, true)).join("");
    if (typeof lazyLoadImages === "function") lazyLoadImages();
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>حدث خطأ أثناء التحميل</p>";
  }
}
