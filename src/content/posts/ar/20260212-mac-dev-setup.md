---
title: "دليل شامل لإعداد بيئة التطوير الحديثة على Mac بشريحة M"
description: "دليل شامل مصمم خصيصًا لرقائق Apple Silicon (M1/M2/M3)، يغطي الأدوات الأساسية والاتصال بـ GitHub وسير عمل التطوير الموحد"
category: "startup"
tags:
  - "innovation"
  - "management"
pubDate: 2026-02-12
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260212-mac-github.avif"
heroImageAlt: "إعداد بيئة التطوير Mac"
heroImageWidth: 5632
heroImageHeight: 3072
draft: false
featured: false
locale: ar
---

# دليل شامل لإعداد بيئة التطوير الحديثة على Mac بشريحة M

هذا دليل شامل مصمم خصيصًا لرقائق Apple Silicon (M1/M2/M3). يغطي ليس فقط تثبيت الأدوات الأساسية، بل يعالج أيضًا نقاط الألم مثل مشاكل الاتصال بـ GitHub وحظر نصوص البناء الأصلية في بيئات التطوير.



## المرحلة الأولى: إعداد بيئة التطوير الأساسية

على رقائق سلسلة M، يعد محاذاة المسارات والبنى أمرًا حاسمًا للاستقرار.

### 1. تثبيت Homebrew (مدير الحزم)

على Apple Silicon، يتم تثبيت Homebrew افتراضيًا في `/opt/homebrew`.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**تكوين متغيرات البيئة:**

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### 2. تثبيت fnm (مدير إصدارات Node.js)

يدعم `fnm` ARM64 بشكل أصلي وهو حاليًا أفضل مدير Node لنظام macOS من حيث الأداء.

```bash
brew install fnm
```

أضف ما يلي إلى `~/.zshrc` للتبديل التلقائي بين إصدارات Node عند الدخول إلى أدلة المشاريع:

```bash
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
source ~/.zshrc
```

### 3. تثبيت pnpm (مدير الحزم الأساسي)

يوصى بالتثبيت بشكل منفصل عبر Homebrew مع التكوين العالمي المحسّن:

```bash
brew install pnpm
pnpm setup
source ~/.zshrc
```

**التحسين الرئيسي:** السماح بتشغيل نصوص بناء الوحدات الأصلية (مثل Gemini CLI و Sharp وما إلى ذلك) تلقائيًا لتجنب أخطاء التجميع على رقائق M:

```bash
pnpm config set -g ignore-scripts false
```

------

## المرحلة الثانية: الاتصال الآمن بـ GitHub والت tunneling الشبكي

حل مشاكل مهلة الاتصال أو إعادة التعيين الشائعة عبر SSH-over-HTTPS (المنفذ 443) باستخدام أدوات الوكيل.

### 1. تكوين الهوية العالمية

استبدل العناصر النائبة أدناه بمعلومات GitHub الخاصة بك:

```bash
git config --global user.name "<your_username>"
git config --global user.email "<your_email@example.com>"
git config --global init.defaultBranch main
```

### 2. إنشاء مفتاح ED25519

```bash
ssh-keygen -t ed25519 -C "<your_email@example.com>"
```

قم بتشغيل `cat ~/.ssh/id_ed25519.pub` وأضف المحتوى إلى [إعدادات SSH في GitHub](https://github.com/settings/keys).

### 3. كتابة ملف تكوين SSH "عالمي"

قم بتحرير `~/.ssh/config` للتأكد من مرور حركة المرور عبر منفذ الوكيل المخصص (المثال يستخدم 7897):

```
Host github.com
  HostName ssh.github.com
  Port 443
  User git
  IdentityFile ~/.ssh/id_ed25519
  AddKeysToAgent yes
  UseKeychain yes
  # الإجبار عبر الوكيل المحلي (عدّل المنفذ حسب أداة الوكيل الخاصة بك)
  ProxyCommand nc -X 5 -x 127.0.0.1:7897 %h %p
```

**تصحيح الأذونات:**

```bash
chmod 600 ~/.ssh/config
```

------

## المرحلة الثالثة: سير عمل التطوير الموحد

بمجرد أن يكون البيئة جاهزة، يؤدي اتباع سير عمل موحد إلى تحسين كفاءة التعاون والصيانة بشكل كبير.

### 1. التحقق من البيئة

بعد الدخول إلى دليل المشروع، تحقق من محاذاة البيئة بشكل صحيح:

```bash
node -v && pnpm -v
```

### 2. إدارة التبعيات

مع تمكين تنفيذ البرامج النصية، تكمل الوحدات الأصلية التجميع المحلي تلقائيًا أثناء التثبيت:

```bash
pnpm install
```

### 3. الالتزامات التقليدية

نوصي باستخدام مواصفات **Conventional Commits** للحفاظ على سجل التزامات واضح:

- `feat:` ميزة جديدة
- `fix:` إصلاح خطأ
- `chore:` تغييرات في عملية البناء أو الأدوات المساعدة
- `docs:` تغييرات في الوثائق

**نصيحة:** يمكنك استخدام أدوات الذكاء الاصطناعي للمساعدة في إنشاء رسائل الالتزام المناسبة:

```bash
git diff --cached | <ai_tool_command> "إنشاء رسالة التزام بالإنجليزية بناءً على التغييرات"
```

### 4. الدفع والمزامنة

```bash
git pull origin main  # pull قبل push لتجنب التعارضات
git push origin main
```
