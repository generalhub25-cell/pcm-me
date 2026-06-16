import type { CollectionConfig } from 'payload'

import { sharedFields, slugLocaleUniqueIndex } from '../fields/shared'
import { featuringFields } from '../fields/featuring'
import { seoFields } from '../fields/seo'
import { translationLinkField } from '../fields/translationLink'
import { isAdminOrEditor } from '../access/roles'
import { enforceAltTextOnPublish } from '../hooks/publish'
import { COUNTRIES, ROLE_TYPES, toOptions } from '../lib/enums'

/**
 * Vacancy (PRD §6.3) + shared fields per §6 + Session 02 admin affordances.
 * `is_active` is derived: true when expires_at is null or in the future.
 */
export const Vacancies: CollectionConfig = {
  slug: 'vacancies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'country', 'roleType', 'locale', 'status'],
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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'employer',
      type: 'text',
      required: false,
    },
    {
      name: 'country',
      type: 'select',
      required: true,
      options: toOptions(COUNTRIES),
    },
    {
      name: 'roleType',
      type: 'select',
      required: true,
      options: toOptions(ROLE_TYPES),
      admin: {
        description: 'OQ-13 may extend.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: false,
    },
    {
      name: 'requirements',
      type: 'richText',
      required: false,
    },
    {
      name: 'location',
      type: 'text',
      required: false,
    },
    {
      name: 'applyEmail',
      type: 'email',
      required: false,
    },
    {
      name: 'applyWhatsapp',
      type: 'text',
      required: false,
    },
    {
      name: 'postedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: false,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      virtual: true,
      admin: {
        readOnly: true,
        description: 'Derived: true when expires_at is null or in the future.',
      },
      hooks: {
        afterRead: [
          ({ data }) => {
            const expiresAt = data?.expiresAt as string | null | undefined
            if (!expiresAt) return true
            return new Date(expiresAt).getTime() > Date.now()
          },
        ],
      },
    },
    ...seoFields(),
    ...sharedFields(),
    ...featuringFields(),
    translationLinkField(),
  ],
}
