import type { Field } from 'payload'

/**
 * SEO metadata fields (PRD §7 / Session 02 §8). Defined and stored here,
 * rendered in Session 06. Per-item, per-locale (each item is a per-locale
 * entity). Fallback chains (meta_title→title, meta_description→excerpt,
 * og_image→hero_image→site default) are applied at render time in Session 06.
 */
export const seoFields = (): Field[] => [
  {
    type: 'collapsible',
    label: 'SEO',
    admin: { initCollapsed: true },
    fields: [
      {
        name: 'metaTitle',
        type: 'text',
        admin: { description: 'Falls back to title (rendered in Session 06).' },
      },
      {
        name: 'metaDescription',
        type: 'textarea',
        admin: { description: 'Falls back to excerpt (rendered in Session 06).' },
      },
      {
        name: 'ogImage',
        type: 'relationship',
        relationTo: 'images',
        admin: { description: 'Falls back to hero image, then site default (Session 06).' },
      },
    ],
  },
]
