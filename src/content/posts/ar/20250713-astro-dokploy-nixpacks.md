---
title: "نشر مشاريع Astro باستخدام Dokploy و Nixpacks وتفعيل التخزين المؤقت لتحسين سرعة البناء"
description: "نشر مواقع Astro الثابتة بسرعة باستخدام Dokploy و Nixpacks، مع تفعيل آليات التخزين المؤقت بالكامل لتحسين سرعة البناء بشكل كبير. يغطي الدليل تكوين Astro، وإعدادات متغيرات البيئة في Dokploy، واستراتيجيات تحسين التخزين المؤقت في Nixpacks، وهو مناسب لممارسات النشر والتكامل المستمر للمواقع التي تعتمد على المحتوى."
category: "startup"
tags:
  - "innovation"
pubDate: 2025-07-14
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20250714082742453.avif"
heroImageAlt: "RealRip-نشر مشاريع Astro باستخدام Dokploy و Nixpacks وتفعيل التخزين المؤقت لتحسين سرعة البناء"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: ar
---

## أولاً: تكوين Dokploy

Dokploy هي منصة نشر مفتوحة المصدر وقابلة للاستضافة الذاتية، صُممت كبديل مجاني لـ Heroku و Vercel و Netlify، ومبنية على Docker و Traefik.

### 1. إنشاء مشروع جديد وربط مستودع GitHub

### 2. تعيين متغيرات البيئة

```bash
NIXPACKS_NODE_VERSION=22
NIXPACKS_PNPM_STORE_PATH=/root/.local/share/pnpm/store/v3
NIXPACKS_INSTALL_CACHE_DIRS=/app/node_modules
NIXPACKS_BUILD_CACHE_DIRS=/app/node_modules/.cache,/app/astro_cache
```

### 3. إيقاف تنظيف ذاكرة التخزين المؤقت

- خدمة المشروع → **Clean Cache**: إيقاف
- خادم الويب → **Daily Docker Cleanup**: إيقاف

---

## ثانياً: محرك البناء Nixpacks

Nixpacks هي أداة بناء مفتوحة المصدر أطلقتها Railway، تقوم ببناء الكود المصدري إلى صور Docker قياسية. يستخدم Dokploy أداة Nixpacks كمحرك بناء افتراضي، ويدعم تحديد تكوينات البناء في ملف `nixpacks.toml` أو `nixpacks.json`. قم بإنشاء ملف `nixpacks.toml` في الدليل الجذري للمشروع وقم بتكوين أدلة التخزين المؤقت ذات الصلة.

### أولوية التكوين (منخفض → مرتفع):

1. المنطق الافتراضي للمزود
2. `nixpacks.toml`
3. متغيرات البيئة
4. وسيطات CLI

### متغيرات البيئة الشائعة

| اسم المتغير                   | الوصف                              |
| :---------------------------- | :--------------------------------- |
| `NIXPACKS_INSTALL_CMD`        | أمر تثبيت مخصص                     |
| `NIXPACKS_BUILD_CMD`          | أمر بناء مخصص                      |
| `NIXPACKS_START_CMD`          | أمر بدء مخصص                       |
| `NIXPACKS_PKGS`               | تثبيت حزم Nix إضافية               |
| `NIXPACKS_APT_PKGS`           | تثبيت حزم Apt إضافية               |
| `NIXPACKS_INSTALL_CACHE_DIRS` | أدلة التخزين المؤقت لمرحلة التثبيت |
| `NIXPACKS_BUILD_CACHE_DIRS`   | أدلة التخزين المؤقت لمرحلة البناء  |
| `NIXPACKS_NO_CACHE`           | تعطيل التخزين المؤقت (غير مستحسن)  |
| `NIXPACKS_CONFIG_FILE`        | تحديد ملف التكوين                  |
| `NIXPACKS_DEBIAN`             | تمكين صورة Debian الأساسية         |

## ثالثاً: تكوين مشروع Astro

Astro هو إطار عمل ويب حديث لمواقع المحتوى، وهو مناسب بشكل خاص للمواقع الثابتة مثل المدونات وصفحات التسويق والتجارة الإلكترونية. عندما يحتوي الموقع على عدد كبير من الصور والموارد الثابتة، قد تتأثر سرعة البناء. من خلال تفعيل آليات التخزين المؤقت، يمكن تحسين كفاءة البناء بشكل كبير.

### 1. تكوين دليل نواتج التخزين المؤقت للبناء:

