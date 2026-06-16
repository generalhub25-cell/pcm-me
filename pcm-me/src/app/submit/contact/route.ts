import { getPayloadClient } from '../../../lib/payload'
import { isNonEmpty, isEmail } from '../../../lib/validation'
import { checkRateLimit, clientKey } from '../../../lib/rateLimit'
import { sendNotification } from '../../../lib/email'

const NOINDEX = { 'X-Robots-Tag': 'noindex' }
const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...NOINDEX },
  })

/**
 * Contact form handler (PRD §5.8, Session 04 §6). Same anti-spam, validation
 * and error-handling rules as the application endpoint; delivers to
 * CONTACT_RECIPIENT. No CV upload. Never leaks server paths/stack traces.
 */
export async function POST(req: Request) {
  try {
    if (!checkRateLimit(clientKey(req))) {
      return json({ ok: false, errors: { _: 'RATE_LIMITED' } }, 429)
    }

    const form = await req.formData()
    if (String(form.get('website') || '').trim() !== '') {
      return json({ ok: true }, 200)
    }

    const name = String(form.get('name') || '')
    const email = String(form.get('email') || '')
    const message = String(form.get('message') || '')
    const consentGiven = String(form.get('consentGiven') || '') === 'true'

    const errors: Record<string, string> = {}
    if (!isNonEmpty(name)) errors.name = 'REQUIRED'
    if (!isNonEmpty(email)) errors.email = 'REQUIRED'
    else if (!isEmail(email)) errors.email = 'INVALID'
    if (!isNonEmpty(message)) errors.message = 'REQUIRED'
    if (!consentGiven) errors.consentGiven = 'REQUIRED'

    if (Object.keys(errors).length > 0) return json({ ok: false, errors }, 400)

    const payload = await getPayloadClient()
    const recipient = process.env.CONTACT_RECIPIENT || 'contact@pcm.me'
    const html = `
      <h2>New contact message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${String(message).replace(/</g, '&lt;')}</p>
    `
    await sendNotification(payload, { to: recipient, subject: 'Contact form message', html })

    return json({ ok: true }, 200)
  } catch {
    return json({ ok: false, errors: { _: 'SERVER_ERROR' } }, 500)
  }
}
