import React from 'react'
import Link from 'next/link'

import type { Locale } from '../../lib/enums'
import { t } from '../../lib/i18n'
import {
  articlesIndexUrl,
  newsIndexUrl,
  jobsIndexUrl,
  companiesIndexUrl,
} from '../../lib/routes'
import { ReconsentLink } from './ReconsentLink'

/**
 * Site footer (PRD §4.3): about blurb; nav columns (main sections; legal;
 * social — Facebook minimum, others OQ-10); brand contact line (public
 * address is OQ-6 → default to a contact-page link); copyright (current year).
 */
export const Footer: React.FC<{ locale: Locale }> = ({ locale }) => {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__cols">
          <div>
            <strong>{t(locale, 'siteName')}</strong>
            <p className="muted">{t(locale, 'aboutBlurb')}</p>
            <p className="muted">
              <Link href={`/${locale}/contact`}>{t(locale, 'contactLine')}</Link>
            </p>
          </div>

          <div>
            <strong>{t(locale, 'sections')}</strong>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li><Link href={articlesIndexUrl(locale)}>{t(locale, 'articles')}</Link></li>
              <li><Link href={newsIndexUrl(locale)}>{t(locale, 'news')}</Link></li>
              <li><Link href={jobsIndexUrl(locale)}>{t(locale, 'jobs')}</Link></li>
              <li><Link href={companiesIndexUrl(locale)}>{t(locale, 'companies')}</Link></li>
              <li><Link href={`/${locale}/about`}>{t(locale, 'about')}</Link></li>
            </ul>
          </div>

          <div>
            <strong>{t(locale, 'legal')}</strong>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li><Link href={`/${locale}/privacy-policy`}>{t(locale, 'privacy')}</Link></li>
              <li><Link href={`/${locale}/terms`}>{t(locale, 'terms')}</Link></li>
              <li><Link href={`/${locale}/cookie-policy`}>{t(locale, 'cookies')}</Link></li>
              <li><ReconsentLink label={t(locale, 'cookieSettings')} /></li>
            </ul>
          </div>

          <div>
            <strong>{t(locale, 'social')}</strong>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li>
                <a href="https://facebook.com" rel="noopener noreferrer" target="_blank">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          © {year} {t(locale, 'siteName')}
        </div>
      </div>
    </footer>
  )
}
