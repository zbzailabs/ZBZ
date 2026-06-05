---
title: "Ativando o backend de memória QMD para OpenClaw em Macs Apple Silicon"
description: "Guia detalhado para configurar o backend de memória QMD do OpenClaw em Macs da série M, com etapas completas e recomendações de seleção"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-07
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260207-openclaw-qmd-guide.avif"
heroImageAlt: "Ilustração do tutorial de configuração do OpenClaw QMD"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: pt
---

> ⚠️ **Recomendação de seleção**: Este artigo documenta o processo de configuração do QMD. No entanto, com base em uma avaliação prática, **o índice integrado do OpenClaw é suficiente para a maioria dos cenários**. O QMD requer aproximadamente 600 MB de memória adicional e manutenção mais complexa. Por favor, decida ativá-lo com base em suas necessidades reais (como a necessidade de executar completamente offline ou ter requisitos extremamente altos de qualidade de pesquisa).

Este artigo explica como configurar o backend de memória QMD (Query Markdown Database) para o OpenClaw em Macs Apple Silicon (M1/M2/M3/M4), habilitando a pesquisa híbrida com BM25 + vetor + reranking.

## Pré-requisitos

- macOS 14+ (Sonoma / Sequoia)
- OpenClaw 2026.2.3-1 ou posterior
- Homebrew (para instalar o SQLite)

## Etapa 1: Instalar o Bun

O QMD depende do runtime Bun. Primeiro, instale o Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

Verificar instalação:
```bash
~/.bun/bin/bun --version
# Saída: 1.3.8
```

## Etapa 2: Instalar o SQLite (com suporte a extensões)

O QMD requer SQLite com suporte a extensões:

```bash
brew install sqlite
```

## Etapa 3: Instalar o QMD

Instale o QMD globalmente usando o Bun:

```bash
~/.bun/bin/bun install -g https://github.com/tobi/qmd
```

Verificar instalação do QMD:
```bash
export PATH="$HOME/.bun/bin:$PATH"
qmd --version
```

## Etapa 4: Configurar o OpenClaw para usar o QMD

Edite o arquivo de configuração do OpenClaw:

```bash
openclaw config edit
```

Adicione ou modifique a configuração de `memory`:

```json
{
  "memory": {
    "backend": "qmd"
  }
}
```

Exemplo de configuração completa (com parâmetros opcionais):

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

## Etapa 5: Reiniciar o OpenClaw

```bash
openclaw gateway restart
```

## Etapa 6: Inicializar o índice QMD

Após a reinicialização, o QMD criará automaticamente o índice. Para inicialização manual:

```bash
# Definir variáveis de ambiente
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"

# Criar coleção
cd ~/.openclaw/workspace
qmd collection add memory --name memory-root --mask "**/*.md"

# Gerar embeddings vetoriais (fará o download de ~600 MB de modelos na primeira execução)
qmd embed
```

A primeira execução do `qmd embed` fará o download automático do HuggingFace:
- `embeddinggemma-300M-Q8_0.gguf` (modelo de embedding)
- `qwen3-reranker-0.6b-q8_0.gguf` (modelo de reranking)
- `Qwen3-0.6B-Q8_0.gguf` (modelo de expansão de consulta)

## Etapa 7: Verificar se o QMD está funcionando

Teste a pesquisa de memória:

```bash
openclaw memory-search "OpenClaw memory system"
```

Se você vir `source: "qmd//memory-root/..."`, o QMD está ativo.

Verificar o status do QMD:

```bash
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"
qmd status
```

## Perguntas frequentes

### O QMD não está funcionando, ainda mostra o índice integrado

Verifique se `memory.backend` está definido como `"qmd"` em `~/.openclaw/openclaw.json` e reinicie o Gateway.

### Falha no download do modelo

Usuários na China podem definir o espelho do HuggingFace:
```bash
export HF_ENDPOINT=https://hf-mirror.com
qmd embed
```

### Memória insuficiente

Os Macs da série M devem ter pelo menos 8 GB de memória. Se o processo de embedding for encerrado, tente fechar outros aplicativos.

## Referência de configuração

| Item de configuração | Descrição | Valor padrão |
|----------------------|-----------|--------------|
| `memory.backend` | Tipo de backend de memória | `"qmd"` |
| `memory.citations` | Mostrar fontes de citação | `"auto"` |
| `memory.qmd.update.interval` | Intervalo de atualização do índice | `"5m"` |
| `memory.qmd.limits.maxResults` | Número máximo de resultados | `6` |
| `memory.qmd.limits.timeoutMs` | Tempo limite de pesquisa | `4000` |

## Resumo

Após ativar o QMD, a pesquisa de memória do OpenClaw terá:
- **Pesquisa de texto completo BM25**: Correspondência precisa de palavras-chave, IDs, símbolos de código
- **Pesquisa semântica vetorial**: Compreensão de sinônimos e associações conceituais
- **Otimização de reranking**: O reranker Qwen3 melhora a relevância

Em comparação com o SQLite integrado + Gemini Embeddings, o QMD funciona completamente em local sem depender de APIs externas e oferece qualidade de pesquisa superior.
