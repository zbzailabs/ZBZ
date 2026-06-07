import {
  DEFAULT_LOCALE,
  LOCALES,
  getLocaleMeta,
  type Locale,
} from "@/config/locales"
import { SITE_CONFIG } from "@/config/site"

export function withTrailingSlash(path: string): string {
  if (path === "") return "/"
  return path.endsWith("/") ? path : `${path}/`
}

export function normalizePath(path: string): string {
  const next = path.startsWith("/") ? path : `/${path}`
  return withTrailingSlash(next)
}

export function localePath(locale: Locale, path = "/"): string {
  const normalized = normalizePath(path)
  return withTrailingSlash(`/${locale}${normalized === "/" ? "" : normalized}`)
}

export function canonicalUrl(locale: Locale, path = "/"): string {
  return `${SITE_CONFIG.url}${localePath(locale, path)}`
}

export function buildAlternates(path = "/"): Record<string, string> {
  const entries = Object.fromEntries(
    LOCALES.map((locale) => [
      getLocaleMeta(locale).hreflang,
      canonicalUrl(locale, path),
    ])
  )
  return { ...entries, "x-default": canonicalUrl(DEFAULT_LOCALE, path) }
}

export function buildAlternatesForLocales(
  pathForLocale: (locale: Locale) => string,
  locales: Locale[],
  defaultLocale: Locale = DEFAULT_LOCALE
): Record<string, string> {
  const uniqueLocales = LOCALES.filter((locale) => locales.includes(locale))
  const entries = Object.fromEntries(
    uniqueLocales.map((locale) => [
      getLocaleMeta(locale).hreflang,
      canonicalUrl(locale, pathForLocale(locale)),
    ])
  )
  const defaultTarget = uniqueLocales.includes(defaultLocale)
    ? defaultLocale
    : uniqueLocales[0]

  return defaultTarget
    ? {
        ...entries,
        "x-default": canonicalUrl(defaultTarget, pathForLocale(defaultTarget)),
      }
    : entries
}
