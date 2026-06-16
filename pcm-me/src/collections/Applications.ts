import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access/roles'
import { applicationsCsvEndpoint } from '../endpoints/applicationsCsv'
import { LOCALES, toOptions } from '../lib/enums'

/**
 * Application (PRD §6.3). §3.4 explicit field set. Session 02 adds the admin
 * review list + CSV export (PRD §7.5). Public capture endpoint is Session 04
 * (which writes with overrideAccess); here access is restricted to staff.
 */
export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: {
    useAsTitle: 'applicantName',
    defaultColumns: ['applicantName', 'applicantEmail', 'vacancy', 'createdAt', 'sourceLocale'],
    components: {
      beforeListTable: ['/components/ExportApplicationsButton#ExportApplicationsButton'],
    },
  },
  access: {
    read: isAdminOrEditor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  endpoints: [applicationsCsvEndpoint],
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
