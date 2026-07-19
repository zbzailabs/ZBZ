# Astro 7.1 and stable dependency upgrade

GitHub issue: [#3](https://github.com/zbzailabs/ZBZ/issues/3)

## Goal

Upgrade ZBZ from Astro 7.0 to the latest Astro 7.1 patch release, upgrade the
remaining packages to their latest compatible stable releases, and adopt the
Astro 7.1 stable capabilities that improve this static multilingual site.

The result must preserve static output, locale-prefixed routes, trailing
slashes, RTL pages, optional integrations, and deployment to ordinary static
hosting without private services.

## Version policy

- Resolve package versions from the public npm registry at implementation
  time and select stable releases only.
- Upgrade direct dependencies and development dependencies, including major
  releases, then adapt project code when a documented breaking change affects
  ZBZ.
- Keep TypeScript on the latest 6.0.x release. TypeScript 7.0 does not expose
  the stable programmatic API required by Astro, MDX, and embedded-language
  tooling. Do not add a side-by-side TypeScript 7 installation.
- Keep pnpm as the only Node.js package manager and update only
  `pnpm-lock.yaml`.
- Do not add prerelease packages or enable Astro's experimental
  `collectionStorage` feature.

## Astro 7.1 feature adoption

### Content rendering

Set `deferRender: true` on the Markdown and MDX glob loaders for posts, pages,
and authors. Collection synchronization will retain source entries without
caching all rendered HTML in memory. Rendering will occur when a generated
page requests an entry. The site already renders collection entries during a
static build, so public output remains unchanged.

### Development servers

Add a dedicated script for `astro dev --ignore-lock`. The existing managed
background commands remain unchanged. Documentation will explain that the new
command starts an unmanaged temporary server that is not visible to
`astro dev status`, `astro dev logs`, or `astro dev stop`.

### Content Security Policy

Enable Astro's stable CSP support for static HTML using generated meta tags.
Use Astro 7.1's specific directive entries so inline style attributes are
permitted through `style-src-attr` without granting the same permission to
style elements or external stylesheets. Keep Astro-generated hashes for inline
script and style elements.

Allow only the external script, frame, image, and connection origins required
by the existing optional GTM and AdSense integrations. Validate builds with
these integrations disabled and enabled with syntactically valid placeholder
IDs. JSON-LD, x402 metadata, theme switching, navigation, search, comments,
and author activity scripts must remain present and permitted.

If an optional third-party integration cannot operate under a meta-delivered
CSP because it requires a response-header-only directive, document that fact
and keep the integration disabled by default. Ordinary static hosting must
still work.

### Pagination URL formatting

Do not add a `format` callback to `paginate()`. ZBZ generates directory-style
pages with `trailingSlash: "always"`; the current pagination URLs already match
the generated files. The new callback is intended for deployments whose URL
shape differs from their output files.

### Logger API

Do not create a custom logger entrypoint. Astro 7.1's logger improvement is an
API for projects that already need custom log routing; ZBZ has no such
requirement. Default Astro logging and existing JSON logging commands remain.

## Compatibility work

Review release notes for every direct major-version upgrade. Give particular
attention to the Solana packages, Sharp, x402 packages, Tailwind CSS, Wrangler,
and Astro integrations. Make the smallest source changes required by their
stable APIs and do not add services, credentials, analytics IDs, ad IDs,
payment credentials, or wallet addresses.

Update `AGENTS.md`, `README.md`, and `readme-zh.md` when command usage,
configuration, or deployment behavior changes. Do not edit visual tokens or
generated design theme files because this upgrade does not change appearance.

## Failure handling

- If a latest stable dependency has an incompatible peer requirement, record
  the exact package and constraint in issue #3, then choose the newest release
  that satisfies the installed stable toolchain.
- If a major upgrade changes behavior, update the affected code and verify its
  generated output before considering a downgrade.
- TypeScript 7 is the planned toolchain exception. If the x402 Solana program
  packages require Solana Kit 5.x, retain the newest compatible 5.x releases
  and record the peer constraints in issue #3.
- Do not weaken SEO parsing, static generation, locale routing, CSP protection,
  or optional-feature defaults to make a check pass.

## Acceptance checks

- `package.json` and `pnpm-lock.yaml` contain the selected stable versions,
  with TypeScript on 6.0.x.
- Astro is on the latest 7.1 patch release.
- All three content collection loaders use deferred rendering.
- The temporary parallel development command is available and documented.
- CSP metadata uses specific Astro 7.1 script/style directive support and does
  not break the generated site's inline behavior.
- Pagination remains directory-based with locale prefixes and trailing slashes.
- Experimental collection storage remains disabled.
- Static hosting remains usable without runtime services or private values.
- Generated RSS, sitemap, robots, llms, Pagefind, SEO, and localized pages are
  still produced.

## Verification

Run fresh checks after installation:

1. `pnpm install`
2. `pnpm build`
3. A build with valid placeholder values for the optional GTM and AdSense
   environment settings
4. Registry comparison confirming direct dependencies are on the selected
   latest compatible stable releases, with TypeScript 7 and any documented
   Solana peer-compatibility exceptions
5. Generated-output inspection for CSP meta tags, pagination links, locale
   routes, article metadata, RSS, sitemap, robots, llms files, and Pagefind
6. A short startup check of the new unmanaged parallel development command on
   an unused port

Record commands and results in GitHub issue #3.
