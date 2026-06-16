import type { Payload } from 'payload'

import type { Locale } from './enums'

/**
 * "Featured, this locale, ordered" query (PRD §7.4) — exposed for Session 03's
 * Home. Returns published, featured items for the given locale, ordered by
 * featuredOrder (lower first).
 */
export const getFeatured = async (
  payload: Payload,
  collection: 'articles' | 'vacancies' | 'companies' | 'categories',
  locale: Locale,
  limit = 10,
) => {
  const res = await payload.find({
    collection,
    where: {
      and: [
        { status: { equals: 'published' } },
        { locale: { equals: locale } },
        { featured: { equals: true } },
      ],
    },
    sort: 'featuredOrder',
    limit,
    depth: 1,
  })
  return res.docs
}
