---
title: "Dokploy と Nixpacks を使用して Astro プロジェクトをデプロイし、キャッシュを有効にしてビルド速度を最適化する"
description: "Dokploy と Nixpacks を使用して Astro 静的ウェブサイトを迅速にデプロイし、キャッシュメカニズムを完全に有効にしてビルド速度を大幅に向上させます。このチュートリアルでは、Astro の構成、Dokploy の環境変数設定、Nixpacks のキャッシュ最適化戦略について説明し、コンテンツ駆動型ウェブサイトの継続的インテグレーションとデプロイの実践に適しています。"
category: "startup"
tags:
  - "innovation"
pubDate: 2025-07-14
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20250714082742453.avif"
heroImageAlt: "ZBZ-Dokploy と Nixpacks を使用して Astro プロジェクトをデプロイし、キャッシュを有効にしてビルド速度を最適化する"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: ja
---

## I. Dokploy の構成

Dokploy は、Heroku、Vercel、Netlify の無料の代替手段として設計された、オープンソースでセルフホスト可能なデプロイメントプラットフォームであり、Docker と Traefik の上に構築されています。

### 1. 新しいプロジェクトの作成と GitHub リポジトリの接続

### 2. 環境変数の設定

```bash
NIXPACKS_NODE_VERSION=22
NIXPACKS_PNPM_STORE_PATH=/root/.local/share/pnpm/store/v3
NIXPACKS_INSTALL_CACHE_DIRS=/app/node_modules
NIXPACKS_BUILD_CACHE_DIRS=/app/node_modules/.cache,/app/astro_cache
```

### 3. キャッシュクリーニングの無効化

- プロジェクトサービス → **Clean Cache**: 無効
- Web サーバー → **Daily Docker Cleanup**: 無効

---

## II. Nixpacks ビルドエンジン

Nixpacks は、Railway によって立ち上げられたオープンソースのビルドツールで、ソースコードを標準の Docker イメージにビルドします。Dokploy はデフォルトのビルドエンジンとして Nixpacks を使用し、`nixpacks.toml` または `nixpacks.json` ファイルでのビルド構成の指定をサポートしています。プロジェクトのルートディレクトリに `nixpacks.toml` ファイルを作成し、関連するキャッシュディレクトリを構成します。

### 構成の優先順位（低 → 高）：

1. プロバイダーのデフォルトロジック
2. `nixpacks.toml`
3. 環境変数
4. CLI 引数

### 一般的な環境変数

| 変数名                        | 説明                                         |
| :---------------------------- | :------------------------------------------- |
| `NIXPACKS_INSTALL_CMD`        | カスタムインストールコマンド                 |
| `NIXPACKS_BUILD_CMD`          | カスタムビルドコマンド                       |
| `NIXPACKS_START_CMD`          | カスタム開始コマンド                         |
| `NIXPACKS_PKGS`               | 追加の Nix パッケージをインストール          |
| `NIXPACKS_APT_PKGS`           | 追加の Apt パッケージをインストール          |
| `NIXPACKS_INSTALL_CACHE_DIRS` | インストールフェーズのキャッシュディレクトリ |
| `NIXPACKS_BUILD_CACHE_DIRS`   | ビルドフェーズのキャッシュディレクトリ       |
| `NIXPACKS_NO_CACHE`           | キャッシュを無効化（非推奨）                 |
| `NIXPACKS_CONFIG_FILE`        | 構成ファイルを指定                           |
| `NIXPACKS_DEBIAN`             | Debian ベースイメージを有効化                |

## III. Astro プロジェクトの構成

Astro はコンテンツサイト向けの最新の Web フレームワークであり、ブログ、マーケティングページ、E コマースなどの静的ウェブサイトに特に適しています。ウェブサイトに大量の画像や静的リソースがある場合、ビルド速度に影響が出る可能性があります。キャッシュメカニズムを有効にすることで、ビルド効率を大幅に向上させることができます。

### 1. ビルドキャッシュアーティファクトディレクトリの構成：

