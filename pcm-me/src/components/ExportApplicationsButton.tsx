'use client'
import React from 'react'

/**
 * "Export CSV" link shown above the Applications list (PRD §7.5).
 * Points at the collection endpoint in src/endpoints/applicationsCsv.ts.
 */
export const ExportApplicationsButton: React.FC = () => (
  <div style={{ margin: '12px 0' }}>
    <a
      href="/api/applications/export-csv"
      style={{
        display: 'inline-block',
        padding: '6px 12px',
        border: '1px solid var(--theme-elevation-250)',
        borderRadius: 4,
        background: 'var(--theme-elevation-50)',
        textDecoration: 'none',
      }}
    >
      Export CSV
    </a>
  </div>
)
