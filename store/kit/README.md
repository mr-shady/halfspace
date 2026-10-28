# بستهٔ صفحهٔ فروشگاه اتومتن

همهٔ چیزهایی که برای به‌روزرسانی صفحهٔ افزونه در Chrome Web Store و Firefox Add-ons لازم است.
تصاویر با `node scripts/store-kit.mjs` از روی `store/templates/kit.html` ساخته می‌شوند.

```
store/kit/
├─ chrome/
│  ├─ icon-128.png                    ← Store icon
│  ├─ promo-small-440x280.png         ← Small promo tile
│  ├─ promo-marquee-1400x560.png      ← Marquee promo tile
│  └─ screenshots/  01…05 (1280×800, PNG بدون آلفا)
└─ firefox/
   ├─ icon-128.png / icon-512.png
   └─ screenshots/  01…05 (2560×1600، نسبت ۱٫۶ با کیفیت ۲ برابر)
```

ترتیب پیشنهادی اسکرین‌شات‌ها (اولی مهم‌ترین است، در نتایج جست‌وجو دیده می‌شود):

| فایل | پیام |
|---|---|
| `01-one-click.png` | متن فارسی را با یک کلیک اتو کنید (پاپ‌آپ روی صفحه) |
| `02-before-after.png` | هر تغییر را شفاف ببینید (قبل و بعد) |
| `03-fix-in-place.png` | همان‌جا اصلاح کنید؛ قالب می‌ماند (Alt+Shift+F و منوی راست‌کلیک) |
| `04-report.png` | گزارش تغییرات (تم تیره) |
| `05-settings-privacy.png` | تنظیمات و ۱۰۰٪ آفلاین |

> **نکتهٔ مهم:** اگر همراه صفحه، بستهٔ zip تازه هم آپلود می‌کنید، شمارهٔ `version` در هر دو manifest باید از نسخهٔ منتشرشده بالاتر باشد (هر دو فروشگاه نسخهٔ تکراری را رد می‌کنند).

---

## Chrome Web Store

**Name** (از manifest خوانده می‌شود): اتومتن | ویراستار هوشمند متن فارسی

**Summary / short description** (حداکثر ۱۳۲ نویسه — از `extDescription` در manifest):

```
ویراستار و دستیار حرفه‌ای متن فارسی؛ نیم‌فاصله، نگارش و نشانه‌گذاری با یک کلیک. توسعه‌یافته توسط رضا نعمتی
```

**Category:** Productivity → Tools / Workflow · **Language:** Persian (فارسی)

**Description (فارسی):**

```
اتومتن متن فارسی شما را با یک کلیک «اتو» می‌کند.

متن را در هر صفحه‌ای انتخاب کنید و روی آیکن اتومتن بزنید؛ متن انتخاب‌شده خودکار وارد می‌شود و نیم‌فاصله، نشانه‌گذاری، املا، اعداد و فاصله‌ها در یک لحظه درست می‌شوند. همهٔ تغییرات را در نمای «قبل و بعد» می‌بینید و نتیجه را با یک کلیک در صفحه جایگزین می‌کنید.

⚡ همان‌جا اصلاح کنید
• متن را در Gmail، وردپرس، شبکه‌های اجتماعی یا هر فیلد متنی انتخاب کنید و Alt+Shift+F را بزنید، یا از منوی راست‌کلیک «اصلاح با اتومتن» را انتخاب کنید.
• قالب حفظ می‌شود: لینک، تصویر، عنوان، پررنگ، فهرست و جدول دست نمی‌خورند؛ فقط متن اصلاح می‌شود.
• با Ctrl+Z برمی‌گردد.

✍️ چه چیزهایی را اصلاح می‌کند؟
• نیم‌فاصله: می‌روم، نمی‌خواهم، کتاب‌ها، رفته‌ام، بزرگ‌تر، بی‌نظیر، انعطاف‌پذیر، بهینه‌سازی و صدها واژهٔ مرکب
• نشانه‌گذاری: فاصلهٔ درست پیش و پس از «،» «؛» «؟» «!»، تبدیل , ; ? به نشانه‌های فارسی، گیومهٔ «»، سه‌نقطهٔ …
• املا: بخاطر ← به خاطر، بطور ← به طور، تأیید، مسئول، سؤال، تنوین قیدها (مثلاً، حتماً)، حذف واژهٔ تکراری
• یکسان‌سازی: ي و ك عربی ← ی و ک فارسی، حذف کشیده و نویسه‌های نامرئی، اصلاح متن کپی‌شده از PDF و ورد
• اعداد: ارقام فارسی، جداکنندهٔ هزارگان ۱٬۲۵۰٬۰۰۰، اعشار ۳٫۱۴ و درصد ۲۰٪
• صفحه‌آرایی: فاصله‌ها و خط‌های خالی اضافی، فاصلهٔ فارسی و لاتین، اتصال سطرهای شکستهٔ PDF

🔍 قبل و بعد و گزارش
• نمای یکپارچه یا دو ستونه؛ حذف‌ها قرمز، افزوده‌ها سبز، نیم‌فاصله با نشانگر مخصوص
• گزارش تغییرات به تفکیک دسته و قانون، با نمونه‌های واقعی از متن شما

⚙️ به سلیقهٔ شما
• ۴ سطح ویرایش: سبک، استاندارد، کامل و رسمی
• ۲۸ قانون که تک‌تک قابل روشن و خاموش‌کردن‌اند
• ارقام فارسی، انگلیسی یا بدون تغییر
• تم روشن و تیره، پنجرهٔ بزرگ برای متن‌های بلند

🔒 حریم خصوصی
اتومتن کاملاً آفلاین کار می‌کند؛ متن شما هرگز از مرورگر خارج نمی‌شود. بدون ردیاب، بدون آنالیتیکس، بدون حساب کاربری. لینک‌ها، ایمیل‌ها و کدها هرگز تغییر نمی‌کنند.

رایگان و متن‌باز (MIT)
وب‌سایت: https://mr-shady.github.io/halfspace/
کد منبع: https://github.com/mr-shady/halfspace

طراحی و توسعه: رضا نعمتی
```

