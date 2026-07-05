# LAUNCH_PROGRESS.md — go-live tracker (free stack)

Resume rule: re-read this file on every resume; continue at the first unchecked step.
NEVER put real secrets/keys/connection-strings in this file — those live only in
`.env` (gitignored) locally and in the Render dashboard. Here we only record STATUS.

## Target free stack
- Host: **Render** (Free web service) — runs the Node app
- DB: **Neon** (Free) — Postgres
- Uploads: **Supabase Storage** (Free, S3-compatible) via `@payloadcms/storage-s3`
- Email: **Resend** (Free) via email adapter
- Domain: **pcm.me** (owned on one.com) — DNS only, no one.com hosting
- NOT Vercel (Payload exit 128). NOT Cloudflare R2 (asks for card).

## Checklist
- [x] STEP 0 — Prep: docs read, tracker created, `npm run build` GREEN (exit 0)
- [x] STEP 1 — Neon DB: connection string received; schema pushed + seeded on Neon (default admin created; string in .env.neon, gitignored)
- [~] STEP 2 — Supabase Storage: storage-s3 adapter ADDED (gated on S3_* env) → WAITING on human for bucket + S3 keys → then test
- [~] STEP 3 — Resend email: email-resend adapter ADDED (gated on RESEND_API_KEY) → will collect key after Supabase
- [ ] STEP 4 — Render hosting: render.yaml ready, push → human creates service + env vars → deploy
- [ ] STEP 5 — Change admin email/password to real values (human chooses)
- [ ] STEP 6 — Domain: add pcm.me in Render → human sets DNS on one.com
- [ ] STEP 7 — Verify live (https, admin, ar/en, image from Supabase, contact form)
- [ ] DONE — final summary (English + Egyptian Arabic)

## Log
- STEP 0: started. Building to confirm current state…
