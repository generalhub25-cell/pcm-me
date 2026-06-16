'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import type { Locale } from '../../lib/enums'
import { swapLocaleInPath } from '../../lib/routes'
import { useLangAlternate } from './LangAlternate'

/**
 * Language switcher (PRD §3 header #4). Lands on the translated equivalent
 * when a page has declared one (SetLangAlternate); otherwise swaps the locale
 * segment of the current path. The target URL is reused by Session 06 for
 * hreflang.
 */
export const LanguageSwitcher: React.FC<{ locale: Locale; label: string }> = ({
  locale,
  label,
}) => {
  const pathname = usePathname() || `/${locale}`
  const other: Locale = locale === 'ar' ? 'en' : 'ar'
  const { alternateHref } = useLangAlternate()
  const href = alternateHref || swapLocaleInPath(pathname, other)
  return (
    <Link href={href} hrefLang={other} aria-label={label}>
      {label}
    </Link>
  )
}
