// ==============================
//  ✅ الجاليري (الصور + السلايدر + المودال)
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.main-image-container');
  const thumbnails = [...document.querySelectorAll('.thumbnail-container img')];
  const thumbContainer = document.querySelector('.thumbnail-container');
  const mainImg = document.getElementById('mainImage');
  let currentIndex = 0;
  const scrollAmount = 240;

  function applyImageStyle(img) {
    Object.assign(img.style, {
      objectFit: 'contain',
      backgroundColor: 'black',
      width: '100%',
      height: '100%'
    });
  }

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

  thumbnails.forEach((img, i) => img.addEventListener('click', () => changeImage(i)));

  changeImage(0);

  // ==============================
  //  ✅ المودال (تكبير الصورة)
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

  window.openModal = function (index) {
    modal.style.display = "flex";
    modalImage.src = thumbnails[index].src;
    applyImageStyle(modalImage);
    currentIndex = index;
  };

  window.closeModal = function () {
    modal.style.display = "none";
  };

  window.navigateModal = function (direction) {
    currentIndex = direction === "next"
      ? (currentIndex + 1) % thumbnails.length
      : (currentIndex - 1 + thumbnails.length) % thumbnails.length;

    modalImage.src = thumbnails[currentIndex].src;
    applyImageStyle(modalImage);
  };
});
