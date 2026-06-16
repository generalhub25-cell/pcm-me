import type { CollectionConfig } from 'payload'

/**
 * File (PRD §6.7): id, file, mime_type, size_bytes, original_name.
 *
 * Upload collection: Payload natively stores `mimeType` (mime_type),
 * `filesize` (size_bytes) and `filename` (original_name) on upload, so the
 * §3.7 field set is satisfied by native upload fields. Upload constraints
 * (allowed types / size) are set in Session 04 / Session 08.
 */
export const Files: CollectionConfig = {
  slug: 'files',
  upload: true,
  admin: {
    useAsTitle: 'filename',
  },
  fields: [],
}
