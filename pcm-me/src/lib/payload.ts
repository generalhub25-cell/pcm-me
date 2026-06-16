import configPromise from '@payload-config'
import { getPayload } from 'payload'

/**
 * Cached Payload local-API client for server components (Session 03+).
 * Local API uses overrideAccess by default, so public SSR can read content
 * while the REST/admin endpoints stay access-controlled (Session 02/08).
 */
let cached: Awaited<ReturnType<typeof getPayload>> | null = null

export const getPayloadClient = async () => {
  if (!cached) {
    cached = await getPayload({ config: configPromise })
  }
  return cached
}
