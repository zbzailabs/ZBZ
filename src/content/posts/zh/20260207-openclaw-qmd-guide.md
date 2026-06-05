---
title: "在 M 芯片 Mac 上为 OpenClaw 启用 QMD 记忆后端"
description: "详细介绍如何在 Apple Silicon Mac 上配置 QMD 记忆后端，包含完整步骤和选型建议"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-07
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260207-openclaw-qmd-guide.avif"
heroImageAlt: "OpenClaw QMD 配置教程配图"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: zh
---

> ⚠️ **选型建议**：本文记录 QMD 配置过程，但经实际评估，**对于大部分场景 OpenClaw 内置索引已足够好用**。QMD 需要额外 ~600MB 内存和更复杂的维护，请根据实际需求（如是否需要完全离线运行、对搜索质量有极高要求等）决定是否启用。

本文介绍如何在 Apple Silicon (M1/M2/M3/M4) Mac 上为 OpenClaw 配置 QMD（Query Markdown Database）记忆后端，实现 BM25 + 向量 + 重排序的混合搜索。

## 前置条件

- macOS 14+ ( Sonoma / Sequoia )
- OpenClaw 2026.2.3-1 或更高版本
- Homebrew（用于安装 SQLite）

## 步骤一：安装 Bun

QMD 依赖 Bun 运行时，先安装 Bun：

```bash
curl -fsSL https://bun.sh/install | bash
```

验证安装：
```bash
~/.bun/bin/bun --version
# 输出: 1.3.8
```

## 步骤二：安装 SQLite（支持扩展）

QMD 需要支持扩展的 SQLite：

```bash
brew install sqlite
```

## 步骤三：安装 QMD

使用 Bun 全局安装 QMD：

```bash
~/.bun/bin/bun install -g https://github.com/tobi/qmd
```

验证 QMD 安装：
```bash
export PATH="$HOME/.bun/bin:$PATH"
qmd --version
```

## 步骤四：配置 OpenClaw 使用 QMD

编辑 OpenClaw 配置文件：

```bash
openclaw config edit
```

添加或修改 `memory` 配置：

```json
{
  "memory": {
    "backend": "qmd"
  }
}
```

完整配置示例（包含可选参数）：

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

## 步骤五：重启 OpenClaw

```bash
openclaw gateway restart
```

## 步骤六：初始化 QMD 索引

重启后，QMD 会自动创建索引。如需手动初始化：

```bash
# 设置环境变量
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"

# 创建 collection
cd ~/.openclaw/workspace
qmd collection add memory --name memory-root --mask "**/*.md"

# 生成向量嵌入（首次会下载 ~600MB 模型）
qmd embed
```

首次运行 `qmd embed` 会自动从 HuggingFace 下载：
- `embeddinggemma-300M-Q8_0.gguf`（嵌入模型）
- `qwen3-reranker-0.6b-q8_0.gguf`（重排序模型）
- `Qwen3-0.6B-Q8_0.gguf`（查询扩展模型）

## 步骤七：验证 QMD 是否生效

测试记忆搜索：

```bash
openclaw memory-search "OpenClaw 记忆系统"
```

如果看到 `source: "qmd//memory-root/..."`，说明 QMD 已生效。

查看 QMD 状态：

```bash
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"
qmd status
```

## 常见问题

### QMD 未生效，仍显示内置索引

检查 `~/.openclaw/openclaw.json` 中 `memory.backend` 是否为 `"qmd"`，然后重启 Gateway。

### 模型下载失败

国内用户可设置 HuggingFace 镜像：
```bash
export HF_ENDPOINT=https://hf-mirror.com
qmd embed
```

### 内存不足

M 系列 Mac 建议至少 8GB 内存。如果嵌入过程被杀死，尝试关闭其他应用。

## 配置说明

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `memory.backend` | 记忆后端类型 | `"qmd"` |
| `memory.citations` | 是否显示引用来源 | `"auto"` |
| `memory.qmd.update.interval` | 索引更新间隔 | `"5m"` |
| `memory.qmd.limits.maxResults` | 最大返回结果数 | `6` |
| `memory.qmd.limits.timeoutMs` | 搜索超时时间 | `4000` |

## 总结

启用 QMD 后，OpenClaw 的记忆搜索将具备：
- **BM25 全文搜索**：精确匹配关键词、ID、代码符号
- **向量语义搜索**：理解同义词、概念关联
- **重排序优化**：Qwen3 重排序器提升相关性

相比内置的 SQLite + Gemini Embeddings，QMD 在本地完全运行，不依赖外部 API，且搜索质量更高。
