---
title: "Instalar el componente de comentarios Waline para Gatsby"
description: "Dado que Waline aún no tiene un componente Gatsby, agregue la funcionalidad de comentarios Waline al sitio Gatsby instalando la biblioteca cliente Waline, creando un componente React e introduciendo el componente en la ubicación adecuada."
category: "life"
tags:
  - "roam"
pubDate: 2021-11-17
heroImage: "https://cos.zbz.ai/images/202310181512145.avif"
heroImageAlt: "ZBZ-Instalar el componente de comentarios Waline para Gatsby"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "es"
---

Gatsby es un marco de construcción de sitios web estáticos basado en react, que se puede utilizar para implementar tiendas en línea, sitios web oficiales y blogs. Usando complementos ricos, se pueden realizar funciones como carga diferida de imágenes, soporte de documentos Markdown y comentarios de visitantes. Los sistemas de comentarios recomendados oficialmente por Gatsby incluyen Disqus, Gitalk, etc. Estos sistemas de comentarios tienen sus propias características, pero no pueden satisfacer las necesidades. Este artículo intenta instalar el sistema de comentarios Waline recientemente popular en el proyecto Gatsby. Dado que el desarrollo de Gatsby tiene un gran grado de libertad y cada proyecto es diferente, para facilitar la expresión de ideas, se utiliza el tema oficial del blog `gatsby-starter-blog` como ejemplo.

## Idea

Dado que Waline aún no tiene un componente Gatsby, necesitamos implementar la función instalando la biblioteca cliente Waline, creando un componente React e introduciendo el componente en la ubicación adecuada.

## Configuración básica

Implemente el proyecto [Gatsby](https://gatsbyjs.com) de acuerdo con los requisitos y configure el servidor y el lado de datos del sistema de comentarios Waline de acuerdo con el [tutorial oficial de Waline](https://waline.js.org).

## Instalar la biblioteca Waline

En el directorio raíz del proyecto, instale la biblioteca Waline a través de la gestión de paquetes.

```bash
yarn add -D @waline/client
```

Después de eso, puede introducir el componente Waline a través de la declaración `import` en el componente de comentarios.

## Crear componente de comentarios

Cree un componente de clase Waline para encapsular y reutilizar la función de comentarios.

Cree un nuevo script `comment.js` en el directorio `src/components`

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

- Debido a que solo necesitamos el componente para crear el objeto `Waline` cuando se carga, y determinar que no sufrirá cambios de estado frecuentes, definimos `Comment` como un componente de clase en lugar de un componente de función, y heredamos `PureComponent`, lo que puede reducir la pérdida de rendimiento.

- En la función `render()`, creamos un `<div>` como elemento contenedor, que se utiliza para cargar los nodos DOM generados dinámicamente por `Waline`.
- Agregue un `prop` llamado `slug` al componente `Comment`, que pasa el componente externo para garantizar que solo se muestren los comentarios correspondientes en una página fija.

## Agregar componente a la página del artículo

Abra el archivo `src/templates/blog-post.js` y primero agregue una declaración de importación:

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

Al final de la función `BlogPostTemplate`, inserte la etiqueta `<Comment>` y establezca el atributo `slug` antes de la etiqueta de cierre `</Layout>`:

```jsx
import Comment from '../components/comment' // Importar nuestro nuevo componente

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

## Crear versión de desarrollo

```bash
gatsby build
```
