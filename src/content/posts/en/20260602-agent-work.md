---
title: "My AI Collaboration Workflow"
description: "How I use OpenAI's ChatGPT, Codex, Pulse, and deep research for project proposals and software development"
category: "startup"
tags:
  - "allocation"
  - "strategy"
  - "innovation"
pubDate: 2026-06-02
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260603105442913.avif"
heroImageAlt: "My AI collaboration workflow"
heroImageWidth: 2400
heroImageHeight: 1350
draft: false
featured: false
locale: en
---

I have been using ChatGPT since 2023, from a regular user to a paid user, then from Plus to Pro. During the second half of 2025, when Gemini suddenly gained momentum, I briefly switched platforms to Gemini. After the release of GPT-5.5, I returned to the OpenAI ecosystem. There are two core reasons. First, GPT-5.5's model capability still leads other models by a wide margin. Benchmark contests between large models do not mean much to ordinary users. Ordinary users want real productivity. GPT has now reached a level of productivity that can produce deliverables. Second, OpenAI has done a great deal of work on productization. Codex, Pulse, and deep research each lower the barrier for users.

At present, I mainly use OpenAI products for two types of work: project proposals and programming. My rough process for project proposals is as follows: use Feishu Minutes/Lark Minutes to turn audio from site research and client communication into meeting notes; send the reviewed meeting notes and other project materials to ChatGPT; use deep research to ask ChatGPT for a first draft of the proposal; export a Word version for checking and revision; finally use Codex to adjust the document formatting. If a PowerPoint is also needed, I continue using Codex's presentations plugin to make the PPT. Of course, the PPT produced by presentations is not perfect, and some open-source PowerPoint skills on GitHub can be used to improve it.

For bug fixes and feature adjustments, Codex is fully capable. If you want to build a complete large-scale system from scratch, Codex still faces many challenges, especially the risk of losing control. At that point, the most important thing is to place clear constraints on the boundaries: the technology stack, the functional boundary, and so on. For a new project, first confirm the two files `AGENTS.md` and `DESIGN.md`: `AGENTS.md` constrains the technology stack, engineering rules, and execution boundary; `DESIGN.md` constrains color, typography, component style, and other visual rules. The second step is to choose the technology stack. Choose stacks that AI is good at using, such as React + TypeScript, instead of stacks that humans may be good at using, such as Java.

AI has changed work rhythm, and the health issue cannot be ignored. AI agents can indeed greatly improve work efficiency. If one of your tasks is not finished, the agent will quickly complete its part and push you forward, which can force you to keep working. It becomes high-intensity work with no room to drift off. Your brain keeps running, and over time this becomes very exhausting. So you need an external method to make yourself stop. The best method is the Pomodoro Technique: work for 25 minutes, rest for 5 minutes, and give your brain a real break. Of course, if you coordinate well with the agent, you can fully rest while the agent is working.
