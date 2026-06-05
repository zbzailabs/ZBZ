---
title: "Mシリーズ Mac 現代開発環境構築完全ガイド"
description: "Apple Silicon (M1/M2/M3) チップ向けに特化した包括的ガイド。基本ツールインストールからGitHub接続、標準化された開発ワークフローまで網羅"
category: "startup"
tags:
  - "innovation"
  - "management"
pubDate: 2026-02-12
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260212-mac-github.avif"
heroImageAlt: "Mac 開発環境構築"
heroImageWidth: 5632
heroImageHeight: 3072
draft: false
featured: false
locale: ja
---

# Mシリーズ Mac 現代開発環境構築完全ガイド

これは Apple Silicon (M1/M2/M3) チップ向けに特化した包括的ガイドです。基本ツールのインストールだけでなく、開発環境におけるGitHub接続の問題やネイティブビルドスクリプトのブロックなどの痛点も解決します。



## 第一フェーズ：基本開発環境構築

Mシリーズチップでは、パスとアーキテクチャの整合性が安定性の前提となります。

### 1. Homebrew のインストール（パッケージマネージャー）

Apple Silicon では、Homebrew はデフォルトで `/opt/homebrew` にインストールされます。

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**環境変数の設定：**

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### 2. fnm のインストール（Node.js バージョン管理）

`fnm` は ARM64 をネイティブサポートし、現在最もパフォーマンスの高い macOS 用 Node マネージャーです。

```bash
brew install fnm
```

以下を `~/.zshrc` に追加し、プロジェクトディレクトリに入る際に自動的に Node バージョンを切り替えます：

```bash
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
source ~/.zshrc
```

### 3. pnpm のインストール（コアパッケージマネージャー）

Homebrew 経由で個別にインストールし、グローバル設定を最適化することをお勧めします：

```bash
brew install pnpm
pnpm setup
source ~/.zshrc
```

**重要な最適化：** ネイティブモジュール（Gemini CLI、Sharp など）のビルドスクリプトを自動実行できるようにし、Mチップでのコンパイルエラーを回避します：

```bash
pnpm config set -g ignore-scripts false
```

------

## 第二フェーズ：GitHub セキュア接続とネットワークトンネリング

SSH-over-HTTPS（ポート443）とプロキシツールを組み合わせることで、一般的な接続タイムアウトやリセット問題を解決します。

### 1. グローバルID設定

以下のプレースホルダーを自分のGitHub情報に置き換えてください：

```bash
git config --global user.name "<your_username>"
git config --global user.email "<your_email@example.com>"
git config --global init.defaultBranch main
```

### 2. ED25519 キーの生成

```bash
ssh-keygen -t ed25519 -C "<your_email@example.com>"
```

`cat ~/.ssh/id_ed25519.pub` を実行し、内容を [GitHub SSH Settings](https://github.com/settings/keys) に追加してください。

### 3. 「ユニバーサル」SSH 設定ファイルの作成

`~/.ssh/config` を編集し、トラフィックが指定されたプロキシポート（例では7897）を通るようにします：

```
Host github.com
  HostName ssh.github.com
  Port 443
  User git
  IdentityFile ~/.ssh/id_ed25519
  AddKeysToAgent yes
  UseKeychain yes
  # ローカルプロキシ経由（プロキシツールに応じてポートを修正）
  ProxyCommand nc -X 5 -x 127.0.0.1:7897 %h %p
```

**パーミッション修正：**

```bash
chmod 600 ~/.ssh/config
```

------

## 第三フェーズ：標準化された開発ワークフロー

環境が整ったら、標準化されたワークフローに従うことで、コラボレーションとメンテナンスの効率が大幅に向上します。

### 1. 環境チェック

プロジェクトディレクトリに入った後、環境が正しく整っているか確認します：

```bash
node -v && pnpm -v
```

### 2. 依存関係管理

スクリプト実行権限を有効にしているため、インストール時にネイティブモジュールが自動的にローカルコンパイルを完了します：

```bash
pnpm install
```

### 3. 規範的なコミット

コミット履歴を明確に保つために、**Conventional Commits** 仕様の使用をお勧めします：

- `feat:` 新機能
- `fix:` バグ修正
- `chore:` ビルドプロセスや補助ツールの変更
- `docs:` ドキュメント変更

**ヒント：** AIツールを使用して、適切なコミットメッセージの生成を支援できます：

```bash
git diff --cached | <ai_tool_command> "変更に基づいて英語のコミットメッセージを生成"
```

### 4. プッシュと同期

```bash
git pull origin main  # 競合を避けるため、プッシュ前にプル
git push origin main
```
