import React from 'react'
import { notFound } from 'next/navigation'

import type { Locale } from '../../../../lib/enums'
import { findByLegacyPath } from '../../../../lib/content'
import { t } from '../../../../lib/i18n'
import { articlesIndexUrl } from '../../../../lib/routes'
import { ArticleDetail } from '../../../../components/site/ArticleDetail'
import { articleMetadata } from '../../../../lib/seoPages'

const pathOf = (rest?: string[]) => '/' + (rest ?? []).join('/')

export async function generateMetadata({ params }: { params: Promise<{ rest?: string[] }> }) {
  const { rest } = await params
  const doc = await findByLegacyPath(pathOf(rest))
  if (!doc?.slug || !doc.locale) return {}
  return articleMetadata(doc.locale as Locale, String(doc.slug))
}

/**
 * Legacy old-URL article page. Resolves the incoming old path to a published
 * article via its `legacyUrl`, then renders the SAME <ArticleDetail> component
 * as the canonical route. The browser URL stays the old path (rewrite, not
 * redirect). No match → normal 404.
 */
export default async function LegacyArticlePage({ params }: { params: Promise<{ rest?: string[] }> }) {
  const { rest } = await params
  const doc = await findByLegacyPath(pathOf(rest))
  if (!doc?.slug || !doc.locale) notFound()
  const l = doc.locale as Locale
  return (
    <ArticleDetail
      locale={l}
      slug={String(doc.slug)}
      indexLabel={t(l, 'articles')}
      indexHref={articlesIndexUrl(l)}
    />
  )
}
