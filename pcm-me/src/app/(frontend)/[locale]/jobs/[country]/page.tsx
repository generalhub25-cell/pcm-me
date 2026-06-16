import React from 'react'
import { notFound } from 'next/navigation'

import type { Locale } from '../../../../../lib/enums'
import { t, countryLabel } from '../../../../../lib/i18n'
import { homeUrl, jobsIndexUrl, jobsCountryUrl, countryFromRouteSlug } from '../../../../../lib/routes'
import { Breadcrumbs } from '../../../../../components/site/Breadcrumbs'
import { JobsList } from '../../../../../components/site/JobsList'

// Country jobs page = list pre-filtered by country (PRD §5.4).
export default async function CountryJobsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; country: string }>
  searchParams: Promise<{ page?: string; roleType?: string; employer?: string; q?: string }>
}) {
  const { locale, country } = await params
  const sp = await searchParams
  const l = locale as Locale
  const enumCountry = countryFromRouteSlug(country)
  if (!enumCountry) notFound()

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: t(l, 'home'), href: homeUrl(l) },
          { label: t(l, 'jobs'), href: jobsIndexUrl(l) },
          { label: countryLabel[enumCountry][l] },
        ]}
      />
      <h1 className="page-title">
        {t(l, 'jobs')} — {countryLabel[enumCountry][l]}
      </h1>
      <JobsList
        locale={l}
        basePath={jobsCountryUrl(l, enumCountry)}
        fixedCountry={enumCountry}
        page={Number(sp.page) || 1}
        filters={{ roleType: sp.roleType, employer: sp.employer, q: sp.q }}
      />
    </div>
  )
}
