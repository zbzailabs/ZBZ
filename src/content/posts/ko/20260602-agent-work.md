---
title: "나의 AI 협업 워크플로"
description: "OpenAI의 ChatGPT, Codex, Pulse, deep research를 사용해 프로젝트 제안서와 소프트웨어 개발을 진행하는 방식"
category: "startup"
tags:
  - "allocation"
  - "strategy"
  - "innovation"
pubDate: 2026-06-02
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260603105442913.avif"
heroImageAlt: "나의 AI 협업 워크플로"
heroImageWidth: 2400
heroImageHeight: 1350
draft: false
featured: false
locale: ko
---

2023년부터 ChatGPT를 계속 사용해 왔습니다. 일반 사용자에서 유료 사용자로, Plus에서 Pro로 단계적으로 업그레이드했습니다. 그 과정에서 2025년 하반기 Gemini가 빠르게 부상했을 때는 잠시 Gemini로 플랫폼을 바꾼 적도 있습니다. GPT-5.5가 출시된 뒤 저는 다시 OpenAI 생태계로 돌아왔습니다. 핵심 이유는 두 가지입니다. 첫째, GPT-5.5의 대형 모델 능력은 여전히 다른 모델보다 크게 앞서 있습니다. 사실 대형 모델 간의 벤치마크 경쟁은 일반 사용자에게 큰 의미가 없습니다. 일반 사용자가 원하는 것은 실제 생산성입니다. 현재 GPT는 정말로 납품 가능한 생산성 수준에 도달했습니다. 둘째, OpenAI는 제품화 측면에서 많은 작업을 해 왔습니다. Codex, Pulse, deep research는 각각 사용자의 진입 장벽을 낮춥니다.

현재 저는 OpenAI 제품을 주로 두 가지 업무에 사용합니다. 하나는 프로젝트 제안서 작성이고, 다른 하나는 프로그래밍입니다. 프로젝트 제안서를 만드는 대략적인 흐름은 다음과 같습니다. Feishu Minutes/Lark Minutes를 사용해 현장 조사와 고객 커뮤니케이션 음성을 회의록으로 정리합니다. 검토된 회의록과 기타 프로젝트 자료를 ChatGPT에 전달합니다. deep research 기능을 사용해 ChatGPT가 제안서 초안을 만들게 합니다. 그런 다음 Word 버전으로 내보내 검토하고 수정합니다. 마지막으로 Codex를 사용해 문서 형식을 조정합니다. PowerPoint도 필요하다면 Codex의 presentations 플러그인을 계속 사용해 PPT를 만듭니다. 물론 presentations로 만든 PPT는 완벽하지 않습니다. GitHub에 있는 일부 오픈소스 PowerPoint skills를 사용해 개선할 수 있습니다.

버그 수정과 기능 조정의 경우 Codex는 충분히 감당할 수 있습니다. 하지만 처음부터 완전한 대형 시스템을 개발하려면 Codex에는 아직 많은 과제가 있습니다. 특히 쉽게 통제에서 벗어날 수 있다는 점이 중요합니다. 이때 가장 중요한 것은 경계를 명확하게 제한하는 것입니다. 기술 스택, 기능 범위 등을 확정해야 합니다. 초기 프로젝트라면 먼저 `AGENTS.md`와 `DESIGN.md` 두 파일을 확인합니다. `AGENTS.md`는 기술 스택, 엔지니어링 규칙, 실행 범위를 제한하는 데 사용합니다. `DESIGN.md`는 색상, 글꼴, 컴포넌트 스타일 등 시각 규칙을 제한하는 데 사용합니다. 두 번째 단계는 기술 스택을 선택하는 것입니다. React + TypeScript처럼 AI가 잘 다루는 기술 스택을 선택하고, Java처럼 사람이 익숙하게 잘 다루는 기술 스택을 우선하지 않습니다.

AI는 업무 리듬을 바꾸었고, 그에 따른 건강 문제를 무시할 수 없습니다. AI Agent는 확실히 업무 효율을 크게 높입니다. 당신의 일이 아직 끝나지 않았더라도 Agent가 빠르게 자기 일을 마치고 당신을 앞으로 밀어붙이면, 계속 일할 수밖에 없는 상황이 됩니다. 게다가 딴짓할 틈이 없는 고강도 작업이 됩니다. 뇌가 계속 돌아가고, 시간이 길어지면 매우 피곤해집니다. 따라서 외부 방식으로 스스로 멈추게 해야 합니다. 가장 좋은 방법은 포모도로 기법입니다. 25분 일하고 5분 쉬면서 뇌를 이완시킵니다. 물론 Agent와의 협업이 잘 맞으면 Agent가 일하는 동안 당신이 쉴 수도 있습니다.
