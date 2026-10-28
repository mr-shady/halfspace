/**
 * Otomatn — خواندن انتخاب فعلی صفحه (متن + HTML قالب‌دار).
 * این تابع کاملاً مستقل است و مستقیم با scripting.executeScript({ func }) اجرا می‌شود؛
 * به هیچ فایل تزریق‌شده یا متغیر بیرونی وابسته نیست تا در همهٔ مرورگرها (از جمله فایرفاکس) قابل اتکا باشد.
 */
function otomatnProbe() {
  const TEXT_INPUT = /^(text|search|url|email|tel|)$/i;
  let el = document.activeElement;
  while (el && el.shadowRoot && el.shadowRoot.activeElement) el = el.shadowRoot.activeElement;

  const isField = !!el && (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && TEXT_INPUT.test(el.type)));
  if (isField && !el.disabled) {
    const { selectionStart: s, selectionEnd: e, value } = el;
    const text = s !== e ? value.slice(s, e) : value;
    return { text, editable: !el.readOnly, field: true, href: location.href };
  }

  const sel = getSelection();
  const text = sel ? sel.toString() : '';
  const editable = !!el && el.isContentEditable;
  if (text && sel.rangeCount) {
    const box = document.createElement('div');
    box.appendChild(sel.getRangeAt(0).cloneContents());
    return { text, html: box.innerHTML, editable, field: false, href: location.href };
  }
  if (editable) {
    const host = el.closest('[contenteditable]') || el;
    return { text: host.innerText || '', html: host.innerHTML, editable: true, field: false, href: location.href };
  }
  return { text: '' };
}
