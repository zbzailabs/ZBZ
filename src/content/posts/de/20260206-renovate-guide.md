---
title: "Renovate Anleitung für automatische Abhängigkeitsupdates"
description: "Verwendung von Renovate zur vollständigen Automatisierung von Abhängigkeitsupdates für GitHub-Repositories ohne manuellen Eingriff"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-06
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260206-renovate-guide.avif"
heroImageAlt: "Automatische Abhängigkeitsupdates mit Renovate"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: de
---

## Einleitung

Die Wartung von Projektabhängigkeiten ist Teil der täglichen Arbeit von Entwicklern. Das manuelle Überprüfen, Aktualisieren und Testen von Abhängigkeitsversionen ist nicht nur zeitaufwändig, sondern auch fehleranfällig. Dieser Artikel erklärt, wie Sie mit **Renovate** vollständig automatisierte Abhängigkeitsupdates erreichen.

## Ziele

- Täglich in der Morgendämmerung automatisch nach Updates suchen
- PRs automatisch erstellen und zusammenführen (nach Bestehen der CI)
- Kein manueller Eingriff, läuft im Hintergrund
- Einheitliche Verwaltung über mehrere Repositories

## Renovate installieren

1. Besuchen Sie [GitHub Apps - Renovate](https://github.com/apps/renovate)
2. Klicken Sie auf **Installieren**
3. Wählen Sie die zu aktivierenden Repositories (alle oder bestimmte)
4. Schließen Sie die Autorisierung ab

## Konfigurationsdatei

Erstellen Sie `renovate.json` im Repository-Stammverzeichnis:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    ":automergeAll",
    ":disableDependencyDashboard"
  ],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
```

Commit und Push:

```bash
git add renovate.json
git commit -m "chore: configure Renovate for automated dependency updates"
git push
```

## Konfigurationsdetails

| Option | Beschreibung |
|--------|--------------|
| `config:recommended` | Offiziell empfohlene Basiskonfiguration von Renovate |
| `:automergeAll` | **Kernoption** — automatisches Zusammenführen aller Updates (einschließlich Major-Versionen) |
| `:disableDependencyDashboard` | Deaktivieren des Dashboard-Issues für reinen Hintergrundbetrieb |
| `timezone` | Zeitzone auf Asien/Shanghai setzen |
| `schedule` | Täglich vor 3:00 Uhr morgens ausführen |

## Workflow

```
Täglich um 3:00 Uhr morgens
    ↓
Renovate überprüft package.json-Abhängigkeiten
    ↓
Verfügbare Updates erkannt
    ↓
Automatische Erstellung von Pull Requests
    ↓
CI-Überprüfungen auslösen
    ↓
CI bestanden → Automatisches Zusammenführen in den main-Branch
    ↓
Am nächsten Morgen aktualisierte Abhängigkeiten sehen
```

## Multi-Repository-Konfiguration

Für mehrere Projekte dieselbe Konfigurationsdatei kopieren:

```bash
# Universelle Konfiguration erstellen
cat > renovate.json << 'EOF'
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended", ":automergeAll", ":disableDependencyDashboard"],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
EOF

# Auf mehrere Repositories anwenden
for repo in repo1 repo2 repo3; do
  cp renovate.json $repo/
  cd $repo && git add . && git commit -m "chore: configure Renovate" && git push
  cd ..
done
```

## FAQ

### PR wird nicht automatisch zusammengeführt?

Überprüfen Sie den CI-Status. Renovate führt nur nach Bestehen aller CI-Überprüfungen zusammen. Wenn CI fehlschlägt, beheben Sie das Problem manuell und führen Sie erneut aus.

### Wie löst man sofort Updates aus?

- Wenn Dashboard aktiviert: Gehen Sie zu Issues → Dependency Dashboard → Pakete zum Aktualisieren auswählen → Auf Rebase klicken
- Oder warten Sie auf die automatische Ausführung zur geplanten Zeit

### Wie schließt man bestimmte Abhängigkeiten aus?

Fügen Sie Ausschlussregeln in der Konfiguration hinzu:

```json
{
  "packageRules": [{
    "matchPackageNames": ["package-name"],
    "enabled": false
  }]
}
```

### Unterstützung für pnpm / yarn / npm?

Renovate erkennt Lock-Dateitypen automatisch, keine zusätzliche Konfiguration nötig.

## Überprüfung

Nach dem Pushen der Konfiguration wird Renovate automatisch ausgeführt (oder wartet auf die geplante Zeit). Überprüfungsschritte:

1. Gehen Sie zur Seite **Pull requests** des Repositories
2. Sehen Sie die von Renovate erstellten PRs an (Titelformat: `chore(deps): update ...`)
3. Bestätigen Sie, dass automatisches Zusammenführen für den PR aktiviert ist
4. Automatisches Zusammenführen nach Bestehen der CI

## Zusammenfassung

Nur 5 Zeilen Kernkonfiguration:

```json
{
  "extends": [
    "config:recommended",
    "automergeAll",
    "disableDependencyDashboard"
  ],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
```

Erreichen Sie vollständig automatisiertes Abhängigkeitsmanagement, damit sich Entwickler auf Geschäftscode konzentrieren können.
