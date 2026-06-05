---
title: "Развертывание проектов Astro с помощью Dokploy и Nixpacks и включение кэширования для оптимизации скорости сборки"
description: "Быстрое развертывание статических веб-сайтов Astro с использованием Dokploy и Nixpacks, полное включение механизмов кэширования для значительного повышения скорости сборки. Учебное пособие охватывает конфигурацию Astro, настройки переменных среды Dokploy и стратегии оптимизации кэша Nixpacks, подходящие для практик непрерывной интеграции и развертывания веб-сайтов, ориентированных на контент."
category: "startup"
tags:
  - "innovation"
pubDate: 2025-07-14
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20250714082742453.avif"
heroImageAlt: "RealRip-Развертывание проектов Astro с помощью Dokploy и Nixpacks и включение кэширования для оптимизации скорости сборки"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: ru
---

## I. Конфигурация Dokploy

Dokploy — это платформа развертывания с открытым исходным кодом и возможностью самостоятельного хостинга, разработанная как бесплатная альтернатива Heroku, Vercel и Netlify, построенная на базе Docker и Traefik.

### 1. Создание нового проекта и подключение репозитория GitHub

### 2. Установка переменных среды

```bash
NIXPACKS_NODE_VERSION=22
NIXPACKS_PNPM_STORE_PATH=/root/.local/share/pnpm/store/v3
NIXPACKS_INSTALL_CACHE_DIRS=/app/node_modules
NIXPACKS_BUILD_CACHE_DIRS=/app/node_modules/.cache,/app/astro_cache
```

### 3. Отключение очистки кэша

- Служба проекта → **Clean Cache**: Отключить
- Веб-сервер → **Daily Docker Cleanup**: Отключить

---

## II. Сборочный движок Nixpacks

Nixpacks — это инструмент сборки с открытым исходным кодом, запущенный Railway, который собирает исходный код в стандартные образы Docker. Dokploy использует Nixpacks в качестве движка сборки по умолчанию и поддерживает указание конфигураций сборки в файлах `nixpacks.toml` или `nixpacks.json`. Создайте файл `nixpacks.toml` в корневом каталоге проекта и настройте соответствующие каталоги кэша.

### Приоритет конфигурации (Низкий → Высокий):

1. Логика поставщика по умолчанию
2. `nixpacks.toml`
3. Переменные среды
4. Аргументы CLI

### Общие переменные среды

| Имя переменной                | Описание                             |
| :---------------------------- | :----------------------------------- |
| `NIXPACKS_INSTALL_CMD`        | Пользовательская команда установки   |
| `NIXPACKS_BUILD_CMD`          | Пользовательская команда сборки      |
| `NIXPACKS_START_CMD`          | Пользовательская команда запуска     |
| `NIXPACKS_PKGS`               | Установка дополнительных пакетов Nix |
| `NIXPACKS_APT_PKGS`           | Установка дополнительных пакетов Apt |
| `NIXPACKS_INSTALL_CACHE_DIRS` | Каталоги кэша этапа установки        |
| `NIXPACKS_BUILD_CACHE_DIRS`   | Каталоги кэша этапа сборки           |
| `NIXPACKS_NO_CACHE`           | Отключить кэш (не рекомендуется)     |
| `NIXPACKS_CONFIG_FILE`        | Указать файл конфигурации            |
| `NIXPACKS_DEBIAN`             | Включить базовый образ Debian        |

## III. Конфигурация проекта Astro

Astro — это современный веб-фреймворк для контентных сайтов, особенно подходящий для статических веб-сайтов, таких как блоги, маркетинговые страницы и электронная коммерция. Когда веб-сайт содержит большое количество изображений и статических ресурсов, скорость сборки может пострадать. Включив механизмы кэширования, можно значительно повысить эффективность сборки.

### 1. Настройка каталога артефактов кэша сборки:

Проектам Astro необходимо указать каталог кэша в файле конфигурации для повторного использования предыдущих артефактов сборки в последующих сборках. Файлы в этом каталоге будут использоваться в последующих сборках для ускорения времени сборки.
Это значение может быть абсолютным или относительным путем.

