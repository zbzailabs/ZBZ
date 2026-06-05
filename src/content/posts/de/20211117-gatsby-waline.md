---
title: "Waline-Kommentar-Komponente für Gatsby installieren"
description: "Da Waline noch keine Gatsby-Komponente hat, fügen Sie der Gatsby-Site Waline-Kommentarfunktionen hinzu, indem Sie die Waline-Client-Bibliothek installieren, eine React-Komponente erstellen und die Komponente an der entsprechenden Stelle einführen."
category: "life"
tags:
  - "roam"
pubDate: 2021-11-17
heroImage: "https://cos.zbz.ai/images/202310181512145.avif"
heroImageAlt: "ZBZ-Waline-Kommentar-Komponente für Gatsby installieren"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "de"
---

Gatsby ist ein auf React basierendes Framework zum Erstellen statischer Websites, mit dem Online-Shops, offizielle Websites und Blogs bereitgestellt werden können. Mit umfangreichen Plugins können Funktionen wie das verzögerte Laden von Bildern, die Unterstützung von Markdown-Dokumenten und Besucherkommentare realisiert werden. Zu den von Gatsby offiziell empfohlenen Kommentarsystemen gehören Disqus, Gitalk usw. Diese Kommentarsysteme haben ihre eigenen Eigenschaften, können aber die Anforderungen nicht erfüllen. Dieser Artikel versucht, das kürzlich beliebte Waline-Kommentarsystem im Gatsby-Projekt zu installieren. Da die Gatsby-Entwicklung ein hohes Maß an Freiheit bietet und jedes Projekt anders ist, wird das offizielle Blog-Thema `gatsby-starter-blog` als Beispiel verwendet, um den Ausdruck von Ideen zu erleichtern.

## Idee

Da Waline noch keine Gatsby-Komponente hat, müssen wir die Funktion implementieren, indem wir die Waline-Client-Bibliothek installieren, eine React-Komponente erstellen und die Komponente an der entsprechenden Stelle einführen.

## Grundkonfiguration

Stellen Sie das [Gatsby](https://gatsbyjs.com)-Projekt gemäß den Anforderungen bereit und konfigurieren Sie den Server und die Datenseite des Waline-Kommentarsystems gemäß dem [offiziellen Waline-Tutorial](https://waline.js.org).

## Waline-Bibliothek installieren

Installieren Sie im Projektstammverzeichnis die Waline-Bibliothek über die Paketverwaltung.

```bash
yarn add -D @waline/client
```

Danach können Sie die Waline-Komponente über die `import`-Anweisung in der Kommentarkomponente einführen.

## Kommentarkomponente erstellen

Erstellen Sie eine Waline-Klassenkomponente, um die Kommentarfunktion zu kapseln und wiederzuverwenden.

Erstellen Sie ein neues Skript `comment.js` im Verzeichnis `src/components`

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

- Da wir die Komponente nur benötigen, um das `Waline`-Objekt beim Laden zu erstellen und festzustellen, dass es keinen häufigen Zustandsänderungen unterliegt, definieren wir `Comment` als Klassenkomponente anstelle einer Funktionskomponente und erben `PureComponent`, was den Leistungsverlust verringern kann.

- In der Funktion `render()` erstellen wir ein `<div>` als Containerelement, das zum Laden der von `Waline` dynamisch generierten DOM-Knoten verwendet wird.
- Fügen Sie der Komponente `Comment` eine `prop` mit dem Namen `slug` hinzu, die von der äußeren Komponente übergeben wird, um sicherzustellen, dass nur die entsprechenden Kommentare auf einer festen Seite angezeigt werden.

## Komponente zur Artikelseite hinzufügen

Öffnen Sie die Datei `src/templates/blog-post.js` und fügen Sie zuerst eine Importdeklaration hinzu:

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

Fügen Sie am Ende der Funktion `BlogPostTemplate` das Tag `<Comment>` ein und setzen Sie das Attribut `slug` vor dem schließenden Tag `</Layout>`:

```jsx
import Comment from '../components/comment' // Importieren Sie unsere neue Komponente

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

## Entwicklungsversion erstellen

```bash
gatsby build
```
