import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")

test("interactive controllers are compatible with the strict CSP", async () => {
  const paths = [
    "src/components/features/PagefindSearch.astro",
    "src/components/islands/LanguageSwitcher.astro",
    "src/components/islands/MobileNav.astro",
    "src/components/islands/ThemeSwitcher.astro",
    "src/components/ui/Footer.astro",
    "src/components/widgets/CWDComments.astro",
    "src/layouts/main.astro",
    "src/pages/[lang]/author.astro",
  ]
  const [config, ...controllers] = await Promise.all([
    read("astro.config.mjs"),
    ...paths.map(read),
  ])

  for (const controller of controllers) {
    assert.doesNotMatch(controller, /<script\s+is:inline>\s*;?\(\(\)\s*=>/u)
  }
  assert.match(config, /https:\/\/unpkg\.com/u)
  assert.match(config, /https:\/\/api-cmt\.zbz\.ai/u)
  assert.match(config, /assetsInlineLimit:\s*0/u)
  assert.match(config, /sha256-XlsOZ7bTVgbsPrh7LZjju5rwvjGaGarhEwVzNLcsIxM=/u)
  assert.match(controllers[0], /data-pagefind-search/u)
  assert.match(controllers[0], /data-pagefind-ui-script/u)
})
