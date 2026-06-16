# 09_legal_consent_and_final_acceptance.md

**Goal:** Ship the GDPR-aligned legal pages and cookie consent banner, then run the full acceptance checklist and prepare cutover.
**Builds on:** Session 03 (legal page stubs, footer legal links), Session 04 (forms reference the privacy policy + consent), Session 08 (CSP, analytics/cookie inventory, environments).
**Out of scope:** Building new features. This is the final session; everything functional already exists. It adds compliance copy, consent gating, and a verification pass.
**Deliverable:** Published, bilingual Privacy Policy, Terms of Use, and Cookie Policy; a working RTL-correct cookie consent banner that blocks non-essential cookies/analytics until consent and persists the choice; and a completed PRD §13 acceptance pass with a documented cutover.

## Scope of This Session
Implement PRD §5.8, §8.6, and the consent half of §6.3, then validate against PRD Section 13. The legacy site's privacy policy was generic and pre-GDPR (report §6.3) despite an EU (Cyprus) operator, so this is genuinely launch-blocking. The consent banner must gate exactly the scripts catalogued in Session 08's CSP/analytics inventory. The session ends with a green acceptance checklist and a cutover record.

## 1. Legal Pages (PRD §5.8, §6.3; report §6.3, §8)
Fill the Session 03 stubs at `/{locale}/privacy-policy`, `/{locale}/terms`, `/{locale}/cookie-policy`, in both `ar` and `en`.
- **Privacy Policy (GDPR-aligned):** lawful basis; data collected — explicitly including job applications (name, email, phone, CV — Session 04), contact-form data, and analytics/cookies; retention (incl. `APPLICATION_RETENTION_DAYS` from Session 04 / OQ-5); user rights (access, rectification, erasure, objection); and a contact for data requests (the public contact, OQ-6).
- **Terms of Use** and **Cookie Policy** present and linked from footer (Session 03) and the consent banner.
- **Decisions Needed — OQ-11:** who provides/approves the legal copy? Default: draft compliant copy for review and mark it **"DRAFT — pending legal review"** in an admin note; do not represent it as lawyer-approved.

## 2. Cookie Consent Banner (PRD §8.6, report §8)
- Banner blocks non-essential cookies/analytics until the user consents; persists the choice; offers accept/reject and a link to the Cookie Policy.
- Gates exactly the scripts in Session 08's CSP/analytics inventory — essential cookies only before consent.
- RTL-correct in `ar`, LTR in `en`; accessible (keyboard, focus, contrast).
- Re-consent path available (user can change choice later).

## 3. Final Acceptance Pass (PRD §13 — run all 12)
Verify and record evidence for each:
1. Every route in PRD §3.1 resolves in both locales or returns a clean localized 404.
2. `ar` full RTL; `en` LTR; language switcher hits translated equivalents; correct `hreflang`.
3. All content types creatable/editable/translatable/publishable by a non-developer (admin, Session 02).
4. Jobs filter by country/role/keyword; vacancy detail offers on-site application; submission captured/forwarded per OQ-5; missing fields render empty, never errors.
5. Migration: published counts match source; legacy URLs 301 to correct new URLs; no migrated 404s; media + `alt_text` present.
6. SEO: per-locale title/description/canonical/OG; `JobPosting`/`Article`/`NewsArticle`/`Organization`/`BreadcrumbList` validate; sitemap + robots correct.
7. Performance budget met on article, home, jobs pages (Session 08 method).
8. Mobile-friendly and well-laid-out on phone/tablet/desktop in both locales.
9. Security: no errors/paths in responses; `display_errors` off; headers present; HTTPS enforced; admin/application endpoints access-controlled and non-indexable.
10. Privacy/consent: GDPR privacy policy, terms, cookie policy published; banner gates non-essential cookies until consent and persists choice.
11. Accessibility: WCAG 2.1 AA on home, an article, a vacancy page (contrast, keyboard, alt text, landmarks).
12. Ops: backups configured; centralized error logging; staging used for migration validation before cutover.

## 4. Cutover
- Confirm Session 07 validation passed in staging.
- Execute cutover to production on `pcm.me`; verify redirects resolve on production; verify TLS and headers live.
- Record a short cutover log (date, what was promoted, redirect-map version, any deferred items).

## Open Questions
- OQ-11 legal copy ownership/approval (default: draft for review, marked DRAFT).
- OQ-5 retention period to state in the privacy policy.
- OQ-6 public contact for data requests.
- Any OQ still open at this point is listed in the cutover log as a deferred item, not silently closed.

## Acceptance Criteria for Session 9
1. Privacy Policy, Terms, and Cookie Policy are published in both `ar` and `en` and linked from the footer; privacy policy covers job-application and contact data, retention, rights, and a contact.
2. Cookie consent banner blocks non-essential cookies/analytics until consent, persists the choice, allows re-consent, and is RTL-correct and accessible.
3. The banner gates exactly the scripts in the Session 08 inventory; essential-only before consent.
4. All 12 PRD §13 acceptance items verified with recorded evidence.
5. Cutover to production executed (or explicitly gated on a named blocker), with redirects, TLS, and headers verified live and a cutover log recorded.

## What Comes Next
This is the final session. Post-launch, monitor logs and Core Web Vitals, resolve any deferred Open Questions recorded in the cutover log, and feed new editorial/jobs content through the Session 02 admin. No further build session is required for the scope in this PRD.
