---
title: "Gatsby 블로그 템플릿"
description: "이 사이트는 Gatsby를 사용하여 구축된 정적 웹 사이트입니다. 사용해 보십시오."
category: "life"
tags:
  - "roam"
pubDate: 2021-11-20
heroImage: "https://cos.zbz.ai/images/202310181512144.avif"
heroImageAlt: "RealRip-Gatsby 블로그 템플릿"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "ko"
---

Gatsby를 사용하여 정적 웹 사이트를 구축하기 위한 템플릿입니다.

소스 코드는 **[gatsby-starter-glass](https://github.com/xiyizhou/gatsby-starter-glass)**에 있습니다. 사용해 보십시오.

## 특징

- 즉시 사용 가능
- 완전히 현지화됨
- [Waline](https://waline.js.org) 댓글 포함
- Google Analytics 포함
- Markdown 편집

## 로컬 배포

```bash
# 1. 로컬로 복제
git clone https://github.com/xiyizhou/gatsby-starter-glass.git

# 2. 디렉터리로 이동
cd gatsby-starter-glass

# 3. 종속성 설치
yarn install

# 4. 개발 모드 시작
yarn start

# 5. 프로덕션 버전 빌드
yarn  build
```

## 구성

- `gatsby-config.js`에서 웹 사이트 정보, Google Analytics ID 등을 구성합니다.
- `src/components/header.js`에서 상단 탐색 모음 정보를 구성합니다.
- `src/components/footer.js`에서 하단 탐색 모음 정보를 구성합니다.

- `src/components/comment.js`에서 Waline 정보를 구성합니다.

## 기사 게시

### 블로그 게시물

블로그 게시물은 `content/blog`에 있습니다. 템플릿은 다음과 같습니다.

```md
---
title: Gatsby용 Waline 댓글 구성 요소 설치
date: 2021-11-17 08:08
slug: gatsby-waline
category: 생활
tags:
  - 생활
description: Waline에는 아직 Gatsby 구성 요소가 없으므로 Waline 클라이언트 라이브러리를 설치하고 React 구성 요소를 만든 다음 적절한 위치에 구성 요소를 도입하여 Gatsby 사이트에 Waline 댓글 기능을 추가합니다.
---

Gatsby는 반응 기반의 정적 웹 사이트 구축 프레임워크로, 온라인 상점, 공식 웹 사이트 및 블로그를 배포하는 데 사용할 수 있습니다. 풍부한 플러그인을 사용하여 이미지 지연 로딩, Markdown 문서 지원 및 방문자 댓글과 같은 기능을 실현할 수 있습니다. Gatsby에서 공식적으로 권장하는 댓글 시스템에는 Disqus, Gitalk 등이 있습니다.
```

### 페이지

페이지 콘텐츠는 `content/pages`에 있습니다.

## 주의 사항

- 이 스타터는 Gatsby V3를 기반으로 합니다. 플러그인을 설치할 때 버전 호환성에 주의하십시오.
- 기본 프레임워크는 [gatsby-starter-glass](https://github.com/yinkakun/gatsby-starter-glass)에서 현지화되었습니다. [yinkakun](https://github.com/yinkakun)에게 감사드립니다.
