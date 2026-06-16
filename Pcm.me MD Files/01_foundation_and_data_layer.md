# 01_foundation_and_data_layer.md

**Goal:** Stand up the project skeleton, locale routing primitives, and the full bilingual data layer (schema + migrations + seed taxonomy) for every content type the site needs.
**Builds on:** Nothing. This is session 1.
**Out of scope:** Public page templates and layout (Session 03), admin/CMS UI (Session 02), jobs application capture logic (Session 04), search (Session 05), SEO output (Session 06), legacy migration (Session 07), performance/CDN (Session 08), legal/consent (Session 09).
**Deliverable:** A running project that boots, connects to a database, and exposes the complete schema for `Article`, `Company`, `Vacancy`, `Application`, `Category`, `Tag`, `Author`, `Image`, `File`, plus locale plumbing (`ar`/`en`) and seed taxonomy. No public UI required yet — schema, migrations, and a way to create a record (script or admin scaffold) are enough.

## Scope of This Session
Establish the foundation everything else depends on: the chosen stack scaffold, database connection, and the data model from PRD Section 6 implemented exactly, including shared fields, enums, and ID/slug conventions. This session also fixes the two locales (`ar` default-RTL, `en` LTR) as a first-class concept in the data layer so later sessions can resolve content per locale. It deliberately stops before any public templating or admin polish. The schema must be correct and migratable, because Sessions 02–09 all read from it.

## 1. Stack Decision (Decisions Needed — do not skip)
PRD **OQ-1** is unresolved: the rebuild stack is not chosen. This blocks the *form* of the scaffold but not the schema. Proceed as follows:

- If the operator has answered OQ-1, use that stack.
- If not, **default for this session: a headless-capable stack** — a relational database (PostgreSQL) with a typed schema/ORM, and a code-first CMS (Payload or Strapi) OR modern WordPress with custom post types. Pick one and record the choice at the top of the repo `README` as `STACK_DECISION`.
- Whatever is chosen, the schema in Section 3 below is expressed in stack-neutral terms; map it faithfully.

**Decisions Needed:**
1. OQ-1 stack (a) modern WordPress, (b) headless CMS + JS front end, (c) custom. Affects scaffold and admin (Session 02).
2. OQ-3 translation model: field-level translation in one entity vs. separate linked entities per locale. This session MUST implement one; default below in Section 2.

## 2. Locale Model (PRD §4.1, §6, §12.6)
Two locales: `ar` (default, RTL) and `en` (LTR).

- Every content type carries `locale` (enum `ar|en`).
- **Translation linking (default for OQ-3):** separate entity per locale, linked by a shared `translation_group_id` (UUID). Two records that are translations of each other share the same `translation_group_id` and differ in `locale`. An item may exist in only one locale (no sibling). This satisfies the language switcher (Session 03) and `hreflang` (Session 06).
- If OQ-3 is later resolved to field-level translation, the `translation_group_id` becomes unnecessary — flag at handoff.

## 3. Schema (implement exactly — PRD §6)
Shared fields on ALL content types: `id`, `slug`, `locale`, `translation_group_id`, `created_at`, `updated_at`, `status` (`draft|published|archived`), `legacy_url` (nullable).

**ID & slug conventions (PRD §6.9 — repeat verbatim in Sessions 02, 04, 07):**
- `id`: stable, opaque (UUID or CMS-native). Never reuse.
- `slug`: unique within `(type, locale)`; lowercase, hyphenated. Arabic slug handling is **OQ-14** — default: transliterate Arabic to ASCII slug, store original title separately.
- `legacy_url`: exact old absolute URL; populated by Session 07; used once to build the 301 map.

### 3.1 Article (PRD §6.1)
- `kind`: enum `scientific | news | reference`
- `title` string, `excerpt` string, `body` rich text/HTML
- `hero_image` → Image.id (nullable)
- `author` → Author.id (nullable; OQ-12)
- `category` → Category.id
- `tags` → array of Tag.id
- `published_at` datetime (nullable until published)
- `reading_time_minutes` int (derived, optional)

