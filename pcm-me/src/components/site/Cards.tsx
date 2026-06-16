import React from 'react'
import Link from 'next/link'

import type { Locale } from '../../lib/enums'
import { countryLabel, roleTypeLabel } from '../../lib/i18n'
import { articleDetailUrl, companyUrl, vacancyUrl } from '../../lib/routes'
import { imageProps } from './media'

// Defensive date formatting — missing/invalid dates render empty (PRD §6.4 fix).
const fmtDate = (value: unknown, locale: Locale): string => {
  if (!value) return ''
  const d = new Date(String(value))
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const catName = (cat: unknown): string =>
  cat && typeof cat === 'object' ? String((cat as { name?: string }).name || '') : ''

const authorName = (a: unknown): string =>
  a && typeof a === 'object' ? String((a as { name?: string }).name || '') : ''

type ArticleDoc = {
  title?: string
  excerpt?: string
  slug?: string
  kind?: string
  publishedAt?: string
  category?: unknown
  author?: unknown
  heroImage?: unknown
}

export const ArticleCard: React.FC<{ doc: ArticleDoc; locale: Locale }> = ({ doc, locale }) => {
  const img = imageProps(doc.heroImage as never, locale)
  return (
    <article className="card">
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img.src} alt={img.alt} width={img.width} height={img.height} style={{ maxWidth: '100%', height: 'auto', borderRadius: 6 }} />
      )}
      <h3>
        <Link href={articleDetailUrl(locale, doc.kind, doc.slug || '')}>{doc.title}</Link>
      </h3>
      {doc.excerpt && <p className="muted">{doc.excerpt}</p>}
      <div className="card__meta">
        {[catName(doc.category), fmtDate(doc.publishedAt, locale), authorName(doc.author)]
          .filter(Boolean)
          .join(' · ')}
      </div>
    </article>
  )
}

type VacancyDoc = {
  title?: string
  employer?: string
  slug?: string
  country?: string
  roleType?: string
  postedAt?: string
}

export const VacancyCard: React.FC<{ doc: VacancyDoc; locale: Locale }> = ({ doc, locale }) => (
  <article className="card">
    <h3>
      <Link href={vacancyUrl(locale, (doc.country as never) || 'general', doc.slug || '')}>
        {doc.title}
      </Link>
    </h3>
    <div className="card__meta">
      {[
        doc.employer || '',
        doc.country ? countryLabel[doc.country]?.[locale] : '',
        doc.roleType ? roleTypeLabel[doc.roleType]?.[locale] : '',
        fmtDate(doc.postedAt, locale),
      ]
        .filter(Boolean)
        .join(' · ')}
    </div>
  </article>
)

type CompanyDoc = { name?: string; slug?: string; headquarters?: string; logo?: unknown }

export const CompanyCard: React.FC<{ doc: CompanyDoc; locale: Locale }> = ({ doc, locale }) => {
  const img = imageProps(doc.logo as never, locale)
  return (
    <article className="card">
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img.src} alt={img.alt} width={img.width} height={img.height} style={{ maxHeight: 60, width: 'auto' }} />
      )}
      <h3>
        <Link href={companyUrl(locale, doc.slug || '')}>{doc.name}</Link>
      </h3>
      {doc.headquarters && <div className="card__meta">{doc.headquarters}</div>}
    </article>
  )
}
