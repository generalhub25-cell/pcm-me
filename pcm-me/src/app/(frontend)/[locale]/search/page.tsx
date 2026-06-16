import React from 'react'
import Link from 'next/link'

import type { Locale } from '../../../../lib/enums'
import { t, countryLabel, roleTypeLabel } from '../../../../lib/i18n'
import { homeUrl, searchUrl } from '../../../../lib/routes'
import { search, type SearchType } from '../../../../lib/search'
import { Breadcrumbs } from '../../../../components/site/Breadcrumbs'
import { Pagination } from '../../../../components/site/Pagination'
import { simpleMetadata } from '../../../../lib/seoPages'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  return simpleMetadata({ locale: l, title: t(l, 'search'), path: searchUrl(l) })
}

const typeLabel = (type: SearchType, l: Locale): string =>
  type === 'article' ? t(l, 'typeArticle') : type === 'vacancy' ? t(l, 'typeVacancy') : t(l, 'typeCompany')

/**
 * Search results (PRD §5.7). Fills the Session 03 shell. Grouped by type;
 * each result links to its canonical localized URL; vacancies show
 * country/role_type. Locale-scoped by default with a both-locales toggle.
 */
export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; all?: string; page?: string }>
}) {
  const { locale } = await params
  const sp = await searchParams
  const l = locale as Locale
  const q = (sp.q || '').trim()
  const includeAll = sp.all === '1'
  const page = Number(sp.page) || 1

  const res = q
    ? await search(q, { locale: l, includeAllLocales: includeAll, page })
    : null

  return (
    <div>
      <Breadcrumbs items={[{ label: t(l, 'home'), href: homeUrl(l) }, { label: t(l, 'search') }]} />
      <h1 className="page-title">{t(l, 'search')}</h1>

      <form method="get" action={searchUrl(l)} className="form" data-search-shell>
        <label>
          {t(l, 'keyword')}
          <input type="search" name="q" defaultValue={q} />
        </label>
        <label style={{ flexDirection: 'row', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input type="checkbox" name="all" value="1" defaultChecked={includeAll} />
          <span>{t(l, 'searchAllLocales')}</span>
        </label>
        <button type="submit" className="btn">
          {t(l, 'search')}
        </button>
      </form>

      {!q && <p className="empty-state">{t(l, 'emptyQuery')}</p>}

      {q && res && res.total === 0 && <p className="empty-state">{t(l, 'noResults')}</p>}

      {q && res && res.total > 0 && (
        <>
          <p className="muted">
            {res.total} {t(l, 'resultsCount')}
          </p>
          {res.groups
            .filter((g) => g.results.length > 0)
            .map((g) => (
              <section key={g.type} className="section">
                <h2 className="section__title">
                  {typeLabel(g.type, l)} <span className="muted">({g.totalDocs})</span>
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.75rem' }}>
                  {g.results.map((r) => (
                    <li key={`${r.type}-${r.id}`} className="card">
                      <span className="card__meta" style={{ textTransform: 'uppercase' }}>
                        {typeLabel(r.type, l)}
                        {includeAll ? ` · ${r.locale}` : ''}
                      </span>
                      <h3 style={{ margin: '0.25rem 0' }}>
                        <Link href={r.url}>{r.title}</Link>
                      </h3>
                      {r.snippet && <p className="muted">{r.snippet}</p>}
                      {r.type === 'vacancy' && (
                        <div className="card__meta">
                          {[
                            r.country ? countryLabel[r.country]?.[l] : '',
                            r.roleType ? roleTypeLabel[r.roleType]?.[l] : '',
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

          <Pagination
            basePath={searchUrl(l)}
            page={res.page}
            totalPages={res.totalPages}
            query={{ q, all: includeAll ? '1' : undefined }}
            labels={{ previous: t(l, 'previous'), next: t(l, 'next'), page: t(l, 'page') }}
          />
        </>
      )}
    </div>
  )
}
