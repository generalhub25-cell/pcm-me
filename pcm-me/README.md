# pcm.me — bilingual rebuild

## STACK_DECISION

**OQ-1 resolved (operator choice): Headless CMS — Payload CMS 3 + Next.js + SQLite (local) / PostgreSQL (production-ready).**

- Code-first CMS (Payload 3) running on Next.js (App Router).
- Database: SQLite via `@payloadcms/db-sqlite` for local development and
  verification (zero-setup). The adapter is swappable to PostgreSQL for
  production (Session 08).
- Rich text: Lexical (`@payloadcms/richtext-lexical`).
- IDs: opaque UUID (`idType: 'uuid'`) per PRD §6.9.

## ROOT_REDIRECT (OQ-2)

Bare `/` redirects to **`/ar/`** (default audience language), implemented in
`src/middleware.ts`. Session 06 sets `hreflang x-default` to match.

## OQ defaults adopted (Session 01)

- **OQ-3 (translation model):** separate entity per locale, linked by a
  shared `translation_group_id` (UUID). Payload field-level localization is
  intentionally NOT enabled.
- **OQ-14 (Arabic slugs):** transliterate Arabic to an ASCII slug; original
  title kept in `title`/`name`.
- **OQ-7 (seed taxonomy):** Section 5 default list seeded in both locales.

## Environment variables

- `DATABASE_URI` — libsql/SQLite URL, e.g. `file:./pcm-me.db`.
- `PAYLOAD_SECRET` — secret used to sign tokens.
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — optional; default
  `admin@pcm.me` / `admin1234` for the seeded admin user.

## Setup

```bash
npm install
npm run migrate:create   # generate the initial migration from the schema
npm run migrate          # apply migrations (forward)
npm run seed             # seed taxonomy + sample content in ar + en
npm run dev              # http://localhost:3000  (admin at /admin)
```

Roll back: `npm run migrate:down`.

## Schema field mapping (PRD §6 → Payload)

The PRD expresses fields in stack-neutral snake_case; Payload uses camelCase.
Faithful mapping:

| PRD field | Payload field | Notes |
|---|---|---|
| `id` | `id` | Auto, opaque UUID (`idType: 'uuid'`). |
| `created_at` / `updated_at` | `createdAt` / `updatedAt` | Payload native timestamps. |
| `translation_group_id` | `translationGroupId` | UUID, links translations. |
| `legacy_url` | `legacyUrl` | Nullable; populated in Session 07. |
| `hero_image` / `og_image` / `logo` / `avatar` | relationship → `images` | |
| `cv_file` | `cvFile` relationship → `files` | |
| `vacancy_id` | `vacancy` relationship → `vacancies` | |
| `role_type` | `roleType` | Enum. |
| `published_at` / `posted_at` / `expires_at` | `publishedAt` / `postedAt` / `expiresAt` | |
| `is_active` | `isActive` | Derived (virtual): true when `expiresAt` null or future. |
| `reading_time_minutes` | `readingTimeMinutes` | |
| `external_url` | `externalUrl` | |
| `source_locale` | `sourceLocale` | |
| `consent_given` | `consentGiven` | |
| `applicant_name/email/phone` | `applicantName/Email/Phone` | |
| `alt_text` (bilingual) | `altTextAr` / `altTextEn` | Per-locale alt text on shared Image. |
| `mime_type` / `size_bytes` / `original_name` | `mimeType` / `filesize` / `filename` | Native Payload upload fields. |
| `width` / `height` | `width` / `height` | Native Payload image upload fields. |

### Shared-fields scope

Shared fields (`slug`, `locale`, `translationGroupId`, `status`, `legacyUrl`
+ auto `id`/`createdAt`/`updatedAt`) apply to the six localized content
types: **Article, Company, Vacancy, Category, Tag, Author**.

`Application` (§3.4), `Image` and `File` (§3.7) enumerate their own explicit
field sets and do **not** carry the shared fields (Application uses
`source_locale` not `locale`; Image's `alt_text` is bilingual, contradicting
a per-locale field).

## Country enum → route slug map (PRD §4)

`egypt → egypt`, `emirates → emirates`, `ksa → ksa`, `kuwait → kuwait`,
`north_africa → north-africa`, `general → general`.
