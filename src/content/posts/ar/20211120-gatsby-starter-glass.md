---
title: "قالب مدونة Gatsby"
description: "هذا الموقع هو موقع ويب ثابت تم إنشاؤه باستخدام Gatsby، مرحبًا بك لتجربته."
category: "life"
tags:
  - "roam"
pubDate: 2021-11-20
heroImage: "https://cos.zbz.ai/images/202310181512144.avif"
heroImageAlt: "ZBZ-"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "ar"
---

قالب لبناء مواقع ويب ثابتة باستخدام Gatsby.

الكود المصدري موجود في **[gatsby-starter-glass](https://github.com/xiyizhou/gatsby-starter-glass)**، مرحبًا بك لتجربته.

## الميزات

- جاهز للاستخدام
- مترجم بالكامل
- يتضمن تعليقات [Waline](https://waline.js.org)
- يتضمن تحليلات Google
- تحرير Markdown

## النشر المحلي

```bash
# 1. استنساخ إلى المحلي
git clone https://github.com/xiyizhou/gatsby-starter-glass.git

# 2. cd إلى الدليل
cd gatsby-starter-glass

# 3. تثبيت التبعيات
yarn install

# 4. بدء وضع التطوير
yarn start

# 5. بناء نسخة الإنتاج
yarn  build
```

## التكوين

- تكوين معلومات الموقع، معرف تحليلات Google، وما إلى ذلك في `gatsby-config.js`.
- تكوين معلومات شريط التنقل العلوي في `src/components/header.js`.
- تكوين معلومات شريط التنقل السفلي في `src/components/footer.js`.

- تكوين معلومات Waline في `src/components/comment.js`.

## نشر المقالة

### منشورات المدونة

تقع منشورات المدونة في `content/blog`. القالب كما يلي:

```md
---
title: تثبيت مكون تعليق Waline لـ Gatsby
date: 2021-11-17 08:08
slug: gatsby-waline
category: حياة
tags:
  - حياة
description: نظرًا لأن Waline ليس لديه مكون Gatsby بعد، أضف وظيفة تعليق Waline إلى موقع Gatsby عن طريق تثبيت مكتبة عميل Waline، وإنشاء مكون React، وإدخال المكون في الموقع المناسب.
---

Gatsby هو إطار عمل لبناء مواقع ويب ثابتة يعتمد على react، والذي يمكن استخدامه لنشر المتاجر عبر الإنترنت والمواقع الرسمية والمدونات. باستخدام المكونات الإضافية الغنية، يمكن تحقيق وظائف مثل التحميل الكسول للصور، ودعم مستندات Markdown، وتعليقات الزوار. تشمل أنظمة التعليقات الموصى بها رسميًا من قبل Gatsby Disqus و Gitalk وما إلى ذلك.
```

### الصفحات

يقع محتوى الصفحة في `content/pages`.

## ملاحظات

- يعتمد هذا المبدئ على Gatsby V3، انتبه لتوافق الإصدار عند تثبيت المكونات الإضافية.
- الإطار الرئيسي مترجم من [gatsby-starter-glass](https://github.com/yinkakun/gatsby-starter-glass)، شكرًا لـ [yinkakun](https://github.com/yinkakun).
