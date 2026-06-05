---
title: "Dokploy와 Nixpacks를 사용하여 Astro 프로젝트 배포 및 캐싱 활성화로 빌드 속도 최적화"
description: "Dokploy와 Nixpacks를 사용하여 Astro 정적 웹사이트를 빠르게 배포하고, 캐싱 메커니즘을 완전히 활성화하여 빌드 속도를 크게 향상시킵니다. 이 튜토리얼은 Astro 구성, Dokploy 환경 변수 설정 및 Nixpacks 캐시 최적화 전략을 다루며, 콘텐츠 중심 웹사이트의 지속적인 통합 및 배포 관행에 적합합니다."
category: "startup"
tags:
  - "innovation"
pubDate: 2025-07-14
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20250714082742453.avif"
heroImageAlt: "ZBZ-Dokploy와 Nixpacks를 사용하여 Astro 프로젝트 배포 및 캐싱 활성화로 빌드 속도 최적화"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: ko
---

## I. Dokploy 구성

Dokploy는 Heroku, Vercel 및 Netlify의 무료 대안으로 설계된 오픈 소스, 자체 호스팅 가능한 배포 플랫폼으로, Docker 및 Traefik을 기반으로 구축되었습니다.

### 1. 새 프로젝트 생성 및 GitHub 리포지토리 연결

### 2. 환경 변수 설정

```bash
NIXPACKS_NODE_VERSION=22
NIXPACKS_PNPM_STORE_PATH=/root/.local/share/pnpm/store/v3
NIXPACKS_INSTALL_CACHE_DIRS=/app/node_modules
NIXPACKS_BUILD_CACHE_DIRS=/app/node_modules/.cache,/app/astro_cache
```

### 3. 캐시 정리 비활성화

- 프로젝트 서비스 → **Clean Cache**: 비활성화
- 웹 서버 → **Daily Docker Cleanup**: 비활성화

---

## II. Nixpacks 빌드 엔진

Nixpacks는 Railway에서 출시한 오픈 소스 빌드 도구로, 소스 코드를 표준 Docker 이미지로 빌드합니다. Dokploy는 Nixpacks를 기본 빌드 엔진으로 사용하며 `nixpacks.toml` 또는 `nixpacks.json` 파일에서 빌드 구성을 지정하는 것을 지원합니다. 프로젝트 루트 디렉터리에 `nixpacks.toml` 파일을 만들고 관련 캐시 디렉터리를 구성합니다.

### 구성 우선순위 (낮음 → 높음):

1. 공급자 기본 로직
2. `nixpacks.toml`
3. 환경 변수
4. CLI 인수

### 일반적인 환경 변수

| 변수 이름                     | 설명                          |
| :---------------------------- | :---------------------------- |
| `NIXPACKS_INSTALL_CMD`        | 사용자 지정 설치 명령         |
| `NIXPACKS_BUILD_CMD`          | 사용자 지정 빌드 명령         |
| `NIXPACKS_START_CMD`          | 사용자 지정 시작 명령         |
| `NIXPACKS_PKGS`               | 추가 Nix 패키지 설치          |
| `NIXPACKS_APT_PKGS`           | 추가 Apt 패키지 설치          |
| `NIXPACKS_INSTALL_CACHE_DIRS` | 설치 단계 캐시 디렉터리       |
| `NIXPACKS_BUILD_CACHE_DIRS`   | 빌드 단계 캐시 디렉터리       |
| `NIXPACKS_NO_CACHE`           | 캐시 비활성화 (권장하지 않음) |
| `NIXPACKS_CONFIG_FILE`        | 구성 파일 지정                |
| `NIXPACKS_DEBIAN`             | Debian 기본 이미지 활성화     |

## III. Astro 프로젝트 구성

Astro는 콘텐츠 사이트를 위한 최신 웹 프레임워크로, 블로그, 마케팅 페이지 및 전자 상거래와 같은 정적 웹사이트에 특히 적합합니다. 웹사이트에 많은 이미지와 정적 리소스가 있는 경우 빌드 속도에 영향을 줄 수 있습니다. 캐싱 메커니즘을 활성화하면 빌드 효율성을 크게 향상시킬 수 있습니다.

### 1. 빌드 캐시 아티팩트 디렉터리 구성:

