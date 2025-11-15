/**
 * Packages Data - כל החבילות המותאמות
 */
import { Package } from '@/types/packages';

export const packages: Package[] = [
  // Apartment Basic - דירה בסיסית
  {
    id: 'apartment-basic',
    slug: 'apartment-basic',
    name: 'Apartment Basic',
    nameHebrew: 'דירה בסיסית',
    category: 'Residential',
    type: 'apartment',
    description: 'חבילת מיגון בסיסית לדירה - 2-3 מצלמות IP, NVR ואפליקציה בעברית',
    shortDescription: 'מיגון בסיסי לדירה עם 2-3 מצלמות',
    priceRange: 'החל מ-₪2,290',
    pricing: {
      base: 2290,
      currency: 'ILS',
      installation: {
        included: true,
      },
      additionalCameras: {
        pricePerCamera: 350,
        max: 1,
      },
      upgrades: {
        ai: {
          basic: 0,
          advanced: 200,
          enterprise: 500,
        },
        storage: {
          '2TB': 300,
          '4TB': 600,
        },
      },
      addons: [
        {
          id: 'ups-basic',
          name: 'UPS בסיסי',
          description: 'מגן חשמל בסיסי',
          price: 450,
          category: 'hardware',
          optional: true,
        },
      ],
      maintenance: {
        annual: 500,
        optional: true,
      },
    },
    specifications: {
      cameras: {
        min: 2,
        max: 3,
        default: 2,
        types: ['IP', '4MP'],
        brands: ['Dahua'],
      },
      nvr: {
        channels: 4,
        type: 'NVR 4ch',
        model: 'NVR5-4100PX+',
      },
      storage: {
        size: '1TB',
        type: 'HDD',
        recordingTime: '30 days',
      },
      aiDetection: {
        level: 'basic',
        features: ['זיהוי תנועה', 'התראות בסיסיות'],
      },
      app: {
        platforms: ['iOS', 'Android'],
        language: 'עברית',
        features: ['צפייה בזמן אמת', 'התראות', 'הקלטות'],
      },
      support: {
        level: 'basic',
        responseTime: '48 שעות',
        features: ['תמיכה טלפונית', 'עדכונים'],
      },
      warranty: {
        months: 12,
        coverage: ['ציוד', 'התקנה'],
      },
    },
    features: [
      { id: 'cameras', name: '2-3 מצלמות IP', description: 'רזולוציה 4MP' },
      { id: 'nvr', name: 'NVR 4 ערוצים', description: 'חיבור מקומי' },
      { id: 'app', name: 'אפליקציה בעברית', description: 'iOS ו-Android' },
      { id: 'storage', name: 'אחסון 1TB', description: 'כ-30 יום הקלטה' },
      { id: 'installation', name: 'התקנה מקצועית', description: 'כלולה במחיר' },
      { id: 'warranty', name: 'אחריות 12 חודשים', description: 'כיסוי מלא' },
    ],
    popular: true,
    seo: {
      title: 'חבילת מיגון דירה בסיסית - Aegis Spectra',
      description: 'חבילת מיגון בסיסית לדירה עם 2-3 מצלמות IP, NVR ואפליקציה בעברית. התקנה מקצועית ואחריות 12 חודשים.',
      keywords: ['מיגון דירה', 'מצלמות דירה', 'אבטחה דירה', 'חבילת מצלמות'],
    },
    faq: [
      {
        question: 'כמה מצלמות כלולות בחבילה?',
        answer: 'החבילה כוללת 2 מצלמות IP בסיסיות, עם אפשרות להוסיף עד מצלמה אחת נוספת.',
      },
      {
        question: 'מה כולל ההתקנה?',
        answer: 'ההתקנה כוללת חיווט, קונפיגורציה של ה-NVR, הגדרת האפליקציה והדרכה קצרה.',
      },
    ],
  },

  // Apartment Pro - דירה מתקדמת
  {
    id: 'apartment-pro',
    slug: 'apartment-pro',
    name: 'Apartment Pro',
    nameHebrew: 'דירה מתקדמת',
    category: 'Residential',
    type: 'apartment',
    description: 'חבילת מיגון מתקדמת לדירה - 3-4 מצלמות 4MP, AI Detection, UPS ואפליקציה מתקדמת',
    shortDescription: 'מיגון מתקדם לדירה עם AI ואפליקציה מתקדמת',
    priceRange: 'החל מ-₪3,990',
    pricing: {
      base: 3990,
      currency: 'ILS',
      installation: {
        included: true,
      },
      additionalCameras: {
        pricePerCamera: 400,
        max: 2,
      },
      upgrades: {
        ai: {
          basic: 0,
          advanced: 0,
          enterprise: 300,
        },
        storage: {
          '2TB': 300,
          '4TB': 600,
        },
      },
      addons: [
        {
          id: 'ups-pro',
          name: 'UPS מתקדם',
          description: 'מגן חשמל מתקדם עם ניטור',
          price: 650,
          category: 'hardware',
          optional: true,
        },
        {
          id: 'alarm-basic',
          name: 'מערכת אזעקה בסיסית',
          description: 'חיישני תנועה ודלת',
          price: 1200,
          category: 'hardware',
          optional: true,
        },
      ],
      maintenance: {
        annual: 800,
        optional: true,
      },
    },
    specifications: {
      cameras: {
        min: 3,
        max: 4,
        default: 3,
        types: ['IP', '4MP', 'AI'],
        brands: ['Dahua'],
      },
      nvr: {
        channels: 8,
        type: 'NVR 8ch',
        model: 'NVR5-8100PX+',
      },
      storage: {
        size: '2TB',
        type: 'HDD',
        recordingTime: '45 days',
      },
      aiDetection: {
        level: 'advanced',
        features: ['זיהוי אדם', 'זיהוי רכב', 'התראות חכמות', 'ניתוח התנהגות'],
      },
      app: {
        platforms: ['iOS', 'Android'],
        language: 'עברית',
        features: ['צפייה בזמן אמת', 'התראות מותאמות', 'הקלטות', 'ניתוח AI', 'שיתוף קטעים'],
      },
      support: {
        level: 'professional',
        responseTime: '24 שעות',
        features: ['תמיכה טלפונית', 'תמיכה אימייל', 'עדכונים', 'ייעוץ טכני'],
      },
      warranty: {
        months: 12,
        coverage: ['ציוד', 'התקנה', 'תמיכה'],
      },
    },
    features: [
      { id: 'cameras', name: '3-4 מצלמות IP', description: 'רזולוציה 4MP עם AI' },
      { id: 'nvr', name: 'NVR 8 ערוצים', description: 'חיבור מקומי ורשת' },
      { id: 'ai', name: 'AI Detection מתקדם', description: 'זיהוי אדם ורכב' },
      { id: 'app', name: 'אפליקציה מתקדמת', description: 'ניתוח AI ושיתוף' },
      { id: 'storage', name: 'אחסון 2TB', description: 'כ-45 יום הקלטה' },
      { id: 'warranty', name: 'אחריות 12 חודשים', description: 'כיסוי מלא + תמיכה' },
    ],
    recommended: true,
    seo: {
      title: 'חבילת מיגון דירה מתקדמת - Aegis Spectra',
      description: 'חבילת מיגון מתקדמת לדירה עם AI Detection, 3-4 מצלמות 4MP, UPS ואפליקציה מתקדמת. התקנה מקצועית.',
      keywords: ['מיגון דירה מתקדם', 'מצלמות AI', 'אבטחה דירה', 'חבילת מיגון מתקדמת'],
    },
  },

  // House Essential - בית בסיסי
  {
    id: 'house-essential',
    slug: 'house-essential',
    name: 'House Essential',
    nameHebrew: 'בית בסיסי',
    category: 'Residential',
    type: 'house',
    description: 'חבילת מיגון בסיסית לבית - 4-5 מצלמות IP, NVR, UPS ואפליקציה בעברית',
    shortDescription: 'מיגון בסיסי לבית עם 4-5 מצלמות',
    priceRange: 'החל מ-₪4,990',
    pricing: {
      base: 4990,
      currency: 'ILS',
      installation: {
        included: true,
      },
      additionalCameras: {
        pricePerCamera: 400,
        max: 3,
      },
      upgrades: {
        ai: {
          basic: 0,
          advanced: 300,
          enterprise: 600,
        },
        storage: {
          '4TB': 500,
          '8TB': 1200,
        },
      },
      addons: [
        {
          id: 'ups-house',
          name: 'UPS לבית',
          description: 'מגן חשמל לבית',
          price: 750,
          category: 'hardware',
          optional: true,
        },
        {
          id: 'gate-intercom',
          name: 'אינטרקום שער',
          description: 'מערכת אינטרקום לשער',
          price: 1800,
          category: 'hardware',
          optional: true,
        },
      ],
      maintenance: {
        annual: 800,
        optional: true,
      },
    },
    specifications: {
      cameras: {
        min: 4,
        max: 5,
        default: 4,
        types: ['IP', '4MP'],
        brands: ['Dahua'],
      },
      nvr: {
        channels: 8,
        type: 'NVR 8ch',
        model: 'NVR5-8100PX+',
      },
      storage: {
        size: '2TB',
        type: 'HDD',
        recordingTime: '30 days',
      },
      aiDetection: {
        level: 'basic',
        features: ['זיהוי תנועה', 'התראות בסיסיות'],
      },
      app: {
        platforms: ['iOS', 'Android'],
        language: 'עברית',
        features: ['צפייה בזמן אמת', 'התראות', 'הקלטות'],
      },
      ups: {
        included: false,
        model: 'UPS-500VA',
      },
      support: {
        level: 'basic',
        responseTime: '48 שעות',
        features: ['תמיכה טלפונית', 'עדכונים'],
      },
      warranty: {
        months: 12,
        coverage: ['ציוד', 'התקנה'],
      },
    },
    features: [
      { id: 'cameras', name: '4-5 מצלמות IP', description: 'רזולוציה 4MP' },
      { id: 'nvr', name: 'NVR 8 ערוצים', description: 'חיבור מקומי' },
      { id: 'app', name: 'אפליקציה בעברית', description: 'iOS ו-Android' },
      { id: 'storage', name: 'אחסון 2TB', description: 'כ-30 יום הקלטה' },
      { id: 'installation', name: 'התקנה מקצועית', description: 'כלולה במחיר' },
      { id: 'warranty', name: 'אחריות 12 חודשים', description: 'כיסוי מלא' },
    ],
    popular: true,
    seo: {
      title: 'חבילת מיגון בית בסיסית - Aegis Spectra',
      description: 'חבילת מיגון בסיסית לבית עם 4-5 מצלמות IP, NVR ואפליקציה בעברית. התקנה מקצועית.',
      keywords: ['מיגון בית', 'מצלמות בית', 'אבטחה בית', 'חבילת מצלמות בית'],
    },
  },

  // House Pro - בית מתקדם
  {
    id: 'house-pro',
    slug: 'house-pro',
    name: 'House Pro',
    nameHebrew: 'בית מתקדם',
    category: 'Residential',
    type: 'house',
    description: 'חבילת מיגון מתקדמת לבית - 5-8 מצלמות 4K/Color, AI מתקדם, UPS, אינטרקום ואפליקציה מתקדמת',
    shortDescription: 'מיגון מתקדם לבית עם AI, 4K ו-UPS',
    priceRange: 'החל מ-₪7,990',
    pricing: {
      base: 7990,
      currency: 'ILS',
      installation: {
        included: true,
      },
      additionalCameras: {
        pricePerCamera: 500,
        max: 5,
      },
      upgrades: {
        ai: {
          basic: 0,
          advanced: 0,
          enterprise: 400,
        },
        storage: {
          '4TB': 500,
          '8TB': 1200,
          '16TB': 2500,
        },
      },
      addons: [
        {
          id: 'ups-pro-house',
          name: 'UPS מתקדם לבית',
          description: 'מגן חשמל מתקדם עם ניטור',
          price: 950,
          category: 'hardware',
          optional: true,
        },
        {
          id: 'gate-intercom-pro',
          name: 'אינטרקום שער מתקדם',
          description: 'אינטרקום עם מצלמה ו-AI',
          price: 2400,
          category: 'hardware',
          optional: true,
        },
        {
          id: 'alarm-house',
          name: 'מערכת אזעקה לבית',
          description: 'חיישנים אלחוטיים מתקדמים',
          price: 1800,
          category: 'hardware',
          optional: true,
        },
      ],
      maintenance: {
        annual: 1200,
        optional: true,
      },
    },
    specifications: {
      cameras: {
        min: 5,
        max: 8,
        default: 6,
        types: ['IP', '4MP', '4K', 'Color Night', 'AI'],
        brands: ['Dahua'],
      },
      nvr: {
        channels: 16,
        type: 'NVR 16ch',
        model: 'NVR5-16100PX+',
      },
      storage: {
        size: '4TB',
        type: 'HDD',
        recordingTime: '60 days',
      },
      aiDetection: {
        level: 'advanced',
        features: ['זיהוי אדם', 'זיהוי רכב', 'התראות חכמות', 'ניתוח התנהגות', 'Color Night Vision'],
      },
      app: {
        platforms: ['iOS', 'Android'],
        language: 'עברית',
        features: ['צפייה בזמן אמת', 'התראות מותאמות', 'הקלטות', 'ניתוח AI', 'שיתוף קטעים', 'צפייה משותפת'],
      },
      ups: {
        included: true,
        model: 'UPS-1000VA',
      },
      support: {
        level: 'professional',
        responseTime: '24 שעות',
        features: ['תמיכה טלפונית', 'תמיכה אימייל', 'עדכונים', 'ייעוץ טכני', 'ביקור תחזוקה'],
      },
      warranty: {
        months: 12,
        coverage: ['ציוד', 'התקנה', 'תמיכה'],
      },
    },
    features: [
      { id: 'cameras', name: '5-8 מצלמות 4K/Color', description: 'רזולוציה גבוהה עם AI' },
      { id: 'nvr', name: 'NVR 16 ערוצים', description: 'חיבור מקומי ורשת' },
      { id: 'ai', name: 'AI Detection מתקדם', description: 'זיהוי אדם, רכב ו-Color Night' },
      { id: 'app', name: 'אפליקציה מתקדמת', description: 'ניתוח AI ושיתוף' },
      { id: 'storage', name: 'אחסון 4TB', description: 'כ-60 יום הקלטה' },
      { id: 'ups', name: 'UPS כלול', description: 'מגן חשמל מתקדם' },
      { id: 'warranty', name: 'אחריות 12 חודשים', description: 'כיסוי מלא + תמיכה' },
    ],
    recommended: true,
    seo: {
      title: 'חבילת מיגון בית מתקדמת - Aegis Spectra',
      description: 'חבילת מיגון מתקדמת לבית עם AI, 5-8 מצלמות 4K/Color, UPS ואפליקציה מתקדמת. התקנה מקצועית.',
      keywords: ['מיגון בית מתקדם', 'מצלמות 4K', 'אבטחה בית', 'חבילת מיגון מתקדמת'],
    },
  },

  // Business Starter - עסק קטן
  {
    id: 'business-starter',
    slug: 'business-starter',
    name: 'Business Starter',
    nameHebrew: 'עסק קטן',
    category: 'Commercial',
    type: 'business',
    description: 'חבילת מיגון לעסק קטן - 6-8 מצלמות IP, AI Detection, אזור קופה, תמיכה מקצועית',
    shortDescription: 'מיגון לעסק קטן עם AI ואזור קופה',
    priceRange: 'החל מ-₪8,900',
    pricing: {
      base: 8900,
      currency: 'ILS',
      installation: {
        included: true,
      },
      additionalCameras: {
        pricePerCamera: 450,
        max: 6,
      },
      upgrades: {
        ai: {
          basic: 0,
          advanced: 0,
          enterprise: 500,
        },
        storage: {
          '4TB': 500,
          '8TB': 1200,
          '16TB': 2500,
        },
      },
      addons: [
        {
          id: 'cash-register-area',
          name: 'אזור קופה מותאם',
          description: 'מצלמות מותאמות לאזור הקופה',
          price: 0,
          category: 'service',
          optional: false,
        },
        {
          id: 'ups-business',
          name: 'UPS לעסק',
          description: 'מגן חשמל לעסק',
          price: 1200,
          category: 'hardware',
          optional: true,
        },
      ],
      maintenance: {
        annual: 1500,
        optional: false,
      },
    },
    specifications: {
      cameras: {
        min: 6,
        max: 8,
        default: 6,
        types: ['IP', '4MP', 'AI'],
        brands: ['Dahua'],
      },
      nvr: {
        channels: 16,
        type: 'NVR 16ch',
        model: 'NVR5-16100PX+',
      },
      storage: {
        size: '4TB',
        type: 'HDD',
        recordingTime: '45 days',
      },
      aiDetection: {
        level: 'advanced',
        features: ['זיהוי אדם', 'זיהוי רכב', 'התראות חכמות', 'ניתוח התנהגות', 'אזור קופה'],
      },
      app: {
        platforms: ['iOS', 'Android'],
        language: 'עברית',
        features: ['צפייה בזמן אמת', 'התראות מותאמות', 'הקלטות', 'ניתוח AI', 'שיתוף קטעים', 'דוחות'],
      },
      support: {
        level: 'professional',
        responseTime: '24 שעות',
        features: ['תמיכה טלפונית', 'תמיכה אימייל', 'עדכונים', 'ייעוץ טכני', 'ביקור תחזוקה', 'דוחות חודשיים'],
      },
      warranty: {
        months: 12,
        coverage: ['ציוד', 'התקנה', 'תמיכה'],
      },
    },
    features: [
      { id: 'cameras', name: '6-8 מצלמות IP', description: 'רזולוציה 4MP עם AI' },
      { id: 'nvr', name: 'NVR 16 ערוצים', description: 'חיבור מקומי ורשת' },
      { id: 'ai', name: 'AI Detection מתקדם', description: 'זיהוי אדם, רכב ואזור קופה' },
      { id: 'cash-register', name: 'אזור קופה', description: 'מצלמות מותאמות לקופה' },
      { id: 'app', name: 'אפליקציה מתקדמת', description: 'ניתוח AI ודוחות' },
      { id: 'storage', name: 'אחסון 4TB', description: 'כ-45 יום הקלטה' },
      { id: 'support', name: 'תמיכה מקצועית', description: '24 שעות + דוחות' },
      { id: 'warranty', name: 'אחריות 12 חודשים', description: 'כיסוי מלא + תמיכה' },
    ],
    popular: true,
    seo: {
      title: 'חבילת מיגון עסק קטן - Aegis Spectra',
      description: 'חבילת מיגון לעסק קטן עם AI, 6-8 מצלמות IP, אזור קופה ותמיכה מקצועית. התקנה מקצועית.',
      keywords: ['מיגון עסק', 'מצלמות עסק', 'אבטחה עסק', 'חבילת מיגון עסק'],
    },
  },

  // Business Professional - עסק בינוני
  {
    id: 'business-professional',
    slug: 'business-professional',
    name: 'Business Professional',
    nameHebrew: 'עסק בינוני',
    category: 'Commercial',
    type: 'business',
    description: 'חבילת מיגון מתקדמת לעסק בינוני - 8-12 מצלמות, AI Enterprise, אזור קופה, בקרת כניסה, SLA',
    shortDescription: 'מיגון מתקדם לעסק בינוני עם AI Enterprise ו-SLA',
    priceRange: 'החל מ-₪14,900',
    pricing: {
      base: 14900,
      currency: 'ILS',
      installation: {
        included: true,
      },
      additionalCameras: {
        pricePerCamera: 500,
        max: 8,
      },
      upgrades: {
        ai: {
          basic: 0,
          advanced: 0,
          enterprise: 0,
        },
        storage: {
          '8TB': 1200,
          '16TB': 2500,
          '32TB': 5000,
        },
      },
      addons: [
        {
          id: 'access-control',
          name: 'בקרת כניסה',
          description: 'מערכת בקרת כניסה מתקדמת',
          price: 3500,
          category: 'hardware',
          optional: true,
        },
        {
          id: 'alarm-business',
          name: 'מערכת אזעקה לעסק',
          description: 'מערכת אזעקה מקצועית',
          price: 2500,
          category: 'hardware',
          optional: true,
        },
      ],
      maintenance: {
        annual: 2500,
        optional: false,
      },
      discountRules: [
        {
          condition: 'cameras > 10',
          discount: 5,
          description: '5% הנחה מעל 10 מצלמות',
        },
      ],
    },
    specifications: {
      cameras: {
        min: 8,
        max: 12,
        default: 10,
        types: ['IP', '4MP', '4K', 'AI'],
        brands: ['Dahua'],
      },
      nvr: {
        channels: 32,
        type: 'NVR 32ch',
        model: 'NVR5-32100PX+',
      },
      storage: {
        size: '8TB',
        type: 'HDD',
        recordingTime: '90 days',
      },
      aiDetection: {
        level: 'enterprise',
        features: ['זיהוי אדם', 'זיהוי רכב', 'התראות חכמות', 'ניתוח התנהגות', 'אזור קופה', 'ניתוח אוטומטי', 'דוחות AI'],
      },
      app: {
        platforms: ['iOS', 'Android'],
        language: 'עברית',
        features: ['צפייה בזמן אמת', 'התראות מותאמות', 'הקלטות', 'ניתוח AI', 'שיתוף קטעים', 'דוחות מפורטים', 'ניהול משתמשים'],
      },
      support: {
        level: 'enterprise',
        responseTime: '12 שעות',
        features: ['תמיכה טלפונית', 'תמיכה אימייל', 'עדכונים', 'ייעוץ טכני', 'ביקור תחזוקה', 'דוחות חודשיים', 'SLA Silver'],
      },
      warranty: {
        months: 12,
        coverage: ['ציוד', 'התקנה', 'תמיכה', 'תחזוקה'],
      },
    },
    features: [
      { id: 'cameras', name: '8-12 מצלמות IP', description: 'רזולוציה 4MP/4K עם AI Enterprise' },
      { id: 'nvr', name: 'NVR 32 ערוצים', description: 'חיבור מקומי ורשת' },
      { id: 'ai', name: 'AI Enterprise', description: 'ניתוח מתקדם ודוחות AI' },
      { id: 'cash-register', name: 'אזור קופה', description: 'מצלמות מותאמות לקופה' },
      { id: 'app', name: 'אפליקציה מתקדמת', description: 'ניתוח AI ודוחות מפורטים' },
      { id: 'storage', name: 'אחסון 8TB', description: 'כ-90 יום הקלטה' },
      { id: 'support', name: 'תמיכה Enterprise', description: '12 שעות + SLA Silver' },
      { id: 'warranty', name: 'אחריות 12 חודשים', description: 'כיסוי מלא + תמיכה + תחזוקה' },
    ],
    recommended: true,
    seo: {
      title: 'חבילת מיגון עסק בינוני - Aegis Spectra',
      description: 'חבילת מיגון מתקדמת לעסק בינוני עם AI Enterprise, 8-12 מצלמות, בקרת כניסה ו-SLA. התקנה מקצועית.',
      keywords: ['מיגון עסק בינוני', 'מצלמות AI Enterprise', 'אבטחה עסק', 'SLA'],
    },
  },

  // Business Enterprise - עסק גדול
  {
    id: 'business-enterprise',
    slug: 'business-enterprise',
    name: 'Business Enterprise',
    nameHebrew: 'עסק גדול',
    category: 'Commercial',
    type: 'business',
    description: 'חבילת מיגון Enterprise לעסק גדול - 12-20 מצלמות, AI Enterprise, בקרת כניסה, אזעקה, SLA Gold',
    shortDescription: 'מיגון Enterprise לעסק גדול עם AI מלא ו-SLA Gold',
    priceRange: 'החל מ-₪24,900',
    pricing: {
      base: 24900,
      currency: 'ILS',
      installation: {
        included: true,
      },
      additionalCameras: {
        pricePerCamera: 550,
        max: 15,
      },
      upgrades: {
        ai: {
          basic: 0,
          advanced: 0,
          enterprise: 0,
        },
        storage: {
          '16TB': 2500,
          '32TB': 5000,
          '64TB': 10000,
        },
      },
      addons: [
        {
          id: 'access-control-enterprise',
          name: 'בקרת כניסה Enterprise',
          description: 'מערכת בקרת כניסה מתקדמת עם ניהול מרכזי',
          price: 5500,
          category: 'hardware',
          optional: true,
        },
        {
          id: 'alarm-enterprise',
          name: 'מערכת אזעקה Enterprise',
          description: 'מערכת אזעקה מקצועית עם חיישנים מתקדמים',
          price: 4500,
          category: 'hardware',
          optional: true,
        },
      ],
      maintenance: {
        annual: 4000,
        optional: false,
      },
      discountRules: [
        {
          condition: 'cameras > 15',
          discount: 7,
          description: '7% הנחה מעל 15 מצלמות',
        },
        {
          condition: 'storage >= 32TB',
          discount: 5,
          description: '5% הנחה על אחסון 32TB+',
        },
      ],
    },
    specifications: {
      cameras: {
        min: 12,
        max: 20,
        default: 15,
        types: ['IP', '4MP', '4K', 'AI'],
        brands: ['Dahua'],
      },
      nvr: {
        channels: 64,
        type: 'NVR 64ch',
        model: 'NVR5-64100PX+',
      },
      storage: {
        size: '16TB',
        type: 'HDD',
        recordingTime: '120 days',
      },
      aiDetection: {
        level: 'enterprise',
        features: ['זיהוי אדם', 'זיהוי רכב', 'התראות חכמות', 'ניתוח התנהגות', 'אזור קופה', 'ניתוח אוטומטי', 'דוחות AI', 'Machine Learning'],
      },
      app: {
        platforms: ['iOS', 'Android'],
        language: 'עברית',
        features: ['צפייה בזמן אמת', 'התראות מותאמות', 'הקלטות', 'ניתוח AI', 'שיתוף קטעים', 'דוחות מפורטים', 'ניהול משתמשים', 'ניהול תפקידים'],
      },
      accessControl: {
        included: false,
        type: 'RFID + Biometric',
      },
      alarm: {
        included: false,
        type: 'Wireless + Wired',
      },
      support: {
        level: 'enterprise',
        responseTime: '6 שעות',
        features: ['תמיכה טלפונית', 'תמיכה אימייל', 'עדכונים', 'ייעוץ טכני', 'ביקור תחזוקה', 'דוחות חודשיים', 'SLA Gold', 'Account Manager'],
      },
      warranty: {
        months: 12,
        coverage: ['ציוד', 'התקנה', 'תמיכה', 'תחזוקה', 'שדרוגים'],
      },
    },
    features: [
      { id: 'cameras', name: '12-20 מצלמות IP', description: 'רזולוציה 4MP/4K עם AI Enterprise' },
      { id: 'nvr', name: 'NVR 64 ערוצים', description: 'חיבור מקומי ורשת' },
      { id: 'ai', name: 'AI Enterprise מלא', description: 'ניתוח מתקדם, ML ודוחות AI' },
      { id: 'cash-register', name: 'אזור קופה', description: 'מצלמות מותאמות לקופה' },
      { id: 'app', name: 'אפליקציה Enterprise', description: 'ניתוח AI, דוחות וניהול משתמשים' },
      { id: 'storage', name: 'אחסון 16TB', description: 'כ-120 יום הקלטה' },
      { id: 'support', name: 'תמיכה Enterprise', description: '6 שעות + SLA Gold + Account Manager' },
      { id: 'warranty', name: 'אחריות 12 חודשים', description: 'כיסוי מלא + תמיכה + תחזוקה + שדרוגים' },
    ],
    seo: {
      title: 'חבילת מיגון עסק גדול - Aegis Spectra',
      description: 'חבילת מיגון Enterprise לעסק גדול עם AI Enterprise, 12-20 מצלמות, בקרת כניסה ו-SLA Gold. התקנה מקצועית.',
      keywords: ['מיגון עסק גדול', 'מצלמות AI Enterprise', 'אבטחה Enterprise', 'SLA Gold'],
    },
  },

  // Enterprise Suite - ארגון גדול
  {
    id: 'enterprise-suite',
    slug: 'enterprise-suite',
    name: 'Enterprise Suite',
    nameHebrew: 'ארגון גדול',
    category: 'Enterprise',
    type: 'enterprise',
    description: 'חבילת מיגון Enterprise לארגון גדול - 20+ מצלמות, AI Enterprise, בקרת כניסה, אזעקה, SLA Platinum, תמיכה 24/7',
    shortDescription: 'מיגון Enterprise מלא לארגון עם AI מלא ו-SLA Platinum',
    priceRange: 'החל מ-₪39,900',
    pricing: {
      base: 39900,
      currency: 'ILS',
      installation: {
        included: true,
      },
      additionalCameras: {
        pricePerCamera: 600,
        max: 50,
      },
      upgrades: {
        ai: {
          basic: 0,
          advanced: 0,
          enterprise: 0,
        },
        storage: {
          '32TB': 5000,
          '64TB': 10000,
          '128TB': 20000,
        },
      },
      addons: [
        {
          id: 'access-control-enterprise-suite',
          name: 'בקרת כניסה Enterprise',
          description: 'מערכת בקרת כניסה מתקדמת עם ניהול מרכזי',
          price: 7500,
          category: 'hardware',
          optional: true,
        },
        {
          id: 'alarm-enterprise-suite',
          name: 'מערכת אזעקה Enterprise',
          description: 'מערכת אזעקה מקצועית עם חיישנים מתקדמים',
          price: 6500,
          category: 'hardware',
          optional: true,
        },
      ],
      maintenance: {
        annual: 8000,
        optional: false,
      },
      discountRules: [
        {
          condition: 'cameras > 30',
          discount: 10,
          description: '10% הנחה מעל 30 מצלמות',
        },
        {
          condition: 'storage >= 64TB',
          discount: 8,
          description: '8% הנחה על אחסון 64TB+',
        },
      ],
    },
    specifications: {
      cameras: {
        min: 20,
        max: 50,
        default: 25,
        types: ['IP', '4MP', '4K', 'AI'],
        brands: ['Dahua'],
      },
      nvr: {
        channels: 128,
        type: 'NVR 128ch',
        model: 'NVR5-128100PX+',
      },
      storage: {
        size: '32TB',
        type: 'HDD',
        recordingTime: '180 days',
      },
      aiDetection: {
        level: 'enterprise',
        features: ['זיהוי אדם', 'זיהוי רכב', 'התראות חכמות', 'ניתוח התנהגות', 'אזור קופה', 'ניתוח אוטומטי', 'דוחות AI', 'Machine Learning', 'Predictive Analytics'],
      },
      app: {
        platforms: ['iOS', 'Android', 'Web'],
        language: 'עברית',
        features: ['צפייה בזמן אמת', 'התראות מותאמות', 'הקלטות', 'ניתוח AI', 'שיתוף קטעים', 'דוחות מפורטים', 'ניהול משתמשים', 'ניהול תפקידים', 'ניהול מרכזי', 'API Integration'],
      },
      accessControl: {
        included: false,
        type: 'RFID + Biometric + Mobile',
      },
      alarm: {
        included: false,
        type: 'Wireless + Wired + Central',
      },
      support: {
        level: 'enterprise',
        responseTime: '2 שעות',
        features: ['תמיכה 24/7', 'תמיכה טלפונית', 'תמיכה אימייל', 'עדכונים', 'ייעוץ טכני', 'ביקור תחזוקה', 'דוחות חודשיים', 'SLA Platinum', 'Account Manager', 'Dedicated Support Team'],
      },
      warranty: {
        months: 24,
        coverage: ['ציוד', 'התקנה', 'תמיכה', 'תחזוקה', 'שדרוגים', 'החלפה'],
      },
    },
    features: [
      { id: 'cameras', name: '20+ מצלמות IP', description: 'רזולוציה 4MP/4K עם AI Enterprise' },
      { id: 'nvr', name: 'NVR 128 ערוצים', description: 'חיבור מקומי ורשת' },
      { id: 'ai', name: 'AI Enterprise מלא', description: 'ניתוח מתקדם, ML, Predictive Analytics' },
      { id: 'cash-register', name: 'אזור קופה', description: 'מצלמות מותאמות לקופה' },
      { id: 'app', name: 'אפליקציה Enterprise', description: 'ניתוח AI, דוחות, ניהול מרכזי ו-API' },
      { id: 'storage', name: 'אחסון 32TB+', description: 'כ-180 יום הקלטה' },
      { id: 'support', name: 'תמיכה 24/7 Enterprise', description: '2 שעות + SLA Platinum + Account Manager + Dedicated Team' },
      { id: 'warranty', name: 'אחריות 24 חודשים', description: 'כיסוי מלא + תמיכה + תחזוקה + שדרוגים + החלפה' },
    ],
    seo: {
      title: 'חבילת מיגון Enterprise - Aegis Spectra',
      description: 'חבילת מיגון Enterprise לארגון גדול עם AI Enterprise, 20+ מצלמות, בקרת כניסה ו-SLA Platinum. תמיכה 24/7.',
      keywords: ['מיגון Enterprise', 'מצלמות AI Enterprise', 'אבטחה Enterprise', 'SLA Platinum'],
    },
  },
];

// Helper function to get package by slug
export function getPackageBySlug(slug: string): Package | undefined {
  return packages.find((pkg) => pkg.slug === slug);
}

// Helper function to get packages by category
export function getPackagesByCategory(category: Package['category']): Package[] {
  return packages.filter((pkg) => pkg.category === category);
}

// Helper function to get packages by type
export function getPackagesByType(type: Package['type']): Package[] {
  return packages.filter((pkg) => pkg.type === type);
}

