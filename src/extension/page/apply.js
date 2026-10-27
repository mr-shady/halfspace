/**
 * Otomatn — اسکریپت تزریقی در صفحه (فقط پس از کنش کاربر و با دسترسی activeTab تزریق می‌شود).
 * کار آن خواندن متن انتخاب‌شده و جایگزینی آن در فیلدهای متنی و ویرایشگرهای contenteditable است.
 */
(() => {
  'use strict';
  if (globalThis.__OTOMATN_PAGE__) return;

  const TEXT_INPUT = /^(text|search|url|email|tel|)$/i;

  /** عنصر متنی فعال (در صورت وجود، حتی داخل shadow DOM) */
  const activeElement = () => {
    let el = document.activeElement;
    while (el && el.shadowRoot && el.shadowRoot.activeElement) el = el.shadowRoot.activeElement;
    return el;
  };

  const isField = (el) =>
    !!el && (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && TEXT_INPUT.test(el.type))) && !el.readOnly && !el.disabled;

  /**
   * وضعیت انتخاب فعلی را برمی‌گرداند.
   * @returns {{text: string, editable: boolean, mode: 'selection'|'field'|'none'}}
   */
  function getSelectionInfo() {
    const el = activeElement();
    if (isField(el)) {
      const { selectionStart: s, selectionEnd: e, value } = el;
      return s !== e
        ? { text: value.slice(s, e), editable: true, mode: 'selection' }
        : { text: value, editable: true, mode: value ? 'field' : 'none' };
    }
    const sel = getSelection();
    const text = sel ? sel.toString() : '';
    const editable = !!el && el.isContentEditable;
    if (text) return { text, editable, mode: 'selection' };
    if (editable) {
      const host = el.closest('[contenteditable]') || el;
      const whole = host.innerText || '';
      return { text: whole, editable: true, mode: whole ? 'field' : 'none' };
    }
    return { text: '', editable: false, mode: 'none' };
  }

  /** متن را جایگزین انتخاب فعلی (یا کل فیلد) می‌کند. */
  function replaceSelection(newText) {
    const el = activeElement();
    if (isField(el)) {
      const whole = el.selectionStart === el.selectionEnd;
      const from = whole ? 0 : el.selectionStart;
      const to = whole ? el.value.length : el.selectionEnd;
      el.focus();
      el.setRangeText(newText, from, to, 'select');
      el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertReplacementText', data: newText }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    if (el && el.isContentEditable) {
      const sel = getSelection();
      if (!sel || sel.isCollapsed) document.execCommand('selectAll');
      return document.execCommand('insertText', false, newText);
    }
    return false;
  }

  /** پیام کوتاه گوشهٔ صفحه */
  function toast(message, kind = 'ok') {
    const old = document.getElementById('__otomatn_toast__');
    if (old) old.remove();
    const host = document.createElement('div');
    host.id = '__otomatn_toast__';
    host.style.cssText = 'all:initial;position:fixed;z-index:2147483647;bottom:24px;left:24px;';
    const root = host.attachShadow({ mode: 'closed' });
    root.innerHTML = `
      <style>
        .t{font:600 13px/1.6 Tahoma,Vazirmatn,sans-serif;direction:rtl;color:#fff;padding:10px 16px;border-radius:12px;
           background:${kind === 'ok' ? 'linear-gradient(135deg,#2563eb,#4f46e5)' : '#475569'};
           box-shadow:0 10px 30px rgba(15,23,42,.35);display:flex;gap:8px;align-items:center;
           animation:in .25s ease-out}
        @keyframes in{from{transform:translateY(12px);opacity:0}to{transform:none;opacity:1}}
      </style>
      <div class="t"><span>${kind === 'ok' ? '✨' : 'ℹ️'}</span><span></span></div>`;
    root.querySelector('.t span:last-child').textContent = message;
    document.documentElement.appendChild(host);
    setTimeout(() => host.remove(), 2800);
  }

  const toFa = (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

  /** اصلاح در محل با موتور اتومتن */
  function fixInPlace(options) {
    const info = getSelectionInfo();
    if (!info.text.trim()) return { handled: false, reason: 'empty' };
    const result = globalThis.Otomatn.refine(info.text, options);
    if (!info.editable) return { handled: false, reason: 'readonly', text: info.text };
    if (result.text === info.text) {
      toast('متن شما از قبل بی‌نقص است');
      return { handled: true, total: 0 };
    }
    const ok = replaceSelection(result.text);
    if (ok) toast(`${toFa(result.total)} اصلاح انجام شد`);
    return { handled: ok, total: result.total };
  }

  globalThis.__OTOMATN_PAGE__ = { getSelectionInfo, replaceSelection, fixInPlace, toast };
})();
