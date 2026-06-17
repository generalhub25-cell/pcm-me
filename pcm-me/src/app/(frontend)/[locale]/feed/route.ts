import { getPayloadClient } from '../../../../lib/payload'
import type { Locale } from '../../../../lib/enums'
import { isLocale } from '../../../../lib/i18n'
import { absoluteUrl, canonicalArticle } from '../../../../lib/canonical'
import { homeUrl } from '../../../../lib/routes'

// Reflect current published state (PRD §9.5 regenerate on publish).
export const dynamic = 'force-dynamic'

const esc = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/**
 * Per-locale RSS feed (PRD §9, OQ-9 default: include per-locale feeds) at
 * /{locale}/feed. Lists published Articles for the locale, linking to their
 * canonical URLs (Session 06 builder).
 */
export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return new Response('Not found', { status: 404 })
  const l = locale as Locale

  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'articles',
    where: { and: [{ status: { equals: 'published' } }, { locale: { equals: l } }] },
    sort: '-publishedAt',
    limit: 50,
    depth: 0,
  })

  const items = res.docs
    .map((d) => {
      const doc = d as unknown as { title?: string; kind?: string; slug?: string; excerpt?: string; publishedAt?: string }
      const link = canonicalArticle(l, doc.kind, String(doc.slug || ''))
      const pub = doc.publishedAt ? new Date(doc.publishedAt).toUTCString() : ''
      return (
        `<item><title>${esc(doc.title || '')}</title>` +
        `<link>${link}</link><guid>${link}</guid>` +
        (pub ? `<pubDate>${pub}</pubDate>` : '') +
        (doc.excerpt ? `<description>${esc(doc.excerpt)}</description>` : '') +
        `</item>`
      )
    })
    .join('')

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0"><channel>` +
    `<title>PCM (${l})</title>` +
    `<link>${absoluteUrl(homeUrl(l))}</link>` +
    `<description>PCM — ${l}</description>` +
    items +
    `</channel></rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
