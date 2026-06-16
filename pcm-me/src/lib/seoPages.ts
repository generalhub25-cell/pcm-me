import type { Metadata } from 'next'

import type { Country, Locale } from './enums'
import { findBySlug, findSibling } from './content'
import { buildMetadata } from './seo'
import {
  absoluteUrl,
  canonicalArticle,
  canonicalVacancy,
  canonicalCompany,
} from './canonical'
import { swapLocaleInPath } from './routes'

const other = (l: Locale): Locale => (l === 'ar' ? 'en' : 'ar')

const imgUrl = (rel: unknown): string | undefined => {
  if (rel && typeof rel === 'object' && (rel as { url?: string }).url) {
    return absoluteUrl((rel as { url: string }).url)
  }
  return undefined
}

const ogFrom = (doc: Record<string, unknown>): string | undefined =>
  imgUrl(doc.ogImage) || imgUrl(doc.heroImage) || imgUrl(doc.logo)

/** Metadata for index/static pages that share the same path across locales. */
export const simpleMetadata = (args: {
  locale: Locale
  title: string
  path: string
  description?: string
}): Metadata => {
  const canonical = absoluteUrl(args.path)
  const o = other(args.locale)
  return buildMetadata({
    locale: args.locale,
    title: args.title,
    description: args.description,
    canonical,
    alternates: {
      [args.locale]: canonical,
      [o]: absoluteUrl(swapLocaleInPath(args.path, o)),
    } as { ar?: string; en?: string },
  })
}

export const articleMetadata = async (locale: Locale, slug: string): Promise<Metadata> => {
  const doc = await findBySlug('articles', locale, slug)
  if (!doc) return { title: 'PCM' }
  const kind = doc.kind as string | undefined
  const canonical = canonicalArticle(locale, kind, slug)
  const sib = (await findSibling('articles', doc.translationGroupId as string, locale)) as
    | { slug?: string; kind?: string }
    | null
  const o = other(locale)
  const alternates: { ar?: string; en?: string } = { [locale]: canonical } as never
  if (sib?.slug) alternates[o] = canonicalArticle(o, sib.kind, sib.slug)
  return buildMetadata({
    locale,
    title: String(doc.metaTitle || doc.title || ''),
    description: String(doc.metaDescription || doc.excerpt || '') || undefined,
    canonical,
    ogImageUrl: ogFrom(doc),
    alternates,
  })
}

export const vacancyMetadata = async (
  locale: Locale,
  country: Country,
  slug: string,
): Promise<Metadata> => {
  const doc = await findBySlug('vacancies', locale, slug)
  if (!doc) return { title: 'PCM' }
  const canonical = canonicalVacancy(locale, country, slug)
  const sib = (await findSibling('vacancies', doc.translationGroupId as string, locale)) as
    | { slug?: string; country?: string }
    | null
  const o = other(locale)
  const alternates: { ar?: string; en?: string } = { [locale]: canonical } as never
  if (sib?.slug && sib.country) alternates[o] = canonicalVacancy(o, sib.country as Country, sib.slug)
  return buildMetadata({
    locale,
    title: String(doc.metaTitle || doc.title || ''),
    description: String(doc.metaDescription || '') || undefined,
    canonical,
    ogImageUrl: ogFrom(doc),
    alternates,
  })
}

export const companyMetadata = async (locale: Locale, slug: string): Promise<Metadata> => {
  const doc = await findBySlug('companies', locale, slug)
  if (!doc) return { title: 'PCM' }
  const canonical = canonicalCompany(locale, slug)
  const sib = (await findSibling('companies', doc.translationGroupId as string, locale)) as
    | { slug?: string }
    | null
  const o = other(locale)
  const alternates: { ar?: string; en?: string } = { [locale]: canonical } as never
  if (sib?.slug) alternates[o] = canonicalCompany(o, sib.slug)
  return buildMetadata({
    locale,
    title: String(doc.metaTitle || doc.name || ''),
    description: String(doc.metaDescription || '') || undefined,
    canonical,
    ogImageUrl: ogFrom(doc),
    alternates,
  })
}
