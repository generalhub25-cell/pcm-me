import type { Where } from 'payload'

import { getPayloadClient } from './payload'
import type { Locale } from './enums'
import { articleDetailUrl, companyUrl, vacancyUrl } from './routes'

/**
 * Site search abstraction (PRD §5.7, OQ-8).
 * Backend: the database's native contains-based matching (SQLite via Payload's
 * `like` operator) — no extra dependency. All callers go through `search()`,
 * so the implementation can be swapped for Meilisearch/Algolia/etc. without
 * touching callers. SEARCH_BACKEND is recorded in the README.
 *
 * Only `published` items are searched. Application/contact/admin data is never
 * indexed or returned.
 */
export type SearchType = 'article' | 'vacancy' | 'company'

export type SearchResult = {
  type: SearchType
  id: string
  locale: Locale
  title: string
  snippet: string
  url: string
  country?: string
  roleType?: string
}

export type SearchGroup = {
  type: SearchType
  results: SearchResult[]
  totalDocs: number
}

export type SearchResponse = {
  query: string
  groups: SearchGroup[]
  totalPages: number
  page: number
  total: number
}

const PAGE_SIZE = 12 // OQ-18 default

const localeCond = (locale: Locale, includeAllLocales: boolean): Where[] =>
  includeAllLocales ? [] : [{ locale: { equals: locale } }]

const truncate = (s: string, n = 160): string =>
  s.length > n ? s.slice(0, n).trimEnd() + '…' : s

export const search = async (
  query: string,
  opts: {
    locale: Locale
    types?: SearchType[]
    includeAllLocales?: boolean
    page?: number
  },
): Promise<SearchResponse> => {
  const q = (query || '').trim()
  const page = opts.page ?? 1
  const types = opts.types ?? ['article', 'vacancy', 'company']
  const includeAll = Boolean(opts.includeAllLocales)

  if (!q) {
    return { query: q, groups: [], totalPages: 1, page, total: 0 }
  }

  const payload = await getPayloadClient()
  const groups: SearchGroup[] = []
  let maxPages = 1
  let total = 0

  // Articles — title/excerpt + tag/category names (resolve relationships).
  if (types.includes('article')) {
    const [cats, tags] = await Promise.all([
      payload.find({
        collection: 'categories',
        where: { name: { like: q } },
        limit: 50,
        depth: 0,
      }),
      payload.find({ collection: 'tags', where: { name: { like: q } }, limit: 50, depth: 0 }),
    ])
    const catIds = cats.docs.map((d) => String(d.id))
    const tagIds = tags.docs.map((d) => String(d.id))

    const or: Where[] = [{ title: { like: q } }, { excerpt: { like: q } }, { body: { like: q } }]
    if (catIds.length) or.push({ category: { in: catIds } })
    if (tagIds.length) or.push({ tags: { in: tagIds } })

    const res = await payload.find({
      collection: 'articles',
      where: { and: [{ status: { equals: 'published' } }, ...localeCond(opts.locale, includeAll), { or }] },
      sort: '-publishedAt',
      page,
      limit: PAGE_SIZE,
      depth: 1,
    })
    groups.push({
      type: 'article',
      totalDocs: res.totalDocs,
      results: res.docs.map((d) => {
        const doc = d as unknown as Record<string, unknown>
        const loc = (doc.locale as Locale) || opts.locale
        return {
          type: 'article' as const,
          id: String(doc.id),
          locale: loc,
          title: String(doc.title || ''),
          snippet: truncate(String(doc.excerpt || doc.title || '')),
          url: articleDetailUrl(loc, doc.kind as string, String(doc.slug || '')),
        }
      }),
    })
    maxPages = Math.max(maxPages, res.totalPages || 1)
    total += res.totalDocs
  }

  // Vacancies — title/employer.
  if (types.includes('vacancy')) {
    const res = await payload.find({
      collection: 'vacancies',
      where: {
        and: [
          { status: { equals: 'published' } },
          ...localeCond(opts.locale, includeAll),
          { or: [{ title: { like: q } }, { employer: { like: q } }] },
        ],
      },
      sort: '-postedAt',
      page,
      limit: PAGE_SIZE,
      depth: 0,
    })
    groups.push({
      type: 'vacancy',
      totalDocs: res.totalDocs,
      results: res.docs.map((d) => {
        const doc = d as unknown as Record<string, unknown>
        const loc = (doc.locale as Locale) || opts.locale
        return {
          type: 'vacancy' as const,
          id: String(doc.id),
          locale: loc,
          title: String(doc.title || ''),
          snippet: truncate(String(doc.employer || '')),
          url: vacancyUrl(loc, (doc.country as never) || 'general', String(doc.slug || '')),
          country: doc.country as string,
          roleType: doc.roleType as string,
        }
      }),
    })
    maxPages = Math.max(maxPages, res.totalPages || 1)
    total += res.totalDocs
  }

  // Companies — name.
  if (types.includes('company')) {
    const res = await payload.find({
      collection: 'companies',
      where: {
        and: [
          { status: { equals: 'published' } },
          ...localeCond(opts.locale, includeAll),
          { or: [{ name: { like: q } }, { body: { like: q } }] },
        ],
      },
      sort: 'name',
      page,
      limit: PAGE_SIZE,
      depth: 0,
    })
    groups.push({
      type: 'company',
      totalDocs: res.totalDocs,
      results: res.docs.map((d) => {
        const doc = d as unknown as Record<string, unknown>
        const loc = (doc.locale as Locale) || opts.locale
        return {
          type: 'company' as const,
          id: String(doc.id),
          locale: loc,
          title: String(doc.name || ''),
          snippet: truncate(String(doc.headquarters || '')),
          url: companyUrl(loc, String(doc.slug || '')),
        }
      }),
    })
    maxPages = Math.max(maxPages, res.totalPages || 1)
    total += res.totalDocs
  }

  return { query: q, groups, totalPages: maxPages, page, total }
}
