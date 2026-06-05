---
title: "Configuration multi-appareils de la méthode de saisie Rime"
description: "Récemment, le ministère de l'Industrie et des Technologies de l'information a publié des données montrant que presque toutes les méthodes de saisie cloud courantes collectent des données de confidentialité des utilisateurs en violation des réglementations. Pour saisir en toute sécurité, seules les méthodes de saisie hors ligne peuvent être utilisées. La meilleure méthode de saisie hors ligne est sans aucun doute Rime."
category: "startup"
tags:
  - "management"
pubDate: 2021-05-09
heroImage: "https://cos.zbz.ai/images/202310031635857.avif"
heroImageAlt: "RealRip-"
heroImageWidth: 1944
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "fr"
---

Récemment, le ministère de l'Industrie et des Technologies de l'information a publié des données montrant que presque toutes les méthodes de saisie cloud courantes collectent des données de confidentialité des utilisateurs en violation des réglementations. Pour saisir en toute sécurité, seules les méthodes de saisie hors ligne peuvent être utilisées. La meilleure méthode de saisie hors ligne est sans aucun doute [Rime](https://github.com/rime/home/wiki/Introduction).

Pour être précis, Rime est un moteur de méthode de saisie multiplateforme open source. Le code est open source et complètement hors ligne. Grâce à une personnalisation et un réglage extrêmes, les utilisateurs peuvent personnaliser une méthode de saisie qui convient à tout le monde. L'avantage est la sécurité et la prise en charge de plusieurs schémas de saisie ; l'inconvénient est que le thésaurus n'est pas assez puissant, la configuration est complexe et la synchronisation du thésaurus doit être effectuée de manière semi-manuelle.

### Installation de la version Mac

La version chinoise traditionnelle développée à l'origine par [Lotem](https://github.com/lotem), l'auteur de Rime. Si vous souhaitez utiliser la version simplifiée, vous pouvez la configurer selon le tutoriel de [Yifang](https://github.com/maomiui/rime). Notez ce qui suit pendant le processus de configuration :

- Il y a un BUG dans la version actuelle (2021-05-12). Si activé dans `luna_pinyin_simp.custom.yaml`
  `- derive/^([zcs])h/$1/ # zh, ch, sh => z, c, s`
  `- derive/^([zcs])([^h])/$1h$2/ # z, c, s => zh, ch, sh`
  Après le son flou, les Emoji et l'heure dynamique deviennent invalides.

- L'auteur a préparé une variété de schémas de saisie. Si vous n'utilisez pas Xiaohe Shuangpin, etc., vous pouvez supprimer les fichiers de configuration correspondants.

- Même si vous n'utilisez pas Luna Pinyin Traditional, ne supprimez pas les fichiers tels que `luna_pinyin.zonghe.dict.yaml` et `luna_pinyin.dict.yaml`. La suppression peut entraîner un manque de mots nécessaires.

- Les informations courantes telles que l'e-mail et l'adresse peuvent être définies dans `custom_phrase.txt`.

- Vous pouvez modifier et changer le thème dans le fichier `squirrel.custom.yaml`. Par exemple, basé sur le thème `macos_light`, l'auteur a imité un thème « Pink World » de la méthode de saisie Google Pinyin.

### Installation de la version Win10

Pour la version Win10 de Rime Weasel, suivez simplement le [tutoriel officiel](https://github.com/rime/weasel) pour l'installer. Une fois l'installation terminée, vous pouvez copier le fichier de configuration Mac pour l'utiliser. Il faut faire attention à

- Il faut nommer `squirrel.custom.yaml` en `weasel.custom.yaml`

- Les lignes simples et doubles de l'apparence, l'affichage sur une seule ligne Pinyin, etc. sont personnalisés dans `weasel.custom.yaml` comme suit :

  ```yaml
  # Disposition horizontale du texte
  style/horizontal: true

  # Affichage sur une seule ligne
  style/inline_preedit: true

  # Changer de thème
  style/color_scheme: win10
  ```

- Le chemin de synchronisation dans `installation.yaml` est différent pour Win et Mac. Les guillemets simples ou doubles ne sont pas requis dans Win.

  ```yaml
  # format du chemin de synchronisation win
  sync_dir: C:\Users\Nomdutilisateur\iCloudDrive\Rime

  # format du chemin de synchronisation mac
  sync_dir: "/Users/Nomdutilisateur/Library/Mobile Documents/com~apple~CloudDocs/Rime"
  ```

- Sur win10, vous pouvez utiliser le planificateur de tâches win10 pour synchroniser [automatiquement](https://www.cnblogs.com/cstylex/p/Rime_on_Linux_Android_Mac_Windows_iOS_sync.html) les données. Il n'y a pas encore moyen de réaliser une synchronisation automatique sur Mac.

Pour les téléphones Android, vous pouvez installer et utiliser [Trime](https://github.com/osfans/trime), et pour les téléphones iOS, vous pouvez installer et utiliser [iRime](https://apps.apple.com/cn/app/irime%E8%BE%93%E5%85%A5%E6%B3%95/id1142623977).
