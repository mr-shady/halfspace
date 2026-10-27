<link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.0.3/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />

<style>
  body, h1, h2, h3, h4, h5, h6, p, li, a, td, th { font-family: 'Vazirmatn', sans-serif !important; }
  body { direction: rtl; text-align: right; line-height: 1.9; }
  pre, code { direction: ltr; text-align: left; font-family: Consolas, Monaco, monospace !important; }
  img { max-width: 100%; border-radius: 12px; }
  table { display: table; width: 100%; }
</style>

# اتومتن | Otomatn

**ویراستار و دستیار حرفه‌ای متن فارسی — با یک کلیک**

نیم‌فاصله، نگارش، نشانه‌گذاری، املا، ارقام و صفحه‌آرایی؛ کاملاً آفلاین. توسعه‌یافته توسط [رضا نعمتی](https://reza-nemati.ir) — [reza-nemati.ir](https://reza-nemati.ir)

![قبل و بعد](https://raw.githubusercontent.com/mr-shady/halfspace/main/store/screenshots/01-before-after.png)

## امکانات

* **ویرایش یک‌کلیکی:** نیم‌فاصله (`می‌رود`، `کتاب‌ها`، `رفته‌ام`، `بزرگ‌تر`)، نشانه‌گذاری، املا، تنوین، ارقام فارسی، فاصله‌ها و ...
* **قبل و بعد:** نمای یکپارچه و دو ستونه با نشانگر نیم‌فاصله.
* **گزارش هوشمند:** تعداد و نمونهٔ هر اصلاح به تفکیک قانون.
* **اصلاح در محل** در فیلدهای متنی با `Alt+Shift+F` یا منوی راست‌کلیک.
* **۴ سطح ویرایش** و ۲۸ قانون قابل تنظیم.
* **Chrome و Firefox** (Manifest V3).
* **۱۰۰٪ آفلاین** و بدون هیچ ردیابی.

![گزارش](https://raw.githubusercontent.com/mr-shady/halfspace/main/store/screenshots/03-report.png)
![پنجرهٔ بزرگ](https://raw.githubusercontent.com/mr-shady/halfspace/main/store/screenshots/05-window.png)

## دانلود

* [Chrome / Edge / Brave — otomatn-chrome-v3.0.0.zip](https://github.com/mr-shady/halfspace/raw/main/releases/otomatn-chrome-v3.0.0.zip)
* [Firefox — otomatn-firefox-v3.0.0.zip](https://github.com/mr-shady/halfspace/raw/main/releases/otomatn-firefox-v3.0.0.zip)

## استفادهٔ برنامه‌نویسی

```html
<script src="https://cdn.jsdelivr.net/gh/mr-shady/halfspace/src/core/otomatn-core.js"></script>
<script>
  const { text, total } = Otomatn.refine('این متن می رود و کتاب ها بزرگ تر هستند ،بخاطر همین.');
  // text → این متن می‌رود و کتاب‌ها بزرگ‌تر هستند، به خاطر همین.
</script>
```

```js
Otomatn.refine(input, { preset: 'standard', digits: 'fa', rules: { 'join-lines': true } });
Otomatn.diff(before, after);   // تفاوت واژه‌به‌واژه
Otomatn.analyze(text);         // آمار متن
```

## معماری موتور

موتور یک **خط لولهٔ قاعده‌محور** است:

1. **محافظت:** لینک، ایمیل، نام کاربری، مسیر فایل و کد با نویسه‌های جایگزین پوشانده می‌شوند.
2. **یکسان‌سازی:** نویسه‌های عربی، نمایشی و نامرئی، کشیده و حروف تکراری.
3. **املا و واژگان:** واژه‌نامهٔ اشتباهات رایج، تنوین، رسمی‌سازی اختیاری.
4. **نیم‌فاصله:** پیشوند «می/نمی» با اعتبارسنجی ریشهٔ فعل (برای تفکیک «میز» از «می‌رود»)، نشانه‌های جمع، پسوندها، تفضیلی و واژه‌های مرکب.
5. **نشانه‌گذاری و اعداد:** تبدیل علائم لاتین، فاصله‌گذاری، گیومه، ارقام و جداکننده‌ها.
6. **صفحه‌آرایی:** فاصله‌ها، خط‌های خالی، پاک‌سازی نیم‌فاصلهٔ اضافی؛ سپس بازگرداندن بخش‌های محافظت‌شده.

هر قانون اصلاحات خود را (تعداد + نمونه) گزارش می‌کند و خروجی **idempotent** است (اجرای دوباره، تغییری ایجاد نمی‌کند).

## حریم خصوصی

تمام پردازش‌ها در مرورگر شما انجام می‌شود و هیچ داده‌ای ارسال نمی‌شود. [متن کامل](https://github.com/mr-shady/halfspace/blob/main/PRIVACY.md)

---

<div style="text-align: center; margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; font-size: 0.9em; color: #666;">
<p>توسعه‌یافته توسط <a href="https://reza-nemati.ir">رضا نعمتی</a> · <a href="https://reza-nemati.ir">reza-nemati.ir</a> | نسخهٔ ۳٫۰٫۰ · لایسنس MIT</p>
</div>
