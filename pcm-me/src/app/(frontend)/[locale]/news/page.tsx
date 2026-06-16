import React from 'react'

import type { Locale } from '../../../../lib/enums'
import { t } from '../../../../lib/i18n'
import { newsIndexUrl, homeUrl } from '../../../../lib/routes'
import { ArticleIndex } from '../../../../components/site/ArticleIndex'

// News index — Article kind=news (PRD §3.1, §5.2).
export default async function NewsPage({
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
      kind="news"
      basePath={newsIndexUrl(l)}
      title={t(l, 'news')}
      crumbs={[{ label: t(l, 'home'), href: homeUrl(l) }, { label: t(l, 'news') }]}
      page={Number(sp.page) || 1}
      categorySlug={sp.category}
    />
  )
}
