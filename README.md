
# اصلاح نیم‌فاصله

این مجموعه فانکشن به شما کمک می‌کند تا نیم‌فاصله را در متون فارسی اصلاح کنید، همچنین قابلیت اصلاح فاصله قبل و بعد از . , ! ? و ... نیز در آن گنجانده شده است.




## نصب و استفاده

برای نصب و استفاده کافی است فایل جی‌اس را به پوشه پروژه خود منتقل کرده و سپس آن را در اچ‌تی‌ام‌ال فراخوانی کنید

```html
  <script src="HalfSpace.js" type="text/javascript"></script>
  <!---- OR ---->
  <script src="https://cdn.jsdelivr.net/gh/mr-shady/halfspace/FixGrammar.min.js" type="text/javascript"></script>
  
```

سپس از فانکشن زیر برای اصلاح فیلد‌های مورد نظر خود استفاده کنید.

```javascript
CheckGrammar('#Grammer');
```

یا مستقیم کلاس رو صدا زده و متن رو در اختیارش قرار بدید و خروجی اصلاح شده رو تحویل بگیرید
```javascript
let String = 'این متن نیاز به اصلاح نیم فاصله دارد.';
const Fix = new FixGrammar(String);
let newString = Fix.get();
```
    
## قابلیت ها

- اصلاح فاصله قبل و بعد .,،:؛;?!؟
- ی اضافه در کلماتی همانند: جمله‌ی، برنامه‌ی، فاصله‌ی و غیره.
- ها جمع در کلماتی مانند: درخت‌ها، کتاب‌ها، خانه‌ها، بانک‌های، تفنگ‌های و غیره.
- پسوندهایی که پس از برخی افعال مختلف می‌آیند مانند: رفته‌ام، آمده‌اند، گرفته‌ای، خوانده‌اند و غیره.
- پیشوندهایی که قبل از برخی افعال می‌آیند: می‌توانم، می‌رود، می‌نوشید، می‌خوابند، نمی‌خرند، نمی‌آیند، نمی‌خوری، نمی‌شود و غیره.
- در برخی مصدرها مانند: گل‌گفتن، گل‌شنیدن ( نیاز به توسعه و تکمیل دارد)
- برخی کلمات خاص مانند: نیم‌فاصله، بی‌کلام (نیاز به توسعه و تکمیل)

### موارد نیاز به بازبینی و اصلاح
در وارد بالا فقط در صورتی که از هم جدا باشند با نیم‌فاصله به هم وصل می‌شوند ولی برعکس آن نیز باید اعمال شود. یعنی
میشود به می‌شود تبدیل شود
## اسکرین شات
قبل:

![Before](https://github.com/mr-shady/halfspace/raw/main/Screenshot.png)

بعد:

![After](https://github.com/mr-shady/halfspace/raw/main/Screenshot-after.png)


## بازخورد

اگر بازخورد و نظری داشتید می‌توانید از طرق ایمیل زیر با من در ارتباط باشید:

reza.shady@gmail.com


## License

[MIT](https://choosealicense.com/licenses/mit/)

