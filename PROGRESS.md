# PROGRESS

Durable per-session ledger. One line per SHIPPED spec: `spec | SHIPPED | date | key files`.

01_foundation_and_data_layer.md | SHIPPED | 2026-06-16 | pcm-me/ scaffold (package.json, next.config.mjs, tsconfig.json, src/app/(payload)/*, src/app/(frontend)/page.tsx), src/payload.config.ts, src/collections/*.ts (Articles, Companies, Vacancies, Applications, Categories, Tags, Authors, Images, Files, Users), src/fields/shared.ts, src/lib/{enums,slug}.ts, src/migrations/20260616_124537_initial.ts, src/seed/run.ts, README.md (STACK_DECISION)
02_admin_and_cms.md | SHIPPED | 2026-06-16 | src/access/roles.ts, Users.ts (roles admin/editor + access), src/fields/{featuring,seo,translationLink}.ts, src/hooks/publish.ts (setPublishedAt + enforceAltTextOnPublish), src/components/{TranslationLink,ExportApplicationsButton}.tsx, src/endpoints/applicationsCsv.ts, src/lib/queries.ts (getFeatured), all collections updated w/ access+featuring+seo+translationLink, src/migrations/20260616_132547_session02_admin.ts, importMap.js
