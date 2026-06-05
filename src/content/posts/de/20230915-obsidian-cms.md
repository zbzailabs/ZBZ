---
title: "Obsidian als CMS verwenden"
description: "Obsidian als CMS für Blogs ist äußerst praktisch"
category: "startup"
tags:
  - "model"
  - "allocation"
pubDate: 2024-09-11
authors:
  - default
heroImage: "https://cos.zbz.ai/images/202309151438569.avif"
heroImageAlt: "ZBZ-Obsidian als CMS verwenden"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: de
---

Endlich habe ich das Blog-Plattform-Framework auf Astro umgestellt. Dadurch wird nicht nur die Ladegeschwindigkeit verbessert, sondern auch die Aktualisierung und Wartung vereinfacht. Markdown-Dateien können direkt synchronisiert werden. Zuvor habe ich Typora als Markdown-Editor verwendet, der durch seine WYSIWYG-Funktionalität das Verwalten einzelner Dateien sehr leicht machte. Da Typora jedoch keinen Dateimanager hat, war das Verwalten mehrerer Dateien mühsam, daher habe ich den Markdown-Editor auf Obsidian umgestellt. Nach eingehender Untersuchung stellte ich fest, dass Obsidian als CMS für Blogs äußerst praktisch ist.

- **Dateimanager**: Mit der Suchfunktion von Obsidian ist es einfach, Dateien hinzuzufügen, zu löschen, zu ändern und zu durchsuchen.
- **Dokumenteigenschaften**: Seit Obsidian 1.4 gibt es die Dokumenteigenschaften, mit denen sich das Frontmatter von Markdown-Dateien in einem festen Format organisieren lässt. In Kombination mit der Vorlagenfunktion wird das Erstellen von Frontmatter sehr einfach. Als ich Typora verwendet habe, kam es häufig zu Fehlern beim manuellen Schreiben des strengen Frontmatter-Formats. Mit den Dokumenteigenschaften von Obsidian passieren solche Fehler fast nie.
- **Bilder**: Die Blog-Bilder werden in Tencent Cloud COS gehostet, und ich verwende Picgo, um die Bilder zu verwalten. Mit dem Plugin `Image auto upload Plugin` lassen sich Bilder schnell hochladen. Sie können entweder Picgo.app oder Picgo-core verwenden. Wenn Sie Picgo-core verwenden, können Sie es mit dem Befehl [`picgo set uploader`] konfigurieren. Sollte das Hochladen fehlschlagen, versuchen Sie, im Obsidian-Plugin die Option `PATH-Variable korrigieren` zu aktivieren.
- **Synchronisierung**: Wenn Sie die Obsidian-Bibliothek in iCloud ablegen, können Sie auf mehreren Geräten synchronisieren und Dokumente jederzeit und überall bearbeiten.
- **Veröffentlichung**: Mit dem Git-Plugin können Sie geplante Veröffentlichungen einrichten, und nach dem Schreiben eines Artikels wird dieser automatisch auf die Hosting-Plattform hochgeladen.