Astro 프로젝트는 후속 빌드에서 이전 빌드 아티팩트를 재사용하기 위해 구성 파일에 캐시 디렉터리를 지정해야 합니다. 이 디렉터리의 파일은 후속 빌드에서 사용되어 빌드 시간을 단축합니다.
이 값은 절대 경로이거나 상대 경로일 수 있습니다.

```js
//`astro.config.mjs`
export default defineConfig({
  cacheDir: "./astro_cache",
});
```

---

### 2. Nixpacks 캐시 구성 파일

Astro 프로젝트 루트 디렉터리에 `nixpacks.toml` 파일을 만들고 캐시 디렉터리 및 빌드 명령을 구성합니다.

```toml
# 지정된 Node.js 및 pnpm 버전 사용
[phases.setup]
nixPkgs = ["nodejs_22", "pnpm"]

# 종속성 설치 및 pnpm 캐시 활성화
[phases.install]
cmds = ["pnpm install --frozen-lockfile"]
cacheDirectories = ["/root/.local/share/pnpm/store/v3"]

# Astro 프로젝트 빌드 및 node_modules/.cache 및 astro_cache 캐시
[phases.build]
cmds = ["pnpm run build"]
cacheDirectories = [
  "node_modules/.cache",
  "astro_cache"
]

# 시작 명령 (dist 정적 디렉터리를 제공하기 위해 NGINX를 사용하므로 이것은 자리 표시자일 뿐입니다)
[start]
cmd = "echo '빌드 완료, NGINX를 통해 dist 디렉터리에 액세스하십시오'"
```

---

## 3. Docker 빌드 컨텍스트 최적화

Astro 프로젝트 루트 디렉터리에 `.dockerignore`를 추가합니다:

```
node_modules
astro_cache
dist
*.log
.DS_Store
.vscode
.env*
```

---

## IV. 배포 및 확인

Dokploy 자동 배포 후 빌드 로그에서 다음 내용이 포함되어 있는지 확인하여 캐싱이 효과적인지 확인하십시오.

### 1. 빌드 명령이 마운트된 캐시를 사용했습니다

```bash
RUN --mount=type=cache,id=xxxx-node_modules/cache,target=/app/node_modules/.cache \
    --mount=type=cache,id=xxxx-astro_cache,target=/app/astro_cache \
    pnpm run build
```

### 2. Astro 빌드가 캐시 항목을 재사용했습니다 (특히 이미지 최적화)

```bash
▶ /_astro/202409272055577_Z2smeTW.avif (reused cache entry)
▶ /_astro/202409272055575_Z2wPyJN.avif (reused cache entry)
▶ /_astro/202409272055577_1IgP6g.avif (reused cache entry)
```

✅ 위의 마운트 캐시 로그와 "reused cache entry" 텍스트가 표시되면 캐싱 메커니즘이 성공적으로 활성화되었으며 빌드가 증분 가속화를 달성했음을 의미합니다.

🎉 Dokploy 프로젝트의 Deployments 탭에서도 캐시 설정 없이는 프로젝트 빌드에 31분이 걸리는 반면, 캐시 설정을 활성화하면 3분밖에 걸리지 않아 빌드 시간을 크게 단축하고 트래픽과 대역폭을 절약할 수 있음을 확인할 수 있습니다.

## V. Tencent EdgeOne으로 사이트 가속화

## 배경: 국경 간 전송의 "불가능한 삼각형"

싱가포르에 서버 배포. 이 솔루션은 비용 효율적이며 번거로운 등록 프로세스가 필요하지 않지만 중국 본토 사용자의 경우 액세스 경험이 종종 큰 문제에 직면합니다.

1. **높은 물리적 지연 시간**: 싱가포르에서 중국 본토까지의 RTT(왕복 시간)는 일반적으로 50ms - 200ms 사이에서 변동합니다.
2. **심각한 패킷 손실**: GFW 방화벽의 간섭으로 인해 TCP 핸드셰이크가 자주 시간 초과되어 이미지가 중간에 로드되지 않고 멈추는(Pending) 현상이 발생합니다.
3. **점프 지연**: 다중 페이지 애플리케이션은 링크를 클릭할 때 긴 흰색 화면 대기가 필요합니다.

