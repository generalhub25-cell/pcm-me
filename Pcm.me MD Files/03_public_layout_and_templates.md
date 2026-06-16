# 03_public_layout_and_templates.md

**Goal:** Build the public site shell (header, footer, navigation, language switcher) with correct RTL/LTR behavior, locale routing, and all read-only page templates except jobs-apply, search, and SEO output.
**Builds on:** Session 01 (schema, locales) and Session 02 (published content, featuring, translation links).
**Out of scope:** The vacancy application form + submission handling (Session 04 — but the vacancy *detail template* is built here with a placeholder apply slot), search UI/backend (Session 05), JSON-LD/meta tag rendering (Session 06), migration (Session 07), image optimization/caching (Session 08), legal page copy & consent banner (Session 09 — the legal page *routes/templates* are stubbed here).
**Deliverable:** A browsable bilingual site: every route in PRD §3.1 renders published content with a global header/footer, RTL for `ar` and LTR for `en`, a working language switcher, breadcrumbs, and pagination — minus apply, search, structured data, and consent, which later sessions slot in.

## Scope of This Session
Implement PRD Sections 3, 4, and 5 as templates over the Session 02 data. This is the visual and navigational backbone. The hardest requirement is genuine bilingual/RTL correctness: document direction, mirrored layout, and a language switcher that lands on the translated equivalent. Build every page template, but leave clearly marked insertion points for apply (Session 04), search results (Session 05), structured data/meta (Session 06), and the consent banner (Session 09). Use design tokens; exact values may be placeholder until Session 08/OQ-16 supplies brand values.

