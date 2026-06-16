import React from 'react'

import type { Locale } from '../../../../lib/enums'
import { t } from '../../../../lib/i18n'
import { simpleMetadata } from '../../../../lib/seoPages'
import { LegalPage } from '../../../../components/site/LegalPage'
import { cookiePolicy } from '../../../../content/legal'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  return simpleMetadata({ locale: l, title: t(l, 'cookies'), path: `/${l}/cookie-policy` })
}

// Cookie Policy (PRD §5.8) — DRAFT (OQ-11).
export default async function CookiePolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  return <LegalPage locale={l} doc={cookiePolicy[l]} />
}