이 문제를 해결하기 위해 **Tencent Cloud EdgeOne**을 **Traefik**의 정교한 구성과 함께 사용하여 "콤보 펀치"를 만들어 로컬에 등록된 웹사이트에 가까운 거의 즉각적인 열기 경험을 달성했습니다.

### 핵심 아키텍처 아이디어

우리의 최적화 전략은 **패킷 손실 방지**, **압축 오프로드**, **계층화된 캐싱**이라는 세 가지 키워드를 중심으로 전개됩니다.

1. **프로토콜 계층 (EdgeOne)**: UDP 특성을 기반으로 하는 **HTTP/3 (QUIC)** 프로토콜을 활용하여 TCP 국경 간 패킷 손실로 인한 콘텐츠 로드 중단을 완전히 해결합니다.
2. **전송 계층 (Traefik -> EdgeOne)**: Traefik 원본 압축을 끄고 EdgeOne 엣지 노드가 더 효율적인 **Brotli** 지능형 압축을 담당하여 전송 볼륨을 줄이도록 합니다.
3. **캐시 계층 (전략)**: `s-maxage`를 사용하여 "CDN 장기 캐시"와 "브라우저 단기 캐시"의 분리를 달성하여 CDN 적중률과 콘텐츠 업데이트 적시성을 모두 보장합니다.

### I. EdgeOne 전역 구성 ("패킷 손실 방지" 모드 활성화)

EdgeOne은 등록되지 않은 도메인에 대해 국내 노드를 제공할 수 없지만 엣지 노드(홍콩/싱가포르)에서 국내 회선으로의 회선은 최적화되어 있으며 "네트워크 지연"을 해결하는 핵심인 QUIC 프로토콜을 지원합니다.

EdgeOne 콘솔 -> **사이트 가속** -> **기능 구성**으로 들어갑니다.

### 1. HTTP/3 (QUIC) 활성화 ✅

이것은 가장 중요한 단계입니다. 패킷 손실률이 높은 국경 간 네트워크에서 QUIC 프로토콜은 TCP 헤드 오브 라인 차단을 효과적으로 방지할 수 있습니다. 활성화 후 이미지가 "회전"하거나 "반쯤 로드되는" 현상이 완전히 사라집니다.

### 2. 지능형 압축 활성화 (Brotli + Gzip) ✅

Brotli와 Gzip을 모두 활성화하는 것이 좋습니다. EdgeOne은 지원되는 브라우저에 **Brotli (`br`)** 형식을 우선적으로 반환하며, 이는 Gzip보다 15%-20% 높은 압축률을 갖습니다. 부피가 작을수록 벽을 통과하는 속도가 빨라집니다.

### 3. 캐시 사전 새로 고침 활성화 (90%) ✅

사전 새로 고침 비율을 **90%**로 설정합니다. 이는 캐시가 만료되기 전 마지막 10%의 시간 동안 CDN이 비동기적으로 소스로 돌아가 업데이트함을 의미합니다. 사용자는 "캐시 만료로 인한 소스 반환"으로 인한 지연을 겪지 않으며 100% 적중 경험을 달성합니다.

## II. Traefik 구성 최적화 (원본 전략)

Traefik의 `dynamic_conf.yml`(또는 Docker 레이블)을 수정하여 **압축 오프로드**와 **정교한 캐시 헤더 주입**이라는 두 가지 작업을 수행해야 합니다.

### 1. 원본 압축 비활성화

라우터 구성을 확인하고 모든 `compress`(Gzip) 미들웨어를 **제거**하십시오.

- **이유**: EdgeOne은 이미 Brotli 압축을 담당하고 있습니다. 원본에서 다시 Gzip을 수행하면 CPU가 낭비되고 이중 압축 문제가 발생할 수 있습니다.

### 2. 계층화된 캐시 전략 정의 (핵심 코드)

이것은 "기사 게시 후 사용자가 새 콘텐츠를 볼 수 없음"과 "직접 소스 반환 속도가 너무 느림" 사이의 모순을 해결하는 핵심입니다.

Traefik에서 HTML 페이지 전용 미들웨어를 정의합니다.

