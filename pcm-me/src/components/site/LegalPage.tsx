import React from 'react'

import type { Locale } from '../../lib/enums'
import { t } from '../../lib/i18n'
import { homeUrl } from '../../lib/routes'
import { Breadcrumbs } from './Breadcrumbs'
import { DRAFT_NOTICE, type LegalDoc } from '../../content/legal'

/**
 * Renders a legal document (Privacy / Terms / Cookie) with the DRAFT notice
 * (OQ-11). Bilingual via the passed-in LegalDoc; RTL/LTR via document dir.
 */
export const LegalPage: React.FC<{ locale: Locale; doc: LegalDoc }> = ({ locale, doc }) => (
  <article>
    <Breadcrumbs items={[{ label: t(locale, 'home'), href: homeUrl(locale) }, { label: doc.title }]} />
    <h1 className="page-title">{doc.title}</h1>
    <p
      role="note"
      style={{
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius)',
        padding: 'var(--space-2) var(--space-3)',
        color: 'var(--color-muted)',
      }}
    >
      {DRAFT_NOTICE[locale]}
    </p>
    <p className="muted">{doc.updated}</p>
    {doc.sections.map((s, i) => (
      <section key={i} className="section">
        <h2 className="section__title">{s.heading}</h2>
        {s.body.map((p, j) => (
          <p key={j}>{p}</p>
        ))}
      </section>
    ))}
  </article>
)
