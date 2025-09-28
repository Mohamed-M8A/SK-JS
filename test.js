  // ==============================
  // ✅ إضافة نجوم التقييم
  // ==============================

function renderStarsFromValue() {
  let rating = parseFloat(document.getElementById("ratingValue").textContent);

  let fullStars = Math.floor(rating);          
  let hasHalf = (rating % 1 !== 0) ? 1 : 0;    
  let emptyStars = 5 - fullStars - hasHalf;   

  let starsHTML = "";

  for (let i = 0; i < fullStars; i++) {
    starsHTML += `<span class="star">★</span>`; 
  }

  if (hasHalf) {
    starsHTML += `<span class="star half">★</span>`; 
  }

  for (let i = 0; i < emptyStars; i++) {
    starsHTML += `<span class="star empty">★</span>`; 
  }

  document.getElementById("stars").innerHTML = starsHTML;
}

renderStarsFromValue();
