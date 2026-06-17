import React from 'react'
import Link from 'next/link'

import type { Locale } from '../../lib/enums'
import { countryLabel, roleTypeLabel } from '../../lib/i18n'
import { articleDetailUrl, companyUrl, vacancyUrl } from '../../lib/routes'
import { imageProps } from './media'
import { OptimizedImage } from './OptimizedImage'

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

// Plain-text excerpt from a Lexical rich-text value (for the vacancy card
// summary). Returns '' when there is no description/body (omit gracefully).
const lexicalToText = (node: unknown): string => {
  if (!node || typeof node !== 'object') return ''
  const n = node as { text?: string; children?: unknown[] }
  if (typeof n.text === 'string') return n.text
  if (Array.isArray(n.children)) return n.children.map(lexicalToText).join(' ')
  return ''
}
const summarize = (rich: unknown, max = 140): string => {
  if (!rich || typeof rich !== 'object') return ''
  const text = lexicalToText((rich as { root?: unknown }).root).replace(/\s+/g, ' ').trim()
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}

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
        <OptimizedImage src={img.src} alt={img.alt} width={img.width} height={img.height} style={{ borderRadius: 6 }} />
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
  description?: unknown
}

export const VacancyCard: React.FC<{ doc: VacancyDoc; locale: Locale }> = ({ doc, locale }) => {
  const summary = summarize(doc.description)
  return (
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
      {summary && <p className="muted">{summary}</p>}
    </article>
  )
}

type CompanyDoc = { name?: string; slug?: string; headquarters?: string; logo?: unknown }

export const CompanyCard: React.FC<{ doc: CompanyDoc; locale: Locale }> = ({ doc, locale }) => {
  const img = imageProps(doc.logo as never, locale)
  return (
    <article className="card">
      {img && (
        <OptimizedImage src={img.src} alt={img.alt} width={img.width} height={img.height} style={{ maxHeight: 60, width: 'auto' }} />
      )}
      <h3>
        <Link href={companyUrl(locale, doc.slug || '')}>{doc.name}</Link>
      </h3>
      {doc.headquarters && <div className="card__meta">{doc.headquarters}</div>}
    </article>
  )
}
