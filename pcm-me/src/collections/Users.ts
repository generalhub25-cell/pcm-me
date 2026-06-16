import type { CollectionConfig } from 'payload'

/**
 * Authentication collection for the admin (PRD §7.7).
 * Session 01 establishes auth so the admin scaffold (a valid create path)
 * works. Roles/permissions are added in Session 02 (OQ-15).
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [],
}
