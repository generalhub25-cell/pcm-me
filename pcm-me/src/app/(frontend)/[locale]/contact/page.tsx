import React from 'react'

import type { Locale } from '../../../../lib/enums'
import { t } from '../../../../lib/i18n'
import { homeUrl } from '../../../../lib/routes'
import { Breadcrumbs } from '../../../../components/site/Breadcrumbs'

/**
 * Contact (PRD §5.8): renders a contact form (shares apply-form styling) plus
 * contact details. The form's submission handling is wired in Session 04.
 */
const labels = {
  ar: { name: 'الاسم', email: 'البريد الإلكتروني', message: 'الرسالة', send: 'إرسال' },
  en: { name: 'Name', email: 'Email', message: 'Message', send: 'Send' },
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  const x = labels[l]
  return (
    <div>
      <Breadcrumbs items={[{ label: t(l, 'home'), href: homeUrl(l) }, { label: t(l, 'contact') }]} />
      <h1 className="page-title">{t(l, 'contact')}</h1>

      {/* Contact form shell — Session 04 wires validation + delivery. */}
      <form className="form" data-contact-form>
        <label>
          {x.name}
          <input type="text" name="name" required />
        </label>
        <label>
          {x.email}
          <input type="email" name="email" required />
        </label>
        <label>
          {x.message}
          <textarea name="message" rows={5} required />
        </label>
        <button type="submit" className="btn">
          {x.send}
        </button>
      </form>

      <p className="muted" style={{ marginBlockStart: '1rem' }}>
        {t(l, 'contactLine')}
      </p>
    </div>
  )
}
