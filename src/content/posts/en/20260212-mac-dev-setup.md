---
title: "The Complete Guide to Modern Development Environment Setup on M-Series Mac"
description: "A comprehensive guide tailored for Apple Silicon (M1/M2/M3) chips, covering essential tools, GitHub connectivity, and standardized development workflows"
category: "startup"
tags:
  - "innovation"
  - "management"
pubDate: 2026-02-12
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260212-mac-github.avif"
heroImageAlt: "Mac Development Environment Setup"
heroImageWidth: 5632
heroImageHeight: 3072
draft: false
featured: false
locale: en
---

# The Complete Guide to Modern Development Environment Setup on M-Series Mac

This is a comprehensive guide tailored specifically for Apple Silicon (M1/M2/M3) chips. It covers not only the installation of essential tools but also addresses pain points like GitHub connectivity issues and native build script blocking in development environments.



## Phase 1: Essential Development Environment Setup

On M-series chips, aligning paths and architectures is crucial for stability.

### 1. Install Homebrew (Package Manager)

On Apple Silicon, Homebrew installs to `/opt/homebrew` by default.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Configure Environment Variables:**

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### 2. Install fnm (Node.js Version Manager)

`fnm` natively supports ARM64 and is currently the most performant Node manager for macOS.

```bash
brew install fnm
```

Add the following to `~/.zshrc` to automatically switch Node versions when entering project directories:

```bash
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
source ~/.zshrc
```

### 3. Install pnpm (Core Package Manager)

Recommended to install separately via Homebrew with optimized global configuration:

```bash
brew install pnpm
pnpm setup
source ~/.zshrc
```

**Key Optimization:** Allow automatic execution of native module build scripts (like Gemini CLI, Sharp, etc.) to avoid M-chip compilation errors:

```bash
pnpm config set -g ignore-scripts false
```

------

## Phase 2: GitHub Secure Connection and Network Tunneling

Resolve common connection timeout or reset issues through SSH-over-HTTPS (port 443) with proxy tools.

### 1. Global Identity Configuration

Replace the placeholders below with your own GitHub information:

```bash
git config --global user.name "<your_username>"
git config --global user.email "<your_email@example.com>"
git config --global init.defaultBranch main
```

### 2. Generate ED25519 Key

```bash
ssh-keygen -t ed25519 -C "<your_email@example.com>"
```

Run `cat ~/.ssh/id_ed25519.pub` and add the content to [GitHub SSH Settings](https://github.com/settings/keys).

### 3. Write a "Universal" SSH Config File

Edit `~/.ssh/config` to ensure traffic goes through your designated proxy port (example uses 7897):

```
Host github.com
  HostName ssh.github.com
  Port 443
  User git
  IdentityFile ~/.ssh/id_ed25519
  AddKeysToAgent yes
  UseKeychain yes
  # Force through local proxy (modify port based on your proxy tool)
  ProxyCommand nc -X 5 -x 127.0.0.1:7897 %h %p
```

**Permission Fix:**

```bash
chmod 600 ~/.ssh/config
```

------

## Phase 3: Standardized Development Workflow

Once the environment is ready, following a standardized workflow greatly improves collaboration and maintenance efficiency.

### 1. Environment Check

After entering a project directory, verify that the environment is correctly aligned:

```bash
node -v && pnpm -v
```

### 2. Dependency Management

With script execution enabled, native modules will automatically complete local compilation during installation:

```bash
pnpm install
```

### 3. Conventional Commits

We recommend using the **Conventional Commits** specification to keep commit history clear:

- `feat:` New feature
- `fix:` Bug fix
- `chore:` Build process or auxiliary tool changes
- `docs:` Documentation changes

**Tip:** You can use AI tools to help generate proper commit messages:

```bash
git diff --cached | <ai_tool_command> "Generate English commit message based on changes"
```

### 4. Push and Sync

```bash
git pull origin main  # Pull before pushing to avoid conflicts
git push origin main
```
