---
title: "Шаблон блога Gatsby"
description: "Этот сайт представляет собой статический веб-сайт, созданный с использованием Gatsby, добро пожаловать, чтобы попробовать его."
category: "life"
tags:
  - "roam"
pubDate: 2021-11-20
heroImage: "https://cos.zbz.ai/images/202310181512144.avif"
heroImageAlt: "RealRip-"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "ru"
---

Шаблон для создания статических веб-сайтов с использованием Gatsby.

Исходный код находится на **[gatsby-starter-glass](https://github.com/xiyizhou/gatsby-starter-glass)**, добро пожаловать, чтобы попробовать его.

## Особенности

- Готов к использованию
- Полностью локализован
- Включает комментарии [Waline](https://waline.js.org)
- Включает Google Analytics
- Редактирование Markdown

## Локальное развертывание

```bash
# 1. Клонировать на локальный компьютер
git clone https://github.com/xiyizhou/gatsby-starter-glass.git

# 2. cd в каталог
cd gatsby-starter-glass

# 3. Установить зависимости
yarn install

# 4. Запустить режим разработки
yarn start

# 5. Собрать производственную версию
yarn  build
```

## Конфигурация

- Настройте информацию о веб-сайте, идентификатор Google Analytics и т. д. в `gatsby-config.js`.
- Настройте информацию о верхней панели навигации в `src/components/header.js`.
- Настройте информацию о нижней панели навигации в `src/components/footer.js`.

- Настройте информацию Waline в `src/components/comment.js`.

## Публикация статей

### Посты в блоге

Посты в блоге находятся в `content/blog`. Шаблон выглядит следующим образом:

```md
---
title: Установка компонента комментариев Waline для Gatsby
date: 2021-11-17 08:08
slug: gatsby-waline
category: Жизнь
tags:
  - Жизнь
description: Поскольку у Waline пока нет компонента Gatsby, добавьте функцию комментариев Waline на сайт Gatsby, установив клиентскую библиотеку Waline, создав компонент React и внедрив компонент в соответствующее место.
---

Gatsby — это фреймворк для создания статических веб-сайтов на основе react, который можно использовать для развертывания интернет-магазинов, официальных веб-сайтов и блогов. Используя богатые плагины, можно реализовать такие функции, как отложенная загрузка изображений, поддержка документов Markdown и комментарии посетителей. Системы комментариев, официально рекомендованные Gatsby, включают Disqus, Gitalk и т. д.
```

### Страницы

Содержимое страницы находится в `content/pages`.

## Примечания

- Этот стартер основан на Gatsby V3, обратите внимание на совместимость версий при установке плагинов.
- Основной фреймворк локализован из [gatsby-starter-glass](https://github.com/yinkakun/gatsby-starter-glass), спасибо [yinkakun](https://github.com/yinkakun).
