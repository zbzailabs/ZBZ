---
title: "Mon flux de travail collaboratif avec l'IA"
description: "Comment j'utilise ChatGPT, Codex, Pulse et deep research d'OpenAI pour les dossiers de projet et le développement logiciel"
category: "startup"
tags:
  - "allocation"
  - "strategy"
  - "innovation"
pubDate: 2026-06-02
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260603105442913.avif"
heroImageAlt: "Mon flux de travail collaboratif avec l'IA"
heroImageWidth: 2400
heroImageHeight: 1350
draft: false
featured: false
locale: fr
---

J'utilise ChatGPT depuis 2023. Je suis passé d'un usage ordinaire à un abonnement payant, puis de Plus à Pro. Au second semestre 2025, lorsque Gemini a soudainement gagné en puissance, j'ai brièvement changé de plateforme pour Gemini. Après la sortie de GPT-5.5, je suis revenu dans l'écosystème OpenAI. Les raisons principales sont au nombre de deux. Premièrement, les capacités de GPT-5.5 restent largement en avance sur celles des autres modèles. Les concours de scores entre grands modèles ont peu de sens pour les utilisateurs ordinaires. Ce que les utilisateurs veulent, c'est une productivité réelle. Aujourd'hui, GPT atteint vraiment un niveau de productivité livrable. Deuxièmement, OpenAI a beaucoup travaillé sur la transformation de ses modèles en produits. Codex, Pulse et deep research abaissent chacun le seuil d'utilisation.

Actuellement, j'utilise principalement les produits OpenAI pour deux types de travail : les dossiers de projet et la programmation. Pour les dossiers de projet, mon processus est le suivant : utiliser Feishu Minutes/Lark Minutes pour transformer les enregistrements audio des visites de terrain et des échanges client en comptes rendus de réunion ; transmettre à ChatGPT les comptes rendus validés ainsi que les autres documents du projet ; utiliser deep research pour obtenir une première version du dossier ; exporter une version Word pour vérification et révision ; enfin, utiliser Codex pour ajuster la mise en forme du texte. S'il faut aussi produire un PowerPoint, je continue avec le plugin presentations de Codex pour créer le PPT. Bien entendu, le PPT produit par presentations n'est pas parfait, et certains skills PowerPoint open source sur GitHub permettent de l'améliorer.

Pour corriger des bugs et ajuster des fonctionnalités, Codex suffit largement. Pour développer un système complet de grande taille à partir de zéro, Codex rencontre encore de nombreux défis, notamment le risque de partir dans tous les sens. Dans ce cas, le point le plus important est de fixer clairement les limites : pile technique, périmètre fonctionnel, etc. Pour initialiser un projet, il faut d'abord confirmer deux fichiers : `AGENTS.md` et `DESIGN.md`. `AGENTS.md` sert à cadrer la pile technique, les règles d'ingénierie et les limites d'exécution ; `DESIGN.md` sert à cadrer les couleurs, les polices, le style des composants et les autres règles visuelles. La deuxième étape consiste à choisir la pile technique. Il faut choisir des technologies que l'IA sait bien utiliser, comme React + TypeScript, plutôt que des technologies dans lesquelles les humains sont souvent plus à l'aise, comme Java.

L'IA a changé le rythme de travail, et le sujet de la santé ne peut pas être ignoré. Les agents IA améliorent effectivement beaucoup l'efficacité. Si l'une de vos tâches n'est pas terminée, l'agent peut achever rapidement sa partie puis vous pousser à avancer, ce qui vous oblige à continuer sans cesse. C'est un travail intense, sans vraie possibilité de relâche. Le cerveau tourne en continu, et cela devient très fatigant sur la durée. Il faut donc un moyen externe pour vous arrêter. La meilleure méthode reste la technique Pomodoro : travailler 25 minutes, se reposer 5 minutes, et laisser le cerveau récupérer. Bien sûr, si la coordination avec l'agent est bonne, vous pouvez tout à fait vous reposer pendant que l'agent travaille.