Astro プロジェクトでは、後続のビルドで以前のビルドアーティファクトを再利用するために、構成ファイルでキャッシュディレクトリを指定する必要があります。このディレクトリ内のファイルは、ビルド時間を短縮するために後続のビルドで使用されます。
この値は絶対パスまたは相対パスにすることができます。

```js
//`astro.config.mjs`
export default defineConfig({
  cacheDir: "./astro_cache",
});
```

---

### 2. Nixpacks キャッシュ構成ファイル

Astro プロジェクトのルートディレクトリに `nixpacks.toml` ファイルを作成し、キャッシュディレクトリとビルドコマンドを構成します。

```toml
# 指定された Node.js と pnpm のバージョンを使用
[phases.setup]
nixPkgs = ["nodejs_22", "pnpm"]

# 依存関係をインストールし、pnpm キャッシュを有効化
[phases.install]
cmds = ["pnpm install --frozen-lockfile"]
cacheDirectories = ["/root/.local/share/pnpm/store/v3"]

# Astro プロジェクトをビルドし、node_modules/.cache と astro_cache をキャッシュ
[phases.build]
cmds = ["pnpm run build"]
cacheDirectories = [
  "node_modules/.cache",
  "astro_cache"
]

# 開始コマンド（dist 静的ディレクトリを提供するために NGINX を使用しています。これは単なるプレースホルダーです）
[start]
cmd = "echo 'ビルド完了、NGINX 経由で dist ディレクトリにアクセスしてください'"
```

---

## 3. Docker ビルドコンテキストの最適化

Astro プロジェクトのルートディレクトリに `.dockerignore` を追加します：

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

## IV. デプロイと検証

Dokploy の自動デプロイ後、ビルドログに以下の内容が含まれているか確認し、キャッシュが有効であることを確認してください：

### 1. ビルドコマンドがマウントされたキャッシュを使用した

```bash
RUN --mount=type=cache,id=xxxx-node_modules/cache,target=/app/node_modules/.cache \
    --mount=type=cache,id=xxxx-astro_cache,target=/app/astro_cache \
    pnpm run build
```

### 2. Astro ビルドがキャッシュエントリを再利用した（特に画像最適化）

```bash
▶ /_astro/202409272055577_Z2smeTW.avif (reused cache entry)
▶ /_astro/202409272055575_Z2wPyJN.avif (reused cache entry)
▶ /_astro/202409272055577_1IgP6g.avif (reused cache entry)
```

✅ 上記のマウントキャッシュログと「reused cache entry」というテキストが表示されれば、キャッシュメカニズムが正常に有効化され、ビルドが増分高速化を達成したことを意味します。

🎉 Dokploy プロジェクトの Deployments タブからも、キャッシュ設定なしではプロジェクトのビルドに 31 分かかるのに対し、キャッシュ設定を有効にするとわずか 3 分で済み、ビルド時間を大幅に短縮し、トラフィックと帯域幅を節約できることがわかります。

## V. Tencent EdgeOne でサイトを高速化

## 背景：国境を越えた伝送の「不可能な三角形」

シンガポールにサーバーをデプロイする。このソリューションは費用対効果が高く、面倒な登録プロセスも不要ですが、中国本土のユーザーにとっては、アクセス体験がしばしば大きな課題に直面します：

1. **高い物理的遅延**：シンガポールから中国本土への RTT（往復時間）は通常 50ms 〜 200ms の間で変動します。
2. **深刻なパケット損失**：GFW ファイアウォールの干渉により、TCP ハンドシェイクが頻繁にタイムアウトし、画像の読み込みが途中で止まる（Pending）原因となります。
3. **ジャンプラグ**：マルチページアプリケーションでは、リンクをクリックしたときに長い白い画面の待機時間が必要です。

この問題を解決するために、**Tencent Cloud EdgeOne** を **Traefik** の洗練された構成と組み合わせて使用し、「コンボパンチ」を作成し、ローカルに登録されたウェブサイトに近いほぼ瞬時のオープン体験を実現しました。

### コアアーキテクチャのアイデア

