"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Shield, Camera, HardDrive, Smartphone, Wifi, Check, ArrowRight, CreditCard, Lock, Truck, Award, AlertCircle, MessageCircle, Star, TrendingDown, Clock, HelpCircle, Phone, Mail } from "lucide-react";
import { ProductJSONLD } from "@/components/JSONLDSchema";
import { ReviewList } from "@/components/Reviews/ReviewList";
import { ReviewForm } from "@/components/Reviews/ReviewForm";
import { ProductRecommendations } from "@/components/Recommendations/ProductRecommendations";

type Product = {
  id?: number;
  sku: string; name: string; price_regular: number; price_sale?: number;
  currency: "ILS"; short_desc: string;
  rating_avg?: number;
  review_count?: number;
};

const fmt = (n:number)=> new Intl.NumberFormat("he-IL",{style:"currency",currency:"ILS"}).format(n);

// מוצרים סטטיים כ-fallback אם ה-API לא זמין
const FALLBACK_PRODUCTS: Record<string, Product> = {
  "H-01-2TB": {
    sku: "H-01-2TB",
    name: "Home Cam H-01 (2 TB)",
    price_regular: 2590,
    price_sale: 2290,
    currency: "ILS",
    short_desc: "מערכת אבטחה חכמה: 2×4MP PoE + NVR 2TB + אפליקציה בעברית."
  },
  "IPC-HDBW2231E-S-S2": {
    sku: "IPC-HDBW2231E-S-S2",
    name: "Dome 2MP Starlight",
    price_regular: 579,
    price_sale: 579,
    currency: "ILS",
    short_desc: "מצלמת Dome 2MP Starlight מ-Dahua - ראיית לילה מעולה ואיכות תמונה גבוהה."
  },
  "IPC-HFW2231T-AS-S2": {
    sku: "IPC-HFW2231T-AS-S2",
    name: "Bullet 2MP Starlight",
    price_regular: 599,
    price_sale: 599,
    currency: "ILS",
    short_desc: "מצלמת Bullet 2MP Starlight מ-Dahua - עמידה למים IP67, ראיית לילה עד 30 מטר."
  },
  "IPC-HFW2431S-S-S2": {
    sku: "IPC-HFW2431S-S-S2",
    name: "Bullet 4MP",
    price_regular: 599,
    price_sale: 599,
    currency: "ILS",
    short_desc: "מצלמת Bullet 4MP מ-Dahua - רזולוציה גבוהה, עמידה למים, התקנה חיצונית."
  },
  "SD49225XA-HNR-S2": {
    sku: "SD49225XA-HNR-S2",
    name: "PTZ 25× 2MP",
    price_regular: 2790,
    price_sale: 2790,
    currency: "ILS",
    short_desc: "מצלמת PTZ 25× 2MP מ-Dahua - זום אופטי 25×, סיבוב 360°, Auto-Tracking."
  },
  "C3TN": {
    sku: "C3TN",
    name: "Wi-Fi Outdoor 1080p",
    price_regular: 235,
    price_sale: 235,
    currency: "ILS",
    short_desc: "מצלמת Wi-Fi חיצונית 1080p מ-EZVIZ - אלחוטית, עמידה למים, התקנה קלה."
  },
  "C6N-4MP": {
    sku: "C6N-4MP",
    name: "Wi-Fi Pan/Tilt 4MP",
    price_regular: 299,
    price_sale: 299,
    currency: "ILS",
    short_desc: "מצלמת Wi-Fi Pan/Tilt 4MP מ-EZVIZ - סיבוב 360°, רזולוציה 4MP, שליטה מרחוק."
  },
  "TAPO-C210": {
    sku: "TAPO-C210",
    name: "Wi-Fi Pan/Tilt 3MP",
    price_regular: 219,
    price_sale: 219,
    currency: "ILS",
    short_desc: "מצלמת Wi-Fi Pan/Tilt 3MP מ-TP-Link - סיבוב 360°, רזולוציה 3MP, אפליקציה חכמה."
  },
  "BCAM-02": {
    sku: "BCAM-02",
    name: "Battery Cam FHD",
    price_regular: 590,
    price_sale: 590,
    currency: "ILS",
    short_desc: "מצלמת Battery FHD מ-Provision-ISR - סוללה מובנית, Wi-Fi, התקנה ללא חיווט."
  },
  "BCAM-05": {
    sku: "BCAM-05",
    name: "Battery Cam 4MP",
    price_regular: 540,
    price_sale: 540,
    currency: "ILS",
    short_desc: "מצלמת Battery 4MP מ-Provision-ISR - סוללה מובנית, רזולוציה 4MP, Wi-Fi."
  },
  // NVR / DVR / Storage
  "DS-7604NI-K1-4P": {
    sku: "DS-7604NI-K1-4P",
    name: "NVR 4ch PoE",
    price_regular: 749,
    price_sale: 749,
    currency: "ILS",
    short_desc: "NVR 4 ערוצים עם PoE מ-Hikvision - הקלטה 4K, תמיכה ב-PoE, ניהול מרחוק."
  },
  "NVR2108HS-8P-S2": {
    sku: "NVR2108HS-8P-S2",
    name: "NVR 8ch PoE",
    price_regular: 1090,
    price_sale: 1090,
    currency: "ILS",
    short_desc: "NVR 8 ערוצים עם PoE מ-Dahua - הקלטה 4K, 8 פורטי PoE מובנים, ניהול חכם."
  },
  "DS-7616NXI-K2-16P": {
    sku: "DS-7616NXI-K2-16P",
    name: "NVR 16ch Smart 4K",
    price_regular: 1790,
    price_sale: 1790,
    currency: "ILS",
    short_desc: "NVR 16 ערוצים Smart 4K מ-Hikvision - Acusense, 16 פורטי PoE, AI חכם."
  },
  "XVR1B08H-I": {
    sku: "XVR1B08H-I",
    name: "DVR Hybrid 8ch",
    price_regular: 990,
    price_sale: 990,
    currency: "ILS",
    short_desc: "DVR Hybrid 8 ערוצים מ-Dahua - תמיכה ב-AHD/TVI/CVI/IP, הקלטה 4K."
  },
  "DS224+": {
    sku: "DS224+",
    name: "NAS Recorder Mini",
    price_regular: 2790,
    price_sale: 2790,
    currency: "ILS",
    short_desc: "NAS Recorder Mini מ-Synology - 2 כוננים, הקלטה חכמה, גיבוי ענן."
  },
  "WD-PURPLE-1TB": {
    sku: "WD-PURPLE-1TB",
    name: "HDD 1 TB",
    price_regular: 590,
    price_sale: 590,
    currency: "ILS",
    short_desc: "כונן קשיח 1TB מ-Western Digital Purple - מותאם להקלטה 24/7."
  },
  "ST4000VX015": {
    sku: "ST4000VX015",
    name: "HDD 4 TB",
    price_regular: 850,
    price_sale: 850,
    currency: "ILS",
    short_desc: "כונן קשיח 4TB מ-Seagate SkyHawk - מותאם למערכות אבטחה, 24/7."
  },
  "CT500P3SSD8": {
    sku: "CT500P3SSD8",
    name: "SSD 500 GB",
    price_regular: 490,
    price_sale: 490,
    currency: "ILS",
    short_desc: "SSD 500GB NVMe מ-Crucial P3 - מהירות גבוהה, אמינות מעולה."
  },
  "BV650I": {
    sku: "BV650I",
    name: "UPS 650 VA",
    price_regular: 690,
    price_sale: 690,
    currency: "ILS",
    short_desc: "מצבר גיבוי 650VA מ-APC - הגנה מפני הפסקות חשמל, USB ניהול."
  },
  "DN-19-06U-EC": {
    sku: "DN-19-06U-EC",
    name: "Rack Mount 6U",
    price_regular: 1190,
    price_sale: 1190,
    currency: "ILS",
    short_desc: "ארון Rack 6U מ-Digitus - עיצוב מקצועי, אוורור משופר, מנעול."
  },
  // Access Control & Entry
  "K1T802M": {
    sku: "K1T802M",
    name: "RFID Keypad",
    price_regular: 420,
    price_sale: 420,
    currency: "ILS",
    short_desc: "מקלדת RFID מ-ZKTeco - קריאת כרטיסים, קוד PIN, ניהול מרחוק."
  },
  "F18": {
    sku: "F18",
    name: "Fingerprint Keypad",
    price_regular: 790,
    price_sale: 790,
    currency: "ILS",
    short_desc: "מקלדת טביעת אצבע מ-ZKTeco - זיהוי מהיר, 3000 טביעות, ניהול מתקדם."
  },
  "SPEEDFACE-V5L": {
    sku: "SPEEDFACE-V5L",
    name: "Face Recognition Terminal",
    price_regular: 2890,
    price_sale: 2890,
    currency: "ILS",
    short_desc: "טרמינל זיהוי פנים מ-ZKTeco - זיהוי מהיר, 5000 פנים, טביעת אצבע."
  },
  "YM-280N-LED": {
    sku: "YM-280N-LED",
    name: "Magnetic Lock 280 kg",
    price_regular: 320,
    price_sale: 320,
    currency: "ILS",
    short_desc: "מנעול מגנטי 280kg מ-YLI - עוצמה גבוהה, LED אינדיקציה, Fail-Safe."
  },
  "YM-500N": {
    sku: "YM-500N",
    name: "Magnetic Lock 500 kg",
    price_regular: 540,
    price_sale: 540,
    currency: "ILS",
    short_desc: "מנעול מגנטי 500kg מ-YLI - עוצמה מקסימלית, עמידות גבוהה."
  },
  "ES-110": {
    sku: "ES-110",
    name: "Electric Strike Lock",
    price_regular: 290,
    price_sale: 290,
    currency: "ILS",
    short_desc: "מנעול חשמלי Fail-Safe מ-YLI - פתיחה חשמלית, עוצמה גבוהה."
  },
  "EB-P1A": {
    sku: "EB-P1A",
    name: "Exit Button Metal",
    price_regular: 79,
    price_sale: 79,
    currency: "ILS",
    short_desc: "כפתור יציאה מתכת מ-YLI - עמידות גבוהה, התקנה קלה."
  },
  "TS-68": {
    sku: "TS-68",
    name: "Door Closer Hydraulic",
    price_regular: 240,
    price_sale: 240,
    currency: "ILS",
    short_desc: "סוגר דלת הידראולי מ-Dorma - סגירה אוטומטית, כוונון מהיר."
  },
  "DR-60-12": {
    sku: "DR-60-12",
    name: "Power Supply 12V 5A",
    price_regular: 129,
    price_sale: 129,
    currency: "ILS",
    short_desc: "ספק כוח 12V 5A מ-Mean Well - אמינות גבוהה, הגנות מלאות."
  },
  "ZKTECO-KIT-PRO": {
    sku: "ZKTECO-KIT-PRO",
    name: "Full Access Kit",
    price_regular: 2190,
    price_sale: 2190,
    currency: "ILS",
    short_desc: "ערכת בקרת כניסה מלאה מ-ZKTeco - RFID, טביעת אצבע, ניהול מתקדם."
  },
  // Alarm Systems & Sensors
  "AJAX-STARTER-WHITE": {
    sku: "AJAX-STARTER-WHITE",
    name: "Wireless Alarm Kit",
    price_regular: 1290,
    price_sale: 1290,
    currency: "ILS",
    short_desc: "ערכת אזעקה אלחוטית מ-Ajax - Hub + חיישנים, ניהול אפליקציה."
  },
  "AJAX-HUB2-PRO": {
    sku: "AJAX-HUB2-PRO",
    name: "Smart Alarm (Ajax Style)",
    price_regular: 2190,
    price_sale: 2190,
    currency: "ILS",
    short_desc: "מערכת אזעקה חכמה מ-Ajax - Hub 2 + חיישנים מקצועיים, AI."
  },
  "MOTIONPROTECT": {
    sku: "MOTIONPROTECT",
    name: "PIR Motion Sensor",
    price_regular: 250,
    price_sale: 250,
    currency: "ILS",
    short_desc: "חיישן תנועה PIR מ-Ajax - זיהוי מדויק, אלחוטי, סוללה ארוכה."
  },
  "DG85": {
    sku: "DG85",
    name: "Dual Tech Sensor",
    price_regular: 360,
    price_sale: 360,
    currency: "ILS",
    short_desc: "חיישן Dual Tech מ-Paradox - PIR + מיקרו-גל, דיוק מקסימלי."
  },
  "DOORPROTECT": {
    sku: "DOORPROTECT",
    name: "Door/Window Sensor",
    price_regular: 129,
    price_sale: 129,
    currency: "ILS",
    short_desc: "חיישן דלת/חלון מ-Ajax - זיהוי פתיחה, אלחוטי, סוללה 5 שנים."
  },
  "FIREPROTECT": {
    sku: "FIREPROTECT",
    name: "Smoke Detector",
    price_regular: 199,
    price_sale: 199,
    currency: "ILS",
    short_desc: "גלאי עשן מ-Ajax - זיהוי מהיר, התראה מיידית, אלחוטי."
  },
  "HS1CG": {
    sku: "HS1CG",
    name: "Gas Detector",
    price_regular: 259,
    price_sale: 259,
    currency: "ILS",
    short_desc: "גלאי גז מ-Heiman - זיהוי גז בישול, התראה קולית, Wi-Fi."
  },
  "STREETSIREN": {
    sku: "STREETSIREN",
    name: "Siren Indoor/Outdoor",
    price_regular: 290,
    price_sale: 290,
    currency: "ILS",
    short_desc: "סירנה פנימית/חיצונית מ-Ajax - עוצמה גבוהה, עמידות למים."
  },
  "AJAX-BUTTON": {
    sku: "AJAX-BUTTON",
    name: "Panic Button",
    price_regular: 119,
    price_sale: 119,
    currency: "ILS",
    short_desc: "כפתור פאניקה מ-Ajax - הפעלה מיידית, אלחוטי, סוללה ארוכה."
  },
  "NP7-12": {
    sku: "NP7-12",
    name: "Battery Backup Pack",
    price_regular: 149,
    price_sale: 149,
    currency: "ILS",
    short_desc: "סוללת גיבוי 12V 7Ah מ-Yuasa - אמינות גבוהה, טעינה מהירה."
  },
  // Networking & Power Accessories
  "CAT6-100M": {
    sku: "CAT6-100M",
    name: "Ethernet Cable Cat6 (100 m)",
    price_regular: 229,
    price_sale: 229,
    currency: "ILS",
    short_desc: "כבל Ethernet Cat6 100 מטר מ-Linkbasic - חיצוני, UTP, איכות גבוהה."
  },
  "2X075-50M": {
    sku: "2X075-50M",
    name: "Power Cable 2×0.75 (50 m)",
    price_regular: 119,
    price_sale: 119,
    currency: "ILS",
    short_desc: "כבל חשמל 2×0.75 50 מטר מ-Noy Electric - נחושת, איכות גבוהה."
  },
  "RJ45-100": {
    sku: "RJ45-100",
    name: "RJ45 Connectors ×100",
    price_regular: 79,
    price_sale: 79,
    currency: "ILS",
    short_desc: "חיבורי RJ45 ×100 מ-AMP/CommScope - איכות מקצועית, Cat6."
  },
  "TEG1105P-4": {
    sku: "TEG1105P-4",
    name: "PoE Switch 4 Ports",
    price_regular: 299,
    price_sale: 299,
    currency: "ILS",
    short_desc: "מתג PoE 4 פורטים מ-Tenda - 63W כולל, ניהול פשוט."
  },
  "TL-SG1008P-V4": {
    sku: "TL-SG1008P-V4",
    name: "PoE Switch 8 Ports",
    price_regular: 499,
    price_sale: 499,
    currency: "ILS",
    short_desc: "מתג PoE 8 פורטים מ-TP-Link - 120W כולל, ניהול מתקדם."
  },
  "PFS3116-16ET-135": {
    sku: "PFS3116-16ET-135",
    name: "PoE Switch 16 Ports",
    price_regular: 899,
    price_sale: 899,
    currency: "ILS",
    short_desc: "מתג PoE 16 פורטים מ-Dahua - 135W כולל, ניהול מקצועי."
  },
  "TL-POE150S": {
    sku: "TL-POE150S",
    name: "PoE Injector",
    price_regular: 119,
    price_sale: 119,
    currency: "ILS",
    short_desc: "מזרק PoE מ-TP-Link - 150W, תמיכה ב-PoE+."
  },
  "POE-24-12W": {
    sku: "POE-24-12W",
    name: "Splitter PoE",
    price_regular: 99,
    price_sale: 99,
    currency: "ILS",
    short_desc: "מפצל PoE מ-Ubiquiti - 24V ל-12V, 12W, איכות גבוהה."
  },
  "UGREEN-DC-PACK": {
    sku: "UGREEN-DC-PACK",
    name: "DC Power Adapters",
    price_regular: 49,
    price_sale: 49,
    currency: "ILS",
    short_desc: "מתאמי DC מ-Ugreen - ערכה מגוונת, איכות גבוהה."
  },
  "DS-1280ZJ-DM18": {
    sku: "DS-1280ZJ-DM18",
    name: "Junction Box",
    price_regular: 59,
    price_sale: 59,
    currency: "ILS",
    short_desc: "תיבת צומת מ-Hikvision - עמידות למים, התקנה קלה."
  },
  "PFA134": {
    sku: "PFA134",
    name: "Wall Mount Brackets",
    price_regular: 99,
    price_sale: 99,
    currency: "ILS",
    short_desc: "תושבת קיר מ-Dahua - עמידות גבוהה, התקנה מקצועית."
  },
  "DN-10": {
    sku: "DN-10",
    name: "Cable Management Tray",
    price_regular: 179,
    price_sale: 179,
    currency: "ILS",
    short_desc: "מגש ניהול כבלים מ-Digitus - ארגון מקצועי, אוורור."
  },
  "PM1W-GR": {
    sku: "PM1W-GR",
    name: "Surge Protector",
    price_regular: 129,
    price_sale: 129,
    currency: "ILS",
    short_desc: "מגן ברקים מ-APC - הגנה מקסימלית, ניהול מתקדם."
  },
  // Tools & Installation
  "CP-376TR": {
    sku: "CP-376TR",
    name: "Crimping Tool RJ45",
    price_regular: 149,
    price_sale: 149,
    currency: "ILS",
    short_desc: "כלי לחיצה RJ45 מ-Pro'sKit - איכות מקצועית, נוח לשימוש."
  },
  "11061": {
    sku: "11061",
    name: "Wire Stripper",
    price_regular: 69,
    price_sale: 69,
    currency: "ILS",
    short_desc: "מקלף כבלים מ-Klein Tools - איכות מקצועית, נוח."
  },
  "MT-7058": {
    sku: "MT-7058",
    name: "Cable Tester RJ45/RJ11",
    price_regular: 129,
    price_sale: 129,
    currency: "ILS",
    short_desc: "בודק כבלים RJ45/RJ11 מ-Pro'sKit - בדיקה מהירה, מדויקת."
  },
  "UT681": {
    sku: "UT681",
    name: "PoE Tester",
    price_regular: 199,
    price_sale: 199,
    currency: "ILS",
    short_desc: "בודק PoE מ-UNI-T - בדיקת מתח, זרם, איכות."
  },
  "HSS-6-10": {
    sku: "HSS-6-10",
    name: "Drill Bits Set",
    price_regular: 99,
    price_sale: 99,
    currency: "ILS",
    short_desc: "ערכת מקדחים HSS מ-Bosch - 6-10 חתיכות, איכות גבוהה."
  },
  "GLL-2-15-G": {
    sku: "GLL-2-15-G",
    name: "Level Laser",
    price_regular: 299,
    price_sale: 299,
    currency: "ILS",
    short_desc: "מפלס לייזר מ-Bosch - דיוק גבוה, טווח 15 מטר."
  },
  "WIHA-24": {
    sku: "WIHA-24",
    name: "Screwdriver Kit (Precision)",
    price_regular: 119,
    price_sale: 119,
    currency: "ILS",
    short_desc: "ערכת מברגים מדויקים מ-Xiaomi Wiha - 24 חתיכות, איכות מקצועית."
  },
  "PT-E110VP": {
    sku: "PT-E110VP",
    name: "Label Printer Brother",
    price_regular: 590,
    price_sale: 590,
    currency: "ILS",
    short_desc: "מדפסת תוויות מ-Brother - הדפסה מהירה, איכות גבוהה."
  },
  "HSK-PACK": {
    sku: "HSK-PACK",
    name: "Heat Shrink Tubes",
    price_regular: 49,
    price_sale: 49,
    currency: "ILS",
    short_desc: "צינורות כיווץ חום מ-3M - ערכה מגוונת, איכות גבוהה."
  },
  "FATMAX-TOOLBAG": {
    sku: "FATMAX-TOOLBAG",
    name: "Tool Bag Pro",
    price_regular: 299,
    price_sale: 299,
    currency: "ILS",
    short_desc: "תיק כלים מקצועי מ-Stanley FatMax - עמידות גבוהה, ארגון מעולה."
  },
  // Power & Backup
  "PB-12V-30Wh": {
    sku: "PB-12V-30Wh",
    name: "Power Bank 12V",
    price_regular: 370,
    price_sale: 370,
    currency: "ILS",
    short_desc: "פאוור בנק 12V 30Wh מ-SBASE - גיבוי נייד, טעינה מהירה."
  },
  "SP-SOLAR-PANEL": {
    sku: "SP-SOLAR-PANEL",
    name: "Solar Camera Panel",
    price_regular: 270,
    price_sale: 270,
    currency: "ILS",
    short_desc: "פאנל סולארי למצלמה מ-Reolink - טעינה סולארית, עמידות גבוהה."
  },
  "SD-25A-12": {
    sku: "SD-25A-12",
    name: "Voltage Converter 24→12V",
    price_regular: 119,
    price_sale: 119,
    currency: "ILS",
    short_desc: "ממיר מתח 24V ל-12V מ-Mean Well - 25A, אמינות גבוהה."
  },
  "FB-8CH": {
    sku: "FB-8CH",
    name: "Fuse Box 8 Ch",
    price_regular: 149,
    price_sale: 149,
    currency: "ILS",
    short_desc: "קופסת פיוזים 8 ערוצים מ-Linkbasic - הגנה מקסימלית, ניהול קל."
  },
  // Accessories & Maintenance
  "LENS-CLEANER": {
    sku: "LENS-CLEANER",
    name: "Cleaning Spray Optics",
    price_regular: 49,
    price_sale: 49,
    currency: "ILS",
    short_desc: "תרסיס ניקוי עדשות מ-Kärcher - ניקוי מקצועי, ללא שריטות."
  },
  "SCOTCH-2228": {
    sku: "SCOTCH-2228",
    name: "Waterproof Seal Kit",
    price_regular: 69,
    price_sale: 69,
    currency: "ILS",
    short_desc: "ערכת איטום למים מ-3M Scotch - איטום מקסימלי, עמידות גבוהה."
  },
  "NETO-CLIPS-100": {
    sku: "NETO-CLIPS-100",
    name: "Cable Clips ×100",
    price_regular: 29,
    price_sale: 29,
    currency: "ILS",
    short_desc: "אביזרי כבלים ×100 מ-Neto - ארגון מקצועי, עמידות גבוהה."
  },
  "UGREEN-ZIP-100": {
    sku: "UGREEN-ZIP-100",
    name: "Zip Ties ×100",
    price_regular: 25,
    price_sale: 25,
    currency: "ILS",
    short_desc: "קשרים מהירים ×100 מ-Ugreen - איכות גבוהה, עמידות."
  },
  "DRYBOX-50": {
    sku: "DRYBOX-50",
    name: "Silica Gel Packs",
    price_regular: 39,
    price_sale: 39,
    currency: "ILS",
    short_desc: "חבילות סיליקה ג'ל ×50 מ-DryBox - ספיגת לחות, הגנה מקסימלית."
  },
  "HIKVISION-LED-MODULE": {
    sku: "HIKVISION-LED-MODULE",
    name: "Replacement IR LEDs",
    price_regular: 79,
    price_sale: 79,
    currency: "ILS",
    short_desc: "מודול LED IR חלופי מ-Hikvision - תאורה לילית, איכות גבוהה."
  },
  "WD40-SMART-STRAW": {
    sku: "WD40-SMART-STRAW",
    name: "Anti-Rust Spray",
    price_regular: 49,
    price_sale: 49,
    currency: "ILS",
    short_desc: "תרסיס נגד חלודה מ-WD-40 - הגנה מקסימלית, 400ml."
  },
  "FISCHER-SET-PRO": {
    sku: "FISCHER-SET-PRO",
    name: "Spare Screws & Anchors",
    price_regular: 25,
    price_sale: 25,
    currency: "ILS",
    short_desc: "ערכת ברגים ודיבלים מ-Fischer - מגוון גדלים, איכות מקצועית."
  },
  "TZE-LABEL-PACK": {
    sku: "TZE-LABEL-PACK",
    name: "Network Label Stickers",
    price_regular: 29,
    price_sale: 29,
    currency: "ILS",
    short_desc: "מדבקות תווית רשת מ-Brother - הדפסה קלה, עמידות גבוהה."
  }
};

