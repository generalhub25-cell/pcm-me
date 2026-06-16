import React from 'react'

import type { Locale } from '../../../../lib/enums'
import { t } from '../../../../lib/i18n'
import { homeUrl } from '../../../../lib/routes'
import { Breadcrumbs } from '../../../../components/site/Breadcrumbs'

// About (PRD §5.8) — mission/values (report §2.1).
const copy = {
  ar: {
    mission:
      'مهمتنا هي تمكين العاملين في قطاع الصيدلة والرعاية الصحية بالمعرفة والفرص المهنية.',
    values: 'المصداقية، جودة المحتوى، وخدمة المجتمع الصيدلي في المنطقة.',
  },
  en: {
    mission:
      'Our mission is to empower pharmaceutical and healthcare professionals with knowledge and career opportunities.',
    values: 'Credibility, content quality, and serving the regional pharmacy community.',
  },
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  return (
    <div>
      <Breadcrumbs items={[{ label: t(l, 'home'), href: homeUrl(l) }, { label: t(l, 'about') }]} />
      <h1 className="page-title">{t(l, 'about')}</h1>
      <p>{copy[l].mission}</p>
      <p className="muted">{copy[l].values}</p>
    </div>
  )
}
