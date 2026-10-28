/**
 * Otomatn — Service Worker / Background script
 * منوی راست‌کلیک، میان‌بر صفحه‌کلید و اصلاح در محل.
 * Developed by Reza Nemati — https://reza-nemati.ir
 */
'use strict';

if (typeof importScripts === 'function') importScripts('page/probe.js'); // Chrome service worker (در فایرفاکس از manifest بارگذاری می‌شود)

const MENU_FIX = 'otomatn-fix-inplace';
const MENU_EDITOR = 'otomatn-open-editor';
const SETTINGS_KEY = 'otomatn_settings';
const PENDING_KEY = 'otomatn_content';
const PAGE_FILES = ['core/otomatn-core.js', 'core/otomatn-dom.js', 'page/apply.js'];

/**
 * اسکریپت کمکی را تزریق و یک تابع را اجرا می‌کند.
 * فایرفاکس اگر حتی یک فریم ناهمسرچشمه (iframe) وجود داشته باشد کل allFrames را رد می‌کند؛
 * در این حالت فقط فریم اصلی را امتحان می‌کنیم.
 */
async function runInPage(tabId, func, args = []) {
  let lastError;
  for (const target of [{ tabId, allFrames: true }, { tabId, frameIds: [0] }]) {
    try {
      await chrome.scripting.executeScript({ target, files: PAGE_FILES });
      return await chrome.scripting.executeScript({ target, func, args });
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_FIX,
      title: '✨ اصلاح با اتومتن',
      contexts: ['selection', 'editable'],
    });
    chrome.contextMenus.create({
      id: MENU_EDITOR,
      title: 'باز کردن در ویرایشگر اتومتن (قبل و بعد)',
      contexts: ['selection'],
    });
  });
});

async function loadOptions() {
  try {
    const { [SETTINGS_KEY]: s } = await chrome.storage.local.get(SETTINGS_KEY);
    return { preset: s?.preset || 'standard', rules: s?.rules || null, digits: s?.digits || 'fa' };
  } catch {
    return { preset: 'standard', rules: null, digits: 'fa' };
  }
}

/** انتخاب صفحه را (با قالب) می‌خواند؛ اگر فریم‌های ناهمسرچشمه مشکل ایجاد کنند فقط فریم اصلی. */
async function probeTab(tabId) {
  for (const target of [{ tabId, allFrames: true }, { tabId, frameIds: [0] }]) {
    try {
      const res = await chrome.scripting.executeScript({ target, func: otomatnProbe });
      const hit = res.map((r) => r.result).find((r) => r && r.text && r.text.trim());
      if (hit) return hit;
    } catch { /* تلاش بعدی */ }
  }
  return null;
}

async function openEditor(content) {
  const data = typeof content === 'string' ? { text: content } : content;
  await chrome.storage.local.set({ [PENDING_KEY]: data });
  await chrome.windows.create({
    url: chrome.runtime.getURL('popup/popup.html?window=1'),
    type: 'popup',
    width: 1000,
    height: 760,
  });
}

function flashBadge(text) {
  chrome.action.setBadgeBackgroundColor({ color: '#2563eb' });
  chrome.action.setBadgeText({ text });
  setTimeout(() => chrome.action.setBadgeText({ text: '' }), 2500);
}

/** متن انتخاب‌شده را در همان صفحه اصلاح می‌کند؛ اگر ممکن نبود، ویرایشگر را باز می‌کند. */
async function fixSelection(tab) {
  if (!tab || tab.id === undefined) return;
  try {
    const options = await loadOptions();
    const results = await runInPage(tab.id, (opts) => globalThis.__OTOMATN_PAGE__.fixInPlace(opts), [options]);
    const hits = results.map((r) => r.result).filter(Boolean);
    const done = hits.find((r) => r.handled);
    if (done) {
      flashBadge(done.total ? String(done.total) : '✓');
      return;
    }
    const readonly = hits.find((r) => r.reason === 'readonly' && r.text);
    if (readonly) await openEditor(readonly.text);
    else flashBadge('—');
  } catch (e) {
    console.warn('Otomatn: cannot access this page', e);
    flashBadge('!');
  }
}

chrome.contextMenus.onClicked.addListener(async (info_, tab) => {
  if (info_.menuItemId === MENU_FIX) await fixSelection(tab);
  if (info_.menuItemId === MENU_EDITOR && info_.selectionText) {
    // selectionText خط‌های جدید و قالب را حفظ نمی‌کند؛ از خود صفحه می‌خوانیم.
    const info = (await probeTab(tab.id)) || { text: info_.selectionText };
    await openEditor(info);
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'fix-selection') return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await fixSelection(tab);
});
