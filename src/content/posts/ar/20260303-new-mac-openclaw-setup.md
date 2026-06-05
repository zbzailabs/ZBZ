---
title: "كيفية تثبيت OpenClaw على جهاز Mac جديد"
description: "دليل عملي لتثبيت OpenClaw على جهاز Mac جديد، يشمل Homebrew وfnm وpnpm وSSH وonboarding ومعالجة الأعطال."
category: "startup"
tags:
  - "innovation"
  - "management"
  - "strategy"
pubDate: 2026-03-03
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260303-new-mac-openclaw-setup.avif"
heroImageAlt: "مسار إعداد OpenClaw على جهاز Mac جديد"
heroImageWidth: 2400
heroImageHeight: 2400
draft: false
featured: false
locale: ar
---

# كيفية تثبيت OpenClaw على جهاز Mac جديد

ابدأ بتجهيز النظام، ثم إعداد Node وGitHub، وبعدها أكمل onboarding الخاص بـ OpenClaw.

```bash
xcode-select --install
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

```bash
brew install fnm
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
source ~/.zshrc
fnm install --lts
fnm default lts-latest
corepack enable
corepack prepare pnpm@latest --activate
```

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
pbcopy < ~/.ssh/id_ed25519.pub
ssh -T git@github.com
```

```bash
pnpm add -g @openai/codex
pnpm add -g @google/gemini-cli
pnpm add -g openclaw@latest
pnpm approve-builds -g
openclaw onboard --install-daemon
```

تحقق نهائي:

```bash
node -v && pnpm -v && openclaw --version
```
