import { readFileSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const source = readFileSync(
  join(root, "src/components/islands/ThemeSwitcher.astro"),
  "utf8",
)

const contracts = [
  ["light", "sun"],
  ["dark", "moon"],
  ["system", "monitor"],
]

const failures = []

const triggerMatch = source.match(
  /<button[\s\S]*?data-dropdown-menu-trigger[\s\S]*?<\/button>/,
)
const triggerMarkup = triggerMatch?.[0] ?? ""

if (!triggerMarkup) {
  failures.push("Theme switcher trigger button was not found.")
}

for (const [theme, icon] of contracts) {
  const triggerIcon = new RegExp(
    `data-theme-trigger-icon="${theme}"[\\s\\S]*?<Icon\\s+name="${icon}"|<Icon\\s+name="${icon}"[\\s\\S]*?data-theme-trigger-icon="${theme}"`,
  )
  if (!triggerIcon.test(triggerMarkup)) {
    failures.push(`Trigger icon contract missing: ${theme} -> ${icon}.`)
  }

  const menuItem = new RegExp(
    `data-theme-value="${theme}"[\\s\\S]*?<Icon\\s+name="${icon}"`,
  )
  if (!menuItem.test(source)) {
    failures.push(`Menu item icon contract missing: ${theme} -> ${icon}.`)
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"))
  process.exit(1)
}

console.log("Theme switcher icon contracts verified.")
