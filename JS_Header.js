<script>
  document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("searchInput");
    if (!input) return; // لو الصفحة مافيهاش سيرش ما يعملش حاجة

    const searchPageURL = "https://souq-alkul.blogspot.com/p/search.html";

    function startSearch() {
      const query = input.value.trim();
      if (query) {
        window.location.href = `${searchPageURL}?q=${encodeURIComponent(query)}`;
      }
    }

    // ربط الزرار بالفورم
    const form = input.closest("form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        startSearch();
      });
    }

    // Placeholder rotation
    const placeholders = [
      "خلنا نساعدك تلاقي اللي يناسبك",
      "جاهز تلاقي شي يغير يومك",
      "ماكينة قهوة ديلونجي",
      "سماعات بلوتوث جالكسي بودز",
      "مكنسة روبوت ذكية",
      "شاحن مغناطيسي للآيفون",
      "ستاند لابتوب قابل للطي",
      "مكواة بخار محمولة",
      "عصارة فواكه كهربائية",
      "كاميرا مراقبة واي فاي",
      "ماوس لاسلكي لابتوب",
      "منظف وجه كهربائي",
      "لوح مفاتيح ميكانيكي RGB",
      "فرامة خضار يدوية",
      "ميزان ذكي للحمية",
      "سماعات رأس للألعاب",
      "اختر منتجك وابدأ اكتشاف الأفضل"
    ];

    let currentIndex = 0;
    function rotatePlaceholder() {
      input.setAttribute("placeholder", placeholders[currentIndex]);
      currentIndex = (currentIndex + 1) % placeholders.length;
    }
    rotatePlaceholder();
    setInterval(rotatePlaceholder, 45000);

    // دعم الضغط على Enter في الموبايل
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        startSearch();
      }
    });
  });
</script>
