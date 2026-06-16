import type { MetadataRoute } from 'next'

import { siteUrl } from '../lib/canonical'

/**
 * robots.txt at /robots.txt (PRD §9.5): allow public content; disallow admin
 * (Session 02), the application/contact endpoints (Session 04, /submit), and
 * the Payload API (admin/REST/graphql). References the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/submit'],
      },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  }
}
