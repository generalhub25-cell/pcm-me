import type { Field, CollectionConfig } from 'payload'

import { LOCALES, STATUSES, DEFAULT_LOCALE, toOptions } from '../lib/enums'
import { slugify } from '../lib/slug'

/**
 * Shared fields on the localized content types (PRD §6):
 * id (auto), slug, locale, translation_group_id, created_at (auto),
 * updated_at (auto), status, legacy_url (nullable).
 *
 * Applied to: Article, Company, Vacancy, Category, Tag, Author.
 * NOT applied to Application / Image / File (they enumerate their own
 * field sets in §3.4 / §3.7).
 */
export const sharedFields = (): Field[] => [
  {
    name: 'locale',
    type: 'select',
    required: true,
    defaultValue: DEFAULT_LOCALE,
    options: toOptions(LOCALES),
    admin: {
      position: 'sidebar',
      description: 'Content locale (PRD §4.1). ar = RTL default, en = LTR.',
    },
  },
  {
    name: 'translationGroupId',
    type: 'text',
    required: true,
    defaultValue: () => crypto.randomUUID(),
    index: true,
    admin: {
      position: 'sidebar',
      description:
        'Shared UUID linking this item to its translations in other locales (PRD §6, OQ-3 default).',
    },
  },
  {
    name: 'slug',
    type: 'text',
    required: true,
    index: true,
    admin: {
      position: 'sidebar',
      description:
        'Unique within (type, locale); lowercase, hyphenated; Arabic transliterated to ASCII (PRD §6.9, OQ-14).',
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (value) return slugify(String(value))
          const source = (data?.title as string) || (data?.name as string) || ''
          return slugify(source)
        },
      ],
    },
  },
  {
    name: 'status',
    type: 'select',
    required: true,
    defaultValue: 'draft',
    options: toOptions(STATUSES),
    admin: {
      position: 'sidebar',
      description: 'draft → published → archived (PRD §7.3).',
    },
  },
  {
    name: 'legacyUrl',
    type: 'text',
    required: false,
    admin: {
      position: 'sidebar',
      description: 'Exact old absolute URL; populated by Session 07; used to build the 301 map.',
    },
  },
]

/**
 * Compound unique index enforcing slug uniqueness within (type, locale).
 * Each content type is its own collection, so (collection, slug, locale)
 * is unique — exactly PRD §6.9 "unique within (type, locale)".
 */
export const slugLocaleUniqueIndex: CollectionConfig['indexes'] = [
  { fields: ['slug', 'locale'], unique: true },
]
