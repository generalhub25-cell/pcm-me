import React from 'react'

import type { Locale } from '../../../../lib/enums'
import { t } from '../../../../lib/i18n'
import { homeUrl } from '../../../../lib/routes'
import { Breadcrumbs } from '../../../../components/site/Breadcrumbs'
import { ContactForm } from '../../../../components/forms/ContactForm'

/**
 * Contact (PRD §5.8): contact form (shares apply-form styling/validation,
 * Session 04) plus contact details.
 */
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  return (
    <div>
      <Breadcrumbs items={[{ label: t(l, 'home'), href: homeUrl(l) }, { label: t(l, 'contact') }]} />
      <h1 className="page-title">{t(l, 'contact')}</h1>
      <ContactForm locale={l} privacyHref={`/${l}/privacy-policy`} />
      <p className="muted" style={{ marginBlockStart: '1rem' }}>
        {t(l, 'contactLine')}
      </p>
    </div>
  )
}
