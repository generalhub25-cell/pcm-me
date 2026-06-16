'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ui } from '../../../lib/i18n'
import { isLocale } from '../../../lib/i18n'

/**
 * Localized 404 (PRD §3, acceptance #1). Rendered within the [locale] layout,
 * so document lang/dir are already correct; this picks the locale text from
 * the current path.
 */
export default function LocaleNotFound() {
  const pathname = usePathname() || '/ar'
  const seg = pathname.split('/')[1]
  const locale = isLocale(seg) ? seg : 'ar'
  return (
    <div style={{ paddingBlock: '3rem' }}>
      <h1 className="page-title">404 — {ui.notFound[locale]}</h1>
      <p>
        <Link href={`/${locale}`}>{ui.backHome[locale]}</Link>
      </p>
    </div>
  )
}
