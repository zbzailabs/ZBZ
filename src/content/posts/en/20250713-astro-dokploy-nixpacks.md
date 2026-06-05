---
title: "Deploy Astro Projects with Dokploy and Nixpacks and Enable Cache to Optimize Build Speed"
description: "Quickly deploy Astro static websites using Dokploy and Nixpacks, fully enabling caching mechanisms to significantly improve build speed. The tutorial covers Astro configuration, Dokploy environment variable settings, and Nixpacks cache optimization strategies, suitable for continuous integration and deployment practices for content-driven websites."
category: "startup"
tags:
  - "innovation"
pubDate: 2025-07-14
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20250714082742453.avif"
heroImageAlt: "ZBZ-Deploy Astro Projects with Dokploy and Nixpacks and Enable Cache to Optimize Build Speed"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: en
---

## I. Dokploy Configuration

Dokploy is an open-source, self-hostable deployment platform designed as a free alternative to Heroku, Vercel, and Netlify, built on top of Docker and Traefik.

### 1. Create a New Project and Connect GitHub Repository

### 2. Set Environment Variables

```bash
NIXPACKS_NODE_VERSION=22
NIXPACKS_PNPM_STORE_PATH=/root/.local/share/pnpm/store/v3
NIXPACKS_INSTALL_CACHE_DIRS=/app/node_modules
NIXPACKS_BUILD_CACHE_DIRS=/app/node_modules/.cache,/app/astro_cache
```

### 3. Disable Cache Cleanup

- Project Service → **Clean Cache**: Disable
- Web Server → **Daily Docker Cleanup**: Disable

---

## II. Nixpacks Build Engine

Nixpacks is an open-source build tool launched by Railway that builds source code into standard Docker images. Dokploy uses Nixpacks as the default build engine and supports specifying build configurations in `nixpacks.toml` or `nixpacks.json` files. Create a `nixpacks.toml` file in the project root directory and configure the relevant cache directories.

### Configuration Priority (Low → High):

1. Provider default logic
2. `nixpacks.toml`
3. Environment variables
4. CLI arguments

### Common Environment Variables

| Variable Name                 | Description                     |
| :---------------------------- | :------------------------------ |
| `NIXPACKS_INSTALL_CMD`        | Custom install command          |
| `NIXPACKS_BUILD_CMD`          | Custom build command            |
| `NIXPACKS_START_CMD`          | Custom start command            |
| `NIXPACKS_PKGS`               | Install extra Nix packages      |
| `NIXPACKS_APT_PKGS`           | Install extra Apt packages      |
| `NIXPACKS_INSTALL_CACHE_DIRS` | Install phase cache directories |
| `NIXPACKS_BUILD_CACHE_DIRS`   | Build phase cache directories   |
| `NIXPACKS_NO_CACHE`           | Disable cache (not recommended) |
| `NIXPACKS_CONFIG_FILE`        | Specify configuration file      |
| `NIXPACKS_DEBIAN`             | Enable Debian base image        |

## III. Astro Project Configuration

Astro is a modern Web framework for content websites, especially suitable for static websites like blogs, marketing pages, and e-commerce. When a website has a large number of images and static resources, build speed may be affected. By enabling caching mechanisms, build efficiency can be significantly improved.

### 1. Configure Build Cache Artifact Directory:

Astro projects need to specify a cache directory in the configuration file to reuse previous build artifacts in subsequent builds. Files in this directory will be used in subsequent builds to speed up build time.
This value can be an absolute path or a relative path.

```js
//`astro.config.mjs`
export default defineConfig({
  cacheDir: "./astro_cache",
});
```

---

### 2. Nixpacks Cache Configuration File

Create a `nixpacks.toml` file in the Astro project root directory and configure cache directories and build commands.

```toml
# Use specified Node.js and pnpm versions
[phases.setup]
nixPkgs = ["nodejs_22", "pnpm"]

# Install dependencies and enable pnpm cache
[phases.install]
cmds = ["pnpm install --frozen-lockfile"]
cacheDirectories = ["/root/.local/share/pnpm/store/v3"]

# Build Astro project and cache node_modules/.cache and astro_cache
[phases.build]
cmds = ["pnpm run build"]
cacheDirectories = [
  "node_modules/.cache",
  "astro_cache"
]

# Start command (you use NGINX to serve the dist static directory, this is just a placeholder)
[start]
cmd = "echo 'Build complete, please access dist directory via NGINX'"
```

