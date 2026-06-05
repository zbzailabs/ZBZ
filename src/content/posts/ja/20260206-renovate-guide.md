---
title: "Renovate 自動依存関係アップデートガイド"
description: "Renovate を使用して GitHub リポジトリの依存関係を完全に自動化し、手動介入なしで更新する"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-06
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260206-renovate-guide.avif"
heroImageAlt: "Renovate 自動依存関係アップデート"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: ja
---

## はじめに

プロジェクトの依存関係のメンテナンスは、開発者の日々の業務の一部です。依存関係のバージョンを手動で確認、更新、テストすることは時間がかかるだけでなく、見落としも起こりやすくなります。この記事では、**Renovate** を使用して依存関係の更新を完全に自動化する方法を説明します。

## 目標

- 毎日未明に自動的に依存関係の更新を確認
- PR を自動作成し、マージする（CI 通過後）
- 手動介入なし、バックグラウンドで実行
- 複数リポジトリの統合管理

## Renovate のインストール

1. [GitHub Apps - Renovate](https://github.com/apps/renovate) にアクセス
2. **インストール** をクリック
3. 有効にするリポジトリを選択（すべてまたは特定のリポジトリ）
4. 認可を完了

## 設定ファイル

リポジトリのルートに `renovate.json` を作成します：

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

コミットしてプッシュ：

```bash
git add renovate.json
git commit -m "chore: configure Renovate for automated dependency updates"
git push
```

## 設定の詳細

| オプション | 説明 |
|-----------|------|
| `config:recommended` | Renovate 公式推奨の基本設定 |
| `:automergeAll` | **核心設定** — すべての更新（メジャーバージョン含む）を自動マージ |
| `:disableDependencyDashboard` | ダッシュボード Issue を無効化し、バックグラウンド実行 |
| `timezone` | タイムゾーンを Asia/Shanghai に設定 |
| `schedule` | 毎日午前 3 時前に実行 |

## ワークフロー

```
毎日午前 3:00
    ↓
Renovate が package.json の依存関係を確認
    ↓
利用可能な更新が検出される
    ↓
プルリクエストを自動作成
    ↓
CI チェックをトリガー
    ↓
CI 通過 → main ブランチに自動マージ
    ↓
翌朝、更新された依存関係を確認
```

## マルチリポジトリ設定

複数のプロジェクトに同じ設定ファイルをコピーします：

```bash
# 汎用設定を作成
cat > renovate.json << 'EOF'
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended", ":automergeAll", ":disableDependencyDashboard"],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
EOF

# 複数リポジトリに適用
for repo in repo1 repo2 repo3; do
  cp renovate.json $repo/
  cd $repo && git add . && git commit -m "chore: configure Renovate" && git push
  cd ..
done
```

## よくある質問

### PR が自動マージされない？

CI ステータスを確認してください。Renovate はすべての CI チェック通過後にのみマージします。CI が失敗した場合は手動で問題を修正して再実行してください。

### すぐに更新をトリガーするには？

- ダッシュボードが有効な場合：Issues → Dependency Dashboard → 更新するパッケージをチェック → Rebase をクリック
- またはスケジュールされた時間の自動実行を待つ

### 特定の依存関係を除外するには？

設定に除外ルールを追加：

```json
{
  "packageRules": [{
    "matchPackageNames": ["package-name"],
    "enabled": false
  }]
}
```

### pnpm / yarn / npm のサポート？

Renovate はロックファイルの種類を自動検出するため、追加設定は不要です。

## 検証

設定をプッシュ後、Renovate は自動的に実行されます（またはスケジュールされた時間を待ちます）。検証手順：

1. リポジトリの **プルリクエスト** ページに移動
2. Renovate 作成の PR を確認（タイトル形式：`chore(deps): update ...`）
3. PR の自動マージが有効であることを確認
4. CI 通過後に自動マージ

## まとめ

たった 5 行の核心設定：

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

完全自動化された依存関係管理を実現し、開発者がビジネスコードに集中できるようにします。
