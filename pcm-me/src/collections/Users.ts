import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrSelf, isAdminField } from '../access/roles'

/**
 * Authentication collection for the admin (PRD §7.7).
 * Roles (OQ-15 default): admin (all), editor (CRUD content, cannot manage
 * users/roles). Only admins can manage users and edit the `roles` field.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Settings',
  },
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Only admins may set/change roles (prevents editor privilege escalation).
        create: isAdminField,
        update: isAdminField,
      },
    },
  ],
}
