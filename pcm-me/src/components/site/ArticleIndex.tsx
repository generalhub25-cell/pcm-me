import React from 'react'
import Link from 'next/link'

import type { Where } from 'payload'

import type { Locale } from '../../lib/enums'
import type { ArticleKind } from '../../lib/enums'
import { listPublished, getCategoryBySlug } from '../../lib/content'
import { getPayloadClient } from '../../lib/payload'
import { t } from '../../lib/i18n'
import { ArticleCard } from './Cards'
import { Pagination } from './Pagination'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'

/**
 * Shared Article/News/Reference index (PRD §5.2): paginated card list,
 * category filter, newest-first default sort.
 */
export const ArticleIndex: React.FC<{
  locale: Locale
  kind: ArticleKind
  basePath: string
  title: string
  crumbs: Crumb[]
  page: number
  categorySlug?: string
}> = async ({ locale, kind, basePath, title, crumbs, page, categorySlug }) => {
  const where: Where = { kind: { equals: kind } }
  let activeCategoryId: string | undefined
  if (categorySlug) {
    const cat = await getCategoryBySlug(locale, categorySlug)
    if (cat) {
      activeCategoryId = String(cat.id)
      where.category = { equals: activeCategoryId }
    }
  }

  const result = await listPublished('articles', locale, { where, page, limit: 12 })

  // Category filter options (published categories for this locale).
  const payload = await getPayloadClient()
  const cats = await payload.find({
    collection: 'categories',
    where: { and: [{ status: { equals: 'published' } }, { locale: { equals: locale } }] },
    sort: 'name',
    limit: 100,
    depth: 0,
  })

  return (
    <div>
      <Breadcrumbs items={crumbs} />
      <h1 className="page-title">{title}</h1>

      <nav className="nav__sub" aria-label={t(locale, 'filter')} style={{ marginBlockEnd: '1rem' }}>
        <Link href={basePath} aria-current={!categorySlug ? 'true' : undefined}>
          {t(locale, 'all')}
        </Link>
        {cats.docs.map((c) => {
          const slug = String((c as { slug?: string }).slug || '')
          return (
            <Link
              key={slug}
              href={`${basePath}?category=${slug}`}
              aria-current={categorySlug === slug ? 'true' : undefined}
            >
              {(c as { name?: string }).name}
            </Link>
          )
        })}
      </nav>

      {result.docs.length === 0 ? (
        <p className="empty-state">{t(locale, 'noResults')}</p>
      ) : (
        <div className="card-grid">
          {result.docs.map((d) => (
            <ArticleCard key={String(d.id)} doc={d as never} locale={locale} />
          ))}
        </div>
      )}

      <Pagination
        basePath={basePath}
        page={result.page || 1}
        totalPages={result.totalPages || 1}
        query={{ category: categorySlug }}
        labels={{ previous: t(locale, 'previous'), next: t(locale, 'next'), page: t(locale, 'page') }}
      />
    </div>
  )
}