```js
//`astro.config.mjs`
export default defineConfig({
  cacheDir: "./astro_cache",
});
```

---

### 2. Файл конфигурации кэша Nixpacks

Создайте файл `nixpacks.toml` в корневом каталоге проекта Astro и настройте каталоги кэша и команды сборки.

```toml
# Использовать указанные версии Node.js и pnpm
[phases.setup]
nixPkgs = ["nodejs_22", "pnpm"]

# Установить зависимости и включить кэш pnpm
[phases.install]
cmds = ["pnpm install --frozen-lockfile"]
cacheDirectories = ["/root/.local/share/pnpm/store/v3"]

# Собрать проект Astro и кэшировать node_modules/.cache и astro_cache
[phases.build]
cmds = ["pnpm run build"]
cacheDirectories = [
  "node_modules/.cache",
  "astro_cache"
]

# Команда запуска (вы используете NGINX для обслуживания статического каталога dist, это просто заполнитель)
[start]
cmd = "echo 'Сборка завершена, пожалуйста, получите доступ к каталогу dist через NGINX'"
```

---

## 3. Оптимизация контекста сборки Docker

Добавьте `.dockerignore` в корневой каталог проекта Astro:

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

## IV. Развертывание и проверка

После автоматического развертывания Dokploy проверьте журналы сборки на наличие следующего содержимого, чтобы убедиться, что кэширование эффективно:

### 1. Команда сборки использовала смонтированный кэш

```bash
RUN --mount=type=cache,id=xxxx-node_modules/cache,target=/app/node_modules/.cache \
    --mount=type=cache,id=xxxx-astro_cache,target=/app/astro_cache \
    pnpm run build
```

### 2. Сборка Astro повторно использовала записи кэша (особенно оптимизацию изображений)

```bash
▶ /_astro/202409272055577_Z2smeTW.avif (reused cache entry)
▶ /_astro/202409272055575_Z2wPyJN.avif (reused cache entry)
▶ /_astro/202409272055577_1IgP6g.avif (reused cache entry)
```

✅ Если вы видите приведенные выше журналы монтирования кэша и текст "reused cache entry", это означает, что механизм кэширования был успешно включен, и сборка достигла инкрементного ускорения.

🎉 На вкладке Deployments проекта Dokploy вы также можете увидеть, что без настроек кэша сборка проекта занимает 31 минуту, в то время как с включенными настройками кэша это занимает всего 3 минуты, что значительно сокращает время сборки и экономит трафик и пропускную способность.

## V. Ускорение сайта с помощью Tencent EdgeOne

## Предыстория: "Невозможный треугольник" трансграничной передачи

Развертывание серверов в Сингапуре. Это решение экономически эффективно и не требует громоздких процессов регистрации, но для пользователей в материковом Китае опыт доступа часто сталкивается с огромными проблемами:

1. **Высокая физическая задержка**: RTT (время приема-передачи) из Сингапура в материковый Китай обычно колеблется в пределах 50 мс - 200 мс.
2. **Серьезная потеря пакетов**: Из-за помех брандмауэра GFW рукопожатия TCP часто прерываются по тайм-ауту, в результате чего загрузка изображений зависает на полпути (Pending).
3. **Задержка перехода**: Многостраничные приложения требуют длительного ожидания белого экрана при нажатии на ссылки.

Чтобы решить эту проблему, мы использовали **Tencent Cloud EdgeOne** в сочетании с тонкой настройкой **Traefik** для создания "комбо", обеспечивающего практически мгновенное открытие, близкое к локально зарегистрированным веб-сайтам.

### Идея основной архитектуры

Наша стратегия оптимизации вращается вокруг трех ключевых слов: **Борьба с потерей пакетов**, **Разгрузка сжатия** и **Многоуровневое кэширование**.

