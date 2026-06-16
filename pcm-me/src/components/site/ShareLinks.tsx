'use client'
import React, { useEffect, useState } from 'react'

/**
 * Social share links (PRD §5.3). Uses the live page URL on the client.
 */
export const ShareLinks: React.FC<{ label: string }> = ({ label }) => {
  const [url, setUrl] = useState('')
  useEffect(() => setUrl(window.location.href), [])
  if (!url) return null
  const enc = encodeURIComponent(url)
  return (
    <div className="card__meta" style={{ marginBlockStart: '1rem' }}>
      <span>{label}: </span>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${enc}`} target="_blank" rel="noopener noreferrer">
        Facebook
      </a>
      {' · '}
      <a href={`https://twitter.com/intent/tweet?url=${enc}`} target="_blank" rel="noopener noreferrer">
        X
      </a>
      {' · '}
      <a href={`https://api.whatsapp.com/send?text=${enc}`} target="_blank" rel="noopener noreferrer">
        WhatsApp
      </a>
    </div>
  )
}
