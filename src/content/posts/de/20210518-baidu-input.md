---
title: "Eine Plagiatsreise einer nachgeahmten Baidu-Haut"
description: "Erfinden Sie als persönliche Eingabemethode das Rad nicht neu. Kopieren (plagiieren/ausleihen) Sie vorhandene Quelldateien für Eingabemethoden-Skins und entwickeln Sie sie in kürzester Zeit."
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
locale: "de"
---

Baidu-Eingabemethoden-Skin für macOS, minimalistischer Stil, hochgradig anpassbar.

## Skin-Funktionen

1. Geeignet für Baidu-Eingabemethode für Mac.
2. Perfekt an macOS Monterey angepasst.
3. Minimalistischer Stil, Fokus auf Eingabe.
4. Markieren Sie die erste Wahl, konzentrieren Sie sich mehr auf die Wortwahl.
5. Hochgradig anpassbar, kann je nach Bedarf personalisiert werden.

## Update-Protokoll

### `V1.1` 2021-11-05

1. Einheitliche Dateibenennungsregeln.
2. Bemerkungen zur einfachen Anpassung hinzugefügt.
3. Das Symbol zum Umblättern auf der rechten Seite wurde entfernt, wodurch das Ganze einfacher wurde.
4. Datei `global.ini` hinzugefügt.
5. Graphit-Skin hinzugefügt.
6. Skin-Beispiele aktualisiert.

### `V1.0` 2021-05-18

1. Skin veröffentlicht.

## Gebrauchsanweisung

1. Wenn keine besonderen Anforderungen bestehen, können Sie das Skin-Paket im Format `.bdskk` direkt im Ordner `examples` herunterladen und zum Installieren und Verwenden doppelklicken.
2. Wenn eine Anpassung erforderlich ist, kann die Datei geändert werden.
3. Komprimieren Sie den Inhalt des Skin-Ressourcenordners in ein komprimiertes Paket im Format `.zip`, komprimieren Sie nicht den gesamten Ordner.
4. Ändern Sie das komprimierte Paket in ein Skin-Paket im Format `.bdskk`.
5. Doppelklicken Sie auf das Installationspaket, um es in die Baidu-Eingabemethode zu importieren.

## Dateistruktur

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

1. `src`: Ressourcenordner.

2. `globe.ini`: Globale Definitionsdatei, kann Skin-Namen, Skin-Typ, Skin-Beschreibung, Autoren-ID, E-Mail, Website usw. definieren. Relevante Informationen werden auf der Seite mit den Erscheinungsbild-Einstellungen der Baidu Mac-Eingabemethode angezeigt.

3. `horizontal.ini`: Konfigurationsdatei für den zweizeiligen Modus. Zweizeiliger Skin bezieht sich auf den Modus, der Eingabecodes und Kandidatenwörter gleichzeitig anzeigt.

   **Eingabebereich & Kandidatenwortbereich**: Rahmen Sie den Hintergrundbildbereich des zweizeiligen Modus ein, wie in der Abbildung gezeigt. Das Einstellungsprinzip jedes Parameters in den beiden Bereichen ist gleich.

   **Neun-Quadrat-Bereich**: Der Hintergrund der Kandidatenleiste passt sich auf neunquadratische Erweiterungsweise an unterschiedliche Kandidatenwortlängen an. Die vier Parameter X / Y / Breite / Höhe definieren den grünen Bereich in der Abbildung unten, der der mittlere Palast des Neun-Quadrat-Gitters ist.

   **Inhaltsrand**: Der Abstand zwischen dem Eingabecode und dem Rand des Hintergrundslices. Ungefähr

   **Schriftart & Farbe**: Die Farbe der Schriftart und der Kandidatenwörter verwendet das hexadezimale RGB-Format. Die Elemente, auf die sich jedes Feld bezieht, sind in der folgenden Abbildung dargestellt:

   **Intervall-Symbol**: Legen Sie das Intervall-Symbol zwischen der digitalen Seriennummer und dem Kandidatenwort fest. Das Leerzeichen ist SPACE (Großbuchstaben), und andere Zeichen werden direkt eingegeben.

4. `single.ini`: Konfigurationsdatei für den einzeiligen Modus. Einzeiliger Skin bezieht sich auf den Modus, der nur Kandidatenwörter anzeigt, was auf dem Mac sauberer und einfacher aussieht. Der einzeilige Modus muss nur die Parameter des Kandidatenwortbereichs festlegen. Das Prinzip des Inkrafttretens der Parametereinstellung ist das gleiche wie beim zweizeiligen Skin.

5. `statusbar.ini`: Konfigurationsdatei für die Statusleiste. Die Symbole in der Statusleiste können überall auf dem Hintergrundbild der Statusleiste angeordnet werden, Sie müssen nur ihre horizontalen und vertikalen Koordinaten festlegen. Alle Koordinatenwerte basieren auf der oberen linken Ecke.

6. `*.png`: Skin-Slice-Datei, Sie können die entsprechende Datei durch Ihr eigenes Slice ersetzen.

7. `examples`: Beispiel-Skins, können direkt heruntergeladen und verwendet werden.

8. `README.md`: Projekt-Readme-Datei.

9. `LICENSE`: Dieses Projekt folgt der [MIT-Lizenz](https://github.com/xiyizhou/BaiduIM-Skin/blob/main/LICENSE). Sie können die Software und Kopien der Software verwenden, kopieren, ändern, zusammenführen, veröffentlichen, verteilen, unterlizenzieren und verkaufen, und Sie können auch die Lizenzbedingungen an den entsprechenden Inhalt gemäß den Anforderungen des Programms anpassen.

## Beitrag

Wenn Sie Fragen, Zweifel oder Vorschläge haben, können Sie diese gerne stellen.

Dieses Set von Skins hat noch die folgenden Probleme zu lösen. Da ich den Programmcode der Baidu-Eingabemethode nicht verstehe, kann dieser Entwickler ihn nicht in kurzer Zeit implementieren. Wenn Sie eine Möglichkeit haben, ihn zu implementieren, können Sie gerne einen Beitrag leisten.

- [ ] Statusleiste und zweizeiligen Skin perfektionieren.

- [ ] Vertikale Zentrierung der Schriftart und Hintergrundfarbe des Kandidatenbereichs.

- [ ] Kann die Glyphe, Schriftgröße und Farbe der digitalen Seriennummer des Kandidatenworts anpassen, um einen Anzeigeeffekt zu erzielen, der der integrierten Mac-Eingabemethode ähnelt, um Kandidatenwörter hervorzuheben.

- [ ] Das aktuelle Skin-Format ist `.bdskk`, muss auf das Standard-Skin-Format der Baidu Mac-Eingabemethode `.bpsm` umgestellt werden.

- [ ] iPhone- und iPad-Skins entwickeln, die Skins ähneln, die die Hintergrundfarbe des bevorzugten Wortes anpassen können.
