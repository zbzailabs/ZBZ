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
    zh: [
      `这篇${categoryLabel}文章补充了可复查的背景信息。`,
      `${siteName} 持续整理相关主题和长期记录，便于读者按时间回看。`,
    ],
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

export function articleWordCount(markdown: string) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_\-~()[\]{}|]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (!text) return 0

  const cjk = text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu)?.length ?? 0
  const words = text
    .replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu, " ")
    .match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)?.length ?? 0

  return cjk + words
}

export function normalizeCollectionMetaDescription(
  description: string,
  label: string,
  locale: Locale,
  {
    page,
    count,
    kind,
    siteName = SITE_CONFIG.name,
  }: {
    page?: number
    count?: number
    kind?: string
    siteName?: string
  } = {}
) {
  const pageText = page && page > 1 ? ` ${page}` : ""
  const countText = typeof count === "number" ? ` ${count}` : ""
  const subject = kind ? `${label} ${kind}` : label
  const extensionsByLocale: Record<Locale, string[]> = {
    en: [
      `Browse ${siteName} ${subject.toLowerCase()} notes and long-form articles${pageText}.`,
      `This archive helps readers review${countText} related entries by topic and date.`,
    ],
    zh: [
      `浏览 ${siteName} 的${subject}文章与长期记录${pageText}。`,
      `本页便于按主题和时间复查${countText}篇相关内容。`,
    ],
    fr: [
      `Parcourez les notes et articles ${subject.toLowerCase()} de ${siteName}${pageText}.`,
      `Cette archive aide a revoir${countText} entrees reliees par theme et date.`,
    ],
    es: [
      `Explora notas y articulos de ${subject.toLowerCase()} en ${siteName}${pageText}.`,
      `Este archivo ayuda a revisar${countText} entradas relacionadas por tema y fecha.`,
    ],
    ru: [
      `Просматривайте заметки и статьи ${siteName} по теме ${subject}${pageText}.`,
      `Этот архив помогает пересматривать${countText} связанных материалов по теме и дате.`,
    ],
    ja: [
      `${siteName} の${subject}記事と長期記録を閲覧できます${pageText}。`,
      `このアーカイブは${countText}件の関連項目をテーマと日付で確認するためのページです。`,
    ],
    ko: [
      `${siteName}의 ${subject} 글과 장기 기록을 살펴봅니다${pageText}.`,
      `이 아카이브는 주제와 날짜별로${countText}개 관련 항목을 검토하는 데 도움이 됩니다.`,
    ],
    pt: [
      `Explore notas e artigos de ${subject.toLowerCase()} no ${siteName}${pageText}.`,
      `Este arquivo ajuda leitores a revisar${countText} entradas relacionadas por tema e data.`,
    ],
    de: [
      `Durchsuchen Sie ${siteName} Notizen und Artikel zu ${subject.toLowerCase()}${pageText}.`,
      `Dieses Archiv hilft beim Pruefen von${countText} passenden Eintraegen nach Thema und Datum.`,
    ],
    id: [
      `Jelajahi catatan dan artikel ${subject.toLowerCase()} di ${siteName}${pageText}.`,
      `Arsip ini membantu pembaca meninjau${countText} entri terkait berdasarkan topik dan tanggal.`,
    ],
    ar: [
      `تصفح ملاحظات ومقالات ${siteName} حول ${subject}${pageText}.`,
      `يساعد هذا الارشيف القراء على مراجعة${countText} مواد مرتبطة حسب الموضوع والتاريخ.`,
    ],
  }

  return normalizeMetaDescription(description, extensionsByLocale[locale])
}

export function normalizePageMetaDescription(
  description: string,
  label: string,
  locale: Locale,
  siteName = SITE_CONFIG.name
) {
  const extensionsByLocale: Record<Locale, string[]> = {
    en: [
      `Read this ${label.toLowerCase()} page on ${siteName}.`,
      `It provides site context, navigation support, and current publishing information for readers.`,
    ],
    zh: [
      `阅读 ${siteName} 的${label}页面。`,
      `本页提供站点背景、访问入口和当前内容说明，帮助读者了解相关信息。`,
    ],
    fr: [
      `Lisez cette page ${label.toLowerCase()} sur ${siteName}.`,
      `Elle fournit du contexte de site, des liens de navigation et des informations de publication.`,
    ],
    es: [
      `Lee esta pagina de ${label.toLowerCase()} en ${siteName}.`,
      `Ofrece contexto del sitio, enlaces de navegacion e informacion editorial actual.`,
    ],
    ru: [
      `Читайте страницу ${label} на ${siteName}.`,
      `Она дает контекст сайта, навигационные ссылки и сведения о текущих публикациях.`,
    ],
    ja: [
      `${siteName} の${label}ページを確認できます。`,
      `このページはサイト背景、移動先、現在の公開情報を読者向けにまとめています。`,
    ],
    ko: [
      `${siteName}의 ${label} 페이지를 읽습니다.`,
      `이 페이지는 사이트 배경, 이동 경로, 현재 발행 정보를 독자에게 제공합니다.`,
    ],
    pt: [
      `Leia esta pagina de ${label.toLowerCase()} no ${siteName}.`,
      `Ela oferece contexto do site, caminhos de navegacao e informacoes editoriais atuais.`,
    ],
    de: [
      `Lesen Sie diese ${label.toLowerCase()} Seite auf ${siteName}.`,
      `Sie bietet Website-Kontext, Navigationswege und aktuelle Hinweise zur Veroeffentlichung.`,
    ],
    id: [
      `Baca halaman ${label.toLowerCase()} ini di ${siteName}.`,
      `Halaman ini menyediakan konteks situs, jalur navigasi, dan informasi publikasi terbaru.`,
    ],
    ar: [
      `اقرأ صفحة ${label} على ${siteName}.`,
      `توفر هذه الصفحة سياق الموقع وروابط التنقل ومعلومات النشر الحالية للقراء.`,
    ],
  }

  return normalizeMetaDescription(description, extensionsByLocale[locale])
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
