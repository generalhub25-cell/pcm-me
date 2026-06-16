import React from 'react'
import Link from 'next/link'

import { absoluteUrl } from '../../lib/canonical'
import { breadcrumbJsonLd } from '../../lib/jsonld'
import { JsonLd } from '../seo/JsonLd'

/**
 * Breadcrumbs (PRD §4.5): on every page except Home, reflecting route
 * hierarchy, mirrored under RTL (via document dir + logical CSS). Emits
 * BreadcrumbList JSON-LD (PRD §9.3).
 */
export type Crumb = { label: string; href?: string }

export const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => {
  if (!items || items.length === 0) return null
  return (
    <nav aria-label="Breadcrumb" data-breadcrumbs-slot>
      <JsonLd
        data={breadcrumbJsonLd(
          items.map((c) => ({ label: c.label, url: c.href ? absoluteUrl(c.href) : undefined })),
        )}
      />
      <ol className="breadcrumbs">
        {items.map((c, i) => (
          <li key={i}>
            {c.href && i < items.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
