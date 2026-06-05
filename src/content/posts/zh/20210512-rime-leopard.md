---
title: "Rime 输入法多端配置"
description: "最近工信部公布数据，几乎所有主流云输入法都在违规收集用户隐私数据，要安全放心输入只有使用单机输入法，当前最好的单机输入法非 Rime莫属。"
category: "startup"
tags:
  - "management"
pubDate: 2021-05-09
heroImage: https://cos.realrip.com/images/202310031635857.avif
heroImageAlt: "RealRip-"
heroImageWidth: 1944
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: zh
---

最近工信部公布数据，几乎所有主流云输入法都在违规收集用户隐私数据，要安全放心输入只有使用单机输入法，当前最好的单机输入法非 [Rime](https://github.com/rime/home/wiki/Introduction) 莫属。

准确讲，Rime 是一款开源跨平台输入法引擎，代码开源，完全离线，通过极度自定义调教，用户可定制出千人千面的输入法。优点是安全，支持多种输入方案；缺点是词库不够强大，配置复杂，词库同步需要半手动进行。

### Mac 版安装

Rime 的作者[居戎氏](https://github.com/lotem) 最早开发的繁体中文版，如果要使用简体版，可按照[一方](https://github.com/maomiui/rime)的教程进行配置。配置过程要注意：

- 当前版本（2021-05-12）存在 BUG，如果在 `luna_pinyin_simp.custom.yaml` 中开启
  `- derive/^([zcs])h/$1/ # zh, ch, sh => z, c, s`
  `- derive/^([zcs])([^h])/$1h$2/ # z, c, s => zh, ch, sh`
  模糊音后，Emoji 、动态时间失效

- 作者准备了多种输入方案，如果不使用小鹤双拼等可以将对应配置文件删除。

- 即使不使用朙月拼音繁体，也不要删除`luna_pinyin.zonghe.dict.yaml`、`luna_pinyin.dict.yaml`等文件，删除可能造成缺少必要字词。

- 邮箱、地址等常用信息可在 `custom_phrase.txt `中设置。

- 可以在`squirrel.custom.yaml`文件中修改更换主题。比如，基于 `macos_light` 主题，笔者仿了一款谷歌拼音输入法“粉色世界”主题。

### Win10版安装

win10 版 Rime 小狼毫按照[官方教程](https://github.com/rime/weasel) 安装即可。安装完成，可以将 Mac 的配置文件复制使用。需要注意

- 需要将 `squirrel.custom.yaml` 命名为 `weasel.custom.yaml`

- 皮肤单双行，拼音单行显示等在 `weasel.custom.yaml` 中自定义如下：

  ```yaml
  # 文字水平排列
  style/horizontal: true

  # 单行显示
  style/inline_preedit: true

  # 更换皮肤
  style/color_scheme: win10
  ```

- `installation.yaml` 中同步路径 win 和 Mac的设置不同，Win 中不需要单引号或双引号。

  ```yaml
  # win 同步路径格式
  sync_dir: C:\Users\用户名\iCloudDrive\Rime

  # mac 同步路径格式
  sync_dir: "/Users/用户名/Library/Mobile Documents/com~apple~CloudDocs/Rime"
  ```

- win10 上可以利用 win10计划任务[自动](https://www.cnblogs.com/cstylex/p/Rime_on_Linux_Android_Mac_Windows_iOS_sync.html)同步数据，Mac上还没有办法实现自动同步。

Android 手机端可安装使用[同文输入法](https://github.com/osfans/trime), iOS 手机端可安装使用 [iRime](https://apps.apple.com/cn/app/irime%E8%BE%93%E5%85%A5%E6%B3%95/id1142623977)。
