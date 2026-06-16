import type { CollectionConfig } from 'payload'

/**
 * Image (PRD §6.7): id, file, alt_text (bilingual, required for publish —
 * enforced in Session 02), width, height, caption (nullable).
 *
 * Upload collection: Payload natively stores the file, width, height and
 * sizes for images, satisfying `file`/`width`/`height`. alt_text is
 * bilingual (per-locale alt text on a single shared image), so it is two
 * explicit fields rather than a per-record `locale`.
 */
export const Images: CollectionConfig = {
  slug: 'images',
  upload: {
    mimeTypes: ['image/*'],
  },
  admin: {
    useAsTitle: 'filename',
  },
  fields: [
    {
      name: 'altTextAr',
      type: 'text',
      label: 'Alt text (ar)',
      admin: {
        description: 'Arabic alt text. Required to publish an ar item using this image (Session 02).',
      },
    },
    {
      name: 'altTextEn',
      type: 'text',
      label: 'Alt text (en)',
      admin: {
        description: 'English alt text. Required to publish an en item using this image (Session 02).',
      },
    },
    {
      name: 'caption',
      type: 'text',
      required: false,
    },
  ],
}
