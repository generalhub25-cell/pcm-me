import type { Locale } from '../../lib/enums'

type ImageLike = {
  url?: string | null
  altTextAr?: string | null
  altTextEn?: string | null
  width?: number | null
  height?: number | null
} | string | number | null | undefined

/** Resolve a populated Image relationship (depth >= 1) to a renderable src/alt. */
export const imageProps = (
  image: ImageLike,
  locale: Locale,
): { src: string; alt: string; width?: number; height?: number } | null => {
  if (!image || typeof image !== 'object') return null
  const url = image.url
  if (!url) return null
  const alt = (locale === 'ar' ? image.altTextAr : image.altTextEn) || ''
  return {
    src: url,
    alt,
    width: image.width || undefined,
    height: image.height || undefined,
  }
}
