import React from 'react'
import { notFound } from 'next/navigation'

import type { Locale } from '../../../../../lib/enums'
import { t } from '../../../../../lib/i18n'
import { homeUrl, categoryUrl } from '../../../../../lib/routes'
import { getCategoryBySlug } from '../../../../../lib/content'
import { CategoryArchive } from '../../../../../components/site/CategoryArchive'
import { simpleMetadata } from '../../../../../lib/seoPages'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category_slug: string }>
}) {
  const { locale, category_slug } = await params
  const l = locale as Locale
  const cat = (await getCategoryBySlug(l, category_slug)) as { name?: string } | null
  return simpleMetadata({ locale: l, title: cat?.name || category_slug, path: categoryUrl(l, category_slug) })
}

// Category archive (PRD §3.1, §5).
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; category_slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale, category_slug } = await params
  const sp = await searchParams
  const l = locale as Locale
  const other: Locale = l === 'ar' ? 'en' : 'ar'

  const cat = (await getCategoryBySlug(l, category_slug)) as { name?: string } | null
  if (!cat) notFound()

  return (
    <CategoryArchive
      locale={l}
      categorySlug={category_slug}
      title={cat.name || category_slug}
      basePath={categoryUrl(l, category_slug)}
      crumbs={[{ label: t(l, 'home'), href: homeUrl(l) }, { label: cat.name || category_slug }]}
      page={Number(sp.page) || 1}
      showSubcategories
      altHrefBuilder={(s) => categoryUrl(other, s)}
      defaultAltHref={homeUrl(other)}
    />
  )
}
