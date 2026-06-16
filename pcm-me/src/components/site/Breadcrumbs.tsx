import React from 'react'
import Link from 'next/link'

/**
 * Breadcrumbs (PRD §4.5): on every page except Home, reflecting route
 * hierarchy, mirrored under RTL (via document dir + logical CSS). Renders a
 * data attribute slot so Session 06 can attach BreadcrumbList JSON-LD.
 */
export type Crumb = { label: string; href?: string }

export const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => {
  if (!items || items.length === 0) return null
  return (
    <nav aria-label="Breadcrumb" data-breadcrumbs-slot>
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
