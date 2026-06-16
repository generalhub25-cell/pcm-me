import { COUNTRY_ROUTE_SLUGS, type Country, type Locale } from './enums'

/**
 * Public route path builders (PRD §3.1). All routes are locale-prefixed.
 * Session 06 builds the absolute canonical URLs on top of these.
 */

export const homeUrl = (locale: Locale): string => `/${locale}`

export const articlesIndexUrl = (locale: Locale): string => `/${locale}/articles`
export const newsIndexUrl = (locale: Locale): string => `/${locale}/news`
export const interactionsUrl = (locale: Locale): string => `/${locale}/interactions`

export const articleUrl = (locale: Locale, slug: string): string => `/${locale}/articles/${slug}`
export const newsUrl = (locale: Locale, slug: string): string => `/${locale}/news/${slug}`

/** Detail URL for an Article by kind (news → /news/, otherwise → /articles/). */
export const articleDetailUrl = (
  locale: Locale,
  kind: string | undefined,
  slug: string,
): string => (kind === 'news' ? newsUrl(locale, slug) : articleUrl(locale, slug))

export const companiesIndexUrl = (locale: Locale): string => `/${locale}/companies`
export const companyUrl = (locale: Locale, slug: string): string =>
  `/${locale}/companies/${slug}`

export const jobsIndexUrl = (locale: Locale): string => `/${locale}/jobs`
export const jobsCountryUrl = (locale: Locale, country: Country): string =>
  `/${locale}/jobs/${COUNTRY_ROUTE_SLUGS[country]}`
export const vacancyUrl = (locale: Locale, country: Country, slug: string): string =>
  `/${locale}/jobs/${COUNTRY_ROUTE_SLUGS[country]}/${slug}`

export const categoryUrl = (locale: Locale, slug: string): string =>
  `/${locale}/categories/${slug}`
export const subCategoryUrl = (locale: Locale, parentSlug: string, slug: string): string =>
  `/${locale}/categories/${parentSlug}/${slug}`

export const skillsTrackUrl = (locale: Locale, trackSlug: string): string =>
  `/${locale}/skills/${trackSlug}`

export const searchUrl = (locale: Locale): string => `/${locale}/search`

/** Map a route country slug (e.g. "north-africa") back to the enum value. */
export const countryFromRouteSlug = (routeSlug: string): Country | null => {
  const entry = (Object.entries(COUNTRY_ROUTE_SLUGS) as [Country, string][]).find(
    ([, s]) => s === routeSlug,
  )
  return entry ? entry[0] : null
}

/** Swap the leading locale segment of a path (fallback language-switch target). */
export const swapLocaleInPath = (pathname: string, target: Locale): string => {
  const parts = pathname.split('/')
  // parts[0] is '' (leading slash); parts[1] is the current locale.
  if (parts.length > 1) {
    parts[1] = target
    return parts.join('/') || `/${target}`
  }
  return `/${target}`
}