```yaml
http:
  routers:
    # HTTPS 리디렉션 강제
    idimi-uygy0r-redirect-https:
      entryPoints:
        - web
      rule: Host(`zbz.ai`)
      middlewares:
        - idimi-uygy0r-to-https
      service: noop@internal
      priority: 1000

    # Service Worker (PWA 핵심) - 압축 없음, EdgeOne에서 처리
    idimi-uygy0r-sw:
      rule: >
        Host(`zbz.ai`) &&
        ( Path(`/service-worker.js`) || Path(`/sw.js`) )
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-no-store
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 900

    # Astro 핵심 정적 리소스 (Hash 지문) - 압축 없음, EdgeOne에서 처리
    idimi-uygy0r-static-immutable:
      rule: >
        Host(`zbz.ai`) &&
        ( PathPrefix(`/_astro`) || PathPrefix(`/assets`) )
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-static-immutable
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 800

    # Pagefind WASM 파일 - 압축 없음, EdgeOne에서 처리
    idimi-uygy0r-pagefind-wasm-ctype:
      rule: >
        Host(`zbz.ai`) &&
        PathRegexp(`^/pagefind/.*\\.wasm$`)
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-set-wasm-ctype
        - idimi-uygy0r-cache-static-immutable
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 760

    # Pagefind 인덱스 파일 - 압축 없음, EdgeOne에서 처리
    idimi-uygy0r-pagefind-immutable:
      rule: >
        Host(`zbz.ai`) &&
        PathPrefix(`/pagefind`)
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-static-immutable
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 750

    # Sitemap / Robots / RSS - 압축 없음, EdgeOne에서 처리
    idimi-uygy0r-meta-short:
      rule: >
        Host(`zbz.ai`) &&
        ( Path(`/sitemap.xml`) ||
          Path(`/robots.txt`) ||
          Path(`/sitemap-index.xml`) ||
          Path(`/atom.xml`) || Path(`/rss.xml`) || Path(`/feed.xml`) )
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-short
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 700

    # Manifest - 압축 없음, EdgeOne에서 처리
    idimi-uygy0r-manifest:
      rule: >
        Host(`zbz.ai`) &&
        ( Path(`/manifest.webmanifest`) ||
          Path(`/site.webmanifest`) ||
          Path(`/browserconfig.xml`) )
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-1d
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 650

    # 기타 정적 파일 (이미지/동영상 등) - 압축 없음, EdgeOne에서 처리
    idimi-uygy0r-public-30d:
      rule: >
        Host(`zbz.ai`) &&
        PathRegexp(`.+\\..+`)
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-30d-swr
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 600

    # HTML 페이지 (폴백 규칙) - 압축 없음, EdgeOne에서 처리
    # s-maxage=3600 분리 전략 적용됨
    idimi-uygy0r-pages:
      rule: Host(`zbz.ai`)
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-html
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 100

  services:
    idimi-uygy0r-app:
      loadBalancer:
        servers:
          - url: http://idimi-idimi-uygy0r:80
        passHostHeader: true

  middlewares:
    idimi-uygy0r-to-https:
      redirectScheme:
        scheme: https
        permanent: true

    # --- 압축 미들웨어 정의는 유지되지만 호출되지 않음 (라우터에서 제거됨) ---
    idimi-uygy0r-gzip-compress:
      compress:
        minResponseBodyBytes: 1024
        excludedContentTypes:
          - "image/png"
          - "image/jpeg"
          - "image/gif"
          - "image/webp"
          - "image/avif"
          - "font/*"

    idimi-uygy0r-security-headers:
      headers:
        addVaryHeader: true
        stsSeconds: 31536000
        stsIncludeSubdomains: true
        stsPreload: true
        contentTypeNosniff: true
        browserXssFilter: true
        referrerPolicy: "strict-origin-when-cross-origin"
        permissionsPolicy: "geolocation=(), microphone=(), camera=()"
        frameDeny: true
        customResponseHeaders:
          Timing-Allow-Origin: "*"

    idimi-uygy0r-no-store:
      headers:
        customResponseHeaders:
          Cache-Control: "no-cache, no-store, must-revalidate"

    idimi-uygy0r-cache-short:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=600, stale-while-revalidate=600"
          Vary: "Accept-Encoding"

    idimi-uygy0r-cache-1d:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=86400, stale-while-revalidate=86400"
          Vary: "Accept-Encoding"

    idimi-uygy0r-cache-30d-swr:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=2592000, stale-while-revalidate=604800"
          Vary: "Accept-Encoding"

    idimi-uygy0r-cache-static-immutable:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=31536000, immutable"
          Vary: "Accept-Encoding"

    # 주요 수정 사항: HTML 캐시 전략
    # 브라우저는 5분(300초) 동안 캐시하고, CDN은 1시간(3600초) 동안 캐시합니다.
    idimi-uygy0r-cache-html:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=300, s-maxage=3600, stale-while-revalidate=600"
          Vary: "Accept-Encoding"

    idimi-uygy0r-set-wasm-ctype:
      headers:
        customResponseHeaders:
          Content-Type: "application/wasm"
```

