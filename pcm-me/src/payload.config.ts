import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

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
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./pcm-me.db',
    },
    idType: 'uuid',
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
})
