import type { CollectionConfig } from 'payload'

import { sharedFields, slugLocaleUniqueIndex } from '../fields/shared'
import { featuringFields } from '../fields/featuring'
import { seoFields } from '../fields/seo'
import { translationLinkField } from '../fields/translationLink'
import { isAdminOrEditor } from '../access/roles'
import { enforceAltTextOnPublish } from '../hooks/publish'

/**
 * Category (PRD §6.5): name, slug, parent -> Category.id (nullable, enables
 * nesting), + shared fields per §6 + Session 02 admin affordances. Skills
 * tracks are modeled as a Category subtree (PRD §6.6 default).
 */
export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'parent', 'locale', 'status'],
  },
  access: {
    read: isAdminOrEditor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    beforeChange: [enforceAltTextOnPublish(['ogImage'])],
  },
  indexes: slugLocaleUniqueIndex,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      required: false,
      admin: {
        description: 'Parent category (enables nesting). Null for a top-level category.',
      },
    },
    ...seoFields(),
    ...sharedFields(),
    ...featuringFields(),
    translationLinkField(),
  ],
}
