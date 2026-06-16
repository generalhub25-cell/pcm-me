/**
 * Slug helpers — PRD §6.9 / OQ-14.
 * slug: lowercase, hyphenated, unique within (type, locale).
 * OQ-14 default: transliterate Arabic to an ASCII slug; the original
 * title is stored separately (in the item's `title`/`name` field).
 */

// Minimal Arabic -> ASCII transliteration table (OQ-14 default behavior).
const ARABIC_MAP: Record<string, string> = {
  ا: 'a', أ: 'a', إ: 'i', آ: 'aa', ء: '', ئ: 'e', ؤ: 'o',
  ب: 'b', ت: 't', ث: 'th', ج: 'j', ح: 'h', خ: 'kh',
  د: 'd', ذ: 'dh', ر: 'r', ز: 'z', س: 's', ش: 'sh',
  ص: 's', ض: 'd', ط: 't', ظ: 'z', ع: 'a', غ: 'gh',
  ف: 'f', ق: 'q', ك: 'k', ل: 'l', م: 'm', ن: 'n',
  ه: 'h', و: 'w', ي: 'y', ى: 'a', ة: 'h',
  ' ': '-',
}

const transliterateArabic = (input: string): string =>
  input
    .split('')
    .map((ch) => (ch in ARABIC_MAP ? ARABIC_MAP[ch] : ch))
    .join('')

export const slugify = (input: string): string => {
  if (!input) return ''
  return transliterateArabic(input)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining marks
    .replace(/[^a-z0-9\s-]/g, '') // drop non-ascii leftovers
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}