**구성 설명:**

- **`s-maxage=3600`**: 이것은 CDN을 위해 특별히 작성된 지시문입니다. EdgeOne은 이것을 보고 HTML 페이지를 1시간 동안 캐시합니다.
- **`max-age=300`**: EdgeOne이 사용자에게 보낼 때 `s-maxage`를 제거하고 사용자의 브라우저는 300초(5분)만 봅니다.
- **효과**: CDN은 1시간 동안 트래픽을 처리하는 반면 사용자는 새로 게시된 기사를 보기 위해 5분만 기다리면 됩니다.

## III. EdgeOne 규칙 엔진

Astro의 URL 구조(접미사 없음)와 동적 이미지 서비스(`/_image`)로 인해 캐시에 적중하려면 정확한 규칙이 필요합니다.

EdgeOne **규칙 엔진**에서 다음 규칙을 엄격하게 **순서대로** 구성하십시오.

### 규칙 1: Astro 핵심 정적 리소스 (영구 캐시)

Astro의 자산, 빌드 아티팩트 및 동적 이미지 서비스, 절대 변경되지 않거나 CPU를 극도로 소비하는 콘텐츠는 강제로 캐시해야 합니다.

- **일치 조건**: `URL 경로` -> `정규식 일치`
- **일치 값**: `^/(_astro|assets|pagefind|_image)/`
- _참고: 여기에는 `_image`가 추가되어 Astro의 `<Image />` 구성 요소에 의해 생성된 동적 최적화 이미지를 특별히 최적화합니다._
- **작업**:
  - 노드 캐시: **365일** (강제)
  - 브라우저 캐시: **365일**

### 규칙 2: 일반 정적 파일

- **일치 조건**: `파일 확장자`가 `png, jpg, jpeg, webp, css, js` 등과 같습니다.
- **작업**: 노드 캐시 **30일** (강제).

### 규칙 3: Service Worker (PWA 핵심)

- **일치 조건**: `URL 경로`가 `/sw.js` 또는 `/service-worker.js`와 같습니다.
- **작업**: 노드 캐시 **1시간** (강제).
- _경고: 너무 오래 캐시하지 마십시오. 그렇지 않으면 릴리스 후 PWA를 제때 업데이트할 수 없습니다._

### 규칙 4: 폴백 규칙 (HTML 페이지)

- **일치 조건**: (조건 없음 / 나머지 모든 요청과 일치)
- **작업**:
  - 노드 캐시: **원본 따르기** (즉, Traefik의 `s-maxage=3600` 읽기).
  - 브라우저 캐시: **원본 따르기** (즉, Traefik의 `max-age=300` 읽기).

## IV. Astro 코드 수준 최적화 (체감 가속)

페이지 전환을 "네이티브 앱"처럼 부드럽게 만들고 점프 중 흰색 화면 대기를 완전히 제거하려면 Astro의 **Client Router(이전 View Transitions)**를 활용해야 합니다.

### 1. Client Router 활성화

`src/layouts/MainLayout.astro`의 `<head>`에 추가합니다.

```js
import { ClientRouter } from 'astro:transitions';

<head>
  <!-- 기타 meta 태그 -->
  <ClientRouter />
</head>
```

### 2. 프리패치 (Prefetch) 활성화

`astro.config.mjs`에서 프리패치 전략을 구성합니다.

```js
export default defineConfig({
  // 'viewport': 링크가 뷰포트에 들어올 때 다운로드 (트래픽과 속도의 균형)
  // 'load': 페이지 로드 직후 모든 링크 다운로드 (극한의 속도이지만 대역폭 소비)
  prefetch: {
    defaultStrategy: "viewport",
  },
  // ...
});
```
