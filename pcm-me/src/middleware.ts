import { NextResponse, type NextRequest } from 'next/server'

import { DEFAULT_LOCALE } from './lib/enums'

/**
 * Bare-root behavior (PRD §3, OQ-2 default): redirect `/` → `/ar/`.
 * Recorded as ROOT_REDIRECT in README. Session 06 sets hreflang x-default
 * to match. Matcher is scoped to `/` only, so /admin and /api are untouched.
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}`
  // 301 (permanent) to match the §5 redirect map (https://pcm.me/ → ROOT_REDIRECT).
  return NextResponse.redirect(url, 301)
}

export const config = {
  matcher: ['/'],
}
