import React from 'react'

import type { Locale } from '../../../../lib/enums'
import { t } from '../../../../lib/i18n'
import { homeUrl } from '../../../../lib/routes'
import { Breadcrumbs } from '../../../../components/site/Breadcrumbs'
import { simpleMetadata } from '../../../../lib/seoPages'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  return simpleMetadata({ locale: l, title: t(l, 'cookies'), path: `/${l}/cookie-policy` })
}

// Cookie Policy — stub (PRD §3.1). Copy + consent banner added in Session 09.
export default async function CookiePolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  return (
    <div>
      <Breadcrumbs items={[{ label: t(l, 'home'), href: homeUrl(l) }, { label: t(l, 'cookies') }]} />
      <h1 className="page-title">{t(l, 'cookies')}</h1>
      <p className="muted">{/* Session 09 fills the Cookie Policy copy. */}—</p>
    </div>
  )
}