---

## 3. Optimize Docker Build Context

Add `.dockerignore` to the Astro project root directory:

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

## IV. Deployment and Verification

After Dokploy automatic deployment, please check the build logs for the following content to confirm that caching is effective:

### 1. Build Command Used Mounted Cache

```bash
RUN --mount=type=cache,id=xxxx-node_modules/cache,target=/app/node_modules/.cache \
    --mount=type=cache,id=xxxx-astro_cache,target=/app/astro_cache \
    pnpm run build
```

### 2. Astro Build Reused Cache Entries (Especially Image Optimization)

```bash
▶ /_astro/202409272055577_Z2smeTW.avif (reused cache entry)
▶ /_astro/202409272055575_Z2wPyJN.avif (reused cache entry)
▶ /_astro/202409272055577_1IgP6g.avif (reused cache entry)
```

✅ If you see the above mount cache logs and "reused cache entry" text, it means the caching mechanism has been successfully enabled and the build has achieved incremental speedup.

🎉 From the Deployments tab of the Dokploy project, you can also see that without cache settings, building the project takes 31 minutes, while with cache settings enabled, it only takes 3 minutes, greatly shortening the build time and saving traffic and bandwidth.

## V. Accelerate Site with Tencent EdgeOne

## Background: The "Impossible Triangle" of Cross-Border Transmission

Deploying servers in Singapore. This solution is cost-effective and does not require cumbersome filing processes, but for users in mainland China, the access experience often faces huge challenges:

1. **High Physical Latency**: RTT (Round Trip Time) from Singapore to mainland China usually fluctuates between 50ms - 200ms.
2. **Severe Packet Loss**: Interfered by the GFW firewall, TCP handshakes often time out, causing images to get stuck loading halfway (Pending).
3. **Jump Lag**: Multi-page applications require long white screen waits when clicking links.

To solve this problem, we used **Tencent Cloud EdgeOne** in conjunction with **Traefik**'s refined configuration to create a "combo punch", achieving a second-opening experience close to domestic filed websites.

### Core Architecture Idea

Our optimization strategy revolves around three keywords: **Anti-Packet Loss**, **Offload Compression**, and **Layered Caching**.

1. **Protocol Layer (EdgeOne)**: Utilize the **HTTP/3 (QUIC)** protocol based on UDP characteristics to completely solve content loading interruptions caused by TCP cross-border packet loss.
2. **Transport Layer (Traefik -> EdgeOne)**: Turn off Traefik origin compression, and let EdgeOne edge nodes be responsible for more efficient **Brotli** intelligent compression to reduce transmission volume.
3. **Cache Layer (Strategy)**: Use `s-maxage` to achieve separation of "CDN Long-term Cache" and "Browser Short-term Cache", ensuring both CDN hit rate and content update timeliness.

### I. EdgeOne Global Configuration (Enable "Anti-Packet Loss" Mode)

Although EdgeOne cannot provide domestic nodes for unfiled domains, its edge nodes (Hong Kong/Singapore) to domestic lines are optimized and support the QUIC protocol, which is the key to solving "network lag".

Enter EdgeOne Console -> **Site Acceleration** -> **Feature Configuration**:

### 1. Enable HTTP/3 (QUIC) ✅

This is the most critical step. In cross-border networks with high packet loss rates, the QUIC protocol can effectively avoid TCP head-of-line blocking. After enabling, the phenomenon of images "spinning" or "loading halfway" will completely disappear.

### 2. Enable Intelligent Compression (Brotli + Gzip) ✅

It is recommended to enable both Brotli and Gzip. EdgeOne will prioritize returning **Brotli (`br`)** format to supported browsers, which has a compression rate 15%-20% higher than Gzip. The smaller the volume, the faster it passes through the wall.

### 3. Enable Cache Pre-refresh (90%) ✅

Set the pre-refresh ratio to **90%**. This means that in the last 10% of the time before the cache expires, the CDN will asynchronously go back to the source to update. Users will never encounter lag caused by "cache expiration leading to source return", achieving a 100% hit experience.

## II. Traefik Configuration Optimization (Origin Strategy)

We need to modify Traefik's `dynamic_conf.yml` (or Docker Labels) to do two things: **Offload Compression** and **Inject Refined Cache Headers**.

### 1. Disable Origin Compression

Please check your Routers configuration and **remove** all `compress` (Gzip) middlewares.

