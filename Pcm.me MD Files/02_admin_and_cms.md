# 02_admin_and_cms.md

**Goal:** Give non-developers a working admin to create, edit, translate, and publish every content type, plus media management and Application export.
**Builds on:** Session 01 (schema, enums, locale model, ID/slug conventions).
**Out of scope:** Public-facing templates and layout (Session 03), the public vacancy application *submission* form and its server handling (Session 04), search (Session 05), SEO metadata fields rendering on the front end (Session 06 consumes the metadata fields defined here), migration import (Session 07), performance (Session 08), legal copy (Session 09).
**Deliverable:** An authenticated admin where an editor can perform full CRUD on all types from Session 01, edit `ar` and `en` versions and link them as translations, move items through `draft→published→archived`, feature items for Home, manage images with enforced `alt_text`, and view/export `Application` submissions.

## Scope of This Session
Build the content-management capability described in PRD Section 7. The public site is read-only over this data; this session is where humans put data in and govern its lifecycle. It must honor the locale model and translation linking from Session 01, enforce the publish-time rules (notably `alt_text` on images), and provide the editorial affordances later sessions rely on (Home featuring, status/`published_at`). It stops at the admin boundary — no public rendering.

## 1. Stack Note (Decisions Needed)
Admin technology depends on **OQ-1** (Session 01 `STACK_DECISION`):
- WordPress → native admin + custom post types/fields; this session configures and constrains it.
- Headless CMS (Payload/Strapi/Sanity) → its admin is configured to match Section 01 schema.
- Custom → build the admin screens.
Implement against whatever `STACK_DECISION` says; the capabilities in this file are mandatory regardless of product.

## 2. Authentication & Roles (PRD §7.7)
- Authenticated admin; public cannot reach it (enforced again at deploy in Session 08).
- Minimum roles: **admin** and **editor**. Exact role set/permissions are **OQ-15**. Default: admin (all), editor (CRUD content, cannot manage users/roles).

## 3. CRUD for All Types (PRD §7.1)
Full create/read/update/delete for: `Article`, `Company`, `Vacancy`, `Category`, `Tag`, `Author`, `Image`, `File`. Field sets exactly as Session 01 Section 3. Enforce:
- `slug` unique within `(type, locale)` (PRD §6.9). Auto-generate from title, editable, ASCII-transliterated for Arabic by default (OQ-14).
- `Article.kind` ∈ `scientific|news|reference`; this controls which public index the item later appears under (Session 03).
- `Vacancy.country` ∈ `egypt|emirates|ksa|kuwait|north_africa|general`; `Vacancy.role_type` ∈ `medical_representative|product_specialist|territory_manager|other`.

## 4. Bilingual Editing & Translation Linking (PRD §7.2, §4.2, §9.4)
- Editor can create/edit `ar` and `en` versions of an item.
- Editor can link two items as translations of each other (sets shared `translation_group_id` from Session 01) and unlink them.
- UI must show, for any item, whether a translation in the other locale exists and link to it.
- An item may exist in only one locale (no forced pairing).

## 5. Publish Workflow (PRD §7.3)
- `status`: `draft → published → archived`, with the ability to return to draft.
- Setting status to `published` requires `published_at`; default it to now if empty.
- Only `published` items are exposed to the public site (Session 03) and sitemap (Session 06).
- `archived` items are retained but not publicly listed (relevant to expired vacancies, OQ-20, handled in Session 07).

## 6. Home Featuring Controls (PRD §5.1, §7.4)
- A per-locale mechanism to mark items as featured for the Home page and to order the featured set.
- Featuring is locale-specific (featuring an `ar` article does not feature its `en` sibling).
- Expose this so Session 03's Home can query "featured, this locale, ordered."

## 7. Media Library (PRD §6.7, §7.6, §8.4, §9)
- Upload and manage `Image` and `File`.
- **`alt_text` is required to publish any item that uses an image**: block or warn-then-block publish when a referenced image lacks `alt_text` in the item's locale. (Accessibility + SEO; PRD §8.4, §9.)
- Store image `width`/`height` on upload (needed for CLS protection in Session 08).
- Responsive derivative generation may be deferred to Session 08, but capture originals + dimensions now.

## 8. SEO Metadata Fields (defined here, rendered in Session 06)
Add editable per-item, per-locale fields so Session 06 can render them: `meta_title` (nullable, falls back to `title`), `meta_description` (nullable, falls back to `excerpt`), `og_image` → Image.id (nullable, falls back to `hero_image`). Define and store now; do not render.

## 9. Application Review & Export (PRD §6.3, §7.5)
- List `Application` submissions with `vacancy_id`, `applicant_name`, `applicant_email`, `applicant_phone`, `cv_file` download, `created_at`, `consent_given`, `source_locale`.
- Export to CSV.
- Retention controls depend on **OQ-5** (store/email/both + retention period). Build the list/export now; the capture endpoint is Session 04.

## Open Questions
- OQ-1 stack (drives admin product).
- OQ-5 application retention/recipient (affects what export must support and any auto-purge).
- OQ-12 do real authors exist to manage?
- OQ-15 exact roles/permissions.

## Acceptance Criteria for Session 2
1. Admin is authenticated; unauthenticated users cannot access it.
2. Full CRUD works for all eight content types with exact Session 01 fields and enums.
3. An editor can create an `ar` and an `en` version of an article and link them as translations; the link is visible from both.
4. `draft→published→archived` transitions work; publishing sets/honors `published_at`; only `published` items will be public.
5. Featured-for-Home selection works per locale and is queryable.
6. Image upload stores dimensions; publishing an item with an image lacking locale `alt_text` is blocked (or hard-warned then blocked).
7. `meta_title`/`meta_description`/`og_image` fields exist and persist per locale.
8. Application list renders and exports to CSV with CV download.

## What Comes Next
Session 03 builds the public-facing layout and content templates (header, footer, locale-aware RTL/LTR navigation, language switcher, Home, indexes, detail pages) reading the `published` content governed here. Hand off the final admin field names, the featuring query, the SEO metadata field names, and the translation-link representation so Session 03 can render language switching and `hreflang` correctly.
