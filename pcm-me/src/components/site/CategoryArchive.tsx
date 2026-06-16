import React from 'react'
import Link from 'next/link'

import type { Locale } from '../../lib/enums'
import { getCategoryBySlug, listArticlesInCategory, findSibling } from '../../lib/content'
import { getPayloadClient } from '../../lib/payload'
import { t } from '../../lib/i18n'
import { subCategoryUrl } from '../../lib/routes'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'
import { ArticleCard } from './Cards'
import { Pagination } from './Pagination'
import { SetLangAlternate } from './LangAlternate'

/**
 * Category-archive / hub template (PRD §5, §3.1) shared by category pages,
 * skills tracks, Quick MBA, Immigration. Lists the category's published
 * articles; optionally lists subcategories. Renders an empty state (never an
 * error) when the category or its content is missing.
 */
export const CategoryArchive: React.FC<{
  locale: Locale
  categorySlug: string
  title: string
  basePath: string
  crumbs: Crumb[]
  page: number
  showSubcategories?: boolean
  altHrefBuilder?: (siblingSlug: string) => string
  defaultAltHref: string
}> = async ({
  locale,
  categorySlug,
  title,
  basePath,
  crumbs,
  page,
  showSubcategories,
  altHrefBuilder,
  defaultAltHref,
}) => {
  const cat = (await getCategoryBySlug(locale, categorySlug)) as
    | { id?: string; translationGroupId?: string }
    | null

  let altHref = defaultAltHref
  let subcats: { docs: { id: string; name?: string; slug?: string }[] } = { docs: [] }
  let articles: { docs: { id: string }[]; page?: number; totalPages?: number } = {
    docs: [],
    page: 1,
    totalPages: 1,
  }

  if (cat?.id) {
    if (altHrefBuilder && cat.translationGroupId) {
      const sib = (await findSibling('categories', cat.translationGroupId, locale)) as
        | { slug?: string }
        | null
      if (sib?.slug) altHref = altHrefBuilder(sib.slug)
    }
    if (showSubcategories) {
      const payload = await getPayloadClient()
      subcats = (await payload.find({
        collection: 'categories',
        where: {
          and: [
            { parent: { equals: String(cat.id) } },
            { locale: { equals: locale } },
            { status: { equals: 'published' } },
          ],
        },
        sort: 'name',
        limit: 100,
        depth: 0,
      })) as never
    }
    articles = (await listArticlesInCategory(locale, String(cat.id), { page })) as never
  }

  return (
    <div>
      <SetLangAlternate href={altHref} />
      <Breadcrumbs items={crumbs} />
      <h1 className="page-title">{title}</h1>

      {subcats.docs.length > 0 && (
        <nav className="nav__sub" style={{ marginBlockEnd: '1rem' }}>
          {subcats.docs.map((s) => (
            <Link key={s.id} href={subCategoryUrl(locale, categorySlug, String(s.slug))}>
              {s.name}
            </Link>
          ))}
        </nav>
      )}

      {articles.docs.length === 0 ? (
        <p className="empty-state">{t(locale, 'noResults')}</p>
      ) : (
        <div className="card-grid">
          {articles.docs.map((d) => (
            <ArticleCard key={String(d.id)} doc={d as never} locale={locale} />
          ))}
        </div>
      )}

      <Pagination
        basePath={basePath}
        page={articles.page || 1}
        totalPages={articles.totalPages || 1}
        labels={{ previous: t(locale, 'previous'), next: t(locale, 'next'), page: t(locale, 'page') }}
      />
    </div>
  )
}
