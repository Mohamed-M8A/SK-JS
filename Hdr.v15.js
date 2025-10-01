// =================== ✅ البحث ===================
const searchPageURL = "https://souq-alkul.blogspot.com/p/search.html";
const input = document.getElementById("searchInput");
const form = document.querySelector(".search-box-form");
const historyDropdown = document.getElementById("searchHistoryDropdown");

let searches = JSON.parse(localStorage.getItem('searches')) || [];

// تحديث الدروب داون
function updateDropdown() {
  historyDropdown.innerHTML = '';
  let toShow = searches.slice(0, 5); // آخر 5 بس
  if (toShow.length === 0) {
    historyDropdown.style.display = 'none';
    return;
  }

  toShow.forEach(term => {
    let item = document.createElement('div');

    let text = document.createElement('span');
    text.textContent = term;
    text.addEventListener('click', () => {
      input.value = term;
      historyDropdown.style.display = 'none';
    });

    let del = document.createElement('span');
    del.textContent = '×';
    del.classList.add('delete-btn');
    del.addEventListener('click', (e) => {
      e.stopPropagation();
      searches = searches.filter(t => t !== term);
      localStorage.setItem('searches', JSON.stringify(searches));
      updateDropdown();
    });

    item.appendChild(text);
    item.appendChild(del);
    historyDropdown.appendChild(item);
  });

  historyDropdown.style.display = 'block';
}

// البحث + تخزين السجل
function startSearch() {
  if (!input) return;
  const query = input.value.trim();
  if (query) {
    // تحديث السجل
    searches = searches.filter(t => t !== query);
    searches.unshift(query);
    if (searches.length > 10) searches = searches.slice(0, 10);
    localStorage.setItem('searches', JSON.stringify(searches));

    // الانتقال لصفحة البحث
    window.location.href = `${searchPageURL}?q=${encodeURIComponent(query)}`;
  }
}

// ربط مع الفورم
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    startSearch();
  });
}

// إظهار الدروب داون عند التركيز
if (input) {
  input.addEventListener('focus', updateDropdown);
}

// إغلاق عند الضغط برا
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-container')) {
    historyDropdown.style.display = 'none';
  }
});

// =================== ✅ تدوير الـ placeholder ===================
if (input) {
  const placeholders = [
    "ماكينة قهوة ديلونجي","سماعات بلوتوث جالكسي بودز","مكنسة روبوت ذكية","شاحن مغناطيسي للآيفون","ستاند لابتوب قابل للطي",
    "مكواة بخار محمولة","عصارة فواكه كهربائية","كاميرا مراقبة واي فاي","ماوس لاسلكي لابتوب","منظف وجه كهربائي",
    "لوح مفاتيح ميكانيكي RGB","فرامة خضار يدوية","ميزان ذكي للحمية","سماعات رأس للألعاب","ساعة ذكية شاومي",
    "ترايبود كاميرا احترافي","كشاف LED قابل للشحن","دفاية كهربائية صغيرة","مروحة USB مكتبية","عطر عربي فاخر",
    "شاحن متنقل باور بانك","شنطة لابتوب ضد الماء","كرسي ألعاب مريح","سماعات نويس كانسل","خلاط يدوي متعدد الاستخدام",
    "مقص مطبخ ستانلس ستيل","مظلة أوتوماتيكية","فلاش ميموري سريع","مقلاة هوائية صحية","كاميرا فورية بولارويد",
    "ميزان مطبخ رقمي","مبخرة منزلية كهربائية","ترموس حافظ للحرارة","زجاجة ماء ذكية","مصباح مكتب LED",
    "مروحة محمولة باليد","شاحن جداري سريع","منظم أسلاك مكتب","صندوق تخزين بلاستيك","سماعة مكالمات بلوتوث",
    "منقي هواء صغير","سخان ماء كهربائي","دفتر ملاحظات ذكي","قفل بصمة ذكي","موزع صابون أوتوماتيكي",
    "منظم درج ملابس","مقعد أرضي مريح","كوب قهوة حراري","لوحة مفاتيح لاسلكية","مفرمة لحوم كهربائية",
    "أداة تقطيع بطاطس","صانعة فشار منزلية","طقم ملاعق قياس","جهاز قياس حرارة رقمي","منبه مكتبي كلاسيكي",
    "طابعة صور ملونة","لابتوب أسوس","جوال شاومي ريدمي","تابلت سامسونج جالكسي","حقيبة ظهر للطلاب",
    "قرص صلب خارجي","كابل شحن تايب سي","ماوس جيمينج","مكواة شعر سيراميك","عصا سيلفي بلوتوث",
    "آلة حاسبة علمية","سماعة رأس سلكية","دفاية زيت كهربائية","طقم مفكات متعدد","مقص أظافر ستانلس",
    "ابحث في سوق الكل"
  ];

  function getRandomPlaceholder() {
    const randomIndex = Math.floor(Math.random() * placeholders.length);
    return placeholders[randomIndex];
  }

  function rotatePlaceholder() {
    if (placeholders.length > 0) {
      input.setAttribute("placeholder", getRandomPlaceholder());
    }
  }

  rotatePlaceholder(); // أول تشغيل
  setInterval(rotatePlaceholder, 25000); // كل 25 ثانية
}

