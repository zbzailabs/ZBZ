---
title: "Habilitar el backend de memoria QMD para OpenClaw en Mac Apple Silicon"
description: "Guía detallada para configurar el backend de memoria QMD de OpenClaw en Mac M-series, con pasos completos y recomendaciones de selección"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-07
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260207-openclaw-qmd-guide.avif"
heroImageAlt: "Ilustración del tutorial de configuración de OpenClaw QMD"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: es
---

> ⚠️ **Recomendación de selección**: Este artículo documenta el proceso de configuración de QMD. Sin embargo, basándose en una evaluación práctica, **el índice integrado de OpenClaw es suficiente para la mayoría de los escenarios**. QMD requiere aproximadamente 600 MB de memoria adicional y un mantenimiento más complejo. Por favor, decida si habilitarlo en función de sus necesidades reales (como si necesita funcionar completamente sin conexión o tener requisitos extremadamente altos de calidad de búsqueda).

Este artículo explica cómo configurar el backend de memoria QMD (Query Markdown Database) para OpenClaw en Mac Apple Silicon (M1/M2/M3/M4), habilitando la búsqueda híbrida con BM25 + vector + reordenamiento.

## Requisitos previos

- macOS 14+ (Sonoma / Sequoia)
- OpenClaw 2026.2.3-1 o posterior
- Homebrew (para instalar SQLite)

## Paso 1: Instalar Bun

QMD depende del runtime Bun. Primero instale Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

Verificar instalación:
```bash
~/.bun/bin/bun --version
# Salida: 1.3.8
```

## Paso 2: Instalar SQLite (con soporte de extensiones)

QMD requiere SQLite con soporte de extensiones:

```bash
brew install sqlite
```

## Paso 3: Instalar QMD

Instale QMD globalmente usando Bun:

```bash
~/.bun/bin/bun install -g https://github.com/tobi/qmd
```

Verificar instalación de QMD:
```bash
export PATH="$HOME/.bun/bin:$PATH"
qmd --version
```

## Paso 4: Configurar OpenClaw para usar QMD

Edite el archivo de configuración de OpenClaw:

```bash
openclaw config edit
```

Agregue o modifique la configuración de `memory`:

```json
{
  "memory": {
    "backend": "qmd"
  }
}
```

Ejemplo de configuración completa (con parámetros opcionales):

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

## Paso 5: Reiniciar OpenClaw

```bash
openclaw gateway restart
```

## Paso 6: Inicializar el índice QMD

Después de reiniciar, QMD creará automáticamente el índice. Para inicialización manual:

```bash
# Establecer variables de entorno
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"

# Crear colección
cd ~/.openclaw/workspace
qmd collection add memory --name memory-root --mask "**/*.md"

# Generar embeddings vectoriales (descargará ~600 MB de modelos en la primera ejecución)
qmd embed
```

La primera ejecución de `qmd embed` descargará automáticamente desde HuggingFace:
- `embeddinggemma-300M-Q8_0.gguf` (modelo de embedding)
- `qwen3-reranker-0.6b-q8_0.gguf` (modelo de reordenamiento)
- `Qwen3-0.6B-Q8_0.gguf` (modelo de expansión de consultas)

## Paso 7: Verificar que QMD está funcionando

Pruebe la búsqueda de memoria:

```bash
openclaw memory-search "OpenClaw memory system"
```

Si ve `source: "qmd//memory-root/..."`, QMD está activo.

Verificar el estado de QMD:

```bash
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"
qmd status
```

## Preguntas frecuentes

### QMD no funciona, sigue mostrando el índice integrado

Verifique si `memory.backend` está configurado como `"qmd"` en `~/.openclaw/openclaw.json`, luego reinicie el Gateway.

### Falla en la descarga del modelo

Los usuarios en China pueden configurar el espejo de HuggingFace:
```bash
export HF_ENDPOINT=https://hf-mirror.com
qmd embed
```

### Memoria insuficiente

Los Mac M-series deben tener al menos 8 GB de memoria. Si el proceso de embedding es terminado, intente cerrar otras aplicaciones.

## Referencia de configuración

| Elemento de configuración | Descripción | Valor por defecto |
|---------------------------|-------------|-------------------|
| `memory.backend` | Tipo de backend de memoria | `"qmd"` |
| `memory.citations` | Mostrar fuentes de citas | `"auto"` |
| `memory.qmd.update.interval` | Intervalo de actualización del índice | `"5m"` |
| `memory.qmd.limits.maxResults` | Número máximo de resultados | `6` |
| `memory.qmd.limits.timeoutMs` | Tiempo de espera de búsqueda | `4000` |

## Resumen

Después de habilitar QMD, la búsqueda de memoria de OpenClaw tendrá:
- **Búsqueda de texto completo BM25**: Coincidencia precisa de palabras clave, IDs, símbolos de código
- **Búsqueda semántica vectorial**: Comprensión de sinónimos y asociaciones conceptuales
- **Optimización de reordenamiento**: El reordenador Qwen3 mejora la relevancia

En comparación con el SQLite integrado + Gemini Embeddings, QMD funciona completamente en local sin depender de APIs externas y ofrece una calidad de búsqueda superior.
