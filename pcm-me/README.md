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

## SEARCH_BACKEND (OQ-8)

**Database-native (SQLite) contains-based matching via Payload's `like`
operator** — no extra dependency. All search goes through the single
`search(query, { locale, types, includeAllLocales, page })` abstraction in
`src/lib/search.ts`, so the backend can be swapped for Meilisearch/Algolia/
Elasticsearch without touching callers. Only `published` Article/Vacancy/
Company are searched; Application/contact/admin data is never indexed.
Default results page size: 12 (OQ-18).

## Performance, security & deployment (Session 08)

- **HOSTING_TARGET (OQ-1/OQ-19):** not finalized. The app is a standard
  Next.js 16 + Payload deployable to any Node host or Vercel/Netlify. Recorded
  default: a Node host that meets §11 (HTTPS, auto-renewing certs, CDN).
  Provision **production on `pcm.me`** and a **staging/preview** environment
  (staging is where Session 07 migration is validated before cutover).
- **CDN_PROVIDER (OQ-19):** not finalized. Default: the host's edge/CDN
  (Vercel Edge / Netlify / Cloudflare). Caching rules MUST respect the
  Session 07 redirect map (cache the 301, not a stale 200) and never cache
  admin/application responses (enforced via `Cache-Control: no-store` headers
  in `next.config.mjs`).
- **Security (highest priority, remediates report §6.4/§8):** security headers
  (CSP, HSTS, X-Content-Type-Options nosniff, Referrer-Policy, X-Frame-Options)
  are set in `next.config.mjs#headers`; `poweredByHeader` is off. Production
  Next never serves `display_errors`/stack traces; API/form handlers return
  generic error codes (Session 04) and the public error boundary
  (`error.tsx`) leaks nothing. Admin (`/admin`), Payload API (`/api`) and the
  form endpoints (`/submit`) are access-controlled (Sessions 02/04) and
  `no-store` + `noindex` at the server.
- **HTTPS:** enforce HTTP→HTTPS at the host (Let's Encrypt auto-renew per
  report §6.1). HSTS is emitted so browsers upgrade.
- **Images:** `OptimizedImage` (next/image) emits responsive `srcset` in
  AVIF/WebP with fallback, lazy-loads below-the-fold, and uses stored
  width/height for CLS. `next.config` `images.formats = [avif, webp]`.
- **Cache invalidation on publish:** content `afterChange`/`afterDelete`
  hooks revalidate the public route tree and `/sitemap.xml`.
- **Performance budget (PRD §10.2, OQ-17 default):** Lighthouse CI
  (`lighthouserc.json`) asserts LCP ≤ 2.5 s and CLS < 0.1 (and TBT as the INP
  proxy) on Home, an article, and a jobs page in both locales. Run
  `npx @lhci/cli autorun` against a production build in CI.
- **Backups & logging (PRD §11.6):** back up the database (the SQLite file /
  Postgres dump) and the `media`/uploads directory on a schedule; ship
  Payload's pino logs (and access logs) to centralized logging. These are
  host/ops configuration, documented here for the deploy runbook.
- **OQ-16 brand tokens:** still placeholders in `src/styles/tokens.css`;
  swap real values when provided.

## Migration & redirects (Session 07)

- **OQ-21 (BLOCKER for the corpus import only):** no legacy WordPress access /
  WXR export / media archive is available in this environment, so the
  production corpus import is **recorded as blocked and NOT run** — no content
  is fabricated (per PRD §12.1). Every other session proceeds without it.
- **Importer tool** (`npm run migrate:import`, set `WXR_PATH` to a WordPress
  export; point `DATABASE_URI` at staging): maps WP posts→Article (kind
  inferred), vacancy templates→Vacancy (country mapped), company posts→Company;
  assigns locale by script detection (Arabic→ar, else en) and flags
  low-confidence; preserves legacy timestamps; sets `legacy_url`; missing/
  `Undefined` fields import as null; expired vacancies → `archived` (OQ-20).
  No machine translation (OQ-3). Field-mapping logic is pure + unit-checkable
  in `src/migration/mapping.ts`.
- **Seed 301 redirect map (PRD §3.2)** is live now via `next.config.mjs`
  `redirects()` from `src/migration/seed-redirects.json`, targeting the
  Session 06 canonical URLs (`/about`→`/ar/about`, `/vacancies/egypt`→
  `/ar/jobs/egypt`, `/vacancies/ksa-to-ksa`→`/ar/jobs/ksa` (OQ-4),
  `/glaxosmithkline`→`/ar/companies/glaxosmithkline`); bare `/`→`/ar` via
  middleware.
- **Redirect-map artifact:** `npm run migrate:redirect-map` writes
  `migration/redirect-map.csv` (seed mappings + one row per migrated
  `legacy_url`→canonical). **Validation:** `npm run migrate:validate`.

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
