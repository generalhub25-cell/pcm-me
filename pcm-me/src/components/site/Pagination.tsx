import React from 'react'
import Link from 'next/link'

/**
 * Pagination (PRD §10.4) — mirrors under RTL via document dir. Builds page
 * links by setting the `page` query param on the current base path.
 */
export const Pagination: React.FC<{
  basePath: string
  page: number
  totalPages: number
  query?: Record<string, string | undefined>
  labels: { previous: string; next: string; page: string }
}> = ({ basePath, page, totalPages, query = {}, labels }) => {
  if (totalPages <= 1) return null

  const hrefFor = (p: number) => {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    params.set('page', String(p))
    return `${basePath}?${params.toString()}`
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} rel="prev">
          ← {labels.previous}
        </Link>
      ) : (
        <span className="muted">← {labels.previous}</span>
      )}
      <span className="muted">
        {labels.page} {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} rel="next">
          {labels.next} →
        </Link>
      ) : (
        <span className="muted">{labels.next} →</span>
      )}
    </nav>
  )
}
