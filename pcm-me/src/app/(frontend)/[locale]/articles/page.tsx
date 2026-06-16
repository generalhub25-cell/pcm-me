import React from 'react'

import type { Locale } from '../../../../lib/enums'
import { t } from '../../../../lib/i18n'
import { articlesIndexUrl, homeUrl } from '../../../../lib/routes'
import { ArticleIndex } from '../../../../components/site/ArticleIndex'
import { simpleMetadata } from '../../../../lib/seoPages'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  return simpleMetadata({ locale: l, title: t(l, 'articles'), path: articlesIndexUrl(l) })
}

// Articles index — Article kind=scientific (PRD §3.1, §5.2).
export default async function ArticlesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string; category?: string }>
}) {
  const { locale } = await params
  const sp = await searchParams
  const l = locale as Locale
  return (
    <ArticleIndex
      locale={l}
      kind="scientific"
      basePath={articlesIndexUrl(l)}
      title={t(l, 'articles')}
      crumbs={[{ label: t(l, 'home'), href: homeUrl(l) }, { label: t(l, 'articles') }]}
      page={Number(sp.page) || 1}
      categorySlug={sp.category}
    />
  )
}
