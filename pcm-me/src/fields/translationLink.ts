import type { Field } from 'payload'

/**
 * Translation linking UI (PRD §7.2, §4.2, §9.4). A sidebar control that:
 * - shows whether a translation exists in the other locale and links to it,
 * - lets the editor link this item to an other-locale item (shares
 *   translation_group_id) or unlink it (assigns a fresh group id).
 * Renders the client component in src/components/TranslationLink.tsx.
 */
export const translationLinkField = (): Field => ({
  name: 'translationLink',
  type: 'ui',
  admin: {
    position: 'sidebar',
    components: {
      Field: '/components/TranslationLink#TranslationLink',
    },
  },
})
