#!/usr/bin/env node
/**
 * Otomatn build — نسخهٔ قابل انتشار برای Chrome Web Store و Firefox Add-ons را می‌سازد.
 *   dist/chrome, dist/firefox      → پوشه‌های قابل بارگذاری (Load unpacked)
 *   releases/otomatn-*-vX.Y.Z.zip   → بسته‌های آمادهٔ آپلود
 * بدون هیچ وابستگی؛ فقط Node.js ≥ 22.2.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { deflateRawSync, crc32 } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const SRC = join(ROOT, 'src', 'extension');
const CORE = join(ROOT, 'src', 'core', 'otomatn-core.js');
const DIST = join(ROOT, 'dist');
const RELEASES = join(ROOT, 'releases');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const TARGETS = ['chrome', 'firefox'];

const fail = (msg) => {
  console.error(`✖ ${msg}`);
  process.exit(1);
};

/* ---------- ZIP نویس مینیمال (deflate + UTF-8 + زمان ثابت برای بیلد تکرارپذیر) ---------- */
function zipDir(dir, outFile) {
  const files = [];
  (function walk(d) {
    for (const name of readdirSync(d).sort()) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else files.push(p);
    }
  })(dir);

  const DOS_TIME = 0x6000;
  const DOS_DATE = 0x5a21; // 2025-01-01 12:00
  const chunks = [];
  const central = [];
  let offset = 0;
  for (const file of files) {
    const name = Buffer.from(relative(dir, file).split(sep).join('/'));
    const data = readFileSync(file);
    const packed = deflateRawSync(data, { level: 9 });
    const crc = crc32(data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt16LE(DOS_TIME, 10);
    local.writeUInt16LE(DOS_DATE, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(packed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    chunks.push(local, name, packed);

    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0);
    cen.writeUInt16LE(20, 4);
    cen.writeUInt16LE(20, 6);
    cen.writeUInt16LE(0x0800, 8);
    cen.writeUInt16LE(8, 10);
    cen.writeUInt16LE(DOS_TIME, 12);
    cen.writeUInt16LE(DOS_DATE, 14);
    cen.writeUInt32LE(crc, 16);
    cen.writeUInt32LE(packed.length, 20);
    cen.writeUInt32LE(data.length, 24);
    cen.writeUInt16LE(name.length, 28);
    cen.writeUInt32LE(offset, 42);
    central.push(cen, name);
    offset += local.length + name.length + packed.length;
  }
  const centralBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  writeFileSync(outFile, Buffer.concat([...chunks, centralBuf, end]));
  return files.length;
}

/* ---------- ساخت ---------- */
rmSync(DIST, { recursive: true, force: true });
mkdirSync(RELEASES, { recursive: true });

for (const target of TARGETS) {
  const out = join(DIST, target);
  cpSync(SRC, out, { recursive: true, filter: (p) => !/manifest\.(chrome|firefox)\.json$/.test(p) });
  mkdirSync(join(out, 'core'), { recursive: true });
  cpSync(CORE, join(out, 'core', 'otomatn-core.js'));

  const manifest = JSON.parse(readFileSync(join(SRC, `manifest.${target}.json`), 'utf8'));
  manifest.version = pkg.version;
  writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

  // اعتبارسنجی پایه
  const refs = [
    manifest.action?.default_popup,
    manifest.background?.service_worker,
    ...(manifest.background?.scripts || []),
    ...Object.values(manifest.icons || {}),
  ].filter(Boolean);
  for (const r of refs) if (!existsSync(join(out, r))) fail(`${target}: فایل ${r} پیدا نشد`);
  const fa = JSON.parse(readFileSync(join(out, '_locales/fa/messages.json'), 'utf8'));
  if ([...fa.extDescription.message].length > 132) fail('توضیح افزونه از ۱۳۲ نویسه بیشتر است');
  if (!/reza-nemati\.ir/.test(fa.extDescription.message)) fail('نام توسعه‌دهنده در توضیحات نیست');

  const zip = join(RELEASES, `otomatn-${target}-v${pkg.version}.zip`);
  const n = zipDir(out, zip);
  console.log(`✔ ${target.padEnd(8)} ${n} فایل → ${relative(ROOT, zip)} (${(statSync(zip).size / 1024).toFixed(0)} KB)`);
}

/* ---------- نسخهٔ سازگار با کد قدیمی: FixGrammar.js (new FixGrammar(text).get()) ---------- */
const legacy = `
/**
 * سازگاری با نسخه‌های قبلی: new FixGrammar(text, options).get()
 * موتور اصلی اکنون Otomatn است؛ برای امکانات کامل از Otomatn.refine() استفاده کنید.
 */
function FixGrammar(text, options) {
  const result = Otomatn.refine(text, options);
  this.get = () => result.text;
  this.result = result;
}
`;
writeFileSync(join(ROOT, 'FixGrammar.js'), readFileSync(CORE, 'utf8') + legacy);
console.log('✔ FixGrammar.js (سازگار با نسخهٔ قدیمی) به‌روز شد');
