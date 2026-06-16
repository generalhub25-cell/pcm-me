import React from 'react'
import Image from 'next/image'

/**
 * Image optimization (PRD §10.3): next/image emits responsive srcset in
 * WebP/AVIF (with fallback), lazy-loads below-the-fold images, and uses the
 * stored width/height to reserve space (CLS protection). Falls back to a
 * plain lazy <img> when dimensions are unknown.
 */
export const OptimizedImage: React.FC<{
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
  style?: React.CSSProperties
}> = ({ src, alt, width, height, priority, sizes, style }) => {
  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        sizes={sizes || '(max-width: 768px) 100vw, 50vw'}
        style={{ maxWidth: '100%', height: 'auto', ...style }}
      />
    )
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" style={{ maxWidth: '100%', height: 'auto', ...style }} />
}
