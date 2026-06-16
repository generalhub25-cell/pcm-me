import type { CollectionConfig } from 'payload'

import { LOCALES, toOptions } from '../lib/enums'

/**
 * Application (PRD §6.3 — new entity; capture/forward/retention logic is
 * Session 04, OQ-5). §3.4 enumerates an explicit field set that overrides
 * the shared-fields rule: id, vacancy_id, applicant_name, applicant_email,
 * applicant_phone, cv_file -> File.id, created_at, consent_given,
 * source_locale.
 *
 * Session 01 only creates the table/collection. The submission endpoint is
 * NOT built here (Session 04).
 */
export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: {
    useAsTitle: 'applicantName',
  },
  fields: [
    {
      name: 'vacancy',
      type: 'relationship',
      relationTo: 'vacancies',
    },
    {
      name: 'applicantName',
      type: 'text',
    },
    {
      name: 'applicantEmail',
      type: 'email',
    },
    {
      name: 'applicantPhone',
      type: 'text',
    },
    {
      name: 'cvFile',
      type: 'relationship',
      relationTo: 'files',
    },
    {
      name: 'consentGiven',
      type: 'checkbox',
    },
    {
      name: 'sourceLocale',
      type: 'select',
      options: toOptions(LOCALES),
    },
  ],
}
