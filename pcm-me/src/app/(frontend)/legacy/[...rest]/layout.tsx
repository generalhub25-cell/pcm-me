import '../../../../styles/tokens.css'
import React from 'react'
import { cookies } from 'next/headers'

import { fontAr, fontEn } from '../../../../lib/fonts'
import { dirFor } from '../../../../lib/i18n'
import type { Locale } from '../../../../lib/enums'
import { findByLegacyPath } from '../../../../lib/content'
import { Header } from '../../../../components/site/Header'
import { Footer } from '../../../../components/site/Footer'
import { LangAlternateProvider } from '../../../../components/site/LangAlternate'
import { CookieConsent } from '../../../../components/site/CookieConsent'
import { JsonLd } from '../../../../components/seo/JsonLd'
import { organizationJsonLd } from '../../../../lib/jsonld'
import { siteUrl } from '../../../../lib/canonical'

export const metadata = {
  metadataBase: new URL(siteUrl()),
}

/**
 * Root layout for legacy old-URL pages (reached only via the middleware rewrite
 * from an old pcm.me path). Renders the SAME shell as the normal public site,
 * in the resolved article's locale so RTL/LTR + header/footer match.
 */
export default async function LegacyLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ rest?: string[] }>
}) {
  const { rest } = await params
  const doc = await findByLegacyPath('/' + (rest ?? []).join('/'))
  const l = ((doc?.locale as Locale) ?? 'ar') as Locale
  const consentSet = (await cookies()).get('pcm_consent') != null

  return (
    <html lang={l} dir={dirFor(l)} className={`${fontAr.variable} ${fontEn.variable}`}>
      <body>
        <JsonLd data={organizationJsonLd()} />
        <LangAlternateProvider>
          <Header locale={l} />
          <main className="container">{children}</main>
          <Footer locale={l} />
          <CookieConsent locale={l} initialOpen={!consentSet} />
        </LangAlternateProvider>
      </body>
    </html>
  )
}
