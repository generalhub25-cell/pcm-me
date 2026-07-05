import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { s3Storage } from '@payloadcms/storage-s3'
import { resendAdapter } from '@payloadcms/email-resend'
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
// Read via a dynamic accessor so Next/Turbopack does NOT inline these at build
// time (dot-notation process.env.X gets baked into the bundle; on Vercel that
// made the adapter resolve to SQLite at runtime even though POSTGRES_URL exists).
const readEnv = (k: string): string | undefined => process.env[k]
// Postgres on a persistent Node host (container). Local dev stays on SQLite.
const databaseUri =
  readEnv('DATABASE_URI') ||
  readEnv('DATABASE_URL') ||
  readEnv('POSTGRES_URL') ||
  'file:./pcm-me.db'
const usePostgres = databaseUri.startsWith('postgres')
// Dynamically import only the adapter in use so the other's native binding
// never loads when unused.
const db = usePostgres
  ? (await import('@payloadcms/db-postgres')).postgresAdapter({
      pool: { connectionString: databaseUri },
      idType: 'uuid',
      // Push (schema sync) only outside production; the build/release step
      // creates the schema. At runtime use the existing schema.
      push: readEnv('NODE_ENV') !== 'production',
    })
  : (await import('@payloadcms/db-sqlite')).sqliteAdapter({
      client: { url: databaseUri },
      idType: 'uuid',
      push: false,
      migrationDir: path.resolve(dirname, 'migrations'),
    })

export default buildConfig({
  admin: {
    user: Users.slug,
    // Force a fixed admin theme. The default ('all') resolves the theme on the
    // client and rewrites <html data-theme> after SSR, causing a hydration
    // mismatch on the admin shell (body transition / payload CSS layers). A
    // fixed theme renders identically on server and client.
    theme: 'light',
    // Payload applies suppressHydrationWarning to the admin <html> from this
    // flag (default false). The admin shell sets data-theme/dir/lang from
    // request state and a browser extension may touch <html>/<body>; enabling
    // this prevents the recoverable hydration overlay during local review.
    suppressHydrationWarning: true,
    // Use the built-in account icon instead of the default Gravatar avatar.
    // Gravatar loads from gravatar.com, which the site CSP (img-src 'self')
    // blocks → broken image in the top-right account button. 'default' renders
    // a local SVG, no external request.
    avatar: 'default',
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
  // Transactional email (application/contact forms) via Resend when its API key
  // is set; otherwise Payload logs emails to the console (dev default).
  email: readEnv('RESEND_API_KEY')
    ? resendAdapter({
        defaultFromName: 'PCM',
        defaultFromAddress: readEnv('EMAIL_FROM') || 'onboarding@resend.dev',
        apiKey: readEnv('RESEND_API_KEY') as string,
      })
    : undefined,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db,
  // Uploads storage, chosen by which env vars are present:
  //  1) Supabase Storage (S3-compatible) when S3_* are set — production default
  //     (files persist across restarts; served back through Payload so the
  //     site CSP img-src 'self' still applies).
  //  2) Vercel Blob when its token + ENABLE_BLOB are set.
  //  3) Otherwise local disk (dev).
  plugins:
    readEnv('S3_BUCKET') &&
    readEnv('S3_ENDPOINT') &&
    readEnv('S3_ACCESS_KEY_ID') &&
    readEnv('S3_SECRET_ACCESS_KEY')
      ? [
          s3Storage({
            collections: { images: true, files: true },
            bucket: readEnv('S3_BUCKET') as string,
            config: {
              endpoint: readEnv('S3_ENDPOINT'),
              region: readEnv('S3_REGION') || 'us-east-1',
              forcePathStyle: true, // required for Supabase / S3-compatible hosts
              credentials: {
                accessKeyId: readEnv('S3_ACCESS_KEY_ID') as string,
                secretAccessKey: readEnv('S3_SECRET_ACCESS_KEY') as string,
              },
            },
          }),
        ]
      : readEnv('BLOB_READ_WRITE_TOKEN') && readEnv('ENABLE_BLOB')
        ? [
            vercelBlobStorage({
              enabled: true,
              collections: { images: true, files: true },
              token: readEnv('BLOB_READ_WRITE_TOKEN'),
            }),
          ]
        : [],
  sharp: sharp as never,
})
