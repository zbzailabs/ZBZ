---
title: "使用 Dokploy 和 Nixpacks 部署 Astro 项目并启用缓存优化构建速度"
description: "使用 Dokploy 与 Nixpacks 快速部署 Astro 静态网站，全面启用缓存机制，大幅提升构建速度。教程涵盖 Astro 配置、Dokploy环境变量设置、Nixpacks 缓存优化策略，适用于内容驱动型网站的持续集成部署实践。"
category: "startup"
tags:
  - "innovation"
pubDate: 2025-07-14
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20250714082742453.avif"
heroImageAlt: "RealRip-使用 Dokploy 和 Nixpacks 部署 Astro 项目并启用缓存优化构建速度"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: zh
---

## 一、Dokploy 配置

Dokploy 是一个开源、可自托管的部署平台，作为 Heroku、Vercel 和 Netlify 的免费替代方案而设计，构建于 Docker 和 Traefik 之上。

### 1. 创建新项目并连接 GitHub 仓库

### 2. 设置环境变量

```bash
NIXPACKS_NODE_VERSION=22
NIXPACKS_PNPM_STORE_PATH=/root/.local/share/pnpm/store/v3
NIXPACKS_INSTALL_CACHE_DIRS=/app/node_modules
NIXPACKS_BUILD_CACHE_DIRS=/app/node_modules/.cache,/app/astro_cache
```

### 3. 关闭缓存清理

- 项目服务 → **Clean Cache**：关闭
- Web Server → **Daily Docker Cleanup**：关闭

---

## 二、Nixpacks 构建引擎

Nixpacks 是由 Railway 推出的开源构建工具，可将源代码构建为标准 Docker 镜像。Dokploy 使用 Nixpacks 作为默认构建引擎， 支持在nixpacks.toml或nixpacks.json文件中指定构建配置。在项目根目录创建 `nixpacks.toml` 文件，并配置相关的缓存目录。

### 配置优先级（低 → 高）：

1. Provider 默认逻辑
2. `nixpacks.toml`
3. 环境变量
4. CLI 参数

### 常用环境变量

| 变量名                        | 说明                 |
| ----------------------------- | -------------------- |
| `NIXPACKS_INSTALL_CMD`        | 自定义安装命令       |
| `NIXPACKS_BUILD_CMD`          | 自定义构建命令       |
| `NIXPACKS_START_CMD`          | 自定义启动命令       |
| `NIXPACKS_PKGS`               | 安装额外 Nix 包      |
| `NIXPACKS_APT_PKGS`           | 安装额外 Apt 包      |
| `NIXPACKS_INSTALL_CACHE_DIRS` | 安装阶段缓存目录     |
| `NIXPACKS_BUILD_CACHE_DIRS`   | 构建阶段缓存目录     |
| `NIXPACKS_NO_CACHE`           | 禁用缓存（不推荐）   |
| `NIXPACKS_CONFIG_FILE`        | 指定配置文件         |
| `NIXPACKS_DEBIAN`             | 启用 Debian 基础镜像 |

## 三、Astro 项目配置

Astro 是一个面向内容网站的现代 Web 框架，特别适用于博客、营销页与电商等静态网站。当网站有大量图片和静态资源时，构建速度可能会受到影响。通过启用缓存机制，可以显著提升构建效率。

### 1. 配置构建缓存产物的目录：

Astro 项目需要在配置文件中指定缓存目录，以便在后续构建中复用先前的构建产物。该目录中的文件将在后续构建中使用，以加快构建时间。
这个值可以是绝对路径，也可以是相对路径。

```js
//`astro.config.mjs`
export default defineConfig({
  cacheDir: "./astro_cache",
});
```

---

### 2. Nixpacks 缓存配置文件

在Astro项目根目录创建 `nixpacks.toml` 文件，并配置缓存目录和构建命令。

```toml
# 使用指定 Node.js 与 pnpm 版本
[phases.setup]
nixPkgs = ["nodejs_22", "pnpm"]

# 安装依赖，并启用 pnpm 缓存
[phases.install]
cmds = ["pnpm install --frozen-lockfile"]
cacheDirectories = ["/root/.local/share/pnpm/store/v3"]

# 构建 Astro 项目，并缓存 node_modules/.cache 与 astro_cache
[phases.build]
cmds = ["pnpm run build"]
cacheDirectories = [
  "node_modules/.cache",
  "astro_cache"
]

# 启动命令（你使用 NGINX 提供 dist 静态目录，此处仅作占位）
[start]
cmd = "echo '构建完成，请通过 NGINX 访问 dist 目录"
```

---

## 3. 优化 Docker 构建上下文

Astro 项目根目录添加 `.dockerignore`：

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

## 四、部署与验证

在 Dokploy 自动部署后，请重点检查构建日志中是否包含以下内容，以确认缓存生效：

