---
title: "M칩 Mac에서 OpenClaw QMD 메모리 백엔드 활성화하기"
description: "Apple Silicon Mac에서 QMD 메모리 백엔드 구성 방법을 자세히 설명. 완전한 단계와 선택 권장 사항 포함"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-07
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260207-openclaw-qmd-guide.avif"
heroImageAlt: "OpenClaw QMD 구성 튜토리얼"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: ko
---

> ⚠️ **선택 권장 사항**: 이 문서는 QMD 구성 과정을 기록하지만, 실제 평가 결과 **대부분의 시나리오에서 OpenClaw 내장 인덱스가 충분히 우수합니다**. QMD는 추가로 약 600MB의 메모리와 더 복잡한 유지 관리가 필요합니다. 실제 요구 사항(완전한 오프라인 실행 필요 여부, 검색 품질에 대한 매우 높은 요구 사항 등)에 따라 활성화할지 결정하세요.

이 문서에서는 Apple Silicon(M1/M2/M3/M4) Mac에서 OpenClaw에 QMD(Query Markdown Database) 메모리 백엔드를 구성하여 BM25 + 벡터 + 재순위화 하이브리드 검색을 구현하는 방법을 소개합니다.

## 전제 조건

- macOS 14+(Sonoma / Sequoia)
- OpenClaw 2026.2.3-1 이상
- Homebrew(SQLite 설치용)

## 1단계: Bun 설치

QMD는 Bun 런타임에 의존합니다. 먼저 Bun을 설치하세요:

```bash
curl -fsSL https://bun.sh/install | bash
```

설치 확인:
```bash
~/.bun/bin/bun --version
# 출력: 1.3.8
```

## 2단계: SQLite 설치(확장 지원)

QMD에는 확장을 지원하는 SQLite가 필요합니다:

```bash
brew install sqlite
```

## 3단계: QMD 설치

Bun을 사용하여 QMD를 전역으로 설치하세요:

```bash
~/.bun/bin/bun install -g https://github.com/tobi/qmd
```

QMD 설치 확인:
```bash
export PATH="$HOME/.bun/bin:$PATH"
qmd --version
```

## 4단계: OpenClaw에서 QMD 사용 구성

OpenClaw 구성 파일을 편집하세요:

```bash
openclaw config edit
```

`memory` 구성을 추가하거나 수정하세요:

```json
{
  "memory": {
    "backend": "qmd"
  }
}
```

전체 구성 예제(선택적 매개변수 포함):

```json
{
  "memory": {
    "backend": "qmd",
    "citations": "auto",
    "qmd": {
      "includeDefaultMemory": true,
      "update": { 
        "interval": "5m", 
        "debounceMs": 15000 
      },
      "limits": { 
        "maxResults": 6, 
        "timeoutMs": 4000 
      }
    }
  }
}
```

## 5단계: OpenClaw 재시작

```bash
openclaw gateway restart
```

## 6단계: QMD 인덱스 초기화

재시작 후 QMD가 자동으로 인덱스를 생성합니다. 수동으로 초기화하려면:

```bash
# 환경 변수 설정
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"

# 컬렉션 생성
cd ~/.openclaw/workspace
qmd collection add memory --name memory-root --mask "**/*.md"

# 벡터 임베딩 생성(첫 실행 시 약 600MB 모델 다운로드)
qmd embed
```

첫 번째 `qmd embed` 실행 시 HuggingFace에서 자동으로 다운로드됩니다:
- `embeddinggemma-300M-Q8_0.gguf`(임베딩 모델)
- `qwen3-reranker-0.6b-q8_0.gguf`(재순위화 모델)
- `Qwen3-0.6B-Q8_0.gguf`(쿼리 확장 모델)

## 7단계: QMD가 활성화되었는지 확인

메모리 검색 테스트:

```bash
openclaw memory-search "OpenClaw 메모리 시스템"
```

`source: "qmd//memory-root/..."`가 표시되면 QMD가 활성화된 것입니다.

QMD 상태 확인:

```bash
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"
qmd status
```

## 자주 묻는 질문

### QMD가 활성화되지 않고 내장 인덱스가 여전히 표시됨

`~/.openclaw/openclaw.json`에서 `memory.backend`가 `"qmd"`로 설정되어 있는지 확인하고 Gateway를 재시작하세요.

### 모델 다운로드 실패

중국 본토 사용자는 HuggingFace 미러를 설정할 수 있습니다:
```bash
export HF_ENDPOINT=https://hf-mirror.com
qmd embed
```

### 메모리 부족

M 시리즈 Mac은 최소 8GB 메모리를 권장합니다. 임베딩 프로세스가 종료되면 다른 애플리케이션을 닫아보세요.

## 구성 참조

| 구성 항목 | 설명 | 기본값 |
|--------|------|--------|
| `memory.backend` | 메모리 백엔드 유형 | `"qmd"` |
| `memory.citations` | 인용 출처 표시 여부 | `"auto"` |
| `memory.qmd.update.interval` | 인덱스 업데이트 간격 | `"5m"` |
| `memory.qmd.limits.maxResults` | 최대 반환 결과 수 | `6` |
| `memory.qmd.limits.timeoutMs` | 검색 시간 초과 | `4000` |

## 요약

QMD를 활성화하면 OpenClaw의 메모리 검색에 다음 기능이 제공됩니다:
- **BM25 전문 검색**: 키워드, ID, 코드 기호의 정확한 일치
- **벡터 의미 검색**: 동의어, 개념 연결 이해
- **재순위화 최적화**: Qwen3 재순위화 도구로 관련성 향상

내장 SQLite + Gemini Embeddings와 비교하여 QMD는 로컬에서 완전히 실행되며 외부 API에 의존하지 않고 더 높은 검색 품질을 제공합니다.
