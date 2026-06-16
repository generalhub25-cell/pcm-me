/**
 * Shared enums and slug maps — PRD §4, §6 (Session 01).
 * Repeated/consumed verbatim by Sessions 04 and 07 per spec.
 */

// Locales (PRD §4.1, §6, §12.6) — ar default (RTL), en (LTR).
export const LOCALES = ['ar', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'ar'

// Content lifecycle status (shared field, PRD §6).
export const STATUSES = ['draft', 'published', 'archived'] as const
export type Status = (typeof STATUSES)[number]

// Article.kind (PRD §6.1).
export const ARTICLE_KINDS = ['scientific', 'news', 'reference'] as const
export type ArticleKind = (typeof ARTICLE_KINDS)[number]

// Vacancy.country (PRD §6.3, §4).
export const COUNTRIES = [
  'egypt',
  'emirates',
  'ksa',
  'kuwait',
  'north_africa',
  'general',
] as const
export type Country = (typeof COUNTRIES)[number]

// Vacancy.role_type (PRD §6.3, §4). OQ-13 may extend.
export const ROLE_TYPES = [
  'medical_representative',
  'product_specialist',
  'territory_manager',
  'other',
] as const
export type RoleType = (typeof ROLE_TYPES)[number]

// Country enum -> route slug map (PRD §4). Repeat in Sessions 03, 04, 06, 07.
export const COUNTRY_ROUTE_SLUGS: Record<Country, string> = {
  egypt: 'egypt',
  emirates: 'emirates',
  ksa: 'ksa',
  kuwait: 'kuwait',
  north_africa: 'north-africa',
  general: 'general',
}

// Helper: build select options with readable labels for the admin.
export const toOptions = (values: readonly string[]) =>
  values.map((value) => ({
    label: value
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
    value,
  }))