### 1. 构建命令使用了挂载缓存

```bash
RUN --mount=type=cache,id=xxxx-node_modules/cache,target=/app/node_modules/.cache \
    --mount=type=cache,id=xxxx-astro_cache,target=/app/astro_cache \
    pnpm run build
```

### 2. Astro 构建中复用了缓存条目（特别是图片优化）

```bash
▶ /_astro/202409272055577_Z2smeTW.avif (reused cache entry)
▶ /_astro/202409272055575_Z2wPyJN.avif (reused cache entry)
▶ /_astro/202409272055577_1IgP6g.avif (reused cache entry)
```

✅ 若你看到上述 mount 缓存日志与 reused cache entry 字样，说明缓存机制已成功启用，构建已实现增量提速。

🎉 从Dokploy项目的 Deployments 选项卡中也可以看到，没启用缓存设置时，构建项目需要31分钟，启用缓存设置后，只需要3分重，大大缩短了构建时间，节约了流量和带宽。

## 五、使用腾讯Edgeone为站点加速

## 背景：跨国传输的“不可能三角”

将服务器部署在新加坡。这种方案性价比高且无需繁琐的备案流程，但对于中国大陆用户来说，访问体验往往面临着巨大的挑战：

1. **物理延迟高** ：新加坡到中国大陆的 RTT (往返时延) 通常在 50ms - 200ms 波动。
2. **严重丢包** ：受 GFW 防火墙干扰，TCP 握手经常超时，导致图片加载一半卡住（Pending）。
3. **跳转卡顿** ：多页应用在点击链接时需要漫长的白屏等待。

为了解决这个问题，利用 **腾讯云 EdgeOne** 配合 **Traefik** 的精细化配置，打出了一套“组合拳”，实现了近乎国内备案网站的秒开体验。

### 核心架构思路

我们的优化策略围绕三个关键词： **抗丢包** 、 **卸载压缩** 、 **分层缓存** 。

1. **协议层 (EdgeOne)** ：利用 **HTTP/3 (QUIC)** 协议基于 UDP 的特性，彻底解决 TCP 跨境丢包导致的内容加载中断。
2. **传输层 (Traefik -> EdgeOne)** ：关闭 Traefik 源站压缩，由 EdgeOne 边缘节点负责更高效的 **Brotli** 智能压缩，减小传输体积。
3. **缓存层 (Strategy)** ：利用 `s-maxage` 实现“CDN 长效缓存”与“浏览器短效缓存”的分离，既保证 CDN 命中率，又保证内容更新的及时性。

### 一、EdgeOne 全局配置 (开启“抗丢包”模式)

EdgeOne 虽然无法为未备案域名提供国内节点，但其边缘节点（香港/新加坡）到国内的线路经过优化，且支持 QUIC 协议，这是解决“网络卡顿”的关键。

进入 EdgeOne 控制台 -> **站点加速** -> **功能配置** ：

### 1. 开启 HTTP/3 (QUIC) ✅

这是最关键的一步。在丢包率高的跨境网络中，QUIC 协议能有效避免 TCP 的队头阻塞。开启后，图片加载“转圈圈”或“加载一半”的现象将彻底消失。

### 2. 开启智能压缩 (Brotli + Gzip) ✅

建议同时开启 Brotli 和 Gzip。EdgeOne 会优先向支持的浏览器返回 **Brotli (`br`)** 格式，其压缩率比 Gzip 高 15%-20%，体积越小，穿墙越快。

### 3. 开启缓存预刷新 (90%) ✅

将预刷新比例设置为 **90%** 。这意味着在缓存即将过期的最后 10% 时间段内，CDN 会异步回源更新。用户永远不会遇到“缓存过期导致回源”造成的卡顿，实现 100% 的命中体验。

## 二、Traefik 配置优化 (源站策略)

我们需要修改 Traefik 的 `dynamic_conf.yml`（或 Docker Labels），做两件事：**卸载压缩** 和 **注入精细化缓存头** 。

### 1. 关闭源站压缩

请检查你的 Routers 配置，**移除** 所有 `compress` (Gzip) 中间件。

- **原因** ：EdgeOne 已经负责 Brotli 压缩了，源站再做 Gzip 会浪费 CPU，且可能导致双重压缩问题。

### 2. 定义分层缓存策略 (核心代码)

这是解决“发布文章后用户看不到新内容”与“直接回源速度太慢”这对矛盾的核心。

我们在 Traefik 中定义一个专门针对 HTML 页面的中间件：

