import React from 'react'
import { notFound } from 'next/navigation'

import type { Locale } from '../../../../../../lib/enums'
import { t, countryLabel, roleTypeLabel } from '../../../../../../lib/i18n'
import {
  homeUrl,
  jobsIndexUrl,
  jobsCountryUrl,
  vacancyUrl,
  countryFromRouteSlug,
} from '../../../../../../lib/routes'
import { findBySlug, findSibling } from '../../../../../../lib/content'
import { Breadcrumbs } from '../../../../../../components/site/Breadcrumbs'
import { Body } from '../../../../../../components/site/Body'
import { SetLangAlternate } from '../../../../../../components/site/LangAlternate'
import { ApplicationForm } from '../../../../../../components/forms/ApplicationForm'
import { JsonLd } from '../../../../../../components/seo/JsonLd'
import { jobPostingJsonLd } from '../../../../../../lib/jsonld'
import { vacancyMetadata } from '../../../../../../lib/seoPages'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string; slug: string }>
}) {
  const { locale, country, slug } = await params
  const enumCountry = countryFromRouteSlug(country)
  if (!enumCountry) return { title: 'PCM' }
  return vacancyMetadata(locale as Locale, enumCountry, slug)
}

const fmtDate = (value: unknown, locale: Locale): string => {
  if (!value) return ''
  const d = new Date(String(value))
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Vacancy detail (PRD §5.5): full description, requirements, location,
 * employer, role_type, posted/expires. Renders an apply slot (Session 04
 * inserts the form) and shows legacy apply_email/apply_whatsapp only as
 * secondary contact. Missing fields render empty, never as errors.
 */
export default async function VacancyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; country: string; slug: string }>
}) {
  const { locale, country, slug } = await params
  const l = locale as Locale
  const enumCountry = countryFromRouteSlug(country)
  if (!enumCountry) notFound()

  const doc = (await findBySlug('vacancies', l, slug)) as
    | (Record<string, unknown> & {
        id?: string
        title?: string
        employer?: string
        country?: string
        roleType?: string
        location?: string
        description?: unknown
        requirements?: unknown
        postedAt?: string
        expiresAt?: string
        applyEmail?: string
        applyWhatsapp?: string
        translationGroupId?: string
      })
    | null
  if (!doc) notFound()
  // Keep URLs canonical: the path country must match the vacancy's country.
  if (doc.country !== enumCountry) notFound()

  const other: Locale = l === 'ar' ? 'en' : 'ar'
  const sibling = (await findSibling('vacancies', doc.translationGroupId, l)) as
    | { slug?: string; country?: string }
    | null
  const altHref =
    sibling?.slug && sibling.country
      ? vacancyUrl(other, sibling.country as never, sibling.slug)
      : homeUrl(other)

  return (
    <article>
      <SetLangAlternate href={altHref} />
      <Breadcrumbs
        items={[
          { label: t(l, 'home'), href: homeUrl(l) },
          { label: t(l, 'jobs'), href: jobsIndexUrl(l) },
          { label: countryLabel[enumCountry][l], href: jobsCountryUrl(l, enumCountry) },
          { label: doc.title || '' },
        ]}
      />

      <JsonLd
        data={jobPostingJsonLd({
          title: doc.title || '',
          description: doc.title || '',
          datePosted: doc.postedAt,
          validThrough: doc.expiresAt,
          employer: doc.employer,
          location: doc.location,
          country: doc.country,
          locale: l,
        })}
      />

      <h1 className="page-title">{doc.title}</h1>
      <div className="card__meta">
        {[
          doc.employer || '',
          countryLabel[enumCountry][l],
          doc.roleType ? roleTypeLabel[doc.roleType]?.[l] : '',
          doc.location || '',
        ]
          .filter(Boolean)
          .join(' · ')}
      </div>
      <div className="card__meta">
        {[
          doc.postedAt ? `${fmtDate(doc.postedAt, l)}` : '',
          doc.expiresAt ? `→ ${fmtDate(doc.expiresAt, l)}` : '',
        ]
          .filter(Boolean)
          .join(' ')}
      </div>

      {doc.description ? <Body data={doc.description} /> : null}
      {doc.requirements ? (
        <section className="section">
          <Body data={doc.requirements} />
        </section>
      ) : null}

      {/* Apply slot — on-site application form (Session 04). */}
      <section className="apply-slot" data-apply-slot>
        <strong>{t(l, 'applyNow')}</strong>
        <ApplicationForm locale={l} vacancyId={String(doc.id)} privacyHref={`/${l}/privacy-policy`} />

        {(doc.applyEmail || doc.applyWhatsapp) && (
          <p className="card__meta">
            {doc.applyEmail && (
              <a href={`mailto:${doc.applyEmail}`} style={{ marginInlineEnd: 12 }}>
                {doc.applyEmail}
              </a>
            )}
            {doc.applyWhatsapp && (
              <a href={`https://wa.me/${doc.applyWhatsapp.replace(/[^0-9]/g, '')}`}>
                WhatsApp
              </a>
            )}
          </p>
        )}
      </section>
    </article>
  )
}
