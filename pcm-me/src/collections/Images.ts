import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access/roles'

/**
 * Image (PRD §6.7): id, file, alt_text (bilingual, required for publish —
 * enforced via the publish hook on referencing collections), width, height,
 * caption (nullable).
 *
 * Upload collection: Payload natively stores the file, width, height and
 * sizes for images. alt_text is bilingual (per-locale alt text on a single
 * shared image): two explicit fields.
 */
export const Images: CollectionConfig = {
  slug: 'images',
  upload: {
    mimeTypes: ['image/*'],
  },
  admin: {
    useAsTitle: 'filename',
    group: 'Media',
  },
  access: {
    read: isAdminOrEditor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'altTextAr',
      type: 'text',
      label: 'Alt text (ar)',
      admin: {
        description: 'Arabic alt text. Required to publish an ar item using this image (PRD §8.4).',
      },
    },
    {
      name: 'altTextEn',
      type: 'text',
      label: 'Alt text (en)',
      admin: {
        description: 'English alt text. Required to publish an en item using this image (PRD §8.4).',
      },
    },
    {
      name: 'caption',
      type: 'text',
      required: false,
    },
  ],
}
