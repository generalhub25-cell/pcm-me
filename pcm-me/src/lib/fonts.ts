import { Cairo, Inter } from 'next/font/google'

/**
 * Fonts (PRD §8.3): an Arabic-capable font for `ar`, a Latin font for `en`,
 * both with font-display: swap. Exposed as CSS variables; tokens.css selects
 * per locale via the html[lang] attribute.
 */
export const fontAr = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-ar',
})

export const fontEn = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-en',
})
