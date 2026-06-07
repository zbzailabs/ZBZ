import { DEFAULT_LOCALE, getLocaleMeta } from "@/config/locales"
import type { PostLike } from "@/utils/posts"
import { getPublishedPosts, postPath, postSlug } from "@/utils/posts"
import { canonicalUrl } from "@/utils/routes"

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
