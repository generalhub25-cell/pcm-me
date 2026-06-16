import type { Endpoint, PayloadRequest } from 'payload'

const csvValue = (v: unknown): string => {
  const s = v === null || v === undefined ? '' : String(v)
  return '"' + s.replace(/"/g, '""') + '"'
}

/**
 * Application CSV export (PRD §7.5). GET /api/applications/export-csv.
 * Restricted to authenticated admin/editor users.
 */
export const applicationsCsvEndpoint: Endpoint = {
  path: '/export-csv',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    const user = req.user as { roles?: string[] } | undefined
    const allowed =
      !!user &&
      Array.isArray(user.roles) &&
      (user.roles.includes('admin') || user.roles.includes('editor'))
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const result = await req.payload.find({
      collection: 'applications',
      depth: 1,
      limit: 0,
      pagination: false,
    })

    const header = [
      'id',
      'vacancy_id',
      'applicant_name',
      'applicant_email',
      'applicant_phone',
      'cv_file',
      'created_at',
      'consent_given',
      'source_locale',
    ]

    const rows = result.docs.map((d) => {
      const vacancy = d.vacancy
      const vacancyId =
        typeof vacancy === 'object' && vacancy !== null ? (vacancy as { id?: string }).id : vacancy
      const cv = d.cvFile
      const cvVal =
        typeof cv === 'object' && cv !== null
          ? (cv as { url?: string; filename?: string; id?: string }).url ||
            (cv as { filename?: string }).filename ||
            (cv as { id?: string }).id
          : cv
      return [
        d.id,
        vacancyId,
        d.applicantName,
        d.applicantEmail,
        d.applicantPhone,
        cvVal,
        d.createdAt,
        d.consentGiven,
        d.sourceLocale,
      ]
        .map(csvValue)
        .join(',')
    })

    const csv = [header.join(','), ...rows].join('\n')
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="applications.csv"',
      },
    })
  },
}
