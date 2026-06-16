import React from 'react'

/**
 * Renders a JSON-LD <script> block (PRD §9.3). `data` is a plain JSON-LD
 * object built by src/lib/jsonld.ts.
 */
export const JsonLd: React.FC<{ data: unknown }> = ({ data }) => (
  <script
    type="application/ld+json"
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
)
