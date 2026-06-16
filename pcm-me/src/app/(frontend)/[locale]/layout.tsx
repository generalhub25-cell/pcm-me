import '../../../styles/tokens.css'
import React from 'react'
import { notFound } from 'next/navigation'

import { fontAr, fontEn } from '../../../lib/fonts'
import { isLocale, dirFor } from '../../../lib/i18n'
import type { Locale } from '../../../lib/enums'
import { Header } from '../../../components/site/Header'
import { Footer } from '../../../components/site/Footer'
import { LangAlternateProvider } from '../../../components/site/LangAlternate'

/**
 * Public site root layout (PRD §3, §4.1): locale-prefixed routing; sets
 * `lang` and `dir` on the document root (ar→rtl, en→ltr) so the whole layout
 * mirrors. Header/footer/nav and the language-switcher target plumbing wrap
 * every public page.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const l = locale as Locale

  return (
    <html lang={l} dir={dirFor(l)} className={`${fontAr.variable} ${fontEn.variable}`}>
      <body>
        <LangAlternateProvider>
          <Header locale={l} />
          <main className="container">{children}</main>
          <Footer locale={l} />
        </LangAlternateProvider>
      </body>
    </html>
  )
}
