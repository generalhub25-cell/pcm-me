import React from 'react'

import type { Locale } from '../../../../lib/enums'
import { t } from '../../../../lib/i18n'
import { homeUrl } from '../../../../lib/routes'
import { CategoryArchive } from '../../../../components/site/CategoryArchive'

// Immigration hub (PRD §3.1, §5) — lists its content (category 'immigration' if present).
export default async function ImmigrationPage({
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
      categorySlug="immigration"
      title={t(l, 'immigration')}
      basePath={`/${l}/immigration`}
      crumbs={[{ label: t(l, 'home'), href: homeUrl(l) }, { label: t(l, 'immigration') }]}
      page={Number(sp.page) || 1}
      defaultAltHref={`/${other}/immigration`}
    />
  )
}
