---
title: "Un voyage de plagiat d'un skin Baidu copié"
description: "En tant que méthode de saisie personnelle, ne réinventez pas la roue. Copiez (plagiez/empruntez) les fichiers sources de skin de méthode de saisie existants et développez-les dans les plus brefs délais."
category: "life"
tags:
  - "roam"
pubDate: 2021-05-18
heroImage: "https://cos.zbz.ai/images/202310181257285.avif"
heroImageAlt: "ZBZ-"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "fr"
---

Skin de méthode de saisie Baidu pour macOS, style minimaliste, hautement personnalisable.

## Caractéristiques du skin

1. Convient à la méthode de saisie Baidu pour Mac.
2. Parfaitement adapté à macOS Monterey.
3. Style minimaliste, concentrez-vous sur la saisie.
4. Mettez en surbrillance le premier choix, concentrez-vous davantage sur la sélection des mots.
5. Hautement personnalisable, peut être personnalisé selon les besoins.

## Journal de mise à jour

### `V1.1` 2021-11-05

1. Règles de dénomination de fichiers unifiées.
2. Ajout de remarques pour une personnalisation facile.
3. Suppression de l'icône de changement de page à droite, rendant l'ensemble plus simple.
4. Ajout du fichier `global.ini`.
5. Ajout du skin graphite.
6. Mise à jour des exemples de skin.

### `V1.0` 2021-05-18

1. Skin publié.

## Instructions d'utilisation

1. Lorsqu'il n'y a pas de besoins particuliers, vous pouvez télécharger directement le package de skin au format `.bdskk` dans le dossier `examples` et double-cliquer pour l'installer et l'utiliser.
2. Si une personnalisation est requise, le fichier peut être modifié.
3. Compressez le contenu du dossier de ressources de skin dans un package compressé au format `.zip`, ne compressez pas le dossier entier.
4. Modifiez le package compressé en un package de skin au format `.bdskk`.
5. Double-cliquez sur le package d'installation pour l'importer dans la méthode de saisie Baidu.

## Structure du fichier

```json
└── src
    ├── global.ini
    ├── horizontal.ini
    ├── single.ini
    ├── statusbar.ini
    └── *.png
└── examples
└── README.md
└── LICENSE
```

1. `src` : Dossier de ressources.

2. `globe.ini` : Fichier de définition globale, peut définir le nom du skin, le type de skin, la description du skin, l'ID de l'auteur, l'e-mail, le site Web, etc. Les informations pertinentes seront affichées dans la page des paramètres d'apparence de la méthode de saisie Baidu Mac.

3. `horizontal.ini` : Fichier de configuration du mode double ligne. Le skin double ligne fait référence au mode qui affiche les codes de saisie et les mots candidats en même temps.

   **Zone de saisie & Zone de mots candidats** : Encadrez la plage de l'image d'arrière-plan du mode double ligne, comme indiqué sur la figure. Le principe de réglage de chaque paramètre dans les deux zones est le même.

   **Zone à neuf carrés** : L'arrière-plan de la barre de candidats s'adapte aux différentes longueurs de mots candidats de manière à s'étendre sur neuf carrés. Les quatre paramètres X / Y / Largeur / Hauteur définissent la zone verte dans la figure ci-dessous, qui est le palais central de la grille à neuf carrés.

   **Marge de contenu** : La distance entre le code de saisie et le bord de la tranche d'arrière-plan. Environ

   **Police & Couleur** : La couleur de la police et des mots candidats utilise le format hexadécimal RGB. Les éléments auxquels chaque champ fait référence sont indiqués dans la figure ci-dessous :

   **Symbole d'intervalle** : Définissez le symbole d'intervalle entre le numéro de série numérique et le mot candidat. L'espace est SPACE (majuscule) et les autres caractères sont saisis directement.

4. `single.ini` : Fichier de configuration du mode ligne unique. Le skin à ligne unique fait référence au mode qui n'affiche que les mots candidats, ce qui semble plus propre et plus simple sur Mac. Le mode ligne unique n'a besoin que de définir les paramètres de la zone de mots candidats. Le principe de prise d'effet du réglage des paramètres est le même que celui du skin double ligne.

5. `statusbar.ini` : Fichier de configuration de la barre d'état. Les icônes de la barre d'état peuvent être disposées n'importe où sur l'image d'arrière-plan de la barre d'état, il vous suffit de définir ses coordonnées horizontales et verticales. Toutes les valeurs de coordonnées sont basées sur le coin supérieur gauche.

6. `*.png` : Fichier de tranche de skin, vous pouvez remplacer le fichier correspondant par votre propre tranche.

7. `examples` : Exemples de skins, peuvent être téléchargés et utilisés directement.

8. `README.md` : Fichier lisez-moi du projet.

9. `LICENSE` : Ce projet suit la [licence MIT](https://github.com/xiyizhou/BaiduIM-Skin/blob/main/LICENSE). Vous pouvez utiliser, copier, modifier, fusionner, publier, distribuer, sous-licencier et vendre le logiciel et des copies du logiciel, et vous pouvez également modifier les conditions de licence pour un contenu approprié selon les besoins du programme.

## Contribution

Si vous avez des questions, des doutes ou des suggestions, n'hésitez pas à demander.

Cet ensemble de skins a encore les problèmes suivants à résoudre. Parce que je ne comprends pas le code du programme de méthode de saisie Baidu, ce développeur ne peut pas le mettre en œuvre en peu de temps. Si vous avez un moyen de le mettre en œuvre, vous êtes invités à contribuer.

- [ ] Perfectionner la barre d'état et le skin double ligne.

- [ ] Centrage vertical de la police de la zone candidate et de la couleur d'arrière-plan.

- [ ] Peut personnaliser le glyphe, la taille de la police et la couleur du numéro de série numérique du mot candidat pour obtenir un effet d'affichage similaire à la méthode de saisie intégrée Mac pour mettre en évidence les mots candidats.

- [ ] Le format de skin actuel est `.bdskk`, il faut passer au format de skin par défaut de la méthode de saisie Baidu Mac `.bpsm`.

- [ ] Développer des skins iPhone et iPad similaires aux skins qui peuvent personnaliser la couleur d'arrière-plan du mot préféré.