私たちの最適化戦略は、**パケット損失対策**、**圧縮オフロード**、**階層化キャッシュ**の 3 つのキーワードを中心に展開しています。

1. **プロトコル層 (EdgeOne)**：UDP 特性に基づく **HTTP/3 (QUIC)** プロトコルを利用して、TCP の国境を越えたパケット損失によるコンテンツ読み込みの中断を完全に解決します。
2. **トランスポート層 (Traefik -> EdgeOne)**：Traefik のオリジン圧縮をオフにし、EdgeOne エッジノードがより効率的な **Brotli** インテリジェント圧縮を担当して伝送量を削減します。
3. **キャッシュ層 (戦略)**：`s-maxage` を使用して「CDN 長期キャッシュ」と「ブラウザ短期キャッシュ」の分離を実現し、CDN ヒット率とコンテンツ更新の適時性の両方を確保します。

### I. EdgeOne グローバル構成（「パケット損失対策」モードを有効化）

EdgeOne は未登録ドメインに対して国内ノードを提供できませんが、エッジノード（香港/シンガポール）から国内回線への回線は最適化されており、QUIC プロトコルをサポートしています。これが「ネットワークラグ」を解決する鍵となります。

EdgeOne コンソール -> **サイト高速化** -> **機能構成** に入ります：

### 1. HTTP/3 (QUIC) を有効化 ✅

これは最も重要なステップです。パケット損失率の高い国境を越えたネットワークでは、QUIC プロトコルは TCP のヘッドオブラインブロッキングを効果的に回避できます。有効にすると、画像が「回転」したり「半分読み込まれたり」する現象は完全に消えます。

### 2. インテリジェント圧縮 (Brotli + Gzip) を有効化 ✅

Brotli と Gzip の両方を有効にすることをお勧めします。EdgeOne は、サポートされているブラウザに対して **Brotli (`br`)** 形式を優先的に返します。これは Gzip よりも 15% 〜 20% 高い圧縮率を持っています。ボリュームが小さいほど、壁を通過する速度が速くなります。

### 3. キャッシュの事前更新 (90%) を有効化 ✅

事前更新率を **90%** に設定します。これは、キャッシュの有効期限が切れる前の最後の 10% の時間帯に、CDN が非同期にソースに戻って更新することを意味します。ユーザーは「キャッシュの有効期限切れによるソースへの戻り」によって引き起こされるラグに遭遇することはなく、100% のヒット体験を実現します。

## II. Traefik 構成の最適化（オリジン戦略）

Traefik の `dynamic_conf.yml`（または Docker ラベル）を変更して、**圧縮のオフロード**と**洗練されたキャッシュヘッダーの注入**の 2 つを行う必要があります。

### 1. オリジン圧縮の無効化

ルーターの構成を確認し、すべての `compress` (Gzip) ミドルウェアを**削除**してください。

- **理由**：EdgeOne はすでに Brotli 圧縮を担当しています。オリジンで再度 Gzip を行うと CPU を浪費し、二重圧縮の問題を引き起こす可能性があります。

### 2. 階層化キャッシュ戦略の定義（コアコード）

これは、「記事を公開した後、ユーザーが新しいコンテンツを見ることができない」と「直接ソースに戻る速度が遅すぎる」という矛盾を解決するための核心です。

Traefik で HTML ページ専用のミドルウェアを定義します：

