---
title: "Gatsbyブログテンプレート"
description: "このサイトはGatsbyを使用して構築された静的ウェブサイトです。ぜひお試しください。"
category: "life"
tags:
  - "roam"
pubDate: 2021-11-20
heroImage: "https://cos.zbz.ai/images/202310181512144.avif"
heroImageAlt: "RealRip-Gatsbyブログテンプレート"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "ja"
---

Gatsbyを使用して静的ウェブサイトを構築するためのテンプレート。

ソースコードは**[gatsby-starter-glass](https://github.com/xiyizhou/gatsby-starter-glass)**にあります。ぜひお試しください。

## 特徴

- すぐに使用可能
- 完全にローカライズ済み
- [Waline](https://waline.js.org)コメントを含む
- Google Analyticsを含む
- Markdown編集

## ローカル展開

```bash
# 1. ローカルにクローン
git clone https://github.com/xiyizhou/gatsby-starter-glass.git

# 2. ディレクトリに移動
cd gatsby-starter-glass

# 3. 依存関係をインストール
yarn install

# 4. 開発モードを開始
yarn start

# 5. 本番バージョンを構築
yarn  build
```

## 設定

- `gatsby-config.js`でウェブサイト情報、Google Analytics IDなどを設定します。
- `src/components/header.js`でトップナビゲーションバー情報を設定します。
- `src/components/footer.js`でボトムナビゲーションバー情報を設定します。

- `src/components/comment.js`でWaline情報を設定します。

## 記事の公開

### ブログ記事

ブログ記事は`content/blog`にあります。テンプレートは次のとおりです。

```md
---
title: GatsbyにWalineコメントコンポーネントをインストールする
date: 2021-11-17 08:08
slug: gatsby-waline
category: 生活
tags:
  - 生活
description: WalineにはまだGatsbyコンポーネントがないため、Walineクライアントライブラリをインストールし、Reactコンポーネントを作成し、適切な場所にコンポーネントを導入することで、GatsbyサイトにWalineコメント機能を追加します。
---

Gatsbyはreactベースの静的ウェブサイト構築フレームワークであり、オンラインストア、公式ウェブサイト、ブログの展開に使用できます。豊富なプラグインを使用することで、画像の遅延読み込み、Markdownドキュメントのサポート、訪問者のコメントなどの機能を実現できます。Gatsbyが公式に推奨するコメントシステムには、Disqus、Gitalkなどがあります。
```

### ページ

ページコンテンツは`content/pages`にあります。

## 注意事項

- このスターターはGatsby V3に基づいています。プラグインをインストールするときは、バージョンの互換性に注意してください。
- メインフレームワークは[gatsby-starter-glass](https://github.com/yinkakun/gatsby-starter-glass)からローカライズされています。[yinkakun](https://github.com/yinkakun)に感謝します。
