'use client'
import React, { useState } from 'react'

import type { Locale } from '../../lib/enums'
import { isNonEmpty, isEmail } from '../../lib/validation'

const msg = {
  ar: {
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    message: 'الرسالة',
    consent: 'أوافق على ',
    privacy: 'سياسة الخصوصية',
    submit: 'إرسال',
    sending: 'جارٍ الإرسال…',
    success: 'تم إرسال رسالتك. شكرًا لك.',
    REQUIRED: 'هذا الحقل مطلوب.',
    INVALID: 'القيمة غير صحيحة.',
    RATE_LIMITED: 'محاولات كثيرة. حاول لاحقًا.',
    SERVER_ERROR: 'حدث خطأ. حاول مرة أخرى.',
  },
  en: {
    name: 'Name',
    email: 'Email',
    message: 'Message',
    consent: 'I agree to the ',
    privacy: 'Privacy Policy',
    submit: 'Send',
    sending: 'Sending…',
    success: 'Your message was sent. Thank you.',
    REQUIRED: 'This field is required.',
    INVALID: 'Invalid value.',
    RATE_LIMITED: 'Too many attempts. Try again later.',
    SERVER_ERROR: 'Something went wrong. Please try again.',
  },
}

type Errors = Record<string, string>

/**
 * Contact form (PRD §5.8, Session 04 §6). Same styling/validation/anti-spam as
 * the application form; posts to /submit/contact.
 */
export const ContactForm: React.FC<{ locale: Locale; privacyHref: string }> = ({
  locale,
  privacyHref,
}) => {
  const m = msg[locale]
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formEl = e.currentTarget
    const fd = new FormData(formEl)

    const next: Errors = {}
    if (!isNonEmpty(String(fd.get('name') || ''))) next.name = 'REQUIRED'
    const email = String(fd.get('email') || '')
    if (!isNonEmpty(email)) next.email = 'REQUIRED'
    else if (!isEmail(email)) next.email = 'INVALID'
    if (!isNonEmpty(String(fd.get('message') || ''))) next.message = 'REQUIRED'
    if (String(fd.get('consentGiven') || '') !== 'true') next.consentGiven = 'REQUIRED'

    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }

    setErrors({})
    setSending(true)
    try {
      const res = await fetch('/submit/contact', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.ok) {
        setDone(true)
        formEl.reset()
      } else {
        setErrors(data.errors || { _: 'SERVER_ERROR' })
      }
    } catch {
      setErrors({ _: 'SERVER_ERROR' })
    }
    setSending(false)
  }

  const err = (k: string) =>
    errors[k] ? (
      <span role="alert" style={{ color: '#b00020', fontSize: '0.85rem' }}>
        {(m as Record<string, string>)[errors[k]] || m.INVALID}
      </span>
    ) : null

  if (done) {
    return (
      <p role="status" style={{ color: 'var(--color-primary)' }}>
        {m.success}
      </p>
    )
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      {errors._ && (
        <p role="alert" style={{ color: '#b00020' }}>
          {(m as Record<string, string>)[errors._] || m.SERVER_ERROR}
        </p>
      )}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px' }}
      />
      <label>
        {m.name}
        <input type="text" name="name" required aria-invalid={!!errors.name} />
        {err('name')}
      </label>
      <label>
        {m.email}
        <input type="email" name="email" required aria-invalid={!!errors.email} />
        {err('email')}
      </label>
      <label>
        {m.message}
        <textarea name="message" rows={5} required aria-invalid={!!errors.message} />
        {err('message')}
      </label>
      <label style={{ flexDirection: 'row', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input type="checkbox" name="consentGiven" value="true" required />
        <span>
          {m.consent}
          <a href={privacyHref} target="_blank" rel="noopener noreferrer">
            {m.privacy}
          </a>
        </span>
      </label>
      {err('consentGiven')}
      <button type="submit" className="btn" disabled={sending}>
        {sending ? m.sending : m.submit}
      </button>
    </form>
  )
}