تحتاج مشاريع Astro إلى تحديد دليل للتخزين المؤقت في ملف التكوين لإعادة استخدام نواتج البناء السابقة في عمليات البناء اللاحقة. سيتم استخدام الملفات الموجودة في هذا الدليل في عمليات البناء اللاحقة لتسريع وقت البناء.
يمكن أن تكون هذه القيمة مساراً مطلقاً أو مساراً نسبياً.

```js
//`astro.config.mjs`
export default defineConfig({
  cacheDir: "./astro_cache",
});
```

---

### 2. ملف تكوين التخزين المؤقت لـ Nixpacks

قم بإنشاء ملف `nixpacks.toml` في الدليل الجذري لمشروع Astro، وقم بتكوين أدلة التخزين المؤقت وأوامر البناء.

```toml
# استخدام إصدارات Node.js و pnpm المحددة
[phases.setup]
nixPkgs = ["nodejs_22", "pnpm"]

# تثبيت التبعيات وتفعيل تخزين pnpm المؤقت
[phases.install]
cmds = ["pnpm install --frozen-lockfile"]
cacheDirectories = ["/root/.local/share/pnpm/store/v3"]

# بناء مشروع Astro وتخزين node_modules/.cache و astro_cache مؤقتاً
[phases.build]
cmds = ["pnpm run build"]
cacheDirectories = [
  "node_modules/.cache",
  "astro_cache"
]

# أمر البدء (أنت تستخدم NGINX لتقديم دليل dist الثابت، هذا مجرد عنصر نائب)
[start]
cmd = "echo 'اكتمل البناء، يرجى الوصول إلى دليل dist عبر NGINX'"
```

---

## 3. تحسين سياق بناء Docker

أضف `.dockerignore` إلى الدليل الجذري لمشروع Astro:

```
node_modules
astro_cache
dist
*.log
.DS_Store
.vscode
.env*
```

---

## رابعاً: النشر والتحقق

بعد النشر التلقائي في Dokploy، يرجى التحقق من سجلات البناء للتأكد من احتوائها على المحتوى التالي للتأكد من فعالية التخزين المؤقت:

### 1. أمر البناء استخدم التخزين المؤقت المثبت

```bash
RUN --mount=type=cache,id=xxxx-node_modules/cache,target=/app/node_modules/.cache \
    --mount=type=cache,id=xxxx-astro_cache,target=/app/astro_cache \
    pnpm run build
```

### 2. بناء Astro أعاد استخدام إدخالات التخزين المؤقت (خاصة تحسين الصور)

```bash
▶ /_astro/202409272055577_Z2smeTW.avif (reused cache entry)
▶ /_astro/202409272055575_Z2wPyJN.avif (reused cache entry)
▶ /_astro/202409272055577_1IgP6g.avif (reused cache entry)
```

✅ إذا رأيت سجلات التخزين المؤقت المثبتة أعلاه ونص "reused cache entry"، فهذا يعني أنه تم تفعيل آلية التخزين المؤقت بنجاح، وحقق البناء تسريعاً تزايدياً.

🎉 من علامة تبويب Deployments في مشروع Dokploy، يمكنك أيضاً رؤية أنه بدون إعدادات التخزين المؤقت، يستغرق بناء المشروع 31 دقيقة، بينما مع تفعيل إعدادات التخزين المؤقت، يستغرق الأمر 3 دقائق فقط، مما يقلل بشكل كبير من وقت البناء ويوفر حركة المرور وعرض النطاق الترددي.

## خامساً: تسريع الموقع باستخدام Tencent EdgeOne

## الخلفية: "المثلث المستحيل" للنقل عبر الحدود

نشر الخوادم في سنغافورة. هذا الحل فعال من حيث التكلفة ولا يتطلب عمليات تسجيل معقدة، ولكن بالنسبة للمستخدمين في البر الرئيسي للصين، غالباً ما تواجه تجربة الوصول تحديات كبيرة:

1. **زمن انتقال فيزيائي مرتفع**: يتراوح RTT (وقت الذهاب والإياب) من سنغافورة إلى البر الرئيسي للصين عادةً بين 50 مللي ثانية - 200 مللي ثانية.
2. **فقدان حزم شديد**: بسبب تداخل جدار الحماية العظيم (GFW)، غالباً ما تنتهي مهلة مصافحات TCP، مما يتسبب في توقف تحميل الصور في المنتصف (معلق).
3. **تأخر الانتقال**: تتطلب التطبيقات متعددة الصفحات فترات انتظار طويلة بشاشة بيضاء عند النقر على الروابط.

لحل هذه المشكلة، استخدمنا **Tencent Cloud EdgeOne** بالاشتراك مع تكوين **Traefik** الدقيق لإنشاء "ضربة مركبة"، مما يحقق تجربة فتح فورية قريبة من المواقع المسجلة محلياً.