- **Reason**: EdgeOne is already responsible for Brotli compression. Doing Gzip at the origin again will waste CPU and may cause double compression issues.

### 2. Define Layered Cache Strategy (Core Code)

This is the core to solving the contradiction between "users can't see new content after publishing articles" and "direct source return speed is too slow".

We define a middleware specifically for HTML pages in Traefik:

```yaml
http:
  routers:
    # Force HTTPS redirect
    idimi-uygy0r-redirect-https:
      entryPoints:
        - web
      rule: Host(`zbz.ai`)
      middlewares:
        - idimi-uygy0r-to-https
      service: noop@internal
      priority: 1000

    # Service Worker (PWA Core) - No compression, handled by EdgeOne
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

    # Astro Core Static Resources (Hash Fingerprint) - No compression, handled by EdgeOne
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

    # Pagefind WASM Files - No compression, handled by EdgeOne
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

    # Pagefind Index Files - No compression, handled by EdgeOne
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

    # Sitemap / Robots / RSS - No compression, handled by EdgeOne
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

    # Manifest - No compression, handled by EdgeOne
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

    # Other Static Files (Images/Videos etc.) - No compression, handled by EdgeOne
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

    # HTML Pages (Fallback Rule) - No compression, handled by EdgeOne
    # Applied s-maxage=3600 separation strategy
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

    # --- Compression middleware definition retained but not called (removed from Routers) ---
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

    # Key Modification: HTML Cache Strategy
    # Browser caches for 5 minutes (300s), CDN caches for 1 hour (3600s)
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

**Configuration Explanation:**

- **`s-maxage=3600`**: This is a directive specifically for the CDN. EdgeOne sees this and caches the HTML page for 1 hour.
- **`max-age=300`**: When EdgeOne sends it to the user, it strips `s-maxage`, and the user's browser only sees 300 seconds (5 minutes).
- **Effect**: The CDN handles the traffic for 1 hour, while users only need to wait 5 minutes to see newly published articles.

## III. EdgeOne Rule Engine

Due to Astro's URL structure (no suffix) and dynamic image service (`/_image`), precise rules are needed to hit the cache.

In the EdgeOne **Rule Engine**, configure the following rules strictly **in order**:

### Rule 1: Astro Core Static Resources (Permanent Cache)

Astro's Assets, build artifacts, and dynamic image service, content that never changes or consumes extreme CPU, must be forcibly cached.

- **Match Condition**: `URL Path` -> `Regex Match`
- **Match Value**: `^/(_astro|assets|pagefind|_image)/`
- _Note: `_image` is added here, specifically optimizing dynamic optimized images generated by Astro's `<Image />` component._
- **Action**:
  - Node Cache: **365 days** (Force)
  - Browser Cache: **365 days**

### Rule 2: Regular Static Files

- **Match Condition**: `File Extension` equals `png, jpg, jpeg, webp, css, js`, etc.
- **Action**: Node Cache **30 days** (Force).

### Rule 3: Service Worker (PWA Core)

- **Match Condition**: `URL Path` equals `/sw.js` or `/service-worker.js`.
- **Action**: Node Cache **1 hour** (Force).
- _Warning: Do not cache for too long, otherwise PWA cannot be updated in time after release._

### Rule 4: Fallback Rule (HTML Pages)

- **Match Condition**: (No condition / Match all remaining requests)
- **Action**:
  - Node Cache: **Follow Origin** (i.e., read Traefik's `s-maxage=3600`).
  - Browser Cache: **Follow Origin** (i.e., read Traefik's `max-age=300`).

## IV. Astro Code Level Optimization (Perceived Acceleration)

To make page transitions as smooth as "native apps" and completely eliminate white screen waiting during jumps, we need to utilize Astro's **Client Router (formerly View Transitions)**.

### 1. Enable Client Router

Add in the `<head>` of `src/layouts/MainLayout.astro`:

```js
import { ClientRouter } from 'astro:transitions';

<head>
  <!-- Other meta tags -->
  <ClientRouter />
</head>
```

### 2. Enable Prefetch

Configure prefetch strategy in `astro.config.mjs`:

```js
export default defineConfig({
  // 'viewport': Download when link enters viewport (balance traffic and speed)
  // 'load': Download all links immediately after page loads (extreme speed, but consumes bandwidth)
  prefetch: {
    defaultStrategy: "viewport",
  },
  // ...
});
```
