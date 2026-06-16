import { getPayload } from 'payload'

import config from '../payload.config'
import { slugify } from '../lib/slug'

/**
 * Seed script (PRD §5, §6 — Session 01).
 * - Ensures one admin user exists (the admin scaffold create path).
 * - Seeds the Category taxonomy (Section 5 default list) in ar + en.
 * - Creates one Article, one Vacancy, one Company in both locales,
 *   linked as translations via translation_group_id (acceptance #8, #4).
 *
 * Idempotent: re-running skips items that already exist (by slug + locale).
 */

const humanize = (slug: string): string =>
  slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

const run = async () => {
  const payload = await getPayload({ config })

  // --- Admin user (create path / admin scaffold) ---
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@pcm.me'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin1234'
  const existingUsers = await payload.count({ collection: 'users' })
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { email: adminEmail, password: adminPassword },
    })
    payload.logger.info(`Created admin user: ${adminEmail} / ${adminPassword}`)
  } else {
    payload.logger.info('Admin user already exists — skipping.')
  }

  // --- Category taxonomy (Section 5), both locales ---
  const topLevel = [
    'scientific-articles',
    'news',
    'tests-and-procedures',
    'nuclear-pharmacy',
    'biotechnology',
    'diseases',
    'otc',
    'interactions-medicines',
  ]
  const skillsChildren = ['business', 'basic', 'life', 'manager', 'product-manager']
  const locales = ['ar', 'en'] as const

  // findOrCreate a category for a given slug + locale.
  const ensureCategory = async (
    slug: string,
    locale: 'ar' | 'en',
    translationGroupId: string,
    parentId?: string,
  ): Promise<string> => {
    const found = await payload.find({
      collection: 'categories',
      where: { and: [{ slug: { equals: slug } }, { locale: { equals: locale } }] },
      limit: 1,
    })
    if (found.docs.length > 0) return String(found.docs[0].id)
    const created = await payload.create({
      collection: 'categories',
      data: {
        name: humanize(slug),
        slug,
        locale,
        translationGroupId,
        status: 'published',
        ...(parentId ? { parent: parentId } : {}),
      },
    })
    return String(created.id)
  }

  // Top-level categories (each slug shares one translation_group_id across locales).
  for (const slug of topLevel) {
    const tgid = crypto.randomUUID()
    for (const locale of locales) {
      await ensureCategory(slug, locale, tgid)
    }
  }

  // Skills parent + children (parent linked per-locale).
  const skillsTgid = crypto.randomUUID()
  const skillsParentIds: Record<'ar' | 'en', string> = { ar: '', en: '' }
  for (const locale of locales) {
    skillsParentIds[locale] = await ensureCategory('skills', locale, skillsTgid)
  }
  for (const childSlug of skillsChildren) {
    const tgid = crypto.randomUUID()
    for (const locale of locales) {
      await ensureCategory(childSlug, locale, tgid, skillsParentIds[locale])
    }
  }

  // Helper: find a category id by slug+locale (for relating sample content).
  const categoryId = async (slug: string, locale: 'ar' | 'en'): Promise<string> => {
    const res = await payload.find({
      collection: 'categories',
      where: { and: [{ slug: { equals: slug } }, { locale: { equals: locale } }] },
      limit: 1,
    })
    return String(res.docs[0].id)
  }

  // --- Sample Article (both locales, linked) ---
  const articleTgid = crypto.randomUUID()
  const articleTitles = { en: 'Sample Scientific Article', ar: 'مقال علمي تجريبي' }
  for (const locale of locales) {
    const slug = locale === 'en' ? 'sample-scientific-article' : slugify(articleTitles.ar)
    const exists = await payload.find({
      collection: 'articles',
      where: { and: [{ slug: { equals: slug } }, { locale: { equals: locale } }] },
      limit: 1,
    })
    if (exists.docs.length === 0) {
      await payload.create({
        collection: 'articles',
        data: {
          kind: 'scientific',
          title: articleTitles[locale],
          excerpt: 'Seed article for verification.',
          category: await categoryId('scientific-articles', locale),
          locale,
          slug,
          translationGroupId: articleTgid,
          status: 'published',
          publishedAt: new Date().toISOString(),
        },
      })
    }
  }

  // --- Sample Company (both locales, linked) ---
  const companyTgid = crypto.randomUUID()
  const companyNames = { en: 'Sample Company', ar: 'شركة تجريبية' }
  for (const locale of locales) {
    const slug = locale === 'en' ? 'sample-company' : slugify(companyNames.ar)
    const exists = await payload.find({
      collection: 'companies',
      where: { and: [{ slug: { equals: slug } }, { locale: { equals: locale } }] },
      limit: 1,
    })
    if (exists.docs.length === 0) {
      await payload.create({
        collection: 'companies',
        data: {
          name: companyNames[locale],
          locale,
          slug,
          translationGroupId: companyTgid,
          status: 'published',
        },
      })
    }
  }

  // --- Sample Vacancy (both locales, linked) ---
  const vacancyTgid = crypto.randomUUID()
  const vacancyTitles = { en: 'Medical Representative — Cairo', ar: 'مندوب طبي — القاهرة' }
  for (const locale of locales) {
    const slug = locale === 'en' ? 'medical-representative-cairo' : slugify(vacancyTitles.ar)
    const exists = await payload.find({
      collection: 'vacancies',
      where: { and: [{ slug: { equals: slug } }, { locale: { equals: locale } }] },
      limit: 1,
    })
    if (exists.docs.length === 0) {
      await payload.create({
        collection: 'vacancies',
        data: {
          title: vacancyTitles[locale],
          country: 'egypt',
          roleType: 'medical_representative',
          locale,
          slug,
          translationGroupId: vacancyTgid,
          status: 'published',
          postedAt: new Date().toISOString(),
        },
      })
    }
  }

  payload.logger.info('Seed complete.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