### فكرة البنية الأساسية

تتمحور استراتيجية التحسين لدينا حول ثلاث كلمات رئيسية: **مكافحة فقدان الحزم**، **تفريغ الضغط**، و **التخزين المؤقت الطبقي**.

1. **طبقة البروتوكول (EdgeOne)**: الاستفادة من بروتوكول **HTTP/3 (QUIC)** القائم على خصائص UDP لحل انقطاعات تحميل المحتوى الناتجة عن فقدان حزم TCP عبر الحدود بشكل كامل.
2. **طبقة النقل (Traefik -> EdgeOne)**: إيقاف ضغط المصدر في Traefik، والسماح لعقد حافة EdgeOne بتولي مسؤولية ضغط **Brotli** الذكي الأكثر كفاءة لتقليل حجم النقل.
3. **طبقة التخزين المؤقت (الاستراتيجية)**: استخدام `s-maxage` لتحقيق الفصل بين "تخزين CDN المؤقت طويل الأمد" و "تخزين المتصفح المؤقت قصير الأمد"، مما يضمن معدل إصابة CDN وتوقيت تحديث المحتوى.

### أولاً: التكوين العالمي لـ EdgeOne (تفعيل وضع "مكافحة فقدان الحزم")

على الرغم من أن EdgeOne لا يمكنه توفير عقد محلية للنطاقات غير المسجلة، إلا أن خطوط عقد الحافة الخاصة به (هونج كونج/سنغافورة) إلى الخطوط المحلية محسّنة وتدعم بروتوكول QUIC، وهو المفتاح لحل "تأخر الشبكة".

ادخل إلى وحدة تحكم EdgeOne -> **تسريع الموقع** -> **تكوين الميزات**:

### 1. تفعيل HTTP/3 (QUIC) ✅

هذه هي الخطوة الأكثر أهمية. في الشبكات عبر الحدود ذات معدلات فقدان الحزم العالية، يمكن لبروتوكول QUIC تجنب حجب رأس الخط في TCP بشكل فعال. بعد التفعيل، ستختفي ظاهرة "دوران" الصور أو "التحميل النصفي" تماماً.

### 2. تفعيل الضغط الذكي (Brotli + Gzip) ✅

يوصى بتفعيل كل من Brotli و Gzip. سيعطي EdgeOne الأولوية لإرجاع تنسيق **Brotli (`br`)** للمتصفحات المدعومة، والذي يتميز بمعدل ضغط أعلى بنسبة 15%-20% من Gzip. كلما كان الحجم أصغر، كان المرور عبر الجدار أسرع.

### 3. تفعيل التحديث المسبق للتخزين المؤقت (90%) ✅

اضبط نسبة التحديث المسبق على **90%**. هذا يعني أنه في آخر 10% من الوقت قبل انتهاء صلاحية التخزين المؤقت، سيعود CDN بشكل غير متزامن إلى المصدر للتحديث. لن يواجه المستخدمون أبداً تأخيراً ناتجاً عن "انتهاء صلاحية التخزين المؤقت مما يؤدي إلى العودة للمصدر"، مما يحقق تجربة إصابة بنسبة 100%.

## ثانياً: تحسين تكوين Traefik (استراتيجية المصدر)

نحتاج إلى تعديل `dynamic_conf.yml` في Traefik (أو تسميات Docker) للقيام بأمرين: **تفريغ الضغط** و **حقن رؤوس تخزين مؤقت دقيقة**.

### 1. تعطيل ضغط المصدر

يرجى التحقق من تكوين Routers الخاص بك و **إزالة** جميع البرمجيات الوسيطة لـ `compress` (Gzip).

- **السبب**: EdgeOne مسؤول بالفعل عن ضغط Brotli. القيام بـ Gzip في المصدر مرة أخرى سيهدر وحدة المعالجة المركزية وقد يسبب مشاكل ضغط مزدوج.

### 2. تعريف استراتيجية التخزين المؤقت الطبقي (الكود الأساسي)

هذا هو الجوهر لحل التناقض بين "عدم رؤية المستخدمين للمحتوى الجديد بعد نشر المقالات" و "سرعة العودة المباشرة للمصدر بطيئة جداً".

نحدد برمجية وسيطة مخصصة لصفحات HTML في Traefik:

```yaml
http:
  routers:
    # فرض إعادة توجيه HTTPS
    idimi-uygy0r-redirect-https:
      entryPoints:
        - web
      rule: Host(`realrip.com`)
      middlewares:
        - idimi-uygy0r-to-https
      service: noop@internal
      priority: 1000

    # Service Worker (PWA Core) - لا ضغط، يتعامل معه EdgeOne
    idimi-uygy0r-sw:
      rule: >
        Host(`realrip.com`) &&
        ( Path(`/service-worker.js`) || Path(`/sw.js`) )
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-no-store
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 900

    # موارد Astro الثابتة الأساسية (بصمة Hash) - لا ضغط، يتعامل معه EdgeOne
    idimi-uygy0r-static-immutable:
      rule: >
        Host(`realrip.com`) &&
        ( PathPrefix(`/_astro`) || PathPrefix(`/assets`) )
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-static-immutable
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 800

    # ملفات Pagefind WASM - لا ضغط، يتعامل معه EdgeOne
    idimi-uygy0r-pagefind-wasm-ctype:
      rule: >
        Host(`realrip.com`) &&
        PathRegexp(`^/pagefind/.*\\.wasm$`)
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-set-wasm-ctype
        - idimi-uygy0r-cache-static-immutable
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 760

    # ملفات فهرس Pagefind - لا ضغط، يتعامل معه EdgeOne
    idimi-uygy0r-pagefind-immutable:
      rule: >
        Host(`realrip.com`) &&
        PathPrefix(`/pagefind`)
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-static-immutable
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 750

    # Sitemap / Robots / RSS - لا ضغط، يتعامل معه EdgeOne
    idimi-uygy0r-meta-short:
      rule: >
        Host(`realrip.com`) &&
        ( Path(`/sitemap.xml`) ||
          Path(`/robots.txt`) ||
          Path(`/sitemap-index.xml`) ||
          Path(`/atom.xml`) || Path(`/rss.xml`) || Path(`/feed.xml`) )
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-short
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 700

    # Manifest - لا ضغط، يتعامل معه EdgeOne
    idimi-uygy0r-manifest:
      rule: >
        Host(`realrip.com`) &&
        ( Path(`/manifest.webmanifest`) ||
          Path(`/site.webmanifest`) ||
          Path(`/browserconfig.xml`) )
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-1d
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 650

    # ملفات ثابتة أخرى (صور/فيديو إلخ) - لا ضغط، يتعامل معه EdgeOne
    idimi-uygy0r-public-30d:
      rule: >
        Host(`realrip.com`) &&
        PathRegexp(`.+\\..+`)
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-30d-swr
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 600

    # صفحات HTML (قاعدة احتياطية) - لا ضغط، يتعامل معه EdgeOne
    # تم تطبيق استراتيجية الفصل s-maxage=3600
    idimi-uygy0r-pages:
      rule: Host(`realrip.com`)
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-html
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 100

  services:
    idimi-uygy0r-app:
      loadBalancer:
        servers:
          - url: http://idimi-idimi-uygy0r:80
        passHostHeader: true

  middlewares:
    idimi-uygy0r-to-https:
      redirectScheme:
        scheme: https
        permanent: true

    # --- تم الاحتفاظ بتعريف برمجية الضغط الوسيطة ولكن لم يتم استدعاؤها (تمت إزالتها من Routers) ---
    idimi-uygy0r-gzip-compress:
      compress:
        minResponseBodyBytes: 1024
        excludedContentTypes:
          - "image/png"
          - "image/jpeg"
          - "image/gif"
          - "image/webp"
          - "image/avif"
          - "font/*"

    idimi-uygy0r-security-headers:
      headers:
        addVaryHeader: true
        stsSeconds: 31536000
        stsIncludeSubdomains: true
        stsPreload: true
        contentTypeNosniff: true
        browserXssFilter: true
        referrerPolicy: "strict-origin-when-cross-origin"
        permissionsPolicy: "geolocation=(), microphone=(), camera=()"
        frameDeny: true
        customResponseHeaders:
          Timing-Allow-Origin: "*"

    idimi-uygy0r-no-store:
      headers:
        customResponseHeaders:
          Cache-Control: "no-cache, no-store, must-revalidate"

    idimi-uygy0r-cache-short:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=600, stale-while-revalidate=600"
          Vary: "Accept-Encoding"

    idimi-uygy0r-cache-1d:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=86400, stale-while-revalidate=86400"
          Vary: "Accept-Encoding"

    idimi-uygy0r-cache-30d-swr:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=2592000, stale-while-revalidate=604800"
          Vary: "Accept-Encoding"

    idimi-uygy0r-cache-static-immutable:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=31536000, immutable"
          Vary: "Accept-Encoding"

    # تعديل رئيسي: استراتيجية تخزين HTML المؤقت
    # المتصفح يخزن لمدة 5 دقائق (300 ثانية)، CDN يخزن لمدة 1 ساعة (3600 ثانية)
    idimi-uygy0r-cache-html:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=300, s-maxage=3600, stale-while-revalidate=600"
          Vary: "Accept-Encoding"

    idimi-uygy0r-set-wasm-ctype:
      headers:
        customResponseHeaders:
          Content-Type: "application/wasm"
```

