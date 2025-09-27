// ==============================
// ✅ إعداد السلايدر الرئيسي
// ==============================

const container = document.querySelector('.main-image-container');
const thumbnails = Array.from(document.querySelectorAll('.thumbnail-container img'));
const thumbContainer = document.querySelector('.thumbnail-container');
const scrollAmount = 240;

let currentIndex = 0;

// ✅ تغيير الصورة بدون انيميشن + دعم المربّع الأسود (1:1)
function changeImage(index) {
  if (index === currentIndex) return;

  const currentImg = document.getElementById('mainImage');
  currentImg.src = thumbnails[index].src;

  Object.assign(currentImg.style, {
    objectFit: 'contain',
    backgroundColor: 'black',
    width: '100%',
    height: '100%'
  });

  thumbnails.forEach(img => img.classList.remove('active-thumb'));
  thumbnails[index].classList.add('active-thumb');
  currentIndex = index;

  scrollThumbnailIntoView(index);
}

function scrollThumbnailIntoView(index) {
  const thumb = thumbnails[index];
  const containerRect = thumbContainer.getBoundingClientRect();
  const thumbRect = thumb.getBoundingClientRect();
  const isRTL = getComputedStyle(thumbContainer).direction === 'rtl';

  if (isRTL) {
    if (thumbRect.left < containerRect.left) {
      thumbContainer.scrollLeft += thumbRect.left - containerRect.left - 10;
    } else if (thumbRect.right > containerRect.right) {
      thumbContainer.scrollLeft += thumbRect.right - containerRect.right + 10;
    }
  } else {
    if (thumbRect.left < containerRect.left) {
      thumbContainer.scrollLeft -= (containerRect.left - thumbRect.left + 10);
    } else if (thumbRect.right > containerRect.right) {
      thumbContainer.scrollLeft += (thumbRect.right - containerRect.right + 10);
    }
  }
}

// ✅ أزرار تحريك الصور المصغّرة
document.getElementById('thumbsRight')?.addEventListener('click', () => {
  thumbContainer.scrollLeft += scrollAmount;
});

document.getElementById('thumbsLeft')?.addEventListener('click', () => {
  thumbContainer.scrollLeft -= scrollAmount;
});

// ✅ الأسهم الكبيرة لتحريك الصورة الرئيسية
document.getElementById('mainImageRightArrow')?.addEventListener('click', () => {
  const newIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
  changeImage(newIndex);
});

document.getElementById('mainImageLeftArrow')?.addEventListener('click', () => {
  const newIndex = (currentIndex + 1) % thumbnails.length;
  changeImage(newIndex);
});

// ✅ الصور المصغّرة
thumbnails.forEach((img, index) => {
  img.addEventListener('click', () => changeImage(index));
});

changeImage(0);

// ==============================
// ✅ Modal لتكبير الصورة
// ==============================

function createModal() {
  if (document.getElementById("imageModal")) return;

  const modalHTML = `
    <div id="imageModal" class="modal">
      <span class="close" onclick="closeModal()">&times;</span>
      <img class="modal-content" id="modalImage" />
      <span class="arrow left" onclick="navigateModal('prev')"></span>
      <span class="arrow right" onclick="navigateModal('next')"></span>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

createModal();

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");

window.openModal = function (index) {
  if (!modal || !modalImage) return;
  modal.style.display = "flex";
  modalImage.src = thumbnails[index].src;

  Object.assign(modalImage.style, {
    objectFit: 'contain',
    backgroundColor: 'black',
    width: '100%',
    height: '100%'
  });

  currentIndex = index;
};

window.closeModal = function () {
  if (modal) modal.style.display = "none";
};

window.navigateModal = function (direction) {
  if (!thumbnails.length || !modalImage) return;
  currentIndex = direction === "next"
    ? (currentIndex + 1) % thumbnails.length
    : (currentIndex - 1 + thumbnails.length) % thumbnails.length;

  modalImage.src = thumbnails[currentIndex].src;

  Object.assign(modalImage.style, {
    objectFit: 'contain',
    backgroundColor: 'black',
    width: '100%',
    height: '100%'
  });
};
