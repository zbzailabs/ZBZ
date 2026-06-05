---
title: "Enabling QMD Memory Backend for OpenClaw on M-Series Mac"
description: "A detailed guide on configuring the QMD memory backend on Apple Silicon Mac, including complete steps and selection recommendations"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-07
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260207-openclaw-qmd-guide.avif"
heroImageAlt: "OpenClaw QMD Configuration Tutorial"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: en
---

> ⚠️ **Selection Recommendation**: This article documents the QMD configuration process, but after practical evaluation, **the built-in OpenClaw indexing is sufficient for most scenarios**. QMD requires an additional ~600MB of memory and more complex maintenance. Please decide whether to enable it based on actual needs (such as whether fully offline operation is required, or if there are extremely high requirements for search quality).

This article explains how to configure QMD (Query Markdown Database) memory backend for OpenClaw on Apple Silicon (M1/M2/M3/M4) Mac, implementing hybrid search with BM25 + vectors + reranking.

## Prerequisites

- macOS 14+ (Sonoma / Sequoia)
- OpenClaw 2026.2.3-1 or higher
- Homebrew (for installing SQLite)

## Step 1: Install Bun

QMD depends on the Bun runtime. First, install Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

Verify installation:
```bash
~/.bun/bin/bun --version
# Output: 1.3.8
```

## Step 2: Install SQLite (with Extension Support)

QMD requires SQLite with extension support:

```bash
brew install sqlite
```

## Step 3: Install QMD

Use Bun to install QMD globally:

```bash
~/.bun/bin/bun install -g https://github.com/tobi/qmd
```

Verify QMD installation:
```bash
export PATH="$HOME/.bun/bin:$PATH"
qmd --version
```

## Step 4: Configure OpenClaw to Use QMD

Edit the OpenClaw configuration file:

```bash
openclaw config edit
```

Add or modify the `memory` configuration:

```json
{
  "memory": {
    "backend": "qmd"
  }
}
```

Complete configuration example (with optional parameters):

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

## Step 5: Restart OpenClaw

```bash
openclaw gateway restart
```

## Step 6: Initialize QMD Index

After restarting, QMD will automatically create the index. To manually initialize:

```bash
# Set environment variables
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"

# Create collection
cd ~/.openclaw/workspace
qmd collection add memory --name memory-root --mask "**/*.md"

# Generate vector embeddings (will download ~600MB models on first run)
qmd embed
```

The first time you run `qmd embed`, it will automatically download from HuggingFace:
- `embeddinggemma-300M-Q8_0.gguf` (embedding model)
- `qwen3-reranker-0.6b-q8_0.gguf` (reranking model)
- `Qwen3-0.6B-Q8_0.gguf` (query expansion model)

## Step 7: Verify QMD is Active

Test memory search:

```bash
openclaw memory-search "OpenClaw memory system"
```

If you see `source: "qmd//memory-root/..."`, QMD is active.

Check QMD status:

```bash
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"
qmd status
```

## FAQ

### QMD Not Active, Still Shows Built-in Index

Check if `memory.backend` is set to `"qmd"` in `~/.openclaw/openclaw.json`, then restart Gateway.

### Model Download Failed

Users in mainland China can set a HuggingFace mirror:
```bash
export HF_ENDPOINT=https://hf-mirror.com
qmd embed
```

### Insufficient Memory

M-series Macs should have at least 8GB of memory. If the embedding process is killed, try closing other applications.

## Configuration Reference

| Configuration Item | Description | Default Value |
|--------|------|--------|
| `memory.backend` | Memory backend type | `"qmd"` |
| `memory.citations` | Whether to show citation sources | `"auto"` |
| `memory.qmd.update.interval` | Index update interval | `"5m"` |
| `memory.qmd.limits.maxResults` | Maximum number of results returned | `6` |
| `memory.qmd.limits.timeoutMs` | Search timeout | `4000` |

## Summary

After enabling QMD, OpenClaw's memory search will have:
- **BM25 Full-Text Search**: Precise matching of keywords, IDs, code symbols
- **Vector Semantic Search**: Understanding synonyms, concept associations
- **Reranking Optimization**: Qwen3 reranker improves relevance

Compared to the built-in SQLite + Gemini Embeddings, QMD runs entirely locally without relying on external APIs, and provides higher search quality.
