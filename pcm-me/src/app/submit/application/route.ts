import { getPayloadClient } from '../../../lib/payload'
import { isNonEmpty, isEmail, isPhone } from '../../../lib/validation'
import { validateCvBuffer } from '../../../lib/uploadConstraints'
import { checkRateLimit, clientKey } from '../../../lib/rateLimit'
import { sendNotification, appDelivery } from '../../../lib/email'
import { LOCALES } from '../../../lib/enums'

// Endpoint is never indexable (PRD §5, §9.5 coordination).
const NOINDEX = { 'X-Robots-Tag': 'noindex' }

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...NOINDEX },
  })

/**
 * Vacancy application capture (PRD §5.5, §6.3, OQ-5). Accepts a multipart
 * submission, validates all fields server-side (authoritative), enforces CV
 * constraints by magic bytes, blocks spam (honeypot + rate limit), then stores
 * the Application and/or emails the recipient per APPLICATION_DELIVERY. Never
 * leaks server paths or stack traces.
 */
export async function POST(req: Request) {
  try {
    if (!checkRateLimit(clientKey(req))) {
      return json({ ok: false, errors: { _: 'RATE_LIMITED' } }, 429)
    }

    const form = await req.formData()

    // Honeypot — silently accept (don't tell bots) but do nothing.
    if (String(form.get('website') || '').trim() !== '') {
      return json({ ok: true }, 200)
    }

    const applicantName = String(form.get('applicantName') || '')
    const applicantEmail = String(form.get('applicantEmail') || '')
    const applicantPhone = String(form.get('applicantPhone') || '')
    const consentGiven = String(form.get('consentGiven') || '') === 'true'
    const vacancyId = String(form.get('vacancyId') || '')
    const sourceLocale = String(form.get('sourceLocale') || '')
    const cv = form.get('cv')

    const errors: Record<string, string> = {}
    if (!isNonEmpty(applicantName)) errors.applicantName = 'REQUIRED'
    if (!isNonEmpty(applicantEmail)) errors.applicantEmail = 'REQUIRED'
    else if (!isEmail(applicantEmail)) errors.applicantEmail = 'INVALID'
    if (!isNonEmpty(applicantPhone)) errors.applicantPhone = 'REQUIRED'
    else if (!isPhone(applicantPhone)) errors.applicantPhone = 'INVALID'
    if (!consentGiven) errors.consentGiven = 'REQUIRED'
    if (!isNonEmpty(vacancyId)) errors.vacancyId = 'REQUIRED'
    if (!(LOCALES as readonly string[]).includes(sourceLocale)) errors.sourceLocale = 'INVALID'

    let buf: Buffer | null = null
    let cvName = ''
    let cvType = ''
    if (!(cv instanceof File) || cv.size === 0) {
      errors.cv = 'REQUIRED'
    } else {
      buf = Buffer.from(await cv.arrayBuffer())
      cvName = cv.name
      cvType = cv.type
      const v = validateCvBuffer(buf, cvType, cvName)
      if (!v.ok) errors.cv = v.error
    }

    if (Object.keys(errors).length > 0) {
      return json({ ok: false, errors }, 400)
    }

    const payload = await getPayloadClient()

    // Validate the vacancy exists (avoids a relation error leaking details).
    const vacancy = await payload.findByID({ collection: 'vacancies', id: vacancyId, depth: 0 }).catch(() => null)
    if (!vacancy) return json({ ok: false, errors: { vacancyId: 'INVALID' } }, 400)

    const delivery = appDelivery()
    const doStore = delivery === 'store' || delivery === 'both'
    const doEmail = delivery === 'email' || delivery === 'both'

    let cvUrl: string | undefined
    if (doStore) {
      const fileDoc = await payload.create({
        collection: 'files',
        data: {},
        file: { data: buf as Buffer, mimetype: cvType, name: cvName, size: (buf as Buffer).length },
      })
      cvUrl = (fileDoc as { url?: string }).url || undefined

      await payload.create({
        collection: 'applications',
        data: {
          vacancy: vacancyId,
          applicantName,
          applicantEmail,
          applicantPhone,
          cvFile: String(fileDoc.id),
          consentGiven: true,
          sourceLocale: sourceLocale as 'ar' | 'en',
        },
        overrideAccess: true,
      })
    }

    if (doEmail) {
      const recipient = process.env.APPLICATIONS_RECIPIENT || 'applications@pcm.me'
      const vacancyTitle = (vacancy as { title?: string }).title || vacancyId
      const html = `
        <h2>New application: ${vacancyTitle}</h2>
        <p><strong>Name:</strong> ${applicantName}</p>
        <p><strong>Email:</strong> ${applicantEmail}</p>
        <p><strong>Phone:</strong> ${applicantPhone}</p>
        <p><strong>Locale:</strong> ${sourceLocale}</p>
        ${cvUrl ? `<p><strong>CV:</strong> <a href="${cvUrl}">${cvName}</a></p>` : ''}
      `
      const attachments =
        !doStore && buf ? [{ filename: cvName, content: buf }] : undefined
      await sendNotification(payload, {
        to: recipient,
        subject: `Application: ${vacancyTitle}`,
        html,
        attachments,
      })
    }

    return json({ ok: true }, 200)
  } catch {
    // Never leak paths/stack traces (PRD §6.4, §5).
    return json({ ok: false, errors: { _: 'SERVER_ERROR' } }, 500)
  }
}
