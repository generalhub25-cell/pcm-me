import type { ArticleKind, Country, Locale } from '../lib/enums'

/**
 * Pure field-mapping helpers for the legacy WordPress migration (PRD §12.3,
 * §12.6). Kept pure so they can be unit-verified without a live WXR source.
 */

/**
 * Locale detection (PRD §12.6): Arabic script in title/body → `ar`, else `en`.
 * Returns the locale plus a confidence flag (low confidence → manual review).
 */
export const detectLocale = (text: string): { locale: Locale; lowConfidence: boolean } => {
  const arabic = (text.match(/[؀-ۿ]/g) || []).length
  const latin = (text.match(/[A-Za-z]/g) || []).length
  const total = arabic + latin
  if (total === 0) return { locale: 'en', lowConfidence: true }
  const arabicRatio = arabic / total
  if (arabicRatio >= 0.5) return { locale: 'ar', lowConfidence: arabicRatio < 0.65 }
  return { locale: 'en', lowConfidence: arabicRatio > 0.35 }
}

/**
 * Article.kind inferred from the legacy category (PRD §12.3):
 * scientific articles → scientific; news/syndicate → news;
 * drug-food/drug-drug interaction & medicine reference lists → reference.
 */
export const inferArticleKind = (legacyCategory: string): ArticleKind => {
  const c = legacyCategory.toLowerCase()
  if (/news|syndicate|أخبار/.test(c)) return 'news'
  if (/interaction|reference|medicine|drug|تفاعل|دواء/.test(c)) return 'reference'
  return 'scientific'
}

/**
 * Map a legacy vacancy source (e.g. egypt.php, "ksa-to-ksa") to the country
 * enum (PRD §12.3, §4). "X to Y" routes (OQ-4 default) resolve to the single
 * destination country.
 */
export const inferCountry = (source: string): Country => {
  const s = source.toLowerCase().replace(/\.php$/, '')
  // "X-to-Y" → take the destination (last token) per OQ-4 default.
  const toMatch = s.match(/-to-([a-z_]+)$/)
  const token = (toMatch ? toMatch[1] : s).replace(/-/g, '_')
  if (/egypt|مصر/.test(token)) return 'egypt'
  if (/emirate|uae|الإمارات/.test(token)) return 'emirates'
  if (/ksa|saudi|السعودية/.test(token)) return 'ksa'
  if (/kuwait|الكويت/.test(token)) return 'kuwait'
  if (/north_africa|north-africa|شمال/.test(token)) return 'north_africa'
  return 'general'
}

/**
 * Expired-vacancy handling (PRD §12.4, OQ-20 default): archive when the
 * expiry is in the past.
 */
export const isExpired = (expiresAt: string | null | undefined, now = Date.now()): boolean => {
  if (!expiresAt) return false
  const t = new Date(expiresAt).getTime()
  return !Number.isNaN(t) && t < now
}

/** Normalize a possibly-missing/"Undefined" legacy field to null (PRD §6.4). */
export const nullIfMissing = (v: unknown): string | null => {
  if (v === null || v === undefined) return null
  const s = String(v).trim()
  if (s === '' || s.toLowerCase() === 'undefined') return null
  return s
}
