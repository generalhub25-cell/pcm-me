import { existsSync, readFileSync } from 'fs'

import { getPayloadClient } from '../lib/payload'
import { detectLocale, inferArticleKind, inferCountry, isExpired, nullIfMissing } from './mapping'

/**
 * Legacy WordPress → new schema importer (PRD §12). Runs against a WXR export
 * (path via the WXR_PATH env var) into the target database (use a staging
 * DATABASE_URI — PRD §12.5).
 *
 * OQ-21 (potential blocker): if no WXR export is available, this records the
 * blocker and exits without fabricating content (per spec). Every other
 * session can proceed without this one.
 */

type WxrItem = {
  title: string
  content: string
  postType: string
  postDate: string | null
  link: string | null
  categories: string[]
  translationGroup: string | null
}

const cdata = (s: string | undefined): string =>
  (s || '').replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim()

const tag = (block: string, name: string): string | undefined => {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))
  return m ? cdata(m[1]) : undefined
}

const parseWxr = (xml: string): WxrItem[] => {
  const items: WxrItem[] = []
  const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/g) || []
  for (const block of itemBlocks) {
    const cats = [...block.matchAll(/<category[^>]*>([\s\S]*?)<\/category>/g)].map((m) => cdata(m[1]))
    items.push({
      title: tag(block, 'title') || '',
      content: tag(block, 'content:encoded') || '',
      postType: (tag(block, 'wp:post_type') || 'post').toLowerCase(),
      postDate: tag(block, 'wp:post_date') || null,
      link: tag(block, 'link') || null,
      categories: cats,
      // Optional translation-group marker (e.g. WPML/Polylang export meta).
      translationGroup:
        (block.match(/<wp:meta_key>pcm_translation_group<\/wp:meta_key>\s*<wp:meta_value>([\s\S]*?)<\/wp:meta_value>/)?.[1] &&
          cdata(block.match(/<wp:meta_key>pcm_translation_group<\/wp:meta_key>\s*<wp:meta_value>([\s\S]*?)<\/wp:meta_value>/)?.[1])) ||
        null,
    })
  }
  return items
}

const run = async () => {
  const wxrPath = process.env.WXR_PATH
  if (!wxrPath || !existsSync(wxrPath)) {
    console.error(
      '[migration] OQ-21 BLOCKER: no WXR export available (set WXR_PATH to a WordPress export).\n' +
        'Per PRD §12.1 the corpus import is recorded as blocked and skipped; no content is fabricated.\n' +
        'Every other session proceeds without this one.',
    )
    process.exit(0)
  }

  const payload = await getPayloadClient()
  // Loosely-typed create for the importer (data shape is built dynamically).
  const createDoc = (collection: 'articles' | 'vacancies' | 'companies', data: Record<string, unknown>) =>
    payload.create({ collection, data, overrideAccess: true } as never)

  const xml = readFileSync(wxrPath, 'utf8')
  const items = parseWxr(xml)
  const groupToId: Record<string, { ar?: string; en?: string }> = {}
  let counts = { article: 0, vacancy: 0, company: 0, archived: 0, lowConfidence: 0, altFlagged: 0 }

  for (const it of items) {
    const { locale, lowConfidence } = detectLocale(`${it.title} ${it.content}`)
    if (lowConfidence) counts.lowConfidence++
    const publishedAt = nullIfMissing(it.postDate) || undefined
    const legacyUrl = nullIfMissing(it.link) || undefined
    const translationGroupId = it.translationGroup || undefined

    if (it.postType.includes('vacanc') || /egypt|ksa|kuwait|emirate|vacanc/.test(it.postType)) {
      const country = inferCountry(it.categories.join(' ') + ' ' + it.postType)
      const expires = null // legacy WXR rarely carries an explicit expiry
      const archived = isExpired(expires)
      if (archived) counts.archived++
      await createDoc('vacancies', {
        title: it.title,
        country,
        roleType: 'other',
        locale,
        translationGroupId,
        legacyUrl,
        status: archived ? 'archived' : 'published',
        postedAt: publishedAt || new Date().toISOString(),
      })
      counts.vacancy++
    } else if (it.postType === 'company' || /company/.test(it.categories.join(' '))) {
      await createDoc('companies', {
        name: it.title,
        locale,
        translationGroupId,
        legacyUrl,
        status: 'published',
      })
      counts.company++
    } else {
      const kind = inferArticleKind(it.categories.join(' '))
      await createDoc('articles', {
        kind,
        title: it.title,
        locale,
        translationGroupId,
        legacyUrl,
        status: 'published',
        publishedAt,
      })
      counts.article++
    }
  }

  payload.logger.info(`[migration] imported: ${JSON.stringify(counts)}`)
  // NOTE: media import (Image/File with width/height + alt_text-for-review),
  // and richer translation linking, run from the same WXR + media archive.
  void groupToId
  process.exit(0)
}

run().catch((err) => {
  console.error('[migration] failed:', (err as Error).message)
  process.exit(1)
})
