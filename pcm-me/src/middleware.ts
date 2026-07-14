import { NextResponse, type NextRequest } from 'next/server'

import { DEFAULT_LOCALE } from './lib/enums'

/**
 * Middleware:
 *  - `/` → `/{DEFAULT_LOCALE}` (ROOT_REDIRECT, PRD §3 / OQ-2).
 *  - Legacy URL support: any unknown top-level path (an old pcm.me article URL)
 *    is REWRITTEN (not redirected) to the `/legacy` resolver, which renders the
 *    matching article at the SAME browser URL. App routes, API, admin, submit,
 *    locale pages, assets, sitemap and robots are excluded so they behave
 *    normally.
 */
const SKIP = [
  /^\/api(\/|$)/,
  /^\/admin(\/|$)/,
  /^\/submit(\/|$)/,
  /^\/ar(\/|$)/,
  /^\/en(\/|$)/,
  /^\/legacy(\/|$)/,
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/') {
    const url = req.nextUrl.clone()
    url.pathname = `/${DEFAULT_LOCALE}`
    return NextResponse.redirect(url, 301)
  }

  // Leave app routes, and any asset with a file extension (.png/.xml/.txt/.ico…),
  // untouched.
  if (SKIP.some((r) => r.test(pathname)) || /\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next()
  }

  // Old URL → legacy resolver. rewrite() keeps the browser URL unchanged.
  const url = req.nextUrl.clone()
  url.pathname = `/legacy${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Run on everything except Next internals; precise exclusions handled above.
  matcher: ['/((?!_next/).*)'],
}
