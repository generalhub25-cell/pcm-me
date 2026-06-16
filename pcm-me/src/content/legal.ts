import type { Locale } from '../lib/enums'

/**
 * Legal copy (PRD §5.8, §6.3). OQ-11: drafted for legal review — marked
 * "DRAFT — pending legal review"; NOT represented as lawyer-approved. Covers
 * GDPR requirements: lawful basis, data collected (incl. job applications,
 * contact data, analytics/cookies), retention (APPLICATION_RETENTION_DAYS,
 * Session 04 / OQ-5), user rights, and a contact for data requests (OQ-6).
 */
export type LegalSection = { heading: string; body: string[] }
export type LegalDoc = { title: string; updated: string; sections: LegalSection[] }

export const DRAFT_NOTICE: Record<Locale, string> = {
  ar: 'مسودة — في انتظار المراجعة القانونية. هذه الصياغة غير معتمدة قانونيًا بعد.',
  en: 'DRAFT — pending legal review. This text is not yet legally approved.',
}

export const privacyPolicy: Record<Locale, LegalDoc> = {
  en: {
    title: 'Privacy Policy',
    updated: '2026-06-16',
    sections: [
      {
        heading: 'Who we are',
        body: [
          'PCM operates this website. As the operator is established in the EU (Cyprus), we process personal data in line with the EU General Data Protection Regulation (GDPR).',
        ],
      },
      {
        heading: 'Lawful basis',
        body: [
          'We process personal data on the following lawful bases: your consent (cookies/analytics and submitting an application or contact message), the performance of steps prior to entering an employment relationship (job applications), and our legitimate interests in operating and securing the site.',
        ],
      },
      {
        heading: 'Data we collect',
        body: [
          'Job applications: your name, email address, phone number, and the CV file you upload, together with the vacancy and the language of the page you applied from.',
          'Contact form: your name, email address, and message.',
          'Cookies and analytics: essential cookies required for the site to function and, only with your consent, non-essential analytics cookies.',
        ],
      },
      {
        heading: 'How we use your data',
        body: [
          'Application data is used solely to review and process your job application and, where configured, to forward it to the relevant recipient. Contact data is used to respond to your enquiry. Analytics (with consent) helps us understand and improve site usage.',
        ],
      },
      {
        heading: 'Retention',
        body: [
          'Application data is retained for the period configured by the operator (APPLICATION_RETENTION_DAYS); where unset, it is kept only as long as necessary for the purposes above and then deleted. Contact messages are kept for as long as needed to handle your enquiry.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'Under the GDPR you have the right to access, rectification, erasure, restriction, objection, and data portability regarding your personal data. You may withdraw consent at any time.',
        ],
      },
      {
        heading: 'Contact for data requests',
        body: [
          'To exercise your rights or ask about this policy, contact us via the contact page. (Public contact details are pending — OQ-6.)',
        ],
      },
    ],
  },
  ar: {
    title: 'سياسة الخصوصية',
    updated: '2026-06-16',
    sections: [
      {
        heading: 'من نحن',
        body: [
          'تُشغِّل PCM هذا الموقع. ولأن الجهة المُشغِّلة مؤسَّسة في الاتحاد الأوروبي (قبرص)، فإننا نعالج البيانات الشخصية وفقًا للائحة العامة لحماية البيانات (GDPR).',
        ],
      },
      {
        heading: 'الأساس القانوني',
        body: [
          'نعالج البيانات الشخصية بناءً على: موافقتك (ملفات تعريف الارتباط/التحليلات وإرسال طلب توظيف أو رسالة تواصل)، واتخاذ خطوات تمهيدية قبل التوظيف (طلبات الوظائف)، ومصالحنا المشروعة في تشغيل الموقع وتأمينه.',
        ],
      },
      {
        heading: 'البيانات التي نجمعها',
        body: [
          'طلبات التوظيف: الاسم، البريد الإلكتروني، رقم الهاتف، وملف السيرة الذاتية الذي ترفعه، مع الوظيفة ولغة الصفحة التي قدّمت منها.',
          'نموذج التواصل: الاسم، البريد الإلكتروني، والرسالة.',
          'ملفات تعريف الارتباط والتحليلات: ملفات أساسية لازمة لعمل الموقع، وملفات تحليلات غير أساسية بموافقتك فقط.',
        ],
      },
      {
        heading: 'كيفية استخدام بياناتك',
        body: [
          'تُستخدم بيانات الطلب فقط لمراجعة طلب التوظيف ومعالجته، وعند التهيئة لإرساله إلى الجهة المعنية. وتُستخدم بيانات التواصل للرد على استفسارك. وتساعدنا التحليلات (بموافقتك) على فهم استخدام الموقع وتحسينه.',
        ],
      },
      {
        heading: 'مدة الاحتفاظ',
        body: [
          'يُحتفظ ببيانات الطلب للمدة التي تحددها الجهة المُشغِّلة (APPLICATION_RETENTION_DAYS)، وعند عدم تحديدها يُحتفظ بها للمدة اللازمة للأغراض المذكورة فقط ثم تُحذف. وتُحفظ رسائل التواصل للمدة اللازمة لمعالجة استفسارك.',
        ],
      },
      {
        heading: 'حقوقك',
        body: [
          'وفقًا للائحة GDPR لك الحق في الوصول والتصحيح والمحو والتقييد والاعتراض ونقل البيانات بشأن بياناتك الشخصية. ويمكنك سحب موافقتك في أي وقت.',
        ],
      },
      {
        heading: 'جهة طلبات البيانات',
        body: [
          'لممارسة حقوقك أو الاستفسار عن هذه السياسة، تواصل معنا عبر صفحة الاتصال. (بيانات التواصل العامة قيد التحديد — OQ-6.)',
        ],
      },
    ],
  },
}

