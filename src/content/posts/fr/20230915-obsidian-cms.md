---
title: "Utiliser Obsidian comme CMS"
description: "Obsidian est incroyablement pratique comme CMS pour les blogs"
category: "startup"
tags:
  - "management"
pubDate: 2024-09-11
authors:
  - default
heroImage: "https://cos.zbz.ai/images/202309151438569.avif"
heroImageAlt: "ZBZ-Utiliser Obsidian comme CMS"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: fr
---

Enfin, j'ai remplacé le cadre de ma plateforme de blog par Astro, ce qui offre non seulement des vitesses de chargement plus rapides, mais rend aussi les mises à jour et la maintenance plus simples. Les fichiers Markdown peuvent être synchronisés directement. J'utilisais Typora comme éditeur Markdown, qui offre une expérience WYSIWYG, et il est très facile de maintenir des fichiers individuels. Cependant, Typora ne dispose pas d'un gestionnaire de fichiers, rendant la gestion de plusieurs fichiers peu pratique. J'ai donc décidé d'utiliser Obsidian comme éditeur Markdown. Après une exploration approfondie, j'ai découvert qu'Obsidian est incroyablement pratique comme CMS pour les blogs.

- **Gestionnaire de fichiers** : Avec la fonction de recherche d'Obsidian, vous pouvez facilement ajouter, supprimer, modifier et rechercher des fichiers.
- **Propriétés du document** : À partir de la version 1.4 d'Obsidian, les propriétés de document ont été introduites, ce qui vous permet de formater les Frontmatter des fichiers Markdown dans un format fixe. Associé à la fonction de modèle, la rédaction de Frontmatter devient très pratique. Auparavant, avec Typora, le formatage du Frontmatter était strict et l'écriture manuelle entraînait souvent des erreurs. Maintenant, avec les propriétés du document d'Obsidian, les erreurs sont pratiquement impossibles.
- **Images** : Les images du blog sont hébergées sur Tencent Cloud COS, et Picgo est utilisé pour la gestion des images. Le plugin `Image auto upload` permet de télécharger rapidement des images. Vous pouvez utiliser soit Picgo.app soit Picgo-core. Si vous utilisez Picgo-core, vous pouvez le configurer avec [`picgo set uploader`](https://picgo.github.io/PicGo-Core-Doc/zh/guide/config.html#%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90). Si les téléchargements échouent, essayez d'activer l'option `Corriger la variable PATH` dans le plugin Obsidian.
- **Synchronisation** : Placez le coffre-fort Obsidian dans iCloud pour le synchroniser sur plusieurs appareils et éditer des documents à tout moment, n'importe où.
- **Publication** : Avec le plugin Git, une fois la publication programmée configurée, les articles seront automatiquement publiés sur la plateforme d'hébergement une fois rédigés.
