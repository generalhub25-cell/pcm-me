# Sanitized SQLite Public Content Export

Created for GitHub review as a safe public-content database.

## Included

- Published articles/posts with safe public fields.
- Article category and tag names/slugs.
- Published jobs/vacancies with public fields only.
- Published companies with public fields only.
- Published categories and tags.
- Authors by public display name only.
- Media metadata, filenames, and exported local media paths.

## Excluded

- Raw Payload database files.
- Users/admin accounts.
- Password hashes.
- Sessions.
- Applications and contact form submissions.
- Cookies.
- API keys, tokens, and secrets.
- Private settings and Payload internal preference/lock tables.
- Raw article body content; articles include body_text_length only.
- Job apply email and WhatsApp fields.

## Filename Sanitization

The source media record `68-getdata.php` contains JPEG bytes, but its original extension was `.php`.
It is represented in this database as `filename = 68-getdata.php` and
`exported_filename = 68-getdata.php.jpg` for safe public GitHub export.