// פרטים נוספים לכל המוצרים
const PRODUCT_DETAILS: Record<string, {
  features: string[];
  specs: { label: string; value: string }[];
  includes: string[];
  brand?: string;
  model?: string;
}> = {
  "H-01-2TB": {
    brand: "Dahua",
    model: "H-01-2TB",
    features: [
      "2× מצלמות 4MP PoE עם ראיית לילה 30 מטר",
      "NVR 4 ערוצים עם 2TB אחסון",
      "אפליקציה בעברית לנייד ולמחשב",
      "צפייה בזמן אמת והקלטה 24/7",
      "התראות חכמות לנייד",
      "התקנה Plug & Play - מוכן תוך שעה"
    ],
    specs: [
      { label: "סוג מצלמה", value: "Dahua IP PoE 4MP (Dome/Bullet)" },
      { label: "רזולוציה", value: "4MP (2560×1440)" },
      { label: "זווית צילום", value: "90°" },
      { label: "ראיית לילה", value: "30 מטר IR" },
      { label: "אחסון", value: "2TB HDD" },
      { label: "ערוצי הקלטה", value: "4 ערוצים" },
      { label: "חיבור", value: "PoE (Power over Ethernet)" }
    ],
    includes: [
      "2× מצלמות 4MP PoE",
      "NVR עם 2TB HDD",
      "כבלי Ethernet",
      "אפליקציה בעברית",
      "התקנה מקצועית",
      "הדרכה אישית",
      "אחריות 12 חודשים"
    ]
  },
  "IPC-HDBW2231E-S-S2": {
    brand: "Dahua",
    model: "IPC-HDBW2231E-S-S2",
    features: [
      "רזולוציה 2MP Starlight - איכות תמונה מעולה",
      "ראיית לילה צבעונית - Starlight Technology",
      "עיצוב Dome קומפקטי וחסכוני",
      "עמידות למים IP67",
      "תמיכה ב-PoE - חיווט אחד",
      "אפליקציה לנייד - צפייה מרחוק"
    ],
    specs: [
      { label: "רזולוציה", value: "2MP (1920×1080)" },
      { label: "חיישן", value: "1/2.8\" CMOS Starlight" },
      { label: "ראיית לילה", value: "Starlight צבעונית" },
      { label: "זווית צילום", value: "2.8mm / 3.6mm" },
      { label: "עמידות", value: "IP67" },
      { label: "חיבור", value: "PoE / 12V DC" }
    ],
    includes: [
      "מצלמת Dome 2MP Starlight",
      "מתאם PoE (אם נדרש)",
      "מדריך התקנה",
      "אחריות יצרן",
      "תמיכה טכנית"
    ]
  },
  "IPC-HFW2231T-AS-S2": {
    brand: "Dahua",
    model: "IPC-HFW2231T-AS-S2",
    features: [
      "רזולוציה 2MP Starlight - איכות תמונה גבוהה",
      "עיצוב Bullet חזק - עמידות מקסימלית",
      "ראיית לילה עד 30 מטר",
      "עמידות למים IP67 - התקנה חיצונית",
      "תמיכה ב-PoE - חיווט אחד",
      "אפליקציה לנייד - ניהול מרחוק"
    ],
    specs: [
      { label: "רזולוציה", value: "2MP (1920×1080)" },
      { label: "חיישן", value: "1/2.8\" CMOS Starlight" },
      { label: "ראיית לילה", value: "IR עד 30 מטר" },
      { label: "עמידות", value: "IP67" },
      { label: "טמפרטורה", value: "-30°C עד +60°C" },
      { label: "חיבור", value: "PoE / 12V DC" }
    ],
    includes: [
      "מצלמת Bullet 2MP Starlight",
      "מתאם PoE (אם נדרש)",
      "מדריך התקנה",
      "אחריות יצרן",
      "תמיכה טכנית"
    ]
  },
  "IPC-HFW2431S-S-S2": {
    brand: "Dahua",
    model: "IPC-HFW2431S-S-S2",
    features: [
      "רזולוציה 4MP - חדות גבוהה",
      "עיצוב Bullet מקצועי",
      "ראיית לילה IR עד 30 מטר",
      "עמידות למים IP67",
      "תמיכה ב-PoE",
      "אפליקציה לנייד"
    ],
    specs: [
      { label: "רזולוציה", value: "4MP (2560×1440)" },
      { label: "חיישן", value: "1/2.8\" CMOS" },
      { label: "ראיית לילה", value: "IR עד 30 מטר" },
      { label: "עמידות", value: "IP67" },
      { label: "זווית צילום", value: "2.8mm / 3.6mm" },
      { label: "חיבור", value: "PoE / 12V DC" }
    ],
    includes: [
      "מצלמת Bullet 4MP",
      "מתאם PoE (אם נדרש)",
      "מדריך התקנה",
      "אחריות יצרן",
      "תמיכה טכנית"
    ]
  },
  "SD49225XA-HNR-S2": {
    brand: "Dahua",
    model: "SD49225XA-HNR-S2",
    features: [
      "זום אופטי 25× - הגדלה מעולה",
      "סיבוב 360° אופקי, 90° אנכי",
      "Auto-Tracking - מעקב אוטומטי",
      "רזולוציה 2MP Starlight",
      "עמידות למים IP66",
      "שליטה מרחוק - אפליקציה"
    ],
    specs: [
      { label: "רזולוציה", value: "2MP (1920×1080)" },
      { label: "זום", value: "25× אופטי" },
      { label: "סיבוב", value: "360° אופקי, 90° אנכי" },
      { label: "מהירות", value: "240°/שנייה" },
      { label: "Auto-Tracking", value: "כן" },
      { label: "עמידות", value: "IP66" }
    ],
    includes: [
      "מצלמת PTZ 25×",
      "מתאם PoE+",
      "מדריך התקנה",
      "אחריות יצרן",
      "תמיכה טכנית"
    ]
  },
  "C3TN": {
    brand: "EZVIZ",
    model: "C3TN",
    features: [
      "רזולוציה 1080p Full HD",
      "חיבור Wi-Fi - ללא חיווט",
      "עמידות למים IP65 - התקנה חיצונית",
      "ראיית לילה IR",
      "אפליקציה EZVIZ - ניהול קל",
      "התקנה קלה - תוך דקות"
    ],
    specs: [
      { label: "רזולוציה", value: "1080p (1920×1080)" },
      { label: "חיבור", value: "Wi-Fi 2.4GHz" },
      { label: "עמידות", value: "IP65" },
      { label: "ראיית לילה", value: "IR" },
      { label: "אחסון", value: "MicroSD עד 256GB" },
      { label: "מתח", value: "5V DC" }
    ],
    includes: [
      "מצלמת Wi-Fi Outdoor",
      "כבל USB להספקה",
      "מדריך התקנה",
      "אפליקציה EZVIZ",
      "אחריות יצרן"
    ]
  },
  "C6N-4MP": {
    brand: "EZVIZ",
    model: "C6N 4MP",
    features: [
      "רזולוציה 4MP - חדות גבוהה",
      "סיבוב Pan/Tilt 360° - כיסוי מלא",
      "חיבור Wi-Fi - ללא חיווט",
      "ראיית לילה צבעונית",
      "אפליקציה EZVIZ - שליטה מלאה",
      "הקלטה ל-MicroSD או ענן"
    ],
    specs: [
      { label: "רזולוציה", value: "4MP (2560×1440)" },
      { label: "סיבוב", value: "360° Pan/Tilt" },
      { label: "חיבור", value: "Wi-Fi 2.4GHz" },
      { label: "ראיית לילה", value: "צבעונית + IR" },
      { label: "אחסון", value: "MicroSD עד 256GB" },
      { label: "מתח", value: "5V DC" }
    ],
    includes: [
      "מצלמת Wi-Fi Pan/Tilt 4MP",
      "כבל USB להספקה",
      "מדריך התקנה",
      "אפליקציה EZVIZ",
      "אחריות יצרן"
    ]
  },
  "TAPO-C210": {
    brand: "TP-Link",
    model: "Tapo C210",
    features: [
      "רזולוציה 3MP - איכות תמונה מעולה",
      "סיבוב Pan/Tilt 360° - כיסוי מלא",
      "חיבור Wi-Fi - ללא חיווט",
      "ראיית לילה צבעונית",
      "אפליקציה Tapo - ניהול חכם",
      "הקלטה ל-MicroSD או ענן"
    ],
    specs: [
      { label: "רזולוציה", value: "3MP (2304×1296)" },
      { label: "סיבוב", value: "360° Pan/Tilt" },
      { label: "חיבור", value: "Wi-Fi 2.4GHz" },
      { label: "ראיית לילה", value: "צבעונית + IR" },
      { label: "אחסון", value: "MicroSD עד 128GB" },
      { label: "מתח", value: "5V DC" }
    ],
    includes: [
      "מצלמת Wi-Fi Pan/Tilt 3MP",
      "כבל USB להספקה",
      "מדריך התקנה",
      "אפליקציה Tapo",
      "אחריות יצרן"
    ]
  },
  "BCAM-02": {
    brand: "Provision-ISR",
    model: "BCAM-02",
    features: [
      "רזולוציה Full HD 1080p",
      "סוללה מובנית - ללא חיווט",
      "חיבור Wi-Fi - התקנה קלה",
      "ראיית לילה IR",
      "גלאי תנועה - התראות חכמות",
      "אפליקציה לנייד - ניהול מרחוק"
    ],
    specs: [
      { label: "רזולוציה", value: "1080p (1920×1080)" },
      { label: "סוללה", value: "מובנית - עד 6 חודשים" },
      { label: "חיבור", value: "Wi-Fi 2.4GHz" },
      { label: "ראיית לילה", value: "IR" },
      { label: "גלאי תנועה", value: "PIR" },
      { label: "עמידות", value: "IP65" }
    ],
    includes: [
      "מצלמת Battery FHD",
      "סוללה מובנית",
      "מדריך התקנה",
      "אפליקציה לנייד",
      "אחריות יצרן"
    ]
  },
  "BCAM-05": {
    brand: "Provision-ISR",
    model: "BCAM-05",
    features: [
      "רזולוציה 4MP - חדות גבוהה",
      "סוללה מובנית - ללא חיווט",
      "חיבור Wi-Fi - התקנה קלה",
      "ראיית לילה IR",
      "גלאי תנועה - התראות חכמות",
      "אפליקציה לנייד - ניהול מרחוק"
    ],
    specs: [
      { label: "רזולוציה", value: "4MP (2560×1440)" },
      { label: "סוללה", value: "מובנית - עד 6 חודשים" },
      { label: "חיבור", value: "Wi-Fi 2.4GHz" },
      { label: "ראיית לילה", value: "IR" },
      { label: "גלאי תנועה", value: "PIR" },
      { label: "עמידות", value: "IP65" }
    ],
    includes: [
      "מצלמת Battery 4MP",
      "סוללה מובנית",
      "מדריך התקנה",
      "אפליקציה לנייד",
      "אחריות יצרן"
    ]
  }
};

