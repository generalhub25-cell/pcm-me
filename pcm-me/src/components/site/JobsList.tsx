import React from 'react'

import type { Locale } from '../../lib/enums'
import type { Where } from 'payload'
import { listPublished } from '../../lib/content'
import { t } from '../../lib/i18n'
import { VacancyCard } from './Cards'
import { JobsFilter } from './JobsFilter'
import { Pagination } from './Pagination'

/**
 * Shared jobs listing (PRD §5.4). Filters compose (country + role_type +
 * employer). Country page passes a fixed country. Keyword is wired in
 * Session 05. Missing vacancy fields render empty, never as errors.
 */
export const JobsList: React.FC<{
  locale: Locale
  basePath: string
  fixedCountry?: string
  page: number
  filters: { country?: string; roleType?: string; employer?: string; q?: string }
}> = async ({ locale, basePath, fixedCountry, page, filters }) => {
  const conditions: Where[] = []
  const country = fixedCountry || filters.country
  if (country) conditions.push({ country: { equals: country } })
  if (filters.roleType) conditions.push({ roleType: { equals: filters.roleType } })
  if (filters.employer) conditions.push({ employer: { like: filters.employer } })
  // Keyword filter (PRD §5.4 / Session 05) — composes with the filters above.
  if (filters.q && filters.q.trim()) {
    conditions.push({ or: [{ title: { like: filters.q } }, { employer: { like: filters.q } }] })
  }

  const where: Where | undefined = conditions.length ? { and: conditions } : undefined
  const result = await listPublished('vacancies', locale, {
    where,
    page,
    limit: 12,
    sort: '-postedAt',
  })

  return (
    <div>
      <JobsFilter
        locale={locale}
        action={basePath}
        fixedCountry={fixedCountry}
        current={filters}
      />
      {result.docs.length === 0 ? (
        <p className="empty-state">{t(locale, 'noResults')}</p>
      ) : (
        <div className="card-grid">
          {result.docs.map((d) => (
            <VacancyCard key={String(d.id)} doc={d as never} locale={locale} />
          ))}
        </div>
      )}
      <Pagination
        basePath={basePath}
        page={result.page || 1}
        totalPages={result.totalPages || 1}
        query={{
          country: fixedCountry ? undefined : filters.country,
          roleType: filters.roleType,
          employer: filters.employer,
          q: filters.q,
        }}
        labels={{ previous: t(locale, 'previous'), next: t(locale, 'next'), page: t(locale, 'page') }}
      />
    </div>
  )
}
