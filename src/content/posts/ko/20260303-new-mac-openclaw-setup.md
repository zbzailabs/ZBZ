---
title: "새 Mac에 OpenClaw 설치하기"
description: "새 Mac에서 OpenClaw를 설치하는 실전 가이드입니다. Homebrew, fnm, pnpm, SSH, onboarding까지 포함합니다."
category: "startup"
tags:
  - "innovation"
  - "management"
  - "strategy"
pubDate: 2026-03-03
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260303-new-mac-openclaw-setup.avif"
heroImageAlt: "새 Mac에서 OpenClaw 설치 흐름"
heroImageWidth: 2400
heroImageHeight: 2400
draft: false
featured: false
locale: ko
---

# 새 Mac에 OpenClaw 설치하기

시스템 기본 구성을 마친 뒤 Node와 GitHub를 설정하고 OpenClaw onboarding을 완료합니다.

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

검증:

```bash
node -v && pnpm -v && openclaw --version
```
