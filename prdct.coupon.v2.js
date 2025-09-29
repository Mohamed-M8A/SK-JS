/******************************************************
 * Coupon Copy Script (نسخة محسنة)
 * ينسخ كود الكوبون ويعدل نص الزر مؤقتًا
 ******************************************************/
function copyCoupon(event) {
  // الزر اللي اتضغط
  const btnEl = event.currentTarget;
  // عنصر الكوبون
  const codeEl = document.getElementById("couponCode");

  if (!codeEl || !btnEl) return;

  const code = codeEl.textContent.trim();
  if (!code) return;

  // تغيير نص الزر مؤقتًا
  const setButtonState = (msg, resetText = "نسخ كوبون الخصم") => {
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
    // fallback
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
