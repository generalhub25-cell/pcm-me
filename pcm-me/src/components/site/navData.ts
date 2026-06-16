import type { Locale } from '../../lib/enums'
import { COUNTRIES } from '../../lib/enums'
import {
  articlesIndexUrl,
  newsIndexUrl,
  companiesIndexUrl,
  jobsIndexUrl,
  jobsCountryUrl,
  categoryUrl,
  skillsTrackUrl,
  interactionsUrl,
  homeUrl,
} from '../../lib/routes'
import { t, countryLabel, skillsTrackLabel, ui } from '../../lib/i18n'

export type NavLink = { label: string; href: string }
export type NavNode =
  | { type: 'link'; label: string; href: string }
  | { type: 'menu'; label: string; items: NavLink[] }

// Topics menu membership (PRD §4.4, OQ-7 default).
const TOPIC_SLUGS = [
  'tests-and-procedures',
  'nuclear-pharmacy',
  'biotechnology',
  'diseases',
  'otc',
]

const SKILLS_TRACKS = ['business', 'basic', 'life', 'manager', 'product-manager']

const topicLabel = (slug: string): string =>
  slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

/** Primary navigation / IA (PRD §4.4). */
export const buildNav = (locale: Locale): NavNode[] => [
  { type: 'link', label: t(locale, 'home'), href: homeUrl(locale) },
  { type: 'link', label: t(locale, 'articles'), href: articlesIndexUrl(locale) },
  { type: 'link', label: t(locale, 'news'), href: newsIndexUrl(locale) },
  {
    type: 'menu',
    label: t(locale, 'jobs'),
    items: [
      { label: ui.all[locale] + ' — ' + t(locale, 'jobs'), href: jobsIndexUrl(locale) },
      ...COUNTRIES.map((c) => ({ label: countryLabel[c][locale], href: jobsCountryUrl(locale, c) })),
    ],
  },
  { type: 'link', label: t(locale, 'companies'), href: companiesIndexUrl(locale) },
  {
    type: 'menu',
    label: t(locale, 'skills'),
    items: SKILLS_TRACKS.map((s) => ({
      label: skillsTrackLabel[s][locale],
      href: skillsTrackUrl(locale, s),
    })),
  },
  { type: 'link', label: t(locale, 'quickMba'), href: `/${locale}/quick-mba` },
  { type: 'link', label: t(locale, 'immigration'), href: `/${locale}/immigration` },
  { type: 'link', label: t(locale, 'interactions'), href: interactionsUrl(locale) },
  {
    type: 'menu',
    label: t(locale, 'topics'),
    items: TOPIC_SLUGS.map((s) => ({ label: topicLabel(s), href: categoryUrl(locale, s) })),
  },
  { type: 'link', label: t(locale, 'about'), href: `/${locale}/about` },
]
