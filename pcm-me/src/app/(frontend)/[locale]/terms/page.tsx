import React from 'react'

import type { Locale } from '../../../../lib/enums'
import { t } from '../../../../lib/i18n'
import { simpleMetadata } from '../../../../lib/seoPages'
import { LegalPage } from '../../../../components/site/LegalPage'
import { termsOfUse } from '../../../../content/legal'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  return simpleMetadata({ locale: l, title: t(l, 'terms'), path: `/${l}/terms` })
}

// Terms of Use (PRD §5.8) — DRAFT (OQ-11).
export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  return <LegalPage locale={l} doc={termsOfUse[l]} />
}
