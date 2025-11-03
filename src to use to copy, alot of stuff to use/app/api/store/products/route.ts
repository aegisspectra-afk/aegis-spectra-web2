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
  // NVR/DVR/Storage Products
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
  {
    id: 'dvr-hybrid-8ch',
    name: 'DVR Hybrid 8ch',
    description: 'תומך AHD / CVI / IP',
    priceRange: '₪790 – ₪1,190',
    minPrice: 790,
    maxPrice: 1190,
    category: 'accessories',
    features: [
      '8 ערוצים היברידיים',
      'תמיכה ב-AHD/CVI/IP',
      'אפליקציה לנייד',
      'אחסון עד 8TB',
      'הקלטה רציפה'
    ],
    specifications: [
      { label: 'ערוצים', value: '8 ערוצים היברידיים' },
      { label: 'תמיכה', value: 'AHD/CVI/IP' },
      { label: 'אחסון', value: 'עד 8TB' },
      { label: 'רזולוציה', value: 'עד 4MP' },
      { label: 'חיבור', value: 'BNC + Ethernet' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 6
  },
  {
    id: 'nas-recorder-mini',
    name: 'NAS Recorder Mini',
    description: 'אחסון רשת (SMB/NFS)',
    priceRange: '₪1,800 – ₪3,500',
    minPrice: 1800,
    maxPrice: 3500,
    category: 'accessories',
    features: [
      'אחסון רשת מתקדם',
      'תמיכה ב-SMB/NFS',
      'גישה מרחוק',
      'אחסון עד 40TB',
      'גיבוי אוטומטי'
    ],
    specifications: [
      { label: 'אחסון', value: 'עד 40TB' },
      { label: 'פרוטוקולים', value: 'SMB/NFS/FTP' },
      { label: 'גישה מרחוק', value: 'כן' },
      { label: 'גיבוי', value: 'אוטומטי' },
      { label: 'חיבור', value: 'Gigabit Ethernet' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 3
  },
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
  {
    id: 'ssd-nvme-500gb-2tb',
    name: 'SSD NVMe 500 GB–2 TB',
    description: 'למערכות מהירות',
    priceRange: '₪290 – ₪790',
    minPrice: 290,
    maxPrice: 790,
    category: 'accessories',
    features: [
      'SSD NVMe מהיר',
      'מהירות קריאה/כתיבה גבוהה',
      'עמידות גבוהה',
      'חיסכון בחשמל',
      'אחריות 5 שנים'
    ],
    specifications: [
      { label: 'קיבולת', value: '500GB - 2TB' },
      { label: 'מהירות קריאה', value: 'עד 3500 MB/s' },
      { label: 'מהירות כתיבה', value: 'עד 3000 MB/s' },
      { label: 'ממשק', value: 'NVMe PCIe 3.0' },
      { label: 'אחריות', value: '5 שנים' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 10
  },
  {
    id: 'ups-650-1500va',
    name: 'UPS 650–1500 VA',
    description: 'גיבוי מתח ל־NVR',
    priceRange: '₪390 – ₪990',
    minPrice: 390,
    maxPrice: 990,
    category: 'accessories',
    features: [
      'גיבוי מתח למערכות אבטחה',
      'זמן גיבוי עד 30 דקות',
      'הגנה מפני נחשולי מתח',
      'ניטור USB',
      'אחריות 2 שנים'
    ],
    specifications: [
      { label: 'הספק', value: '650VA - 1500VA' },
      { label: 'זמן גיבוי', value: 'עד 30 דקות' },
      { label: 'הגנה', value: 'נחשולי מתח' },
      { label: 'ניטור', value: 'USB' },
      { label: 'אחריות', value: '2 שנים' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 7
  },
  {
    id: 'rack-mount-6-12u',
    name: 'Rack Mount 6–12 U',
    description: 'ארון תקשורת מוגן',
    priceRange: '₪690 – ₪1,490',
    minPrice: 690,
    maxPrice: 1490,
    category: 'accessories',
    features: [
      'ארון תקשורת מקצועי',
      '6U - 12U',
      'מאווררים מובנים',
      'מנעול אבטחה',
      'התקנה קלה'
    ],
    specifications: [
      { label: 'גודל', value: '6U - 12U' },
      { label: 'מאווררים', value: 'מובנים' },
      { label: 'מנעול', value: 'אבטחה' },
      { label: 'חומר', value: 'פלדה' },
      { label: 'התקנה', value: 'קיר/רצפה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 4
  },
  // Access Control & Entry Products
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
  {
    id: 'face-recognition-terminal',
    name: 'Face Recognition Terminal',
    description: 'פתיחה בזיהוי פנים',
    priceRange: '₪1,900 – ₪3,500',
    minPrice: 1900,
    maxPrice: 3500,
    category: 'accessories',
    features: [
      'זיהוי פנים מתקדם',
      'עד 10,000 פנים',
      'זיהוי מהיר',
      'מסך מגע גדול',
      'תמיכה ב-RFID'
    ],
    specifications: [
      { label: 'פנים', value: 'עד 10,000 פנים' },
      { label: 'זיהוי', value: 'מהיר ודיוק גבוה' },
      { label: 'מסך', value: 'מגע 7 אינץ' },
      { label: 'RFID', value: 'תמיכה מלאה' },
      { label: 'חיבור', value: '12V DC + Ethernet' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 8
  },
  {
    id: 'magnetic-lock-280kg',
    name: 'Magnetic Lock 280 kg',
    description: 'לדלתות סטנדרטיות',
    priceRange: '₪250 – ₪390',
    minPrice: 250,
    maxPrice: 390,
    category: 'accessories',
    features: [
      'כוח אחיזה 280 קילוגרם',
      'עמידות גבוהה',
      'התקנה קלה',
      'עבודה שקטה',
      'אחריות 2 שנים'
    ],
    specifications: [
      { label: 'כוח אחיזה', value: '280 קילוגרם' },
      { label: 'מתח', value: '12V DC' },
      { label: 'זרם', value: '0.5A' },
      { label: 'עמידות', value: 'IP54' },
      { label: 'התקנה', value: 'דלת סטנדרטית' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 25
  },
  {
    id: 'magnetic-lock-500kg',
    name: 'Magnetic Lock 500 kg',
    description: 'לדלתות כבדות',
    priceRange: '₪450 – ₪650',
    minPrice: 450,
    maxPrice: 650,
    category: 'accessories',
    features: [
      'כוח אחיזה 500 קילוגרם',
      'עמידות גבוהה מאוד',
      'התקנה מקצועית',
      'עבודה שקטה',
      'אחריות 3 שנים'
    ],
    specifications: [
      { label: 'כוח אחיזה', value: '500 קילוגרם' },
      { label: 'מתח', value: '12V DC' },
      { label: 'זרם', value: '0.8A' },
      { label: 'עמידות', value: 'IP65' },
      { label: 'התקנה', value: 'דלת כבדה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 12
  },
  {
    id: 'electric-strike-lock',
    name: 'Electric Strike Lock',
    description: 'מנעול חשמלי',
    priceRange: '₪250 – ₪350',
    minPrice: 250,
    maxPrice: 350,
    category: 'accessories',
    features: [
      'מנעול חשמלי מתקדם',
      'התקנה קלה',
      'עבודה שקטה',
      'עמידות גבוהה',
      'אחריות 2 שנים'
    ],
    specifications: [
      { label: 'מתח', value: '12V DC' },
      { label: 'זרם', value: '0.3A' },
      { label: 'עמידות', value: 'IP54' },
      { label: 'התקנה', value: 'מסגרת דלת' },
      { label: 'חומר', value: 'פלדה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 18
  },
  {
    id: 'exit-button-metal',
    name: 'Exit Button Metal',
    description: 'לחצן יציאה חזק',
    priceRange: '₪59 – ₪99',
    minPrice: 59,
    maxPrice: 99,
    category: 'accessories',
    features: [
      'לחצן יציאה מתכתי',
      'עמידות גבוהה',
      'התקנה קלה',
      'עבודה אמינה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'חומר', value: 'מתכת' },
      { label: 'עמידות', value: 'IP65' },
      { label: 'התקנה', value: 'קיר' },
      { label: 'חיבור', value: '2 חוטים' },
      { label: 'צבע', value: 'כסף/זהב' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 50
  },
  {
    id: 'door-closer-hydraulic',
    name: 'Door Closer Hydraulic',
    description: 'סגירה אוטומטית',
    priceRange: '₪189 – ₪290',
    minPrice: 189,
    maxPrice: 290,
    category: 'accessories',
    features: [
      'סגירה אוטומטית הידראולית',
      'מהירות סגירה ניתנת לכיוון',
      'עמידות גבוהה',
      'התקנה מקצועית',
      'אחריות 2 שנים'
    ],
    specifications: [
      { label: 'סוג', value: 'הידראולי' },
      { label: 'מהירות', value: 'ניתנת לכיוון' },
      { label: 'עמידות', value: 'IP54' },
      { label: 'התקנה', value: 'דלת' },
      { label: 'חומר', value: 'פלדה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 30
  },
  {
    id: 'power-supply-12v-3-5a',
    name: 'Power Supply 12 V 3–5 A',
    description: 'ספק כוח לקודנים',
    priceRange: '₪89 – ₪179',
    minPrice: 89,
    maxPrice: 179,
    category: 'accessories',
    features: [
      'ספק כוח 12V מתקדם',
      '3A - 5A',
      'הגנה מפני נחשולי מתח',
      'התקנה קלה',
      'אחריות 2 שנים'
    ],
    specifications: [
      { label: 'מתח פלט', value: '12V DC' },
      { label: 'זרם', value: '3A - 5A' },
      { label: 'הגנה', value: 'נחשולי מתח' },
      { label: 'התקנה', value: 'קיר' },
      { label: 'חיבור', value: '220V AC' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 40
  },
  {
    id: 'full-access-kit',
    name: 'Full Access Kit',
    description: 'קודן + מנעול + כפתור + ספק',
    priceRange: '₪1,890 – ₪2,390',
    minPrice: 1890,
    maxPrice: 2390,
    category: 'packages',
    features: [
      'ערכת גישה מלאה',
      'קודן RFID + מנעול מגנטי',
      'לחצן יציאה + ספק כוח',
      'התקנה מקצועית',
      'אחריות 2 שנים'
    ],
    specifications: [
      { label: 'קודן', value: 'RFID + קוד מספרי' },
      { label: 'מנעול', value: 'מגנטי 280kg' },
      { label: 'לחצן', value: 'יציאה מתכתי' },
      { label: 'ספק', value: '12V 3A' },
      { label: 'התקנה', value: 'מקצועית כלולה' }
    ],
    image: '/api/placeholder/300/200',
    popular: true,
    inStock: true,
    stockCount: 10
  },
  // Alarm Systems & Sensors Products
  {
    id: 'wireless-alarm-kit',
    name: 'Wireless Alarm Kit',
    description: 'אזעקה + 2 חיישנים + שלטים',
    priceRange: '₪990 – ₪1,490',
    minPrice: 990,
    maxPrice: 1490,
    category: 'packages',
    features: [
      'מערכת אזעקה אלחוטית',
      '2 חיישני תנועה',
      '2 שלטי הפעלה',
      'סירנה פנימית וחיצונית',
      'אפליקציה לנייד'
    ],
    specifications: [
      { label: 'חיישנים', value: '2 חיישני תנועה' },
      { label: 'שלטים', value: '2 שלטי הפעלה' },
      { label: 'סירנה', value: 'פנימית + חיצונית' },
      { label: 'אפליקציה', value: 'iOS + Android' },
      { label: 'התקנה', value: 'אלחוטית' }
    ],
    image: '/api/placeholder/300/200',
    popular: true,
    inStock: true,
    stockCount: 12
  },
  {
    id: 'smart-alarm-ajax',
    name: 'Smart Alarm (Ajax Style)',
    description: 'ניהול מהנייד + חיישני חלון',
    priceRange: '₪1,790 – ₪2,490',
    minPrice: 1790,
    maxPrice: 2490,
    category: 'packages',
    features: [
      'מערכת אזעקה חכמה',
      'ניהול דרך אפליקציה',
      'חיישני חלון/דלת',
      'התראות מיידיות',
      'גיבוי סוללה'
    ],
    specifications: [
      { label: 'ניהול', value: 'אפליקציה חכמה' },
      { label: 'חיישנים', value: 'חלון/דלת/תנועה' },
      { label: 'התראות', value: 'מיידיות לנייד' },
      { label: 'גיבוי', value: 'סוללה' },
      { label: 'קישוריות', value: 'WiFi + GSM' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 8
  },
  {
    id: 'pir-motion-sensor',
    name: 'PIR Motion Sensor',
    description: 'חיישן תנועה אלחוטי',
    priceRange: '₪190 – ₪290',
    minPrice: 190,
    maxPrice: 290,
    category: 'accessories',
    features: [
      'חיישן תנועה פסיבי אינפרא אדום',
      'אלחוטי',
      'טווח גילוי רחב',
      'התקנה קלה',
      'עמידות גבוהה'
    ],
    specifications: [
      { label: 'סוג', value: 'PIR (Passive Infrared)' },
      { label: 'קישוריות', value: 'אלחוטי' },
      { label: 'טווח', value: 'עד 12 מטר' },
      { label: 'זווית', value: '110 מעלות' },
      { label: 'עמידות', value: 'IP65' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 25
  },
  {
    id: 'dual-tech-sensor',
    name: 'Dual Tech Sensor',
    description: 'מיקרוגל + IR נגד אזעקות שווא',
    priceRange: '₪290 – ₪420',
    minPrice: 290,
    maxPrice: 420,
    category: 'accessories',
    features: [
      'שילוב מיקרוגל ו-IR',
      'מניעת אזעקות שווא',
      'אמינות גבוהה',
      'התקנה מקצועית',
      'עמידות גבוהה'
    ],
    specifications: [
      { label: 'טכנולוגיה', value: 'Dual Tech (MW + PIR)' },
      { label: 'אמינות', value: '95%+ נגד אזעקות שווא' },
      { label: 'טווח', value: 'עד 15 מטר' },
      { label: 'זווית', value: '90 מעלות' },
      { label: 'עמידות', value: 'IP65' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 18
  },
  {
    id: 'door-window-sensor',
    name: 'Door/Window Sensor',
    description: 'חיישן פתיחה',
    priceRange: '₪99 – ₪149',
    minPrice: 99,
    maxPrice: 149,
    category: 'accessories',
    features: [
      'חיישן מגנטי לדלתות וחלונות',
      'אלחוטי',
      'התקנה קלה',
      'עמידות גבוהה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'מגנטי' },
      { label: 'קישוריות', value: 'אלחוטי' },
      { label: 'התקנה', value: 'דלת/חלון' },
      { label: 'עמידות', value: 'IP54' },
      { label: 'מרחק', value: 'עד 2 ס"מ' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 40
  },
  {
    id: 'smoke-detector',
    name: 'Smoke Detector',
    description: 'גלאי עשן אלחוטי',
    priceRange: '₪149 – ₪249',
    minPrice: 149,
    maxPrice: 249,
    category: 'accessories',
    features: [
      'גילוי עשן מוקדם',
      'אלחוטי',
      'התראה קולית',
      'התקנה קלה',
      'אחריות 2 שנים'
    ],
    specifications: [
      { label: 'סוג', value: 'גלאי עשן' },
      { label: 'קישוריות', value: 'אלחוטי' },
      { label: 'התראה', value: 'קולית + אור' },
      { label: 'עמידות', value: 'IP54' },
      { label: 'התקנה', value: 'תקרה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 30
  },
  {
    id: 'gas-detector',
    name: 'Gas Detector',
    description: 'חיישן דליפת גז',
    priceRange: '₪199 – ₪299',
    minPrice: 199,
    maxPrice: 299,
    category: 'accessories',
    features: [
      'גילוי דליפות גז',
      'התראה קולית',
      'בטיחות מוגברת',
      'אלחוטי',
      'אחריות 2 שנים'
    ],
    specifications: [
      { label: 'סוג', value: 'גלאי גז' },
      { label: 'קישוריות', value: 'אלחוטי' },
      { label: 'התראה', value: 'קולית + אור' },
      { label: 'עמידות', value: 'IP54' },
      { label: 'התקנה', value: 'קיר' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 20
  },
  {
    id: 'siren-indoor-outdoor',
    name: 'Siren Indoor/Outdoor',
    description: 'סירנה פנימית/חיצונית',
    priceRange: '₪149 – ₪390',
    minPrice: 149,
    maxPrice: 390,
    category: 'accessories',
    features: [
      'סירנה חזקה',
      'מתאימה לפנים וחוץ',
      'התקנה קלה',
      'עמידות גבוהה',
      'אחריות 2 שנים'
    ],
    specifications: [
      { label: 'סוג', value: 'סירנה' },
      { label: 'שימוש', value: 'פנים/חוץ' },
      { label: 'עוצמה', value: 'עד 120dB' },
      { label: 'עמידות', value: 'IP65' },
      { label: 'התקנה', value: 'קיר' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 22
  },
  {
    id: 'panic-button',
    name: 'Panic Button',
    description: 'לחצן חירום',
    priceRange: '₪89 – ₪149',
    minPrice: 89,
    maxPrice: 149,
    category: 'accessories',
    features: [
      'לחצן מצוקה',
      'אלחוטי',
      'התראה מיידית',
      'התקנה קלה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'לחצן חירום' },
      { label: 'קישוריות', value: 'אלחוטי' },
      { label: 'התראה', value: 'מיידית' },
      { label: 'עמידות', value: 'IP54' },
      { label: 'התקנה', value: 'קיר/שולחן' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 35
  },
  {
    id: 'battery-backup-pack',
    name: 'Battery Backup Pack',
    description: 'סוללה למערכת אזעקה',
    priceRange: '₪119 – ₪179',
    minPrice: 119,
    maxPrice: 179,
    category: 'accessories',
    features: [
      'סוללת גיבוי',
      'למערכות אזעקה',
      'אמינות גבוהה',
      'התקנה קלה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'סוללת גיבוי' },
      { label: 'שימוש', value: 'מערכות אזעקה' },
      { label: 'קיבולת', value: '7Ah' },
      { label: 'מתח', value: '12V' },
      { label: 'עמידות', value: 'גבוהה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 28
  },
  // Networking & Power Accessories Products
  {
    id: 'ethernet-cable-cat6',
    name: 'Ethernet Cable Cat6 (25–100 m)',
    description: 'כבל תקשורת',
    priceRange: '₪99 – ₪299',
    minPrice: 99,
    maxPrice: 299,
    category: 'accessories',
    features: [
      'כבל רשת Cat6',
      'מהירות גבוהה',
      'אורכים שונים',
      'איכות גבוהה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'Cat6' },
      { label: 'אורך', value: '25-100 מטר' },
      { label: 'מהירות', value: 'עד 1Gbps' },
      { label: 'תדירות', value: 'עד 250MHz' },
      { label: 'צבע', value: 'כחול/אפור' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 50
  },
  {
    id: 'power-cable-2x075',
    name: 'Power Cable 2×0.75 (50 m)',
    description: 'כבל מתח',
    priceRange: '₪89 – ₪149',
    minPrice: 89,
    maxPrice: 149,
    category: 'accessories',
    features: [
      'כבל חשמל 2 גידים',
      'חתך 0.75 ממ"ר',
      'אורך 50 מטר',
      'איכות גבוהה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'כבל מתח' },
      { label: 'גידים', value: '2 גידים' },
      { label: 'חתך', value: '0.75 ממ"ר' },
      { label: 'אורך', value: '50 מטר' },
      { label: 'צבע', value: 'שחור/אדום' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 40
  },
  {
    id: 'rj45-connectors-x100',
    name: 'RJ45 Connectors ×100',
    description: 'מחברים לכבלי רשת',
    priceRange: '₪59 – ₪89',
    minPrice: 59,
    maxPrice: 89,
    category: 'accessories',
    features: [
      '100 יחידות',
      'מחברי RJ45',
      'להכנת כבלי רשת',
      'איכות גבוהה',
      'התקנה קלה'
    ],
    specifications: [
      { label: 'כמות', value: '100 יחידות' },
      { label: 'סוג', value: 'RJ45' },
      { label: 'חומר', value: 'פלסטיק' },
      { label: 'צבע', value: 'שקוף' },
      { label: 'שימוש', value: 'כבלי רשת' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 25
  },
  {
    id: 'poe-switch',
    name: 'PoE Switch 4/8/16 Ports',
    description: 'ניהול PoE',
    priceRange: '₪299 – ₪899',
    minPrice: 299,
    maxPrice: 899,
    category: 'accessories',
    features: [
      'סוויץ\' עם תמיכה ב-PoE',
      '4, 8 או 16 פורטים',
      'הזנת חשמל למצלמות',
      'ניהול מתקדם',
      'אחריות 2 שנים'
    ],
    specifications: [
      { label: 'פורטים', value: '4/8/16 PoE' },
      { label: 'מהירות', value: 'Gigabit' },
      { label: 'הספק', value: 'עד 15W לפורט' },
      { label: 'חיבור', value: 'Ethernet' },
      { label: 'ניהול', value: 'Web Interface' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 15
  },
  {
    id: 'poe-injector',
    name: 'PoE Injector',
    description: 'הזנת PoE למצלמה בודדת',
    priceRange: '₪89 – ₪129',
    minPrice: 89,
    maxPrice: 129,
    category: 'accessories',
    features: [
      'הזנת PoE למצלמה בודדת',
      'התקנה קלה',
      'עמידות גבוהה',
      'אחריות שנה',
      'מחיר נוח'
    ],
    specifications: [
      { label: 'הספק', value: '15W' },
      { label: 'מתח', value: '48V DC' },
      { label: 'חיבור', value: 'Ethernet' },
      { label: 'עמידות', value: 'IP30' },
      { label: 'התקנה', value: 'קיר' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 30
  },
  {
    id: 'splitter-poe',
    name: 'Splitter PoE',
    description: 'פיצול נתונים/חשמל',
    priceRange: '₪69 – ₪119',
    minPrice: 69,
    maxPrice: 119,
    category: 'accessories',
    features: [
      'פיצול נתונים וחשמל',
      'התקנה קלה',
      'עמידות גבוהה',
      'אחריות שנה',
      'מחיר נוח'
    ],
    specifications: [
      { label: 'פונקציה', value: 'פיצול PoE' },
      { label: 'מתח', value: '12V DC' },
      { label: 'חיבור', value: 'RJ45' },
      { label: 'עמידות', value: 'IP30' },
      { label: 'התקנה', value: 'קיר' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 35
  },
  {
    id: 'dc-power-adapters',
    name: 'DC Power Adapters',
    description: 'מחברים זכר/נקבה',
    priceRange: '₪29 – ₪59',
    minPrice: 29,
    maxPrice: 59,
    category: 'accessories',
    features: [
      'מחברים זכר/נקבה',
      'מתח 12V',
      'זרמים שונים',
      'איכות גבוהה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'מתח', value: '12V DC' },
      { label: 'זרם', value: '1A - 3A' },
      { label: 'חיבור', value: 'זכר/נקבה' },
      { label: 'עמידות', value: 'IP30' },
      { label: 'התקנה', value: 'קיר' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 60
  },
  {
    id: 'junction-box',
    name: 'Junction Box',
    description: 'קופסת חיבור אטומה',
    priceRange: '₪39 – ₪69',
    minPrice: 39,
    maxPrice: 69,
    category: 'accessories',
    features: [
      'קופסת חיבור אטומה',
      'עמידות למים',
      'התקנה קלה',
      'גדלים שונים',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'עמידות', value: 'IP65' },
      { label: 'גדלים', value: 'קטן/בינוני/גדול' },
      { label: 'חומר', value: 'פלסטיק' },
      { label: 'צבע', value: 'לבן/אפור' },
      { label: 'התקנה', value: 'קיר' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 45
  },
  {
    id: 'wall-mount-brackets',
    name: 'Wall Mount Brackets',
    description: 'זרועות והתקנות',
    priceRange: '₪59 – ₪149',
    minPrice: 59,
    maxPrice: 149,
    category: 'accessories',
    features: [
      'זרועות התקנה למצלמות',
      'גדלים שונים',
      'עמידות גבוהה',
      'התקנה קלה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'זרועות התקנה' },
      { label: 'גדלים', value: 'קטן/בינוני/גדול' },
      { label: 'חומר', value: 'פלדה' },
      { label: 'צבע', value: 'לבן/אפור' },
      { label: 'התקנה', value: 'קיר' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 30
  },
  {
    id: 'cable-management-tray',
    name: 'Cable Management Tray',
    description: 'ניהול כבלים',
    priceRange: '₪99 – ₪249',
    minPrice: 99,
    maxPrice: 249,
    category: 'accessories',
    features: [
      'ניהול כבלים מקצועי',
      'גדלים שונים',
      'עמידות גבוהה',
      'התקנה קלה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'מגש ניהול כבלים' },
      { label: 'גדלים', value: '1U - 4U' },
      { label: 'חומר', value: 'פלדה' },
      { label: 'צבע', value: 'אפור' },
      { label: 'התקנה', value: 'Rack' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 20
  },
  {
    id: 'surge-protector',
    name: 'Surge Protector',
    description: 'מגן ברקים למצלמות',
    priceRange: '₪99 – ₪149',
    minPrice: 99,
    maxPrice: 149,
    category: 'accessories',
    features: [
      'הגנה מפני נחשולי מתח',
      'מגן ברקים',
      'עמידות גבוהה',
      'התקנה קלה',
      'אחריות 2 שנים'
    ],
    specifications: [
      { label: 'הגנה', value: 'נחשולי מתח' },
      { label: 'מתח', value: '220V AC' },
      { label: 'פורטים', value: '4-8 פורטים' },
      { label: 'עמידות', value: 'IP30' },
      { label: 'התקנה', value: 'קיר' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 25
  },
  // Tools & Installation Equipment Products
  {
    id: 'crimping-tool-rj45',
    name: 'Crimping Tool RJ45',
    description: 'לחיצה לכבלי רשת',
    priceRange: '₪99 – ₪189',
    minPrice: 99,
    maxPrice: 189,
    category: 'accessories',
    features: [
      'כלי לחיצה מקצועי',
      'לכבלי RJ45',
      'איכות גבוהה',
      'עמידות גבוהה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'כלי לחיצה' },
      { label: 'שימוש', value: 'RJ45' },
      { label: 'חומר', value: 'פלדה' },
      { label: 'עמידות', value: 'גבוהה' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 20
  },
  {
    id: 'wire-stripper',
    name: 'Wire Stripper',
    description: 'קליבת קילוף',
    priceRange: '₪49 – ₪99',
    minPrice: 49,
    maxPrice: 99,
    category: 'accessories',
    features: [
      'קליבת קילוף מקצועית',
      'גדלים שונים',
      'איכות גבוהה',
      'עמידות גבוהה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'קליבת קילוף' },
      { label: 'גדלים', value: '0.5-6 ממ"ר' },
      { label: 'חומר', value: 'פלדה' },
      { label: 'עמידות', value: 'גבוהה' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 25
  },
  {
    id: 'cable-tester-rj45-rj11',
    name: 'Cable Tester RJ45/RJ11',
    description: 'בודק כבלים',
    priceRange: '₪89 – ₪159',
    minPrice: 89,
    maxPrice: 159,
    category: 'accessories',
    features: [
      'בודק כבלי רשת',
      'RJ45 ו-RJ11',
      'זיהוי תקלות',
      'מסך דיגיטלי',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'בודק כבלים' },
      { label: 'תמיכה', value: 'RJ45/RJ11' },
      { label: 'מסך', value: 'דיגיטלי' },
      { label: 'זיהוי', value: 'תקלות' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 15
  },
  {
    id: 'poe-tester',
    name: 'PoE Tester',
    description: 'בודק מתח PoE',
    priceRange: '₪149 – ₪299',
    minPrice: 149,
    maxPrice: 299,
    category: 'accessories',
    features: [
      'בודק מתח PoE',
      'זיהוי תקלות',
      'מסך דיגיטלי',
      'איכות גבוהה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'בודק PoE' },
      { label: 'מתח', value: 'עד 48V' },
      { label: 'מסך', value: 'דיגיטלי' },
      { label: 'זיהוי', value: 'תקלות' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 12
  },
  {
    id: 'drill-bits-set',
    name: 'Drill Bits Set',
    description: 'מקדחים לברזל וקיר',
    priceRange: '₪59 – ₪149',
    minPrice: 59,
    maxPrice: 149,
    category: 'accessories',
    features: [
      'סט מקדחים מקצועי',
      'לברזל וקיר',
      'גדלים שונים',
      'איכות גבוהה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'סט מקדחים' },
      { label: 'שימוש', value: 'ברזל/קיר' },
      { label: 'גדלים', value: '3-12 מ"מ' },
      { label: 'חומר', value: 'פלדה' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 18
  },
  {
    id: 'level-laser',
    name: 'Level Laser',
    description: 'פילוס מדויק להתקנה',
    priceRange: '₪199 – ₪390',
    minPrice: 199,
    maxPrice: 390,
    category: 'accessories',
    features: [
      'פילוס מדויק',
      'להתקנת מצלמות',
      'קרן לייזר',
      'דיוק גבוה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'פילוס לייזר' },
      { label: 'דיוק', value: '±1 מ"מ' },
      { label: 'טווח', value: 'עד 50 מטר' },
      { label: 'קרן', value: 'לייזר' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 10
  },
  {
    id: 'screwdriver-kit',
    name: 'Screwdriver Kit (Precision)',
    description: 'סט מברגים',
    priceRange: '₪79 – ₪149',
    minPrice: 79,
    maxPrice: 149,
    category: 'accessories',
    features: [
      'סט מברגים מקצועי',
      'גדלים שונים',
      'איכות גבוהה',
      'עמידות גבוהה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'סט מברגים' },
      { label: 'גדלים', value: '10-20 יחידות' },
      { label: 'חומר', value: 'פלדה' },
      { label: 'עמידות', value: 'גבוהה' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 22
  },
  {
    id: 'label-printer-brother',
    name: 'Label Printer Brother',
    description: 'מדפסת תיוג כבלים',
    priceRange: '₪390 – ₪690',
    minPrice: 390,
    maxPrice: 690,
    category: 'accessories',
    features: [
      'מדפסת תיוג מקצועית',
      'לכבלי רשת',
      'איכות גבוהה',
      'התקנה קלה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'מדפסת תיוג' },
      { label: 'שימוש', value: 'כבלי רשת' },
      { label: 'איכות', value: 'גבוהה' },
      { label: 'התקנה', value: 'קלה' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 8
  },
  {
    id: 'heat-shrink-tubes',
    name: 'Heat Shrink Tubes',
    description: 'בידוד לחיבורים',
    priceRange: '₪29 – ₪79',
    minPrice: 29,
    maxPrice: 79,
    category: 'accessories',
    features: [
      'בידוד לחיבורים',
      'גדלים שונים',
      'איכות גבוהה',
      'התקנה קלה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'בידוד' },
      { label: 'גדלים', value: '2-20 מ"מ' },
      { label: 'חומר', value: 'פלסטיק' },
      { label: 'שימוש', value: 'חיבורים' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 40
  },
  {
    id: 'tool-bag-pro',
    name: 'Tool Bag Pro',
    description: 'תיק ציוד לטכנאים',
    priceRange: '₪199 – ₪399',
    minPrice: 199,
    maxPrice: 399,
    category: 'accessories',
    features: [
      'תיק ציוד מקצועי',
      'לטכנאים',
      'גדלים שונים',
      'עמידות גבוהה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'תיק ציוד' },
      { label: 'שימוש', value: 'טכנאים' },
      { label: 'גדלים', value: 'קטן/בינוני/גדול' },
      { label: 'חומר', value: 'ניילון' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 15
  },
  // Power & Backup Systems Products
  {
    id: 'ups-650-1500va-power',
    name: 'UPS 650–1500 VA',
    description: 'גיבוי חשמל למערכות',
    priceRange: '₪390 – ₪990',
    minPrice: 390,
    maxPrice: 990,
    category: 'accessories',
    features: [
      'גיבוי חשמל למערכות אבטחה',
      'זמן גיבוי עד 30 דקות',
      'הגנה מפני נחשולי מתח',
      'ניטור USB',
      'אחריות 2 שנים'
    ],
    specifications: [
      { label: 'הספק', value: '650VA - 1500VA' },
      { label: 'זמן גיבוי', value: 'עד 30 דקות' },
      { label: 'הגנה', value: 'נחשולי מתח' },
      { label: 'ניטור', value: 'USB' },
      { label: 'אחריות', value: '2 שנים' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 15
  },
  {
    id: 'power-bank-12v',
    name: 'Power Bank 12 V',
    description: 'גיבוי נייד למצלמות',
    priceRange: '₪250 – ₪490',
    minPrice: 250,
    maxPrice: 490,
    category: 'accessories',
    features: [
      'גיבוי נייד למצלמות',
      '12V DC',
      'קיבולת גבוהה',
      'התקנה קלה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'מתח', value: '12V DC' },
      { label: 'קיבולת', value: '20Ah - 50Ah' },
      { label: 'שימוש', value: 'מצלמות' },
      { label: 'התקנה', value: 'קלה' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 20
  },
  {
    id: 'battery-12v-7ah',
    name: 'Battery 12 V 7 Ah',
    description: 'סוללה ל־UPS / אזעקה',
    priceRange: '₪149 – ₪249',
    minPrice: 149,
    maxPrice: 249,
    category: 'accessories',
    features: [
      'סוללה 12V 7Ah',
      'למערכות UPS ואזעקה',
      'עמידות גבוהה',
      'התקנה קלה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'מתח', value: '12V DC' },
      { label: 'קיבולת', value: '7Ah' },
      { label: 'שימוש', value: 'UPS/אזעקה' },
      { label: 'עמידות', value: 'גבוהה' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 30
  },
  {
    id: 'solar-camera-panel',
    name: 'Solar Camera Panel',
    description: 'פאנל סולארי למצלמות',
    priceRange: '₪190 – ₪350',
    minPrice: 190,
    maxPrice: 350,
    category: 'accessories',
    features: [
      'פאנל סולארי למצלמות',
      '20W - 50W',
      'התקנה קלה',
      'עמידות גבוהה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'הספק', value: '20W - 50W' },
      { label: 'מתח', value: '12V DC' },
      { label: 'שימוש', value: 'מצלמות' },
      { label: 'עמידות', value: 'IP65' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 12
  },
  {
    id: 'voltage-converter-24-12v',
    name: 'Voltage Converter 24→12 V',
    description: 'ממיר מתח רכב',
    priceRange: '₪99 – ₪149',
    minPrice: 99,
    maxPrice: 149,
    category: 'accessories',
    features: [
      'ממיר מתח 24V ל-12V',
      'לשימוש ברכב',
      'הספק גבוה',
      'התקנה קלה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'מתח כניסה', value: '24V DC' },
      { label: 'מתח יציאה', value: '12V DC' },
      { label: 'הספק', value: '10A' },
      { label: 'שימוש', value: 'רכב' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 18
  },
  {
    id: 'fuse-box-8ch',
    name: 'Fuse Box 8 Ch',
    description: 'קופסת פיוזים להזנות',
    priceRange: '₪99 – ₪199',
    minPrice: 99,
    maxPrice: 199,
    category: 'accessories',
    features: [
      'קופסת פיוזים 8 ערוצים',
      'הגנה על מערכות',
      'התקנה קלה',
      'עמידות גבוהה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'ערוצים', value: '8' },
      { label: 'הגנה', value: 'פיוזים' },
      { label: 'מתח', value: '12V DC' },
      { label: 'התקנה', value: 'קיר' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 25
  },
  // Accessories & Maintenance Products
  {
    id: 'cleaning-spray-optics',
    name: 'Cleaning Spray Optics',
    description: 'ניקוי עדשות מצלמה',
    priceRange: '₪29 – ₪59',
    minPrice: 29,
    maxPrice: 59,
    category: 'accessories',
    features: [
      'ניקוי עדשות מצלמה',
      'איכות גבוהה',
      'לא משאיר כתמים',
      'בטוח לעדשות',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'ניקוי עדשות' },
      { label: 'שימוש', value: 'מצלמות' },
      { label: 'איכות', value: 'גבוהה' },
      { label: 'בטיחות', value: 'בטוח לעדשות' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 50
  },
  {
    id: 'waterproof-seal-kit',
    name: 'Waterproof Seal Kit',
    description: 'ערכת אטימה',
    priceRange: '₪39 – ₪89',
    minPrice: 39,
    maxPrice: 89,
    category: 'accessories',
    features: [
      'ערכת אטימה למצלמות',
      'גדלים שונים',
      'עמידות גבוהה',
      'התקנה קלה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'ערכת אטימה' },
      { label: 'גדלים', value: 'קטן/בינוני/גדול' },
      { label: 'עמידות', value: 'IP65' },
      { label: 'שימוש', value: 'מצלמות' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 35
  },
  {
    id: 'cable-clips-x100',
    name: 'Cable Clips ×100',
    description: 'מהדקים לכבלים',
    priceRange: '₪19 – ₪39',
    minPrice: 19,
    maxPrice: 39,
    category: 'accessories',
    features: [
      '100 מהדקים לכבלים',
      'גדלים שונים',
      'עמידות גבוהה',
      'התקנה קלה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'כמות', value: '100 יחידות' },
      { label: 'סוג', value: 'מהדקים' },
      { label: 'שימוש', value: 'כבלים' },
      { label: 'עמידות', value: 'גבוהה' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 60
  },
  {
    id: 'zip-ties-x100',
    name: 'Zip Ties ×100',
    description: 'אזיקונים',
    priceRange: '₪15 – ₪29',
    minPrice: 15,
    maxPrice: 29,
    category: 'accessories',
    features: [
      '100 אזיקונים',
      'גדלים שונים',
      'עמידות גבוהה',
      'התקנה קלה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'כמות', value: '100 יחידות' },
      { label: 'סוג', value: 'אזיקונים' },
      { label: 'גדלים', value: '100-300 מ"מ' },
      { label: 'עמידות', value: 'גבוהה' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 80
  },
  {
    id: 'silica-gel-packs',
    name: 'Silica Gel Packs',
    description: 'מונע עיבוי בתיבות',
    priceRange: '₪25 – ₪49',
    minPrice: 25,
    maxPrice: 49,
    category: 'accessories',
    features: [
      'מונע עיבוי בתיבות',
      '10-20 יחידות',
      'עמידות גבוהה',
      'התקנה קלה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'כמות', value: '10-20 יחידות' },
      { label: 'סוג', value: 'סיליקה ג\'ל' },
      { label: 'שימוש', value: 'מונע עיבוי' },
      { label: 'עמידות', value: 'גבוהה' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 40
  },
  {
    id: 'replacement-ir-leds',
    name: 'Replacement IR LEDs',
    description: 'לדים למצלמות ישנות',
    priceRange: '₪59 – ₪99',
    minPrice: 59,
    maxPrice: 99,
    category: 'accessories',
    features: [
      'לדים למצלמות ישנות',
      '850nm/940nm',
      'איכות גבוהה',
      'התקנה מקצועית',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'IR LEDs' },
      { label: 'אורך גל', value: '850nm/940nm' },
      { label: 'שימוש', value: 'מצלמות' },
      { label: 'איכות', value: 'גבוהה' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 25
  },
  {
    id: 'anti-rust-spray',
    name: 'Anti-Rust Spray',
    description: 'הגנה על מחברים',
    priceRange: '₪29 – ₪59',
    minPrice: 29,
    maxPrice: 59,
    category: 'accessories',
    features: [
      'הגנה על מחברים',
      'מניעת חלודה',
      'עמידות גבוהה',
      'התקנה קלה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'ספריי אנטי חלודה' },
      { label: 'שימוש', value: 'מחברים' },
      { label: 'הגנה', value: 'מניעת חלודה' },
      { label: 'עמידות', value: 'גבוהה' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 30
  },
  {
    id: 'spare-screws-anchors',
    name: 'Spare Screws & Anchors',
    description: 'ברגים ודיבלים',
    priceRange: '₪15 – ₪39',
    minPrice: 15,
    maxPrice: 39,
    category: 'accessories',
    features: [
      'ברגים ודיבלים',
      'גדלים שונים',
      'עמידות גבוהה',
      'התקנה קלה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'סוג', value: 'ברגים ודיבלים' },
      { label: 'גדלים', value: '6-12 מ"מ' },
      { label: 'חומר', value: 'פלדה' },
      { label: 'עמידות', value: 'גבוהה' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 45
  },
  {
    id: 'network-label-stickers',
    name: 'Network Label Stickers',
    description: 'תוויות מספרים',
    priceRange: '₪19 – ₪39',
    minPrice: 19,
    maxPrice: 39,
    category: 'accessories',
    features: [
      'תוויות מספרים לכבלים',
      '100-200 יחידות',
      'עמידות גבוהה',
      'התקנה קלה',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'כמות', value: '100-200 יחידות' },
      { label: 'סוג', value: 'תוויות' },
      { label: 'שימוש', value: 'כבלי רשת' },
      { label: 'עמידות', value: 'גבוהה' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 55
  },
  // Smart Home & Integration Products
  {
    id: 'smart-plug-wifi',
    name: 'Smart Plug Wi-Fi',
    description: 'שליטה בחשמל מהנייד',
    priceRange: '₪129 – ₪199',
    minPrice: 129,
    maxPrice: 199,
    category: 'accessories',
    features: [
      'שליטה בחשמל מהנייד',
      'Wi-Fi',
      'אפליקציה לנייד',
      'תזמון אוטומטי',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'קישוריות', value: 'Wi-Fi' },
      { label: 'שליטה', value: 'מהנייד' },
      { label: 'אפליקציה', value: 'iOS + Android' },
      { label: 'תזמון', value: 'אוטומטי' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 30
  },
  {
    id: 'smart-light-bulb',
    name: 'Smart Light Bulb',
    description: 'נורת Wi-Fi מתכווננת',
    priceRange: '₪79 – ₪149',
    minPrice: 79,
    maxPrice: 149,
    category: 'accessories',
    features: [
      'נורת Wi-Fi מתכווננת',
      '16 מיליון צבעים',
      'אפליקציה לנייד',
      'תזמון אוטומטי',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'קישוריות', value: 'Wi-Fi' },
      { label: 'צבעים', value: '16 מיליון' },
      { label: 'אפליקציה', value: 'iOS + Android' },
      { label: 'תזמון', value: 'אוטומטי' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 25
  },
  {
    id: 'smart-relay-module',
    name: 'Smart Relay Module',
    description: 'שליטה על שערים / דלתות',
    priceRange: '₪149 – ₪299',
    minPrice: 149,
    maxPrice: 299,
    category: 'accessories',
    features: [
      'שליטה על שערים ודלתות',
      'Wi-Fi',
      'אפליקציה לנייד',
      'תזמון אוטומטי',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'קישוריות', value: 'Wi-Fi' },
      { label: 'שליטה', value: 'שערים/דלתות' },
      { label: 'אפליקציה', value: 'iOS + Android' },
      { label: 'תזמון', value: 'אוטומטי' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 20
  },
  {
    id: 'gateway-hub-spectra',
    name: 'Gateway Hub Spectra',
    description: 'רכזת שליטה מרחוק',
    priceRange: '₪499 – ₪890',
    minPrice: 499,
    maxPrice: 890,
    category: 'accessories',
    features: [
      'רכזת שליטה מרחוק',
      'Wi-Fi + Ethernet',
      'אפליקציה לנייד',
      'שליטה מרכזית',
      'אחריות שנה'
    ],
    specifications: [
      { label: 'קישוריות', value: 'Wi-Fi + Ethernet' },
      { label: 'שליטה', value: 'מרחוק' },
      { label: 'אפליקציה', value: 'iOS + Android' },
      { label: 'שליטה', value: 'מרכזית' },
      { label: 'אחריות', value: 'שנה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 15
  },
  // Additional Services
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
  },
  {
    id: 'online-support',
    name: 'תמיכה און-ליין (Zoom)',
    description: 'פתרון בעיות מרחוק',
    priceRange: 'תיאום',
    minPrice: 0,
    maxPrice: 0,
    category: 'services',
    features: [
      'תמיכה און-ליין',
      'Zoom',
      'פתרון בעיות',
      'מרחוק',
      'תיאום'
    ],
    specifications: [
      { label: 'סוג', value: 'תמיכה און-ליין' },
      { label: 'פלטפורמה', value: 'Zoom' },
      { label: 'שירות', value: 'פתרון בעיות' },
      { label: 'מיקום', value: 'מרחוק' },
      { label: 'תיאום', value: 'נדרש' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 999
  },
  {
    id: 'new-system-setup',
    name: 'הגדרת מערכת חדשה',
    description: 'קונפיגורציה מלאה',
    priceRange: '₪199',
    minPrice: 199,
    maxPrice: 199,
    category: 'services',
    features: [
      'הגדרת מערכת חדשה',
      'קונפיגורציה מלאה',
      'הדרכה',
      'תמיכה',
      'אחריות'
    ],
    specifications: [
      { label: 'סוג', value: 'הגדרת מערכת' },
      { label: 'קונפיגורציה', value: 'מלאה' },
      { label: 'הדרכה', value: 'כלולה' },
      { label: 'תמיכה', value: 'כלולה' },
      { label: 'אחריות', value: 'כלולה' }
    ],
    image: '/api/placeholder/300/200',
    inStock: true,
    stockCount: 999
  },
  // Existing packages
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
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const limit = searchParams.get('limit');

    let filteredProducts = [...products];

    // Filter by category
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === category);
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
        limit
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
