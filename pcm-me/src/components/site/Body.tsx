import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

/**
 * Renders Lexical rich text. Missing/empty body renders nothing (never errors).
 */
export const Body: React.FC<{ data: unknown }> = ({ data }) => {
  if (!data) return null
  return (
    <div className="rich-text">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <RichText data={data as any} />
    </div>
  )
}