## 1. Locale Routing (PRD §3, §4.1)
- All routes locale-prefixed: `/{locale}/...`, `locale ∈ {ar, en}`.
- Document MUST set `lang` and `dir`: `ar`→`dir="rtl"`, `en`→`dir="ltr"` on the root element, affecting the whole layout.
- Bare `/` behavior is **OQ-2**. Default: redirect `/` → `/ar/` (ar is default audience language). Record as `ROOT_REDIRECT` in README; Session 06 sets `hreflang x-default` to match.
- Clean localized 404 for missing content (Acceptance #1 references this).

## 2. Route Table to Implement (PRD §3.1)
Build templates for every row:
`/{locale}/` (Home), `/{locale}/articles`, `/{locale}/articles/{slug}`, `/{locale}/news`, `/{locale}/news/{slug}`, `/{locale}/categories/{category_slug}`, `/{locale}/categories/{category_slug}/{subcategory_slug}`, `/{locale}/jobs`, `/{locale}/jobs/{country}`, `/{locale}/jobs/{country}/{slug}`, `/{locale}/companies`, `/{locale}/companies/{slug}`, `/{locale}/skills/{track_slug}`, `/{locale}/quick-mba`, `/{locale}/immigration`, `/{locale}/interactions`, `/{locale}/search` (shell only; Session 05 fills it), `/{locale}/about`, `/{locale}/contact`, `/{locale}/privacy-policy` (stub), `/{locale}/terms` (stub), `/{locale}/cookie-policy` (stub).
- `articles` lists `Article kind=scientific`; `news` lists `Article kind=news`; `interactions` lists `Article kind=reference` (OQ-7 default).
- Country slug map (repeat from Session 01): `egypt, emirates, ksa, kuwait, north-africa, general`.

## 3. Header (PRD §4.2)
In logical order, mirrored under RTL:
1. PCM logo → `/{locale}/`.
2. Primary navigation (Section 4 below).
3. Search entry point → `/{locale}/search`.
4. **Language switcher**: swaps current page between `ar`/`en`. If the current item has a translation sibling (`translation_group_id`, Session 01/02), link to that exact URL; otherwise fall back to the other locale's home. The switcher's target URLs are reused by Session 06 for `hreflang`.

## 4. Primary Navigation / IA (PRD §4.4)
Top-level: Home, Articles, News, Jobs (sub-nav: Egypt, Emirates, KSA, Kuwait, North Africa, General), Companies, Skills (sub-nav: Business, Basic, Life, Manager, Product Manager), Quick MBA, Immigration, Interactions/Medicines, About. Tests & procedures / Nuclear Pharmacy / Biotechnology / Diseases / OTC are categories surfaced via a Topics menu (OQ-7). Mobile nav collapses to an accessible menu keeping search + language switcher reachable (PRD §10.1).

## 5. Footer (PRD §4.3)
About blurb; footer nav columns (main sections; legal: Privacy/Terms/Cookie; social: Facebook min, others OQ-10); brand contact line (public address is **OQ-6**; default to email/contact-page link until resolved); copyright with current year.

## 6. Breadcrumbs (PRD §4.5)
On every page except Home, reflecting route hierarchy, mirrored under RTL. Emit a placeholder/slot so Session 06 can attach `BreadcrumbList` JSON-LD.

## 7. Page Content (PRD §5)
- **Home (§5.1):** featured block (Session 02 featuring query, this locale, ordered); latest articles; latest news; latest/featured vacancies; optional featured company/topic. Empty blocks hide gracefully.
- **Article/News index (§5.2):** paginated card list (title, excerpt, thumbnail, category, `published_at`, author); category filter; newest-first default sort.
- **Article/News detail (§5.3):** title, author, `published_at`, category, hero image, rich-text body, tags, related content, social share. Leave a slot for Article/NewsArticle JSON-LD (Session 06).
- **Jobs index & country (§5.4):** filter controls (country, role type, employer if present, keyword — keyword wired in Session 05); vacancy cards (title, employer, country, role_type, `posted_at`, summary). **Missing fields render empty, never as errors** (remediates report §6.4 / `egypt.php`). Country page = list pre-filtered by `country`.
- **Vacancy detail (§5.5):** full description, requirements, location, employer, role_type, posted/expires. Render an **apply slot** — a clearly marked placeholder where Session 04 inserts the on-site application form. Legacy `apply_email`/`apply_whatsapp` shown as secondary contact, never the only path.
- **Companies (§5.x):** index list; profile page (logo, body, external_url, founded, headquarters).
- **Skills track / Quick MBA / Immigration / Interactions:** category-archive or hub templates listing their content.
- **About/Contact:** About renders mission/values (report §2.1); Contact renders a contact form (shares styling with apply form, Session 04) + contact details.
- **Legal routes:** privacy/terms/cookie templates as stubs; copy and consent in Session 09.

## 8. Design Tokens & RTL (PRD §8.2, §8.3)
- Centralize color, type scale, spacing, radius, breakpoints as tokens.
- Load an Arabic-capable font for `ar`, a Latin font for `en`, with `font-display: swap`.
- Exact brand values are **OQ-16**; use sensible placeholders now, swapped in Session 08. Layout must mirror correctly under RTL (nav, breadcrumbs, pagination, prev/next).

## Open Questions
- OQ-2 root redirect / default locale.
- OQ-6 public contact details for footer.
- OQ-7 topic-nav membership and reference modeling.
- OQ-10 social links.
- OQ-16 brand tokens (placeholder until then).

## Acceptance Criteria for Session 3
1. Every route in PRD §3.1 renders published content in both locales, or a clean localized 404.
2. `ar` renders full RTL (root `dir`, mirrored nav/breadcrumbs/pagination); `en` renders LTR.
3. Language switcher moves to the translated equivalent when one exists, else the other locale's home.
4. Header, footer, primary + sub navigation, and mobile collapsed nav all work and keep search + language switcher reachable.
5. Home shows featured + latest blocks per locale; empty blocks hide cleanly.
6. Index pages paginate and filter; detail pages render all fields; missing fields render empty (no errors).
7. Vacancy detail shows a clearly marked apply slot; legacy email/WhatsApp shown only as secondary.
8. Legal/search pages exist as stubs/shells for later sessions.

## What Comes Next
Session 04 replaces the vacancy apply slot with the real on-site application + lead-capture flow: the form, validation, CV upload, spam protection, consent checkbox, and server handling that writes the `Application` entity (and/or emails it per OQ-5). Hand off the apply-slot location, the contact-form styling, and the `Vacancy` fields available on the detail page.
