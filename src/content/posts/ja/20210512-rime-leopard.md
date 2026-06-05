---
title: "Rime入力メソッドのマルチデバイス設定"
description: "最近、工業情報化部は、ほぼすべての主流のクラウド入力メソッドが規制に違反してユーザーのプライバシーデータを収集していることを示すデータを発表しました。安全かつ確実に入力するには、オフライン入力メソッドのみを使用できます。現在最高のオフライン入力メソッドは間違いなくRimeです。"
category: "startup"
tags:
  - "management"
pubDate: 2021-05-09
heroImage: "https://cos.zbz.ai/images/202310031635857.avif"
heroImageAlt: "RealRip-"
heroImageWidth: 1944
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "ja"
---

最近、工業情報化部は、ほぼすべての主流のクラウド入力メソッドが規制に違反してユーザーのプライバシーデータを収集していることを示すデータを発表しました。安全かつ確実に入力するには、オフライン入力メソッドのみを使用できます。現在最高のオフライン入力メソッドは間違いなく[Rime](https://github.com/rime/home/wiki/Introduction)です。

正確に言えば、Rimeはオープンソースのクロスプラットフォーム入力メソッドエンジンです。コードはオープンソースであり、完全にオフラインです。極端なカスタマイズと調整を通じて、ユーザーは誰にでも適した入力メソッドをカスタマイズできます。利点は安全性と複数の入力スキームのサポートです。欠点は、シソーラスが十分に強力ではなく、構成が複雑で、シソーラスの同期を半手動で行う必要があることです。

### Mac版のインストール

Rimeの作者である[Lotem](https://github.com/lotem)によって最初に開発された繁体字中国語版。簡体字版を使用したい場合は、[Yifang](https://github.com/maomiui/rime)のチュートリアルに従って構成できます。構成プロセス中は次の点に注意してください。

- 現在のバージョン（2021-05-12）にはバグがあります。`luna_pinyin_simp.custom.yaml`で有効になっている場合
  `- derive/^([zcs])h/$1/ # zh, ch, sh => z, c, s`
  `- derive/^([zcs])([^h])/$1h$2/ # z, c, s => zh, ch, sh`
  あいまいな音の後、絵文字と動的時間は無効になります。

- 作者はさまざまな入力スキームを用意しています。Xiaohe Shuangpinなどを使用しない場合は、対応する構成ファイルを削除できます。

- Luna Pinyin Traditionalを使用しない場合でも、`luna_pinyin.zonghe.dict.yaml`や`luna_pinyin.dict.yaml`などのファイルを削除しないでください。削除すると、必要な単語が不足する可能性があります。

- メールアドレスや住所などの一般的な情報は、`custom_phrase.txt`で設定できます。

- `squirrel.custom.yaml`ファイルでテーマを変更および変更できます。たとえば、`macos_light`テーマに基づいて、作者はGoogleピンイン入力メソッドの「ピンクワールド」テーマを模倣しました。

### Win10版のインストール

Rime WeaselのWin10バージョンの場合は、[公式チュートリアル](https://github.com/rime/weasel)に従ってインストールしてください。インストールが完了したら、Mac構成ファイルをコピーして使用できます。注意する必要があります

- `squirrel.custom.yaml`を`weasel.custom.yaml`という名前にする必要があります

- スキンの単一行と二重行、ピンインの単一行表示などは、次のように`weasel.custom.yaml`でカスタマイズされます。

  ```yaml
  # テキストの水平配置
  style/horizontal: true

  # 単一行表示
  style/inline_preedit: true

  # スキンの変更
  style/color_scheme: win10
  ```

- `installation.yaml`の同期パスは、WinとMacで異なります。Winでは一重引用符または二重引用符は必要ありません。

  ```yaml
  # win同期パス形式
  sync_dir: C:\Users\Username\iCloudDrive\Rime

  # mac同期パス形式
  sync_dir: "/Users/Username/Library/Mobile Documents/com~apple~CloudDocs/Rime"
  ```

- win10では、win10タスクスケジューラを使用してデータを[自動的に](https://www.cnblogs.com/cstylex/p/Rime_on_Linux_Android_Mac_Windows_iOS_sync.html)同期できます。Macで自動同期を実現する方法はまだありません。

Androidスマートフォンの場合は[Trime](https://github.com/osfans/trime)をインストールして使用でき、iOSスマートフォンの場合は[iRime](https://apps.apple.com/cn/app/irime%E8%BE%93%E5%85%A5%E6%B3%95/id1142623977)をインストールして使用できます。
