import mdx from "@astrojs/mdx"
import partytown from "@astrojs/partytown"
import sitemap from "@astrojs/sitemap"
import { satteri } from "@astrojs/markdown-satteri"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, svgoOptimizer } from "astro/config"
import icon from "astro-icon"
import pagefind from "./src/integrations/pagefind.ts"
import { SITE_CONFIG } from "./src/config/site.ts"

const googleTagManagerEnabled =
  process.env.PUBLIC_GTM_ENABLED === "true" &&
  /^GTM-[A-Z0-9]+$/i.test(process.env.PUBLIC_GTM_ID ?? "")
const sitemapLocaleMap = {
  en: "en-US",
  zh: "zh-CN",
  fr: "fr-FR",
  es: "es-ES",
  ru: "ru-RU",
  ja: "ja-JP",
  ko: "ko-KR",
  pt: "pt-PT",
  de: "de-DE",
  id: "id-ID",
  ar: "ar",
}

export default defineConfig({
  output: "static",
  site: SITE_CONFIG.url,
  trailingSlash: "always",
  compressHTML: true,
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
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "zh",
    locales: ["zh", "en", "fr", "es", "ru", "ja", "ko", "pt", "de", "id", "ar"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
    remotePatterns: SITE_CONFIG.assets.remotePatterns,
    service: {
      config: {
        jpeg: { mozjpeg: true },
        webp: { effort: 6, alphaQuality: 80 },
        avif: { effort: 4, chromaSubsampling: "4:2:0" },
        png: { compressionLevel: 9 },
      },
    },
  },
  markdown: {
    processor: satteri(),
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
      wrap: true,
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer({
      multipass: true,
      floatPrecision: 2,
      plugins: ["preset-default"],
    }),
  },
  integrations: [
    ...(googleTagManagerEnabled
      ? [
          partytown({
            config: {
              forward: ["dataLayer.push"],
            },
          }),
        ]
      : []),
    icon({
      include: {
        lucide: [
          "arrow-left",
          "chevron-down",
          "chevron-left",
          "chevron-right",
          "eye",
          "github",
          "globe",
          "menu",
          "monitor",
          "moon",
          "newspaper",
          "rss",
          "search",
          "sun",
          "x",
        ],
      },
    }),
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page)
        return pathname !== "/" && !pathname.endsWith("/search/")
      },
      i18n: {
        defaultLocale: "zh",
        locales: sitemapLocaleMap,
      },
      serialize: (item) => {
        if (!item.links?.length) return item
        const links = new Map(item.links.map((link) => [link.lang, link.url]))
        const defaultUrl = links.get(sitemapLocaleMap.zh)
        if (defaultUrl) links.set("x-default", defaultUrl)
        return {
          ...item,
          links: [...links].map(([lang, url]) => ({ lang, url })),
        }
      },
    }),
    mdx(),
    pagefind(),
  ],
})
