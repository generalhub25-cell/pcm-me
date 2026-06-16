import React from 'react'

import type { Locale } from '../../../lib/enums'
import { getPayloadClient } from '../../../lib/payload'
import { getFeatured } from '../../../lib/queries'
import { listPublished } from '../../../lib/content'
import { t } from '../../../lib/i18n'
import { ArticleCard, VacancyCard, CompanyCard } from '../../../components/site/Cards'
import { simpleMetadata } from '../../../lib/seoPages'
import { homeUrl } from '../../../lib/routes'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  return simpleMetadata({ locale: l, title: t(l, 'siteName'), path: homeUrl(l), description: t(l, 'aboutBlurb') })
}

/**
 * Home (PRD §5.1): featured block + latest articles + latest news +
 * latest/featured vacancies + optional featured company, per locale.
 * Empty blocks hide gracefully.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  const payload = await getPayloadClient()

  const [featured, latestArticles, latestNews, vacancies, featuredCompanies] = await Promise.all([
    getFeatured(payload, 'articles', l, 6),
    listPublished('articles', l, { where: { kind: { equals: 'scientific' } }, limit: 6 }),
    listPublished('articles', l, { where: { kind: { equals: 'news' } }, limit: 6 }),
    listPublished('vacancies', l, { limit: 6, sort: '-postedAt' }),
    getFeatured(payload, 'companies', l, 3),
  ])

  const Section: React.FC<{ title: string; show: boolean; children: React.ReactNode }> = ({
    title,
    show,
    children,
  }) => (show ? (
    <section className="section">
      <h2 className="section__title">{title}</h2>
      <div className="card-grid">{children}</div>
    </section>
  ) : null)

  return (
    <div>
      <h1 className="page-title">{t(l, 'siteName')}</h1>

      <Section title={t(l, 'featured')} show={featured.length > 0}>
        {featured.map((d) => (
          <ArticleCard key={String(d.id)} doc={d as never} locale={l} />
        ))}
      </Section>

      <Section title={t(l, 'latestArticles')} show={latestArticles.docs.length > 0}>
        {latestArticles.docs.map((d) => (
          <ArticleCard key={String(d.id)} doc={d as never} locale={l} />
        ))}
      </Section>

      <Section title={t(l, 'latestNews')} show={latestNews.docs.length > 0}>
        {latestNews.docs.map((d) => (
          <ArticleCard key={String(d.id)} doc={d as never} locale={l} />
        ))}
      </Section>

      <Section title={t(l, 'featuredVacancies')} show={vacancies.docs.length > 0}>
        {vacancies.docs.map((d) => (
          <VacancyCard key={String(d.id)} doc={d as never} locale={l} />
        ))}
      </Section>

      <Section title={t(l, 'companies')} show={featuredCompanies.length > 0}>
        {featuredCompanies.map((d) => (
          <CompanyCard key={String(d.id)} doc={d as never} locale={l} />
        ))}
      </Section>
    </div>
  )
}
