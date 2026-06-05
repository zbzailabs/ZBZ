---
title: "Aktivieren des QMD-Speicher-Backends für OpenClaw auf Apple Silicon Macs"
description: "Detaillierte Anleitung zur Konfiguration des QMD-Speicher-Backends für OpenClaw auf M-Series-Macs mit vollständigen Schritten und Auswahlempfehlungen"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-07
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260207-openclaw-qmd-guide.avif"
heroImageAlt: "Illustration des OpenClaw QMD-Konfigurationstutorials"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: de
---

> ⚠️ **Auswahlempfehlung**: Dieser Artikel dokumentiert den QMD-Konfigurationsprozess. Basierend auf praktischen Evaluierungen ist jedoch **der integrierte Index von OpenClaw für die meisten Szenarien ausreichend**. QMD erfordert zusätzlich ~600 MB Speicher und komplexere Wartung. Bitte entscheiden Sie basierend auf Ihren tatsächlichen Anforderungen (z.B. ob Sie vollständig offline arbeiten müssen oder extrem hohe Anforderungen an die Suchqualität haben), ob Sie es aktivieren möchten.

Dieser Artikel erklärt, wie Sie das QMD-Speicher-Backend (Query Markdown Database) für OpenClaw auf Apple Silicon Macs (M1/M2/M3/M4) konfigurieren und hybride Suche mit BM25 + Vektor + Reranking aktivieren.

## Voraussetzungen

- macOS 14+ (Sonoma / Sequoia)
- OpenClaw 2026.2.3-1 oder höher
- Homebrew (zur Installation von SQLite)

## Schritt 1: Bun installieren

QMD ist vom Bun-Runtime abhängig. Installieren Sie zunächst Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

Installation überprüfen:
```bash
~/.bun/bin/bun --version
# Ausgabe: 1.3.8
```

## Schritt 2: SQLite installieren (mit Erweiterungsunterstützung)

QMD erfordert SQLite mit Erweiterungsunterstützung:

```bash
brew install sqlite
```

## Schritt 3: QMD installieren

Installieren Sie QMD global mit Bun:

```bash
~/.bun/bin/bun install -g https://github.com/tobi/qmd
```

QMD-Installation überprüfen:
```bash
export PATH="$HOME/.bun/bin:$PATH"
qmd --version
```

## Schritt 4: OpenClaw für die Nutzung von QMD konfigurieren

Bearbeiten Sie die OpenClaw-Konfigurationsdatei:

```bash
openclaw config edit
```

Fügen Sie die `memory`-Konfiguration hinzu oder ändern Sie sie:

```json
{
  "memory": {
    "backend": "qmd"
  }
}
```

Vollständiges Konfigurationsbeispiel (mit optionalen Parametern):

```json
{
  "memory": {
    "backend": "qmd",
    "citations": "auto",
    "qmd": {
      "includeDefaultMemory": true,
      "update": { 
        "interval": "5m", 
        "debounceMs": 15000 
      },
      "limits": { 
        "maxResults": 6, 
        "timeoutMs": 4000 
      }
    }
  }
}
```

## Schritt 5: OpenClaw neu starten

```bash
openclaw gateway restart
```

## Schritt 6: QMD-Index initialisieren

Nach dem Neustart erstellt QMD automatisch den Index. Für manuelle Initialisierung:

```bash
# Umgebungsvariablen setzen
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"

# Sammlung erstellen
cd ~/.openclaw/workspace
qmd collection add memory --name memory-root --mask "**/*.md"

# Vektor-Embeddings generieren (lädt beim ersten Mal ~600 MB Modelle herunter)
qmd embed
```

Beim ersten Ausführen von `qmd embed` werden automatisch von HuggingFace heruntergeladen:
- `embeddinggemma-300M-Q8_0.gguf` (Embedding-Modell)
- `qwen3-reranker-0.6b-q8_0.gguf` (Reranking-Modell)
- `Qwen3-0.6B-Q8_0.gguf` (Query-Expansion-Modell)

## Schritt 7: Überprüfen, ob QMD funktioniert

Testen Sie die Speichersuche:

```bash
openclaw memory-search "OpenClaw memory system"
```

Wenn Sie `source: "qmd//memory-root/..."` sehen, ist QMD aktiv.

QMD-Status überprüfen:

```bash
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"
qmd status
```

## FAQ

### QMD funktioniert nicht, zeigt weiterhin integrierten Index an

Überprüfen Sie, ob `memory.backend` in `~/.openclaw/openclaw.json` auf `"qmd"` gesetzt ist, und starten Sie dann das Gateway neu.

### Modell-Download fehlgeschlagen

Benutzer in China können den HuggingFace-Spiegel einrichten:
```bash
export HF_ENDPOINT=https://hf-mirror.com
qmd embed
```

### Nicht genügend Speicher

M-Series-Macs sollten mindestens 8 GB Speicher haben. Wenn der Embedding-Prozess beendet wird, versuchen Sie, andere Anwendungen zu schließen.

## Konfigurationsreferenz

| Konfigurationselement | Beschreibung | Standardwert |
|-----------------------|--------------|--------------|
| `memory.backend` | Speicher-Backend-Typ | `"qmd"` |
| `memory.citations` | Zitationsquellen anzeigen | `"auto"` |
| `memory.qmd.update.interval` | Index-Aktualisierungsintervall | `"5m"` |
| `memory.qmd.limits.maxResults` | Maximale Anzahl von Ergebnissen | `6` |
| `memory.qmd.limits.timeoutMs` | Such-Timeout | `4000` |

## Zusammenfassung

Nach der Aktivierung von QMD verfügt die OpenClaw-Speichersuche über:
- **BM25-Volltextsuche**: Präzise Übereinstimmung von Schlüsselwörtern, IDs, Codesymbolen
- **Vektor-Semantiksuche**: Verständnis von Synonymen und konzeptuellen Assoziationen
- **Reranking-Optimierung**: Qwen3-Reranker verbessert die Relevanz

Im Vergleich zum integrierten SQLite + Gemini Embeddings läuft QMD vollständig lokal, ist nicht von externen APIs abhängig und bietet höhere Suchqualität.
