# Cutover Log

**Date:** 2026-06-16
**Status:** ⛔ GATED — not promoted to production. Cutover is explicitly gated on
named blockers (per PRD §12.5 / §13.5: cutover only after migration validation
passes in staging).

## What is ready to promote

- Full application: data layer, admin/CMS, bilingual public site (ar/en, RTL/LTR),
  on-site application + contact capture, site search, SEO output (metadata,
  JSON-LD, hreflang, sitemap, robots), security headers, image optimization,
  cache invalidation on publish, legal pages + cookie consent.
- Seed 301 redirect map live and resolving to canonical URLs; `redirect-map.csv`
  generator ready.

## Blockers gating cutover

1. **OQ-21 (legacy access) — BLOCKS migration.** No WordPress admin/DB access or
   WXR export + media archive is available, so the legacy corpus has not been
   imported and the §12.5 validation (published counts match source, every
   migrated URL 301s, no migrated 404s) cannot be run. Per spec, no content was
   fabricated. Provide a WXR export + media archive, then run
   `WXR_PATH=<file> DATABASE_URI=<staging> npm run migrate:import`,
   `npm run migrate:redirect-map`, `npm run migrate:validate`.
2. **OQ-19 (hosting/CDN target) — BLOCKS production/staging provisioning.**
   Production (`pcm.me`) and staging environments, auto-renewing TLS, and the
   CDN are not provisioned in this environment. Record `HOSTING_TARGET` /
   `CDN_PROVIDER` and provision per the Session 08 runbook (README).

## Deferred Open Questions (carried, not silently closed)

- OQ-6 public contact details (footer + data-request contact).
- OQ-10 social links beyond Facebook.
- OQ-11 legal copy ownership/approval (currently DRAFT — pending legal review).
- OQ-12 real author data.
- OQ-16 brand design tokens (placeholders in use).
- OQ-17 performance validation method (Lighthouse CI default configured).

## Cutover procedure (once blockers cleared)

1. Provision production + staging (OQ-19); enforce HTTPS + HSTS; attach CDN.
2. Import legacy corpus into staging (OQ-21); run migration validation until green.
3. Regenerate `redirect-map.csv`; confirm every legacy URL 301s, no 404s.
4. Run Lighthouse CI; confirm the §10.2 budget on Home/article/jobs in both locales.
5. Promote to production; verify live redirects, TLS, and security headers.
6. Append the executed cutover entry (date, redirect-map version, deferred items) here.
