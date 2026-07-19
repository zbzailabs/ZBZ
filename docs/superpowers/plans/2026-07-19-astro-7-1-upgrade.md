# Astro 7.1 and Stable Dependencies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade ZBZ to Astro 7.1 and the latest stable compatible dependencies while adopting applicable stable Astro 7.1 capabilities and retaining TypeScript 6.

**Architecture:** Keep the site static-first and make focused changes to dependency manifests, Astro configuration, content loaders, and development commands. Astro generates CSP metadata at build time, content entries render on demand during static generation, and pagination keeps locale-prefixed directory URLs.

**Tech Stack:** Astro 7.1, TypeScript 6.0, pnpm, Tailwind CSS 4, MDX, Pagefind, Partytown, Hono, x402, Cloudflare Wrangler

## Global Constraints

- Use pnpm exclusively and update only `pnpm-lock.yaml`.
- Select latest stable releases from the public npm registry.
- Keep TypeScript on latest 6.0.x; do not install TypeScript 7 side by side.
- Do not enable `experimental.collectionStorage`.
- Preserve static output, trailing slashes, locale prefixes, default locale `zh`, RTL support, and the root redirect.
- Keep GTM, AdSense, x402, and Cloudflare runtime support optional and disabled by default.
- Preserve ordinary static hosting, SEO, Pagefind, RSS, sitemap, robots, llms files, and localized content.
- Do not change visual tokens or generated theme files.
- The repository has a Chinese `README.md` and no `readme-zh.md`; update the existing README without creating a duplicate.

---

### Task 1: Upgrade dependency manifests

**Files:**

- Modify: `package.json:28-60`
- Modify: `pnpm-lock.yaml`
- Verify: `astro.config.mjs`
- Verify: `src/x402/cloudflare-worker.ts`

**Interfaces:**

- Consumes: Existing pnpm graph and npm stable distribution tags.
- Produces: Astro 7.1.x, current stable direct packages, and TypeScript 6.0.x.

- [ ] **Step 1: Record the failing version audit**

Run `pnpm outdated --format json`.

Expected: exit `1`; JSON includes Astro 7.0.3 to 7.1.1 and the other outdated direct packages.

- [ ] **Step 2: Upgrade production dependencies**

    pnpm update --latest \
      @astrojs/markdown-satteri @astrojs/mdx @astrojs/partytown \
      @astrojs/rss @astrojs/sitemap @iconify-json/lucide \
      @solana/kit @solana/sysvars @tailwindcss/vite \
      @x402/core @x402/hono @x402/svm astro astro-icon astro-seo \
      hono pagefind sirv tailwindcss

Expected: manifests resolve latest stable releases, including Astro 7.1.1.

- [ ] **Step 3: Upgrade development dependencies and restore TypeScript 6**

    pnpm update --latest -D @astrojs/check @tailwindcss/typography sharp wrangler
    pnpm add -D typescript@~6.0.3

Expected: latest stable tools with `"typescript": "~6.0.3"`.

- [ ] **Step 4: Verify graph and compatibility**

    pnpm install --frozen-lockfile
    pnpm list --depth 0
    pnpm exec astro check

Expected: all exit `0`, no peer errors, zero Astro Check errors, and current x402 import paths remain valid.

- [ ] **Step 5: Commit**

    git add package.json pnpm-lock.yaml
    git commit -m "build: upgrade stable dependencies"

---

### Task 2: Adopt stable content and development features

**Files:**

- Modify: `src/content.config.ts:34-101`
- Modify: `package.json:18-27`
- Modify: `AGENTS.md:34-44`
- Modify: `README.md:50-62`

**Interfaces:**

- Consumes: Astro 7.1 `glob({ deferRender: true })` and `astro dev --ignore-lock`.
- Produces: Three deferred loaders and `pnpm dev:parallel`.

- [ ] **Step 1: Run the failing feature assertion**

    node --input-type=module -e '
      import fs from "node:fs";
      const config = fs.readFileSync("src/content.config.ts", "utf8");
      const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
      const count = (config.match(/deferRender:\s*true/g) ?? []).length;
      if (count !== 3) throw new Error("expected 3 deferred loaders");
      if (pkg.scripts["dev:parallel"] !== "astro dev --ignore-lock") {
        throw new Error("dev:parallel is not configured");
      }
    '

Expected: nonzero exit with `expected 3 deferred loaders`.

- [ ] **Step 2: Configure all collection loaders**

Add this option to each existing `glob()` object, keeping its pattern, base, and `generateId`:

    deferRender: true,

The final post loader shape is:

    loader: glob({
      pattern: "**/*.{md,mdx,markdown}",
      base: "./src/content/posts",
      generateId,
      deferRender: true,
    }),

Repeat with existing pages and authors base paths.

- [ ] **Step 3: Add and document the development command**

Add to `package.json`:

    "dev:parallel": "astro dev --ignore-lock"

Add to `AGENTS.md`:

    - Start an unmanaged temporary second dev server: `pnpm dev:parallel`

Add to the README command block:

    pnpm dev:parallel   # 启动不受 status/logs/stop 管理的临时第二开发服务

- [ ] **Step 4: Re-run assertion and static build**

Run the exact Node assertion from Step 1, then `pnpm build`.

Expected: assertion exit `0`; Astro Check has zero errors and static generation completes.

- [ ] **Step 5: Commit**

    git add src/content.config.ts package.json AGENTS.md README.md
    git commit -m "feat: adopt stable Astro 7.1 features"

---

### Task 3: Enable Astro 7.1 scoped CSP

**Files:**

