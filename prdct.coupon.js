/******************************************************
 * Coupon Copy Script
 * ينسخ كود الكوبون من العنصر المحدد ويغير نص الزر مؤقتًا
 * - يدعم Clipboard API (المتصفحات الحديثة)
 * - يحتوي على fallback للمتصفحات القديمة
 ******************************************************/
function copyCoupon(btnEl, codeId = "couponCode") {
  const codeEl = document.getElementById(codeId);
  const code = codeEl ? codeEl.textContent.trim() : "";

  if (!code || !btnEl) return;

  // تغيير نص الزر مؤقتًا
  const setButtonState = (msg, resetText = "نسخ الكود") => {
    btnEl.textContent = msg;
    if (resetText) {
      setTimeout(() => {
        btnEl.textContent = resetText;
      }, 1500);
    }
  };

  // Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code)
      .then(() => setButtonState("تم النسخ"))
      .catch(() => setButtonState("فشل النسخ!"));
  } else {
    // fallback للمتصفحات القديمة
    const textarea = document.createElement("textarea");
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      setButtonState("تم النسخ");
    } catch (err) {
      setButtonState("فشل النسخ!");
    }
    document.body.removeChild(textarea);
  }
}
