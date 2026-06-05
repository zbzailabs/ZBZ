---
title: "Rime-Eingabemethode Multi-Geräte-Konfiguration"
description: "Kürzlich veröffentlichte das Ministerium für Industrie und Informationstechnologie Daten, die zeigen, dass fast alle gängigen Cloud-Eingabemethoden Benutzerdatenschutzdaten unter Verstoß gegen Vorschriften sammeln. Um sicher und geschützt einzugeben, können nur Offline-Eingabemethoden verwendet werden. Die derzeit beste Offline-Eingabemethode ist zweifellos Rime."
category: "startup"
tags:
  - "management"
pubDate: 2021-05-09
heroImage: "https://cos.zbz.ai/images/202310031635857.avif"
heroImageAlt: "ZBZ-"
heroImageWidth: 1944
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "de"
---

Kürzlich veröffentlichte das Ministerium für Industrie und Informationstechnologie Daten, die zeigen, dass fast alle gängigen Cloud-Eingabemethoden Benutzerdatenschutzdaten unter Verstoß gegen Vorschriften sammeln. Um sicher und geschützt einzugeben, können nur Offline-Eingabemethoden verwendet werden. Die derzeit beste Offline-Eingabemethode ist zweifellos [Rime](https://github.com/rime/home/wiki/Introduction).

Genau genommen ist Rime eine Open-Source-Plattformübergreifende Eingabemethoden-Engine. Der Code ist Open Source und vollständig offline. Durch extreme Anpassung und Abstimmung können Benutzer eine Eingabemethode anpassen, die für jeden geeignet ist. Der Vorteil ist Sicherheit und Unterstützung für mehrere Eingabeschemata; der Nachteil ist, dass der Thesaurus nicht stark genug ist, die Konfiguration komplex ist und die Thesaurus-Synchronisierung halbmanuell erfolgen muss.

### Mac-Version Installation

Die traditionelle chinesische Version, die ursprünglich von [Lotem](https://github.com/lotem), dem Autor von Rime, entwickelt wurde. Wenn Sie die vereinfachte Version verwenden möchten, können Sie sie gemäß dem Tutorial von [Yifang](https://github.com/maomiui/rime) konfigurieren. Beachten Sie während des Konfigurationsprozesses Folgendes:

- Es gibt einen FEHLER in der aktuellen Version (2021-05-12). Wenn in `luna_pinyin_simp.custom.yaml` aktiviert
  `- derive/^([zcs])h/$1/ # zh, ch, sh => z, c, s`
  `- derive/^([zcs])([^h])/$1h$2/ # z, c, s => zh, ch, sh`
  Nach unscharfem Ton werden Emoji und dynamische Zeit ungültig.

- Der Autor hat eine Vielzahl von Eingabeschemata vorbereitet. Wenn Sie Xiaohe Shuangpin usw. nicht verwenden, können Sie die entsprechenden Konfigurationsdateien löschen.

- Auch wenn Sie Luna Pinyin Traditional nicht verwenden, löschen Sie keine Dateien wie `luna_pinyin.zonghe.dict.yaml` und `luna_pinyin.dict.yaml`. Das Löschen kann dazu führen, dass notwendige Wörter fehlen.

- Allgemeine Informationen wie E-Mail und Adresse können in `custom_phrase.txt` festgelegt werden.

- Sie können das Thema in der Datei `squirrel.custom.yaml` ändern und ändern. Basierend auf dem Thema `macos_light` hat der Autor beispielsweise ein Thema "Pink World" der Google Pinyin-Eingabemethode imitiert.

### Win10-Version Installation

Für die Win10-Version von Rime Weasel folgen Sie einfach dem [offiziellen Tutorial](https://github.com/rime/weasel) zur Installation. Nach Abschluss der Installation können Sie die Mac-Konfigurationsdatei zur Verwendung kopieren. Muss beachtet werden

- Muss `squirrel.custom.yaml` als `weasel.custom.yaml` benennen

- Skin-Einzel- und Doppellinien, Pinyin-Einzeilenanzeige usw. werden in `weasel.custom.yaml` wie folgt angepasst:

  ```yaml
  # Text horizontale Anordnung
  style/horizontal: true

  # Einzeilige Anzeige
  style/inline_preedit: true

  # Skin ändern
  style/color_scheme: win10
  ```

- Der Synchronisierungspfad in `installation.yaml` ist für Win und Mac unterschiedlich. Einfache Anführungszeichen oder doppelte Anführungszeichen sind in Win nicht erforderlich.

  ```yaml
  # win Synchronisierungspfadformat
  sync_dir: C:\Users\Benutzername\iCloudDrive\Rime

  # mac Synchronisierungspfadformat
  sync_dir: "/Users/Benutzername/Library/Mobile Documents/com~apple~CloudDocs/Rime"
  ```

- Unter win10 können Sie den win10-Taskplaner verwenden, um Daten [automatisch](https://www.cnblogs.com/cstylex/p/Rime_on_Linux_Android_Mac_Windows_iOS_sync.html) zu synchronisieren. Es gibt noch keine Möglichkeit, eine automatische Synchronisierung auf dem Mac zu erreichen.

Für Android-Telefone können Sie [Trime](https://github.com/osfans/trime) installieren und verwenden, und für iOS-Telefone können Sie [iRime](https://apps.apple.com/cn/app/irime%E8%BE%93%E5%85%A5%E6%B3%95/id1142623977) installieren und verwenden.
