import type { Access, FieldAccess } from 'payload'

/**
 * Role-based access (PRD §7.7, OQ-15 default).
 * Roles: `admin` (all) and `editor` (CRUD content, cannot manage users/roles).
 */

type WithRoles = { roles?: ('admin' | 'editor')[] } | null | undefined

const hasRole = (user: WithRoles, role: 'admin' | 'editor'): boolean =>
  Boolean(user && Array.isArray(user.roles) && user.roles.includes(role))

// Collection access (Access) — operate on req.user.
export const isAdmin: Access = ({ req: { user } }) => hasRole(user as WithRoles, 'admin')

export const isAdminOrEditor: Access = ({ req: { user } }) => {
  const u = user as WithRoles
  return hasRole(u, 'admin') || hasRole(u, 'editor')
}

// Admin, or the user acting on their own user record (so editors can read self).
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  const u = user as WithRoles & { id?: string }
  if (hasRole(u, 'admin')) return true
  if (u && (u as { id?: string }).id) {
    return { id: { equals: (u as { id?: string }).id } }
  }
  return false
}

// Field access (FieldAccess) — e.g. only admins may edit the `roles` field.
export const isAdminField: FieldAccess = ({ req: { user } }) =>
  hasRole(user as WithRoles, 'admin')