export const termsOfUse: Record<Locale, LegalDoc> = {
  en: {
    title: 'Terms of Use',
    updated: '2026-06-16',
    sections: [
      { heading: 'Acceptance', body: ['By using this site you agree to these Terms of Use.'] },
      {
        heading: 'Use of the site',
        body: ['The content is provided for information and professional/career purposes. You agree not to misuse the site or attempt to disrupt its operation.'],
      },
      {
        heading: 'Job listings',
        body: ['Vacancies are provided for information; we do not guarantee their accuracy, availability, or the outcome of any application.'],
      },
      {
        heading: 'Intellectual property',
        body: ['Site content is owned by PCM or its licensors and may not be reproduced without permission.'],
      },
      {
        heading: 'Liability',
        body: ['The site is provided "as is" without warranties to the extent permitted by law.'],
      },
      { heading: 'Governing law', body: ['These terms are governed by the laws applicable to the EU (Cyprus) operator.'] },
      { heading: 'Changes', body: ['We may update these terms; continued use constitutes acceptance.'] },
    ],
  },
  ar: {
    title: 'شروط الاستخدام',
    updated: '2026-06-16',
    sections: [
      { heading: 'القبول', body: ['باستخدامك هذا الموقع فإنك توافق على شروط الاستخدام هذه.'] },
      {
        heading: 'استخدام الموقع',
        body: ['يُقدَّم المحتوى لأغراض المعلومات والأغراض المهنية. وتوافق على عدم إساءة استخدام الموقع أو محاولة تعطيل عمله.'],
      },
      {
        heading: 'إعلانات الوظائف',
        body: ['تُقدَّم الوظائف لغرض المعلومات؛ ولا نضمن دقتها أو توافرها أو نتيجة أي طلب.'],
      },
      {
        heading: 'الملكية الفكرية',
        body: ['محتوى الموقع مملوك لـ PCM أو المرخِّصين لها ولا يجوز إعادة إنتاجه دون إذن.'],
      },
      { heading: 'المسؤولية', body: ['يُقدَّم الموقع "كما هو" دون ضمانات إلى الحد الذي يسمح به القانون.'] },
      { heading: 'القانون الحاكم', body: ['تخضع هذه الشروط للقوانين المطبقة على الجهة المُشغِّلة في الاتحاد الأوروبي (قبرص).'] },
      { heading: 'التغييرات', body: ['قد نُحدِّث هذه الشروط؛ ويُعد استمرار الاستخدام موافقةً عليها.'] },
    ],
  },
}

export const cookiePolicy: Record<Locale, LegalDoc> = {
  en: {
    title: 'Cookie Policy',
    updated: '2026-06-16',
    sections: [
      {
        heading: 'What cookies we use',
        body: [
          'Essential cookies: required for the site to function (including the cookie that remembers your consent choice). These are always active.',
          'Non-essential cookies: analytics cookies that help us understand site usage. These are loaded only after you consent.',
        ],
      },
      {
        heading: 'Your consent',
        body: [
          'On your first visit a banner lets you accept or reject non-essential cookies. No non-essential cookies or analytics scripts run before you consent.',
        ],
      },
      {
        heading: 'Managing your choice',
        body: ['You can change your choice at any time using the "Cookie settings" link in the footer.'],
      },
    ],
  },
  ar: {
    title: 'سياسة ملفات تعريف الارتباط',
    updated: '2026-06-16',
    sections: [
      {
        heading: 'ما الملفات التي نستخدمها',
        body: [
          'ملفات أساسية: لازمة لعمل الموقع (بما في ذلك الملف الذي يتذكر اختيارك للموافقة)، وهي مُفعَّلة دائمًا.',
          'ملفات غير أساسية: ملفات تحليلات تساعدنا على فهم استخدام الموقع، ولا تُحمَّل إلا بعد موافقتك.',
        ],
      },
      {
        heading: 'موافقتك',
        body: [
          'في زيارتك الأولى يتيح لك شريط الموافقة قبول أو رفض الملفات غير الأساسية. ولا تعمل أي ملفات غير أساسية أو نصوص تحليلات قبل موافقتك.',
        ],
      },
      {
        heading: 'إدارة اختيارك',
        body: ['يمكنك تغيير اختيارك في أي وقت عبر رابط "إعدادات ملفات تعريف الارتباط" في التذييل.'],
      },
    ],
  },
}
