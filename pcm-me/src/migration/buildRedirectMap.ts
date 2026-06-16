import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'

import { getPayloadClient } from '../lib/payload'
import { DEFAULT_LOCALE, type Country, type Locale } from '../lib/enums'
import {
  absoluteUrl,
  siteUrl,
  canonicalArticle,
  canonicalVacancy,
  canonicalCompany,
} from '../lib/canonical'

/**
 * Produces the reviewable 301 redirect map artifact (PRD §12.4): legacy URL →
 * canonical new URL (Session 06 builder). Includes the §3.2 seed mappings plus
 * one row per migrated item that carries a `legacy_url`. No mapped legacy URL
 * may 404 (validate with validate.ts).
 */
const run = async () => {
  const rows: { from: string; to: string; status: number }[] = []

  // ROOT_REDIRECT (PRD §3.2).
  rows.push({ from: `${siteUrl()}/`, to: absoluteUrl(`/${DEFAULT_LOCALE}`), status: 301 })

  // Seed mappings (PRD §3.2) — stored relative; emit absolute.
  const seedPath = path.resolve(process.cwd(), 'src/migration/seed-redirects.json')
  const seed = JSON.parse(readFileSync(seedPath, 'utf8')) as { from: string; to: string }[]
  for (const s of seed) {
    rows.push({ from: absoluteUrl(s.from), to: absoluteUrl(s.to), status: 301 })
  }

  // Per migrated item: legacy_url → canonical.
  const payload = await getPayloadClient()
  const where = { legacyUrl: { exists: true } }
  const [articles, vacancies, companies] = await Promise.all([
    payload.find({ collection: 'articles', where, limit: 0, pagination: false, depth: 0 }),
    payload.find({ collection: 'vacancies', where, limit: 0, pagination: false, depth: 0 }),
    payload.find({ collection: 'companies', where, limit: 0, pagination: false, depth: 0 }),
  ])

  for (const d of articles.docs) {
    const doc = d as unknown as { legacyUrl?: string; locale: Locale; kind?: string; slug?: string }
    if (doc.legacyUrl && doc.slug)
      rows.push({ from: doc.legacyUrl, to: canonicalArticle(doc.locale, doc.kind, doc.slug), status: 301 })
  }
  for (const d of vacancies.docs) {
    const doc = d as unknown as { legacyUrl?: string; locale: Locale; country?: Country; slug?: string }
    if (doc.legacyUrl && doc.slug && doc.country)
      rows.push({ from: doc.legacyUrl, to: canonicalVacancy(doc.locale, doc.country, doc.slug), status: 301 })
  }
  for (const d of companies.docs) {
    const doc = d as unknown as { legacyUrl?: string; locale: Locale; slug?: string }
    if (doc.legacyUrl && doc.slug)
      rows.push({ from: doc.legacyUrl, to: canonicalCompany(doc.locale, doc.slug), status: 301 })
  }

  const csv = [
    'legacy_url,new_url,status',
    ...rows.map((r) => `"${r.from}","${r.to}",${r.status}`),
  ].join('\n')

  const outDir = path.resolve(process.cwd(), 'migration')
  mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, 'redirect-map.csv')
  writeFileSync(outPath, csv + '\n')
  console.log(`[migration] redirect map written to ${outPath} (${rows.length} rows)`)
  process.exit(0)
}

run().catch((err) => {
  console.error('[migration] redirect map failed:', (err as Error).message)
  process.exit(1)
})
