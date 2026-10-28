# متن آمادهٔ فروشگاه‌ها / Store listing

بسته‌های آپلود: `releases/otomatn-chrome-v3.0.0.zip` و `releases/otomatn-firefox-v3.0.0.zip` (ساخته‌شده با `npm run build`).
تصاویر: `store/screenshots/` — اسکرین‌شات‌ها ۱۲۸۰×۸۰۰، تایل کوچک ۴۴۰×۲۸۰ و تایل بزرگ ۱۴۰۰×۵۶۰.

## نام و توضیح کوتاه (Summary)

- **نام:** اتومتن | ویراستار هوشمند متن فارسی
- **توضیح کوتاه (≤ ۱۳۲ نویسه):** ویراستار و دستیار حرفه‌ای متن فارسی؛ نیم‌فاصله، نگارش و نشانه‌گذاری با یک کلیک. توسعه‌یافته توسط رضا نعمتی
- **English name:** Otomatn | Persian Text Editor
- **English summary:** Professional Persian proofreader: half-spaces (ZWNJ), typography and punctuation in one click. Developed by Reza Nemati

## توضیح کامل (فارسی)

اتومتن، ویراستار و دستیار حرفه‌ای متن فارسی است. متن را انتخاب کنید (یا بچسبانید)، روی «ویرایش یک‌کلیکی» بزنید و همهٔ اصلاحات لازم، همراه با نمای «قبل و بعد» اعمال می‌شود.

✨ چه چیزهایی را اصلاح می‌کند؟
• نیم‌فاصله: می‌رود، نمی‌خواهم، کتاب‌ها، رفته‌ام، بزرگ‌تر، بی‌نظیر، پس‌زمینه، کنندگان و ده‌ها واژهٔ مرکب
• نشانه‌گذاری: فاصله قبل و بعد «،» «؛» «؟» «!» «:»، تبدیل , ; ? به علائم فارسی، گیومهٔ «»، سه‌نقطه …
• یکسان‌سازی: ي/ك عربی ← ی/ک فارسی، حذف کشیده و نویسه‌های نامرئی، اصلاح متن کپی‌شده از PDF و ورد
• اعداد: ارقام فارسی، هزارگان ۱٬۵۰۰٬۰۰۰، اعشار ۳٫۱۴ و درصد ۵۰٪
• املا: بخاطر ← به خاطر، بطور ← به طور، تنوین قیدها (مثلاً، حتماً)، حذف واژهٔ تکراری
• صفحه‌آرایی: فاصله‌ها و خط‌های خالی اضافی، فاصله بین فارسی و لاتین، اتصال سطرهای شکستهٔ PDF

🚀 امکانات
• حفظ قالب: لینک، تصویر، عنوان و پررنگ دست نمی‌خورند؛ فقط متن اصلاح می‌شود
• قبل و بعد: نمای یکپارچه و دو ستونه، با نشانگر نیم‌فاصله
• گزارش دقیق تغییرات به تفکیک قانون، با نمونه
• اصلاح در محل در فیلدهای متنی (Alt+Shift+F یا راست‌کلیک)
• جایگزینی نتیجه در صفحه با یک کلیک
• ۴ سطح ویرایش (سبک، استاندارد، کامل، رسمی) و ۲۸ قانون قابل تنظیم
• تم روشن و تیره، پنجرهٔ بزرگ برای متن‌های بلند

🔒 حریم خصوصی
کاملاً آفلاین؛ متن شما هرگز از مرورگر خارج نمی‌شود. بدون آنالیتیکس، بدون ردیاب.

لینک‌ها، ایمیل‌ها و کدها هرگز تغییر نمی‌کنند.

توسعه‌یافته توسط رضا نعمتی
کد منبع (MIT): https://github.com/mr-shady/halfspace

## Full description (English)

Otomatn is a professional Persian text editor and proofreader. Select or paste Persian text, click "One-click edit" and get every fix applied with a before/after view.

Fixes: half-spaces / ZWNJ (می‌رود, کتاب‌ها, رفته‌ام, بزرگ‌تر…), punctuation spacing and Persian punctuation, Arabic→Persian letters, invisible characters, Persian digits & number formats, common spelling mistakes, tanwin, extra spaces/blank lines, PDF line-break joining.

Features: inline & side-by-side diff, per-rule report, in-place fixing in text fields (Alt+Shift+F / context menu), 4 presets and 28 rules, light/dark themes. 100% offline — your text never leaves the browser.

Developed by Reza Nemati · Source (MIT): https://github.com/mr-shady/halfspace

## دسته‌بندی و برچسب‌ها

- Chrome: Category **Productivity** (یا Tools) · Language **Persian (فارسی)**
- Firefox: Category **Language Support / Other** · Tags: persian, farsi, zwnj, half-space, proofreading, editor

## توجیه مجوزها (Permission justification)

| مجوز | توضیح برای بازبین |
|---|---|
| `activeTab` | خواندن متن انتخاب‌شده و جایگزینی نتیجه در زبانهٔ فعال، فقط پس از کنش کاربر (کلیک آیکون/منو/میان‌بر). |
| `scripting` | تزریق اسکریپت کمکی `page/apply.js` برای خواندن/جایگزینی انتخاب (همراه activeTab). |
| `contextMenus` | موارد «اصلاح با اتومتن» در منوی راست‌کلیک. |
| `storage` | ذخیرهٔ محلی تنظیمات و انتقال موقت متن به پنجرهٔ ویرایشگر. |

- **Single purpose:** ویرایش و اصلاح نگارشی متن فارسی.
- **Remote code:** ندارد. · **Data usage:** هیچ داده‌ای جمع‌آوری نمی‌شود (Firefox: `data_collection_permissions: none`).
- **Privacy policy URL:** https://github.com/mr-shady/halfspace/blob/main/PRIVACY.md

## مراحل انتشار

**Chrome Web Store** — https://chrome.google.com/webstore/devconsole
1. New item ← آپلود `otomatn-chrome-v3.0.0.zip`
2. Store listing: متن‌های بالا، آیکون `src/extension/icons/logo-128.png`، اسکرین‌شات‌های `01..05`، تایل کوچک و بزرگ.
3. Privacy: Single purpose، توجیه مجوزها، آدرس سیاست حریم خصوصی.

**Firefox Add-ons (AMO)** — https://addons.mozilla.org/developers/
1. Submit a New Add-on ← On this site (listed) ← آپلود `otomatn-firefox-v3.0.0.zip`
2. شناسهٔ افزونه در manifest: `{be00062e-fe16-4bfc-b9e1-8cace4d16afd}` (شناسهٔ ثبت‌شده در AMO). کد بدون minify است و نیازی به آپلود سورس جداگانه نیست.
3. تکمیل Listing با همان متن و اسکرین‌شات‌ها.
