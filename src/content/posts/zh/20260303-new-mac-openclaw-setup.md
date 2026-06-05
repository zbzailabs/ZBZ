---
title: "如何在一台新 Mac 安装 OpenClaw"
description: "从零开始在新 Mac 上完成 OpenClaw 安装与开发环境配置，包含 Homebrew、fnm、pnpm、SSH、onboard 与常见问题排查。"
category: "startup"
tags:
  - "innovation"
  - "management"
  - "strategy"
pubDate: 2026-03-03
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260303-new-mac-openclaw-setup.avif"
heroImageAlt: "新 Mac 上的 OpenClaw 安装流程图"
heroImageWidth: 2400
heroImageHeight: 2400
draft: false
featured: false
locale: zh
---

# 如何在一台新 Mac 安装 OpenClaw

这是一份面向新 Mac 的实战安装指南：先把系统基础打稳，再配置 Node 与 GitHub，最后完成 OpenClaw onboarding 与日常使用所需设置。

## 1. 先打基础：命令行与包管理

### 安装 Xcode Command Line Tools

```bash
xcode-select --install
```

### 安装 Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 配置 Homebrew 环境变量（Apple Silicon）

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## 2. 配置 Node.js 与 pnpm

### 安装 fnm 并启用自动切换

```bash
brew install fnm
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
source ~/.zshrc
```

### 安装 Node LTS 并设为默认

```bash
fnm install --lts
fnm default lts-latest
```

### 启用 Corepack 并激活 pnpm

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### 验证关键二进制路径

```bash
which node
which pnpm
node -v
pnpm -v
```

`launchd` 等非交互环境依赖绝对路径。后续写 LaunchAgent 时，直接使用上面 `which` 的结果。

## 3. 配置 GitHub SSH（推荐 ED25519）

### 先确认使用系统 SSH

```bash
which ssh
# 预期：/usr/bin/ssh
```

### 生成密钥

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### 配置 `~/.ssh/config`

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

如果你没有本地代理，删除 `ProxyCommand` 一行即可。

### 上传公钥并验证

```bash
pbcopy < ~/.ssh/id_ed25519.pub
ssh -T git@github.com
```

## 4. 安装 OpenClaw 与常用 CLI

### 可选：先装模型侧 CLI

```bash
pnpm add -g @openai/codex
pnpm add -g @google/gemini-cli
```

### 安装 OpenClaw

```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g
openclaw onboard --install-daemon
```

Onboarding 推荐选择：

- Mode: `QuickStart`
- Provider: `OpenAI`
- Hooks: 全选（便于后续自动化与可观测）

## 5. 首次启动后的关键设置

### Web UI 入口

- 初次：使用 onboarding 返回的带 token 链接
- 常用：`http://127.0.0.1:18789/`

### 建议开启自动更新

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

### 建议配置模型 fallback

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

## 6. 常见问题与排查清单

### `pnpm` 在守护进程中找不到

优先排查 LaunchAgent 里的 `ProgramArguments` 是否写了绝对路径。

### 原生模块安装失败

执行 `pnpm approve-builds -g`，并确认未禁用脚本执行。

### GitHub SSH 超时

优先用 `ssh.github.com:443`，并检查代理端口配置是否与本机一致。

### 环境漂移

每次开工先跑：

```bash
node -v && pnpm -v && openclaw --version
```

完成以上步骤后，一台新 Mac 的 OpenClaw 开发环境就能稳定落地。
