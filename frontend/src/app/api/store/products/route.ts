import { NextRequest, NextResponse } from 'next/server';

// Product data structure
interface Product {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  category: 'cameras' | 'packages' | 'accessories' | 'services';
  features: string[];
  specifications: Array<{ label: string; value: string }>;
  image: string;
  popular?: boolean;
  new?: boolean;
  inStock: boolean;
  stockCount: number;
}

// Comprehensive product catalog
export const products: Product[] = [
  // Individual Cameras
  {
    id: 'ip-camera-2mp',
    name: 'IP Camera 2 MP',
    description: 'מצלמת רשת בסיסית עם ראיית לילה IR',
    priceRange: '₪250 – ₪350',
    minPrice: 250,
    maxPrice: 350,
    category: 'cameras',
    features: [
      'רזולוציה 2MP (1920×1080)',
      'ראיית לילה IR עד 30 מטר',
      'עמידות למים IP66',
      'זווית ראייה 90°',
      'תמיכה ב-WiFi ו-Ethernet',
      'אפליקציה לנייד'
    ],
    specifications: [
      { label: 'רזולוציה', value: '2MP (1920×1080)' },
      { label: 'חיישן', value: '1/2.7" CMOS' },
      { label: 'ראיית לילה', value: 'IR עד 30 מטר' },
      { label: 'זווית ראייה', value: '90°' },
      { label: 'חיבור', value: 'WiFi + Ethernet' },
      { label: 'אחסון', value: 'MicroSD עד 128GB' },
      { label: 'עמידות', value: 'IP66' },
      { label: 'מתח', value: '12V DC / PoE' }
    ],
    image: '/api/placeholder/300/200',
    popular: true,
    inStock: true,
    stockCount: 15
  },
  {
    id: 'ip-camera-4mp',
    name: 'IP Camera 4 MP',
    description: 'איכות בינונית + זיהוי תנועה',
    priceRange: '₪400 – ₪550',
    minPrice: 400,
    maxPrice: 550,
    category: 'cameras',
    features: [
      'רזולוציה 4MP (2560×1440)',
      'זיהוי תנועה חכם',
      'טכנולוגיית WDR',
      'ראיית לילה IR עד 50 מטר',
      'זווית ראייה 110°',
      'אפליקציה מתקדמת'
    ],
    specifications: [
      { label: 'רזולוציה', value: '4MP (2560×1440)' },
      { label: 'חיישן', value: '1/2.8" CMOS' },
      { label: 'ראיית לילה', value: 'IR עד 50 מטר' },
      { label: 'זווית ראייה', value: '110°' },
      { label: 'זיהוי תנועה', value: 'חכם + אזורי עניין' },
      { label: 'WDR', value: '120dB' },
      { label: 'חיבור', value: 'WiFi + Ethernet' },
      { label: 'אחסון', value: 'MicroSD עד 256GB' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 8
  },
  {
    id: 'ip-camera-8mp',
    name: 'IP Camera 8 MP (4K)',
    description: 'חדות גבוהה מאוד + WDR',
    priceRange: '₪650 – ₪900',
    minPrice: 650,
    maxPrice: 900,
    category: 'cameras',
    features: [
      'רזולוציה 8MP 4K (3840×2160)',
      'טכנולוגיית WDR מתקדמת',
      'אנליטיקה חכמה',
      'ראיית לילה IR עד 80 מטר',
      'זווית ראייה 120°',
      'הקלטה ברזולוציה מלאה'
    ],
    specifications: [
      { label: 'רזולוציה', value: '8MP 4K (3840×2160)' },
      { label: 'חיישן', value: '1/2.5" CMOS' },
      { label: 'ראיית לילה', value: 'IR עד 80 מטר' },
      { label: 'זווית ראייה', value: '120°' },
      { label: 'WDR', value: '140dB' },
      { label: 'אנליטיקה', value: 'זיהוי פנים, רכבים, חפצים' },
      { label: 'חיבור', value: 'WiFi + Ethernet + PoE+' },
      { label: 'אחסון', value: 'MicroSD עד 512GB' }
    ],
    image: '/api/placeholder/300/200',
    new: true,
    inStock: true,
    stockCount: 5
  },
  {
    id: 'dome-camera-mini',
    name: 'Dome Camera Mini',
    description: 'קומפקטית – למשרדים, מסדרונות',
    priceRange: '₪290 – ₪420',
    minPrice: 290,
    maxPrice: 420,
    category: 'cameras',
    features: [
      'עיצוב קומפקטי וחסכוני',
      'התקנה קלה בתקרה',
      'ראיית לילה IR עד 20 מטר',
      'זווית ראייה 360°',
      'עיצוב דיסקרטי',
      'מתאים למשרדים ומסדרונות'
    ],
    specifications: [
      { label: 'רזולוציה', value: '2MP (1920×1080)' },
      { label: 'חיישן', value: '1/2.7" CMOS' },
      { label: 'ראיית לילה', value: 'IR עד 20 מטר' },
      { label: 'זווית ראייה', value: '360°' },
      { label: 'עיצוב', value: 'Dome קומפקטי' },
      { label: 'התקנה', value: 'תקרה/קיר' },
      { label: 'חיבור', value: 'WiFi + Ethernet' },
      { label: 'מתח', value: '12V DC' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 12
  },
  {
    id: 'bullet-camera-outdoor',
    name: 'Bullet Camera Outdoor',
    description: 'עמידה למים IP67 + IR 50 m',
    priceRange: '₪400 – ₪650',
    minPrice: 400,
    maxPrice: 650,
    category: 'cameras',
    features: [
      'עמידות למים IP67',
      'ראיית לילה IR עד 50 מטר',
      'עיצוב Bullet חזק',
      'התקנה חיצונית',
      'עמידות לטמפרטורות קיצוניות',
      'הגנה מפני ונדליזם'
    ],
    specifications: [
      { label: 'רזולוציה', value: '4MP (2560×1440)' },
      { label: 'חיישן', value: '1/2.8" CMOS' },
      { label: 'ראיית לילה', value: 'IR עד 50 מטר' },
      { label: 'עמידות', value: 'IP67' },
      { label: 'טמפרטורה', value: '-30°C עד +60°C' },
      { label: 'עיצוב', value: 'Bullet חיצוני' },
      { label: 'חיבור', value: 'Ethernet + PoE' },
      { label: 'הגנה', value: 'אנטי-ונדליזם' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 7
  },
  {
    id: 'ptz-camera-20x',
    name: 'PTZ Camera 20× Zoom',
    description: 'סיבוב 360°, Auto-Tracking',
    priceRange: '₪1,200 – ₪3,000',
    minPrice: 1200,
    maxPrice: 3000,
    category: 'cameras',
    features: [
      'זום אופטי 20×',
      'סיבוב 360° אופקי',
      'Auto-Tracking חכם',
      'רזולוציה 4K',
      'שליטה מרחוק',
      'אנליטיקה מתקדמת'
    ],
    specifications: [
      { label: 'רזולוציה', value: '4MP 4K' },
      { label: 'זום', value: '20× אופטי + 4× דיגיטלי' },
      { label: 'סיבוב', value: '360° אופקי, 90° אנכי' },
      { label: 'מהירות', value: '240°/שנייה' },
      { label: 'Auto-Tracking', value: 'חכם + זיהוי פנים' },
      { label: 'חיבור', value: 'Ethernet + PoE+' },
      { label: 'עמידות', value: 'IP66' },
      { label: 'התקנה', value: 'קיר/עמוד' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 3
  },
  {
    id: 'wifi-camera-cloud',
    name: 'Wi-Fi Camera Cloud',
    description: 'מצלמה אלחוטית עם אפליקציה',
    priceRange: '₪299 – ₪499',
    minPrice: 299,
    maxPrice: 499,
    category: 'cameras',
    features: [
      'חיבור WiFi בלבד',
      'אחסון בענן',
      'אפליקציה מתקדמת',
      'התראות בזמן אמת',
      'שיתוף עם משפחה',
      'התקנה עצמית קלה'
    ],
    specifications: [
      { label: 'רזולוציה', value: '2MP (1920×1080)' },
      { label: 'חיבור', value: 'WiFi בלבד' },
      { label: 'אחסון', value: 'ענן + MicroSD' },
      { label: 'אפליקציה', value: 'iOS + Android' },
      { label: 'התראות', value: 'Push + Email' },
      { label: 'שיתוף', value: 'עד 5 משתמשים' },
      { label: 'התקנה', value: 'עצמית' },
      { label: 'מתח', value: 'USB 5V' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 20
  },
  {
    id: 'thermal-camera',
    name: 'Thermal Camera',
    description: 'חיישן IR לזיהוי חום / אש',
    priceRange: '₪1,900 – ₪4,500',
    minPrice: 1900,
    maxPrice: 4500,
    category: 'cameras',
    features: [
      'חיישן תרמי מתקדם',
      'זיהוי חום ואש',
      'רזולוציה תרמית גבוהה',
      'זיהוי טמפרטורות',
      'אזעקות חום',
      'שימוש תעשייתי'
    ],
    specifications: [
      { label: 'רזולוציה תרמית', value: '320×240 / 640×480' },
      { label: 'חיישן', value: 'Uncooled VOx Microbolometer' },
      { label: 'טמפרטורה', value: '-20°C עד +550°C' },
      { label: 'זיהוי', value: 'אש, חום, אנשים' },
      { label: 'זווית ראייה', value: '25° / 45°' },
      { label: 'חיבור', value: 'Ethernet + PoE' },
      { label: 'עמידות', value: 'IP67' },
      { label: 'שימוש', value: 'תעשייתי + מסחרי' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 2
  },
  // Camera Packages
  {
    id: 'camera-kit-2',
    name: 'Camera Kit (2/4/8)',
    description: 'סטים מלאים כולל NVR ודיסק',
    priceRange: '₪1,990 – ₪5,990',
    minPrice: 1990,
    maxPrice: 5990,
    category: 'packages',
    features: [
      'מערכת מלאה מוכנה לשימוש',
      'NVR מקצועי',
      'דיסק קשיח מובנה',
      'כל החיווטים והאביזרים',
      'התקנה מקצועית',
      'אחריות מלאה'
    ],
    specifications: [
      { label: 'מצלמות', value: '2/4/8 מצלמות IP' },
      { label: 'NVR', value: '4/8/16 ערוצים' },
      { label: 'דיסק', value: '1TB/2TB/4TB' },
      { label: 'רזולוציה', value: '4MP לכל מצלמה' },
      { label: 'אחסון', value: 'עד 30 יום הקלטה' },
      { label: 'חיבור', value: 'WiFi + Ethernet' },
      { label: 'התקנה', value: 'מקצועית כלולה' },
      { label: 'אחריות', value: '12 חודשים' }
    ],
    image: '/api/placeholder/300/200',
    popular: true,
    inStock: true,
    stockCount: 6
  },
  {
    id: 'home-cam-package',
    name: 'Home Cam Package',
    description: 'חבילה בסיסית לבית - 2 מצלמות + NVR + אפליקציה',
    priceRange: '₪1,990',
    minPrice: 1990,
    maxPrice: 1990,
    category: 'packages',
    features: [
      '2× מצלמות IP 4MP (חוץ/פנים)',
      'NVR 4ch + 1TB',
      'חיווט וקונפיגורציה',
      'אפליקציה בעברית',
      'אחריות 12 חודשים'
    ],
    specifications: [
      { label: 'מספר מצלמות', value: '2 מצלמות IP' },
      { label: 'רזולוציה', value: '4MP לכל מצלמה' },
      { label: 'NVR', value: '4 ערוצים' },
      { label: 'אחסון', value: '1TB' },
      { label: 'התקנה', value: 'מקצועית כלולה' },
      { label: 'אפליקציה', value: 'בעברית' },
      { label: 'אחריות', value: '12 חודשים' },
      { label: 'מחיר', value: '₪1,990' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 10
  },
  {
    id: 'business-cam-package',
    name: 'Business Cam Package',
    description: 'חבילה מתקדמת לעסק - 4 מצלמות + NVR + הדרכה',
    priceRange: '₪3,490',
    minPrice: 3490,
    maxPrice: 3490,
    category: 'packages',
    features: [
      '4× מצלמות IP 4MP',
      'NVR 8ch + 2TB',
      'גישה מרחוק',
      'ביקור תחזוקה אחרי 60 יום',
      'אחריות 12 חודשים',
      'שדרוג ל-4K: +600-1,000 ₪'
    ],
    specifications: [
      { label: 'מספר מצלמות', value: '4 מצלמות IP' },
      { label: 'רזולוציה', value: '4MP לכל מצלמה' },
      { label: 'NVR', value: '8 ערוצים' },
      { label: 'אחסון', value: '2TB' },
      { label: 'גישה מרחוק', value: 'כן' },
      { label: 'תחזוקה', value: 'ביקור אחרי 60 יום' },
      { label: 'אחריות', value: '12 חודשים' },
      { label: 'מחיר', value: '₪3,490' }
    ],
    image: '/api/placeholder/300/200',
    popular: true,
    inStock: true,
    stockCount: 8
  },
  // Accessories - NVR/DVR
  {
    id: 'nvr-4ch-poe',
    name: 'NVR 4ch PoE',
    description: 'עד 4 מצלמות IP',
    priceRange: '₪599 – ₪799',
    minPrice: 599,
    maxPrice: 799,
    category: 'accessories',
    features: [
      '4 ערוצי PoE',
      'תמיכה ב-4K',
      'אפליקציה לנייד',
      'אחסון עד 6TB',
      'הקלטה רציפה 24/7'
    ],
    specifications: [
      { label: 'ערוצים', value: '4 ערוצי PoE' },
      { label: 'רזולוציה', value: 'עד 4K' },
      { label: 'אחסון', value: 'עד 6TB' },
      { label: 'חיבור', value: 'Ethernet + WiFi' },
      { label: 'אפליקציה', value: 'iOS + Android' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 12
  },
  {
    id: 'nvr-8ch-poe',
    name: 'NVR 8ch PoE',
    description: 'עד 8 מצלמות IP',
    priceRange: '₪899 – ₪1,190',
    minPrice: 899,
    maxPrice: 1190,
    category: 'accessories',
    features: [
      '8 ערוצי PoE',
      'תמיכה ב-4K',
      'אפליקציה לנייד',
      'אחסון עד 12TB',
      'הקלטה רציפה 24/7'
    ],
    specifications: [
      { label: 'ערוצים', value: '8 ערוצי PoE' },
      { label: 'רזולוציה', value: 'עד 4K' },
      { label: 'אחסון', value: 'עד 12TB' },
      { label: 'חיבור', value: 'Ethernet + WiFi' },
      { label: 'אפליקציה', value: 'iOS + Android' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 8
  },
  {
    id: 'nvr-16ch-smart-4k',
    name: 'NVR 16ch Smart 4K',
    description: 'AI Analytics + Onvif',
    priceRange: '₪1,400 – ₪1,990',
    minPrice: 1400,
    maxPrice: 1990,
    category: 'accessories',
    features: [
      '16 ערוצי PoE',
      'AI Analytics מתקדם',
      'תמיכה ב-Onvif',
      'אחסון עד 24TB',
      'זיהוי פנים ורכבים'
    ],
    specifications: [
      { label: 'ערוצים', value: '16 ערוצי PoE' },
      { label: 'AI Analytics', value: 'זיהוי פנים, רכבים, חפצים' },
      { label: 'Onvif', value: 'תמיכה מלאה' },
      { label: 'אחסון', value: 'עד 24TB' },
      { label: 'רזולוציה', value: '4K לכל ערוץ' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 5
  },
  // Accessories - Storage
  {
    id: 'hdd-surveillance-1-10tb',
    name: 'HDD 1–10 TB Surveillance',
    description: 'דיסקים Purple/WD Skyhawk',
    priceRange: '₪250 – ₪890',
    minPrice: 250,
    maxPrice: 890,
    category: 'accessories',
    features: [
      'דיסקים ייעודיים לאבטחה',
      'WD Purple / Seagate Skyhawk',
      'עמידות גבוהה',
      'מהירות 7200 RPM',
      'אחריות 3 שנים'
    ],
    specifications: [
      { label: 'קיבולת', value: '1TB - 10TB' },
      { label: 'מהירות', value: '7200 RPM' },
      { label: 'ממשק', value: 'SATA 6Gb/s' },
      { label: 'עמידות', value: '24/7' },
      { label: 'אחריות', value: '3 שנים' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 15
  },
  // Accessories - Access Control
  {
    id: 'rfid-keypad',
    name: 'RFID Keypad',
    description: 'פתיחה בכרטיס/קוד',
    priceRange: '₪299 – ₪499',
    minPrice: 299,
    maxPrice: 499,
    category: 'accessories',
    features: [
      'פתיחה בכרטיס RFID',
      'פתיחה בקוד מספרי',
      'עד 1000 כרטיסים',
      'עד 100 קודים',
      'התקנה קלה'
    ],
    specifications: [
      { label: 'כרטיסים', value: 'עד 1000 כרטיסי RFID' },
      { label: 'קודים', value: 'עד 100 קודים מספריים' },
      { label: 'חיבור', value: '12V DC' },
      { label: 'עמידות', value: 'IP65' },
      { label: 'התקנה', value: 'קיר' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 20
  },
  {
    id: 'fingerprint-keypad',
    name: 'Fingerprint Keypad',
    description: 'סורק טביעת אצבע',
    priceRange: '₪590 – ₪990',
    minPrice: 590,
    maxPrice: 990,
    category: 'accessories',
    features: [
      'זיהוי טביעת אצבע',
      'עד 1000 טביעות',
      'זיהוי מהיר ודיוק גבוה',
      'מסך מגע',
      'התקנה קלה'
    ],
    specifications: [
      { label: 'טביעות', value: 'עד 1000 טביעות אצבע' },
      { label: 'זיהוי', value: 'מהיר ודיוק גבוה' },
      { label: 'מסך', value: 'מגע 2.8 אינץ' },
      { label: 'חיבור', value: '12V DC' },
      { label: 'עמידות', value: 'IP65' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 15
  },
  // Services
  {
    id: 'installation-service',
    name: 'התקנה בשטח',
    description: 'טכנאי מוסמך עד 5 מכשירים',
    priceRange: '₪399 – ₪699',
    minPrice: 399,
    maxPrice: 699,
    category: 'services',
    features: [
      'טכנאי מוסמך',
      'עד 5 מכשירים',
      'התקנה מקצועית',
      'הדרכה מלאה',
      'אחריות התקנה'
    ],
    specifications: [
      { label: 'טכנאי', value: 'מוסמך' },
      { label: 'מכשירים', value: 'עד 5' },
      { label: 'התקנה', value: 'מקצועית' },
      { label: 'הדרכה', value: 'מלאה' },
      { label: 'אחריות', value: 'התקנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 999
  },
  {
    id: 'warranty-extension',
    name: 'הרחבת אחריות שנתית',
    description: 'הארכת שירות ותמיכה',
    priceRange: '₪249',
    minPrice: 249,
    maxPrice: 249,
    category: 'services',
    features: [
      'הארכת אחריות',
      'שירות ותמיכה',
      'תיקונים',
      'החלפות',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'הארכת אחריות' },
      { label: 'שירות', value: 'ותמיכה' },
      { label: 'תיקונים', value: 'כלולים' },
      { label: 'החלפות', value: 'כלולות' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 999
  }
];

export async function GET(request: NextRequest) {
  try {
    // Import packages dynamically
    const { packages: packageData } = await import('@/data/packages');
    
    // Convert packages to products format
    const packageProducts: Product[] = packageData.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      priceRange: pkg.priceRange,
      minPrice: pkg.pricing.base,
      maxPrice: pkg.pricing.base + (pkg.pricing.addons?.reduce((sum, addon) => sum + addon.price, 0) || 0),
      category: 'packages' as const,
      features: pkg.features.map(f => f.name),
      specifications: [
        { label: 'מספר מצלמות', value: `${pkg.specifications.cameras.min}-${pkg.specifications.cameras.max}` },
        { label: 'אחסון', value: pkg.specifications.storage.size },
        { label: 'AI Detection', value: pkg.specifications.aiDetection?.level || 'אין' },
        { label: 'אחריות', value: `${pkg.specifications.warranty.months} חודשים` },
        { label: 'מחיר', value: pkg.priceRange }
      ],
      image: pkg.image || '/api/placeholder/300/200',
      popular: pkg.popular,
      inStock: true,
      stockCount: 10,
    }));

    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const limit = searchParams.get('limit');
    const popular = searchParams.get('popular');
    const newProducts = searchParams.get('new');

    let filteredProducts = [...products, ...packageProducts];

    // Filter by category
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    // Filter by popular
    if (popular === 'true') {
      filteredProducts = filteredProducts.filter(product => product.popular === true);
    }

    // Filter by new
    if (newProducts === 'true') {
      filteredProducts = filteredProducts.filter(product => product.new === true);
    }

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.features.some(feature => feature.toLowerCase().includes(searchLower))
      );
    }

    // Sort products
    if (sort) {
      switch (sort) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.minPrice - b.minPrice);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.maxPrice - a.maxPrice);
          break;
        case 'popular':
          filteredProducts.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
          break;
        case 'new':
          filteredProducts.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
          break;
        default:
          // Default sort by popularity
          filteredProducts.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
      }
    } else {
      // Default sort by popularity
      filteredProducts.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }

    // Apply limit
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum)) {
        filteredProducts = filteredProducts.slice(0, limitNum);
      }
    }

    return NextResponse.json({
      success: true,
      data: filteredProducts,
      total: filteredProducts.length,
      filters: {
        category,
        search,
        sort,
        limit,
        popular,
        new: newProducts
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

