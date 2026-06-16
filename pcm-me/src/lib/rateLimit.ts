/**
 * Minimal in-memory per-IP rate limiter (PRD §8.6). Single-process only — a
 * shared store (Redis) would be used behind multiple instances in production
 * (Session 08). Default: 5 submissions per 10 minutes per key.
 */
const WINDOW_MS = 10 * 60 * 1000
const MAX_HITS = 5

const hits = new Map<string, number[]>()

export const checkRateLimit = (key: string, max = MAX_HITS, windowMs = WINDOW_MS): boolean => {
  const now = Date.now()
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs)
  if (arr.length >= max) {
    hits.set(key, arr)
    return false
  }
  arr.push(now)
  hits.set(key, arr)
  return true
}

export const clientKey = (req: Request): string => {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}
