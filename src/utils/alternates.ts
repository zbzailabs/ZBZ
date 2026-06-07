import { DEFAULT_LOCALE, LOCALES, getLocaleMeta, type Locale } from "@/config/locales"
import { getTotalPages } from "@/utils/pagination"
import type { PostLike } from "@/utils/posts"
import { getPublishedPosts, postPath, postSlug } from "@/utils/posts"
import { buildAlternatesForLocales, canonicalUrl } from "@/utils/routes"

export async function postLocaleAlternates(post: PostLike) {
  const slug = postSlug(post)
  const publishedPosts = await getPublishedPosts()
  const translations = publishedPosts.filter(
    (candidate) => postSlug(candidate) === slug
  )
  const entries = Object.fromEntries(
    translations.map((candidate) => [
      getLocaleMeta(candidate.data.locale).hreflang,
      canonicalUrl(candidate.data.locale, postPath(candidate)),
    ])
  )
  const defaultPost =
    translations.find((candidate) => candidate.data.locale === DEFAULT_LOCALE) ??
    translations.find((candidate) => candidate.id === post.id) ??
    translations[0]

  if (defaultPost) {
    entries["x-default"] = canonicalUrl(
      defaultPost.data.locale,
      postPath(defaultPost)
    )
  }

  return entries
}

export async function paginatedLocaleAlternates({
  currentPage,
  pageSize,
  getItemCount,
  pathForLocale,
}: {
  currentPage: number
  pageSize: number
  getItemCount: (locale: Locale) => number | Promise<number>
  pathForLocale: (locale: Locale) => string
}) {
  const localeCounts = await Promise.all(
    LOCALES.map(async (locale) => ({
      locale,
      totalPages: getTotalPages(await getItemCount(locale), pageSize),
    }))
  )
  const availableLocales = localeCounts
    .filter(({ totalPages }) => currentPage <= totalPages)
    .map(({ locale }) => locale)

  return buildAlternatesForLocales(pathForLocale, availableLocales)
}

export async function collectionLocaleAlternates({
  getItemCount,
  pathForLocale,
}: {
  getItemCount: (locale: Locale) => number | Promise<number>
  pathForLocale: (locale: Locale) => string
}) {
  const localeCounts = await Promise.all(
    LOCALES.map(async (locale) => ({
      locale,
      count: await getItemCount(locale),
    }))
  )
  const availableLocales = localeCounts
    .filter(({ count }) => count > 0)
    .map(({ locale }) => locale)

  return buildAlternatesForLocales(pathForLocale, availableLocales)
}