// =================== ✅ تحديث عربة التسوق ===================
function updateCartWidget() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCountElement = document.getElementById("cart-count");
  if (!cartCountElement) return;

  cartCountElement.textContent = cart.length;
  if (cart.length > 0) {
    cartCountElement.classList.add("active");
  } else {
    cartCountElement.classList.remove("active");
  }
}

updateCartWidget();
window.addEventListener("storage", function (event) {
  if (event.key === "cart") {
    updateCartWidget();
  }
});
setInterval(updateCartWidget, 1000);

const cartWidget = document.getElementById("cart-widget-header");
if (cartWidget) {
  cartWidget.addEventListener("click", function () {
    window.location.href = "/p/cart.html";
  });
}

// =================== ✅ Dark Mode Toggle ===================
var htmlEl = document.documentElement,
    darkBtn = document.getElementById("dark-toggler"),
    iconUse = darkBtn ? darkBtn.querySelector("use") : null;

function switchIcon(theme){
  if(!iconUse) return;
  if(theme === "dark"){
    iconUse.setAttribute("xlink:href","#i-sun");
    iconUse.setAttribute("href","#i-sun");
  } else {
    iconUse.setAttribute("xlink:href","#i-moon");
    iconUse.setAttribute("href","#i-moon");
  }
}

function applyTheme(theme, persist){
  if(theme === "dark"){
    htmlEl.classList.add("dark-mode");
    htmlEl.setAttribute("data-theme","dark");
  } else {
    htmlEl.classList.remove("dark-mode");
    htmlEl.setAttribute("data-theme","light");
  }
  switchIcon(theme);
  if(persist) {
    try { localStorage.setItem("theme", theme); } catch(e){}
  }
}

var savedTheme;
try { savedTheme = localStorage.getItem("theme"); } catch(e){ savedTheme = null; }
if(!savedTheme){
  savedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
applyTheme(savedTheme,false);

if(darkBtn){
  darkBtn.addEventListener("click",function(e){
    e.preventDefault();
    var isDark = htmlEl.classList.contains("dark-mode");
    applyTheme(isDark ? "light" : "dark", true);
  });
}

// =================== ✅ الدولة ===================
const dropdown = document.getElementById("countryDropdown");
const selected = dropdown ? dropdown.querySelector(".selected") : null;
const options = dropdown ? dropdown.querySelector(".options") : null;
let toast = document.getElementById("country-toast");

if (!toast) {
  toast = document.createElement("div");
  toast.id = "country-toast";
  document.body.appendChild(toast);
}

const url = new URL(window.location.href);
const paramCountry = url.searchParams.get("country");
const savedCountry = localStorage.getItem("Cntry");

let activeCountry = null;

// ✅ دالة مستقلة لإعداد الدولة
function setActiveCountry(code, updateUrl = true) {
  if (!options) return;
  const li = options.querySelector(`li[data-value="${code}"]`);
  if (!li) return;

  activeCountry = code;
  localStorage.setItem("Cntry", code);
  if (selected) selected.innerHTML = li.innerHTML;

  if (updateUrl) {
    url.searchParams.set("country", code);
    window.history.replaceState({}, "", url);
  }
}

// ✅ تحديد الدولة عند التحميل
if (paramCountry) {
  setActiveCountry(paramCountry);
} else if (savedCountry) {
  setActiveCountry(savedCountry);
} else {
  setActiveCountry("SA");
}

// فتح/غلق القائمة
if (selected && dropdown && options) {
  selected.addEventListener("click", () => {
    dropdown.classList.toggle("open");
    options.style.display = dropdown.classList.contains("open") ? "block" : "none";
  });

  options.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;

    const countryCode = li.getAttribute("data-value");
    setActiveCountry(countryCode);
    showToast("تم اختيار: " + li.textContent.trim());

    setTimeout(() => {
      window.location.reload();
    }, 500);
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
      options.style.display = "none";
    }
  });
}

// ✅ دالة التوست
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 1000);
}

// ✅ SEO: إضافة canonical بدون باراميتر
const canonical = document.createElement("link");
canonical.rel = "canonical";
canonical.href = window.location.origin + window.location.pathname;
document.head.appendChild(canonical);

// ✅ SEO: لو الصفحة فيها باراميتر → أضف noindex
if (paramCountry) {
  const robots = document.createElement("meta");
  robots.name = "robots";
  robots.content = "noindex";
  document.head.appendChild(robots);
}

// =================== ✅ Remove ?m=0 / ?m=1 from URL ===================
function rmurl(e,t){
  var r=new RegExp(/\?m=0|&m=0|\?m=1|&m=1/g);
  if(r.test(e)){
    e = e.replace(r,"");
    if(t) window.history.replaceState({},document.title,e);
  }
  return e;
}
const currentUrl = rmurl(location.toString(),!0);

// =================== ✅ Back To Top ===================
var backTop = document.getElementById("back-to-top");
window.addEventListener("scroll",function(){
  if(!backTop) return;
  if(this.pageYOffset >= 1000){
    backTop.classList.remove("d-none");
  } else {
    backTop.classList.add("d-none");
  }
},false);
