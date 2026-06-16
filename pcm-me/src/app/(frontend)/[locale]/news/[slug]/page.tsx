import React from 'react'

import type { Locale } from '../../../../../lib/enums'
import { t } from '../../../../../lib/i18n'
import { newsIndexUrl } from '../../../../../lib/routes'
import { ArticleDetail } from '../../../../../components/site/ArticleDetail'

// News detail (PRD §5.3).
export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const l = locale as Locale
  return <ArticleDetail locale={l} slug={slug} indexLabel={t(l, 'news')} indexHref={newsIndexUrl(l)} />
}
