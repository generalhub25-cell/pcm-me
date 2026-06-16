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
