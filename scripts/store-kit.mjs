#!/usr/bin/env node
/**
 * بستهٔ تصاویر فروشگاه‌ها را در store/kit می‌سازد (قالب: store/templates/kit.html).
 * Chrome: اسکرین‌شات ۱۲۸۰×۸۰۰ و تایل‌ها، PNG بدون آلفا. Firefox: همان اسکرین‌شات‌ها با کیفیت ۲ برابر.
 * پیش‌نیاز: `npm run build`، Edge یا Chrome، و Python با Pillow.
 */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const KIT = join(ROOT, 'store', 'kit');
const browser = [
  process.env.BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean).find((p) => existsSync(p));
if (!browser) throw new Error('هیچ مرورگر Chromium پیدا نشد (متغیر BROWSER را تنظیم کنید).');

const SHOTS = [
  ['01-one-click', 'hero'],
  ['02-before-after', 'compare'],
  ['03-fix-in-place', 'inplace'],
  ['04-report', 'report&dark=1'],
  ['05-settings-privacy', 'settings'],
];
const JOBS = [
  ...SHOTS.map(([name, v]) => ({ out: `chrome/screenshots/${name}.png`, v, w: 1280, h: 800 })),
  ...SHOTS.map(([name, v]) => ({ out: `firefox/screenshots/${name}.png`, v, w: 1280, h: 800, scale: 2 })),
  { out: 'chrome/promo-small-440x280.png', v: 'tile', w: 440, h: 280 },
  { out: 'chrome/promo-marquee-1400x560.png', v: 'marquee', w: 1400, h: 560 },
];

const template = pathToFileURL(join(ROOT, 'store', 'templates', 'kit.html')).href;
for (const job of JOBS) {
  const out = join(KIT, job.out);
  mkdirSync(join(out, '..'), { recursive: true });
  execFileSync(browser, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', `--force-device-scale-factor=${job.scale || 1}`,
    '--allow-file-access-from-files', '--virtual-time-budget=5000',
    `--window-size=${job.w},${job.h}`, `--screenshot=${out}`, `${template}?v=${job.v}`,
  ], { stdio: 'ignore', timeout: 60000 });
  console.log('✔', job.out);
}

// فروشگاه کروم PNG بدون کانال آلفا می‌خواهد
execFileSync('python', ['-c', `
import glob, sys
from PIL import Image
for p in glob.glob(sys.argv[1] + '/**/*.png', recursive=True):
    im = Image.open(p)
    if im.mode != 'RGB': im.convert('RGB').save(p, optimize=True)
`, KIT], { stdio: 'inherit' });

for (const store of ['chrome', 'firefox']) {
  copyFileSync(join(ROOT, 'src', 'extension', 'icons', 'logo-128.png'), join(KIT, store, 'icon-128.png'));
}
copyFileSync(join(ROOT, 'src', 'extension', 'icons', 'logo-512.png'), join(KIT, 'firefox', 'icon-512.png'));
console.log('→', KIT);