```yaml
http:
  routers:
    # HTTPS リダイレクトを強制
    idimi-uygy0r-redirect-https:
      entryPoints:
        - web
      rule: Host(`realrip.com`)
      middlewares:
        - idimi-uygy0r-to-https
      service: noop@internal
      priority: 1000

    # Service Worker (PWA コア) - 圧縮なし、EdgeOne が処理
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

    # Astro コア静的リソース (Hash 指紋) - 圧縮なし、EdgeOne が処理
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

    # Pagefind WASM ファイル - 圧縮なし、EdgeOne が処理
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

    # Pagefind インデックスファイル - 圧縮なし、EdgeOne が処理
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

    # Sitemap / Robots / RSS - 圧縮なし、EdgeOne が処理
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

    # Manifest - 圧縮なし、EdgeOne が処理
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

    # その他の静的ファイル (画像/動画など) - 圧縮なし、EdgeOne が処理
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

    # HTML ページ (フォールバックルール) - 圧縮なし、EdgeOne が処理
    # s-maxage=3600 分離戦略を適用
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

    # --- 圧縮ミドルウェア定義は保持されますが、呼び出されません (ルーターから削除されました) ---
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

    # 主要な変更：HTML キャッシュ戦略
    # ブラウザは 5 分間 (300秒) キャッシュし、CDN は 1 時間 (3600秒) キャッシュします
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

**構成の説明：**

- **`s-maxage=3600`**：これは CDN 向けに特別に書かれたディレクティブです。EdgeOne はこれを見て、HTML ページを 1 時間キャッシュします。
- **`max-age=300`**：EdgeOne がユーザーに送信するとき、`s-maxage` を削除し、ユーザーのブラウザには 300 秒（5 分）しか表示されません。
- **効果**：CDN が 1 時間トラフィックを処理し、ユーザーは新しく公開された記事を見るために 5 分待つだけで済みます。

## III. EdgeOne ルールエンジン

Astro の URL 構造（サフィックスなし）と動的画像サービス（`/_image`）のため、キャッシュにヒットさせるには正確なルールが必要です。

EdgeOne **ルールエンジン**で、以下のルールを厳密に**順番に**構成します：

### ルール 1：Astro コア静的リソース（永続キャッシュ）

Astro のアセット、ビルドアーティファクト、動的画像サービス、決して変更されないコンテンツ、または CPU を極端に消費するコンテンツは、強制的にキャッシュする必要があります。

- **一致条件**：`URL パス` -> `正規表現一致`
- **一致値**：`^/(_astro|assets|pagefind|_image)/`
- _注：ここでは `_image` が追加されており、特に Astro の `<Image />` コンポーネントによって生成された動的最適化画像を最適化しています。_
- **アクション**：
  - ノードキャッシュ：**365日**（強制）
  - ブラウザキャッシュ：**365日**

### ルール 2：通常の静的ファイル

- **一致条件**：`ファイル拡張子` が `png, jpg, jpeg, webp, css, js` などと等しい。
- **アクション**：ノードキャッシュ **30日**（強制）。

### ルール 3：Service Worker (PWA コア)

- **一致条件**：`URL パス` が `/sw.js` または `/service-worker.js` と等しい。
- **アクション**：ノードキャッシュ **1時間**（強制）。
- _警告：キャッシュを長くしすぎないでください。そうしないと、リリース後に PWA を時間内に更新できません。_

### ルール 4：フォールバックルール（HTML ページ）

- **一致条件**：（条件なし / 残りのすべてのリクエストに一致）
- **アクション**：
  - ノードキャッシュ：**オリジンに従う**（つまり、Traefik の `s-maxage=3600` を読み取る）。
  - ブラウザキャッシュ：**オリジンに従う**（つまり、Traefik の `max-age=300` を読み取る）。

## IV. Astro コードレベルの最適化（体感速度の向上）

ページ遷移を「ネイティブアプリ」のようにスムーズにし、ジャンプ中の白い画面の待機時間を完全になくすには、Astro の **Client Router（旧 View Transitions）** を利用する必要があります。

### 1. Client Router を有効化

`src/layouts/MainLayout.astro` の `<head>` に追加します：

```js
import { ClientRouter } from 'astro:transitions';

<head>
  <!-- その他の meta タグ -->
  <ClientRouter />
</head>
```

### 2. プリフェッチ (Prefetch) を有効化

`astro.config.mjs` でプリフェッチ戦略を構成します：

```js
export default defineConfig({
  // 'viewport'：リンクがビューポートに入ったときにダウンロード（トラフィックと速度のバランス）
  // 'load'：ページ読み込み直後にすべてのリンクをダウンロード（極限の速度だが、帯域幅を消費）
  prefetch: {
    defaultStrategy: "viewport",
  },
  // ...
});
```
