# 08_performance_security_deployment.md

**Goal:** Optimize performance (images, caching, CDN, Core Web Vitals), set up environments and deployment, and apply the security hardening that remediates the report's flagged defects.
**Builds on:** Session 03 (templates, design tokens, image usage), Session 04 (upload endpoints/limits), Session 06 (robots/excluded paths), Session 07 (staging + redirect map).
**Out of scope:** Legal copy and the consent banner (Session 09 — though this session ensures analytics/cookies can be gated), content creation. Functional features are already built; this session makes them fast, safe, and deployable.
**Deliverable:** The site meets the performance budget on key pages, serves optimized responsive images behind a CDN/cache, runs in production + staging over enforced HTTPS, exposes no errors or server paths, sends security headers, and keeps admin/application endpoints access-controlled and non-indexable.

## Scope of This Session
Implement PRD Sections 10 (performance/responsive) and 11 (deployment/security), and the report's remediation list (report §6.4, §8). This is deliberately the polish-and-harden session per the splitting heuristics. It touches config and infrastructure more than feature code. The single most important outcome is that the legacy hygiene failures cannot recur: no `display_errors`, no leaked `/customers/.../httpd.www/...` paths, no PHP/stack notices in any response.

## 1. Security Hardening (remediates report §6.4, §8 — highest priority)
- **`display_errors` OFF in production**; route errors to server-side logs only. No stack traces or absolute server paths in ANY response (the legacy `Undefined array key "date" … egypt.php` class of leak must be impossible).
- Security headers: HSTS, X-Content-Type-Options `nosniff`, Referrer-Policy, and a CSP appropriate to the stack (allow the chosen fonts/CDN; gate analytics until consent — Session 09).
- Admin (Session 02), application/contact endpoints (Session 04), and search-internal paths (Session 05) are access-controlled and non-indexable (robots from Session 06; enforce at server too).
- Dependencies/platform patchable and patched (report §8).

## 2. Environments & Deployment (PRD §11.1, §11.2, §11.5)
- **Production** on `pcm.me` (registrar Ascio) and a **staging/preview** environment (the one Session 07 migrated into).
- HTTPS everywhere with auto-renewing certs (Let's Encrypt acceptable, report §6.1); enforce HTTP→HTTPS redirect.
- Hosting target depends on **OQ-1/OQ-19**: stay on Simply.com/One.com only if it can meet this session's requirements; otherwise migrate to a host that can. Record `HOSTING_TARGET` and `CDN_PROVIDER` in README.

## 3. Image Optimization (PRD §10.3, report §8)
- Generate responsive derivatives (`srcset`) in a modern format (WebP/AVIF) with fallback, from originals captured in Sessions 02/07.
- Lazy-load below-the-fold images; set explicit `width`/`height` (stored in Session 01/02/07) to protect CLS.

## 4. Caching / CDN (PRD §10.4, §11.4)
- CDN + caching for static assets and cacheable pages.
- **Cache invalidation on publish** (coordinate with Session 02 publish action and Session 06 sitemap regeneration).
- Caching rules MUST respect the Session 07 redirect map (cache the 301, not a stale 200) and never cache admin/application responses.

## 5. Performance Budget (PRD §10.2 — validate)
Targets on a mid-range mobile over 4G, validated on the Home page, a representative article page, and a jobs page:
- LCP ≤ 2.5 s
- CLS < 0.1
- INP < 200 ms
Validation method (lab Lighthouse CI and/or field) is **OQ-17**; default: Lighthouse CI on the three reference pages in both locales.

## 6. Responsive Verification (PRD §10.1)
- Confirm mobile-first layouts across phone/tablet/desktop in both locales, mobile nav accessible with search + language switcher reachable, tuned tap targets/spacing (audience is heavily mobile/social-referred, report §5.3).
- Apply real brand design tokens now if **OQ-16** is resolved (swap the Session 03 placeholders); otherwise keep placeholders and flag.

## 7. Backups & Logging (PRD §11.6)
- Automated backups of content/database and uploaded files (CVs, media).
- Centralized error/access logging (this is where the now-suppressed errors actually go).

## Open Questions
- OQ-1/OQ-19 hosting + CDN target.
- OQ-16 brand tokens (swap placeholders when available).
- OQ-17 performance validation method (default Lighthouse CI on three pages).
- CV upload max size confirmation (Session 04 default 5 MB) — tune here if needed.

## Acceptance Criteria for Session 8
1. No response anywhere exposes errors, stack traces, or server file paths; `display_errors` off in production; errors go to logs.
2. Security headers present (HSTS, X-Content-Type-Options, Referrer-Policy, CSP); HTTPS enforced with auto-renewing cert and HTTP→HTTPS redirect.
3. Admin/application/search-internal endpoints are access-controlled and non-indexable, enforced at the server (not just robots).
4. Images serve responsive `srcset` in WebP/AVIF with fallback, lazy-loaded, with explicit dimensions; CLS target met.
5. CDN/caching active; cache invalidates on publish; redirects and admin/application responses are handled correctly by cache rules.
6. Performance budget (LCP ≤ 2.5 s, CLS < 0.1, INP < 200 ms) met on Home, an article, and a jobs page in both locales per the chosen method.
7. Production + staging exist; backups and centralized logging configured.

## What Comes Next
Session 09 finishes the launch-blocking compliance and polish: the GDPR-aligned privacy policy, terms, and cookie policy copy in both locales, the cookie consent banner that gates non-essential cookies/analytics (tying into the CSP set here), and a final pass over the full PRD §13 acceptance criteria before cutover. Hand off the analytics/cookie inventory and CSP so the consent banner can gate exactly the right scripts.