**Description (English)** — برای بخش زبان انگلیسی:

```
Otomatn irons out your Persian (Farsi) text in one click.

Select text on any page and click the Otomatn icon: the selection is picked up automatically and half-spaces (ZWNJ), punctuation, spelling, digits and spacing are fixed instantly. Review every change in a before/after view and put the result back into the page with one click.

⚡ Fix in place
• Select text in Gmail, WordPress, social networks or any text field and press Alt+Shift+F, or right-click → "Fix with Otomatn".
• Formatting is preserved: links, images, headings, bold, lists and tables stay intact — only the text is corrected.
• Undo with Ctrl+Z.

✍️ What it fixes
• Half-spaces: verb prefixes (می/نمی), plurals (ها/های), verb suffixes, comparatives (تر/ترین) and hundreds of compound words
• Punctuation: correct spacing, , ; ? → Persian marks, «» quotes, ellipsis
• Spelling: common mistakes, hamza forms, tanwin adverbs, duplicate words
• Normalization: Arabic ي/ك → Persian ی/ک, kashida and invisible characters, text copied from PDF/Word
• Numbers: Persian digits, thousands separators, decimals and percent
• Layout: extra spaces and blank lines, Persian/Latin spacing, broken PDF lines

🔍 Before/after and report — inline or side-by-side diff with a ZWNJ marker, plus a per-rule report with real examples from your text.

⚙️ Configurable — 4 presets (light, standard, full, formal), 28 individually switchable rules, digit style, light/dark themes and a large editor window.

🔒 Private — 100% offline. Your text never leaves the browser. No tracking, no analytics, no account.

Free and open source (MIT) · https://mr-shady.github.io/halfspace/
Designed and developed by Reza Nemati
```

---

## Firefox Add-ons (AMO)

**Name** (≤ ۵۰ نویسه): `اتومتن | ویراستار هوشمند متن فارسی`

**Summary** (≤ ۲۵۰ نویسه):

```
متن فارسی را با یک کلیک اتو کنید: نیم‌فاصله، نشانه‌گذاری، املا، اعداد و فاصله‌ها، با نمای قبل و بعد. اصلاح در همان صفحه با حفظ قالب (Alt+Shift+F). کاملاً آفلاین و رایگان. طراحی و توسعه: رضا نعمتی
```

English summary:

```
Fix Persian (Farsi) text in one click: half-spaces (ZWNJ), punctuation, spelling, digits and spacing, with a before/after view. Fixes in place and keeps formatting (Alt+Shift+F). 100% offline and free.
```

**Description:** همان متن کامل بخش کروم (فارسی و انگلیسی). AMO از Markdown پشتیبانی نمی‌کند ولی خط‌ها و ایموجی‌ها درست نمایش داده می‌شوند.

**Categories:** Language Support · Other
**Tags:** persian, farsi, zwnj, half-space, proofreading, grammar, spell checker, typography
**Homepage:** https://mr-shady.github.io/halfspace/
**Support site:** https://github.com/mr-shady/halfspace/issues
**License:** MIT
**Privacy policy:** «این افزونه هیچ داده‌ای جمع‌آوری نمی‌کند» — یا لینک https://github.com/mr-shady/halfspace/blob/main/PRIVACY.md

**عنوان تصاویر (Caption) در AMO:**

1. متن انتخاب‌شده را با یک کلیک اصلاح کنید — Fix selected text in one click
2. قبل و بعد: هر تغییر را شفاف ببینید — Before/after: see every change
3. اصلاح در همان صفحه با حفظ قالب — Fix in place, formatting preserved
4. گزارش تغییرات به تفکیک قانون — Per-rule change report
5. تنظیمات و کارکرد کاملاً آفلاین — Settings, fully offline

---

## یادداشت نسخه (Release notes / What's new)

```
• حفظ قالب: لینک، تصویر، عنوان و پررنگ در پاپ‌آپ، ویرایشگر و اصلاح در محل حفظ می‌شوند.
• تشخیص خودکار متن انتخاب‌شده با کلیک روی آیکن (از جمله در فایرفاکس).
• موتور قوی‌تر: صدها ریشهٔ فعل، واژهٔ مرکب و مورد املایی تازه، و قانون‌های عمومی برای پسوندها.
• پاپ‌آپ جمع‌وجور و بدون اسکرول، نمای قبل و بعد تمیزتر و لوگوی جدید.
```

```
• Formatting is preserved (links, images, headings, bold) in the popup, editor and in-place fixing.
• Selected text is detected automatically when you click the toolbar icon (Firefox included).
• Stronger engine: hundreds of new verb stems, compounds and spelling entries, plus generic suffix rules.
• Compact no-scroll popup, cleaner before/after view and a new logo.
```
