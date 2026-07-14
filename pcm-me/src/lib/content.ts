import { cache } from 'react'
import type { Where } from 'payload'

import { getPayloadClient } from './payload'
import type { Locale } from './enums'

type CollectionSlug =
  | 'articles'
  | 'news'
  | 'vacancies'
  | 'companies'
  | 'categories'
  | 'tags'
  | 'authors'

const publishedLocale = (locale: Locale, extra?: Where): Where => ({
  and: [{ status: { equals: 'published' } }, { locale: { equals: locale } }, ...(extra ? [extra] : [])],
})

/** Paginated list of published items for a locale. */
export const listPublished = async (
  collection: Exclude<CollectionSlug, 'news'>,
  locale: Locale,
  opts: { page?: number; limit?: number; where?: Where; sort?: string } = {},
) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection,
    where: publishedLocale(locale, opts.where),
    sort: opts.sort ?? '-publishedAt',
    page: opts.page ?? 1,
    limit: opts.limit ?? 12,
    depth: 1,
  })
}

/** First published item by slug + locale, or null. */
export const findBySlug = async (
  collection: Exclude<CollectionSlug, 'news'>,
  locale: Locale,
  slug: string,
) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection,
    where: publishedLocale(locale, { slug: { equals: slug } }),
    limit: 1,
    depth: 2,
  })
  return (res.docs[0] ?? null) as unknown as Record<string, unknown> | null
}

/** Published translation sibling in the other locale, or null. */
export const findSibling = async (
  collection: Exclude<CollectionSlug, 'news'>,
  translationGroupId: string | undefined,
  currentLocale: Locale,
) => {
  if (!translationGroupId) return null
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection,
    where: {
      and: [
        { translationGroupId: { equals: translationGroupId } },
        { locale: { not_equals: currentLocale } },
        { status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 0,
  })
  return (res.docs[0] ?? null) as unknown as Record<string, unknown> | null
}

/** A published category by slug + locale. */
export const getCategoryBySlug = async (locale: Locale, slug: string) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'categories',
    where: publishedLocale(locale, { slug: { equals: slug } }),
    limit: 1,
    depth: 0,
  })
  return (res.docs[0] ?? null) as unknown as Record<string, unknown> | null
}

/**
 * Legacy URL support: find a published article by its OLD WordPress URL path.
 * `legacyUrl` is stored as the full old link (e.g. https://pcm.me/<slug>/, with
 * Arabic slugs percent-encoded lowercase). We match common host / trailing-slash
 * / encoding-case variants of the incoming path.
 */
export const findByLegacyUrl = async (path: string) => {
  const clean = ('/' + path.replace(/^\/+/, '')).replace(/\/+$/, '') || '/'
  const lowerPct = (s: string) => s.replace(/%[0-9A-Fa-f]{2}/g, (m) => m.toLowerCase())
  const upperPct = (s: string) => s.replace(/%[0-9A-Fa-f]{2}/g, (m) => m.toUpperCase())
  // The incoming path may arrive already percent-encoded (any case) OR decoded.
  // Build both directions: normalize existing %XX case, and (re)encode the
  // decoded form. WordPress stores lowercase %-encoding with a trailing slash.
  let decoded = clean
  try { decoded = decodeURIComponent(clean) } catch { /* malformed — keep raw */ }
  const encoded = encodeURI(decoded) // decoded chars → %XX (uppercase)
  const bases = new Set<string>([
    clean, lowerPct(clean), upperPct(clean),
    decoded, encoded, lowerPct(encoded), upperPct(encoded),
  ])
  const hosts = ['https://pcm.me', 'https://www.pcm.me', 'http://pcm.me']
  const variants = new Set<string>()
  for (const h of hosts) for (const b of bases) {
    variants.add(h + b) // no trailing slash
    variants.add(h + b.replace(/\/?$/, '/')) // with trailing slash
  }
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'articles',
    where: {
      and: [
        { status: { equals: 'published' } },
        { or: [...variants].map((v) => ({ legacyUrl: { equals: v } })) },
      ],
    },
    limit: 1,
    depth: 0,
  })
  return (res.docs[0] ?? null) as unknown as (Record<string, unknown> & { locale?: Locale; slug?: string }) | null
}

/** Request-cached wrapper so the legacy layout + page share one DB lookup. */
export const findByLegacyPath = cache((path: string) => findByLegacyUrl(path))

/** Published articles in a given category id. */
export const listArticlesInCategory = async (
  locale: Locale,
  categoryId: string,
  opts: { page?: number; limit?: number } = {},
) => {
  return listPublished('articles', locale, {
    where: { category: { equals: categoryId } },
    page: opts.page,
    limit: opts.limit,
  })
}
