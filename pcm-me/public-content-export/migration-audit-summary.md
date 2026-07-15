# Migration Audit Summary

This GitHub repository contains the PCM rebuild source code plus a sanitized public content export for reviewer confirmation.

## What is included

- Public content counts for articles, jobs, companies, categories, tags, authors, and media metadata.
- Full safe metadata exports for published articles, vacancies/jobs, companies, and image media records.
- Article bodies are represented by body text length only, not raw body content.

## What is excluded

- The raw Payload database is not included for security.
- Environment files, API keys, secrets, users/admin accounts, password hashes, sessions, applications, contact submissions, cookies, and private settings are not included.
- Uploaded private files such as CVs are not included.
- Local uploaded images are not committed; media evidence is provided through the sanitized media manifest.

## Legacy URL migration

- Old URLs were tested 30/30 PASS.
- The legacy URL resolver commit is present in Git history.

## Live site safety

- Live pcm.me was not touched.
- No DNS changes were made.
- No deployment was performed as part of this export.
