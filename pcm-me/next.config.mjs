import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'
import seedRedirects from './src/migration/seed-redirects.json' with { type: 'json' }

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root so Turbopack ignores stray lockfiles elsewhere.
  turbopack: {
    root: dirname,
  },
  // Legacy 301 redirect map (PRD §12.4, §3.2) — seed mappings target the
  // Session 06 canonical URLs. Per-item legacy_url redirects are produced by
  // the migration redirect-map generator once a WXR corpus is imported.
  async redirects() {
    return seedRedirects.map((r) => ({
      source: r.from,
      destination: r.to,
      statusCode: 301,
    }))
  },
}

export default withPayload(nextConfig)
