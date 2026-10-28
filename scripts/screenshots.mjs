#!/usr/bin/env node
/**
 * تصاویر معرفی (README، Chrome Web Store، Firefox Add-ons) را با مرورگر headless می‌سازد.
 * پیش‌نیاز: `npm run build` و نصب Microsoft Edge یا Google Chrome.
 */
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const OUT = join(ROOT, 'store', 'screenshots');
mkdirSync(OUT, { recursive: true });

const BROWSERS = [
  process.env.BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);
const browser = BROWSERS.find((p) => existsSync(p));
if (!browser) throw new Error('هیچ مرورگر Chromium پیدا نشد (متغیر BROWSER را تنظیم کنید).');

const frame = (params) => `store/templates/frame.html?${new URLSearchParams(params)}`;
const JOBS = [
  {
    file: '01-before-after.png',
    page: frame({
      tag: 'قبل و بعد',
      title: 'همهٔ تغییرات را [شفاف] ببینید',
      sub: 'هر حذف و افزودن رنگی نشان داده می‌شود؛ حتی نیم‌فاصله‌ها با نشانگر مخصوص.',
      list: 'نمای یکپارچه و دو ستونه|گزارش دقیق هر اصلاح|بدون ارسال هیچ داده‌ای به اینترنت',
      popup: 'sample=1&demo=1&tab=compare&theme=light&cmp=inline',
    }),
  },
  {
    file: '02-one-click.png',
    page: frame({
      tag: 'ویرایش یک‌کلیکی',
      title: 'متن فارسی را [با یک کلیک] اتو کنید',
      sub: 'نیم‌فاصله، نشانه‌گذاری، املا، ارقام و فاصله‌ها در کسری از ثانیه درست می‌شوند.',
      list: 'پیشوند و پسوندها: می‌روم، کتاب‌ها، بزرگ‌تر|ویراستاری املا و تنوین قیدها|یکدست‌سازی ارقام و درصد',
      popup: 'sample=1&demo=1&tab=result&theme=light',
    }),
  },
  {
    file: '03-report.png',
    page: frame({
      tag: 'گزارش هوشمند',
      title: 'بدانید [چه چیزی] اصلاح شد',
      sub: 'تغییرات به تفکیک دسته و قانون، همراه با نمونه‌های واقعی از متن شما.',
      list: 'نیم‌فاصله، نشانه‌گذاری، املا، اعداد، صفحه‌آرایی|نمونهٔ «قبل ← بعد» برای هر قانون',
      popup: 'sample=1&demo=1&tab=report&theme=dark&focus=1',
    }),
  },
  {
    file: '04-settings.png',
    page: frame({
      tag: 'کاملاً قابل تنظیم',
      title: 'هر قانون را [خودتان] کنترل کنید',
      sub: 'چهار سطح ویرایش آماده، یا فعال و غیرفعال‌کردن تک‌تک قانون‌ها.',
      list: 'سبک، استاندارد، کامل و رسمی|ارقام فارسی، انگلیسی یا بدون تغییر|اتصال سطرهای PDF و رسمی‌سازی گفتاری',
      popup: 'sample=1&demo=1&tab=settings&theme=light&focus=1',
    }),
  },
  { file: '05-window.png', page: 'dist/chrome/popup/popup.html?window=1&sample=1&tab=compare&theme=light&cmp=split', w: 1280, h: 800 },
  // تصاویر خام پاپ‌آپ (برای سایت) با کیفیت ۲ برابر
  ...[
    ['popup-result', 'tab=result&theme=light'],
    ['popup-compare', 'tab=compare&theme=light&cmp=inline'],
    ['popup-report', 'tab=report&theme=light'],
    ['popup-settings', 'tab=settings&theme=light'],
    ['popup-dark', 'tab=compare&theme=dark&cmp=split'],
  ].map(([name, q]) => ({ file: `${name}.png`, page: `dist/chrome/popup/popup.html?sample=1&${q}`, w: 720, h: 560, scale: 2 })),
  { file: 'promo-small-440x280.png', page: 'store/templates/tile.html', w: 440, h: 280 },
  { file: 'promo-marquee-1400x560.png', page: 'store/templates/tile.html', w: 1400, h: 560 },
];

for (const job of JOBS) {
  const { w = 1280, h = 800 } = job;
  const url = pathToFileURL(join(ROOT, job.page.split('?')[0])).href + (job.page.includes('?') ? '?' + job.page.split('?')[1] : '');
  const out = join(OUT, job.file);
  execFileSync(
    browser,
    [
      '--headless=new', '--disable-gpu', '--hide-scrollbars', `--force-device-scale-factor=${job.scale || 1}`,
      '--allow-file-access-from-files', '--virtual-time-budget=4000',
      `--window-size=${w},${h}`, `--screenshot=${out}`, url,
    ],
    { stdio: 'ignore', timeout: 60000 },
  );
  console.log('✔', job.file);
}
void spawn;
