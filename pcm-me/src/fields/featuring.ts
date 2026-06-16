import type { Field } from 'payload'

/**
 * Home featuring controls (PRD §5.1, §7.4).
 * Per-locale by nature: each item is a per-locale entity, so featuring an
 * `ar` item does not feature its `en` sibling. `featuredOrder` orders the
 * featured set. Queried by Session 03 ("featured, this locale, ordered")
 * via src/lib/queries.ts#getFeatured.
 */
export const featuringFields = (): Field[] => [
  {
    name: 'featured',
    type: 'checkbox',
    defaultValue: false,
    admin: {
      position: 'sidebar',
      description: 'Feature this item on the Home page (this locale only).',
    },
  },
  {
    name: 'featuredOrder',
    type: 'number',
    admin: {
      position: 'sidebar',
      description: 'Order within the featured set (lower shows first).',
      condition: (data) => Boolean(data?.featured),
    },
  },
]
