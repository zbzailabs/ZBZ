---
title: "تفعيل خلفية ذاكرة QMD لـ OpenClaw على أجهزة Mac بمعالج Apple Silicon"
description: "دليل مفصل لتكوين خلفية ذاكرة QMD لـ OpenClaw على أجهزة Mac من سلسلة M، مع خطوات كاملة وتوصيات الاختيار"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-07
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260207-openclaw-qmd-guide.avif"
heroImageAlt: "توضيح لبرنامج تعليمي حول تكوين OpenClaw QMD"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: ar
---

> ⚠️ **توصية الاختيار**: توثق هذه المقالة عملية تكوين QMD. ومع ذلك، بناءً على التقييم العملي، **فإن الفهرس المدمج في OpenClaw كافٍ لمعظم السيناريوهات**. يتطلب QMD ذاكرة إضافية بحجم ~600 ميجابايت وصيانة أكثر تعقيدًا. يرجى اتخاذ قرار بتفعيله بناءً على احتياجاتك الفعلية (مثل الحاجة إلى العمل دون اتصال بالإنترنت تمامًا أو متطلبات عالية للغاية لجودة البحث).

تشرح هذه المقالة كيفية تكوين خلفية ذاكرة QMD (Query Markdown Database) لـ OpenClaw على أجهزة Mac بمعالج Apple Silicon (M1/M2/M3/M4)، مما يتيح البحث الهجين باستخدام BM25 + المتجه + إعادة الترتيب.

## المتطلبات الأساسية

- macOS 14+ (Sonoma / Sequoia)
- OpenClaw 2026.2.3-1 أو أحدث
- Homebrew (لتثبيت SQLite)

## الخطوة 1: تثبيت Bun

يعتمد QMD على بيئة تشغيل Bun. قم أولاً بتثبيت Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

التحقق من التثبيت:
```bash
~/.bun/bin/bun --version
# المخرج: 1.3.8
```

## الخطوة 2: تثبيت SQLite (مع دعم الإضافات)

يتطلب QMD SQLite مع دعم الإضافات:

```bash
brew install sqlite
```

## الخطوة 3: تثبيت QMD

قم بتثبيت QMD عالميًا باستخدام Bun:

```bash
~/.bun/bin/bun install -g https://github.com/tobi/qmd
```

التحقق من تثبيت QMD:
```bash
export PATH="$HOME/.bun/bin:$PATH"
qmd --version
```

## الخطوة 4: تكوين OpenClaw لاستخدام QMD

قم بتحرير ملف تكوين OpenClaw:

```bash
openclaw config edit
```

أضف أو عدّل تكوين `memory`:

```json
{
  "memory": {
    "backend": "qmd"
  }
}
```

مثال كامل للتكوين (مع معاملات اختيارية):

```json
{
  "memory": {
    "backend": "qmd",
    "citations": "auto",
    "qmd": {
      "includeDefaultMemory": true,
      "update": { 
        "interval": "5m", 
        "debounceMs": 15000 
      },
      "limits": { 
        "maxResults": 6, 
        "timeoutMs": 4000 
      }
    }
  }
}
```

## الخطوة 5: إعادة تشغيل OpenClaw

```bash
openclaw gateway restart
```

## الخطوة 6: تهيئة فهرس QMD

بعد إعادة التشغيل، سيقوم QMD تلقائيًا بإنشاء الفهرس. للتهيئة اليدوية:

```bash
# تعيين متغيرات البيئة
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"

# إنشاء المجموعة
cd ~/.openclaw/workspace
qmd collection add memory --name memory-root --mask "**/*.md"

# إنشاء تضمينات المتجهات (سيقوم بتحميل ~600 ميجابايت من النماذج في المرة الأولى)
qmd embed
```

سيقوم التشغيل الأول لـ `qmd embed` بالتنزيل التلقائي من HuggingFace:
- `embeddinggemma-300M-Q8_0.gguf` (نموذج التضمين)
- `qwen3-reranker-0.6b-q8_0.gguf` (نموذج إعادة الترتيب)
- `Qwen3-0.6B-Q8_0.gguf` (نموذج توسيع الاستعلام)

## الخطوة 7: التحقق من أن QMD يعمل

اختبر بحث الذاكرة:

```bash
openclaw memory-search "OpenClaw memory system"
```

إذا رأيت `source: "qmd//memory-root/..."`، فإن QMD نشط.

التحقق من حالة QMD:

```bash
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"
qmd status
```

## الأسئلة الشائعة

### QMD لا يعمل، لا يزال يعرض الفهرس المدمج

تحقق مما إذا كان `memory.backend` مضبوطًا على `"qmd"` في `~/.openclaw/openclaw.json`، ثم أعد تشغيل البوابة.

### فشل تنزيل النموذج

يمكن للمستخدمين في الصين تعيين مرآة HuggingFace:
```bash
export HF_ENDPOINT=https://hf-mirror.com
qmd embed
```

### ذاكرة غير كافية

يجب أن يكون لدى أجهزة Mac من سلسلة M ذاكرة لا تقل عن 8 جيجابايت. إذا تم إنهاء عملية التضمين، حاول إغلاق التطبيقات الأخرى.

## مرجع التكوين

| عنصر التكوين | الوصف | القيمة الافتراضية |
|--------------|-------|------------------|
| `memory.backend` | نوع خلفية الذاكرة | `"qmd"` |
| `memory.citations` | عرض مصادر الاقتباس | `"auto"` |
| `memory.qmd.update.interval` | فترة تحديث الفهرس | `"5m"` |
| `memory.qmd.limits.maxResults` | الحد الأقصى لعدد النتائج | `6` |
| `memory.qmd.limits.timeoutMs` | مهلة البحث | `4000` |

## الملخص

بعد تفعيل QMD، سيكون لبحث ذاكرة OpenClaw الميزات التالية:
- **البحث الكامل في النص BM25**: مطابقة دقيقة للكلمات المفتاحية والمعرفات ورموز الكود
- **البحث الدلالي المتجه**: فهم المرادفات والارتباطات المفاهيمية
- **تحسين إعادة الترتيب**: Qwen3 reranker يحسن الصلة

مقارنة بـ SQLite المدمج + Gemini Embeddings، يعمل QMD بالكامل محليًا دون الاعتماد على واجهات برمجة التطبيقات الخارجية ويوفر جودة بحث أعلى.