1. **Уровень протокола (EdgeOne)**: Использование протокола **HTTP/3 (QUIC)** на основе характеристик UDP для полного решения проблемы прерывания загрузки контента, вызванного потерей пакетов TCP при трансграничной передаче.
2. **Транспортный уровень (Traefik -> EdgeOne)**: Отключить сжатие источника Traefik и позволить пограничным узлам EdgeOne отвечать за более эффективное интеллектуальное сжатие **Brotli** для уменьшения объема передачи.
3. **Уровень кэша (Стратегия)**: Использование `s-maxage` для разделения "Долгосрочного кэша CDN" и "Краткосрочного кэша браузера", обеспечивая как коэффициент попадания в CDN, так и своевременность обновления контента.

### I. Глобальная конфигурация EdgeOne (Включить режим "Борьба с потерей пакетов")

Хотя EdgeOne не может предоставить внутренние узлы для незарегистрированных доменов, его пограничные узлы (Гонконг/Сингапур) к внутренним линиям оптимизированы и поддерживают протокол QUIC, который является ключом к решению проблемы "сетевой задержки".

Войдите в консоль EdgeOne -> **Ускорение сайта** -> **Конфигурация функций**:

### 1. Включить HTTP/3 (QUIC) ✅

Это самый важный шаг. В трансграничных сетях с высоким уровнем потери пакетов протокол QUIC может эффективно избежать блокировки начала очереди TCP. После включения феномен "вращающихся" или "загружающихся наполовину" изображений полностью исчезнет.

### 2. Включить интеллектуальное сжатие (Brotli + Gzip) ✅

Рекомендуется включить как Brotli, так и Gzip. EdgeOne будет отдавать приоритет возврату формата **Brotli (`br`)** поддерживаемым браузерам, который имеет степень сжатия на 15-20% выше, чем Gzip. Чем меньше объем, тем быстрее он проходит через стену.

### 3. Включить предварительное обновление кэша (90%) ✅

Установите коэффициент предварительного обновления на **90%**. Это означает, что в последние 10% времени перед истечением срока действия кэша CDN асинхронно вернется к источнику для обновления. Пользователи никогда не столкнутся с задержкой, вызванной "истечением срока действия кэша, приводящим к возврату к источнику", обеспечивая 100% попадание.

## II. Оптимизация конфигурации Traefik (Стратегия источника)

Нам нужно изменить `dynamic_conf.yml` Traefik (или метки Docker), чтобы сделать две вещи: **Разгрузить сжатие** и **Внедрить точные заголовки кэша**.

### 1. Отключить сжатие источника

Пожалуйста, проверьте конфигурацию ваших маршрутизаторов и **удалите** все промежуточные программы `compress` (Gzip).

- **Причина**: EdgeOne уже отвечает за сжатие Brotli. Повторное выполнение Gzip на источнике приведет к пустой трате ресурсов ЦП и может вызвать проблемы двойного сжатия.

### 2. Определить стратегию многоуровневого кэширования (Основной код)

Это ядро решения противоречия между "пользователи не видят новый контент после публикации статей" и "скорость прямого возврата к источнику слишком медленная".

Мы определяем промежуточное ПО специально для HTML-страниц в Traefik:

