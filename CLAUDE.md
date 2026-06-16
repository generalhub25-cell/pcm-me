# PCM Project — build guide (for Claude across sessions)

Bilingual (ar/en) rebuild of **pcm.me** — a pharmaceutical careers/content
site. Implemented across 9 sequential spec sessions (see `Pcm.me MD Files/`).

## STACK_DECISION (OQ-1)

**Payload CMS 3 + Next.js 16 + SQLite (local) / PostgreSQL (prod-ready).**
The app lives in **`pcm-me/`** (a subfolder of this repo root).

- One framework: Payload collections = schema (S01), Payload admin = CMS
  (S02), Next.js App Router = public site (S03+).
- DB: SQLite via `@payloadcms/db-sqlite` (`DATABASE_URI=file:./pcm-me.db`),
  adapter swappable to Postgres in S08.
- Rich text: Lexical. IDs: opaque UUID (`idType: 'uuid'`).

## Commands (run inside `pcm-me/`)

| Purpose | Command |
|---|---|
| Install | `npm install` |
| Dev server | `npm run dev` → http://localhost:3000 (admin `/admin`) |
| Production build (also typechecks) | `npm run build` |
| Generate types | `npm run generate:types` (needs DB present) |
| Create migration | `npm run migrate:create -- <name>` |
| Apply migrations | `npm run migrate` |
| Roll back last | `npm run migrate:down` |
| Seed taxonomy + sample content | `npm run seed` |
| Migration status | `npm run payload -- migrate:status` |

There is **no separate test runner**; verification = build (typecheck) +
migrate forward/down + seed + direct DB/HTTP probes. Do not add a test
framework unless a spec requires it.

## Conventions / decisions locked in S01 (reuse, do not re-derive)

- **Module imports:** internal relative imports are **extensionless**
  (`./collections/Users`, not `.js`). `.js` specifiers break Turbopack;
  extensionless works for Turbopack, tsx, and the Payload CLI. The Payload
  route boilerplate under `src/app/(payload)/` keeps its generated
  `importMap.js` imports.
- **Locale model (OQ-3 default):** separate entity per locale + shared
  `translationGroupId` (UUID). Payload field-level localization is NOT
  enabled. Each localized doc has `locale` (`ar`|`en`) + `translationGroupId`.
- **Shared fields** (`slug`, `locale`, `translationGroupId`, `status`,
  `legacyUrl` + auto `id`/`createdAt`/`updatedAt`) via
  `src/fields/shared.ts` → applied to **Article, Company, Vacancy, Category,
  Tag, Author**. NOT on **Application / Image / File** (they have explicit
  §3.4/§3.7 field sets).
- **Slug:** `src/lib/slug.ts` `slugify()` transliterates Arabic→ASCII
  (OQ-14). Unique within (type, locale) via compound index
  (`slugLocaleUniqueIndex`).
- **Enums + country route-slug map:** `src/lib/enums.ts` (single source;
  reused by S03/04/06/07).
- **SQLite migration rollback:** generated `down()` must drop tables in
  reverse-dependency order (`_rels` / referencing tables first) or SQLite
  errors "no such table" on DROP. See `src/migrations/*_initial.ts`.

## Field name mapping

PRD snake_case → Payload camelCase. Full table in `pcm-me/README.md`.

## Adopted OQ defaults so far

- OQ-1 Payload headless (above). OQ-3 separate-entity+translationGroupId.
- OQ-14 Arabic transliterated slug. OQ-7 Section 5 seed taxonomy.

## Per-session progress

Tracked in `PROGRESS.md` at repo root — append one line per SHIPPED spec.
