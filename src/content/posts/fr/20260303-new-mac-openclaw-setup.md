---
title: "Comment installer OpenClaw sur un nouveau Mac"
description: "Guide pratique pour installer OpenClaw sur un Mac neuf, avec Homebrew, fnm, pnpm, SSH, onboarding et dépannage."
category: "startup"
tags:
  - "innovation"
  - "management"
  - "strategy"
pubDate: 2026-03-03
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260303-new-mac-openclaw-setup.avif"
heroImageAlt: "Flux d'installation d'OpenClaw sur un nouveau Mac"
heroImageWidth: 2400
heroImageHeight: 2400
draft: false
featured: false
locale: fr
---

# Comment installer OpenClaw sur un nouveau Mac

Guide d'installation rapide: préparer le système, configurer Node et GitHub, puis finaliser l'onboarding OpenClaw.

## 1. Base système

```bash
xcode-select --install
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## 2. Node.js et pnpm

```bash
brew install fnm
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
source ~/.zshrc
fnm install --lts
fnm default lts-latest
corepack enable
corepack prepare pnpm@latest --activate
which node && which pnpm
```

## 3. SSH GitHub

```bash
which ssh
ssh-keygen -t ed25519 -C "your_email@example.com"
pbcopy < ~/.ssh/id_ed25519.pub
ssh -T git@github.com
```

Exemple `~/.ssh/config`:

```ssh-config
Host *
  AddKeysToAgent yes
  UseKeychain yes

Host github.com
  HostName ssh.github.com
  Port 443
  User git
  IdentityFile ~/.ssh/id_ed25519
  ProxyCommand nc -X 5 -x 127.0.0.1:7897 %h %p
```

## 4. Installer OpenClaw

```bash
pnpm add -g @openai/codex
pnpm add -g @google/gemini-cli
pnpm add -g openclaw@latest
pnpm approve-builds -g
openclaw onboard --install-daemon
```

Choix recommandés: `QuickStart`, fournisseur `OpenAI`, hooks activés.

## 5. Vérification rapide

```bash
node -v && pnpm -v && openclaw --version
```

Si tout est correct, l'environnement OpenClaw est prêt.
