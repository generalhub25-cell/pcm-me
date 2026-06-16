'use client'
import React, { useState } from 'react'
import Link from 'next/link'

import type { NavNode } from './navData'

/**
 * Accessible mobile navigation (PRD §10.1). Collapses the primary nav behind
 * a toggle. Search + language switcher live in the header bar and stay
 * reachable independently of this menu.
 */
export const MobileNav: React.FC<{ nav: NavNode[]; menuLabel: string }> = ({
  nav,
  menuLabel,
}) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="mobile-nav">
      <button
        type="button"
        className="btn"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((v) => !v)}
      >
        {menuLabel}
      </button>
      {open && (
        <nav id="mobile-nav-panel" aria-label={menuLabel} style={{ paddingBlock: '1rem' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
            {nav.map((node) =>
              node.type === 'link' ? (
                <li key={node.label}>
                  <Link href={node.href} onClick={() => setOpen(false)}>
                    {node.label}
                  </Link>
                </li>
              ) : (
                <li key={node.label}>
                  <strong>{node.label}</strong>
                  <ul style={{ listStyle: 'none', padding: 0, marginInlineStart: '1rem' }}>
                    {node.items.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} onClick={() => setOpen(false)}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ),
            )}
          </ul>
        </nav>
      )}
    </div>
  )
}
