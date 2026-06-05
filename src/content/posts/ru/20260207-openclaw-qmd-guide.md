---
title: "Включение бэкенда памяти QMD для OpenClaw на Mac с Apple Silicon"
description: "Подробное руководство по настройке бэкенда памяти QMD для OpenClaw на Mac серии M с полными шагами и рекомендациями по выбору"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-07
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260207-openclaw-qmd-guide.avif"
heroImageAlt: "Иллюстрация руководства по настройке OpenClaw QMD"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: ru
---

> ⚠️ **Рекомендация по выбору**: Эта статья документирует процесс настройки QMD. Однако на основе практической оценки **встроенного индекса OpenClaw достаточно для большинства сценариев**. QMD требует дополнительно ~600 МБ памяти и более сложного обслуживания. Пожалуйста, решите, включать ли его, исходя из ваших реальных потребностей (например, необходимость полностью автономной работы или чрезвычайно высокие требования к качеству поиска).

Эта статья объясняет, как настроить бэкенд памяти QMD (Query Markdown Database) для OpenClaw на Mac с Apple Silicon (M1/M2/M3/M4), включая гибридный поиск с BM25 + вектор + переранжирование.

## Предварительные условия

- macOS 14+ (Sonoma / Sequoia)
- OpenClaw 2026.2.3-1 или новее
- Homebrew (для установки SQLite)

## Шаг 1: Установка Bun

QMD зависит от среды выполнения Bun. Сначала установите Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

Проверка установки:
```bash
~/.bun/bin/bun --version
# Вывод: 1.3.8
```

## Шаг 2: Установка SQLite (с поддержкой расширений)

QMD требует SQLite с поддержкой расширений:

```bash
brew install sqlite
```

## Шаг 3: Установка QMD

Установите QMD глобально с помощью Bun:

```bash
~/.bun/bin/bun install -g https://github.com/tobi/qmd
```

Проверка установки QMD:
```bash
export PATH="$HOME/.bun/bin:$PATH"
qmd --version
```

## Шаг 4: Настройка OpenClaw для использования QMD

Отредактируйте файл конфигурации OpenClaw:

```bash
openclaw config edit
```

Добавьте или измените конфигурацию `memory`:

```json
{
  "memory": {
    "backend": "qmd"
  }
}
```

Полный пример конфигурации (с дополнительными параметрами):

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

## Шаг 5: Перезапуск OpenClaw

```bash
openclaw gateway restart
```

## Шаг 6: Инициализация индекса QMD

После перезапуска QMD автоматически создаст индекс. Для ручной инициализации:

```bash
# Установка переменных окружения
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"

# Создание коллекции
cd ~/.openclaw/workspace
qmd collection add memory --name memory-root --mask "**/*.md"

# Генерация векторных эмбеддингов (при первом запуске загрузит ~600 МБ моделей)
qmd embed
```

При первом запуске `qmd embed` автоматически загрузит с HuggingFace:
- `embeddinggemma-300M-Q8_0.gguf` (модель эмбеддингов)
- `qwen3-reranker-0.6b-q8_0.gguf` (модель переранжирования)
- `Qwen3-0.6B-Q8_0.gguf` (модель расширения запросов)

## Шаг 7: Проверка работы QMD

Протестируйте поиск памяти:

```bash
openclaw memory-search "OpenClaw memory system"
```

Если вы видите `source: "qmd//memory-root/..."`, QMD активен.

Проверка статуса QMD:

```bash
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"
qmd status
```

## Часто задаваемые вопросы

### QMD не работает, по-прежнему отображается встроенный индекс

Проверьте, установлено ли `memory.backend` на `"qmd"` в `~/.openclaw/openclaw.json`, затем перезапустите Gateway.

### Ошибка загрузки модели

Пользователи в Китае могут настроить зеркало HuggingFace:
```bash
export HF_ENDPOINT=https://hf-mirror.com
qmd embed
```

### Недостаточно памяти

Mac серии M должны иметь не менее 8 ГБ памяти. Если процесс эмбеддинга завершается, попробуйте закрыть другие приложения.

## Справочник по конфигурации

| Элемент конфигурации | Описание | Значение по умолчанию |
|----------------------|----------|----------------------|
| `memory.backend` | Тип бэкенда памяти | `"qmd"` |
| `memory.citations` | Показывать источники цитирования | `"auto"` |
| `memory.qmd.update.interval` | Интервал обновления индекса | `"5m"` |
| `memory.qmd.limits.maxResults` | Максимальное количество результатов | `6` |
| `memory.qmd.limits.timeoutMs` | Тайм-аут поиска | `4000` |

## Резюме

После включения QMD поиск памяти OpenClaw будет иметь:
- **Полнотекстовый поиск BM25**: Точное соответствие ключевых слов, ID, символов кода
- **Векторный семантический поиск**: Понимание синонимов и концептуальных ассоциаций
- **Оптимизация переранжирования**: Qwen3 reranker улучшает релевантность

По сравнению со встроенным SQLite + Gemini Embeddings, QMD работает полностью локально, не зависит от внешних API и обеспечивает более высокое качество поиска.
