import type { CollectionConfig } from 'payload'

import { sharedFields, slugLocaleUniqueIndex } from '../fields/shared'

/**
 * Tag (PRD §6.8): id, name, slug, locale (+ shared fields per §6).
 */
export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
  },
  indexes: slugLocaleUniqueIndex,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    ...sharedFields(),
  ],
}
