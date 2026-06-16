'use client'
import React from 'react'

import { CONSENT_EVENT } from '../../lib/consent'

/**
 * Footer "Cookie settings" link — re-opens the consent banner so the user can
 * change their choice at any time (PRD §8.6 re-consent path).
 */
export const ReconsentLink: React.FC<{ label: string }> = ({ label }) => (
  <button
    type="button"
    onClick={() => window.dispatchEvent(new Event(CONSENT_EVENT))}
    style={{
      background: 'none',
      border: 'none',
      padding: 0,
      color: 'var(--color-primary)',
      cursor: 'pointer',
      font: 'inherit',
      textDecoration: 'underline',
    }}
  >
    {label}
  </button>
)
