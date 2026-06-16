import { siteUrl } from './canonical'
import { countryLabel } from './i18n'
import type { Locale } from './enums'

/**
 * JSON-LD structured-data builders (PRD §9.3). All output must validate.
 */

export const organizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PCM',
  url: siteUrl(),
})

export const articleJsonLd = (args: {
  kind: string | undefined
  headline: string
  description?: string
  url: string
  imageUrl?: string
  datePublished?: string
  authorName?: string
}) => {
  const type = args.kind === 'news' ? 'NewsArticle' : 'Article'
  return {
    '@context': 'https://schema.org',
    '@type': type,
    headline: args.headline,
    ...(args.description ? { description: args.description } : {}),
    ...(args.imageUrl ? { image: [args.imageUrl] } : {}),
    ...(args.datePublished ? { datePublished: args.datePublished } : {}),
    ...(args.authorName ? { author: { '@type': 'Person', name: args.authorName } } : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': args.url },
    publisher: { '@type': 'Organization', name: 'PCM' },
  }
}

export const jobPostingJsonLd = (args: {
  title: string
  description: string
  datePosted?: string
  validThrough?: string
  employer?: string
  location?: string
  country?: string
  locale: Locale
}) => {
  const countryName = args.country ? countryLabel[args.country]?.[args.locale] || args.country : undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: args.title,
    description: args.description || args.title,
    ...(args.datePosted ? { datePosted: args.datePosted } : {}),
    ...(args.validThrough ? { validThrough: args.validThrough } : {}),
    hiringOrganization: {
      '@type': 'Organization',
      name: args.employer || 'PCM',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        ...(args.location ? { addressLocality: args.location } : {}),
        ...(countryName ? { addressCountry: countryName } : {}),
      },
    },
  }
}

export const breadcrumbJsonLd = (items: { label: string; url?: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.label,
    ...(item.url ? { item: item.url } : {}),
  })),
})
