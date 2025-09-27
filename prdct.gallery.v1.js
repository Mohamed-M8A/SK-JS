// ==============================
//  ✅ IMGS GALLERY
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.main-image-container');
  const thumbnails = [...document.querySelectorAll('.thumbnail-container img')];
  const thumbContainer = document.querySelector('.thumbnail-container');
  const mainImg = document.getElementById('mainImage');
  let currentIndex = 0;
  const scrollAmount = 240;

  // ✅ ستايل للصورة الرئيسية + المودال فقط
  function applyImageStyle(img) {
    Object.assign(img.style, {
      objectFit: 'contain',
      backgroundColor: 'black',
      width: '100%',
      height: '100%'
    });
  }

  // ✅ ستايل للثومبنيلز (حجم صغير مناسب للموبايل)
  function applyThumbStyle(img) {
    Object.assign(img.style, {
      width: '60px',
      height: '60px',
      objectFit: 'cover',
      borderRadius: '5px',
      cursor: 'pointer',
      margin: '2px'
    });
  }

  // ✅ تغيير الصورة الرئيسية
  function changeImage(index) {
    if (index === currentIndex) return;
    currentIndex = index;
    mainImg.src = thumbnails[index].src;
    applyImageStyle(mainImg);
    thumbnails.forEach(img =>
      img.classList.toggle('active-thumb', img === thumbnails[index])
    );
    scrollThumbnailIntoView(index);
  }

  // ✅ تمرير الثمبنيلز عند اختيار صورة
  function scrollThumbnailIntoView(index) {
    const thumb = thumbnails[index];
    const cRect = thumbContainer.getBoundingClientRect();
    const tRect = thumb.getBoundingClientRect();
    const isRTL = getComputedStyle(thumbContainer).direction === 'rtl';

    const offset = tRect.left < cRect.left
      ? tRect.left - cRect.left - 10
      : tRect.right > cRect.right
        ? tRect.right - cRect.right + 10
        : 0;

    thumbContainer.scrollLeft += isRTL ? offset : -offset;
  }

  // ✅ أزرار السلايدر
  document.getElementById('thumbsRight')?.addEventListener('click', () => thumbContainer.scrollLeft += scrollAmount);
  document.getElementById('thumbsLeft')?.addEventListener('click', () => thumbContainer.scrollLeft -= scrollAmount);

  document.getElementById('mainImageRightArrow')?.addEventListener('click', () =>
    changeImage((currentIndex - 1 + thumbnails.length) % thumbnails.length)
  );

  document.getElementById('mainImageLeftArrow')?.addEventListener('click', () =>
    changeImage((currentIndex + 1) % thumbnails.length)
  );

  thumbnails.forEach((img, i) => {
    applyThumbStyle(img); // ✅ نطبق ستايل الثمبنيلز هنا
    img.addEventListener('click', () => changeImage(i));
  });

  changeImage(0);

  // ==============================
  //  ✅ MODAL
  // ==============================
  function createModal() {
    if (document.getElementById("imageModal")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <div id="imageModal" class="modal">
        <span class="close" onclick="closeModal()">&times;</span>
        <img class="modal-content" id="modalImage" />
        <span class="arrow left" onclick="navigateModal('prev')"></span>
        <span class="arrow right" onclick="navigateModal('next')"></span>
      </div>
    `);
  }
  createModal();

  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");

  // ✅ فتح المودال
  window.openModal = function (index) {
    modal.style.display = "flex";
    modalImage.src = thumbnails[index].src;
    applyImageStyle(modalImage);
    currentIndex = index;
  };

  // ✅ غلق المودال
  window.closeModal = function () {
    modal.style.display = "none";
  };

  // ✅ التنقل بين الصور داخل المودال
  window.navigateModal = function (direction) {
    currentIndex = direction === "next"
      ? (currentIndex + 1) % thumbnails.length
      : (currentIndex - 1 + thumbnails.length) % thumbnails.length;

    modalImage.src = thumbnails[currentIndex].src;
    applyImageStyle(modalImage);
  };
});
