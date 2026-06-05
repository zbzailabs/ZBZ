---
title: "Installer le composant de commentaire Waline pour Gatsby"
description: "Puisque Waline n'a pas encore de composant Gatsby, ajoutez la fonctionnalité de commentaire Waline au site Gatsby en installant la bibliothèque client Waline, en créant un composant React et en introduisant le composant à l'emplacement approprié."
category: "life"
tags:
  - "roam"
pubDate: 2021-11-17
heroImage: "https://cos.zbz.ai/images/202310181512145.avif"
heroImageAlt: "ZBZ-Installer le composant de commentaire Waline pour Gatsby"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "fr"
---

Gatsby est un framework de création de sites Web statiques basé sur react, qui peut être utilisé pour déployer des boutiques en ligne, des sites Web officiels et des blogs. En utilisant des plugins riches, des fonctions telles que le chargement paresseux d'images, la prise en charge des documents Markdown et les commentaires des visiteurs peuvent être réalisées. Les systèmes de commentaires officiellement recommandés par Gatsby incluent Disqus, Gitalk, etc. Ces systèmes de commentaires ont leurs propres caractéristiques, mais ils ne peuvent pas répondre aux besoins. Cet article tente d'installer le système de commentaires Waline récemment populaire dans le projet Gatsby. Étant donné que le développement de Gatsby a un grand degré de liberté et que chaque projet est différent, afin de faciliter l'expression des idées, le thème de blog officiel `gatsby-starter-blog` est utilisé comme exemple.

## Idée

Puisque Waline n'a pas encore de composant Gatsby, nous devons implémenter la fonction en installant la bibliothèque client Waline, en créant un composant React et en introduisant le composant à l'emplacement approprié.

## Configuration de base

Déployez le projet [Gatsby](https://gatsbyjs.com) selon les exigences, et configurez le serveur et le côté données du système de commentaires Waline selon le [tutoriel officiel Waline](https://waline.js.org).

## Installer la bibliothèque Waline

Dans le répertoire racine du projet, installez la bibliothèque Waline via la gestion des packages.

```bash
yarn add -D @waline/client
```

Après cela, vous pouvez introduire le composant Waline via l'instruction `import` dans le composant de commentaire.

## Créer un composant de commentaire

Créez un composant de classe Waline pour encapsuler et réutiliser la fonction de commentaire.

Créez un nouveau script `comment.js` dans le répertoire `src/components`

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

- Parce que nous avons seulement besoin du composant pour créer l'objet `Waline` lors de son chargement, et déterminer qu'il ne subira pas de changements d'état fréquents, nous définissons `Comment` comme un composant de classe au lieu d'un composant de fonction, et héritons de `PureComponent`, ce qui peut réduire la perte de performance.

- Dans la fonction `render()`, nous créons un `<div>` comme élément conteneur, qui est utilisé pour charger les nœuds DOM générés dynamiquement par `Waline`.
- Ajoutez un `prop` nommé `slug` au composant `Comment`, qui est transmis par le composant externe pour s'assurer que seuls les commentaires correspondants sont affichés sur une page fixe.

## Ajouter un composant à la page de l'article

Ouvrez le fichier `src/templates/blog-post.js` et ajoutez d'abord une déclaration d'importation :

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

À la fin de la fonction `BlogPostTemplate`, insérez la balise `<Comment>` et définissez l'attribut `slug` avant la balise de fermeture `</Layout>` :

```jsx
import Comment from '../components/comment' // Importer notre nouveau composant

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

## Créer une version de développement

```bash
gatsby build
```
