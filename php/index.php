<?php
function actual_link($withQuery = TRUE)
{
    $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? 'https' : 'http';
    $uri      = $protocol . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    return $withQuery ? $uri : str_replace('?' . $_SERVER['QUERY_STRING'], '', $uri);
}
?>
<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css" integrity="sha384-dpuaG1suU0eT09tx5plTaGMLBsfDLzUCCUXOY2j/LSvXYuG6Bqs43ALlhIqAJVRb" crossorigin="anonymous">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap" rel="stylesheet">
    <title>
        اصلاح نیم فاصله
    </title>
  </head>
  <body>
    <style>
        body{
            font-family: 'Vazirmatn';
        }

    </style>
    <script>
        function sanitizeString(string) {
            string = string.trim();
            return string;
        }
        function fix(){
            document.querySelector('.mybtn').disabled = true;
            const apiUrl = '<?= actual_link(false) ?>api.php';

            // Example input string
            const inputString = document.querySelector('.mainContent').innerHTML;

            // Sanitize the input string
            const sanitizedString = sanitizeString(inputString);

            // Define the POST data
            const postData = new URLSearchParams();
            postData.append('string', sanitizedString);

            // Send the POST request
            fetch(apiUrl, {
                method: 'POST',
                body: postData,
            })
            .then(response => {
                // Check if the response is successful
                if (response.ok) {
                    // Parse the JSON response
                    return response.json();
                } else {
                    // Throw an error if the response is not successful
                    throw new Error('Network response was not ok.');
                }
            })
            .then(data => {
                // Handle the response data
                document.querySelector('.mainContent').innerHTML = data.string;
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
            });
            document.querySelector('.mybtn').disabled = false;
        }
    </script>
  <nav class="navbar sticky-top navbar-expand-lg bg-primary" id="navbar-example" data-bs-theme="dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">نیم/فاصله</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="nav nav-pills me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" href="#online">اصلاح آنلاین</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#about">درباره</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#api">API</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="https://github.com/mr-shady/halfspace">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
            </svg>
          </a>
        </li>
       
      </ul>
    </div>
  </div>
</nav>
    <div class="container" data-bs-spy="scroll" data-bs-target="#navbar-example" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" class="scrollspy-example" tabindex="0">
        <div class="card my-3" id="online">
            <div class="card-header">
            اصلاح آنلاین نیم‌فاصله
            </div>
            <div class="card-body">
                <p>
                    متن خودتون رو این پایین Paste کنید و روی دکمه اصلاح کلیک کنید:
                </p>
                <div class="bg-light rounded p-4 mainContent" placeholder="متن شما" style="height:400px;" contentEditable="true"></div>
            
                <button type="button" onclick="fix();" class="btn btn-primary w-100 mt-1 mybtn">اصلاح</button>
            </div>
        </div>
        <div class="card my-3" id="about">
            <div class="card-header">
                درباره
            </div>
            <div class="card-body">
                این کلاس به شما کمک می‌کنه تا در متون فارسی خودتون نیم‌فاصله رو اصلاح کنید. این پروژه به صورت کاملاً اوپن سورس هست و اگر دوست داشتید می‌تونید در توسعه اون با من مشارکت داشته باشید.
                <br />
                <strong>قابلیت‌ها</strong>
                <ul>
                    <li>اصلاح فاصله قبل و بعد .,،:؛;?!؟</li>
                    <li>ی اضافه در کلماتی همانند: جمله‌ی، برنامه‌ی، فاصله‌ی و غیره.</li>
                    <li>ها جمع در کلماتی مانند: درخت‌ها، کتاب‌ها، خانه‌ها، بانک‌های، تفنگ‌های و غیره.</li>
                    <li>پسوندهایی که پس از برخی افعال مختلف می‌آیند مانند: رفته‌ام، آمده‌اند، گرفته‌ای، خوانده‌اند و غیره.</li>
                    <li>پیشوندهایی که قبل از برخی افعال می‌آیند: می‌توانم، می‌رود، می‌نوشید، می‌خوابند، نمی‌خرند، نمی‌آیند، نمی‌خوری، نمی‌شود و غیره.</li>
                    <li>در برخی مصدرها مانند: گل‌گفتن، گل‌شنیدن ( نیاز به توسعه و تکمیل دارد)</li>
                    <li>برخی کلمات خاص مانند: نیم‌فاصله، بی‌کلام (نیاز به توسعه و تکمیل)</li>
                </ul>
                <br />
                <div class="alert alert-warning">
                    <strong>رفع مسئولیت</strong> ممکنه بعضی از از کلمات به درستی اصلاح نشه و یا بعد از اصلاح اگر با قالب html متن رو کپی کردید، قالب کمی به هم بریزه. پس بعد از اصلاح یک بار متن رو بررسی کنید.
                </div>
                <div class="alert alert-warning">
                    <strong>رفع مسئولیت</strong> هیچ متنی بر روی سرور ذخیره نمیشه و هیچ ردپایی از شما در سیستم ثبت نخواهد شد.
                </div>
                <div class="alert alert-info">
                    فونت صفحه: 
                    "<a href="https://fonts.google.com/specimen/Vazirmatn">وزیر متن</a>"
                    به یاد مرحوم صابر راستی کردار
                    <br />
                    همچنین #یوسف_قبادی و #سگارو رو فراموش نکنیم 
                
                </div>
                
            </div>
        </div>
        <div class="card  my-3" id="api">
            <div class="card-header">
                API
            </div>
            <div class="card-body">
                یک درخواست POST به آدرس زیر ارسال کنید. در body درخواست متن خودتون رو به نام <code>string</code> ارسال کنید<br />
                مثال: 
<code style="direction: ltr;">
<pre>
    {
        string: "متن برای اصلاح نمی فاصله می باشد !"
    }
</pre>
</code>
                <code class="bg-dark text-white rounded p-2 d-block w-100 text-end"><?= actual_link(false) ?>api.php</code>
                <br />
                در پاسخ به درخواست بالا اگر همه چیز درست باشه پاسخ زیر رو دریافت می کنید.<br />
<code style="direction: ltr;">
<pre>
    {
        string: "متن برای اصلاح نمی‌فاصله می‌باشد!"
    }
</pre>
</code>
<br />
در صورت بروز خطا پاسخ به صورت زیر خواهد بود.<br />
<code style="direction: ltr;">
<pre>
    {
        error: "String parameter is missing"
    }
</pre>
</code>
            </div>
        </div>

    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
  </body>
</html>
