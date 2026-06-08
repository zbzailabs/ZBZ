import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const read = (path) => readFileSync(join(root, path), "utf8")

const layout = read("src/layouts/main.astro")
const postPage = read("src/pages/[lang]/posts/[...slug].astro")
const structuredData = read("src/utils/structured-data.ts")
const seo = read("src/utils/seo.ts")
const localeFiles = readdirSync(join(root, "src/i18n")).filter((file) =>
  file.endsWith(".json")
)
const en = JSON.parse(read("src/i18n/en.json"))

function assertIncludes(source, needle, message) {
  assert.ok(source.includes(needle), message)
}

function extractJsonLdScripts(html) {
  const scripts = []
  const pattern =
    /<script\b(?=[^>]*\btype=(["'])application\/ld\+json\1)[^>]*>([\s\S]*?)<\/script>/gi
  for (const match of html.matchAll(pattern)) scripts.push(match[2].trim())
  return scripts
}

assertIncludes(
  layout,
  'import { normalizeMetaDescription } from "@/utils/seo"',
  "Layout must normalize meta descriptions centrally."
)
assertIncludes(
  layout,
  "normalizeMetaDescription(",
  "Layout must call normalizeMetaDescription before passing description to SEO."
)
assertIncludes(
  layout,
  "imageAlt?: string",
  "Layout must accept social image alt text."
)
assertIncludes(
  layout,
  "article?: {",
  "Layout must accept article Open Graph metadata."
)
assertIncludes(
  layout,
  "openGraphArticle",
  "Layout must pass article metadata into astro-seo."
)

assertIncludes(
  postPage,
  "imageAlt={post.data.heroImageAlt}",
  "Article pages must use heroImageAlt for social image alt text."
)
assertIncludes(
  postPage,
  "article={{",
  "Article pages must pass complete article Open Graph metadata."
)
assertIncludes(
  postPage,
  "articleWordCount(",
  "Article pages must calculate BlogPosting wordCount."
)
assert.ok(
  !postPage.includes("Topics:"),
  "Article page helper text must not hard-code English UI copy."
)
assert.equal(
  en.post.topicsPrefix,
  "Topics",
  "Article topic helper label must live in src/i18n/*.json."
)
for (const file of localeFiles) {
  const dict = JSON.parse(read(`src/i18n/${file}`))
  assert.equal(
    typeof dict.post?.topicsPrefix,
    "string",
    `${file} must define post.topicsPrefix.`
  )
}

assertIncludes(
  structuredData,
  "thumbnailUrl",
  "BlogPosting JSON-LD must include thumbnailUrl."
)
assertIncludes(
  structuredData,
  "wordCount",
  "BlogPosting JSON-LD must include wordCount."
)
assertIncludes(
  structuredData,
  "wordCount?: number",
  "articleJsonLd input must accept wordCount."
)
assertIncludes(
  seo,
  "export function articleWordCount",
  "SEO utilities must expose a reusable article word counter."
)

const jsonLdScripts = extractJsonLdScripts(`
  <script type="application/ld+json">
    [{"@context":"https://schema.org","headline":"Founder's note","description":"It parses apostrophes."}]
  </script>
`)
assert.equal(jsonLdScripts.length, 1, "SEO script parser must find JSON-LD.")
assert.doesNotThrow(
  () => JSON.parse(jsonLdScripts[0]),
  "SEO script parser must handle apostrophes without falling back."
)
