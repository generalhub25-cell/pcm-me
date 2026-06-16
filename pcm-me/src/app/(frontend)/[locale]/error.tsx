'use client'
import React from 'react'
import { usePathname } from 'next/navigation'

import { isLocale } from '../../../lib/i18n'

/**
 * Public error boundary (PRD §6.4, §8). Shows a clean, localized message and
 * never exposes stack traces or server paths to the client. The underlying
 * error goes to server-side logs only.
 */
const copy = {
  ar: { title: 'حدث خطأ ما', retry: 'إعادة المحاولة' },
  en: { title: 'Something went wrong', retry: 'Try again' },
}

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const pathname = usePathname() || '/ar'
  const seg = pathname.split('/')[1]
  const l = isLocale(seg) ? seg : 'ar'
  return (
    <div style={{ paddingBlock: '3rem' }}>
      <h1 className="page-title">{copy[l].title}</h1>
      <button type="button" className="btn" onClick={reset}>
        {copy[l].retry}
      </button>
    </div>
  )
}
