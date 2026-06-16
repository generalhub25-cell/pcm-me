# 04_jobs_application_and_lead_capture.md

**Goal:** Build the on-site vacancy application / lead-capture flow that replaces the legacy email/WhatsApp-only workflow, plus the shared contact form.
**Builds on:** Session 01 (`Application`/`File`/`Vacancy` schema, enums), Session 02 (admin Application list/export), Session 03 (vacancy detail apply slot + contact page + form styling).
**Out of scope:** Job *listing/filtering/display* (done in Session 03), search (Session 05), SEO `JobPosting` markup (Session 06), migration of vacancies (Session 07), upload performance/CDN specifics (Session 08 may tune limits), consent banner (Session 09 — but the per-form consent checkbox is built here).
**Deliverable:** A working application form on every vacancy detail page that validates input, accepts a CV upload, requires consent, blocks spam, and persists an `Application` (and/or emails it per OQ-5); plus a working contact form. Submissions appear in the Session 02 admin list.

## Scope of This Session
Implement PRD §5.5 and the `Application` half of §6.3 — the one genuinely new capability versus the legacy site (report §7.2, §8). This is isolated from display logic so it can be built and debugged on its own. It fills the apply slot Session 03 left in the vacancy template and reuses the contact-form styling. The session ends when a real submission round-trips: form → validation → storage/forwarding → visible in admin.

## 1. Application Capture Behavior (Decisions Needed — OQ-5)
PRD **OQ-5** is unresolved: store server-side, email to a recipient, or both; who receives; retention period. Build for the superset so either answer works:
- **Default:** store the `Application` row AND send a notification email to a configurable recipient address (env `APPLICATIONS_RECIPIENT`). If OQ-5 says store-only or email-only, toggle via config `APPLICATION_DELIVERY = store|email|both` (default `both`).
- Retention/auto-purge is **OQ-5**; expose a config `APPLICATION_RETENTION_DAYS` (default: unset = keep). Document in privacy policy via Session 09.

## 2. Application Form (PRD §5.5, §6.3, §8.5)
Rendered in the vacancy-detail apply slot from Session 03. Fields:
- `applicant_name` (required, text)
- `applicant_email` (required, valid email)
- `applicant_phone` (required, phone format; accept international)
- `cv_file` (required, file upload)
- `consent_given` (required checkbox; links to privacy policy — Session 09)
- hidden: `vacancy_id` (from page), `source_locale` (from route locale)

Behavior: inline validation, accessible labels, success and error states, RTL-correct in `ar` (PRD §8.5). On success, clear form and show confirmation; keep the legacy `apply_email`/`apply_whatsapp` visible as secondary options (never the only path).

## 3. CV Upload Constraints (PRD §6.7, §8.5)
- Allowed types: PDF, DOC, DOCX. Reject others client- AND server-side.
- Max size: default **5 MB** (confirm/tune in Session 08). Reject oversize on both sides with a clear message.
- Store as `File` (Session 01: `mime_type`, `size_bytes`, `original_name`), link via `Application.cv_file`.
- Validate real content type server-side, not just extension.

## 4. Spam & Abuse Protection (PRD §8.6 context, security)
- Add bot protection (honeypot field + rate limiting at minimum; CAPTCHA choice is **OQ — not in PRD**, default to a privacy-friendly mechanism). Do NOT auto-solve any CAPTCHA.
- Rate-limit submissions per IP/session.
- Server-side validation is authoritative; never trust client validation alone.

## 5. Server Handling
- Endpoint accepts multipart submission, validates all fields (Section 2/3), writes `Application` with `created_at`, `consent_given`, `source_locale`.
- Per `APPLICATION_DELIVERY`, also email the recipient with applicant details + CV link/attachment.
- Endpoint is NOT publicly indexable (coordinate with Session 06 robots + Session 08 hardening).
- On any field missing/invalid, return field-level errors; never leak server paths or stack traces (remediates report §6.4).

## 6. Contact Form (PRD §5.8 contact, §8.5)
Reuse the same styling/validation. Fields: name, email, message (+ honeypot + consent). Delivery: email to a configurable contact recipient (env `CONTACT_RECIPIENT`). No CV upload. Same anti-spam and error-handling rules.

## Open Questions
- OQ-5 store/email/both + recipient + retention (default `both`, retain).
- CAPTCHA mechanism (not specified in PRD) — default privacy-friendly, never auto-solved.

## Acceptance Criteria for Session 4
1. Every vacancy detail page renders a working application form in the apply slot, in both locales, RTL-correct in `ar`.
2. Required-field and email/phone validation work client- and server-side with accessible inline errors.
3. CV upload accepts PDF/DOC/DOCX up to the size limit and rejects other types/oversize on both sides, validating real content type server-side.
4. Consent checkbox is required and links to the privacy policy route.
5. A successful submission writes an `Application` (with `vacancy_id`, `source_locale`, `consent_given`) and, per config, emails the recipient; the row appears in the Session 02 admin list and CSV export.
6. Honeypot + rate limiting are active; the endpoint is non-indexable; no server paths/stack traces ever appear in responses.
7. Contact form works and delivers to the configured recipient with the same protections.

## What Comes Next
Session 05 adds site-wide search across Article, News, Vacancy, and Company, wiring the keyword filter Session 03 stubbed on the jobs index and filling the search results shell. Hand off the `Application` endpoint path (so it can be excluded from indexing/search) and the vacancy field set used in cards.