### 3.2 Company (PRD §6.2)
`name`, `logo`→Image.id (nullable), `body` rich text, `external_url` (nullable), `founded` (nullable), `headquarters` (nullable).

### 3.3 Vacancy (PRD §6.3)
- `title`, `employer` (nullable)
- `country`: enum `egypt | emirates | ksa | kuwait | north_africa | general`
- `role_type`: enum `medical_representative | product_specialist | territory_manager | other` (OQ-13 may extend)
- `description` rich text, `requirements` rich text
- `location` (nullable), `apply_email` (nullable), `apply_whatsapp` (nullable)
- `posted_at` datetime, `expires_at` datetime (nullable)
- `is_active` bool, derived: `true` when `expires_at` is null or in the future

### 3.4 Application (PRD §6.3 — new entity; logic in Session 04)
`id`, `vacancy_id`, `applicant_name`, `applicant_email`, `applicant_phone`, `cv_file`→File.id, `created_at`, `consent_given` bool, `source_locale`. Create the table/collection now; capture/forward/retention behavior is **OQ-5**, handled in Session 04. Do not build the submission endpoint here.

### 3.5 Category (PRD §6.5)
`name`, `slug`, `parent`→Category.id (nullable, enables nesting). Skills tracks are modeled as a Category subtree (PRD §6.6 default).

### 3.6 Tag, Author (PRD §6.8)
- Tag: `id`, `name`, `slug`, `locale`.
- Author: `id`, `name`, `bio` (nullable), `avatar`→Image.id (nullable). Real author data existence is **OQ-12**.

### 3.7 Image, File (PRD §6.7)
- Image: `id`, `file`, `alt_text` (bilingual, required for publish — enforced in Session 02), `width`, `height`, `caption` (nullable).
- File: `id`, `file`, `mime_type`, `size_bytes`, `original_name`. Upload constraints set in Session 04/Session 08.

## 4. Country & Role Enums (repeat in Session 04, 07)
- Country values: `egypt | emirates | ksa | kuwait | north_africa | general`.
- Country → route slug map: `egypt`, `emirates`, `ksa`, `kuwait`, `north-africa`, `general`.
- Legacy "X to Y" routes (`ksa-to-ksa`, `egypt-to-egypt`) are **OQ-4**; not modeled as data here — Session 07 decides redirect vs. tag.

## 5. Seed Data
Seed the Category taxonomy so later sessions have archives to render. Seed list is **OQ-7**; default seed now: `scientific-articles`, `news`, `tests-and-procedures`, `nuclear-pharmacy`, `biotechnology`, `diseases`, `otc`, `interactions-medicines`, and a `skills` parent with children `business`, `basic`, `life`, `manager`, `product-manager`. Seed both locales.

## 6. Migration/Boot Tooling
- Provide migration scripts (create/rollback) for all tables/collections.
- Provide a minimal seed script and at least one create path (CLI script or admin scaffold) to insert one `Article`, one `Vacancy`, one `Company` in both locales, for verification.

## Acceptance Criteria for Session 1
1. Project boots and connects to the database with documented env vars.
2. `STACK_DECISION` recorded in README (chosen stack or the Section 1 default).
3. All entities in Section 3 exist with exact fields, enums, and shared fields.
4. `locale` and `translation_group_id` exist on all content types; two records can be linked as translations.
5. Country enum and role_type enum match Section 4 / §3.3 exactly.
6. Seed taxonomy (Section 5) loads in both `ar` and `en`.
7. Migrations run forward and roll back cleanly.
8. One `Article`, one `Vacancy`, one `Company` can be created in both locales via the provided path.

## What Comes Next
Session 02 builds the admin/CMS layer on top of this schema: CRUD for every type, bilingual editing with translation linking, the draft→publish workflow using `status`/`published_at`, Home-featuring controls, the media library with `alt_text` enforcement, and Application export. It depends entirely on the entities and conventions fixed here, so hand off the final field list, enum values, and the OQ-3 translation-linking decision.
