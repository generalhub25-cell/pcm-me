# 05_search.md

**Goal:** Implement site-wide, locale-aware search across Article, News, Vacancy, and Company, and wire the jobs keyword filter and the search results page.
**Builds on:** Session 01 (content schema, locales), Session 02 (published items), Session 03 (search shell at `/{locale}/search`, jobs index keyword filter stub), Session 04 (knows which endpoints to exclude).
**Out of scope:** Indexing structured data for Google (Session 06 handles JSON-LD/SEO), performance tuning of the index/CDN (Session 08), migration (Session 07). Search ranking polish beyond basic relevance is optional.
**Deliverable:** A working `/{locale}/search` that returns published `Article` (all kinds), `Vacancy`, and `Company` results scoped to the active locale by default with an option to include both locales, results grouped/filterable by content type, plus a functional keyword filter on the jobs index.

## Scope of This Session
Implement PRD §5.7. Search is isolated as its own session because the backend choice (OQ-8) and indexing concerns are distinct from templating. Reuse the results shell Session 03 built and the jobs filter controls it stubbed. Keep it scoped to published content and respect locale. The session ends when queries return relevant, locale-correct, type-grouped results and the jobs keyword filter works.

## 1. Search Backend (Decisions Needed — OQ-8)
PRD **OQ-8** is unresolved: built-in DB full-text vs. a search service (Meilisearch/Algolia/Elasticsearch).
- **Default:** start with the database's native full-text search to avoid an extra dependency. Abstract search behind a single `search(query, {locale, types, includeAllLocales})` interface so a service can replace the implementation later without touching callers.
- Record `SEARCH_BACKEND` in README.

## 2. What Is Searchable (PRD §5.7)
- Index/query only `published` items.
- Types: `Article` (kinds scientific/news/reference), `Vacancy`, `Company`.
- Fields searched: titles, excerpts/summaries, body, employer/company name, tags, category names. Exclude admin-only and `Application` data entirely.
- Exclude the application/contact endpoints (Session 04) and admin from any index.

## 3. Locale Scoping (PRD §5.7, §4.1)
- Default: search only the active locale.
- Provide a toggle to search both locales; results then label each result's locale and link to its locale-correct URL.

## 4. Results Page (PRD §5.7)
- Fill the Session 03 `/{locale}/search` shell.
- Show results grouped by content type OR with a type filter (pick one; grouped preferred).
- Each result: title, type badge, snippet with matched terms, link to the canonical localized URL, and for vacancies the country/role_type.
- Empty-query and no-results states render cleanly (no errors, RTL-correct).
- Paginate results consistent with PRD §10.4 (default page size 12, OQ-18).

## 5. Jobs Keyword Filter (PRD §5.4)
- Wire the keyword box Session 03 stubbed on `/{locale}/jobs` and `/{locale}/jobs/{country}` to filter vacancies by keyword, combinable with the existing country/role_type/employer filters.
- Filtering must compose (keyword + country + role_type together).

## Open Questions
- OQ-8 search backend (default: DB full-text behind an abstraction).
- OQ-18 results page size (default 12).

## Acceptance Criteria for Session 5
1. `/{locale}/search` returns relevant results across Article, Vacancy, and Company for published content only.
2. Results are scoped to the active locale by default, with a working option to include both locales; cross-locale results link to the correct localized URL.
3. Results are grouped (or type-filterable); each result links to its canonical localized URL; vacancy results show country/role_type.
4. Empty-query and no-results states render cleanly and RTL-correct.
5. The jobs keyword filter works and composes with country/role_type/employer filters.
6. `Application`/contact/admin data is never returned by search; application/admin endpoints are not indexed.
7. `SEARCH_BACKEND` recorded; search is callable through a single abstraction so the backend can be swapped.

## What Comes Next
Session 06 layers SEO output across the whole site: per-page/per-locale meta tags, Open Graph/Twitter, JSON-LD (`Article`/`NewsArticle`, `JobPosting`, `Organization`, `BreadcrumbList`), `hreflang`/`x-default`, canonical tags, `sitemap.xml`, and `robots.txt` (which must disallow the admin/application/search-internal endpoints surfaced here). Hand off the canonical URL builder and the search/exclusion paths.
