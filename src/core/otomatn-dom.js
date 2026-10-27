/**
 * Otomatn DOM — ویرایش متنِ قالب‌دار (HTML) بدون از بین بردن قالب
 * ------------------------------------------------------------------
 * فقط گره‌های متنی را ویرایش می‌کند؛ لینک، تصویر، عنوان، پررنگ و ... دست‌نخورده می‌مانند.
 * به otomatn-core.js وابسته است و خود را به شیء Otomatn اضافه می‌کند.
 *
 * API:
 *   Otomatn.refineDOM(root, options?) -> { total, changes, before, after, original, text }  (root را درجا تغییر می‌دهد)
 *   Otomatn.textOf(root)              -> متن ساده با شکستن سطر در مرز بلوک‌ها
 *   Otomatn.sanitizeHTML(html, base?) -> HTML امن (بدون اسکریپت/رویداد)، با لینک‌های مطلق
 *
 * @author Reza Nemati
 * @license MIT
 */
(function (root) {
  'use strict';
  const O = root.Otomatn;
  if (!O) throw new Error('otomatn-core.js must be loaded first');

  const BLOCK = new Set(['ADDRESS', 'ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'DD', 'DIV', 'DL', 'DT', 'FIELDSET', 'FIGCAPTION', 'FIGURE', 'FOOTER', 'FORM',
    'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER', 'HR', 'LI', 'MAIN', 'NAV', 'OL', 'P', 'PRE', 'SECTION', 'TABLE', 'TBODY', 'TD', 'TFOOT', 'TH', 'THEAD', 'TR', 'UL']);
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'PRE', 'KBD', 'SAMP', 'SVG', 'MATH', 'TEMPLATE', 'IFRAME', 'OBJECT']);

  /** پیمایش به ترتیب سند: [{node}|{nl:true}] */
  function collect(rootEl) {
    const out = [];
    (function walk(el) {
      for (const n of el.childNodes) {
        if (n.nodeType === 3) out.push({ node: n });
        else if (n.nodeType === 1) {
          const tag = n.tagName.toUpperCase();
          if (tag === 'BR') { out.push({ nl: true }); continue; }
          if (SKIP.has(tag)) continue;
          const block = BLOCK.has(tag);
          if (block) out.push({ nl: true });
          walk(n);
          if (block) out.push({ nl: true });
        }
      }
    })(rootEl);
    return out;
  }

  function textOf(rootEl) {
    let s = '';
    for (const seg of collect(rootEl)) {
      if (seg.nl) { if (s && !s.endsWith('\n')) s += '\n'; } else s += seg.node.nodeValue;
    }
    return s.replace(/\n+$/, '');
  }

  function mergeChanges(into, list) {
    for (const c of list) {
      const cur = into.get(c.rule);
      if (!cur) into.set(c.rule, { ...c, samples: [...c.samples] });
      else {
        cur.count += c.count;
        for (const s of c.samples) if (cur.samples.length < 4) cur.samples.push(s);
      }
    }
  }

  function refineDOM(rootEl, options) {
    const merged = new Map();
    let original = '';
    let text = '';
    const nl = () => {
      if (original && !original.endsWith('\n')) original += '\n';
      if (text && !text.endsWith('\n')) text += '\n';
    };
    for (const seg of collect(rootEl)) {
      if (seg.nl) { nl(); continue; }
      const value = seg.node.nodeValue;
      const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(value);
      let next = value;
      if (m[2]) {
        const r = O.refine(m[2], options);
        mergeChanges(merged, r.changes);
        next = m[1] + r.text + m[3];
        if (next !== value) seg.node.nodeValue = next;
      }
      original += value;
      text += next;
    }
    original = original.replace(/\n+$/, '');
    text = text.replace(/\n+$/, '');
    const ruleOrder = new Map(O.RULES.map((r, i) => [r.id, i]));
    const changes = [...merged.values()].sort((a, b) => ruleOrder.get(a.rule) - ruleOrder.get(b.rule));
    return {
      total: changes.reduce((n, c) => n + c.count, 0),
      changes,
      original,
      text,
      before: O.analyze(original),
      after: O.analyze(text),
    };
  }

  const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META', 'BASE', 'FORM', 'INPUT', 'BUTTON', 'TEXTAREA', 'SELECT', 'TEMPLATE', 'NOSCRIPT', 'SVG', 'MATH']);
  const KEEP_ATTR = new Set(['href', 'src', 'alt', 'title', 'colspan', 'rowspan', 'dir', 'lang', 'start', 'width', 'height']);

  /** HTML را پاک‌سازی می‌کند؛ قالب ساده (لینک، تصویر، عنوان، فهرست، جدول، پررنگ و ...) می‌ماند. */
  function sanitizeHTML(html, base) {
    const doc = new DOMParser().parseFromString('<!doctype html><body>' + String(html || ''), 'text/html');
    const clean = (el) => {
      for (const child of [...el.children]) {
        if (DROP.has(child.tagName.toUpperCase())) { child.remove(); continue; }
        for (const a of [...child.attributes]) {
          const name = a.name.toLowerCase();
          if (!KEEP_ATTR.has(name)) { child.removeAttribute(a.name); continue; }
          if (name === 'href' || name === 'src') {
            let url = a.value.trim();
            try { url = new URL(url, base || undefined).href; } catch { /* نسبی می‌ماند */ }
            if (!/^(https?:|mailto:|tel:|data:image\/(png|jpe?g|gif|webp|svg\+xml);)/i.test(url)) child.removeAttribute(a.name);
            else child.setAttribute(a.name, url);
          }
        }
        if (child.tagName === 'A') { child.setAttribute('rel', 'noopener noreferrer'); child.setAttribute('target', '_blank'); }
        clean(child);
      }
    };
    clean(doc.body);
    return doc.body.innerHTML;
  }

  O.refineDOM = refineDOM;
  O.textOf = textOf;
  O.sanitizeHTML = sanitizeHTML;
})(typeof globalThis !== 'undefined' ? globalThis : this);
