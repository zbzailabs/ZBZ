---
title: "Установка компонента комментариев Waline для Gatsby"
description: "Поскольку у Waline пока нет компонента Gatsby, добавьте функцию комментариев Waline на сайт Gatsby, установив клиентскую библиотеку Waline, создав компонент React и внедрив компонент в соответствующее место."
category: "life"
tags:
  - "roam"
pubDate: 2021-11-17
heroImage: "https://cos.zbz.ai/images/202310181512145.avif"
heroImageAlt: "RealRip-Установка компонента комментариев Waline для Gatsby"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "ru"
---

Gatsby — это фреймворк для создания статических веб-сайтов на основе react, который можно использовать для развертывания интернет-магазинов, официальных веб-сайтов и блогов. Используя богатые плагины, можно реализовать такие функции, как отложенная загрузка изображений, поддержка документов Markdown и комментарии посетителей. Системы комментариев, официально рекомендованные Gatsby, включают Disqus, Gitalk и т. д. У этих систем комментариев есть свои особенности, но они не могут удовлетворить потребности. В этой статье делается попытка установить недавно популярную систему комментариев Waline в проект Gatsby. Поскольку разработка Gatsby имеет большую степень свободы и каждый проект индивидуален, для облегчения выражения идей в качестве примера используется официальная тема блога `gatsby-starter-blog`.

## Идея

Поскольку у Waline пока нет компонента Gatsby, нам нужно реализовать функцию, установив клиентскую библиотеку Waline, создав компонент React и внедрив компонент в соответствующее место.

## Базовая конфигурация

Разверните проект [Gatsby](https://gatsbyjs.com) в соответствии с требованиями и настройте сервер и сторону данных системы комментариев Waline в соответствии с [официальным руководством Waline](https://waline.js.org).

## Установка библиотеки Waline

В корневом каталоге проекта установите библиотеку Waline с помощью управления пакетами.

```bash
yarn add -D @waline/client
```

После этого вы можете внедрить компонент Waline с помощью оператора `import` в компоненте комментариев.

## Создание компонента комментариев

Создайте компонент класса Waline для инкапсуляции и повторного использования функции комментариев.

Создайте новый скрипт `comment.js` в каталоге `src/components`

```jsx
import React, { PureComponent } from "react";

export default class Comment extends PureComponent {
  constructor(props) {
    super(props);
    this._commentRef = React.createRef();
  }
  async componentDidMount() {
    if (typeof window === "undefined") {
      return;
    }
    if (!this._commentRef.current) {
      return;
    }
    const Waline = await (await import("@waline/client")).default;
    this.Waline = new Waline({
      el: this._commentRef.current,
      serverURL: "https://your.waline.url",
      visitor: true,
      path: this.props.slug,
    });
  }
  render() {
    return <div ref={this._commentRef} />;
  }
}
```

- Поскольку нам нужен компонент только для создания объекта `Waline` при его загрузке и определения того, что он не будет подвергаться частым изменениям состояния, мы определяем `Comment` как компонент класса, а не функциональный компонент, и наследуем `PureComponent`, что может снизить потерю производительности.

- В функции `render()` мы создаем `<div>` в качестве элемента-контейнера, который используется для загрузки узлов DOM, динамически генерируемых `Waline`.
- Добавьте `prop` с именем `slug` в компонент `Comment`, который передается внешним компонентом, чтобы гарантировать, что на фиксированной странице отображаются только соответствующие комментарии.

## Добавление компонента на страницу статьи

Откройте файл `src/templates/blog-post.js` и сначала добавьте объявление импорта:

```jsx
import Comment from "../components/comment";

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        slug
      }

      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`;
```

В конце функции `BlogPostTemplate` вставьте тег `<Comment>` и установите атрибут `slug` перед закрывающим тегом `</Layout>`:

```jsx
import Comment from '../components/comment' // Импорт нашего нового компонента

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  ...
  return (
    <Layout location={location} title={siteTitle}>
      <Comment slug={post.fields.slug} />
    </Layout>
  )
}
```

## Создание версии для разработки

```bash
gatsby build
```