```yaml
http:
  routers:
    # Принудительное перенаправление на HTTPS
    idimi-uygy0r-redirect-https:
      entryPoints:
        - web
      rule: Host(`realrip.com`)
      middlewares:
        - idimi-uygy0r-to-https
      service: noop@internal
      priority: 1000

    # Service Worker (Ядро PWA) - Без сжатия, обрабатывается EdgeOne
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

    # Основные статические ресурсы Astro (Отпечаток Hash) - Без сжатия, обрабатывается EdgeOne
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

    # Файлы WASM Pagefind - Без сжатия, обрабатывается EdgeOne
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

    # Файлы индекса Pagefind - Без сжатия, обрабатывается EdgeOne
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

    # Sitemap / Robots / RSS - Без сжатия, обрабатывается EdgeOne
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

    # Manifest - Без сжатия, обрабатывается EdgeOne
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

    # Другие статические файлы (Изображения/Видео и т.д.) - Без сжатия, обрабатывается EdgeOne
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

    # HTML-страницы (Резервное правило) - Без сжатия, обрабатывается EdgeOne
    # Применена стратегия разделения s-maxage=3600
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

    # --- Определение промежуточного ПО сжатия сохранено, но не вызывается (удалено из Routers) ---
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

    # Ключевая модификация: Стратегия кэширования HTML
    # Браузер кэширует на 5 минут (300 с), CDN кэширует на 1 час (3600 с)
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

**Пояснение к конфигурации:**

- **`s-maxage=3600`**: Это директива, написанная специально для CDN. EdgeOne видит это и кэширует HTML-страницу на 1 час.
- **`max-age=300`**: Когда EdgeOne отправляет его пользователю, он удаляет `s-maxage`, и браузер пользователя видит только 300 секунд (5 минут).
- **Эффект**: CDN обрабатывает трафик в течение 1 часа, в то время как пользователям нужно ждать всего 5 минут, чтобы увидеть недавно опубликованные статьи.

## III. Движок правил EdgeOne

Из-за структуры URL Astro (без суффикса) и службы динамических изображений (`/_image`) необходимы точные правила для попадания в кэш.

В **Движке правил** EdgeOne настройте следующие правила строго **по порядку**:

### Правило 1: Основные статические ресурсы Astro (Постоянный кэш)

Активы Astro, артефакты сборки и служба динамических изображений, контент, который никогда не меняется или потребляет много ресурсов ЦП, должны кэшироваться принудительно.

- **Условие соответствия**: `Путь URL` -> `Соответствие Regex`
- **Значение соответствия**: `^/(_astro|assets|pagefind|_image)/`
- _Примечание: `_image` добавлено здесь, специально оптимизируя динамические оптимизированные изображения, созданные компонентом `<Image />` Astro._
- **Действие**:
  - Кэш узла: **365 дней** (Принудительно)
  - Кэш браузера: **365 дней**

### Правило 2: Обычные статические файлы

- **Условие соответствия**: `Расширение файла` равно `png, jpg, jpeg, webp, css, js` и т. д.
- **Действие**: Кэш узла **30 дней** (Принудительно).

### Правило 3: Service Worker (Ядро PWA)

- **Условие соответствия**: `Путь URL` равен `/sw.js` или `/service-worker.js`.
- **Действие**: Кэш узла **1 час** (Принудительно).
- _Предупреждение: Не кэшируйте слишком долго, иначе PWA не сможет быть обновлено вовремя после выпуска._

### Правило 4: Резервное правило (HTML-страницы)

- **Условие соответствия**: (Нет условия / Соответствует всем оставшимся запросам)
- **Действие**:
  - Кэш узла: **Следовать источнику** (т.е. читать `s-maxage=3600` из Traefik).
  - Кэш браузера: **Следовать источнику** (т.е. читать `max-age=300` из Traefik).

## IV. Оптимизация на уровне кода Astro (Воспринимаемое ускорение)

Чтобы сделать переходы между страницами такими же плавными, как в "нативных приложениях", и полностью устранить ожидание белого экрана во время переходов, нам нужно использовать **Client Router (ранее View Transitions)** Astro.

### 1. Включить Client Router

Добавьте в `<head>` файла `src/layouts/MainLayout.astro`:

```js
import { ClientRouter } from 'astro:transitions';

<head>
  <!-- Другие мета-теги -->
  <ClientRouter />
</head>
```

### 2. Включить предварительную загрузку (Prefetch)

Настройте стратегию предварительной загрузки в `astro.config.mjs`:

```js
export default defineConfig({
  // 'viewport': Скачивать, когда ссылка попадает в область просмотра (баланс трафика и скорости)
  // 'load': Скачивать все ссылки сразу после загрузки страницы (экстремальная скорость, но потребляет пропускную способность)
  prefetch: {
    defaultStrategy: "viewport",
  },
  // ...
});
```
