---
title: "我的AI协同工作流"
description: "我使用OpenAI的ChatGPT、Codex、Pulse、deep research做项目方案和软件开发"
category: "startup"
tags:
  - "allocation"
  - "strategy"
  - "innovation"
pubDate: 2026-06-02
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260603105442913.avif"
heroImageAlt: "我的AI协同工作流"
heroImageWidth: 2400
heroImageHeight: 1350
draft: false
featured: false
locale: zh
---

自从2023年开始，一直在用ChatGPT，从普通用户到付费用户，从plus到Pro，一路升级。这中间在2025年下半年Gemini异军突起时，也曾短暂更换平台到Gemini，随着gpt-5.5的发布，我又回到了OpenAI阵营。核心原因有两个，一是gpt-5.5的大模型能力依旧领先其他模型很多，其实大模型之间的跑分比赛，对普通人来说并没有太多意义，普通用户要的是实实在在的生产力。gpt目前真的达到了可交付的生产力水准。二是OpenAI在产品化上做了大量的工作，Codex、Pulse、deep research，每一个都降低了用户的使用门槛。

目前，我使用OpenAI产品主要有两方面的工作，一是做项目方案，二是编程。做项目方案的大致流程如下：利用利用飞书妙记/Lark Minutes把现场调研和客户沟通的音频整理成会议纪要，把审核后的会议纪要以及其他项目资料发给ChatGPT，使用深度研究功能让ChatGPT出方案初稿，然后导出Word版进行校验修订，最后使用 Codex 调整文本格式。如果还要做PowerPoint，则继续使用codex的presentations插件做PPT，当然presentations 做的PPT并不完美，可以使用GitHub的一些开源PowerPoint skills来优化。

对于修复bug，功能调整来说，codex能完全胜任，如果从头开发一个完整的大型系统，codex还面临很多挑战，特别是容易失控，这时最重要是对边界进行明确的约束，确定技术栈，功能边界等，对于一个初始化项目，首先确认 `AGENTS.md` 和 `DESIGN.md` 两个文件：`AGENTS.md` 用于约束技术栈、工程规范和执行边界，`DESIGN.md` 用于约束配色、字体、组件风格等视觉规范。第二步是选择技术栈，要选择 AI 擅长使用的技术栈如 react+typescript，而不是人类擅长的技术栈如Java。

AI改变了工作节奏不可忽视的健康问题，AI Agent确实能极大的提升工作效率，如果你的一个工作没有完成，Agent在快速完成工作后会push你前进，导致你不得不不停的工作，而且是无法摸鱼的高强度工作，大脑不停运转，长时间下来会非常疲惫。因此，你要用一个外部方式控制自己停下来，最好的方式就是使用番茄工作法，每工作25分钟休息5分钟，给大脑以放松，当然如果你与agent的配合的好，完全可以实现在agent工作时，你休憩。