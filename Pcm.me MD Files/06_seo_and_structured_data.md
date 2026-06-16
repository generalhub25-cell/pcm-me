# 06_seo_and_structured_data.md

**Goal:** Add all SEO output across the site — meta tags, Open Graph/Twitter, JSON-LD structured data, `hreflang`/`x-default`, canonicals, `sitemap.xml`, and `robots.txt`.
**Builds on:** Session 02 (SEO metadata fields + `og_image`), Session 03 (templates, language-switcher target URLs, breadcrumb slots, `ROOT_REDIRECT`), Session 04/05 (endpoints to exclude from indexing).
**Out of scope:** The 301 redirect map from legacy URLs (Session 07 owns that, though it must align with the canonical URLs defined here), performance/Core Web Vitals (Session 08), legal page copy (Session 09).
**Deliverable:** Every public page emits correct per-locale `<title>`/meta description/canonical, OG/Twitter tags, and applicable JSON-LD; correct `hreflang` pairs + `x-default`; a multi-locale `sitemap.xml`; and a `robots.txt` that allows public content and disallows admin/application/search-internal endpoints.

## Scope of This Session
Implement PRD Section 9 in full. SEO is its own session because it touches every template uniformly and depends on metadata fields and URL/translation plumbing already in place. The site has ~15 years of equity (PRD §2.3, §9), so correctness of canonicals, `hreflang`, and structured data matters. This session defines the **canonical URL builder** that Session 07's redirect map must target. It does not create redirects itself.

## 1. Per-Page Metadata (PRD §9.2)
- Per-page, per-locale `<title>` from `meta_title` (Session 02), falling back to item `title` + site suffix.
- Meta description from `meta_description`, falling back to `excerpt`.
- Canonical tag on every indexable page using the canonical URL builder (Section 5).
- OG + Twitter Card tags: title, description, image (`og_image` → fallback `hero_image` → site default).

## 2. JSON-LD Structured Data (PRD §9.3)
Attach to the slots Session 03 left:
- `Article` on `Article kind=scientific` detail; `NewsArticle` on `kind=news` detail.
- `JobPosting` on vacancy detail: `title`, hiring org (`employer`), location (`location`/`country`), `datePosted` (`posted_at`), `validThrough` (`expires_at`). Enables Google Jobs eligibility.
- `Organization` site-wide.
- `BreadcrumbList` on every page with breadcrumbs (Session 03 §6).
All JSON-LD MUST validate.

## 3. Internationalization SEO (PRD §9.4)
- `hreflang` pairs between `ar` and `en` equivalents using the language-switcher target URLs from Session 03 §3 (translated sibling when it exists).
- `x-default` points to the `ROOT_REDIRECT` target from Session 03 (default `/ar/`; OQ-2).
- Per-locale `<html lang>` and `dir` (already set in Session 03 — verify and don't duplicate).

## 4. Crawl & Indexing (PRD §9.5)
- `sitemap.xml` at `/sitemap.xml` (not locale-prefixed) including all `published` URLs across both locales; regenerate/invalidate on publish.
- `robots.txt` at `/robots.txt`: allow public content; **disallow** admin (Session 02), the application/contact endpoints (Session 04), and any search-internal endpoints (Session 05). Reference the sitemap.
- Canonical tags on all indexable pages (Section 1).

## 5. Canonical URL Builder (shared contract — Session 07 depends on this)
- Provide one function that, given (type, locale, slug), returns the absolute canonical URL (locale-prefixed, on `pcm.me`).
- Session 07's 301 map MUST target exactly these URLs. Repeat the country slug map here for vacancies: `egypt, emirates, ksa, kuwait, north-africa, general`.

## Open Questions
- OQ-2 `x-default` target (default `/ar/`).
- OQ-9 RSS/Atom feeds required? If yes, add `/{locale}/feed` and link from `<head>`; default: include per-locale feeds.

## Acceptance Criteria for Session 6
1. Every public page emits per-locale `<title>`, meta description, and canonical via the URL builder.
2. OG/Twitter tags present with correct image fallback chain.
3. `Article`/`NewsArticle`, `JobPosting`, `Organization`, `BreadcrumbList` JSON-LD render where applicable and validate in a structured-data validator.
4. `hreflang` pairs are correct between translated equivalents; `x-default` set; `<html lang>`/`dir` correct per locale.
5. `sitemap.xml` lists all published URLs in both locales and updates on publish.
6. `robots.txt` allows public content and disallows admin/application/search-internal paths and references the sitemap.
7. The canonical URL builder is the single source of truth for public URLs and is exported for Session 07.

## What Comes Next
Session 07 migrates all legacy WordPress content into this schema and builds the 301 redirect map from old URLs to the canonical URLs defined here. Hand off the canonical URL builder, the country slug map, and the list of indexable vs. excluded paths so redirects and sitemap stay consistent.
