import React from 'react'

import type { Locale } from '../../../../../lib/enums'
import { t, skillsTrackLabel } from '../../../../../lib/i18n'
import { homeUrl, skillsTrackUrl } from '../../../../../lib/routes'
import { CategoryArchive } from '../../../../../components/site/CategoryArchive'

// Skills track archive (PRD §3.1) — skills tracks are a Category subtree.
export default async function SkillsTrackPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; track_slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale, track_slug } = await params
  const sp = await searchParams
  const l = locale as Locale
  const other: Locale = l === 'ar' ? 'en' : 'ar'
  const title = skillsTrackLabel[track_slug]?.[l] || track_slug

  return (
    <CategoryArchive
      locale={l}
      categorySlug={track_slug}
      title={`${t(l, 'skills')} — ${title}`}
      basePath={skillsTrackUrl(l, track_slug)}
      crumbs={[{ label: t(l, 'home'), href: homeUrl(l) }, { label: `${t(l, 'skills')} — ${title}` }]}
      page={Number(sp.page) || 1}
      altHrefBuilder={(s) => skillsTrackUrl(other, s)}
      defaultAltHref={skillsTrackUrl(other, track_slug)}
    />
  )
}
