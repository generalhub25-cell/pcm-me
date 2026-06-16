/**
 * Cookie-consent state (PRD §8.6). Stored in an essential first-party cookie
 * that persists the user's choice. Non-essential scripts/analytics must check
 * `analyticsAllowed()` before loading — nothing non-essential runs before the
 * user accepts (Session 08 CSP also blocks external script origins by default).
 */
export type ConsentValue = 'accepted' | 'rejected'
export const CONSENT_COOKIE = 'pcm_consent'
export const CONSENT_EVENT = 'pcm-open-consent'

export const getConsent = (): ConsentValue | null => {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`))
  const v = m ? decodeURIComponent(m[1]) : null
  return v === 'accepted' || v === 'rejected' ? v : null
}

export const setConsent = (value: ConsentValue): void => {
  if (typeof document === 'undefined') return
  const oneYear = 60 * 60 * 24 * 365
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${oneYear}; SameSite=Lax`
}

/** Gate for any non-essential/analytics script (none are loaded until true). */
export const analyticsAllowed = (): boolean => getConsent() === 'accepted'
