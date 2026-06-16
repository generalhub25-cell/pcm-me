import React from 'react'

import type { Locale } from '../../../../lib/enums'
import { t } from '../../../../lib/i18n'
import { interactionsUrl, homeUrl } from '../../../../lib/routes'
import { ArticleIndex } from '../../../../components/site/ArticleIndex'

// Interactions / Medicines index — Article kind=reference (PRD §3.1, OQ-7 default).
export default async function InteractionsPage({
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
      kind="reference"
      basePath={interactionsUrl(l)}
      title={t(l, 'interactions')}
      crumbs={[{ label: t(l, 'home'), href: homeUrl(l) }, { label: t(l, 'interactions') }]}
      page={Number(sp.page) || 1}
      categorySlug={sp.category}
    />
  )
}
