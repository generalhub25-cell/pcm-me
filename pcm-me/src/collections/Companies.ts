import type { CollectionConfig } from 'payload'

import { sharedFields, slugLocaleUniqueIndex } from '../fields/shared'

/**
 * Company (PRD §6.2): name, logo -> Image.id (nullable), body rich text,
 * external_url (nullable), founded (nullable), headquarters (nullable),
 * + shared fields per §6.
 */
export const Companies: CollectionConfig = {
  slug: 'companies',
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
    {
      name: 'logo',
      type: 'relationship',
      relationTo: 'images',
      required: false,
    },
    {
      name: 'body',
      type: 'richText',
      required: false,
    },
    {
      name: 'externalUrl',
      type: 'text',
      required: false,
    },
    {
      name: 'founded',
      type: 'text',
      required: false,
    },
    {
      name: 'headquarters',
      type: 'text',
      required: false,
    },
    ...sharedFields(),
  ],
}
