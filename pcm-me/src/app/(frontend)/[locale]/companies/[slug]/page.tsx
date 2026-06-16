import React from 'react'
import { notFound } from 'next/navigation'

import type { Locale } from '../../../../../lib/enums'
import { t } from '../../../../../lib/i18n'
import { homeUrl, companiesIndexUrl, companyUrl } from '../../../../../lib/routes'
import { findBySlug, findSibling } from '../../../../../lib/content'
import { Breadcrumbs } from '../../../../../components/site/Breadcrumbs'
import { Body } from '../../../../../components/site/Body'
import { SetLangAlternate } from '../../../../../components/site/LangAlternate'
import { imageProps } from '../../../../../components/site/media'
import { companyMetadata } from '../../../../../lib/seoPages'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  return companyMetadata(locale as Locale, slug)
}

// Company profile (PRD §5.x): logo, body, external_url, founded, headquarters.
export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const l = locale as Locale
  const doc = (await findBySlug('companies', l, slug)) as
    | (Record<string, unknown> & {
        name?: string
        body?: unknown
        externalUrl?: string
        founded?: string
        headquarters?: string
        logo?: unknown
        translationGroupId?: string
      })
    | null
  if (!doc) notFound()

  const other: Locale = l === 'ar' ? 'en' : 'ar'
  const sibling = (await findSibling('companies', doc.translationGroupId, l)) as { slug?: string } | null
  const altHref = sibling?.slug ? companyUrl(other, sibling.slug) : homeUrl(other)
  const logo = imageProps(doc.logo as never, l)

  return (
    <article>
      <SetLangAlternate href={altHref} />
      <Breadcrumbs
        items={[
          { label: t(l, 'home'), href: homeUrl(l) },
          { label: t(l, 'companies'), href: companiesIndexUrl(l) },
          { label: doc.name || '' },
        ]}
      />
      <div data-jsonld-slot="Organization" hidden />

      {logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} style={{ maxHeight: 80, width: 'auto' }} />
      )}
      <h1 className="page-title">{doc.name}</h1>
      <div className="card__meta">
        {[doc.headquarters || '', doc.founded || ''].filter(Boolean).join(' · ')}
      </div>
      {doc.externalUrl && (
        <p>
          <a href={doc.externalUrl} target="_blank" rel="noopener noreferrer">
            {doc.externalUrl}
          </a>
        </p>
      )}
      <Body data={doc.body} />
    </article>
  )
}
