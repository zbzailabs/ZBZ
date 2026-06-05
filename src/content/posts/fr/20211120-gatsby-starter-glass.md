---
title: "Un modèle de blog Gatsby"
description: "Ce site est un site Web statique construit à l'aide de Gatsby, bienvenue pour l'essayer."
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
locale: "fr"
---

Un modèle pour créer des sites Web statiques à l'aide de Gatsby.

Le code source est sur **[gatsby-starter-glass](https://github.com/xiyizhou/gatsby-starter-glass)**, bienvenue pour l'essayer.

## Caractéristiques

- Prêt à l'emploi
- Entièrement localisé
- Comprend les commentaires [Waline](https://waline.js.org)
- Comprend Google Analytics
- Édition Markdown

## Déploiement local

```bash
# 1. Cloner en local
git clone https://github.com/xiyizhou/gatsby-starter-glass.git

# 2. cd dans le répertoire
cd gatsby-starter-glass

# 3. Installer les dépendances
yarn install

# 4. Démarrer le mode développement
yarn start

# 5. Construire la version de production
yarn  build
```

## Configuration

- Configurez les informations du site Web, l'ID Google Analytics, etc. dans `gatsby-config.js`.
- Configurez les informations de la barre de navigation supérieure dans `src/components/header.js`.
- Configurez les informations de la barre de navigation inférieure dans `src/components/footer.js`.

- Configurez les informations Waline dans `src/components/comment.js`.

## Publication d'articles

### Articles de blog

Les articles de blog sont situés dans `content/blog`. Le modèle est le suivant :

```md
---
title: Installer le composant de commentaire Waline pour Gatsby
date: 2021-11-17 08:08
slug: gatsby-waline
category: Vie
tags:
  - Vie
description: Puisque Waline n'a pas encore de composant Gatsby, ajoutez la fonctionnalité de commentaire Waline au site Gatsby en installant la bibliothèque client Waline, en créant un composant React et en introduisant le composant à l'emplacement approprié.
---

Gatsby est un framework de création de sites Web statiques basé sur react, qui peut être utilisé pour déployer des boutiques en ligne, des sites Web officiels et des blogs. En utilisant des plugins riches, des fonctions telles que le chargement paresseux d'images, la prise en charge des documents Markdown et les commentaires des visiteurs peuvent être réalisées. Les systèmes de commentaires officiellement recommandés par Gatsby incluent Disqus, Gitalk, etc.
```

### Pages

Le contenu de la page est situé dans `content/pages`.

## Remarques

- Ce démarreur est basé sur Gatsby V3, faites attention à la compatibilité des versions lors de l'installation de plugins.
- Le cadre principal est localisé à partir de [gatsby-starter-glass](https://github.com/yinkakun/gatsby-starter-glass), merci à [yinkakun](https://github.com/yinkakun).
