import React from 'react'

import type { Locale } from '../../../../lib/enums'
import { t } from '../../../../lib/i18n'
import { homeUrl, searchUrl } from '../../../../lib/routes'
import { Breadcrumbs } from '../../../../components/site/Breadcrumbs'

/**
 * Search shell (PRD §3.1) — Session 05 fills in the backend + results.
 * This renders the search entry/form only.
 */
export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { locale } = await params
  const sp = await searchParams
  const l = locale as Locale
  return (
    <div>
      <Breadcrumbs items={[{ label: t(l, 'home'), href: homeUrl(l) }, { label: t(l, 'search') }]} />
      <h1 className="page-title">{t(l, 'search')}</h1>
      <form method="get" action={searchUrl(l)} className="form" data-search-shell>
        <label>
          {t(l, 'keyword')}
          <input type="search" name="q" defaultValue={sp.q || ''} />
        </label>
        <button type="submit" className="btn">
          {t(l, 'search')}
        </button>
      </form>
      {/* Session 05 renders results here. */}
    </div>
  )
}
