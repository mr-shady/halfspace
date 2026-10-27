'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const Otomatn = require('../src/core/otomatn-core.js');

const Z = '‌';
const fix = (s, o) => Otomatn.refine(s, o).text;
const z = (s) => s.replace(/\|/g, Z);

test('پیشوند می/نمی', () => {
  assert.equal(fix('می رود'), z('می|رود'));
  assert.equal(fix('نمی خواهم'), z('نمی|خواهم'));
  assert.equal(fix('میشود'), z('می|شود'));
  assert.equal(fix('نمیتوانم'), z('نمی|توانم'));
  assert.equal(fix('برمیگردد'), z('برمی|گردد'));
  assert.equal(fix('می توان گفت'), z('می|توان گفت'));
});

test('واژه‌های غیرفعل با «می» دست نمی‌خورند', () => {
  for (const w of ['میز', 'میدان', 'میوه', 'میان', 'میلیون', 'میهن', 'میدانی', 'می خوردیم شراب'.slice(0, 2)]) {
    assert.equal(fix(w), w);
  }
});

test('نشانهٔ جمع', () => {
  assert.equal(fix('کتاب ها'), z('کتاب|ها'));
  assert.equal(fix('کتابها'), z('کتاب|ها'));
  assert.equal(fix('درخت های بلند'), z('درخت|های بلند'));
  assert.equal(fix('خانه ها'), z('خانه|ها'));
  assert.equal(fix('کتابهایم'), z('کتاب|هایم'));
  assert.equal(fix('کننده گان'), 'کنندگان');
  assert.equal(fix('بچه گان'), 'بچگان');
  assert.equal(fix('جا ها'), 'جاها');
});

test('استثناهای «ها»', () => {
  for (const w of ['رها', 'اشتها', 'انتها', 'نهایی', 'ها ها ها']) assert.equal(fix(w), w);
});

test('پسوند فعل و «ی»', () => {
  assert.equal(fix('رفته ام'), z('رفته|ام'));
  assert.equal(fix('آمده اند'), z('آمده|اند'));
  assert.equal(fix('خانه ای'), z('خانه|ای'));
  assert.equal(fix('خانه ی من'), z('خانه|ی من'));
  assert.equal(fix('الهام'), 'الهام');
});

test('تفضیلی', () => {
  assert.equal(fix('بزرگ تر'), z('بزرگ|تر'));
  assert.equal(fix('سادهترین'), z('ساده|ترین'));
  assert.equal(fix('بیش تر'), 'بیشتر');
  assert.equal(fix('زیباتر'), 'زیباتر');
});

test('واژه‌های مرکب', () => {
  assert.equal(fix('بی نظیر'), z('بی|نظیر'));
  assert.equal(fix('پس زمینه'), z('پس|زمینه'));
  assert.equal(fix('هیچکس'), z('هیچ|کس'));
  assert.equal(fix('همین طور'), z('همین|طور'));
  assert.equal(fix('بهروز'), 'بهروز');
  assert.equal(fix('به روز'), z('به|روز'));
});

test('نشانه‌گذاری', () => {
  assert.equal(fix('سلام ،خوبی ؟خوبم.ممنون'), 'سلام، خوبی؟ خوبم. ممنون');
  assert.equal(fix('چطوری?, خوبم;'), 'چطوری؟، خوبم؛');
  assert.equal(fix('عالی!!! واقعا؟؟؟'), 'عالی! واقعاً؟');
  assert.equal(fix('ببین...'), 'ببین…');
  assert.equal(fix('او گفت "سلام"'), 'او گفت «سلام»');
  assert.equal(fix('متن ( نمونه ) است'), 'متن (نمونه) است');
  assert.equal(fix('نکته:مهم'), 'نکته: مهم');
});

test('اعداد و نمایه‌ها دست نمی‌خورند', () => {
  assert.equal(fix('نسخه 3.14 و 12:30'), 'نسخه ۳٫۱۴ و ۱۲:۳۰');
  assert.equal(fix('نسخهٔ v2.0.1 با H2O و mp3'), 'نسخهٔ v2.0.1 با H2O و mp3');
  assert.equal(fix('قیمت 1,500,000 تومان'), 'قیمت ۱٬۵۰۰٬۰۰۰ تومان');
  assert.equal(fix('50 % تخفیف'), '۵۰٪ تخفیف');
  assert.equal(fix('٤٥٦ ۷۸۹'), '۴۵۶ ۷۸۹');
  assert.equal(fix('عدد ۱۲۳', { digits: 'en' }), 'عدد 123');
  assert.equal(fix('عدد 123', { digits: 'keep' }), 'عدد 123');
  assert.equal(fix('English 123 only'), 'English 123 only');
});

