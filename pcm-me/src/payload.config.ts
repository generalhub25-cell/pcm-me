import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

import { Users } from './collections/Users'
import { Images } from './collections/Images'
import { Files } from './collections/Files'
import { Articles } from './collections/Articles'
import { Companies } from './collections/Companies'
import { Vacancies } from './collections/Vacancies'
import { Applications } from './collections/Applications'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Authors } from './collections/Authors'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// sharp powers Payload's image resizing. Its native binary (libvips) fails to
// load on the Vercel runtime under Turbopack externalization, so skip it there
// (image uploads store originals without resizing; next/image still optimizes
// public images via Vercel). Loaded normally for local dev.
const require = createRequire(import.meta.url)
let sharp: unknown = undefined
if (!process.env.VERCEL) {
  try {
    sharp = require('sharp')
  } catch {
    sharp = undefined
  }
}

// Local dev uses SQLite (file: URL); Vercel/production uses Postgres
// (postgres:// URL). Adapter chosen by DATABASE_URI scheme so local dev is
// unchanged. Postgres uses push (auto-sync schema on a fresh Vercel Postgres);
// SQLite keeps its committed migrations.
const databaseUri =
  process.env.DATABASE_URI ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  'file:./pcm-me.db'
const usePostgres = databaseUri.startsWith('postgres')
const db = usePostgres
  ? postgresAdapter({
      pool: { connectionString: databaseUri },
      idType: 'uuid',
      push: true,
    })
  : sqliteAdapter({
      client: { url: databaseUri },
      idType: 'uuid',
      push: false,
      migrationDir: path.resolve(dirname, 'migrations'),
    })

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // Locale model is separate-entity-per-locale + translation_group_id
  // (PRD §6, OQ-3 default). Payload field-level localization is intentionally
  // NOT enabled.
  collections: [
    Articles,
    Companies,
    Vacancies,
    Applications,
    Categories,
    Tags,
    Authors,
    Images,
    Files,
    Users,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db,
  // Uploads → Vercel Blob when its token is present (production); otherwise
  // local disk (dev). Gated so local dev is unchanged.
  plugins: process.env.BLOB_READ_WRITE_TOKEN
    ? [
        vercelBlobStorage({
          enabled: true,
          collections: { images: true, files: true },
          token: process.env.BLOB_READ_WRITE_TOKEN,
        }),
      ]
    : [],
  sharp: sharp as never,
})
