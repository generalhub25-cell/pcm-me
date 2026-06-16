import type { Payload } from 'payload'

/**
 * Notification email helper (PRD §5, §6 Session 04). Uses Payload's configured
 * email transport (in dev, with no adapter, Payload logs the email to the
 * console; a real adapter is configured via env in Session 08). Failures are
 * swallowed so a delivery problem never blocks a successful submission/storage.
 */
export const sendNotification = async (
  payload: Payload,
  args: {
    to: string
    subject: string
    html: string
    attachments?: { filename: string; content: Buffer }[]
  },
): Promise<boolean> => {
  try {
    await payload.sendEmail({
      to: args.to,
      subject: args.subject,
      html: args.html,
      ...(args.attachments ? { attachments: args.attachments } : {}),
    })
    return true
  } catch (err) {
    payload.logger.error(`Notification email failed: ${(err as Error).message}`)
    return false
  }
}

export const appDelivery = (): 'store' | 'email' | 'both' => {
  const v = (process.env.APPLICATION_DELIVERY || 'both').toLowerCase()
  return v === 'store' || v === 'email' ? v : 'both'
}
