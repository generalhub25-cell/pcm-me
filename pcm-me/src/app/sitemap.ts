import type { MetadataRoute } from 'next'

import { getPayloadClient } from '../lib/payload'
import { LOCALES, COUNTRIES, type Country, type Locale } from '../lib/enums'
import {
  absoluteUrl,
  canonicalArticle,
  canonicalVacancy,
  canonicalCompany,
  canonicalCategory,
} from '../lib/canonical'
import {
  articlesIndexUrl,
  newsIndexUrl,
  jobsIndexUrl,
  jobsCountryUrl,
  companiesIndexUrl,
  interactionsUrl,
  searchUrl,
  homeUrl,
} from '../lib/routes'

// Reflect current published state on each request (regenerated on publish).
export const dynamic = 'force-dynamic'

/**
 * sitemap.xml at /sitemap.xml (not locale-prefixed) — all published URLs in
 * both locales (PRD §9.5).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const entries: MetadataRoute.Sitemap = []

  // Static + index routes, both locales.
  for (const locale of LOCALES as readonly Locale[]) {
    const paths = [
      homeUrl(locale),
      articlesIndexUrl(locale),
      newsIndexUrl(locale),
      interactionsUrl(locale),
      jobsIndexUrl(locale),
      companiesIndexUrl(locale),
      searchUrl(locale),
      `/${locale}/about`,
      `/${locale}/contact`,
      `/${locale}/privacy-policy`,
      `/${locale}/terms`,
      `/${locale}/cookie-policy`,
      ...COUNTRIES.map((c) => jobsCountryUrl(locale, c)),
    ]
    for (const p of paths) entries.push({ url: absoluteUrl(p) })
  }

  const published = { status: { equals: 'published' } }

  const [articles, vacancies, companies, categories] = await Promise.all([
    payload.find({ collection: 'articles', where: published, limit: 0, pagination: false, depth: 0 }),
    payload.find({ collection: 'vacancies', where: published, limit: 0, pagination: false, depth: 0 }),
    payload.find({ collection: 'companies', where: published, limit: 0, pagination: false, depth: 0 }),
    payload.find({ collection: 'categories', where: published, limit: 0, pagination: false, depth: 0 }),
  ])

  for (const d of articles.docs) {
    const doc = d as unknown as { locale: Locale; kind?: string; slug?: string; updatedAt?: string }
    if (doc.slug) entries.push({ url: canonicalArticle(doc.locale, doc.kind, doc.slug), lastModified: doc.updatedAt })
  }
  for (const d of vacancies.docs) {
    const doc = d as unknown as { locale: Locale; country?: Country; slug?: string; updatedAt?: string }
    if (doc.slug && doc.country)
      entries.push({ url: canonicalVacancy(doc.locale, doc.country, doc.slug), lastModified: doc.updatedAt })
  }
  for (const d of companies.docs) {
    const doc = d as unknown as { locale: Locale; slug?: string; updatedAt?: string }
    if (doc.slug) entries.push({ url: canonicalCompany(doc.locale, doc.slug), lastModified: doc.updatedAt })
  }
  for (const d of categories.docs) {
    const doc = d as unknown as { locale: Locale; slug?: string; updatedAt?: string }
    if (doc.slug) entries.push({ url: canonicalCategory(doc.locale, doc.slug), lastModified: doc.updatedAt })
  }

  return entries
}
