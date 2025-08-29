<script>
  // لو عندك نفس المتغيرات معرفة، سيبها زي ما هي
  // هنا بس بنضمن إن الكود يشتغل بعد ما العنصر يظهر
  window.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('searchInput');
    if (!input) return; // أوقات صفحة مافيهاش سيرش

    // لو placeholders متعرفة بالفعل فوق، استخدمها؛ وإلا عرّف نسخة محلية:
    window.placeholders = window.placeholders || [
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
      input.setAttribute('placeholder', window.placeholders[currentIndex]);
      currentIndex = (currentIndex + 1) % window.placeholders.length;
    }
    rotatePlaceholder();
    setInterval(rotatePlaceholder, 45000);

    // فallback: زر Enter على الموبايل
    input.addEventListener('keydown', function(e){
      if (e.key === 'Enter') {
        e.preventDefault();
        if (typeof startSearch === 'function') startSearch();
      }
    });
  });
</script>
