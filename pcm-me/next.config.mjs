import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'
import seedRedirects from './src/migration/seed-redirects.json' with { type: 'json' }

const dirname = path.dirname(fileURLToPath(import.meta.url))
const isDev = process.env.NODE_ENV === 'development'

/*
 * Content-Security-Policy (PRD §11, Session 08 §1). Self-only by default;
 * no external script origins are allowed, so analytics stays blocked until the
 * Session 09 consent banner adds them. `unsafe-eval` is added only in dev for
 * Next's HMR. Tightening to nonces happens alongside the Session 09 analytics
 * inventory.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "form-action 'self'",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // HSTS (effective once served over HTTPS; HTTP→HTTPS enforced at the host).
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

// Admin / API / form endpoints: never cached, never indexed (server-enforced).
const noStore = [
  { key: 'Cache-Control', value: 'no-store, max-age=0' },
  { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: { root: dirname },
  poweredByHeader: false,
  // Keep sharp as a runtime external so its native binary loads from
  // node_modules (not bundled by Turbopack).
  serverExternalPackages: ['sharp'],
  images: {
    // Responsive derivatives in modern formats with fallback (PRD §10.3).
    formats: ['image/avif', 'image/webp'],
    // Allow Vercel Blob-hosted uploads to be optimized by next/image (prod).
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/admin/:path*', headers: noStore },
      { source: '/api/:path*', headers: noStore },
      { source: '/submit/:path*', headers: noStore },
    ]
  },
  async redirects() {
    return seedRedirects.map((r) => ({ source: r.from, destination: r.to, statusCode: 301 }))
  },
}

export default withPayload(nextConfig)
