---
title: "دليل تحديث التبعيات التلقائي باستخدام Renovate"
description: "استخدام Renovate لتحقيق تحديث تلقائي كامل لتبعيات مستودع GitHub دون تدخل يدوي"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-06
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260206-renovate-guide.avif"
heroImageAlt: "تحديث التبعيات التلقائي باستخدام Renovate"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: ar
---

## مقدمة

صيانة تبعيات المشاريع هي جزء من العمل اليومي للمطورين. التحقق والتحديث والاختبار اليدوي لإصدارات التبعيات يستغرق وقتًا طويلاً ويؤدي إلى إهمال. يشرح هذا المقال كيفية استخدام **Renovate** لتحقيق تحديث تلقائي كامل للتبعيات.

## الأهداف

- التحقق التلقائي من تحديثات التبعيات يوميًا عند الفجر
- إنشاء طلبات سحب تلقائيًا ودمجها (بعد اجتياز فحص CI)
- عدم الحاجة إلى تدخل يدوي، العمل في الخلفية
- إدارة موحدة عبر مستودعات متعددة

## تثبيت Renovate

1. قم بزيارة [GitHub Apps - Renovate](https://github.com/apps/renovate)
2. انقر فوق **تثبيت**
3. اختر المستودعات التي تريد تمكينها (يمكن اختيار الكل أو محددة)
4. أكمل التفويض

## ملف التكوين

أنشئ `renovate.json` في جذر المستودع:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    ":automergeAll",
    ":disableDependencyDashboard"
  ],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
```

الالتزام والدفع:

```bash
git add renovate.json
git commit -m "chore: configure Renovate for automated dependency updates"
git push
```

## تفاصيل التكوين

| الخيار | الوصف |
|--------|-------|
| `config:recommended` | التكوين الأساسي الموصى به رسميًا من Renovate |
| `:automergeAll` | **الخيار الأساسي** — الدمج التلقائي لجميع التحديثات (بما في ذلك الإصدارات الرئيسية) |
| `:disableDependencyDashboard` | تعطيل لوحة تحكم المشكلات للعمل في الخلفية |
| `timezone` | تعيين المنطقة الزمنية إلى آسيا/شنغهاي |
| `schedule` | تشغيل الفحوصات قبل الساعة 3:00 صباحًا يوميًا |

## سير العمل

```
3:00 صباحًا يوميًا
    ↓
Renovate يتحقق من تبعيات package.json
    ↓
تم اكتشاف تحديثات متاحة
    ↓
إنشاء طلب سحب تلقائيًا
    ↓
تشغيل فحوصات CI
    ↓
اجتياز CI → الدمج التلقائي إلى فرع main
    ↓
رؤية التبعيات المحدثة في الصباح التالي
```

## تكوين متعدد المستودعات

للمشاريع المتعددة، انسخ نفس ملف التكوين:

```bash
# إنشاء تكوين عالمي
cat > renovate.json << 'EOF'
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended", ":automergeAll", ":disableDependencyDashboard"],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
EOF

# تطبيق على مستودعات متعددة
for repo in repo1 repo2 repo3; do
  cp renovate.json $repo/
  cd $repo && git add . && git commit -m "chore: configure Renovate" && git push
  cd ..
done
```

## الأسئلة الشائعة

### طلب السحب لا يتم دمجه تلقائيًا؟

تحقق من حالة CI. يقوم Renovate بالدمج فقط بعد اجتياز جميع فحوصات CI. إذا فشل CI، أصلح المشكلة يدويًا وأعد التشغيل.

### كيفية تشغيل التحديثات على الفور؟

- إذا كانت لوحة التحكم ممكّنة: انتقل إلى Issues → Dependency Dashboard → حدد الحزم للتحديث → انقر فوق Rebase
- أو انتظر وقت الجدولة المحدد للتشغيل التلقائي

### كيفية استبعاد تبعيات محددة؟

أضف قواعد الاستبعاد في التكوين:

```json
{
  "packageRules": [{
    "matchPackageNames": ["package-name"],
    "enabled": false
  }]
}
```

### دعم pnpm / yarn / npm؟

يقوم Renovate باكتشاف أنواع ملفات القفل تلقائيًا، لا حاجة لتكوين إضافي.

## التحقق

بعد دفع التكوين، سيعمل Renovate تلقائيًا (أو ينتظر وقت الجدولة). خطوات التحقق:

1. انتقل إلى صفحة **طلبات السحب** في المستودع
2. عرض طلبات السحب التي أنشأها Renovate (تنسيق العنوان: `chore(deps): update ...`)
3. تأكد من تمكين الدمج التلقائي للطلب
4. الدمج التلقائي بعد اجتياز CI

## الملخص

فقط 5 أسطر من التكوين الأساسي:

```json
{
  "extends": [
    "config:recommended",
    "automergeAll",
    "disableDependencyDashboard"
  ],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
```

تحقيق إدارة تلقائية كاملة للتبعيات، مما يسمح للمطورين بالتركيز على كود العمل.
