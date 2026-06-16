import type { CollectionConfig } from 'payload'

import { sharedFields, slugLocaleUniqueIndex } from '../fields/shared'
import { translationLinkField } from '../fields/translationLink'
import { isAdminOrEditor } from '../access/roles'
import { enforceAltTextOnPublish } from '../hooks/publish'

/**
 * Author (PRD §6.8): id, name, bio (nullable), avatar -> Image.id (nullable),
 * + shared fields per §6. Real author data existence is OQ-12.
 */
export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'locale', 'status'],
  },
  access: {
    read: isAdminOrEditor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    beforeChange: [enforceAltTextOnPublish(['avatar'])],
  },
  indexes: slugLocaleUniqueIndex,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      required: false,
    },
    {
      name: 'avatar',
      type: 'relationship',
      relationTo: 'images',
      required: false,
    },
    ...sharedFields(),
    translationLinkField(),
  ],
}
