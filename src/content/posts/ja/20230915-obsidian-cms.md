---
title: "Obsidian を CMS として使用する"
description: "Obsidian はブログの CMS として非常に便利です"
category: "startup"
tags:
  - "management"
  - "allocation"
pubDate: 2024-09-11
authors:
  - default
heroImage: "https://cos.zbz.ai/images/202309151438569.avif"
heroImageAlt: "RealRip-Obsidian を CMS として使用する"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: ja
---

ついにブログプラットフォームのフレームワークを Astro に切り替えました。これにより、読み込み速度が速くなり、更新やメンテナンスも容易になりました。Markdown ファイルを直接同期するだけで済みます。以前は Typora を Markdown 編集ツールとして使用しており、WYSIWYG で単一ファイルの管理が非常に軽快でした。しかし、Typora にはファイルマネージャーがなく、複数のファイルの管理が不便だったため、Markdown エディターを Obsidian に切り替えました。詳しく調べてみると、Obsidian はブログの CMS として非常に便利であることがわかりました。

- **ファイルマネージャー**： Obsidian の検索機能を活用すれば、ファイルの追加、削除、変更、検索が簡単に行えます。
- **ドキュメントプロパティ**： Obsidian 1.4 以降、新たにドキュメントプロパティ機能が追加され、Markdown ファイルの Frontmatter を固定フォーマットとして整理できます。テンプレート機能と組み合わせれば、Frontmatter の記述が非常に簡単になります。以前 Typora を使用していたときは、Frontmatter の形式が厳格で、手書きではよくミスをしていましたが、今では Obsidian のドキュメントプロパティを使用することで、ほとんどミスをすることがありません。
- **画像**： ブログの画像は Tencent Cloud COS にホストされ、Picgo を使用して画像を管理しています。`Image auto upload Plugin` プラグインを使用すれば、画像のアップロードが迅速に行えます。Picgo.app を使うこともできますし、Picgo-core を使うことも可能です。Picgo-core を使用する場合は、[`picgo set uploader`] で設定し、アップロードに失敗した場合は、Obsidian プラグインで `PATH 変数の修正` をオンにしてみてください。
- **同期**： Obsidian のライブラリを iCloud に保存すれば、複数のデバイス間で同期が可能となり、いつでもどこでもドキュメントを編集できます。
- **公開**： Git プラグインを使用して定期的に公開を設定すれば、記事を書き終わったら自動的にホスティングプラットフォームに公開されます。
