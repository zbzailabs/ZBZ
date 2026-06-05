---
title: "Руководство по автоматическому обновлению зависимостей с Renovate"
description: "Использование Renovate для полной автоматизации обновлений зависимостей репозиториев GitHub без ручного вмешательства"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-06
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260206-renovate-guide.avif"
heroImageAlt: "Автоматическое обновление зависимостей с Renovate"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: ru
---

## Введение

Поддержка зависимостей проекта — часть ежедневной работы разработчиков. Ручная проверка, обновление и тестирование версий зависимостей не только отнимает время, но и приводит к упущениям. Эта статья объясняет, как использовать **Renovate** для полной автоматизации обновлений зависимостей.

## Цели

- Автоматическая проверка обновлений зависимостей каждый день на рассвете
- Автоматическое создание PR и их слияние (после прохождения CI)
- Без ручного вмешательства, работа в фоновом режиме
- Единое управление в нескольких репозиториях

## Установка Renovate

1. Посетите [GitHub Apps - Renovate](https://github.com/apps/renovate)
2. Нажмите **Установить**
3. Выберите репозитории для включения (все или конкретные)
4. Завершите авторизацию

## Файл конфигурации

Создайте `renovate.json` в корне репозитория:

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

Коммит и push:

```bash
git add renovate.json
git commit -m "chore: configure Renovate for automated dependency updates"
git push
```

## Детали конфигурации

| Опция | Описание |
|-------|----------|
| `config:recommended` | Базовая конфигурация, официально рекомендуемая Renovate |
| `:automergeAll` | **Ключевая опция** — автоматическое слияние всех обновлений (включая мажорные версии) |
| `:disableDependencyDashboard` | Отключить панель задач для фоновой работы |
| `timezone` | Установить часовой пояс на Азия/Шанхай |
| `schedule` | Запускать проверки до 3:00 утра ежедневно |

## Рабочий процесс

```
3:00 утра ежедневно
    ↓
Renovate проверяет зависимости package.json
    ↓
Обнаружены доступные обновления
    ↓
Автоматическое создание Pull Request
    ↓
Запуск проверок CI
    ↓
CI пройден → Автоматическое слияние в ветку main
    ↓
Увидеть обновленные зависимости следующим утром
```

## Конфигурация для нескольких репозиториев

Для нескольких проектов скопируйте один и тот же файл конфигурации:

```bash
# Создать универсальную конфигурацию
cat > renovate.json << 'EOF'
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended", ":automergeAll", ":disableDependencyDashboard"],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
EOF

# Применить к нескольким репозиториям
for repo in repo1 repo2 repo3; do
  cp renovate.json $repo/
  cd $repo && git add . && git commit -m "chore: configure Renovate" && git push
  cd ..
done
```

## Часто задаваемые вопросы

### PR не сливается автоматически?

Проверьте статус CI. Renovate сливает только после прохождения всех проверок CI. Если CI не пройден, исправьте проблему вручную и перезапустите.

### Как немедленно запустить обновления?

- Если панель задач включена: Перейдите в Issues → Dependency Dashboard → Отметьте пакеты для обновления → Нажмите Rebase
- Или дождитесь запланированного времени автоматического запуска

### Как исключить конкретные зависимости?

Добавьте правила исключения в конфигурацию:

```json
{
  "packageRules": [{
    "matchPackageNames": ["package-name"],
    "enabled": false
  }]
}
```

### Поддержка pnpm / yarn / npm?

Renovate автоматически обнаруживает типы lock-файлов, дополнительная конфигурация не требуется.

## Проверка

После отправки конфигурации Renovate запустится автоматически (или дождется запланированного времени). Шаги проверки:

1. Перейдите на страницу **Pull requests** репозитория
2. Просмотрите PR, созданные Renovate (формат заголовка: `chore(deps): update ...`)
3. Подтвердите, что автоматическое слияние включено для PR
4. Автоматическое слияние после прохождения CI

## Итог

Всего 5 строк основной конфигурации:

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

Достигните полностью автоматизированного управления зависимостями, позволяя разработчикам сосредоточиться на бизнес-коде.
