---
title: "Activer le backend mémoire QMD pour OpenClaw sur Mac Apple Silicon"
description: "Guide détaillé pour configurer le backend mémoire QMD d'OpenClaw sur les Mac M-series, avec étapes complètes et recommandations de sélection"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-07
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260207-openclaw-qmd-guide.avif"
heroImageAlt: "Illustration du tutoriel de configuration OpenClaw QMD"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: fr
---

> ⚠️ **Recommandation de sélection** : Cet article documente le processus de configuration QMD. Cependant, sur la base d'une évaluation pratique, **l'index intégré d'OpenClaw est suffisant pour la plupart des scénarios**. QMD nécessite environ 600 Mo de mémoire supplémentaire et une maintenance plus complexe. Veuillez décider de l'activer en fonction de vos besoins réels (comme la nécessité de fonctionner complètement hors ligne ou d'avoir des exigences extrêmement élevées en matière de qualité de recherche).

Cet article explique comment configurer le backend mémoire QMD (Query Markdown Database) pour OpenClaw sur les Mac Apple Silicon (M1/M2/M3/M4), permettant une recherche hybride avec BM25 + vecteur + reranking.

## Prérequis

- macOS 14+ (Sonoma / Sequoia)
- OpenClaw 2026.2.3-1 ou ultérieur
- Homebrew (pour installer SQLite)

## Étape 1 : Installer Bun

QMD dépend du runtime Bun. Commencez par installer Bun :

```bash
curl -fsSL https://bun.sh/install | bash
```

Vérifier l'installation :
```bash
~/.bun/bin/bun --version
# Sortie : 1.3.8
```

## Étape 2 : Installer SQLite (avec support d'extension)

QMD nécessite SQLite avec support d'extension :

```bash
brew install sqlite
```

## Étape 3 : Installer QMD

Installez QMD globalement en utilisant Bun :

```bash
~/.bun/bin/bun install -g https://github.com/tobi/qmd
```

Vérifier l'installation de QMD :
```bash
export PATH="$HOME/.bun/bin:$PATH"
qmd --version
```

## Étape 4 : Configurer OpenClaw pour utiliser QMD

Modifiez le fichier de configuration d'OpenClaw :

```bash
openclaw config edit
```

Ajoutez ou modifiez la configuration `memory` :

```json
{
  "memory": {
    "backend": "qmd"
  }
}
```

Exemple de configuration complète (avec paramètres optionnels) :

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

## Étape 5 : Redémarrer OpenClaw

```bash
openclaw gateway restart
```

## Étape 6 : Initialiser l'index QMD

Après le redémarrage, QMD créera automatiquement l'index. Pour une initialisation manuelle :

```bash
# Définir les variables d'environnement
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"

# Créer la collection
cd ~/.openclaw/workspace
qmd collection add memory --name memory-root --mask "**/*.md"

# Générer les embeddings vectoriels (téléchargera ~600 Mo de modèles lors de la première exécution)
qmd embed
```

La première exécution de `qmd embed` téléchargera automatiquement depuis HuggingFace :
- `embeddinggemma-300M-Q8_0.gguf` (modèle d'embedding)
- `qwen3-reranker-0.6b-q8_0.gguf` (modèle de reranking)
- `Qwen3-0.6B-Q8_0.gguf` (modèle d'expansion de requête)

## Étape 7 : Vérifier que QMD fonctionne

Testez la recherche de mémoire :

```bash
openclaw memory-search "OpenClaw memory system"
```

Si vous voyez `source: "qmd//memory-root/..."`, QMD est actif.

Vérifier le statut de QMD :

```bash
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"
qmd status
```

## FAQ

### QMD ne fonctionne pas, affiche toujours l'index intégré

Vérifiez si `memory.backend` est défini sur `"qmd"` dans `~/.openclaw/openclaw.json`, puis redémarrez le Gateway.

### Échec du téléchargement du modèle

Les utilisateurs en Chine peuvent définir le miroir HuggingFace :
```bash
export HF_ENDPOINT=https://hf-mirror.com
qmd embed
```

### Mémoire insuffisante

Les Mac M-series doivent avoir au moins 8 Go de mémoire. Si le processus d'embedding est tué, essayez de fermer d'autres applications.

## Référence de configuration

| Élément de configuration | Description | Valeur par défaut |
|--------------------------|-------------|-------------------|
| `memory.backend` | Type de backend mémoire | `"qmd"` |
| `memory.citations` | Afficher les sources de citation | `"auto"` |
| `memory.qmd.update.interval` | Intervalle de mise à jour de l'index | `"5m"` |
| `memory.qmd.limits.maxResults` | Nombre maximum de résultats | `6` |
| `memory.qmd.limits.timeoutMs` | Délai d'expiration de la recherche | `4000` |

## Résumé

Après avoir activé QMD, la recherche de mémoire d'OpenClaw disposera de :
- **Recherche plein texte BM25** : Correspondance précise des mots-clés, IDs, symboles de code
- **Recherche sémantique vectorielle** : Compréhension des synonymes et associations conceptuelles
- **Optimisation du reranking** : Le reranker Qwen3 améliore la pertinence

Par rapport à l'index intégré SQLite + Gemini Embeddings, QMD fonctionne entièrement en local sans dépendre d'API externes et offre une qualité de recherche supérieure.
