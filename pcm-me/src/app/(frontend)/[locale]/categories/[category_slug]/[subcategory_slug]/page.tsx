import React from 'react'
import { notFound } from 'next/navigation'

import type { Locale } from '../../../../../../lib/enums'
import { t } from '../../../../../../lib/i18n'
import { homeUrl, categoryUrl, subCategoryUrl } from '../../../../../../lib/routes'
import { getCategoryBySlug } from '../../../../../../lib/content'
import { CategoryArchive } from '../../../../../../components/site/CategoryArchive'

// Subcategory archive (PRD §3.1, §5).
export default async function SubCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; category_slug: string; subcategory_slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale, category_slug, subcategory_slug } = await params
  const sp = await searchParams
  const l = locale as Locale
  const other: Locale = l === 'ar' ? 'en' : 'ar'

  const parent = (await getCategoryBySlug(l, category_slug)) as { id?: string; name?: string } | null
  const sub = (await getCategoryBySlug(l, subcategory_slug)) as
    | { name?: string; parent?: string | { id?: string } }
    | null
  if (!parent || !sub) notFound()

  return (
    <CategoryArchive
      locale={l}
      categorySlug={subcategory_slug}
      title={sub.name || subcategory_slug}
      basePath={subCategoryUrl(l, category_slug, subcategory_slug)}
      crumbs={[
        { label: t(l, 'home'), href: homeUrl(l) },
        { label: parent.name || category_slug, href: categoryUrl(l, category_slug) },
        { label: sub.name || subcategory_slug },
      ]}
      page={Number(sp.page) || 1}
      defaultAltHref={homeUrl(other)}
    />
  )
}
