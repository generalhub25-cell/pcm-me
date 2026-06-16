import { LOCALES, type Locale } from './enums'

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALES as readonly string[]).includes(value)

export const dirFor = (locale: Locale): 'rtl' | 'ltr' => (locale === 'ar' ? 'rtl' : 'ltr')

/**
 * Bilingual UI chrome strings (PRD §4 IA). These are interface labels, not
 * editorial content. Used by the header, footer, nav and page shells.
 */
type Dict = Record<string, { ar: string; en: string }>

export const ui: Dict = {
  siteName: { ar: 'PCM', en: 'PCM' },
  home: { ar: 'الرئيسية', en: 'Home' },
  articles: { ar: 'مقالات', en: 'Articles' },
  news: { ar: 'أخبار', en: 'News' },
  jobs: { ar: 'وظائف', en: 'Jobs' },
  companies: { ar: 'شركات', en: 'Companies' },
  skills: { ar: 'مهارات', en: 'Skills' },
  quickMba: { ar: 'كويك إم بي إيه', en: 'Quick MBA' },
  immigration: { ar: 'الهجرة', en: 'Immigration' },
  interactions: { ar: 'التفاعلات الدوائية', en: 'Interactions / Medicines' },
  about: { ar: 'من نحن', en: 'About' },
  contact: { ar: 'اتصل بنا', en: 'Contact' },
  search: { ar: 'بحث', en: 'Search' },
  topics: { ar: 'المواضيع', en: 'Topics' },
  menu: { ar: 'القائمة', en: 'Menu' },

  privacy: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
  terms: { ar: 'شروط الاستخدام', en: 'Terms of Use' },
  cookies: { ar: 'سياسة ملفات تعريف الارتباط', en: 'Cookie Policy' },
  legal: { ar: 'قانوني', en: 'Legal' },
  sections: { ar: 'الأقسام', en: 'Sections' },
  social: { ar: 'تابعنا', en: 'Follow us' },

  latestArticles: { ar: 'أحدث المقالات', en: 'Latest articles' },
  latestNews: { ar: 'أحدث الأخبار', en: 'Latest news' },
  featured: { ar: 'مميز', en: 'Featured' },
  featuredVacancies: { ar: 'وظائف مميزة', en: 'Featured vacancies' },
  readMore: { ar: 'اقرأ المزيد', en: 'Read more' },
  applyNow: { ar: 'قدّم الآن', en: 'Apply now' },
  noResults: { ar: 'لا توجد نتائج.', en: 'No results.' },
  notFound: { ar: 'الصفحة غير موجودة', en: 'Page not found' },
  backHome: { ar: 'العودة للرئيسية', en: 'Back to home' },
  filter: { ar: 'تصفية', en: 'Filter' },
  keyword: { ar: 'كلمة مفتاحية', en: 'Keyword' },
  country: { ar: 'الدولة', en: 'Country' },
  roleType: { ar: 'نوع الوظيفة', en: 'Role type' },
  employer: { ar: 'جهة العمل', en: 'Employer' },
  all: { ar: 'الكل', en: 'All' },
  previous: { ar: 'السابق', en: 'Previous' },
  next: { ar: 'التالي', en: 'Next' },
  page: { ar: 'صفحة', en: 'Page' },
  aboutBlurb: {
    ar: 'PCM منصة معرفية ومهنية لقطاع الصيدلة والرعاية الصحية.',
    en: 'PCM is a knowledge and careers platform for the pharmaceutical and healthcare sector.',
  },
  contactLine: { ar: 'تواصل معنا عبر صفحة الاتصال.', en: 'Get in touch via our contact page.' },
  switchLanguage: { ar: 'English', en: 'العربية' },
  searchAllLocales: { ar: 'البحث في كل اللغات', en: 'Search all languages' },
  typeArticle: { ar: 'مقال', en: 'Article' },
  typeVacancy: { ar: 'وظيفة', en: 'Vacancy' },
  typeCompany: { ar: 'شركة', en: 'Company' },
  emptyQuery: { ar: 'أدخل كلمة للبحث.', en: 'Enter a term to search.' },
  resultsCount: { ar: 'نتيجة', en: 'results' },
}

export const t = (locale: Locale, key: keyof typeof ui): string => ui[key][locale]

// Country labels per locale (route uses the slug map in enums).
export const countryLabel: Record<string, { ar: string; en: string }> = {
  egypt: { ar: 'مصر', en: 'Egypt' },
  emirates: { ar: 'الإمارات', en: 'Emirates' },
  ksa: { ar: 'السعودية', en: 'KSA' },
  kuwait: { ar: 'الكويت', en: 'Kuwait' },
  north_africa: { ar: 'شمال أفريقيا', en: 'North Africa' },
  general: { ar: 'عام', en: 'General' },
}

export const roleTypeLabel: Record<string, { ar: string; en: string }> = {
  medical_representative: { ar: 'مندوب طبي', en: 'Medical Representative' },
  product_specialist: { ar: 'أخصائي منتج', en: 'Product Specialist' },
  territory_manager: { ar: 'مدير منطقة', en: 'Territory Manager' },
  other: { ar: 'أخرى', en: 'Other' },
}

export const skillsTrackLabel: Record<string, { ar: string; en: string }> = {
  business: { ar: 'الأعمال', en: 'Business' },
  basic: { ar: 'أساسي', en: 'Basic' },
  life: { ar: 'الحياة', en: 'Life' },
  manager: { ar: 'مدير', en: 'Manager' },
  'product-manager': { ar: 'مدير المنتج', en: 'Product Manager' },
}
