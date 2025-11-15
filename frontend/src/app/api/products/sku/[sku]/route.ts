import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

// Fallback products - מוצרים סטטיים למקרה שהמסד נתונים לא זמין
const FALLBACK_PRODUCTS: Record<string, any> = {
  'H-01-2TB': {
    id: 1,
    sku: 'H-01-2TB',
    name: 'Home Cam H-01 (2 TB)',
    price_regular: 2590,
    price_sale: 2290,
    currency: 'ILS',
    short_desc: 'מערכת אבטחה חכמה: 2×4MP PoE + NVR 2TB + אפליקציה בעברית.',
    category: 'packages',
    brand: 'Aegis Spectra',
    stock: 10
  },
  'IPC-HDBW2231E-S-S2': {
    id: 2,
    sku: 'IPC-HDBW2231E-S-S2',
    name: 'Dome 2MP Starlight',
    price_regular: 579,
    price_sale: 579,
    currency: 'ILS',
    short_desc: 'מצלמת Dome 2MP Starlight מ-Dahua - ראיית לילה מעולה ואיכות תמונה גבוהה.',
    category: 'cameras',
    brand: 'Dahua',
    stock: 15
  },
  'IPC-HFW2231T-AS-S2': {
    id: 3,
    sku: 'IPC-HFW2231T-AS-S2',
    name: 'Bullet 2MP Starlight',
    price_regular: 599,
    price_sale: 599,
    currency: 'ILS',
    short_desc: 'מצלמת Bullet 2MP Starlight מ-Dahua - עמידה למים IP67, ראיית לילה עד 30 מטר.',
    category: 'cameras',
    brand: 'Dahua',
    stock: 12
  },
  'IPC-HFW2431S-S-S2': {
    id: 4,
    sku: 'IPC-HFW2431S-S-S2',
    name: 'Bullet 4MP',
    price_regular: 599,
    price_sale: 599,
    currency: 'ILS',
    short_desc: 'מצלמת Bullet 4MP מ-Dahua - רזולוציה גבוהה, עמידה למים, התקנה חיצונית.',
    category: 'cameras',
    brand: 'Dahua',
    stock: 10
  },
  'SD49225XA-HNR-S2': {
    id: 5,
    sku: 'SD49225XA-HNR-S2',
    name: 'PTZ 25× 2MP',
    price_regular: 2790,
    price_sale: 2790,
    currency: 'ILS',
    short_desc: 'מצלמת PTZ 25× 2MP מ-Dahua - זום אופטי 25×, סיבוב 360°, Auto-Tracking.',
    category: 'cameras',
    brand: 'Dahua',
    stock: 5
  },
  'C3TN': {
    id: 6,
    sku: 'C3TN',
    name: 'Wi-Fi Outdoor 1080p',
    price_regular: 235,
    price_sale: 235,
    currency: 'ILS',
    short_desc: 'מצלמת Wi-Fi חיצונית 1080p מ-EZVIZ - אלחוטית, עמידה למים, התקנה קלה.',
    category: 'cameras',
    brand: 'EZVIZ',
    stock: 20
  },
  'C6N-4MP': {
    id: 7,
    sku: 'C6N-4MP',
    name: 'Wi-Fi Pan/Tilt 4MP',
    price_regular: 299,
    price_sale: 299,
    currency: 'ILS',
    short_desc: 'מצלמת Wi-Fi Pan/Tilt 4MP מ-EZVIZ - סיבוב 360°, רזולוציה 4MP, שליטה מרחוק.',
    category: 'cameras',
    brand: 'EZVIZ',
    stock: 18
  },
  'TAPO-C210': {
    id: 8,
    sku: 'TAPO-C210',
    name: 'Wi-Fi Pan/Tilt 3MP',
    price_regular: 219,
    price_sale: 219,
    currency: 'ILS',
    short_desc: 'מצלמת Wi-Fi Pan/Tilt 3MP מ-TP-Link - סיבוב 360°, רזולוציה 3MP, אפליקציה חכמה.',
    category: 'cameras',
    brand: 'TP-Link',
    stock: 25
  },
  'BCAM-02': {
    id: 9,
    sku: 'BCAM-02',
    name: 'Battery Cam FHD',
    price_regular: 590,
    price_sale: 590,
    currency: 'ILS',
    short_desc: 'מצלמת Battery FHD מ-Provision-ISR - סוללה מובנית, Wi-Fi, התקנה ללא חיווט.',
    category: 'cameras',
    brand: 'Provision-ISR',
    stock: 8
  },
  'BCAM-05': {
    id: 10,
    sku: 'BCAM-05',
    name: 'Battery Cam 4MP',
    price_regular: 540,
    price_sale: 540,
    currency: 'ILS',
    short_desc: 'מצלמת Battery 4MP מ-Provision-ISR - סוללה מובנית, רזולוציה 4MP, Wi-Fi.',
    category: 'cameras',
    brand: 'Provision-ISR',
    stock: 7
  },
  // NVR / DVR / Storage
  'DS-7604NI-K1-4P': {
    id: 11,
    sku: 'DS-7604NI-K1-4P',
    name: 'NVR 4ch PoE',
    price_regular: 749,
    price_sale: 749,
    currency: 'ILS',
    short_desc: 'NVR 4 ערוצים עם PoE מ-Hikvision - הקלטה 4K, תמיכה ב-PoE, ניהול מרחוק.',
    category: 'nvr',
    brand: 'Hikvision',
    stock: 8
  },
  'NVR2108HS-8P-S2': {
    id: 12,
    sku: 'NVR2108HS-8P-S2',
    name: 'NVR 8ch PoE',
    price_regular: 1090,
    price_sale: 1090,
    currency: 'ILS',
    short_desc: 'NVR 8 ערוצים עם PoE מ-Dahua - הקלטה 4K, 8 פורטי PoE מובנים, ניהול חכם.',
    category: 'nvr',
    brand: 'Dahua',
    stock: 6
  },
  'DS-7616NXI-K2-16P': {
    id: 13,
    sku: 'DS-7616NXI-K2-16P',
    name: 'NVR 16ch Smart 4K',
    price_regular: 1790,
    price_sale: 1790,
    currency: 'ILS',
    short_desc: 'NVR 16 ערוצים Smart 4K מ-Hikvision - Acusense, 16 פורטי PoE, AI חכם.',
    category: 'nvr',
    brand: 'Hikvision',
    stock: 5
  },
  'XVR1B08H-I': {
    id: 14,
    sku: 'XVR1B08H-I',
    name: 'DVR Hybrid 8ch',
    price_regular: 990,
    price_sale: 990,
    currency: 'ILS',
    short_desc: 'DVR Hybrid 8 ערוצים מ-Dahua - תמיכה ב-AHD/TVI/CVI/IP, הקלטה 4K.',
    category: 'dvr',
    brand: 'Dahua',
    stock: 7
  },
  'DS224+': {
    id: 15,
    sku: 'DS224+',
    name: 'NAS Recorder Mini',
    price_regular: 2790,
    price_sale: 2790,
    currency: 'ILS',
    short_desc: 'NAS Recorder Mini מ-Synology - 2 כוננים, הקלטה חכמה, גיבוי ענן.',
    category: 'storage',
    brand: 'Synology',
    stock: 4
  },
  'WD-PURPLE-1TB': {
    id: 16,
    sku: 'WD-PURPLE-1TB',
    name: 'HDD 1 TB',
    price_regular: 590,
    price_sale: 590,
    currency: 'ILS',
    short_desc: 'כונן קשיח 1TB מ-Western Digital Purple - מותאם להקלטה 24/7.',
    category: 'storage',
    brand: 'Western Digital',
    stock: 15
  },
  'ST4000VX015': {
    id: 17,
    sku: 'ST4000VX015',
    name: 'HDD 4 TB',
    price_regular: 850,
    price_sale: 850,
    currency: 'ILS',
    short_desc: 'כונן קשיח 4TB מ-Seagate SkyHawk - מותאם למערכות אבטחה, 24/7.',
    category: 'storage',
    brand: 'Seagate',
    stock: 10
  },
  'CT500P3SSD8': {
    id: 18,
    sku: 'CT500P3SSD8',
    name: 'SSD 500 GB',
    price_regular: 490,
    price_sale: 490,
    currency: 'ILS',
    short_desc: 'SSD 500GB NVMe מ-Crucial P3 - מהירות גבוהה, אמינות מעולה.',
    category: 'storage',
    brand: 'Crucial',
    stock: 12
  },
  'BV650I': {
    id: 19,
    sku: 'BV650I',
    name: 'UPS 650 VA',
    price_regular: 690,
    price_sale: 690,
    currency: 'ILS',
    short_desc: 'מצבר גיבוי 650VA מ-APC - הגנה מפני הפסקות חשמל, USB ניהול.',
    category: 'power',
    brand: 'APC',
    stock: 8
  },
  'DN-19-06U-EC': {
    id: 20,
    sku: 'DN-19-06U-EC',
    name: 'Rack Mount 6U',
    price_regular: 1190,
    price_sale: 1190,
    currency: 'ILS',
    short_desc: 'ארון Rack 6U מ-Digitus - עיצוב מקצועי, אוורור משופר, מנעול.',
    category: 'accessories',
    brand: 'Digitus',
    stock: 5
  },
  // Access Control & Entry
  'K1T802M': {
    id: 21,
    sku: 'K1T802M',
    name: 'RFID Keypad',
    price_regular: 420,
    price_sale: 420,
    currency: 'ILS',
    short_desc: 'מקלדת RFID מ-ZKTeco - קריאת כרטיסים, קוד PIN, ניהול מרחוק.',
    category: 'access-control',
    brand: 'ZKTeco',
    stock: 10
  },
  'F18': {
    id: 22,
    sku: 'F18',
    name: 'Fingerprint Keypad',
    price_regular: 790,
    price_sale: 790,
    currency: 'ILS',
    short_desc: 'מקלדת טביעת אצבע מ-ZKTeco - זיהוי מהיר, 3000 טביעות, ניהול מתקדם.',
    category: 'access-control',
    brand: 'ZKTeco',
    stock: 8
  },
  'SPEEDFACE-V5L': {
    id: 23,
    sku: 'SPEEDFACE-V5L',
    name: 'Face Recognition Terminal',
    price_regular: 2890,
    price_sale: 2890,
    currency: 'ILS',
    short_desc: 'טרמינל זיהוי פנים מ-ZKTeco - זיהוי מהיר, 5000 פנים, טביעת אצבע.',
    category: 'access-control',
    brand: 'ZKTeco',
    stock: 4
  },
  'YM-280N-LED': {
    id: 24,
    sku: 'YM-280N-LED',
    name: 'Magnetic Lock 280 kg',
    price_regular: 320,
    price_sale: 320,
    currency: 'ILS',
    short_desc: 'מנעול מגנטי 280kg מ-YLI - עוצמה גבוהה, LED אינדיקציה, Fail-Safe.',
    category: 'access-control',
    brand: 'YLI',
    stock: 12
  },
  'YM-500N': {
    id: 25,
    sku: 'YM-500N',
    name: 'Magnetic Lock 500 kg',
    price_regular: 540,
    price_sale: 540,
    currency: 'ILS',
    short_desc: 'מנעול מגנטי 500kg מ-YLI - עוצמה מקסימלית, עמידות גבוהה.',
    category: 'access-control',
    brand: 'YLI',
    stock: 8
  },
  'ES-110': {
    id: 26,
    sku: 'ES-110',
    name: 'Electric Strike Lock',
    price_regular: 290,
    price_sale: 290,
    currency: 'ILS',
    short_desc: 'מנעול חשמלי Fail-Safe מ-YLI - פתיחה חשמלית, עוצמה גבוהה.',
    category: 'access-control',
    brand: 'YLI',
    stock: 10
  },
  'EB-P1A': {
    id: 27,
    sku: 'EB-P1A',
    name: 'Exit Button Metal',
    price_regular: 79,
    price_sale: 79,
    currency: 'ILS',
    short_desc: 'כפתור יציאה מתכת מ-YLI - עמידות גבוהה, התקנה קלה.',
    category: 'access-control',
    brand: 'YLI',
    stock: 20
  },
  'TS-68': {
    id: 28,
    sku: 'TS-68',
    name: 'Door Closer Hydraulic',
    price_regular: 240,
    price_sale: 240,
    currency: 'ILS',
    short_desc: 'סוגר דלת הידראולי מ-Dorma - סגירה אוטומטית, כוונון מהיר.',
    category: 'access-control',
    brand: 'Dorma',
    stock: 15
  },
  'DR-60-12': {
    id: 29,
    sku: 'DR-60-12',
    name: 'Power Supply 12V 5A',
    price_regular: 129,
    price_sale: 129,
    currency: 'ILS',
    short_desc: 'ספק כוח 12V 5A מ-Mean Well - אמינות גבוהה, הגנות מלאות.',
    category: 'power',
    brand: 'Mean Well',
    stock: 25
  },
  'ZKTECO-KIT-PRO': {
    id: 30,
    sku: 'ZKTECO-KIT-PRO',
    name: 'Full Access Kit',
    price_regular: 2190,
    price_sale: 2190,
    currency: 'ILS',
    short_desc: 'ערכת בקרת כניסה מלאה מ-ZKTeco - RFID, טביעת אצבע, ניהול מתקדם.',
    category: 'access-control',
    brand: 'ZKTeco',
    stock: 5
  },
  // Alarm Systems & Sensors
  'AJAX-STARTER-WHITE': {
    id: 31,
    sku: 'AJAX-STARTER-WHITE',
    name: 'Wireless Alarm Kit',
    price_regular: 1290,
    price_sale: 1290,
    currency: 'ILS',
    short_desc: 'ערכת אזעקה אלחוטית מ-Ajax - Hub + חיישנים, ניהול אפליקציה.',
    category: 'alarm',
    brand: 'Ajax',
    stock: 6
  },
  'AJAX-HUB2-PRO': {
    id: 32,
    sku: 'AJAX-HUB2-PRO',
    name: 'Smart Alarm (Ajax Style)',
    price_regular: 2190,
    price_sale: 2190,
    currency: 'ILS',
    short_desc: 'מערכת אזעקה חכמה מ-Ajax - Hub 2 + חיישנים מקצועיים, AI.',
    category: 'alarm',
    brand: 'Ajax',
    stock: 4
  },
  'MOTIONPROTECT': {
    id: 33,
    sku: 'MOTIONPROTECT',
    name: 'PIR Motion Sensor',
    price_regular: 250,
    price_sale: 250,
    currency: 'ILS',
    short_desc: 'חיישן תנועה PIR מ-Ajax - זיהוי מדויק, אלחוטי, סוללה ארוכה.',
    category: 'alarm',
    brand: 'Ajax',
    stock: 15
  },
  'DG85': {
    id: 34,
    sku: 'DG85',
    name: 'Dual Tech Sensor',
    price_regular: 360,
    price_sale: 360,
    currency: 'ILS',
    short_desc: 'חיישן Dual Tech מ-Paradox - PIR + מיקרו-גל, דיוק מקסימלי.',
    category: 'alarm',
    brand: 'Paradox',
    stock: 10
  },
  'DOORPROTECT': {
    id: 35,
    sku: 'DOORPROTECT',
    name: 'Door/Window Sensor',
    price_regular: 129,
    price_sale: 129,
    currency: 'ILS',
    short_desc: 'חיישן דלת/חלון מ-Ajax - זיהוי פתיחה, אלחוטי, סוללה 5 שנים.',
    category: 'alarm',
    brand: 'Ajax',
    stock: 20
  },
  'FIREPROTECT': {
    id: 36,
    sku: 'FIREPROTECT',
    name: 'Smoke Detector',
    price_regular: 199,
    price_sale: 199,
    currency: 'ILS',
    short_desc: 'גלאי עשן מ-Ajax - זיהוי מהיר, התראה מיידית, אלחוטי.',
    category: 'alarm',
    brand: 'Ajax',
    stock: 12
  },
  'HS1CG': {
    id: 37,
    sku: 'HS1CG',
    name: 'Gas Detector',
    price_regular: 259,
    price_sale: 259,
    currency: 'ILS',
    short_desc: 'גלאי גז מ-Heiman - זיהוי גז בישול, התראה קולית, Wi-Fi.',
    category: 'alarm',
    brand: 'Heiman',
    stock: 10
  },
  'STREETSIREN': {
    id: 38,
    sku: 'STREETSIREN',
    name: 'Siren Indoor/Outdoor',
    price_regular: 290,
    price_sale: 290,
    currency: 'ILS',
    short_desc: 'סירנה פנימית/חיצונית מ-Ajax - עוצמה גבוהה, עמידות למים.',
    category: 'alarm',
    brand: 'Ajax',
    stock: 8
  },
  'AJAX-BUTTON': {
    id: 39,
    sku: 'AJAX-BUTTON',
    name: 'Panic Button',
    price_regular: 119,
    price_sale: 119,
    currency: 'ILS',
    short_desc: 'כפתור פאניקה מ-Ajax - הפעלה מיידית, אלחוטי, סוללה ארוכה.',
    category: 'alarm',
    brand: 'Ajax',
    stock: 15
  },
  'NP7-12': {
    id: 40,
    sku: 'NP7-12',
    name: 'Battery Backup Pack',
    price_regular: 149,
    price_sale: 149,
    currency: 'ILS',
    short_desc: 'סוללת גיבוי 12V 7Ah מ-Yuasa - אמינות גבוהה, טעינה מהירה.',
    category: 'power',
    brand: 'Yuasa',
    stock: 18
  },
  // Networking & Power Accessories
  'CAT6-100M': {
    id: 41,
    sku: 'CAT6-100M',
    name: 'Ethernet Cable Cat6 (100 m)',
    price_regular: 229,
    price_sale: 229,
    currency: 'ILS',
    short_desc: 'כבל Ethernet Cat6 100 מטר מ-Linkbasic - חיצוני, UTP, איכות גבוהה.',
    category: 'networking',
    brand: 'Linkbasic',
    stock: 10
  },
  '2X075-50M': {
    id: 42,
    sku: '2X075-50M',
    name: 'Power Cable 2×0.75 (50 m)',
    price_regular: 119,
    price_sale: 119,
    currency: 'ILS',
    short_desc: 'כבל חשמל 2×0.75 50 מטר מ-Noy Electric - נחושת, איכות גבוהה.',
    category: 'networking',
    brand: 'Noy Electric',
    stock: 12
  },
  'RJ45-100': {
    id: 43,
    sku: 'RJ45-100',
    name: 'RJ45 Connectors ×100',
    price_regular: 79,
    price_sale: 79,
    currency: 'ILS',
    short_desc: 'חיבורי RJ45 ×100 מ-AMP/CommScope - איכות מקצועית, Cat6.',
    category: 'networking',
    brand: 'AMP',
    stock: 15
  },
  'TEG1105P-4': {
    id: 44,
    sku: 'TEG1105P-4',
    name: 'PoE Switch 4 Ports',
    price_regular: 299,
    price_sale: 299,
    currency: 'ILS',
    short_desc: 'מתג PoE 4 פורטים מ-Tenda - 63W כולל, ניהול פשוט.',
    category: 'networking',
    brand: 'Tenda',
    stock: 10
  },
  'TL-SG1008P-V4': {
    id: 45,
    sku: 'TL-SG1008P-V4',
    name: 'PoE Switch 8 Ports',
    price_regular: 499,
    price_sale: 499,
    currency: 'ILS',
    short_desc: 'מתג PoE 8 פורטים מ-TP-Link - 120W כולל, ניהול מתקדם.',
    category: 'networking',
    brand: 'TP-Link',
    stock: 8
  },
  'PFS3116-16ET-135': {
    id: 46,
    sku: 'PFS3116-16ET-135',
    name: 'PoE Switch 16 Ports',
    price_regular: 899,
    price_sale: 899,
    currency: 'ILS',
    short_desc: 'מתג PoE 16 פורטים מ-Dahua - 135W כולל, ניהול מקצועי.',
    category: 'networking',
    brand: 'Dahua',
    stock: 6
  },
  'TL-POE150S': {
    id: 47,
    sku: 'TL-POE150S',
    name: 'PoE Injector',
    price_regular: 119,
    price_sale: 119,
    currency: 'ILS',
    short_desc: 'מזרק PoE מ-TP-Link - 150W, תמיכה ב-PoE+.',
    category: 'networking',
    brand: 'TP-Link',
    stock: 15
  },
  'POE-24-12W': {
    id: 48,
    sku: 'POE-24-12W',
    name: 'Splitter PoE',
    price_regular: 99,
    price_sale: 99,
    currency: 'ILS',
    short_desc: 'מפצל PoE מ-Ubiquiti - 24V ל-12V, 12W, איכות גבוהה.',
    category: 'networking',
    brand: 'Ubiquiti',
    stock: 12
  },
  'UGREEN-DC-PACK': {
    id: 49,
    sku: 'UGREEN-DC-PACK',
    name: 'DC Power Adapters',
    price_regular: 49,
    price_sale: 49,
    currency: 'ILS',
    short_desc: 'מתאמי DC מ-Ugreen - ערכה מגוונת, איכות גבוהה.',
    category: 'power',
    brand: 'Ugreen',
    stock: 20
  },
  'DS-1280ZJ-DM18': {
    id: 50,
    sku: 'DS-1280ZJ-DM18',
    name: 'Junction Box',
    price_regular: 59,
    price_sale: 59,
    currency: 'ILS',
    short_desc: 'תיבת צומת מ-Hikvision - עמידות למים, התקנה קלה.',
    category: 'accessories',
    brand: 'Hikvision',
    stock: 18
  },
  'PFA134': {
    id: 51,
    sku: 'PFA134',
    name: 'Wall Mount Brackets',
    price_regular: 99,
    price_sale: 99,
    currency: 'ILS',
    short_desc: 'תושבת קיר מ-Dahua - עמידות גבוהה, התקנה מקצועית.',
    category: 'accessories',
    brand: 'Dahua',
    stock: 20
  },
  'DN-10': {
    id: 52,
    sku: 'DN-10',
    name: 'Cable Management Tray',
    price_regular: 179,
    price_sale: 179,
    currency: 'ILS',
    short_desc: 'מגש ניהול כבלים מ-Digitus - ארגון מקצועי, אוורור.',
    category: 'accessories',
    brand: 'Digitus',
    stock: 10
  },
  'PM1W-GR': {
    id: 53,
    sku: 'PM1W-GR',
    name: 'Surge Protector',
    price_regular: 129,
    price_sale: 129,
    currency: 'ILS',
    short_desc: 'מגן ברקים מ-APC - הגנה מקסימלית, ניהול מתקדם.',
    category: 'power',
    brand: 'APC',
    stock: 12
  },
  // Tools & Installation
  'CP-376TR': {
    id: 54,
    sku: 'CP-376TR',
    name: 'Crimping Tool RJ45',
    price_regular: 149,
    price_sale: 149,
    currency: 'ILS',
    short_desc: 'כלי לחיצה RJ45 מ-Pro\'sKit - איכות מקצועית, נוח לשימוש.',
    category: 'tools',
    brand: 'Pro\'sKit',
    stock: 10
  },
  '11061': {
    id: 55,
    sku: '11061',
    name: 'Wire Stripper',
    price_regular: 69,
    price_sale: 69,
    currency: 'ILS',
    short_desc: 'מקלף כבלים מ-Klein Tools - איכות מקצועית, נוח.',
    category: 'tools',
    brand: 'Klein Tools',
    stock: 15
  },
  'MT-7058': {
    id: 56,
    sku: 'MT-7058',
    name: 'Cable Tester RJ45/RJ11',
    price_regular: 129,
    price_sale: 129,
    currency: 'ILS',
    short_desc: 'בודק כבלים RJ45/RJ11 מ-Pro\'sKit - בדיקה מהירה, מדויקת.',
    category: 'tools',
    brand: 'Pro\'sKit',
    stock: 12
  },
  'UT681': {
    id: 57,
    sku: 'UT681',
    name: 'PoE Tester',
    price_regular: 199,
    price_sale: 199,
    currency: 'ILS',
    short_desc: 'בודק PoE מ-UNI-T - בדיקת מתח, זרם, איכות.',
    category: 'tools',
    brand: 'UNI-T',
    stock: 8
  },
  'HSS-6-10': {
    id: 58,
    sku: 'HSS-6-10',
    name: 'Drill Bits Set',
    price_regular: 99,
    price_sale: 99,
    currency: 'ILS',
    short_desc: 'ערכת מקדחים HSS מ-Bosch - 6-10 חתיכות, איכות גבוהה.',
    category: 'tools',
    brand: 'Bosch',
    stock: 12
  },
  'GLL-2-15-G': {
    id: 59,
    sku: 'GLL-2-15-G',
    name: 'Level Laser',
    price_regular: 299,
    price_sale: 299,
    currency: 'ILS',
    short_desc: 'מפלס לייזר מ-Bosch - דיוק גבוה, טווח 15 מטר.',
    category: 'tools',
    brand: 'Bosch',
    stock: 6
  },
  'WIHA-24': {
    id: 60,
    sku: 'WIHA-24',
    name: 'Screwdriver Kit (Precision)',
    price_regular: 119,
    price_sale: 119,
    currency: 'ILS',
    short_desc: 'ערכת מברגים מדויקים מ-Xiaomi Wiha - 24 חתיכות, איכות מקצועית.',
    category: 'tools',
    brand: 'Xiaomi',
    stock: 10
  },
  'PT-E110VP': {
    id: 61,
    sku: 'PT-E110VP',
    name: 'Label Printer Brother',
    price_regular: 590,
    price_sale: 590,
    currency: 'ILS',
    short_desc: 'מדפסת תוויות מ-Brother - הדפסה מהירה, איכות גבוהה.',
    category: 'tools',
    brand: 'Brother',
    stock: 5
  },
  'HSK-PACK': {
    id: 62,
    sku: 'HSK-PACK',
    name: 'Heat Shrink Tubes',
    price_regular: 49,
    price_sale: 49,
    currency: 'ILS',
    short_desc: 'צינורות כיווץ חום מ-3M - ערכה מגוונת, איכות גבוהה.',
    category: 'tools',
    brand: '3M',
    stock: 15
  },
  'FATMAX-TOOLBAG': {
    id: 63,
    sku: 'FATMAX-TOOLBAG',
    name: 'Tool Bag Pro',
    price_regular: 299,
    price_sale: 299,
    currency: 'ILS',
    short_desc: 'תיק כלים מקצועי מ-Stanley FatMax - עמידות גבוהה, ארגון מעולה.',
    category: 'tools',
    brand: 'Stanley',
    stock: 8
  },
  // Power & Backup
  'PB-12V-30Wh': {
    id: 64,
    sku: 'PB-12V-30Wh',
    name: 'Power Bank 12V',
    price_regular: 370,
    price_sale: 370,
    currency: 'ILS',
    short_desc: 'פאוור בנק 12V 30Wh מ-SBASE - גיבוי נייד, טעינה מהירה.',
    category: 'power',
    brand: 'SBASE',
    stock: 10
  },
  'SP-SOLAR-PANEL': {
    id: 65,
    sku: 'SP-SOLAR-PANEL',
    name: 'Solar Camera Panel',
    price_regular: 270,
    price_sale: 270,
    currency: 'ILS',
    short_desc: 'פאנל סולארי למצלמה מ-Reolink - טעינה סולארית, עמידות גבוהה.',
    category: 'power',
    brand: 'Reolink',
    stock: 8
  },
  'SD-25A-12': {
    id: 66,
    sku: 'SD-25A-12',
    name: 'Voltage Converter 24→12V',
    price_regular: 119,
    price_sale: 119,
    currency: 'ILS',
    short_desc: 'ממיר מתח 24V ל-12V מ-Mean Well - 25A, אמינות גבוהה.',
    category: 'power',
    brand: 'Mean Well',
    stock: 12
  },
  'FB-8CH': {
    id: 67,
    sku: 'FB-8CH',
    name: 'Fuse Box 8 Ch',
    price_regular: 149,
    price_sale: 149,
    currency: 'ILS',
    short_desc: 'קופסת פיוזים 8 ערוצים מ-Linkbasic - הגנה מקסימלית, ניהול קל.',
    category: 'power',
    brand: 'Linkbasic',
    stock: 10
  },
  // Accessories & Maintenance
  'LENS-CLEANER': {
    id: 68,
    sku: 'LENS-CLEANER',
    name: 'Cleaning Spray Optics',
    price_regular: 49,
    price_sale: 49,
    currency: 'ILS',
    short_desc: 'תרסיס ניקוי עדשות מ-Kärcher - ניקוי מקצועי, ללא שריטות.',
    category: 'accessories',
    brand: 'Kärcher',
    stock: 20
  },
  'SCOTCH-2228': {
    id: 69,
    sku: 'SCOTCH-2228',
    name: 'Waterproof Seal Kit',
    price_regular: 69,
    price_sale: 69,
    currency: 'ILS',
    short_desc: 'ערכת איטום למים מ-3M Scotch - איטום מקסימלי, עמידות גבוהה.',
    category: 'accessories',
    brand: '3M',
    stock: 15
  },
  'NETO-CLIPS-100': {
    id: 70,
    sku: 'NETO-CLIPS-100',
    name: 'Cable Clips ×100',
    price_regular: 29,
    price_sale: 29,
    currency: 'ILS',
    short_desc: 'אביזרי כבלים ×100 מ-Neto - ארגון מקצועי, עמידות גבוהה.',
    category: 'accessories',
    brand: 'Neto',
    stock: 25
  },
  'UGREEN-ZIP-100': {
    id: 71,
    sku: 'UGREEN-ZIP-100',
    name: 'Zip Ties ×100',
    price_regular: 25,
    price_sale: 25,
    currency: 'ILS',
    short_desc: 'קשרים מהירים ×100 מ-Ugreen - איכות גבוהה, עמידות.',
    category: 'accessories',
    brand: 'Ugreen',
    stock: 30
  },
  'DRYBOX-50': {
    id: 72,
    sku: 'DRYBOX-50',
    name: 'Silica Gel Packs',
    price_regular: 39,
    price_sale: 39,
    currency: 'ILS',
    short_desc: 'חבילות סיליקה ג\'ל ×50 מ-DryBox - ספיגת לחות, הגנה מקסימלית.',
    category: 'accessories',
    brand: 'DryBox',
    stock: 20
  },
  'HIKVISION-LED-MODULE': {
    id: 73,
    sku: 'HIKVISION-LED-MODULE',
    name: 'Replacement IR LEDs',
    price_regular: 79,
    price_sale: 79,
    currency: 'ILS',
    short_desc: 'מודול LED IR חלופי מ-Hikvision - תאורה לילית, איכות גבוהה.',
    category: 'accessories',
    brand: 'Hikvision',
    stock: 12
  },
  'WD40-SMART-STRAW': {
    id: 74,
    sku: 'WD40-SMART-STRAW',
    name: 'Anti-Rust Spray',
    price_regular: 49,
    price_sale: 49,
    currency: 'ILS',
    short_desc: 'תרסיס נגד חלודה מ-WD-40 - הגנה מקסימלית, 400ml.',
    category: 'accessories',
    brand: 'WD-40',
    stock: 18
  },
  'FISCHER-SET-PRO': {
    id: 75,
    sku: 'FISCHER-SET-PRO',
    name: 'Spare Screws & Anchors',
    price_regular: 25,
    price_sale: 25,
    currency: 'ILS',
    short_desc: 'ערכת ברגים ודיבלים מ-Fischer - מגוון גדלים, איכות מקצועית.',
    category: 'accessories',
    brand: 'Fischer',
    stock: 25
  },
  'TZE-LABEL-PACK': {
    id: 76,
    sku: 'TZE-LABEL-PACK',
    name: 'Network Label Stickers',
    price_regular: 29,
    price_sale: 29,
    currency: 'ILS',
    short_desc: 'מדבקות תווית רשת מ-Brother - הדפסה קלה, עמידות גבוהה.',
    category: 'accessories',
    brand: 'Brother',
    stock: 20
  }
};