```

http:
  routers:
    # 强制跳转 HTTPS
    idimi-uygy0r-redirect-https:
      entryPoints:
        - web
      rule: Host(`realrip.com`)
      middlewares:
        - idimi-uygy0r-to-https
      service: noop@internal
      priority: 1000

    # Service Worker (PWA核心) - 不压缩，由EdgeOne处理
    idimi-uygy0r-sw:
      rule: >
        Host(`realrip.com`) &&
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

    # Astro 核心静态资源 (Hash指纹) - 不压缩，由EdgeOne处理
    idimi-uygy0r-static-immutable:
      rule: >
        Host(`realrip.com`) &&
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

    # Pagefind WASM 文件 - 不压缩，由EdgeOne处理
    idimi-uygy0r-pagefind-wasm-ctype:
      rule: >
        Host(`realrip.com`) &&
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

    # Pagefind 索引文件 - 不压缩，由EdgeOne处理
    idimi-uygy0r-pagefind-immutable:
      rule: >
        Host(`realrip.com`) &&
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

    # Sitemap / Robots / RSS - 不压缩，由EdgeOne处理
    idimi-uygy0r-meta-short:
      rule: >
        Host(`realrip.com`) &&
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

    # Manifest - 不压缩，由EdgeOne处理
    idimi-uygy0r-manifest:
      rule: >
        Host(`realrip.com`) &&
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

    # 其他静态文件 (图片/视频等) - 不压缩，由EdgeOne处理
    idimi-uygy0r-public-30d:
      rule: >
        Host(`realrip.com`) &&
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

    # HTML 页面 (兜底规则) - 不压缩，由EdgeOne处理
    # 应用了 s-maxage=3600 分离策略
    idimi-uygy0r-pages:
      rule: Host(`realrip.com`)
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

    # --- 压缩中间件定义保留，但未被调用 (已从 Routers 中移除) ---
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

    # 关键修改：HTML 缓存策略
    # 浏览器存 5 分钟 (300s)，CDN 存 1 小时 (3600s)
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

**配置说明：**

- **`s-maxage=3600`** ：这是一条专门写给 CDN 看的指令。EdgeOne 看到后会缓存 HTML 页面 1 小时。
- **`max-age=300`** ：EdgeOne 发送给用户时，会剥离掉 `s-maxage`，用户浏览器只看到 300秒（5分钟）。
- **效果** ：CDN 替你扛住 1 小时的流量，而用户只需要等 5 分钟就能看到新发布的文章。

## 三、EdgeOne 规则引擎

由于 Astro 的 URL 结构（无后缀）和动态图片服务（`/_image`），需要精准的规则来命中缓存。

在 EdgeOne **规则引擎**中，严格**按顺序**配置以下规则：

### 规则 1：Astro 核心静态资源 (永久缓存)

Astro 的 Assets、构建产物以及动态图片服务，内容永远不变或极其消耗 CPU，必须强制缓存。

- **匹配条件** ：`URL Path` -> `正则匹配`
- **匹配值** ：`^/(_astro|assets|pagefind|_image)/`
- _注意：这里加入了 `_image`，专门优化 Astro 的 `<Image />` 组件生成的动态优化图片。_
- **动作** ：
- 节点缓存：**365天** (强制)
- 浏览器缓存：**365天**

### 规则 2：常规静态文件

- **匹配条件** ：`文件后缀` 等于 `png, jpg, jpeg, webp, css, js` 等。
- **动作** ：节点缓存 **30天** (强制)。

### 规则 3：Service Worker (PWA 核心)

- **匹配条件** ：`URL Path` 等于 `/sw.js` 或 `/service-worker.js`。
- **动作** ：节点缓存 **1小时** (强制)。
- _警告：切勿缓存太久，否则发版后用户的 PWA 无法及时更新。_

### 规则 4：兜底规则 (HTML 页面)

- **匹配条件** ：(无需条件 / 匹配所有剩余请求)
- **动作** ：
- 节点缓存：**遵循源站** (即读取 Traefik 的 `s-maxage=3600`)。
- 浏览器缓存：**遵循源站** (即读取 Traefik 的 `max-age=300`)。

## 四、Astro 代码层面优化 (体感加速)

为了让页面跳转如“原生应用”般丝滑，彻底消除跳转时的白屏等待，我们需要利用 Astro 的 **Client Router (原 View Transitions)** 。

### 1. 启用 Client Router

在 `src/layouts/MainLayout.astro` 的 `<head>` 中加入：

```
import { ClientRouter } from 'astro:transitions';

<head>
  <!-- 其他 meta 标签 -->
  <ClientRouter />
</head>

```

### 2. 启用预加载 (Prefetch)

在 `astro.config.mjs` 中配置预加载策略：

```
export default defineConfig({
  // 'viewport': 链接进入视口即下载 (平衡流量与速度)
  // 'load': 页面加载完即下载所有链接 (极致速度，但消耗带宽)
  prefetch: {
    defaultStrategy: 'viewport',
  },
  // ...
});

```