- Modify: `astro.config.mjs:26-48`
- Verify: `src/layouts/main.astro`
- Verify: `src/components/widgets/Adsense.astro`
- Verify: `src/components/widgets/GTMHead.astro`
- Verify: `src/components/widgets/GTMBody.astro`
- Verify: `src/components/widgets/X402.astro`
- Test: generated `dist/zh/index.html`

**Interfaces:**

- Consumes: Astro 7.1 `security.csp.scriptDirective` and `styleDirective`.
- Produces: CSP meta tags with element and attribute policies preserving inline behavior and optional integrations.

- [ ] **Step 1: Run the failing output check**

    pnpm build
    rg -n 'http-equiv="content-security-policy"' dist/zh/index.html

Expected: build exit `0`; `rg` exit `1`.

- [ ] **Step 2: Add CSP after `compressHTML`**

    security: {
      csp: {
        algorithm: "SHA-256",
        directives: [
          "default-src 'self'",
          "base-uri 'self'",
          "object-src 'none'",
          "frame-src 'self' https://www.googletagmanager.com https://googleads.g.doubleclick.net",
          "img-src 'self' data: https:",
          "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googlesyndication.com",
        ],
        scriptDirective: {
          resources: [
            { resource: "'self'", kind: "element" },
            { resource: "https://www.googletagmanager.com", kind: "element" },
            { resource: "https://pagead2.googlesyndication.com", kind: "element" },
          ],
          strictDynamic: false,
        },
        styleDirective: {
          resources: [
            { resource: "'self'", kind: "element" },
            { resource: "'unsafe-inline'", kind: "attribute" },
          ],
        },
      },
    },

Astro supplies hashes for generated inline elements. Do not allow unsafe inline script elements or style elements.

- [ ] **Step 3: Build and inspect default output**

    pnpm build
    rg -n 'content-security-policy|script-src-elem|style-src-elem|style-src-attr' dist/zh/index.html

Expected: one CSP meta tag with SHA-256 hashes and all three scoped directive families.

- [ ] **Step 4: Build with optional widgets**

    PUBLIC_GTM_ENABLED=true \
    PUBLIC_GTM_ID=GTM-TEST123 \
    PUBLIC_ADSENSE_ENABLED=true \
    PUBLIC_ADSENSE_CLIENT_ID=ca-pub-0000000000000000 \
    PUBLIC_ADSENSE_REVIEW_MODE=false \
    PUBLIC_X402_ENABLED=true \
    PUBLIC_X402_PAY_TO=11111111111111111111111111111111 \
    PUBLIC_X402_NETWORK=solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1 \
    PUBLIC_X402_PRICE='$0.08' \
    pnpm build

Expected: exit `0` without real credentials.

- [ ] **Step 5: Inspect optional content**

    rg -n 'googletagmanager|googlesyndication|application/ld\+json|x402|content-security-policy' dist/zh/index.html

Expected: GTM, AdSense, JSON-LD, x402 metadata, Google CSP sources, and generated hashes are present.

- [ ] **Step 6: Commit**

    git add astro.config.mjs
    git commit -m "feat: enable scoped content security policy"

---

### Task 4: End-to-end verification and issue record

**Files:**

- Verify: `package.json`
- Verify: `pnpm-lock.yaml`
- Verify: generated `dist/`
- Update externally: GitHub issue `#3`

**Interfaces:**

- Consumes: All upgraded packages and adopted Astro features.
- Produces: Fresh verification evidence and a completed issue record.

- [ ] **Step 1: Run full checks**

    pnpm install --frozen-lockfile
    pnpm build
    git diff --check

Expected: all exit `0`, with zero Astro Check errors.

- [ ] **Step 2: Assert generated static surfaces**

    test -f dist/zh/index.html
    test -f dist/en/index.html
    test -f dist/zh/rss.xml
    test -f dist/sitemap-index.xml
    test -f dist/robots.txt
    test -f dist/llms.txt
    test -d dist/pagefind
    test -f dist/zh/posts/index.html

Expected: every assertion exits `0`.

- [ ] **Step 3: Check pagination and versions**

    rg -n 'href="/zh/(posts/)?[2-9]/"' dist/zh -g '*.html'
    pnpm outdated --format json
    pnpm view typescript@latest version

Expected: directory pagination links keep trailing slashes; TypeScript is the sole intentional exception and registry latest is 7.0.2.

- [ ] **Step 4: Smoke-test the unmanaged server**

    pnpm dev:parallel --port 4333 >/tmp/zbz-astro-parallel.log 2>&1 &
    zbz_parallel_pid=$!
    for attempt in 1 2 3 4 5 6 7 8 9 10; do
      curl --fail --silent http://127.0.0.1:4333/zh/ >/dev/null && break
      sleep 0.5
    done
    curl --fail --silent http://127.0.0.1:4333/zh/ >/dev/null
    kill "$zbz_parallel_pid"
    wait "$zbz_parallel_pid" 2>/dev/null || true

Expected: final `curl` exits `0`; only the captured temporary PID is stopped.

- [ ] **Step 5: Review commits**

Run `git status --short` and `git log -5 --oneline`.

Expected: clean implementation state and focused commits for dependencies, features, and CSP.

- [ ] **Step 6: Record verification and close issue #3**

    gh issue close 3 --comment "Upgraded Astro and stable dependencies, retained TypeScript 6.0.3 for Astro tooling compatibility, enabled deferred collection rendering and scoped CSP, and added the unmanaged parallel development command. Verified with pnpm install --frozen-lockfile, pnpm build, optional-integration build checks, generated-output assertions, and a dev:parallel startup smoke test."

Expected: issue #3 closes with verification evidence.
