import type { Metadata } from 'next'

import type { Locale } from './enums'
import { DEFAULT_LOCALE } from './enums'
import { absoluteUrl } from './canonical'

const SITE_NAME = 'PCM'
const SUFFIX = ` | ${SITE_NAME}`

/**
 * Per-page, per-locale metadata (PRD §9.2, §9.4). Builds <title> (with site
 * suffix), description, canonical, OG/Twitter, and hreflang alternates
 * (ar/en + x-default → ROOT_REDIRECT). Used by every public page's
 * generateMetadata.
 */
export const buildMetadata = (args: {
  locale: Locale
  title: string
  description?: string
  canonical: string // absolute
  ogImageUrl?: string // absolute
  alternates?: { ar?: string; en?: string } // absolute language URLs
}): Metadata => {
  const title = args.title.endsWith(SITE_NAME) ? args.title : `${args.title}${SUFFIX}`
  const images = args.ogImageUrl ? [{ url: args.ogImageUrl }] : undefined

  const languages: Record<string, string> = {
    'x-default': absoluteUrl(`/${DEFAULT_LOCALE}`),
  }
  if (args.alternates?.ar) languages.ar = args.alternates.ar
  if (args.alternates?.en) languages.en = args.alternates.en

  return {
    title,
    description: args.description,
    alternates: {
      canonical: args.canonical,
      languages,
    },
    openGraph: {
      title,
      description: args.description,
      url: args.canonical,
      siteName: SITE_NAME,
      type: 'website',
      locale: args.locale,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: args.description,
      ...(images ? { images } : {}),
    },
  }
}
