---
title: "M시리즈 칩 Mac 현대 개발 환경 구성 완전 가이드"
description: "Apple Silicon (M1/M2/M3) 칩을 위해 특별히 설계된 포괄적인 가이드. 필수 도구, GitHub 연결 및 표준화된 개발 워크플로우를 다룹니다"
category: "startup"
tags:
  - "innovation"
  - "management"
pubDate: 2026-02-12
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260212-mac-github.avif"
heroImageAlt: "Mac 개발 환경 구성"
heroImageWidth: 5632
heroImageHeight: 3072
draft: false
featured: false
locale: ko
---

# M시리즈 칩 Mac 현대 개발 환경 구성 완전 가이드

이것은 Apple Silicon (M1/M2/M3) 칩을 위해 특별히 설계된 포괄적인 가이드입니다. 필수 도구 설치뿐만 아니라 GitHub 연결 문제 및 개발 환경에서 네이티브 빌드 스크립트 차단과 같은 고통 지점도 해결합니다.



## 1단계: 기본 개발 환경 구성

M시리즈 칩에서 경로와 아키텍처의 정렬은 안정성에 매우 중요합니다.

### 1. Homebrew 설치 (패키지 관리자)

Apple Silicon에서 Homebrew는 기본적으로 `/opt/homebrew`에 설치됩니다.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**환경 변수 구성:**

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### 2. fnm 설치 (Node.js 버전 관리자)

`fnm`은 ARM64를 기본적으로 지원하며 현재 macOS용 가장 성능이 뛰어난 Node 관리자입니다.

```bash
brew install fnm
```

프로젝트 디렉토리에 들어갈 때 Node 버전을 자동으로 전환하려면 다음을 `~/.zshrc`에 추가하세요:

```bash
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
source ~/.zshrc
```

### 3. pnpm 설치 (핵심 패키지 관리자)

최적화된 전역 구성으로 Homebrew를 통해 별도로 설치하는 것이 좋습니다:

```bash
brew install pnpm
pnpm setup
source ~/.zshrc
```

**핵심 최적화:** 네이티브 모듈(Gemini CLI, Sharp 등)의 빌드 스크립트가 자동으로 실행되도록 허용하여 M칩 컴파일 오류를 방지합니다:

```bash
pnpm config set -g ignore-scripts false
```

------

## 2단계: GitHub 안전 연결 및 네트워크 터널링

프록시 도구와 함께 SSH-over-HTTPS(443 포트)를 통해 일반적인 연결 시간 초과 또는 재설정 문제를 해결합니다.

### 1. 전역 ID 구성

아래 자리 표시자를 자신의 GitHub 정보로 바꾸세요:

```bash
git config --global user.name "<your_username>"
git config --global user.email "<your_email@example.com>"
git config --global init.defaultBranch main
```

### 2. ED25519 키 생성

```bash
ssh-keygen -t ed25519 -C "<your_email@example.com>"
```

`cat ~/.ssh/id_ed25519.pub`를 실행하고 내용을 [GitHub SSH Settings](https://github.com/settings/keys)에 추가하세요.

### 3. "범용" SSH 구성 파일 작성

`~/.ssh/config`를 편집하여 트래픽이 지정된 프록시 포트(예제는 7897 사용)를 통해 전달되도록 합니다:

```
Host github.com
  HostName ssh.github.com
  Port 443
  User git
  IdentityFile ~/.ssh/id_ed25519
  AddKeysToAgent yes
  UseKeychain yes
  # 로컬 프록시 강제 (프록시 도구에 따라 포트 수정)
  ProxyCommand nc -X 5 -x 127.0.0.1:7897 %h %p
```

**권한 수정:**

```bash
chmod 600 ~/.ssh/config
```

------

## 3단계: 표준화된 개발 워크플로우

환경이 준비되면 표준화된 워크플로우를 따르는 것이 협업 및 유지보지 효율성을 크게 향상시킵니다.

### 1. 환경 확인

프로젝트 디렉토리에 들어간 후 환경이 올바르게 정렬되었는지 확인하세요:

```bash
node -v && pnpm -v
```

### 2. 의존성 관리

스크립트 실행이 활성화된 상태에서 네이티브 모듈은 설치 중에 자동으로 로컬 컴파일을 완료합니다:

```bash
pnpm install
```

### 3. 규범적 커밋

커밋 기록을 명확하게 유지하기 위해 **Conventional Commits** 사양 사용을 권장합니다:

- `feat:` 새 기능
- `fix:` 버그 수정
- `chore:` 빌드 프로세스 또는 보조 도구 변경
- `docs:` 문서 변경

**팁:** AI 도구를 사용하여 적절한 커밋 메시지 생성을 도울 수 있습니다:

```bash
git diff --cached | <ai_tool_command> "변경 사항을 바탕으로 영어 커밋 메시지 생성"
```

### 4. 푸시 및 동기화

```bash
git pull origin main  # 충돌 방지를 위해 푸시 전에 풀
git push origin main
```
