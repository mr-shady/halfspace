/**
 * Otomatn — رابط کاربری پاپ‌آپ / پنجرهٔ ویرایشگر
 * Developed by Reza Nemati — https://reza-nemati.ir
 */
(() => {
  'use strict';

  const O = window.Otomatn;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const SETTINGS_KEY = 'otomatn_settings';
  const PENDING_KEY = 'otomatn_content';
  const params = new URLSearchParams(location.search);
  const isExtension = typeof chrome !== 'undefined' && !!(chrome.runtime && chrome.runtime.id);
  const isWindow = params.get('window') === '1';
  if (isWindow) document.documentElement.classList.add('win');
  if (params.has('demo')) document.documentElement.classList.add('demo');
  if (params.has('focus')) document.documentElement.classList.add('focus');

  const SAMPLE =
    'سلام دوستان،اینجا یک متن آزمایشی است که چند اشتباه رایج دارد.بخاطر همین می خواهیم ببینیم اتومتن چطور آن را اتو می کند ؟\n' +
    'کتاب ها و مقاله ها را خوانده ام و نتیجه گرفته ام که نوشتن یک متن بی نقص،کار ساده ای نیست!!!\n' +
    'او گفت "می رود و بر می گردد" ... ولی هیچکس باور نکرد.\n' +
    'قیمت این محصول 1,250,000 تومان و تخفیف آن 20 % است ( فقط تا فردا ) مثلا همین هفته.';

  /* ------------------------------------------------------------------
   * ذخیره‌سازی (افزونه: chrome.storage — حالت دمو: localStorage)
   * ------------------------------------------------------------------ */
  const store = {
    async get(key) {
      try {
        if (isExtension) return (await chrome.storage.local.get(key))[key];
        return JSON.parse(localStorage.getItem(key));
      } catch { return undefined; }
    },
    async set(key, value) {
      try {
        if (isExtension) await chrome.storage.local.set({ [key]: value });
        else localStorage.setItem(key, JSON.stringify(value));
      } catch { /* ignore */ }
    },
    async remove(key) {
      try {
        if (isExtension) await chrome.storage.local.remove(key);
        else localStorage.removeItem(key);
      } catch { /* ignore */ }
    },
  };

  /* ------------------------------------------------------------------
   * وضعیت برنامه
   * ------------------------------------------------------------------ */
  const state = {
    settings: { preset: 'standard', rules: {}, digits: 'fa', theme: 'auto', showZw: true, cmp: window.innerWidth >= 820 ? 'split' : 'inline' },
    result: null,
    ran: false,
    dirty: false,
    source: null, // { tabId, frameId, editable, mode }
    tab: 'result',
  };

  /* ------------------------------------------------------------------
   * ابزارها
   * ------------------------------------------------------------------ */
  const toFa = (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  /** نمایش نیم‌فاصله به شکل نشانگر بصری */
  const vis = (s) => esc(s).replace(/‌/g, '<i class="zw"></i>');

  /** متن ساده و HTML فیلدهای قالب‌دار */
  const inputEl = () => $('#input');
  const inputText = () => O.textOf(inputEl());
  function setInputPlain(text) {
    const el = inputEl();
    el.textContent = '';
    String(text).split(/\r\n?|\n/).forEach((line, i) => {
      if (i) el.appendChild(document.createElement('br'));
      el.appendChild(document.createTextNode(line));
    });
  }
  const setInputHTML = (html) => { inputEl().innerHTML = O.sanitizeHTML(html); };

  const readingTime = (sec) => (sec < 60 ? `${toFa(sec)} ثانیه` : `${toFa(Math.ceil(sec / 60))} دقیقه`);

  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  const persist = () => store.set(SETTINGS_KEY, state.settings);

  const effectiveRules = () => ({ ...O.PRESETS[state.settings.preset].rules, ...state.settings.rules });
  const refineOptions = () => ({ preset: state.settings.preset, rules: state.settings.rules, digits: state.settings.digits });

  /* ------------------------------------------------------------------
   * تم
   * ------------------------------------------------------------------ */
  function applyTheme() {
    const t = state.settings.theme;
    const dark = t === 'dark' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    $('#themeIcon use').setAttribute('href', dark ? '#i-sun' : '#i-moon');
    $('#app').classList.toggle('hide-zw', !state.settings.showZw);
  }

  /* ------------------------------------------------------------------
   * آمار ورودی
   * ------------------------------------------------------------------ */
  function renderInStats() {
    const text = inputText();
    if (!text.trim()) { $('#inStats').innerHTML = ''; return; }
    const a = O.analyze(text);
    $('#inStats').innerHTML =
      `<span class="chip"><b>${toFa(a.words)}</b> واژه</span>` +
      `<span class="chip"><b>${toFa(a.chars)}</b> نویسه</span>` +
      `<span class="chip">⏱ ${readingTime(a.readingSeconds)}</span>`;
  }

  /* ------------------------------------------------------------------
   * اجرای ویرایش
   * ------------------------------------------------------------------ */
  function run({ silent = false } = {}) {
    if (!inputText().trim()) {
      if (!silent) { toast('ابتدا متنی وارد کنید'); $('#input').focus(); }
      return;
    }
    // روی نسخهٔ کپی کار می‌کنیم: فقط گره‌های متنی تغییر می‌کنند و لینک/تصویر/عنوان‌ها می‌مانند
    const box = inputEl().cloneNode(true);
    const r = O.refineDOM(box, refineOptions());
    state.result = r;
    state.ran = true;

    $('#output').innerHTML = box.innerHTML;
    $('#output').hidden = false;
    $('#resPlaceholder').hidden = true;
    $('#actions').hidden = false;
    $('#applyBtn').hidden = !(state.source && state.source.editable);

    renderSummary();
    renderCompare();
    renderReport();
    if (state.tab === 'settings' && !silent) setTab('result');
  }

  function renderSummary() {
    const r = state.result;
    const box = $('#summary');
    box.hidden = false;
    if (!r.total) {
      box.className = 'summary clean';
      box.innerHTML = `<div class="sum-num">✓</div><div class="sum-txt"><strong>متن شما بی‌نقص است!</strong><span>هیچ موردی برای اصلاح پیدا نشد.</span></div>`;
      return;
    }
    const cats = O.CATEGORIES.map((c) => {
      const n = r.changes.filter((x) => x.category === c.id).reduce((s, x) => s + x.count, 0);
      return n ? `<span class="chip" title="${c.label}">${c.label} <b>${toFa(n)}</b></span>` : '';
    }).join('');
    box.className = 'summary';
    box.innerHTML =
      `<div class="sum-num">${toFa(r.total)}</div>` +
      `<div class="sum-txt"><strong>اصلاح انجام شد</strong><span>${toFa(r.before.chars)} ← ${toFa(r.after.chars)} نویسه</span></div>` +
      `<div class="sum-cats">${cats}</div>`;
  }

  /* ------------------------------------------------------------------
   * مقایسهٔ قبل و بعد
   * ------------------------------------------------------------------ */
  function renderCompare() {
    const r = state.result;
    const ops = O.diff(r.original, r.text);
    $('#cmpPlaceholder').hidden = true;

    $('#cmpInline').innerHTML = ops
      .map((o) => (o.type === 'eq' ? vis(o.text) : o.type === 'del' ? `<del>${vis(o.text)}</del>` : `<ins>${vis(o.text)}</ins>`))
      .join('');
    $('#cmpBefore').innerHTML = ops
      .filter((o) => o.type !== 'ins')
      .map((o) => (o.type === 'del' ? `<span class="split-del">${vis(o.text)}</span>` : vis(o.text)))
      .join('');
    $('#cmpAfter').innerHTML = ops
      .filter((o) => o.type !== 'del')
      .map((o) => (o.type === 'ins' ? `<span class="split-ins">${vis(o.text)}</span>` : vis(o.text)))
      .join('');
    applyCmpMode();
  }

  function applyCmpMode() {
    const has = !!state.result;
    $('#cmpInline').hidden = !has || state.settings.cmp !== 'inline';
    $('#cmpSplit').hidden = !has || state.settings.cmp !== 'split';
    $$('#cmpSeg button').forEach((b) => b.classList.toggle('on', b.dataset.cmp === state.settings.cmp));
  }

  /* ------------------------------------------------------------------
   * گزارش تغییرات
   * ------------------------------------------------------------------ */
  function renderReport() {
    const r = state.result;
    $('#repPlaceholder').hidden = true;
    const badge = $('#repBadge');
    badge.hidden = !r.total;
    badge.textContent = toFa(r.total);

    if (!r.total) { $('#report').innerHTML = '<div class="placeholder"><p>تغییری لازم نبود. 🎉</p></div>'; return; }

    $('#report').innerHTML = O.CATEGORIES.map((cat) => {
      const items = r.changes.filter((c) => c.category === cat.id);
      if (!items.length) return '';
      const total = items.reduce((s, x) => s + x.count, 0);
      const rows = items
        .map((c) => {
          const samples = c.samples
            .slice(0, 2)
            .map((s) => `<div class="sample"><span class="f">${vis(s.from)}</span><span class="arrow">←</span><span class="t">${vis(s.to)}</span></div>`)
            .join('');
          return `<div class="rep-row"><header><span>${esc(c.label)}</span><span class="chip">${toFa(c.count)}</span></header>${samples}</div>`;
        })
        .join('');
      return `<div class="rep-cat"><h4><span class="rep-ico">${esc(cat.icon)}</span>${esc(cat.label)}<span class="chip">${toFa(total)}</span></h4>${rows}</div>`;
    }).join('');
  }

  /* ------------------------------------------------------------------
   * تنظیمات
   * ------------------------------------------------------------------ */
  function renderSettings() {
    const rules = effectiveRules();
    $('#presets').innerHTML = Object.entries(O.PRESETS)
      .map(([id, p]) => `<button class="preset${state.settings.preset === id && !Object.keys(state.settings.rules).length ? ' on' : ''}" data-preset="${id}"><b>${esc(p.label)}</b><small>${esc(p.hint)}</small></button>`)
      .join('');
    $$('#digitsSeg button').forEach((b) => b.classList.toggle('on', b.dataset.digits === state.settings.digits));

    const open = new Set($$('#rulesBox details[open]').map((d) => d.dataset.cat));
    $('#rulesBox').innerHTML =
      '<h4>قانون‌های ویرایش</h4>' +
      O.CATEGORIES.map((cat) => {
        const list = O.RULES.filter((r) => r.category === cat.id);
        const on = list.filter((r) => rules[r.id]).length;
        const body = list
          .map(
            (r) => `<label class="rule"><div class="meta"><b>${esc(r.label)}</b><small>${vis(r.example[0])} ← ${vis(r.example[1])}</small></div>
              <span class="sw"><input type="checkbox" data-rule="${r.id}" ${rules[r.id] ? 'checked' : ''}><span></span></span></label>`,
          )
          .join('');
        return `<details class="rule-group" data-cat="${cat.id}"${open.has(cat.id) ? ' open' : ''}><summary><span class="rep-ico">${esc(cat.icon)}</span>${esc(cat.label)}<span class="chip">${toFa(on)}/${toFa(list.length)}</span></summary>${body}</details>`;
      }).join('') +
      `<label class="rule" style="border:1px solid var(--border);border-radius:14px"><div class="meta"><b>نمایش نشانگر نیم‌فاصله</b><small>در «قبل و بعد» و «گزارش» نیم‌فاصله‌ها با نشانگر دیده می‌شوند</small></div>
        <span class="sw"><input type="checkbox" id="zwToggle" ${state.settings.showZw ? 'checked' : ''}><span></span></span></label>`;
  }

  function onSettingsChanged() {
    persist();
    renderSettings();
    if (state.ran) run({ silent: true });
  }

  /* ------------------------------------------------------------------
   * تب‌ها
   * ------------------------------------------------------------------ */
  function setTab(name) {
    state.tab = name;
    $$('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === name));
    $$('.panel').forEach((p) => p.classList.toggle('on', p.id === `p-${name}`));
  }

  /* ------------------------------------------------------------------
   * ارتباط با صفحه
   * ------------------------------------------------------------------ */
  const PAGE_FILES = ['core/otomatn-core.js', 'core/otomatn-dom.js', 'page/apply.js'];

  /**
   * فایرفاکس اگر حتی یک iframe ناهمسرچشمه باشد کل allFrames را رد می‌کند؛
   * پس اول همهٔ فریم‌ها و در صورت خطا فقط فریم اصلی را امتحان می‌کنیم.
   */
  async function readFromPage() {
    if (!isExtension) return null;
    let tab;
    try { [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); } catch { return null; }
    if (!tab || tab.id === undefined) return null;
    for (const target of [{ tabId: tab.id, allFrames: true }, { tabId: tab.id, frameIds: [0] }]) {
      try {
        await chrome.scripting.executeScript({ target, files: PAGE_FILES });
        const res = await chrome.scripting.executeScript({ target, func: () => globalThis.__OTOMATN_PAGE__.getSelectionInfo({ clean: true }) });
        const hit = res.find((r) => r.result && r.result.text && r.result.text.trim());
        return hit ? { ...hit.result, tabId: tab.id, frameId: hit.frameId } : null;
      } catch { /* تلاش بعدی؛ صفحهٔ محافظت‌شده (chrome://، فروشگاه افزونه و ...) */ }
    }
    return null;
  }

  async function applyToPage() {
    const src = state.source;
    if (!src) return;
    const text = O.textOf($('#output'));
    const html = src.field ? null : $('#output').innerHTML;
    // متن در پاپ‌آپ دست نخورده؟ پس ساختار اصلی صفحه را همان‌جا و فقط در گره‌های متنی اصلاح می‌کنیم
    const inPlace = !state.dirty && !src.field && src.editable;
    try {
      const res = await chrome.scripting.executeScript({
        target: { tabId: src.tabId, frameIds: [src.frameId] },
        func: (t, h, opts, keep) => {
          const P = globalThis.__OTOMATN_PAGE__;
          const ok = keep ? P.fixInPlace(opts).handled : P.replaceSelection(t, h);
          if (ok && !keep) P.toast('متن با اتومتن جایگزین شد');
          return ok;
        },
        args: [text, html, refineOptions(), inPlace],
      });
      if (res[0] && res[0].result) {
        toast('در صفحه جایگزین شد ✓');
        if (!isWindow) setTimeout(() => window.close(), 700);
      } else toast('جایگزینی ممکن نشد؛ نتیجه را کپی کنید');
    } catch {
      toast('جایگزینی ممکن نشد؛ نتیجه را کپی کنید');
    }
  }

  /* ------------------------------------------------------------------
   * کپی
   * ------------------------------------------------------------------ */
  async function copyResult() {
    const out = $('#output');
    const html = out.innerHTML;
    const text = O.textOf(out);
    try {
      if (window.ClipboardItem && navigator.clipboard.write) {
        await navigator.clipboard.write([new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([text], { type: 'text/plain' }),
        })]);
      } else throw new Error('no rich clipboard');
    } catch {
      const range = document.createRange();
      range.selectNodeContents(out);
      const sel = getSelection();
      sel.removeAllRanges(); sel.addRange(range);
      document.execCommand('copy');
      sel.removeAllRanges();
    }
    const btn = $('#copyBtn');
    btn.classList.add('done');
    btn.querySelector('span').textContent = 'کپی شد!';
    btn.querySelector('use').setAttribute('href', '#i-check');
    setTimeout(() => {
      btn.classList.remove('done');
      btn.querySelector('span').textContent = 'کپی نتیجه';
      btn.querySelector('use').setAttribute('href', '#i-copy');
    }, 1600);
  }

  /* ------------------------------------------------------------------
   * رویدادها
   * ------------------------------------------------------------------ */
  function bind() {
    $('#fixBtn').addEventListener('click', () => { run(); if (state.ran && state.tab === 'settings') setTab('result'); });
    $('#copyBtn').addEventListener('click', copyResult);
    $('#applyBtn').addEventListener('click', applyToPage);
    $('#clearBtn').addEventListener('click', () => {
      inputEl().innerHTML = '';
      state.ran = false; state.result = null; state.source = null;
      $('#output').hidden = true; $('#output').innerHTML = '';
      $('#resPlaceholder').hidden = false; $('#actions').hidden = true; $('#summary').hidden = true;
      $('#cmpPlaceholder').hidden = false; $('#cmpInline').hidden = true; $('#cmpSplit').hidden = true;
      $('#repPlaceholder').hidden = false; $('#report').innerHTML = ''; $('#repBadge').hidden = true;
      renderInStats();
      $('#input').focus();
    });
    $('#sampleBtn').addEventListener('click', () => { setInputPlain(SAMPLE); renderInStats(); run({ silent: true }); });

    // چسباندن/رها کردن: قالب (لینک، تصویر، عنوان و ...) حفظ می‌شود، اما اسکریپت و استایل‌های ناامن پاک می‌شوند
    const insertClean = (e, dt) => {
      e.preventDefault();
      const html = dt.getData('text/html');
      if (html) document.execCommand('insertHTML', false, O.sanitizeHTML(html));
      else document.execCommand('insertText', false, dt.getData('text/plain'));
    };
    $('#input').addEventListener('paste', (e) => insertClean(e, e.clipboardData));
    $('#input').addEventListener('drop', (e) => insertClean(e, e.dataTransfer));

    let t;
    $('#input').addEventListener('input', () => {
      state.dirty = true;
      renderInStats();
      clearTimeout(t);
      if (state.ran) t = setTimeout(() => run({ silent: true }), 250);
    });
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
    });

    $('#tabs').addEventListener('click', (e) => { const b = e.target.closest('button[data-tab]'); if (b) setTab(b.dataset.tab); });
    $('#cmpSeg').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-cmp]');
      if (!b) return;
      state.settings.cmp = b.dataset.cmp; persist(); applyCmpMode();
    });

    $('#presets').addEventListener('click', (e) => {
      const b = e.target.closest('[data-preset]');
      if (!b) return;
      state.settings.preset = b.dataset.preset; state.settings.rules = {};
      onSettingsChanged();
    });
    $('#digitsSeg').addEventListener('click', (e) => {
      const b = e.target.closest('[data-digits]');
      if (!b) return;
      state.settings.digits = b.dataset.digits; onSettingsChanged();
    });
    $('#rulesBox').addEventListener('change', (e) => {
      const el = e.target;
      if (el.id === 'zwToggle') { state.settings.showZw = el.checked; applyTheme(); persist(); return; }
      if (!el.dataset.rule) return;
      const base = O.PRESETS[state.settings.preset].rules[el.dataset.rule];
      if (el.checked === base) delete state.settings.rules[el.dataset.rule];
      else state.settings.rules[el.dataset.rule] = el.checked;
      onSettingsChanged();
    });
    $('#resetBtn').addEventListener('click', () => {
      Object.assign(state.settings, { preset: 'standard', rules: {}, digits: 'fa', showZw: true });
      applyTheme(); onSettingsChanged(); toast('تنظیمات بازنشانی شد');
    });

    $('#themeBtn').addEventListener('click', () => {
      const cur = document.documentElement.dataset.theme;
      state.settings.theme = cur === 'dark' ? 'light' : 'dark';
      applyTheme(); persist();
    });
    $('#winBtn').addEventListener('click', async () => {
      if (isExtension) {
        await store.set(PENDING_KEY, { html: inputEl().innerHTML });
        await chrome.windows.create({ url: chrome.runtime.getURL('popup/popup.html?window=1'), type: 'popup', width: 1000, height: 760 });
        window.close();
      }
    });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
  }

  /* ------------------------------------------------------------------
   * راه‌اندازی
   * ------------------------------------------------------------------ */
  async function init() {
    const saved = await store.get(SETTINGS_KEY);
    if (saved && typeof saved === 'object') Object.assign(state.settings, saved);
    if (params.get('theme')) state.settings.theme = params.get('theme');
    if (!O.PRESETS[state.settings.preset]) state.settings.preset = 'standard';
    $('#ver').textContent = toFa(O.version);
    applyTheme();
    bind();
    renderSettings();
    renderInStats();

    let loaded = false;
    if (isExtension) {
      const pending = isWindow ? await store.get(PENDING_KEY) : undefined;
      if (pending) {
        await store.remove(PENDING_KEY);
        if (typeof pending === 'string') setInputPlain(pending);
        else setInputHTML(pending.html || '');
        loaded = true;
      } else if (!isWindow) {
        const info = await readFromPage();
        if (info) {
          if (info.html) setInputHTML(info.html); else setInputPlain(info.text);
          state.source = { tabId: info.tabId, frameId: info.frameId, editable: info.editable, mode: info.mode, field: !info.html };
          loaded = true;
        }
      }
    } else if (params.has('sample')) {
      setInputPlain(SAMPLE);
      loaded = true;
    }

    renderInStats();
    if (loaded) run({ silent: true });
    const tab = params.get('tab');
    if (tab) setTab(tab);
    if (!loaded) $('#input').focus();
  }

  init();
})();