let sql: any = null;
try {
  sql = neon();
} catch (error) {
  console.warn('Neon client not available, using fallback products');
}

// GET - קבלת מוצר לפי SKU
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params;

    if (!sku) {
      return NextResponse.json({ 
        ok: false, 
        error: 'SKU is required' 
      }, { status: 400 });
    }

    // Decode SKU if it's URL encoded and trim whitespace
    let decodedSku = decodeURIComponent(sku).trim();
    
    // Try multiple SKU formats (with/without dashes, case insensitive)
    const skuVariations = [
      decodedSku,
      decodedSku.toUpperCase(),
      decodedSku.toLowerCase(),
      decodedSku.replace(/-/g, ''),
      decodedSku.replace(/-/g, '_'),
    ];

    // Try to get product from database if available
    let products: any[] = [];
    
    if (sql) {
      try {
        for (const skuVar of skuVariations) {
          products = await sql`
            SELECT * FROM products 
            WHERE UPPER(TRIM(sku)) = UPPER(TRIM(${skuVar}))
            AND (stock IS NULL OR stock > 0)
            LIMIT 1
          `.catch((error: any) => {
            console.error('Database error:', error);
            return [];
          });
          
          if (products.length > 0) {
            break;
          }
        }

        // If still not found, try case-insensitive search without stock check
        if (products.length === 0) {
          products = await sql`
            SELECT * FROM products 
            WHERE UPPER(TRIM(sku)) = UPPER(TRIM(${decodedSku}))
            LIMIT 1
          `.catch((error: any) => {
            console.error('Database error (fallback):', error);
            return [];
          });
        }
      } catch (dbError: any) {
        console.warn('Database query failed, using fallback:', dbError.message);
      }
    }

    // If found in database, return it
    if (products.length > 0 && products[0]) {
      return NextResponse.json({ ok: true, product: products[0] });
    }

    // Fallback to static products
    const fallbackProduct = FALLBACK_PRODUCTS[decodedSku] || 
                           FALLBACK_PRODUCTS[decodedSku.toUpperCase()] ||
                           FALLBACK_PRODUCTS[decodedSku.toLowerCase()];
    
    if (fallbackProduct) {
      return NextResponse.json({ ok: true, product: fallbackProduct });
    }

    // Product not found
    console.log(`Product not found for SKU: ${decodedSku} (original: ${sku})`);
    return NextResponse.json({ 
      ok: false, 
      error: `Product not found for SKU: ${decodedSku}`,
      searchedSku: decodedSku,
      variations: skuVariations
    }, { status: 404 });
  } catch (error: any) {
    console.error('Error fetching product by SKU:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch product',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

