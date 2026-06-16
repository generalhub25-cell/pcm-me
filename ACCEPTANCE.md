# PRD §13 — Final Acceptance Pass (Session 09)

Status legend: ✅ verified · ⚙️ configured/deferred-to-CI · 🚫 blocked (named OQ) · ◑ partial

| # | §13 item | Status | Evidence |
|---|----------|--------|----------|
| 1 | Every route in §3.1 resolves both locales or clean localized 404 | ✅ | Session 03: all 22 route templates return 200 in `ar`+`en`; `/en/articles/does-not-exist`→404; localized `not-found.tsx` |
| 2 | `ar` full RTL, `en` LTR; switcher → translated equivalents; correct `hreflang` | ✅ | S03: `<html lang dir>`; S06: article `hreflang` ar→sibling `mqal-almy-tjryby`, x-default→/ar |
| 3 | All content types creatable/editable/translatable/publishable by a non-developer (admin) | ✅ | S02: CRUD all 8 types; translation link/unlink; draft→published→archived; editor role verified over HTTP |
| 4 | Jobs filter by country/role/keyword; on-site application; captured/forwarded per OQ-5; missing fields empty | ✅ | S03 filters + S05 keyword (composes); S04 application writes row + emails (`APPLICATION_DELIVERY`); cards render missing fields empty |
| 5 | Migration: counts match source; legacy 301s; no migrated 404s; media + alt_text | 🚫 OQ-21 | No WXR/WP access — corpus import not run (no fabrication). Seed 301 map resolves to canonical; importer + validation tooling ready (S07) |
| 6 | SEO: per-locale title/desc/canonical/OG; JobPosting/Article/NewsArticle/Organization/BreadcrumbList; sitemap + robots | ✅ | S06: metadata + JSON-LD verified; `sitemap.xml` (70 locs, both locales); `robots.txt` disallows admin/api/submit |
| 7 | Performance budget (LCP ≤ 2.5s, CLS < 0.1, INP < 200ms) on article/home/jobs | ⚙️ | S08: `lighthouserc.json` (OQ-17) asserts budgets on the 3 pages × 2 locales; run via `lhci autorun` in CI against a prod build |
| 8 | Mobile-friendly on phone/tablet/desktop, both locales | ◑ | S03 mobile-first tokens + accessible mobile nav (search + switcher reachable); validate visually / via Lighthouse in CI |
| 9 | Security: no errors/paths; `display_errors` off; headers; HTTPS enforced; admin/app access-controlled + non-indexable | ✅ app / ⚙️ host | S08: CSP/HSTS/nosniff/Referrer/X-Frame verified; `/admin`,`/api`,`/submit`→no-store+noindex; generic errors. HTTPS enforcement is host-level (HSTS emitted) |
| 10 | Privacy/consent: GDPR privacy/terms/cookie published; banner gates non-essential until consent + persists | ✅ | S09: bilingual Privacy (lawful basis, application+contact data, retention, rights, contact) / Terms / Cookie, DRAFT-marked; banner SSR-renders first visit, hides once consent cookie set, re-consent link |
| 11 | Accessibility WCAG 2.1 AA on home/article/vacancy (contrast, keyboard, alt text, landmarks) | ◑ | Semantic landmarks (header/main/footer/nav), keyboard-operable nav + forms, `alt_text` enforced at publish (S02), `aria-*` on forms/banner. Full AA audit recommended pre-launch |
| 12 | Ops: backups; centralized error logging; staging used for migration validation before cutover | ⚙️ / 🚫 OQ-21 | S08: backup + centralized-logging runbook documented; staging-based migration validation blocked on OQ-21 |

## Notes

- Items **5** and the staging half of **12** are blocked solely on **OQ-21**
  (legacy WordPress access / WXR export). All tooling is built and ready.
- Items **7**, **8**, **11** require a running production build in CI / a
  browser audit; the configuration and instrumentation are in place.
- Item **9** host-level HTTPS enforcement and **12** ops provisioning depend on
  **OQ-19** (hosting/CDN target).
