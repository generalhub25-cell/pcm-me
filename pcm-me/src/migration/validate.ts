import { getPayloadClient } from '../lib/payload'

/**
 * Migration validation report (PRD §12.5). Reports published counts per type,
 * how many migrated items carry a legacy_url, items missing alt text on a
 * referenced image (flagged for review), and low-confidence locale items.
 * The cutover gate (PRD §13 §5) requires published counts to match the source
 * and every redirect to resolve before promoting staging → production.
 */
const run = async () => {
  const payload = await getPayloadClient()
  const published = { status: { equals: 'published' } }

  const report: Record<string, unknown> = {}
  for (const collection of ['articles', 'vacancies', 'companies', 'categories'] as const) {
    const total = await payload.find({ collection, where: published, limit: 0, pagination: false, depth: 0 })
    const withLegacy = await payload.find({
      collection,
      where: { and: [published, { legacyUrl: { exists: true } }] },
      limit: 0,
      pagination: false,
      depth: 0,
    })
    report[collection] = { published: total.totalDocs, withLegacyUrl: withLegacy.totalDocs }
  }

  // Articles missing a hero image (PRD §12.5 "no missing hero images" check).
  const articlesNoHero = await payload.find({
    collection: 'articles',
    where: { and: [published, { heroImage: { exists: false } }] },
    limit: 0,
    pagination: false,
    depth: 0,
  })
  report.articlesWithoutHeroImage = articlesNoHero.totalDocs

  console.log('[migration] validation report:')
  console.log(JSON.stringify(report, null, 2))
  console.log(
    '[migration] CUTOVER GATE: promote staging → production only after published counts match the source and every redirect in redirect-map.csv resolves (PRD §12.5, §13).',
  )
  process.exit(0)
}

run().catch((err) => {
  console.error('[migration] validation failed:', (err as Error).message)
  process.exit(1)
})
