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

  const htmlOfRange = (range) => {
    const box = document.createElement('div');
    box.appendChild(range.cloneContents());
    return box.innerHTML;
  };

  /**
   * وضعیت انتخاب فعلی را برمی‌گرداند.
   * @param {{clean?: boolean}} [opts] clean: HTML پاک‌سازی‌شده و با لینک‌های مطلق (برای انتقال به پاپ‌آپ)
   * @returns {{text: string, html?: string, editable: boolean, mode: 'selection'|'field'|'none'}}
   */
  function getSelectionInfo(opts) {
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
    const clean = globalThis.Otomatn && globalThis.Otomatn.sanitizeHTML;
    const pack = (html) => {
      if (!(opts && opts.clean && clean)) return html;
      try { return clean(html, location.href); } catch { return ''; }
    };
    if (text && sel.rangeCount) return { text, html: pack(htmlOfRange(sel.getRangeAt(0))), editable, mode: 'selection' };
    if (editable) {
      const host = el.closest('[contenteditable]') || el;
      const whole = host.innerText || '';
      return { text: whole, html: pack(host.innerHTML), editable: true, mode: whole ? 'field' : 'none' };
    }
    return { text: '', editable: false, mode: 'none' };
  }

  /** متن (یا HTML قالب‌دار) را جایگزین انتخاب فعلی، یا کل فیلد می‌کند. */
  function replaceSelection(newText, newHtml) {
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
      return newHtml != null ? document.execCommand('insertHTML', false, newHtml) : document.execCommand('insertText', false, newText);
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

  /**
   * فقط گره‌های متنیِ داخل محدوده را ویرایش می‌کند؛ ساختار (لینک، تصویر، عنوان، پررنگ ...) دست نمی‌خورد.
   * جایگزینی با execCommand انجام می‌شود تا Undo کار کند و ویرایشگرهای مبتنی بر JS تغییر را ببینند.
   */
  function fixRange(range, options) {
    const O = globalThis.Otomatn;
    const sel = getSelection();
    const cac = range.commonAncestorContainer;
    const nodes = [];
    if (cac.nodeType === 3) nodes.push(cac);
    else {
      const walker = document.createTreeWalker(cac, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) nodes.push(walker.currentNode);
    }
    const startC = range.startContainer, startO = range.startOffset, endC = range.endContainer, endO = range.endOffset;
    const edits = [];
    let total = 0;
    for (const n of nodes) {
      if (!range.intersectsNode(n)) continue;
      const parent = n.parentElement;
      if (parent && parent.closest('script,style,noscript,textarea,code,pre,kbd,samp,svg')) continue;
      const lo = n === startC ? startO : 0;
      const hi = n === endC ? endO : n.length;
      const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(n.data.slice(lo, hi));
      if (!m[2]) continue;
      const r = O.refine(m[2], options);
      if (r.text === m[2]) continue;
      total += r.total;
      edits.push({ node: n, from: lo, to: hi, text: m[1] + r.text + m[3] });
    }
    let ok = true;
    for (const e of edits.reverse()) { // از آخر به اول تا آفست‌ها معتبر بمانند
      const rg = document.createRange();
      rg.setStart(e.node, e.from);
      rg.setEnd(e.node, e.to);
      sel.removeAllRanges();
      sel.addRange(rg);
      if (!document.execCommand('insertText', false, e.text)) {
        try { e.node.replaceData(e.from, e.to - e.from, e.text); } catch { ok = false; }
      }
    }
    return { total, ok };
  }

  /** اصلاح در محل با موتور اتومتن؛ در ویرایشگرهای قالب‌دار لینک، تصویر و عنوان حفظ می‌شود. */
  function fixInPlace(options) {
    const O = globalThis.Otomatn;
    const info = getSelectionInfo();
    if (!info.text.trim()) return { handled: false, reason: 'empty' };
    if (!info.editable) return { handled: false, reason: 'readonly', text: info.text };

    let total;
    let ok;
    const el = activeElement();
    if (isField(el)) {
      const result = O.refine(info.text, options);
      total = result.total;
      ok = total === 0 ? true : replaceSelection(result.text);
    } else {
      let sel = getSelection();
      if (!sel || sel.isCollapsed) { document.execCommand('selectAll'); sel = getSelection(); }
      ({ total, ok } = fixRange(sel.getRangeAt(0), options));
    }
    if (total === 0) { toast('متن شما از قبل بی‌نقص است'); return { handled: true, total: 0 }; }
    if (ok) toast(`${toFa(total)} اصلاح انجام شد`);
    return { handled: ok, total };
  }

  globalThis.__OTOMATN_PAGE__ = { getSelectionInfo, replaceSelection, fixInPlace, toast };
})();
