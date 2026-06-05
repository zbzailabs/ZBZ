---
title: "How to Install OpenClaw on a New Mac"
description: "A practical setup guide for installing OpenClaw on a brand-new Mac, including Homebrew, fnm, pnpm, SSH, onboarding, and troubleshooting."
category: "startup"
tags:
  - "innovation"
  - "management"
  - "strategy"
pubDate: 2026-03-03
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260303-new-mac-openclaw-setup.avif"
heroImageAlt: "OpenClaw setup workflow on a new Mac"
heroImageWidth: 2400
heroImageHeight: 2400
draft: false
featured: false
locale: en
---

# How to Install OpenClaw on a New Mac

This is a practical guide to set up OpenClaw on a new Mac: build a solid system foundation, configure Node and GitHub, then finish onboarding and daily-use settings.

## 1. System Foundation: CLI and Package Manager

### Install Xcode Command Line Tools

```bash
xcode-select --install
```

### Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Configure Homebrew Environment (Apple Silicon)

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## 2. Node.js and pnpm Setup

### Install fnm and enable auto-switching

```bash
brew install fnm
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
source ~/.zshrc
```

### Install Node LTS and set default

```bash
fnm install --lts
fnm default lts-latest
```

### Enable Corepack and activate pnpm

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Verify key binary paths

```bash
which node
which pnpm
node -v
pnpm -v
```

Use these absolute paths later in `launchd`/LaunchAgent configurations.

## 3. GitHub SSH Setup (ED25519 Recommended)

### Confirm system SSH

```bash
which ssh
# expected: /usr/bin/ssh
```

### Generate key

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### Configure `~/.ssh/config`

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

Remove `ProxyCommand` if no local proxy is used.

### Upload pubkey and verify

```bash
pbcopy < ~/.ssh/id_ed25519.pub
ssh -T git@github.com
```

## 4. Install OpenClaw and Useful CLIs

### Optional model-side CLIs

```bash
pnpm add -g @openai/codex
pnpm add -g @google/gemini-cli
```

### Install OpenClaw

```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g
openclaw onboard --install-daemon
```

Recommended onboarding choices:

- Mode: `QuickStart`
- Provider: `OpenAI`
- Hooks: all enabled

## 5. Key Post-Install Settings

### Web UI entry points

- First time: tokenized URL from onboarding
- Daily: `http://127.0.0.1:18789/`

### Suggested auto-update config

```json
"update": {
  "channel": "stable",
  "auto": {
    "enabled": true,
    "stableDelayHours": 6,
    "stableJitterHours": 12,
    "betaCheckIntervalHours": 1
  }
}
```

### Suggested model fallback config

```json
"agents": {
  "defaults": {
    "model": {
      "primary": "openai-codex/gpt-5.3-codex",
      "fallbacks": [
        "bailian/qwen3.5-plus",
        "bailian/qwen3-coder-plus"
      ]
    }
  }
}
```

## 6. Troubleshooting Checklist

### `pnpm` not found in daemon

Check LaunchAgent `ProgramArguments` and use absolute paths.

### Native module build failure

Run `pnpm approve-builds -g` and ensure scripts are not blocked.

### GitHub SSH timeout

Use `ssh.github.com:443` and verify proxy port config.

### Environment drift

Run this before work:

```bash
node -v && pnpm -v && openclaw --version
```

With these steps done, OpenClaw on a new Mac is stable and production-ready.
