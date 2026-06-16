import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * Cache invalidation on publish (PRD §10.4, §11.4): when content changes via
 * the admin, revalidate the public route tree and the sitemap so the CDN/cache
 * serves fresh content (coordinates with Session 02 publish + Session 06
 * sitemap). Wrapped in try/catch because the same hooks also run from the CLI
 * (seed/migrate) outside a Next request scope, where revalidatePath is a no-op.
 */
const revalidate = async () => {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
    revalidatePath('/sitemap.xml')
  } catch {
    /* outside Next request scope (e.g. CLI) — ignore */
  }
}

export const revalidateContentAfterChange: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidate()
  return doc
}

export const revalidateContentAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await revalidate()
  return doc
}
