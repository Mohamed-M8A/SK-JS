// ==============================
// ✅ إعداد السلايدر الرئيسي
// ==============================

const container = document.querySelector('.main-image-container');
const thumbnails = [...document.querySelectorAll('.thumbnail-container img')];
const thumbContainer = document.querySelector('.thumbnail-container');
const scrollAmount = 240;
let currentIndex = 0;
const mainImg = document.getElementById('mainImage');

// ✅ تغيير الصورة
function changeImage(index) {
  if (index === currentIndex) return;
  currentIndex = index;
  mainImg.src = thumbnails[index].src;
  Object.assign(mainImg.style, {
    objectFit: 'contain',
    backgroundColor: 'black',
    width: '100%',
    height: '100%'
  });
  thumbnails.forEach(img => img.classList.toggle('active-thumb', img === thumbnails[index]));
  scrollThumbnailIntoView(index);
}

// ✅ تمرير المصغّرات
function scrollThumbnailIntoView(index) {
  const thumb = thumbnails[index];
  const cRect = thumbContainer.getBoundingClientRect();
  const tRect = thumb.getBoundingClientRect();
  const isRTL = getComputedStyle(thumbContainer).direction === 'rtl';

  if (isRTL) {
    thumbContainer.scrollLeft += (tRect.left < cRect.left) ? tRect.left - cRect.left - 10 : (tRect.right > cRect.right) ? tRect.right - cRect.right + 10 : 0;
  } else {
    thumbContainer.scrollLeft += (tRect.left < cRect.left) ? -(cRect.left - tRect.left + 10) : (tRect.right > cRect.right) ? tRect.right - cRect.right + 10 : 0;
  }
}

// ✅ أزرار التحريك
document.getElementById('thumbsRight')?.addEventListener('click', () => thumbContainer.scrollLeft += scrollAmount);
document.getElementById('thumbsLeft')?.addEventListener('click', () => thumbContainer.scrollLeft -= scrollAmount);

// ✅ الأسهم الكبيرة
document.getElementById('mainImageRightArrow')?.addEventListener('click', () => changeImage((currentIndex - 1 + thumbnails.length) % thumbnails.length));
document.getElementById('mainImageLeftArrow')?.addEventListener('click', () => changeImage((currentIndex + 1) % thumbnails.length));

// ✅ المصغّرات
thumbnails.forEach((img, i) => img.addEventListener('click', () => changeImage(i)));

// ✅ أول صورة
changeImage(0);

// ==============================
// ✅ Modal لتكبير الصورة
// ==============================

function createModal() {
  if (document.getElementById("imageModal")) return;
  const modalHTML = <div id="imageModal" class="modal"> <span class="close" onclick="closeModal()">&times;</span> <img class="modal-content" id="modalImage" /> <span class="arrow left" onclick="navigateModal('prev')"></span> <span class="arrow right" onclick="navigateModal('next')"></span> </div> ;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

createModal();

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");

window.openModal = function (index) {
  if (!modal || !modalImage) return;
  modal.style.display = "flex";
  modalImage.src = thumbnails[index].src;

  // ✅ ضبط الصورة داخل الـ Modal بنفس طريقة 1:1
  modalImage.style.objectFit = 'contain';
  modalImage.style.backgroundColor = 'black';
  modalImage.style.width = '100%';
  modalImage.style.height = '100%';

  currentIndex = index;
};

window.closeModal = function () {
  if (modal) modal.style.display = "none";
};

window.navigateModal = function (direction) {
  if (!thumbnails.length || !modalImage) return;
  currentIndex = direction === "next" ? (currentIndex + 1) % thumbnails.length : (currentIndex - 1 + thumbnails.length) % thumbnails.length;
  modalImage.src = thumbnails[currentIndex].src;

  // ✅ نفس ضبط 1:1 داخل المودال
  modalImage.style.objectFit = 'contain';
  modalImage.style.backgroundColor = 'black';
  modalImage.style.width = '100%';
  modalImage.style.height = '100%';
};
