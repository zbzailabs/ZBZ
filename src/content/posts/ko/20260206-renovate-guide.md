---
title: "Renovate 자동 종속성 업데이트 가이드"
description: "Renovate를 사용하여 GitHub 저장소 종속성을 완전히 자동화하고 수동 개입 없이 업데이트"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-06
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260206-renovate-guide.avif"
heroImageAlt: "Renovate 자동 종속성 업데이트"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: ko
---

## 소개

프로젝트 종속성 유지 관리는 개발자의 일상 업무의 일부입니다. 종속성 버전을 수동으로 확인, 업데이트 및 테스트하는 것은 시간이 많이 소요될 뿐만 아니라 누락하기도 쉽습니다. 이 기사에서는 **Renovate**를 사용하여 종속성 업데이트를 완전히 자동화하는 방법을 설명합니다.

## 목표

- 매일 새벽에 자동으로 종속성 업데이트 확인
- PR을 자동으로 생성하고 병합(CI 통과 후)
- 수동 개입 없이 백그라운드에서 실행
- 여러 저장소의 통합 관리

## Renovate 설치

1. [GitHub Apps - Renovate](https://github.com/apps/renovate) 방문
2. **설치** 클릭
3. 활성화할 저장소 선택(모두 또는 특정 저장소)
4. 권한 부여 완료

## 구성 파일

저장소 루트에 `renovate.json`을 생성합니다：

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    ":automergeAll",
    ":disableDependencyDashboard"
  ],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
```

커밋 및 푸시：

```bash
git add renovate.json
git commit -m "chore: configure Renovate for automated dependency updates"
git push
```

## 구성 세부 정보

| 옵션 | 설명 |
|------|------|
| `config:recommended` | Renovate 공식 권장 기본 구성 |
| `:automergeAll` | **핵심 구성** — 모든 업데이트(메이저 버전 포함) 자동 병합 |
| `:disableDependencyDashboard` | 대시보드 이슈를 비활성화하여 백그라운드 실행 |
| `timezone` | 시간대를 Asia/Shanghai로 설정 |
| `schedule` | 매일 오전 3시 전에 실행 |

## 워크플로

```
매일 오전 3:00
    ↓
Renovate가 package.json 종속성 확인
    ↓
사용 가능한 업데이트 감지됨
    ↓
풀 리퀘스트 자동 생성
    ↓
CI 체크 트리거
    ↓
CI 통과 → main 브랜치에 자동 병합
    ↓
다음 날 아침 업데이트된 종속성 확인
```

## 다중 저장소 구성

여러 프로젝트에 동일한 구성 파일을 복사합니다：

```bash
# 범용 구성 생성
cat > renovate.json << 'EOF'
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended", ":automergeAll", ":disableDependencyDashboard"],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
EOF

# 여러 저장소에 적용
for repo in repo1 repo2 repo3; do
  cp renovate.json $repo/
  cd $repo && git add . && git commit -m "chore: configure Renovate" && git push
  cd ..
done
```

## 자주 묻는 질문

### PR이 자동 병합되지 않나요?

CI 상태를 확인하세요. Renovate는 모든 CI 체크 통과 후에만 병합합니다. CI가 실패하면 수동으로 문제를 수정하고 다시 실행하세요.

### 즉시 업데이트를 트리거하려면?

- 대시보드가 활성화된 경우: Issues → Dependency Dashboard → 업데이트할 패키지 선택 → Rebase 클릭
- 또는 예약된 시간의 자동 실행 대기

### 특정 종속성을 제외하려면?

구성에 제외 규칙을 추가：

```json
{
  "packageRules": [{
    "matchPackageNames": ["package-name"],
    "enabled": false
  }]
}
```

### pnpm / yarn / npm 지원?

Renovate가 잠금 파일 유형을 자동으로 감지하므로 추가 구성이 필요 없습니다.

## 검증

구성을 푸시한 후 Renovate는 자동으로 실행됩니다(또는 예약된 시간을 기다립니다). 검증 단계：

1. 저장소 **풀 리퀘스트** 페이지로 이동
2. Renovate가 생성한 PR 확인(제목 형식: `chore(deps): update ...`)
3. PR의 자동 병합이 활성화되어 있는지 확인
4. CI 통과 후 자동 병합

## 요약

단 5줄의 핵심 구성：

```json
{
  "extends": [
    "config:recommended",
    "automergeAll",
    "disableDependencyDashboard"
  ],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
```

완전히 자동화된 종속성 관리를 실현하여 개발자가 비즈니스 코드에 집중할 수 있도록 합니다.
