# پرامپت ساخت آیکن (برای ChatGPT / DALL·E / هر مولد تصویر)

نام «اتومتن» بازی با واژهٔ «اتو» است: متن را مثل پارچه «اتو» می‌کند و چروک‌ها (اشتباه‌های نگارشی و نیم‌فاصله) را صاف می‌کند.

## پرامپت اصلی (انگلیسی؛ بهترین نتیجه)

```
Design a premium app icon for a Persian proofreading browser extension called "Otomatn" (اتومتن) — the name is a pun on "otu", the Persian word for a clothes iron: it "irons out" wrinkles in text.

Concept: a bold, simplified clothes-iron silhouette in clean white, seen from the side, whose flat soleplate glides over a single line of Persian text; the part of the line behind the iron is perfectly smooth and straight, while a tiny wrinkle/zig-zag remains in front of it. Include one small four-point sparkle above the iron to suggest "one-click magic". Subtle and optional: a small vertical half-space (ZWNJ) tick mark in a lighter tint between two letters of the text line.

Style: modern flat vector with soft depth, like a polished macOS / iOS app icon. Rounded-square (squircle) container filled with a smooth diagonal gradient from royal blue (#2563EB) to indigo-violet (#6366F1). The iron is white with a very soft inner shadow; the sparkle uses warm amber (#F59E0B) as the only accent color. One light source from the top-left, gentle drop shadow under the iron. No outlines, no gradients inside the glyph other than the soft shading.

Rules: the symbol must stay perfectly readable at 16×16 px, so use thick shapes, few details, generous padding (symbol fills about 60% of the canvas), and high contrast between the white symbol and the blue background. Absolutely no text, no letters of the Latin alphabet, no watermark, no mockup, no hand, no photographic realism, no 3D clay look. Centered composition, 1:1 square, 1024×1024, the squircle fills the whole canvas edge to edge on a transparent background.
```

## توضیح فارسی (اگر خواستید فارسی بدهید)

> یک آیکن حرفه‌ای و مدرن برای افزونهٔ مرورگر «اتومتن» (ویراستار متن فارسی) بساز. ایدهٔ اصلی: یک اتوی سفید ساده و تخت که روی یک خط متن فارسی می‌لغزد؛ پشت اتو خط کاملاً صاف و صیقلی است و جلوی آن هنوز یک چروک کوچک مانده. بالای اتو یک جرقهٔ چهارپر کوچک به رنگ کهربایی (نشانهٔ «یک کلیک جادویی»). زمینه: مربع گوشه‌گرد با گرادیان مورب از آبی سلطنتی (#2563EB) به بنفش نیلی (#6366F1). سبک: وکتور تخت مدرن با عمق نرم مثل آیکن اپ‌های اپل، بدون متن و بدون خط دور. باید در اندازهٔ ۱۶ پیکسل هم خوانا بماند؛ پس شکل‌ها ضخیم، جزئیات کم و حاشیهٔ کافی باشد. خروجی ۱۰۲۴×۱۰۲۴ مربع.

## نسخه‌های جایگزین (برای انتخاب)

1. **حرف فارسی:** «ا» بلند و سفید با یک جرقهٔ کوچک و یک شکاف باریک (نیم‌فاصله) کنارش، روی همان زمینهٔ گرادیان آبی.
2. **قلم + اتو:** قلم نی (قلم‌ نستعلیق) که نوک آن شبیه کفی اتو است و روی خط می‌لغزد.
3. **مینیمال:** فقط یک جرقهٔ چهارپر سفید روی زمینهٔ گرادیان، با یک خط کوتاه صاف زیر آن.

## بعد از دریافت تصویر

1. ابتدا آن را بدون پس‌زمینهٔ اضافه (PNG شفاف، ۱۰۲۴×۱۰۲۴) بگیرید.
2. فایل را به من بدهید یا در `src/extension/icons/` بگذارید؛ نسخه‌های ۱۶، ۳۲، ۴۸ و ۱۲۸ (`logo-16.png` … `logo-128.png`) را با اسکریپت می‌سازم و دوباره بسته‌ها را می‌سازم.
3. برای فروشگاه کروم یک آیکن ۱۲۸×۱۲۸ لازم است (با ۱۶ پیکسل حاشیهٔ شفاف داخلی اگر بخواهید دقیق‌ترین رعایت راهنما را داشته باشید).
