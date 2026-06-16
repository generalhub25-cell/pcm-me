import React from 'react'

import type { Locale } from '../../../../lib/enums'
import { t } from '../../../../lib/i18n'
import { homeUrl } from '../../../../lib/routes'
import { Breadcrumbs } from '../../../../components/site/Breadcrumbs'
import { simpleMetadata } from '../../../../lib/seoPages'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  return simpleMetadata({ locale: l, title: t(l, 'privacy'), path: `/${l}/privacy-policy` })
}

// Privacy Policy — stub (PRD §3.1). Copy + consent are added in Session 09.
export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  return (
    <div>
      <Breadcrumbs items={[{ label: t(l, 'home'), href: homeUrl(l) }, { label: t(l, 'privacy') }]} />
      <h1 className="page-title">{t(l, 'privacy')}</h1>
      <p className="muted">{/* Session 09 fills the GDPR-aligned policy copy. */}—</p>
    </div>
  )
}
