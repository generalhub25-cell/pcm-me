import React from 'react'

import type { Locale } from '../../../../lib/enums'
import { t } from '../../../../lib/i18n'
import { companiesIndexUrl, homeUrl } from '../../../../lib/routes'
import { listPublished } from '../../../../lib/content'
import { Breadcrumbs } from '../../../../components/site/Breadcrumbs'
import { CompanyCard } from '../../../../components/site/Cards'
import { Pagination } from '../../../../components/site/Pagination'
import { simpleMetadata } from '../../../../lib/seoPages'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  return simpleMetadata({ locale: l, title: t(l, 'companies'), path: companiesIndexUrl(l) })
}

// Companies index (PRD §5.x).
export default async function CompaniesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale } = await params
  const sp = await searchParams
  const l = locale as Locale
  const result = await listPublished('companies', l, { page: Number(sp.page) || 1, sort: 'name' })

  return (
    <div>
      <Breadcrumbs items={[{ label: t(l, 'home'), href: homeUrl(l) }, { label: t(l, 'companies') }]} />
      <h1 className="page-title">{t(l, 'companies')}</h1>
      {result.docs.length === 0 ? (
        <p className="empty-state">{t(l, 'noResults')}</p>
      ) : (
        <div className="card-grid">
          {result.docs.map((d) => (
            <CompanyCard key={String(d.id)} doc={d as never} locale={l} />
          ))}
        </div>
      )}
      <Pagination
        basePath={companiesIndexUrl(l)}
        page={result.page || 1}
        totalPages={result.totalPages || 1}
        labels={{ previous: t(l, 'previous'), next: t(l, 'next'), page: t(l, 'page') }}
      />
    </div>
  )
}
