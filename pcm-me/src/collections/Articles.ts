import type { CollectionConfig } from 'payload'

import { sharedFields, slugLocaleUniqueIndex } from '../fields/shared'
import { ARTICLE_KINDS, toOptions } from '../lib/enums'

/**
 * Article (PRD §6.1) + shared fields per §6.
 */
export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
  },
  indexes: slugLocaleUniqueIndex,
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      options: toOptions(ARTICLE_KINDS),
      admin: {
        description: 'scientific | news | reference. Controls which public index it appears under.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: false,
    },
    {
      name: 'body',
      type: 'richText',
      required: false,
    },
    {
      name: 'heroImage',
      type: 'relationship',
      relationTo: 'images',
      required: false,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: false,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      required: false,
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: false,
      admin: {
        description: 'Nullable until published.',
      },
    },
    {
      name: 'readingTimeMinutes',
      type: 'number',
      required: false,
      admin: {
        description: 'Derived, optional.',
      },
    },
    ...sharedFields(),
  ],
}
