/**
 * Otomatn — Service Worker / Background script
 * منوی راست‌کلیک، میان‌بر صفحه‌کلید و اصلاح در محل.
 * Developed by Reza Nemati — https://reza-nemati.ir
 */
'use strict';

const MENU_FIX = 'otomatn-fix-inplace';
const MENU_EDITOR = 'otomatn-open-editor';
const SETTINGS_KEY = 'otomatn_settings';
const PENDING_KEY = 'otomatn_content';
const PAGE_FILES = ['core/otomatn-core.js', 'page/apply.js'];

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

async function openEditor(text) {
  await chrome.storage.local.set({ [PENDING_KEY]: text });
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
  const target = { tabId: tab.id, allFrames: true };
  try {
    await chrome.scripting.executeScript({ target, files: PAGE_FILES });
    const options = await loadOptions();
    const results = await chrome.scripting.executeScript({
      target,
      func: (opts) => globalThis.__OTOMATN_PAGE__.fixInPlace(opts),
      args: [options],
    });
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

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === MENU_FIX) await fixSelection(tab);
  if (info.menuItemId === MENU_EDITOR && info.selectionText) {
    // selectionText خط‌های جدید را حفظ نمی‌کند؛ از خود صفحه می‌خوانیم.
    let text = info.selectionText;
    try {
      const res = await chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        files: PAGE_FILES,
      }).then(() =>
        chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: true },
          func: () => globalThis.__OTOMATN_PAGE__.getSelectionInfo().text,
        }),
      );
      text = res.map((r) => r.result).find(Boolean) || text;
    } catch {
      /* از متن منو استفاده می‌شود */
    }
    await openEditor(text);
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'fix-selection') return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await fixSelection(tab);
});
