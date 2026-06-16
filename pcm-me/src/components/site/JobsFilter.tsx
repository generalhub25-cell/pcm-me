import React from 'react'

import type { Locale } from '../../lib/enums'
import { COUNTRIES, ROLE_TYPES } from '../../lib/enums'
import { t, countryLabel, roleTypeLabel } from '../../lib/i18n'

/**
 * Jobs filter controls (PRD §5.4): country, role type, employer, keyword.
 * Plain GET form (works without JS); filters compose via query params.
 * The keyword box is wired to real search in Session 05.
 */
export const JobsFilter: React.FC<{
  locale: Locale
  action: string
  fixedCountry?: string
  current: { country?: string; roleType?: string; employer?: string; q?: string }
}> = ({ locale, action, fixedCountry, current }) => (
  <form className="nav__sub" method="get" action={action} style={{ gap: '0.75rem', marginBlockEnd: '1rem' }}>
    {!fixedCountry && (
      <label>
        {t(locale, 'country')}
        <select name="country" defaultValue={current.country || ''}>
          <option value="">{t(locale, 'all')}</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {countryLabel[c][locale]}
            </option>
          ))}
        </select>
      </label>
    )}
    <label>
      {t(locale, 'roleType')}
      <select name="roleType" defaultValue={current.roleType || ''}>
        <option value="">{t(locale, 'all')}</option>
        {ROLE_TYPES.map((r) => (
          <option key={r} value={r}>
            {roleTypeLabel[r][locale]}
          </option>
        ))}
      </select>
    </label>
    <label>
      {t(locale, 'employer')}
      <input type="text" name="employer" defaultValue={current.employer || ''} />
    </label>
    <label>
      {t(locale, 'keyword')}
      <input type="text" name="q" defaultValue={current.q || ''} />
    </label>
    <button type="submit" className="btn">
      {t(locale, 'filter')}
    </button>
  </form>
)
