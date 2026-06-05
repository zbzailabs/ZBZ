---
title: "MチップMacでOpenClawのQMDメモリバックエンドを有効化する"
description: "Apple Silicon MacでのQMDメモリバックエンド設定方法を詳細に解説。完全な手順と選定の推奨事項を含む"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-07
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260207-openclaw-qmd-guide.avif"
heroImageAlt: "OpenClaw QMD設定チュートリアル"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: ja
---

> ⚠️ **選定の推奨事項**：本文はQMDの設定手順を記録していますが、実際の評価により、**ほとんどのシナリオではOpenClawの内蔵インデックスで十分に優れています**。QMDは追加で約600MBのメモリとより複雑なメンテナンスを必要とします。実際のニーズ（完全なオフライン実行が必要か、検索品質に極めて高い要求があるかなど）に基づいて、有効化するかどうかを判断してください。

本文では、Apple Silicon（M1/M2/M3/M4）MacでOpenClawにQMD（Query Markdown Database）メモリバックエンドを設定し、BM25 + ベクトル + リランクのハイブリッド検索を実現する方法を紹介します。

## 前提条件

- macOS 14+（Sonoma / Sequoia）
- OpenClaw 2026.2.3-1以上
- Homebrew（SQLiteインストール用）

## ステップ1：Bunのインストール

QMDはBunランタイムに依存しています。まずBunをインストールします：

```bash
curl -fsSL https://bun.sh/install | bash
```

インストールの確認：
```bash
~/.bun/bin/bun --version
# 出力: 1.3.8
```

## ステップ2：SQLiteのインストール（拡張機能対応）

QMDには拡張機能に対応したSQLiteが必要です：

```bash
brew install sqlite
```

## ステップ3：QMDのインストール

Bunを使用してQMDをグローバルにインストールします：

```bash
~/.bun/bin/bun install -g https://github.com/tobi/qmd
```

QMDインストールの確認：
```bash
export PATH="$HOME/.bun/bin:$PATH"
qmd --version
```

## ステップ4：OpenClawでQMDを使用する設定

OpenClaw設定ファイルを編集します：

```bash
openclaw config edit
```

`memory`設定を追加または変更します：

```json
{
  "memory": {
    "backend": "qmd"
  }
}
```

完全な設定例（オプションパラメータを含む）：

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

## ステップ5：OpenClawの再起動

```bash
openclaw gateway restart
```

## ステップ6：QMDインデックスの初期化

再起動後、QMDは自動的にインデックスを作成します。手動で初期化する場合：

```bash
# 環境変数の設定
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"

# コレクションの作成
cd ~/.openclaw/workspace
qmd collection add memory --name memory-root --mask "**/*.md"

# ベクトル埋め込みの生成（初回は約600MBのモデルをダウンロード）
qmd embed
```

初回の`qmd embed`実行時、HuggingFaceから自動的にダウンロードされます：
- `embeddinggemma-300M-Q8_0.gguf`（埋め込みモデル）
- `qwen3-reranker-0.6b-q8_0.gguf`（リランクモデル）
- `Qwen3-0.6B-Q8_0.gguf`（クエリ拡張モデル）

## ステップ7：QMDが有効になっているか確認

メモリ検索をテストします：

```bash
openclaw memory-search "OpenClaw メモリシステム"
```

`source: "qmd//memory-root/..."`と表示された場合、QMDが有効になっています。

QMDステータスの確認：

```bash
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"
qmd status
```

## よくある質問

### QMDが有効にならず、内蔵インデックスが表示される

`~/.openclaw/openclaw.json`で`memory.backend`が`"qmd"`に設定されているか確認し、Gatewayを再起動してください。

### モデルのダウンロードに失敗する

中国大陸のユーザーはHuggingFaceミラーを設定できます：
```bash
export HF_ENDPOINT=https://hf-mirror.com
qmd embed
```

### メモリ不足

MシリーズMacには少なくとも8GBのメモリを推奨します。埋め込みプロセスが強制終了された場合は、他のアプリケーションを閉じてみてください。

## 設定リファレンス

| 設定項目 | 説明 | デフォルト値 |
|--------|------|--------|
| `memory.backend` | メモリバックエンドタイプ | `"qmd"` |
| `memory.citations` | 引用元を表示するか | `"auto"` |
| `memory.qmd.update.interval` | インデックス更新間隔 | `"5m"` |
| `memory.qmd.limits.maxResults` | 最大返却結果数 | `6` |
| `memory.qmd.limits.timeoutMs` | 検索タイムアウト時間 | `4000` |

## まとめ

QMDを有効化すると、OpenClawのメモリ検索は以下の機能を持ちます：
- **BM25全文検索**：キーワード、ID、コードシンボルの精确マッチング
- **ベクトル意味検索**：同義語、概念の関連性を理解
- **リランク最適化**：Qwen3リランカーで関連性を向上

内蔵のSQLite + Gemini Embeddingsと比較して、QMDはローカルで完全に実行され、外部APIに依存せず、より高い検索品質を提供します。
