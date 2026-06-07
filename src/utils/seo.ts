import { SITE_CONFIG } from "@/config/site"
import type { Locale } from "@/config/locales"

const DEFAULT_MIN_DESCRIPTION_LENGTH = 140
const DEFAULT_MAX_DESCRIPTION_LENGTH = 160

function cleanDescription(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

function trimDescription(value: string, minLength: number, maxLength: number) {
  if (value.length <= maxLength) return value

  const slice = value.slice(0, maxLength - 1)
  const wordBoundary = slice.lastIndexOf(" ")
  const trimmed =
    wordBoundary >= minLength ? slice.slice(0, wordBoundary) : slice

  return `${trimmed.replace(/[\s,;:.-]+$/, "")}.`
}

export function normalizeMetaDescription(
  description: string,
  extension: string | string[],
  {
    minLength = DEFAULT_MIN_DESCRIPTION_LENGTH,
    maxLength = DEFAULT_MAX_DESCRIPTION_LENGTH,
  } = {}
) {
  const base = cleanDescription(description)
  if (base.length >= minLength && base.length <= maxLength) return base

  const extensions = Array.isArray(extension) ? extension : [extension]
  let expanded = base
  for (const item of extensions) {
    if (expanded.length >= minLength) break
    expanded = cleanDescription(`${expanded} ${item}`)
  }

  return trimDescription(expanded, minLength, maxLength)
}

export function normalizePostMetaDescription(
  description: string,
  categoryLabel: string,
  locale: Locale,
  siteName = SITE_CONFIG.name
) {
  const extensionsByLocale: Record<Locale, string[]> = {
    en: [
      `This ${categoryLabel.toLowerCase()} article adds context for readers.`,
      `It supports later review on ${siteName}.`,
    ],
    zh: [`这篇${categoryLabel}文章补充了可复查的背景信息。`, `${siteName} 持续整理相关主题。`],
    fr: [
      `Cet article ${categoryLabel.toLowerCase()} ajoute du contexte pour les lecteurs.`,
      `${siteName} conserve ces notes pour une consultation ultérieure.`,
    ],
    es: [
      `Este articulo de ${categoryLabel.toLowerCase()} agrega contexto para los lectores.`,
      `${siteName} conserva estas notas para consulta posterior.`,
    ],
    ru: [
      `Эта статья о ${categoryLabel.toLowerCase()} добавляет контекст для читателей.`,
      `${siteName} сохраняет эти заметки для последующего просмотра.`,
    ],
    ja: [`この${categoryLabel}記事は読者向けの背景情報を補足します。`, `${siteName} は関連する記録を継続して整理します。`],
    ko: [`이 ${categoryLabel} 글은 독자를 위한 배경 정보를 보완합니다.`, `${siteName}에서 관련 기록을 계속 정리합니다.`],
    pt: [
      `Este artigo de ${categoryLabel.toLowerCase()} acrescenta contexto para leitores.`,
      `${siteName} preserva estas notas para consulta posterior.`,
    ],
    de: [
      `Dieser ${categoryLabel.toLowerCase()} Artikel ergaenzt Kontext fuer Leser.`,
      `${siteName} haelt diese Notizen fuer spaetere Pruefung fest.`,
    ],
    id: [
      `Artikel ${categoryLabel.toLowerCase()} ini menambah konteks untuk pembaca.`,
      `${siteName} menyimpan catatan ini untuk peninjauan berikutnya.`,
    ],
    ar: [
      `تضيف هذه المقالة عن ${categoryLabel} سياقا مفيدا للقراء.`,
      `يحفظ ${siteName} هذه الملاحظات للمراجعة اللاحقة.`,
    ],
  }

  return normalizeMetaDescription(description, [
    ...extensionsByLocale[locale],
  ])
}

export function taxonomyMetaTitle(label: string, page?: number) {
  const pageLabel = page && page > 1 ? ` Page ${page}` : ""
  return `${label} Articles and Topic Notes${pageLabel} | ${SITE_CONFIG.name}`
}

export function taxonomyMetaDescription(
  label: string,
  description: string,
  page?: number
) {
  const pageLabel = page && page > 1 ? ` Page ${page} continues the archive.` : ""

  return normalizeMetaDescription(description, [
    `Explore ${SITE_CONFIG.name} ${label.toLowerCase()} articles and related research notes.`,
    `Use this page to review practical context for long-term decisions.${pageLabel}`,
  ])
}
