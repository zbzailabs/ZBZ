---
title: "Eine Gatsby-Blog-Vorlage"
description: "Diese Website ist eine statische Website, die mit Gatsby erstellt wurde. Probieren Sie sie gerne aus."
category: "life"
tags:
  - "roam"
pubDate: 2021-11-20
heroImage: "https://cos.zbz.ai/images/202310181512144.avif"
heroImageAlt: "ZBZ-Eine Gatsby-Blog-Vorlage"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "de"
---

Eine Vorlage zum Erstellen statischer Websites mit Gatsby.

Der Quellcode befindet sich unter **[gatsby-starter-glass](https://github.com/xiyizhou/gatsby-starter-glass)**. Probieren Sie ihn gerne aus.

## Funktionen

- Sofort einsatzbereit
- Vollständig lokalisiert
- Enthält [Waline](https://waline.js.org)-Kommentare
- Enthält Google Analytics
- Markdown-Bearbeitung

## Lokale Bereitstellung

```bash
# 1. Lokal klonen
git clone https://github.com/xiyizhou/gatsby-starter-glass.git

# 2. cd in das Verzeichnis
cd gatsby-starter-glass

# 3. Abhängigkeiten installieren
yarn install

# 4. Entwicklungsmodus starten
yarn start

# 5. Produktionsversion erstellen
yarn  build
```

## Konfiguration

- Konfigurieren Sie Website-Informationen, Google Analytics-ID usw. in `gatsby-config.js`.
- Konfigurieren Sie Informationen zur oberen Navigationsleiste in `src/components/header.js`.
- Konfigurieren Sie Informationen zur unteren Navigationsleiste in `src/components/footer.js`.

- Konfigurieren Sie Waline-Informationen in `src/components/comment.js`.

## Artikelveröffentlichung

### Blog-Beiträge

Blog-Beiträge befinden sich in `content/blog`. Die Vorlage lautet wie folgt:

```md
---
title: Waline-Kommentar-Komponente für Gatsby installieren
date: 2021-11-17 08:08
slug: gatsby-waline
category: Leben
tags:
  - Leben
description: Da Waline noch keine Gatsby-Komponente hat, fügen Sie der Gatsby-Site Waline-Kommentarfunktionen hinzu, indem Sie die Waline-Client-Bibliothek installieren, eine React-Komponente erstellen und die Komponente an der entsprechenden Stelle einführen.
---

Gatsby ist ein auf React basierendes Framework zum Erstellen statischer Websites, mit dem Online-Shops, offizielle Websites und Blogs bereitgestellt werden können. Mit umfangreichen Plugins können Funktionen wie das verzögerte Laden von Bildern, die Unterstützung von Markdown-Dokumenten und Besucherkommentare realisiert werden. Zu den von Gatsby offiziell empfohlenen Kommentarsystemen gehören Disqus, Gitalk usw.
```

### Seiten

Seiteninhalte befinden sich in `content/pages`.

## Hinweise

- Dieser Starter basiert auf Gatsby V3. Achten Sie bei der Installation von Plugins auf die Versionskompatibilität.
- Das Hauptframework ist von [gatsby-starter-glass](https://github.com/yinkakun/gatsby-starter-glass) lokalisiert, danke an [yinkakun](https://github.com/yinkakun).
