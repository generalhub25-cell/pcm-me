# 07_migration_and_redirects.md

**Goal:** Migrate all legacy WordPress content into the new schema, assign locales and translation links, and build the 301 redirect map from every known legacy URL to its new canonical URL.
**Builds on:** Session 01 (schema, enums, `legacy_url`, `translation_group_id`), Session 02 (publish workflow, archived status), Session 06 (canonical URL builder, country slug map, indexable/excluded paths).
**Out of scope:** Building templates (Session 03) or SEO output (Session 06) — this session populates data they render. Performance/CDN (Session 08), legal copy (Session 09).
**Deliverable:** The legacy corpus (articles, news, reference lists, company profiles, vacancies, taxonomy, media) imported into staging as the correct content types in the correct locales, with a reviewed 301 redirect map and validation showing counts match and no migrated URL 404s.

## Scope of This Session
Implement PRD Section 12. This is the riskiest session and the one with a hard external dependency (OQ-21 access). It is isolated so it can run repeatedly into staging until validation passes. It reuses the canonical URL builder from Session 06 so redirects target real URLs, and the publish/archive workflow from Session 02 for expired vacancies. The session ends when staging holds the migrated corpus and the redirect map validates.

## 1. Migration Source & Access (Decisions Needed — OQ-21, potential blocker)
PRD **OQ-21**: do we have WordPress admin/DB/hosting access, or at least a full WXR export + media archive? Without one of these, this session cannot run.
- **Default source (PRD §12.2):** WordPress export (WXR/XML) + a database/media pull as primary; authenticated crawl as fallback for anything missing.
- If no access is available, STOP and record under Open Questions; do not fabricate content. Every other session can proceed without this one — migration is the last data step before cutover.

## 2. Field Mapping (PRD §12.3)
- WP post → `Article`, with `kind` inferred from legacy category: scientific articles → `scientific`; news/syndicate posts → `news`; drug-food/drug-drug interaction & medicine reference lists → `reference`.
- WP custom vacancy templates (`egypt.php` and siblings) → `Vacancy`, mapping country from the source page to the `country` enum (`egypt, emirates, ksa, kuwait, north_africa, general`).
- Company posts (e.g. GlaxoSmithKline) → `Company`.
- WP categories/tags → `Category`/`Tag`; WP media → `Image`/`File`.
- Preserve legacy timestamps into `published_at`.
- **Missing/`Undefined` legacy fields (the `date` defect, report §6.4) import as null and render empty — never error.** Capture `width`/`height` for images; backfill missing `alt_text` for review (publish is blocked without it per Session 02).

## 3. Locale Assignment & Translation Linking (PRD §12.6)
- Detect/assign `locale` per legacy item (the legacy site mixes Arabic and English in one instance, report §3.1). Heuristic: script detection on title/body (Arabic block → `ar`, else `en`), flag low-confidence items for manual review.
- Where an item exists in only one language, create it in that locale with no translation sibling.
- Link known translation pairs via `translation_group_id`. **No machine translation** unless OQ-3 says otherwise.

## 4. Expired Vacancies (Decisions Needed — OQ-20)
PRD **OQ-20**: migrate expired/old vacancies as `archived`, or exclude them? Default: import with original `posted_at`; if `expires_at` is in the past or the listing is clearly stale, set `status=archived` (retained, not publicly listed) rather than deleting.

## 5. Redirect Map (PRD §12.4, §3.2)
- For every migrated item, set `legacy_url` (exact old absolute URL) and emit a **301** to the new canonical URL from Session 06's builder.
- Seed mappings (PRD §3.2):
  - `https://pcm.me/` → `ROOT_REDIRECT` (default `/ar/`)
  - `https://pcm.me/about/` → `/{locale}/about`
  - `https://pcm.me/privacy-policy/` → `/{locale}/privacy-policy`
  - `https://pcm.me/vacancies/egypt/` → `/{locale}/jobs/egypt`
  - `https://pcm.me/vacancies/ksa-to-ksa/` → `/{locale}/jobs/ksa` (see OQ-4)
  - `https://pcm.me/glaxosmithkline/` → `/{locale}/companies/glaxosmithkline`
- **Legacy "X to Y" routes (OQ-4):** `ksa-to-ksa`, `egypt-to-egypt`, etc. Default: 301 into the single-country jobs page; if OQ-4 later says they are meaningful origin→destination categories, convert to a filter/tag instead and update the map.
- Produce the full map as a reviewable artifact (CSV or similar) before cutover. No legacy URL with a mapping may 404.

## 6. Validation & Cutover Gate (PRD §12.5)
- Run migration into **staging** first (environments from Session 08/PRD §11.2).
- Validate: published content counts match source (±0 for published items); no broken internal links; no missing hero images; every redirect resolves; both locales present where they existed.
- Cutover only after validation passes (this is also Acceptance §5 in PRD §13).

## Open Questions
- OQ-21 legacy access (BLOCKER for this session only).
- OQ-3 translation model (affects linking; default separate-entity + `translation_group_id`).
- OQ-4 "X to Y" route handling (default 301 to single-country page).
- OQ-12 real authors to migrate?
- OQ-20 expired vacancies (default: archive).

## Acceptance Criteria for Session 7
1. Legacy corpus imported into staging as correct content types with `kind`/`country` correctly inferred.
2. Locales assigned per item; low-confidence cases flagged; known pairs linked via `translation_group_id`; no machine translation introduced.
3. Legacy timestamps preserved into `published_at`; missing legacy fields imported as null and render empty (no errors).
4. Media imported with dimensions; items missing `alt_text` flagged for review.
5. `legacy_url` set on migrated items; full 301 redirect map produced and reviewable; seed mappings (Section 5) resolve; no mapped legacy URL 404s.
6. Expired vacancies handled per OQ-20 default (archived).
7. Validation report shows published counts match source and redirects resolve; cutover gate documented.

## What Comes Next
Session 08 hardens and optimizes: image derivatives/responsive formats, caching/CDN, Core Web Vitals, environments, and the security fixes from the report (no `display_errors`, no leaked paths, security headers, HTTPS, access-controlled non-indexable admin/application endpoints). Hand off the staging environment details and the redirect map so caching/CDN rules respect redirects and excluded paths.
