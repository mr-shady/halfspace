# Privacy Policy for Otomatn / سیاست حریم خصوصی اتومتن

**Effective date:** October 27, 2026 · **Developer:** Reza Nemati — [reza-nemati.ir](https://reza-nemati.ir)

## English

Otomatn ("the extension") is a Persian text editor and proofreader. **It does not collect, store remotely, share, or sell any personal data.**

* **100% local processing:** Your text is processed entirely inside your browser. It is never sent to any server, database, or third party.
* **No analytics, no tracking, no accounts, no remote code.**
* **Local storage only:** `chrome.storage.local` holds (a) your preferences (edit level, enabled rules, theme) and (b) a short-lived copy of selected text used to open the large editor window, which is deleted as soon as the window reads it.

### Permissions and why they are needed

| Permission | Reason |
|---|---|
| `activeTab` | Read the text you have selected on the current tab, and write the corrected text back — only after you click the toolbar icon, use the context menu, or press the shortcut. |
| `scripting` | Inject the small helper script that reads/replaces the selection on that tab (only with `activeTab`, on your action). |
| `contextMenus` | Adds the "Fix with Otomatn" items to the right-click menu. |
| `storage` | Saves your preferences locally. |

The extension does **not** request access to all websites (`<all_urls>`), browsing history, cookies, or the clipboard.

## فارسی

اتومتن هیچ داده‌ای را **جمع‌آوری، ارسال، ذخیرهٔ آنلاین یا فروش نمی‌کند**.

* تمام پردازش‌ها **درون مرورگر** شما انجام می‌شود؛ متن هرگز به سرور یا شخص ثالثی ارسال نمی‌شود.
* هیچ آنالیتیکس، ردیاب، حساب کاربری یا کد راه‌دور وجود ندارد.
* فقط تنظیمات شما (سطح ویرایش، قانون‌های فعال، تم) به‌صورت **محلی** ذخیره می‌شود؛ همچنین نسخه‌ای موقت از متن انتخابی برای باز کردن پنجرهٔ بزرگ، که بلافاصله پس از خوانده‌شدن پاک می‌شود.
* دسترسی `activeTab` و `scripting` فقط پس از کنش شما (کلیک روی آیکون، راست‌کلیک یا میان‌بر) و فقط روی همان زبانه فعال می‌شود. افزونه به همهٔ سایت‌ها، تاریخچه، کوکی‌ها و کلیپ‌بورد دسترسی ندارد.

## Changes / تغییرات

Any change to this policy will be published in this file. / هر تغییر در همین فایل منتشر می‌شود.

## Contact / تماس

[reza-nemati.ir](https://reza-nemati.ir) · reza.shady@gmail.com · [GitHub](https://github.com/mr-shady/halfspace/issues)
