import type { CollectionBeforeChangeHook } from 'payload'
import { APIError } from 'payload'

/**
 * Publish workflow (PRD §7.3): setting status to `published` requires
 * `published_at`; default it to now if empty. Only applied to collections
 * that carry `publishedAt` (Article).
 */
export const setPublishedAt: CollectionBeforeChangeHook = ({ data }) => {
  if (data?.status === 'published' && !data.publishedAt) {
    data.publishedAt = new Date().toISOString()
  }
  return data
}

/**
 * alt_text enforcement (PRD §7.6, §8.4, §9): block publishing any item that
 * references an image lacking `alt_text` in the item's locale.
 * `imageFields` are the names of this collection's image-relationship fields.
 */
export const enforceAltTextOnPublish =
  (imageFields: string[]): CollectionBeforeChangeHook =>
  async ({ data, req, originalDoc }) => {
    if (data?.status !== 'published') return data

    const locale = (data.locale ?? originalDoc?.locale) as 'ar' | 'en'
    const altField = locale === 'ar' ? 'altTextAr' : 'altTextEn'

    for (const field of imageFields) {
      const ref = data[field] ?? originalDoc?.[field]
      if (!ref) continue
      const id = typeof ref === 'object' && ref !== null ? (ref as { id?: string }).id : ref
      if (!id) continue

      const image = await req.payload
        .findByID({ collection: 'images', id: String(id), depth: 0 })
        .catch(() => null)
      const alt = image ? (image as unknown as Record<string, unknown>)[altField] : null

      if (!alt || String(alt).trim() === '') {
        throw new APIError(
          `Cannot publish: the image referenced by "${field}" is missing ${locale.toUpperCase()} alt text. Add alt text to the image before publishing (PRD §8.4).`,
          400,
          undefined,
          true,
        )
      }
    }

    return data
  }