test('محافظت از لینک، ایمیل و کد', () => {
  const src = 'سایت https://example.com/a,b?x=1 و ایمیل a.b@c.com و `x ,y` ';
  assert.equal(fix(src), 'سایت https://example.com/a,b?x=1 و ایمیل a.b@c.com و `x ,y`');
});

test('یکسان‌سازی', () => {
  assert.equal(fix('كتاب علي'), 'کتاب علی');
  assert.equal(fix('ســـلام'), 'سلام');
  assert.equal(fix('سلاااام'), 'سلام');
  assert.equal(fix('ﻣﺘﻦ ﻓﺎﺭﺳﯽ'), 'متن فارسی');
  assert.equal(fix('a‎b c'), 'ab c');
  assert.equal(fix('مَتنِ', { rules: { diacritics: true } }), 'متن');
});

test('املا و تنوین', () => {
  assert.equal(fix('بخاطر اینکه بطور کلی'), 'به خاطر اینکه به طور کلی');
  assert.equal(fix('مثلا حتما'), 'مثلاً حتماً');
  assert.equal(fix('این این متن'), 'این متن');
  assert.equal(fix('انشاالله'), 'ان‌شاءالله');
});

test('فاصله و خط', () => {
  assert.equal(fix('  یک    متن  \n\n\n\nدو  '), 'یک متن\n\nدو');
  assert.equal(fix('نسخهWindows'), 'نسخه Windows');
  assert.equal(fix('iPhoneها'), 'iPhone' + Z + 'ها');
  assert.equal(fix('این جمله\nادامه دارد.', { rules: { 'join-lines': true } }), 'این جمله ادامه دارد.');
});

test('نیم‌فاصلهٔ اضافی', () => {
  assert.equal(fix('کلمه' + Z + Z + ' ' + Z + 'بعد'), 'کلمه بعد');
  assert.equal(fix('سلام' + Z + '.'), 'سلام.');
});

test('رسمی‌سازی', () => {
  assert.equal(fix('نمیدونم چطوری', { preset: 'formal' }), z('نمی|دانم چگونه'));
});

test('idempotent و بدون تغییر روی متن درست', () => {
  const good = z('این متن به‌درستی نوشته شده است، و نیازی به ویرایش ندارد.');
  const once = fix(good);
  assert.equal(fix(once), once);
  const messy = 'این متن برای تست نیم فاصله می باشد.چی شده است ؟كتاب ها  بزرگ تر 12 % بخاطر "اینکه"!!!';
  const r1 = fix(messy);
  assert.equal(fix(r1), r1);
});

test('refine گزارش تغییرات می‌دهد', () => {
  const r = Otomatn.refine('کتاب ها و می رود،');
  assert.ok(r.total >= 2);
  assert.ok(r.changes.every((c) => c.count > 0 && c.samples.length > 0));
});

test('diff', () => {
  const ops = Otomatn.diff('کتاب ها خوب', z('کتاب|ها خوب'));
  assert.equal(ops.map((o) => o.text).join('') .includes('خوب'), true);
  assert.deepEqual(ops.filter((o) => o.type === 'ins').map((o) => o.text), [z('کتاب|ها')]);
  assert.deepEqual(Otomatn.diff('الف', 'الف'), [{ type: 'eq', text: 'الف' }]);
  const rebuilt = ops.filter((o) => o.type !== 'del').map((o) => o.text).join('');
  assert.equal(rebuilt, z('کتاب|ها خوب'));
});

test('analyze', () => {
  const a = Otomatn.analyze('سلام دنیا. این یک متن است!');
  assert.equal(a.words, 6);
  assert.equal(a.sentences, 2);
});

test('متن بزرگ سریع پردازش می‌شود', () => {
  const big = 'این متن می رود و کتاب ها بزرگ تر هستند ، بخاطر همین. '.repeat(4000);
  const t0 = Date.now();
  Otomatn.refine(big);
  assert.ok(Date.now() - t0 < 5000, 'too slow');
});
