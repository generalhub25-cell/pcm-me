import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access/roles'

/**
 * File (PRD §6.7): id, file, mime_type, size_bytes, original_name.
 *
 * Upload collection: Payload natively stores `mimeType`, `filesize` and
 * `filename`. Upload constraints (allowed types / size) are set in
 * Session 04 / Session 08.
 */
export const Files: CollectionConfig = {
  slug: 'files',
  upload: true,
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
  fields: [],
}
