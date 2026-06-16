import React from 'react'

import type { Locale } from '../../../../lib/enums'
import { t } from '../../../../lib/i18n'
import { homeUrl } from '../../../../lib/routes'
import { CategoryArchive } from '../../../../components/site/CategoryArchive'

// Quick MBA hub (PRD §3.1, §5) — lists its content (category 'quick-mba' if present).
export default async function QuickMbaPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale } = await params
  const sp = await searchParams
  const l = locale as Locale
  const other: Locale = l === 'ar' ? 'en' : 'ar'
  return (
    <CategoryArchive
      locale={l}
      categorySlug="quick-mba"
      title={t(l, 'quickMba')}
      basePath={`/${l}/quick-mba`}
      crumbs={[{ label: t(l, 'home'), href: homeUrl(l) }, { label: t(l, 'quickMba') }]}
      page={Number(sp.page) || 1}
      defaultAltHref={`/${other}/quick-mba`}
    />
  )
}