export default function ProductPage() {
  const params = useParams();
  const sku = params?.sku as string;
  const [p, setP] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0); // פתוח את הראשונה כברירת מחדל
  const [showContactForm, setShowContactForm] = useState(false);
  
  useEffect(() => {
    if (!sku) return;
    
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try internal API first (fast, no external dependency)
        const res = await fetch(`/api/products/sku/${sku}`, { 
          cache: "no-store"
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.product) {
            setP({
              id: data.product.id,
              sku: data.product.sku,
              name: data.product.name,
              price_regular: data.product.price_regular,
              price_sale: data.product.price_sale,
              currency: data.product.currency || "ILS",
              short_desc: data.product.short_desc || data.product.description || "",
              rating_avg: data.product.rating_avg,
              review_count: data.product.review_count
            });
            setLoading(false);
            return;
          }
        }
        
        // Fallback to static data if API fails
        setP(FALLBACK_PRODUCTS[sku] || null);
      } catch (error) {
        console.error('Error fetching product:', error);
        setP(FALLBACK_PRODUCTS[sku] || null);
        setError('שגיאה בטעינת המוצר');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [sku]);
  
  const handlePurchase = () => {
    if (!p) return;
    
    setPurchasing(true);
    
    // Save product to cart in localStorage before redirecting
    const cartItem = {
      sku: p.sku,
      name: p.name,
      price: p.price_sale || p.price_regular,
      quantity: 1,
    };
    
    // Get existing cart or create new one
    const existingCart = localStorage.getItem("cart");
    let cart: typeof cartItem[] = [];
    
    if (existingCart) {
      try {
        cart = JSON.parse(existingCart);
        // Check if product already exists in cart
        const existingIndex = cart.findIndex(item => item.sku === p.sku);
        if (existingIndex >= 0) {
          // Update quantity if exists
          cart[existingIndex].quantity += 1;
        } else {
          // Add new item
          cart.push(cartItem);
        }
      } catch (e) {
        console.error("Error parsing cart:", e);
        cart = [cartItem];
      }
    } else {
      cart = [cartItem];
    }
    
    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Redirect to checkout with product SKU
    window.location.href = `/checkout?sku=${encodeURIComponent(p.sku)}&quantity=1`;
  };

  if (loading) {
    return (
      <main className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(212,175,55,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-zinc-800 rounded-lg w-1/2"></div>
            <div className="h-4 bg-zinc-800 rounded-lg w-3/4"></div>
            <div className="h-10 bg-zinc-800 rounded-lg w-1/3"></div>
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <div className="h-24 bg-zinc-800 rounded-lg"></div>
              <div className="h-24 bg-zinc-800 rounded-lg"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!p) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center">
          <p className="text-red-400 mb-4">מוצר לא נמצא</p>
          <Link href="/" className="text-gold">← חזרה לעמוד הבית</Link>
        </div>
      </main>
    );
  }

  const details = PRODUCT_DETAILS[sku] || { features: [], specs: [], includes: [] };

  return (
    <main className="relative">
      <ProductJSONLD product={p} />
      {/* רקע גרעיני */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(212,175,55,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
      
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm opacity-70">
          <Link href="/" className="hover:text-gold">עמוד הבית</Link>
          <span className="mx-2">/</span>
          <span>מוצרים</span>
          <span className="mx-2">/</span>
          <span className="text-gold">{p.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <Shield className="text-gold size-8" />
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2">{p.name}</h1>
              {details.brand && (
                <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
                  <span className="text-zinc-400">מותג מצלמה:</span>
                  <span className="text-gold font-semibold">{details.brand}</span>
                  {details.model && (
                    <>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400">דגם:</span>
                      <span className="text-zinc-300 font-mono text-xs sm:text-sm">{details.model}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <p className="text-lg sm:text-xl text-zinc-300 mb-4">{p.short_desc}</p>
          
          {/* סוג מצלמה - בולט */}
          {details.brand && (
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-gold/30">
              <Camera className="text-gold size-4" />
              <span className="text-sm text-zinc-400">מותג מצלמה:</span>
              <span className="text-sm sm:text-base text-gold font-semibold">{details.brand}</span>
              {sku === 'H-01-2TB' && (
                <>
                  <span className="text-zinc-600">•</span>
                  <span className="text-sm text-zinc-400">סוג:</span>
                  <span className="text-sm sm:text-base text-gold font-semibold">IP PoE 4MP (Dome/Bullet)</span>
                </>
              )}
            </div>
          )}
          
          {/* הערה - Aegis Spectra היא החברה */}
          {sku === 'H-01-2TB' && (
            <div className="mb-4 text-xs text-zinc-500 italic">
              * Aegis Spectra הינה החברה המספקת את השירות וההתקנה. המצלמות הן מותג Dahua.
            </div>
          )}
          
          {/* מחיר + דחיפות */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {p.price_sale && p.price_sale !== p.price_regular ? (
                <>
                  <span className="text-3xl sm:text-4xl text-gold font-extrabold">{fmt(p.price_sale)}</span>
                  <span className="text-lg sm:text-xl line-through opacity-60">{fmt(p.price_regular)}</span>
                  <span className="px-3 py-1 bg-burgundy/30 border border-burgundy rounded-full text-xs sm:text-sm text-gold whitespace-nowrap">
                    חיסכון {fmt(p.price_regular - p.price_sale)}
                  </span>
                </>
              ) : (
                <span className="text-3xl sm:text-4xl font-extrabold">{fmt(p.price_regular)}</span>
              )}
            </div>
            
            {/* תגיות דחיפות ואמון */}
            <div className="flex flex-wrap gap-2">
              {sku === 'H-01-2TB' && (
                <>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-full text-xs sm:text-sm text-red-400">
                    <AlertCircle className="size-3.5" />
                    <span>רק 3 יחידות נותרו במלאי!</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold/20 border border-gold/50 rounded-full text-xs sm:text-sm text-gold">
                    <Clock className="size-3.5" />
                    <span>מבצע מסתיים בעוד 48 שעות</span>
                  </div>
                </>
              )}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 border border-green-500/50 rounded-full text-xs sm:text-sm text-green-400">
                <Shield className="size-3.5" />
                <span>אחריות 12 חודשים</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 border border-blue-500/50 rounded-full text-xs sm:text-sm text-blue-400">
                <Truck className="size-3.5" />
                <span>משלוח מהיר 24-48 שעות</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 border border-purple-500/50 rounded-full text-xs sm:text-sm text-purple-400">
                <Lock className="size-3.5" />
                <span>תשלום מאובטח 100%</span>
              </div>
            </div>

            {/* חישוב תשלומים חודשיים */}
            {p.price_sale && (
              <div className="p-4 bg-zinc-900/50 border border-zinc-700 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="size-4 text-gold" />
                  <span className="text-sm font-semibold text-zinc-300">תשלומים נוחים:</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="text-zinc-400">12 תשלומים של</span>
                  <span className="text-lg font-bold text-gold">{fmt(Math.ceil((p.price_sale || p.price_regular) / 12))}</span>
                  <span className="text-zinc-400">או</span>
                  <span className="text-lg font-bold text-gold">{fmt(Math.ceil((p.price_sale || p.price_regular) / 6))}</span>
                  <span className="text-zinc-400">ל-6 תשלומים</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">ללא ריבית, ללא עמלות נסתרות</p>
              </div>
            )}
          </div>

          {/* CTA - משופר */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handlePurchase}
                disabled={purchasing || !p}
                className="flex-1 rounded-xl bg-gradient-to-r from-gold to-yellow-500 text-black px-8 py-5 font-extrabold inline-flex items-center justify-center gap-2 hover:from-gold/90 hover:to-yellow-500/90 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg shadow-gold/30 hover:shadow-gold/50 transform hover:scale-105"
              >
                {purchasing ? (
                  <>
                    <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    מעבר לתשלום...
                  </>
                ) : (
                  <>
                    <CreditCard className="size-5" />
                    רכוש עכשיו - {fmt(p.price_sale || p.price_regular)}
                  </>
                )}
              </button>
              <button
                onClick={() => setShowContactForm(true)}
                className="rounded-xl border-2 border-gold px-6 py-5 inline-flex items-center justify-center gap-2 hover:bg-gold/10 transition font-semibold"
              >
                <Phone className="size-5 text-gold" />
                <span>ייעוץ חינם</span>
              </button>
              <Link 
                href="https://wa.me/972559737025?text=שלום, אני מעוניין במוצר H-01-2TB"
                target="_blank"
                className="rounded-xl border-2 border-green-500 px-6 py-5 inline-flex items-center justify-center gap-2 hover:bg-green-500/10 transition font-semibold"
              >
                <MessageCircle className="size-5 text-green-400" />
                <span className="hidden sm:inline">WhatsApp</span>
              </Link>
            </div>
            
            {/* תגיות אמון מתחת לכפתורים */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Check className="size-4 text-green-400" />
                <span>התקנה מקצועית כלולה</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="size-4 text-green-400" />
                <span>החזר כספי 30 יום</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="size-4 text-green-400" />
                <span>תמיכה טכנית 24/7</span>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* תכונות עיקריות */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Camera className="text-gold" />
            תכונות עיקריות
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {details.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-black/30 p-4">
                <Check className="text-gold size-5 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* מפרט טכני */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <HardDrive className="text-gold" />
            מפרט טכני
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {details.specs.map((spec, i) => (
              <div key={i} className="rounded-xl border border-zinc-800 bg-black/30 p-4">
                <div className="text-xs sm:text-sm opacity-70 mb-1">{spec.label}</div>
                <div className="font-semibold text-gold text-sm sm:text-base">{spec.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* מה כלול */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Smartphone className="text-gold" />
            מה כלול בחבילה
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {details.includes.map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-black/30 p-4">
                <div className="size-2 rounded-full bg-gold" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* תהליך הזמנה */}
        <section className="rounded-2xl border border-zinc-800 bg-black/30 p-8 mb-10">
          <h2 className="text-2xl font-bold mb-4">תהליך הזמנה פשוט</h2>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            {[
              {n: "01", h: "שיחה", p: "נקבע מועד נוח"},
              {n: "02", h: "סקר", p: "סיור באתר ומיפוי"},
              {n: "03", h: "הצעה", p: "תרשים + מחיר שקוף"},
              {n: "04", h: "התקנה", p: "ביצוע נקי ומדויק"},
            ].map((s,i)=>(
              <div key={i} className="text-center">
                <div className="text-gold font-extrabold text-2xl mb-2">{s.n}</div>
                <div className="font-semibold mb-1">{s.h}</div>
                <p className="opacity-70 text-xs">{s.p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* למה לבחור במוצר הזה - רק ל-H-01-2TB */}
        {sku === 'H-01-2TB' && (
          <section className="mb-10 rounded-2xl border border-gold/30 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="text-gold" />
              למה לבחור במערכת H-01-2TB?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-4xl font-extrabold text-gold mb-2">500+</div>
                <div className="text-zinc-300">לקוחות מרוצים</div>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl font-extrabold text-gold mb-2">4.8/5</div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1,2,3,4,5].map(i => <Star key={i} className="size-4 fill-gold text-gold" />)}
                </div>
                <div className="text-zinc-300">דירוג ממוצע</div>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl font-extrabold text-gold mb-2">24/7</div>
                <div className="text-zinc-300">תמיכה טכנית</div>
              </div>
            </div>
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-zinc-900/30 rounded-xl">
                <Check className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">התקנה מקצועית כלולה</div>
                  <div className="text-sm text-zinc-400">טכנאי מקצועי מגיע אליך ומתקין הכל תוך 2-4 שעות</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-zinc-900/30 rounded-xl">
                <Check className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">אפליקציה בעברית</div>
                  <div className="text-sm text-zinc-400">ניהול מלא מהנייד - צפייה, הקלטה, התראות בעברית</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-zinc-900/30 rounded-xl">
                <Check className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">אחריות מלאה 12 חודשים</div>
                  <div className="text-sm text-zinc-400">כיסוי מלא על כל הציוד וההתקנה</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-zinc-900/30 rounded-xl">
                <Check className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-1">החזר כספי 30 יום</div>
                  <div className="text-sm text-zinc-400">לא מרוצה? נחזיר לך את כל הכסף ללא שאלות</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ביקורות ודירוגים */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Star className="text-gold" />
                <span>ביקורות ודירוגים</span>
              </h2>
              {p.rating_avg && (
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 rounded-full border border-gold/30">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Star 
                        key={i} 
                        className={`size-4 ${i <= Math.round(p.rating_avg!) ? 'fill-gold text-gold' : 'text-zinc-600'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-gold font-bold">{p.rating_avg.toFixed(1)}</span>
                  <span className="text-zinc-400">({p.review_count || 0} ביקורות)</span>
                </div>
              )}
            </div>
            {!showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
              >
                כתוב ביקורה
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="mb-6">
              <ReviewForm
                productId={p.id}
                sku={p.sku}
                onSuccess={() => {
                  setShowReviewForm(false);
                  // Refresh reviews will happen automatically in ReviewList
                }}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}

          <ReviewList
            productId={p.id}
            sku={p.sku}
            limit={10}
            showFilters={true}
          />
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <HelpCircle className="text-gold" />
            שאלות נפוצות
          </h2>
          
          <div className="space-y-3">
            {[
              {
                q: "מה כלול במחיר?",
                a: "המחיר כולל את כל הציוד (2 מצלמות 4MP PoE, NVR עם 2TB, כבלים), התקנה מקצועית, הדרכה אישית, ואחריות 12 חודשים. אין עמלות נסתרות."
              },
              {
                q: "כמה זמן לוקחת ההתקנה?",
                a: "התקנה סטנדרטית לוקחת 2-4 שעות. אנו מתקינים בימים א'-ה' בשעות הנוחות לך, בדרך כלל תוך 24-48 שעות מהזמנה."
              },
              {
                q: "האם צריך חיווט מיוחד?",
                a: "המערכת משתמשת ב-PoE (Power over Ethernet), כך שצריך רק כבל Ethernet אחד לכל מצלמה. אין צורך בחיווט חשמל נפרד."
              },
              {
                q: "איך אני יכול לצפות בהקלטות?",
                a: "ניתן לצפות בהקלטות דרך אפליקציה בעברית לנייד (iOS/Android) או דרך דפדפן במחשב. כל ההקלטות נשמרות ב-NVR המקומי."
              },
              {
                q: "מה קורה אם יש בעיה טכנית?",
                a: "אנו מספקים תמיכה טכנית 24/7. במקרה של בעיה, נגיע אליך תוך 24 שעות (באזורים מרכזיים) או נספק תמיכה מרחוק."
              },
              {
                q: "האם יש אפשרות להחזר כספי?",
                a: "כן! יש לנו מדיניות החזר כספי 30 יום. אם אינך מרוצה מהמוצר, נחזיר לך את כל הכסף ללא שאלות."
              }
            ].map((faq, i) => {
              const isOpen = openFAQIndex === i;
              return (
                <div key={i} className="border border-zinc-800 rounded-xl bg-black/30 overflow-hidden">
                  <button
                    onClick={() => setOpenFAQIndex(isOpen ? null : i)}
                    className="w-full p-4 text-right flex items-center justify-between hover:bg-zinc-900/50 transition"
                  >
                    <span className="font-semibold text-zinc-200">{faq.q}</span>
                    <ArrowRight className={`size-5 text-gold transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-zinc-400 text-sm leading-relaxed border-t border-zinc-800 animate-in slide-in-from-top-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* טופס יצירת קשר */}
        {showContactForm && (
          <section className="mb-10 fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">ייעוץ חינם</h3>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const name = formData.get('name');
                  const phone = formData.get('phone');
                  const message = formData.get('message');
                  
                  // Redirect to WhatsApp with pre-filled message
                  const whatsappMessage = `שלום, אני ${name} (${phone}).\nאני מעוניין במוצר: ${p.name}\n${message ? `\nהודעה: ${message}` : ''}`;
                  window.open(`https://wa.me/972559737025?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
                  setShowContactForm(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">שם מלא</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">טלפון</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">הודעה (אופציונלי)</label>
                  <textarea
                    name="message"
                    rows={3}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
                    placeholder="שאלות או הערות..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold text-black py-3 rounded-lg font-bold hover:bg-gold/90 transition"
                >
                  שלח דרך WhatsApp
                </button>
              </form>
            </div>
          </section>
        )}

        {/* המלצות מוצרים */}
        <section className="mb-10">
          <ProductRecommendations
            productId={p.id}
            sku={p.sku}
            type="related"
            limit={4}
            showTitle={true}
          />
        </section>

        {/* CTA אחרון */}
        <div className="rounded-2xl border border-gold/50 bg-black/30 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">מוכן להתחיל?</h2>
          <p className="opacity-80 mb-6">הזמינו ייעוץ חינם וקבלו הצעת מחיר תוך 24 שעות</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/quote" 
              className="inline-flex rounded-xl bg-gold text-black px-8 py-3 font-semibold hover:bg-gold/90 transition"
            >
              קבל הצעת מחיר
            </Link>
            <Link 
              href="/#contact" 
              className="inline-flex rounded-xl border-2 border-zinc-600 px-8 py-3 font-semibold hover:bg-zinc-800/50 transition"
            >
              צור קשר
            </Link>
          </div>
        </div>
      </div>

      {/* כפתור WhatsApp צף */}
      <Link
        href={`https://wa.me/972559737025?text=${encodeURIComponent(`שלום, אני מעוניין במוצר: ${p.name} (${p.sku})`)}`}
        target="_blank"
        className="fixed bottom-6 left-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 animate-pulse"
        aria-label="צור קשר ב-WhatsApp"
      >
        <MessageCircle className="size-6" />
      </Link>
    </main>
  );
}
