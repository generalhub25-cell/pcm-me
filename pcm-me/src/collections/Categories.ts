import type { CollectionConfig } from 'payload'

import { sharedFields, slugLocaleUniqueIndex } from '../fields/shared'

/**
 * Category (PRD §6.5): name, slug, parent -> Category.id (nullable, enables
 * nesting), + shared fields per §6. Skills tracks are modeled as a Category
 * subtree (PRD §6.6 default; seeded in Section 5).
 */
export const Categories: CollectionConfig = {
  slug: 'categories',
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
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      required: false,
      admin: {
        description: 'Parent category (enables nesting). Null for a top-level category.',
      },
    },
    ...sharedFields(),
  ],
}
