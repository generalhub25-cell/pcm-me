import type { CollectionConfig } from 'payload'

import { sharedFields, slugLocaleUniqueIndex } from '../fields/shared'
import { featuringFields } from '../fields/featuring'
import { seoFields } from '../fields/seo'
import { translationLinkField } from '../fields/translationLink'
import { isAdminOrEditor } from '../access/roles'
import { enforceAltTextOnPublish } from '../hooks/publish'
import { revalidateContentAfterChange, revalidateContentAfterDelete } from '../hooks/revalidate'

/**
 * Company (PRD §6.2): name, logo -> Image.id (nullable), body rich text,
 * external_url (nullable), founded (nullable), headquarters (nullable),
 * + shared fields per §6 + Session 02 admin affordances.
 */
export const Companies: CollectionConfig = {
  slug: 'companies',
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
    beforeChange: [enforceAltTextOnPublish(['logo', 'ogImage'])],
    afterChange: [revalidateContentAfterChange],
    afterDelete: [revalidateContentAfterDelete],
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
    ...seoFields(),
    ...sharedFields(),
    ...featuringFields(),
    translationLinkField(),
  ],
}
