---
title: "Как установить OpenClaw на новый Mac"
description: "Пошаговая установка OpenClaw на новом Mac: Homebrew, fnm, pnpm, SSH, onboarding и базовая диагностика."
category: "startup"
tags:
  - "innovation"
  - "management"
  - "strategy"
pubDate: 2026-03-03
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260303-new-mac-openclaw-setup.avif"
heroImageAlt: "Процесс установки OpenClaw на новом Mac"
heroImageWidth: 2400
heroImageHeight: 2400
draft: false
featured: false
locale: ru
---

# Как установить OpenClaw на новый Mac

Сначала подготовьте систему, затем настройте Node и GitHub, после чего выполните onboarding OpenClaw.

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

Проверка:

```bash
node -v && pnpm -v && openclaw --version
```
