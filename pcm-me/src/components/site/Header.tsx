import React from 'react'
import Link from 'next/link'

import type { Locale } from '../../lib/enums'
import { t } from '../../lib/i18n'
import { homeUrl, searchUrl } from '../../lib/routes'
import { buildNav } from './navData'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileNav } from './MobileNav'

/**
 * Site header (PRD §4.2): logo → home, primary nav (+ sub-nav), search entry,
 * language switcher. Mirrors automatically under RTL via document dir.
 */
export const Header: React.FC<{ locale: Locale }> = ({ locale }) => {
  const nav = buildNav(locale)
  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Link href={homeUrl(locale)} className="site-header__logo">
          {t(locale, 'siteName')}
        </Link>

        <nav className="nav nav--desktop" aria-label={t(locale, 'menu')}>
          {nav.map((node) =>
            node.type === 'link' ? (
              <Link key={node.label} href={node.href} className="nav__item">
                {node.label}
              </Link>
            ) : (
              <details key={node.label} className="nav__item">
                <summary>{node.label}</summary>
                <div className="nav__sub">
                  {node.items.map((item) => (
                    <Link key={item.href} href={item.href}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            ),
          )}
        </nav>

        <div className="site-header__spacer" />

        <Link href={searchUrl(locale)} className="nav__item">
          {t(locale, 'search')}
        </Link>
        <LanguageSwitcher locale={locale} label={t(locale, 'switchLanguage')} />
        <MobileNav nav={nav} menuLabel={t(locale, 'menu')} />
      </div>
    </header>
  )
}
