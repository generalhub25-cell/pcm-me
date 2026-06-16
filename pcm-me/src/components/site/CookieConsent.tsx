'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import type { Locale } from '../../lib/enums'
import { getConsent, setConsent, CONSENT_EVENT } from '../../lib/consent'

const msg = {
  ar: {
    text: 'نستخدم ملفات تعريف ارتباط أساسية لتشغيل الموقع، وملفات تحليلات اختيارية بموافقتك فقط.',
    accept: 'قبول',
    reject: 'رفض',
    policy: 'سياسة ملفات تعريف الارتباط',
    label: 'إشعار ملفات تعريف الارتباط',
  },
  en: {
    text: 'We use essential cookies to run the site, and optional analytics cookies only with your consent.',
    accept: 'Accept',
    reject: 'Reject',
    policy: 'Cookie Policy',
    label: 'Cookie notice',
  },
}

/**
 * Cookie consent banner (PRD §8.6). Blocks non-essential cookies/analytics
 * until consent, persists the choice, offers accept/reject + a link to the
 * Cookie Policy, and supports re-consent (footer "Cookie settings" dispatches
 * CONSENT_EVENT). RTL/LTR via document dir; accessible (role, focus, contrast).
 */
export const CookieConsent: React.FC<{ locale: Locale; initialOpen?: boolean }> = ({
  locale,
  initialOpen = true,
}) => {
  const m = msg[locale]
  // Server passes initialOpen from the consent cookie, so the banner renders
  // in SSR on first visit (works without JS, accessible).
  const [open, setOpen] = useState(initialOpen)

  useEffect(() => {
    // Re-sync against the client cookie (e.g. set in another tab) and wire the
    // footer "Cookie settings" re-consent trigger.
    if (getConsent() !== null) setOpen(false)
    const reopen = () => setOpen(true)
    window.addEventListener(CONSENT_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_EVENT, reopen)
  }, [])

  if (!open) return null

  const choose = (v: 'accepted' | 'rejected') => {
    setConsent(v)
    setOpen(false)
  }

  return (
    <div
      role="dialog"
      aria-label={m.label}
      aria-live="polite"
      style={{
        position: 'fixed',
        insetInline: 0,
        insetBlockEnd: 0,
        zIndex: 1000,
        background: 'var(--color-fg)',
        color: 'var(--color-bg)',
        padding: 'var(--space-3)',
      }}
    >
      <div
        className="container"
        style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <p style={{ margin: 0, flex: '1 1 280px' }}>
          {m.text}{' '}
          <Link href={`/${locale}/cookie-policy`} style={{ color: 'var(--color-bg)', textDecoration: 'underline' }}>
            {m.policy}
          </Link>
        </p>
        <button type="button" className="btn" onClick={() => choose('accepted')}>
          {m.accept}
        </button>
        <button
          type="button"
          onClick={() => choose('rejected')}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            background: 'transparent',
            color: 'var(--color-bg)',
            border: '1px solid var(--color-bg)',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            font: 'inherit',
          }}
        >
          {m.reject}
        </button>
      </div>
    </div>
  )
}
