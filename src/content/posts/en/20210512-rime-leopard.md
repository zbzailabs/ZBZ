---
title: "Rime Input Method Multi-Device Configuration"
description: "Recently, the Ministry of Industry and Information Technology released data showing that almost all mainstream cloud input methods are collecting user privacy data in violation of regulations. To input safely and securely, only offline input methods can be used. The best offline input method currently is undoubtedly Rime."
category: "startup"
tags:
  - "management"
pubDate: 2021-05-09
heroImage: "https://cos.zbz.ai/images/202310031635857.avif"
heroImageAlt: "ZBZ-"
heroImageWidth: 1944
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "en"
---

Recently, the Ministry of Industry and Information Technology released data showing that almost all mainstream cloud input methods are collecting user privacy data in violation of regulations. To input safely and securely, only offline input methods can be used. The best offline input method currently is undoubtedly [Rime](https://github.com/rime/home/wiki/Introduction).

Accurately speaking, Rime is an open-source cross-platform input method engine. The code is open source and completely offline. Through extreme customization and tuning, users can customize an input method that suits everyone. The advantage is safety and support for multiple input schemes; the disadvantage is that the thesaurus is not strong enough, the configuration is complex, and the thesaurus synchronization needs to be done semi-manually.

### Mac Version Installation

The Traditional Chinese version originally developed by [Lotem](https://github.com/lotem), the author of Rime. If you want to use the Simplified version, you can configure it according to the tutorial of [Yifang](https://github.com/maomiui/rime). Note the following during the configuration process:

- There is a BUG in the current version (2021-05-12). If enabled in `luna_pinyin_simp.custom.yaml`
  `- derive/^([zcs])h/$1/ # zh, ch, sh => z, c, s`
  `- derive/^([zcs])([^h])/$1h$2/ # z, c, s => zh, ch, sh`
  After fuzzy sound, Emoji and dynamic time become invalid.

- The author has prepared a variety of input schemes. If you do not use Xiaohe Shuangpin, etc., you can delete the corresponding configuration files.

- Even if you do not use Luna Pinyin Traditional, do not delete files such as `luna_pinyin.zonghe.dict.yaml` and `luna_pinyin.dict.yaml`. Deletion may cause a lack of necessary words.

- Common information such as email and address can be set in `custom_phrase.txt`.

- You can modify and change the theme in the `squirrel.custom.yaml` file. For example, based on the `macos_light` theme, the author imitated a Google Pinyin input method "Pink World" theme.

### Win10 Version Installation

For the Win10 version of Rime Weasel, just follow the [official tutorial](https://github.com/rime/weasel) to install. After installation is complete, you can copy the Mac configuration file for use. Need to pay attention to

- Need to name `squirrel.custom.yaml` as `weasel.custom.yaml`

- Skin single and double lines, Pinyin single line display, etc. are customized in `weasel.custom.yaml` as follows:

  ```yaml
  # Text horizontal arrangement
  style/horizontal: true

  # Single line display
  style/inline_preedit: true

  # Change skin
  style/color_scheme: win10
  ```

- The sync path in `installation.yaml` is different for Win and Mac. Single quotes or double quotes are not required in Win.

  ```yaml
  # win sync path format
  sync_dir: C:\Users\Username\iCloudDrive\Rime

  # mac sync path format
  sync_dir: "/Users/Username/Library/Mobile Documents/com~apple~CloudDocs/Rime"
  ```

- On win10, you can use the win10 task scheduler to [automatically](https://www.cnblogs.com/cstylex/p/Rime_on_Linux_Android_Mac_Windows_iOS_sync.html) sync data. There is no way to achieve automatic synchronization on Mac yet.

For Android phones, you can install and use [Trime](https://github.com/osfans/trime), and for iOS phones, you can install and use [iRime](https://apps.apple.com/cn/app/irime%E8%BE%93%E5%85%A5%E6%B3%95/id1142623977).
