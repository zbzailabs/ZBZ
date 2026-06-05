---
title: "GatsbyにWalineコメントコンポーネントをインストールする"
description: "WalineにはまだGatsbyコンポーネントがないため、Walineクライアントライブラリをインストールし、Reactコンポーネントを作成し、適切な場所にコンポーネントを導入することで、GatsbyサイトにWalineコメント機能を追加します。"
category: "life"
tags:
  - "roam"
pubDate: 2021-11-17
heroImage: "https://cos.zbz.ai/images/202310181512145.avif"
heroImageAlt: "RealRip-GatsbyにWalineコメントコンポーネントをインストールする"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "ja"
---

Gatsbyはreactベースの静的ウェブサイト構築フレームワークであり、オンラインストア、公式ウェブサイト、ブログの展開に使用できます。豊富なプラグインを使用することで、画像の遅延読み込み、Markdownドキュメントのサポート、訪問者のコメントなどの機能を実現できます。Gatsbyが公式に推奨するコメントシステムには、Disqus、Gitalkなどがあります。これらのコメントシステムには独自の特徴がありますが、ニーズを満たすことはできません。この記事では、最近人気のあるWalineコメントシステムをGatsbyプロジェクトにインストールしようとしています。Gatsbyの開発は自由度が高く、プロジェクトごとに異なるため、アイデアの表現を容易にするために、公式ブログテーマ`gatsby-starter-blog`を例として使用します。

## アイデア

WalineにはまだGatsbyコンポーネントがないため、Walineクライアントライブラリをインストールし、Reactコンポーネントを作成し、適切な場所にコンポーネントを導入することで機能を実装する必要があります。

## 基本設定

要件に従って[Gatsby](https://gatsbyjs.com)プロジェクトを展開し、[Waline公式チュートリアル](https://waline.js.org)に従ってWalineコメントシステムのサーバーとデータ側を構成します。

## Walineライブラリのインストール

プロジェクトのルートディレクトリで、パッケージ管理を介してWalineライブラリをインストールします。

```bash
yarn add -D @waline/client
```

その後、コメントコンポーネントの`import`ステートメントを介してWalineコンポーネントを導入できます。

## コメントコンポーネントの作成

コメント機能をカプセル化して再利用するためのWalineクラスコンポーネントを作成します。

`src/components`ディレクトリに新しいスクリプト`comment.js`を作成します

```jsx
import React, { PureComponent } from "react";

export default class Comment extends PureComponent {
  constructor(props) {
    super(props);
    this._commentRef = React.createRef();
  }
  async componentDidMount() {
    if (typeof window === "undefined") {
      return;
    }
    if (!this._commentRef.current) {
      return;
    }
    const Waline = await (await import("@waline/client")).default;
    this.Waline = new Waline({
      el: this._commentRef.current,
      serverURL: "https://your.waline.url",
      visitor: true,
      path: this.props.slug,
    });
  }
  render() {
    return <div ref={this._commentRef} />;
  }
}
```

- ロード時にコンポーネントが`Waline`オブジェクトを作成するだけでよく、頻繁な状態変化が発生しないと判断するため、`Comment`を関数コンポーネントではなくクラスコンポーネントとして定義し、`PureComponent`を継承します。これにより、パフォーマンスの低下を減らすことができます。

- `render()`関数では、コンテナ要素として`<div>`を作成します。これは、`Waline`によって動的に生成されたDOMノードをロードするために使用されます。
- `Comment`コンポーネントに`slug`という名前の`prop`を追加します。これは、外部コンポーネントによって渡され、対応するコメントのみが固定ページに表示されるようにします。

## 記事ページへのコンポーネントの追加

`src/templates/blog-post.js`ファイルを開き、最初にインポート宣言を追加します。

```jsx
import Comment from "../components/comment";

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        slug
      }

      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`;
```

`BlogPostTemplate`関数の最後に、`<Comment>`タグを挿入し、終了タグ`</Layout>`の前に`slug`属性を設定します。

```jsx
import Comment from '../components/comment' // 新しいコンポーネントをインポートする

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  ...
  return (
    <Layout location={location} title={siteTitle}>
      <Comment slug={post.fields.slug} />
    </Layout>
  )
}
```

## 開発バージョンの作成

```bash
gatsby build
```
