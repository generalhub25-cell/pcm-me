import type { CollectionConfig } from 'payload'

import { sharedFields, slugLocaleUniqueIndex } from '../fields/shared'
import { featuringFields } from '../fields/featuring'
import { seoFields } from '../fields/seo'
import { translationLinkField } from '../fields/translationLink'
import { isAdminOrEditor } from '../access/roles'
import { setPublishedAt, enforceAltTextOnPublish } from '../hooks/publish'
import { revalidateContentAfterChange, revalidateContentAfterDelete } from '../hooks/revalidate'
import { ARTICLE_KINDS, toOptions } from '../lib/enums'

/**
 * Article (PRD §6.1) + shared fields per §6 + Session 02 admin affordances
 * (featuring, SEO metadata, translation linking, publish/alt-text rules).
 */
export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'locale', 'status'],
  },
  access: {
    read: isAdminOrEditor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    beforeChange: [setPublishedAt, enforceAltTextOnPublish(['heroImage', 'ogImage'])],
    afterChange: [revalidateContentAfterChange],
    afterDelete: [revalidateContentAfterDelete],
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
        position: 'sidebar',
        description: 'Nullable until published; defaults to now on publish.',
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
    ...seoFields(),
    ...sharedFields(),
    ...featuringFields(),
    translationLinkField(),
  ],
}
