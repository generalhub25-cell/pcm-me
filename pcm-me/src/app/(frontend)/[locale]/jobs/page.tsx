import React from 'react'

import type { Locale } from '../../../../lib/enums'
import { t } from '../../../../lib/i18n'
import { jobsIndexUrl, homeUrl } from '../../../../lib/routes'
import { Breadcrumbs } from '../../../../components/site/Breadcrumbs'
import { JobsList } from '../../../../components/site/JobsList'
import { simpleMetadata } from '../../../../lib/seoPages'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  return simpleMetadata({ locale: l, title: t(l, 'jobs'), path: jobsIndexUrl(l) })
}

// Jobs index (PRD §3.1, §5.4).
export default async function JobsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string; country?: string; roleType?: string; employer?: string; q?: string }>
}) {
  const { locale } = await params
  const sp = await searchParams
  const l = locale as Locale
  return (
    <div>
      <Breadcrumbs items={[{ label: t(l, 'home'), href: homeUrl(l) }, { label: t(l, 'jobs') }]} />
      <h1 className="page-title">{t(l, 'jobs')}</h1>
      <JobsList
        locale={l}
        basePath={jobsIndexUrl(l)}
        page={Number(sp.page) || 1}
        filters={{ country: sp.country, roleType: sp.roleType, employer: sp.employer, q: sp.q }}
      />
    </div>
  )
}
