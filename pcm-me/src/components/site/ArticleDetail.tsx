import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import type { Locale } from '../../lib/enums'
import { findBySlug, findSibling, listPublished } from '../../lib/content'
import { t } from '../../lib/i18n'
import { articleDetailUrl, homeUrl } from '../../lib/routes'
import { Breadcrumbs } from './Breadcrumbs'
import { Body } from './Body'
import { ShareLinks } from './ShareLinks'
import { ArticleCard } from './Cards'
import { SetLangAlternate } from './LangAlternate'
import { imageProps } from './media'
import { OptimizedImage } from './OptimizedImage'
import { JsonLd } from '../seo/JsonLd'
import { articleJsonLd } from '../../lib/jsonld'
import { canonicalArticle, absoluteUrl } from '../../lib/canonical'

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

/**
 * Article / News detail (PRD §5.3): title, author, published_at, category,
 * hero image, rich-text body, tags, related content, social share. Leaves a
 * JSON-LD slot for Session 06 and declares the language-switcher target
 * (translated sibling, else other-locale home).
 */
export const ArticleDetail: React.FC<{
  locale: Locale
  slug: string
  indexLabel: string
  indexHref: string
}> = async ({ locale, slug, indexLabel, indexHref }) => {
  const doc = (await findBySlug('articles', locale, slug)) as
    | (Record<string, unknown> & {
        title?: string
        kind?: string
        translationGroupId?: string
        category?: { id?: string; name?: string }
        author?: { name?: string }
        tags?: { id?: string; name?: string }[]
        publishedAt?: string
        heroImage?: unknown
        body?: unknown
      })
    | null
  if (!doc) notFound()

  const other: Locale = locale === 'ar' ? 'en' : 'ar'
  const sibling = (await findSibling('articles', doc.translationGroupId, locale)) as
    | { slug?: string; kind?: string }
    | null
  const altHref = sibling?.slug
    ? articleDetailUrl(other, sibling.kind, sibling.slug)
    : homeUrl(other)

  const hero = imageProps(doc.heroImage as never, locale)

  // Related: same category, other published articles.
  const categoryId = doc.category?.id ? String(doc.category.id) : undefined
  const related = categoryId
    ? await listPublished('articles', locale, {
        where: { and: [{ category: { equals: categoryId } }, { id: { not_equals: String(doc.id) } }] },
        limit: 3,
      })
    : { docs: [] as never[] }

  return (
    <article>
      <SetLangAlternate href={altHref} />
      <Breadcrumbs
        items={[
          { label: t(locale, 'home'), href: homeUrl(locale) },
          { label: indexLabel, href: indexHref },
          { label: doc.title || '' },
        ]}
      />

      <JsonLd
        data={articleJsonLd({
          kind: doc.kind,
          headline: doc.title || '',
          description: (doc.excerpt as string) || undefined,
          url: canonicalArticle(locale, doc.kind, slug),
          imageUrl: hero ? absoluteUrl(hero.src) : undefined,
          datePublished: doc.publishedAt,
          authorName: doc.author?.name,
        })}
      />

      <h1 className="page-title">{doc.title}</h1>
      <div className="card__meta">
        {[
          doc.author?.name || '',
          fmtDate(doc.publishedAt, locale),
          doc.category?.name || '',
        ]
          .filter(Boolean)
          .join(' · ')}
      </div>

      {hero && (
        <OptimizedImage
          src={hero.src}
          alt={hero.alt}
          width={hero.width}
          height={hero.height}
          priority
          sizes="(max-width: 768px) 100vw, 800px"
          style={{ borderRadius: 8, marginBlock: '1rem' }}
        />
      )}

      <Body data={doc.body} />

      {Array.isArray(doc.tags) && doc.tags.length > 0 && (
        <div className="card__meta" style={{ marginBlockStart: '1rem' }}>
          {doc.tags.map((tag) => (
            <span key={String(tag.id)} style={{ marginInlineEnd: 8 }}>
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      <ShareLinks label={t(locale, 'social')} />

      {related.docs.length > 0 && (
        <section className="section">
          <h2 className="section__title">{t(locale, 'readMore')}</h2>
          <div className="card-grid">
            {related.docs.map((d) => (
              <ArticleCard key={String((d as { id: string }).id)} doc={d as never} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <p>
        <Link href={indexHref}>← {indexLabel}</Link>
      </p>
    </article>
  )
}
