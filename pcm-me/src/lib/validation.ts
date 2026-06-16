/**
 * Shared field validation (PRD §5.5, §8.5) — used by both the client forms and
 * the server handlers (server-side is authoritative, PRD §8.6 / §5).
 */

export const isNonEmpty = (v: unknown): boolean =>
  typeof v === 'string' && v.trim().length > 0

// Pragmatic email check.
export const isEmail = (v: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

// International phone: +, digits, spaces, dashes, parens; 7–20 digits.
export const isPhone = (v: string): boolean => {
  const digits = v.replace(/[^0-9]/g, '')
  return /^[+]?[0-9()\-\s]+$/.test(v.trim()) && digits.length >= 7 && digits.length <= 20
}
