'use client'
import React, { useState } from 'react'

import type { Locale } from '../../lib/enums'
import { isNonEmpty, isEmail, isPhone } from '../../lib/validation'
import {
  ALLOWED_CV_EXTENSIONS,
  CV_ACCEPT,
  MAX_CV_BYTES,
} from '../../lib/uploadConstraints'

const msg = {
  ar: {
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    cv: 'السيرة الذاتية (PDF أو DOC أو DOCX)',
    consent: 'أوافق على ',
    privacy: 'سياسة الخصوصية',
    submit: 'إرسال الطلب',
    sending: 'جارٍ الإرسال…',
    success: 'تم إرسال طلبك بنجاح.',
    REQUIRED: 'هذا الحقل مطلوب.',
    INVALID: 'القيمة غير صحيحة.',
    TOO_LARGE: 'الملف أكبر من الحد المسموح (5 ميجابايت).',
    BAD_EXTENSION: 'نوع الملف غير مسموح. استخدم PDF أو DOC أو DOCX.',
    BAD_MIME: 'نوع الملف غير مسموح.',
    BAD_CONTENT: 'محتوى الملف غير صالح.',
    MISMATCH: 'محتوى الملف لا يطابق امتداده.',
    EMPTY: 'الملف فارغ.',
    RATE_LIMITED: 'محاولات كثيرة. حاول لاحقًا.',
    SERVER_ERROR: 'حدث خطأ. حاول مرة أخرى.',
  },
  en: {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    cv: 'CV (PDF, DOC or DOCX)',
    consent: 'I agree to the ',
    privacy: 'Privacy Policy',
    submit: 'Submit application',
    sending: 'Sending…',
    success: 'Your application was submitted successfully.',
    REQUIRED: 'This field is required.',
    INVALID: 'Invalid value.',
    TOO_LARGE: 'File exceeds the 5 MB limit.',
    BAD_EXTENSION: 'File type not allowed. Use PDF, DOC or DOCX.',
    BAD_MIME: 'File type not allowed.',
    BAD_CONTENT: 'File content is not valid.',
    MISMATCH: 'File content does not match its extension.',
    EMPTY: 'File is empty.',
    RATE_LIMITED: 'Too many attempts. Try again later.',
    SERVER_ERROR: 'Something went wrong. Please try again.',
  },
}

type Errors = Record<string, string>

/**
 * On-site vacancy application form (PRD §5.5). Inline validation, accessible
 * labels, success/error states; RTL-correct via document dir. Posts multipart
 * to /submit/application; server validation is authoritative.
 */
export const ApplicationForm: React.FC<{
  locale: Locale
  vacancyId: string
  privacyHref: string
}> = ({ locale, vacancyId, privacyHref }) => {
  const m = msg[locale]
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formEl = e.currentTarget
    const fd = new FormData(formEl)

    const next: Errors = {}
    if (!isNonEmpty(String(fd.get('applicantName') || ''))) next.applicantName = 'REQUIRED'
    const email = String(fd.get('applicantEmail') || '')
    if (!isNonEmpty(email)) next.applicantEmail = 'REQUIRED'
    else if (!isEmail(email)) next.applicantEmail = 'INVALID'
    const phone = String(fd.get('applicantPhone') || '')
    if (!isNonEmpty(phone)) next.applicantPhone = 'REQUIRED'
    else if (!isPhone(phone)) next.applicantPhone = 'INVALID'
    if (String(fd.get('consentGiven') || '') !== 'true') next.consentGiven = 'REQUIRED'

    const cv = fd.get('cv')
    if (!(cv instanceof File) || cv.size === 0) next.cv = 'REQUIRED'
    else {
      const ext = (cv.name.split('.').pop() || '').toLowerCase()
      if (!ALLOWED_CV_EXTENSIONS.includes(ext as never)) next.cv = 'BAD_EXTENSION'
      else if (cv.size > MAX_CV_BYTES) next.cv = 'TOO_LARGE'
    }

    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }

    setErrors({})
    setSending(true)
    try {
      const res = await fetch('/submit/application', { method: 'POST', body: fd })
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
    <form className="form" onSubmit={onSubmit} noValidate encType="multipart/form-data">
      {errors._ && (
        <p role="alert" style={{ color: '#b00020' }}>
          {(m as Record<string, string>)[errors._] || m.SERVER_ERROR}
        </p>
      )}
      <input type="hidden" name="vacancyId" value={vacancyId} />
      <input type="hidden" name="sourceLocale" value={locale} />
      {/* Honeypot (hidden from users) */}
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
        <input type="text" name="applicantName" required aria-invalid={!!errors.applicantName} />
        {err('applicantName')}
      </label>
      <label>
        {m.email}
        <input type="email" name="applicantEmail" required aria-invalid={!!errors.applicantEmail} />
        {err('applicantEmail')}
      </label>
      <label>
        {m.phone}
        <input type="tel" name="applicantPhone" required aria-invalid={!!errors.applicantPhone} />
        {err('applicantPhone')}
      </label>
      <label>
        {m.cv}
        <input type="file" name="cv" accept={CV_ACCEPT} required aria-invalid={!!errors.cv} />
        {err('cv')}
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
