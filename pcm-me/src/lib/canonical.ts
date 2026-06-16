import type { Country, Locale } from './enums'
import { COUNTRY_ROUTE_SLUGS } from './enums'
import {
  articleDetailUrl,
  articlesIndexUrl,
  newsIndexUrl,
  interactionsUrl,
  companiesIndexUrl,
  companyUrl,
  jobsIndexUrl,
  jobsCountryUrl,
  vacancyUrl,
  categoryUrl,
  subCategoryUrl,
  skillsTrackUrl,
  searchUrl,
  homeUrl,
} from './routes'

/**
 * Canonical URL builder (PRD §9, Session 06 §5) — the single source of truth
 * for public absolute URLs on pcm.me. Session 07's 301 redirect map MUST
 * target exactly these URLs. Country slug map repeated here per spec:
 * egypt, emirates, ksa, kuwait, north-africa, general.
 */
export const COUNTRY_SLUGS = COUNTRY_ROUTE_SLUGS

export const siteUrl = (): string =>
  (process.env.SITE_URL || 'https://pcm.me').replace(/\/$/, '')

/** Absolute URL from a locale-prefixed path. */
export const absoluteUrl = (path: string): string => {
  const base = siteUrl()
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`
}

export const canonicalHome = (locale: Locale) => absoluteUrl(homeUrl(locale))
export const canonicalArticle = (locale: Locale, kind: string | undefined, slug: string) =>
  absoluteUrl(articleDetailUrl(locale, kind, slug))
export const canonicalArticlesIndex = (locale: Locale) => absoluteUrl(articlesIndexUrl(locale))
export const canonicalNewsIndex = (locale: Locale) => absoluteUrl(newsIndexUrl(locale))
export const canonicalInteractions = (locale: Locale) => absoluteUrl(interactionsUrl(locale))
export const canonicalCompany = (locale: Locale, slug: string) =>
  absoluteUrl(companyUrl(locale, slug))
export const canonicalCompaniesIndex = (locale: Locale) => absoluteUrl(companiesIndexUrl(locale))
export const canonicalJobsIndex = (locale: Locale) => absoluteUrl(jobsIndexUrl(locale))
export const canonicalJobsCountry = (locale: Locale, country: Country) =>
  absoluteUrl(jobsCountryUrl(locale, country))
export const canonicalVacancy = (locale: Locale, country: Country, slug: string) =>
  absoluteUrl(vacancyUrl(locale, country, slug))
export const canonicalCategory = (locale: Locale, slug: string) =>
  absoluteUrl(categoryUrl(locale, slug))
export const canonicalSubCategory = (locale: Locale, parentSlug: string, slug: string) =>
  absoluteUrl(subCategoryUrl(locale, parentSlug, slug))
export const canonicalSkillsTrack = (locale: Locale, trackSlug: string) =>
  absoluteUrl(skillsTrackUrl(locale, trackSlug))
export const canonicalSearch = (locale: Locale) => absoluteUrl(searchUrl(locale))
