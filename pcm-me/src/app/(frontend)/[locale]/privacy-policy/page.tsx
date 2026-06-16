import React from 'react'

import type { Locale } from '../../../../lib/enums'
import { t } from '../../../../lib/i18n'
import { simpleMetadata } from '../../../../lib/seoPages'
import { LegalPage } from '../../../../components/site/LegalPage'
import { privacyPolicy } from '../../../../content/legal'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  return simpleMetadata({ locale: l, title: t(l, 'privacy'), path: `/${l}/privacy-policy` })
}

// Privacy Policy (PRD §5.8, §6.3) — GDPR-aligned, DRAFT (OQ-11).
export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  return <LegalPage locale={l} doc={privacyPolicy[l]} />
}
