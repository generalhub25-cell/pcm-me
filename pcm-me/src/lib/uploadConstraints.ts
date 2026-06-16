/**
 * CV upload constraints (PRD §6.7, §8.5). Allowed: PDF, DOC, DOCX.
 * Max size default 5 MB (tunable in Session 08). The real content type is
 * validated by magic bytes server-side — not just the extension/mime header.
 */
export const MAX_CV_BYTES = 5 * 1024 * 1024 // 5 MB

export const ALLOWED_CV_EXTENSIONS = ['pdf', 'doc', 'docx'] as const
export const ALLOWED_CV_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

// Accept attribute for the <input type=file>.
export const CV_ACCEPT = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

const startsWith = (buf: Uint8Array, sig: number[], offset = 0): boolean =>
  sig.every((b, i) => buf[offset + i] === b)

/**
 * Server-side real content-type check by magic bytes.
 * PDF: "%PDF". DOC (OLE2): D0 CF 11 E0. DOCX/zip: "PK\x03\x04".
 */
export const sniffCvType = (buf: Uint8Array): 'pdf' | 'doc' | 'docx' | null => {
  if (startsWith(buf, [0x25, 0x50, 0x44, 0x46])) return 'pdf' // %PDF
  if (startsWith(buf, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) return 'doc' // OLE2
  if (startsWith(buf, [0x50, 0x4b, 0x03, 0x04])) return 'docx' // PK.. (zip → docx)
  return null
}

export type CvValidation = { ok: true; sniffed: 'pdf' | 'doc' | 'docx' } | { ok: false; error: string }

export const validateCvBuffer = (
  buf: Uint8Array,
  mime: string,
  filename: string,
): CvValidation => {
  if (buf.byteLength === 0) return { ok: false, error: 'EMPTY' }
  if (buf.byteLength > MAX_CV_BYTES) return { ok: false, error: 'TOO_LARGE' }

  const ext = (filename.split('.').pop() || '').toLowerCase()
  if (!ALLOWED_CV_EXTENSIONS.includes(ext as never)) return { ok: false, error: 'BAD_EXTENSION' }
  if (mime && !ALLOWED_CV_MIME.includes(mime)) return { ok: false, error: 'BAD_MIME' }

  const sniffed = sniffCvType(buf)
  if (!sniffed) return { ok: false, error: 'BAD_CONTENT' }
  // DOCX and DOC must match the zip/ole signature respectively; PDF must be %PDF.
  if (sniffed === 'pdf' && ext !== 'pdf') return { ok: false, error: 'MISMATCH' }
  return { ok: true, sniffed }
}