**شرح التكوين:**

- **`s-maxage=3600`**: هذا توجيه مكتوب خصيصاً لـ CDN. يرى EdgeOne هذا ويخزن صفحة HTML مؤقتاً لمدة ساعة واحدة.
- **`max-age=300`**: عندما يرسله EdgeOne إلى المستخدم، فإنه يزيل `s-maxage`، ويرى متصفح المستخدم 300 ثانية فقط (5 دقائق).
- **التأثير**: يتحمل CDN حركة المرور لمدة ساعة واحدة، بينما يحتاج المستخدمون فقط إلى الانتظار لمدة 5 دقائق لرؤية المقالات المنشورة حديثاً.

## ثالثاً: محرك قواعد EdgeOne

نظراً لهيكل URL الخاص بـ Astro (بدون لاحقة) وخدمة الصور الديناميكية (`/_image`)، هناك حاجة إلى قواعد دقيقة لإصابة ذاكرة التخزين المؤقت.

في **محرك قواعد** EdgeOne، قم بتكوين القواعد التالية بصرامة **بالترتيب**:

### القاعدة 1: موارد Astro الثابتة الأساسية (تخزين مؤقت دائم)

أصول Astro، ونواتج البناء، وخدمة الصور الديناميكية، والمحتوى الذي لا يتغير أبداً أو يستهلك وحدة المعالجة المركزية بشكل كبير، يجب تخزينه مؤقتاً بالقوة.

- **شرط المطابقة**: `URL Path` -> `مطابقة Regex`
- **قيمة المطابقة**: `^/(_astro|assets|pagefind|_image)/`
- _ملاحظة: تمت إضافة `_image` هنا، خصيصاً لتحسين الصور الديناميكية المحسنة التي تم إنشاؤها بواسطة مكون `<Image />` في Astro._
- **الإجراء**:
  - تخزين العقدة المؤقت: **365 يوماً** (فرض)
  - تخزين المتصفح المؤقت: **365 يوماً**

### القاعدة 2: الملفات الثابتة العادية

- **شرط المطابقة**: `لاحقة الملف` تساوي `png, jpg, jpeg, webp, css, js`، إلخ.
- **الإجراء**: تخزين العقدة المؤقت **30 يوماً** (فرض).

### القاعدة 3: Service Worker (PWA Core)

- **شرط المطابقة**: `URL Path` يساوي `/sw.js` أو `/service-worker.js`.
- **الإجراء**: تخزين العقدة المؤقت **1 ساعة** (فرض).
- _تحذير: لا تقم بالتخزين المؤقت لفترة طويلة جداً، وإلا فلن يتم تحديث PWA في الوقت المناسب بعد الإصدار._

### القاعدة 4: قاعدة احتياطية (صفحات HTML)

- **شرط المطابقة**: (لا يوجد شرط / مطابقة جميع الطلبات المتبقية)
- **الإجراء**:
  - تخزين العقدة المؤقت: **اتباع المصدر** (أي قراءة `s-maxage=3600` من Traefik).
  - تخزين المتصفح المؤقت: **اتباع المصدر** (أي قراءة `max-age=300` من Traefik).

## رابعاً: تحسين مستوى كود Astro (تسريع محسوس)

لجعل انتقالات الصفحة سلسة مثل "التطبيقات الأصلية" والقضاء تماماً على انتظار الشاشة البيضاء أثناء الانتقال، نحتاج إلى الاستفادة من **Client Router (سابقاً View Transitions)** في Astro.

### 1. تفعيل Client Router

أضف في `<head>` لـ `src/layouts/MainLayout.astro`:

```js
import { ClientRouter } from 'astro:transitions';

<head>
  <!-- علامات meta أخرى -->
  <ClientRouter />
</head>
```

### 2. تفعيل التحميل المسبق (Prefetch)

قم بتكوين استراتيجية التحميل المسبق في `astro.config.mjs`:

```js
export default defineConfig({
  // 'viewport': التنزيل عند دخول الرابط إلى إطار العرض (موازنة حركة المرور والسرعة)
  // 'load': تنزيل جميع الروابط فور تحميل الصفحة (سرعة قصوى، لكن يستهلك عرض النطاق الترددي)
  prefetch: {
    defaultStrategy: "viewport",
  },
  // ...
});
```
