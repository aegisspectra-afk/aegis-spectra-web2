'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShoppingCart, 
  Monitor, 
  Shield, 
  Camera, 
  HardDrive, 
  Wifi, 
  Zap,
  Users,
  Settings,
  CreditCard,
  Calculator,
  Grid3X3,
  Server,
  AlertTriangle,
  Battery,
  Network,
  Home,
  Building,
  Activity,
  Hash,
  Bell,
  ChevronDown,
  X
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { fmtIls } from '@/utils/currency';
import { useCart } from '@/contexts/cart-context';
import { toast } from 'sonner';
import { CartDebug } from '@/components/debug/cart-debug';

interface Package {
  id: string;
  name: string;
  code: string;
  priceIls: number;        // one-time
  description: string;
  features: string[];
  limits?: {
    cameras?: number;
    users?: number;
    storage?: string;
  };
}

interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  equipmentIls: number;
  installIls: number;
  finalIls: number;
  features: string[];
  image: string;
}

interface CartItem {
  id: string;
  kind: 'package' | 'hardware' | 'bundle';
  refId: string;
  title: string;
  unitPrice: number;
  quantity: number;
  oneTime: boolean;
}

const packages: Package[] = [
  {
    id: 'home-cam',
    name: 'Home Cam',
    code: 'home-cam',
    priceIls: 1990,
    description: 'חבילת מצלמות לבית - 2 מצלמות IP 4MP + NVR + דיסק 1TB',
    features: ['2 מצלמות IP 4MP', 'NVR 4 ערוצים', 'דיסק 1TB', 'אפליקציה בעברית', 'אחריות 12 חודשים', 'התקנה מקצועית'],
    limits: { cameras: 2, users: 1, storage: '1TB' }
  },
  {
    id: 'business-cam',
    name: 'Business Cam',
    code: 'business-cam',
    priceIls: 3490,
    description: 'חבילת מצלמות לעסק - 4 מצלמות IP 4MP + NVR + דיסק 2TB',
    features: ['4 מצלמות IP 4MP', 'NVR 8 ערוצים', 'דיסק 2TB', 'אפליקציה בעברית', 'הדרכה מקצועית', 'אחריות 12 חודשים'],
    limits: { cameras: 4, users: 5, storage: '2TB' }
  },
  {
    id: 'secure-entry',
    name: 'Secure Entry',
    code: 'secure-entry',
    priceIls: 1890,
    description: 'מערכת כניסה מאובטחת - קודן RFID + מנעול מגנטי',
    features: ['קודן RFID', 'מנעול מגנטי 280kg', 'ספק כוח', 'לחצן יציאה', 'Door Closer', 'תכנות משתמשים'],
    limits: { cameras: 0, users: 10, storage: 'N/A' }
  },
  {
    id: 'alarm-basic',
    name: 'Alarm Basic',
    code: 'alarm-basic',
    priceIls: 1290,
    description: 'מערכת אזעקה אלחוטית בסיסית',
    features: ['לוח בקרה אלחוטי', 'חיישני תנועה', 'חיישני דלת/חלון', 'סירנה חיצונית', 'אפליקציה לנייד', 'אחריות 12 חודשים'],
    limits: { cameras: 0, users: 1, storage: 'N/A' }
  }
];

const products: Product[] = [
  // חבילות התקנה
  {
    id: 'home-cam-package',
    title: 'חבילת Home Cam',
    category: 'packages',
    description: '2 מצלמות IP 4MP + NVR + דיסק 1TB + התקנה',
    equipmentIls: 1990,
    installIls: 0,
    finalIls: 1990,
    features: ['2 מצלמות IP 4MP', 'NVR 4 ערוצים', 'דיסק 1TB', 'אפליקציה בעברית', 'התקנה מקצועית', 'אחריות 12 חודשים'],
    image: 'camera'
  },
  {
    id: 'business-cam-package',
    title: 'חבילת Business Cam',
    category: 'packages',
    description: '4 מצלמות IP 4MP + NVR + דיסק 2TB + התקנה',
    equipmentIls: 3490,
    installIls: 0,
    finalIls: 3490,
    features: ['4 מצלמות IP 4MP', 'NVR 8 ערוצים', 'דיסק 2TB', 'אפליקציה בעברית', 'הדרכה מקצועית', 'אחריות 12 חודשים'],
    image: 'camera'
  },
  {
    id: 'secure-entry-package',
    title: 'חבילת Secure Entry',
    category: 'packages',
    description: 'קודן RFID + מנעול מגנטי + התקנה מלאה',
    equipmentIls: 2290,
    installIls: 0,
    finalIls: 2290,
    features: ['קודן RFID', 'מנעול מגנטי 280kg', 'ספק כוח', 'לחצן יציאה', 'Door Closer', 'תכנות משתמשים'],
    image: 'shield'
  },
  {
    id: 'alarm-basic-package',
    title: 'חבילת Alarm Basic',
    category: 'packages',
    description: 'מערכת אזעקה אלחוטית + התקנה',
    equipmentIls: 2490,
    installIls: 0,
    finalIls: 2490,
    features: ['לוח בקרה אלחוטי', 'חיישני תנועה', 'חיישני דלת/חלון', 'סירנה חיצונית', 'אפליקציה לנייד', 'אחריות 12 חודשים'],
    image: 'alert'
  },

  // מצלמות IP
  {
    id: 'ip-camera-2mp',
    title: 'מצלמת IP 2MP',
    category: 'cameras',
    description: 'מצלמת רשת בסיסית עם ראיית לילה IR',
    equipmentIls: 300,
    installIls: 0,
    finalIls: 300,
    features: ['רזולוציה 2MP', 'ראיית לילה IR', 'PoE', 'אפליקציה לנייד', 'התקנה מקצועית'],
    image: 'camera'
  },
  {
    id: 'ip-camera-4mp',
    title: 'מצלמת IP 4MP',
    category: 'cameras',
    description: 'איכות בינונית + זיהוי תנועה',
    equipmentIls: 475,
    installIls: 0,
    finalIls: 475,
    features: ['רזולוציה 4MP', 'זיהוי תנועה', 'PoE', 'אפליקציה לנייד', 'התקנה מקצועית'],
    image: 'camera'
  },
  {
    id: 'ip-camera-8mp',
    title: 'מצלמת IP 8MP (4K)',
    category: 'cameras',
    description: 'חדות גבוהה מאוד + WDR',
    equipmentIls: 775,
    installIls: 0,
    finalIls: 775,
    features: ['רזולוציה 4K', 'WDR', 'PoE', 'אפליקציה לנייד', 'התקנה מקצועית'],
    image: 'camera'
  },
  {
    id: 'dome-camera-mini',
    title: 'Dome Camera Mini',
    category: 'cameras',
    description: 'קומפקטית – למשרדים, מסדרונות',
    equipmentIls: 355,
    installIls: 0,
    finalIls: 355,
    features: ['עיצוב קומפקטי', 'התקנה פנימית', 'PoE', 'אפליקציה לנייד', 'התקנה מקצועית'],
    image: 'camera'
  },
  {
    id: 'bullet-camera-outdoor',
    title: 'Bullet Camera Outdoor',
    category: 'cameras',
    description: 'עמידה למים IP67 + IR 50m',
    equipmentIls: 525,
    installIls: 0,
    finalIls: 525,
    features: ['עמידות IP67', 'IR 50 מטר', 'התקנה חיצונית', 'PoE', 'התקנה מקצועית'],
    image: 'camera'
  },
  {
    id: 'ptz-camera',
    title: 'PTZ Camera 20× Zoom',
    category: 'cameras',
    description: 'סיבוב 360°, Auto-Tracking',
    equipmentIls: 2100,
    installIls: 0,
    finalIls: 2100,
    features: ['זום 20×', 'סיבוב 360°', 'Auto-Tracking', 'PoE', 'התקנה מקצועית'],
    image: 'camera'
  },
  {
    id: 'wifi-camera-cloud',
    title: 'Wi-Fi Camera Cloud',
    category: 'cameras',
    description: 'מצלמה אלחוטית עם אפליקציה',
    equipmentIls: 399,
    installIls: 0,
    finalIls: 399,
    features: ['Wi-Fi אלחוטי', 'אחסון בענן', 'אפליקציה לנייד', 'התקנה קלה', 'התקנה מקצועית'],
    image: 'camera'
  },
  {
    id: 'thermal-camera',
    title: 'Thermal Camera',
    category: 'cameras',
    description: 'חיישן IR לזיהוי חום / אש',
    equipmentIls: 3200,
    installIls: 0,
    finalIls: 3200,
    features: ['זיהוי חום', 'זיהוי אש', 'ראייה תרמית', 'PoE', 'התקנה מקצועית'],
    image: 'camera'
  },

  // NVR/DVR/אחסון
  {
    id: 'nvr-4ch-poe',
    title: 'NVR 4ch PoE',
    category: 'storage',
    description: 'עד 4 מצלמות IP',
    equipmentIls: 699,
    installIls: 0,
    finalIls: 699,
    features: ['4 ערוצי PoE', 'תמיכה ב-4K', 'אפליקציה לנייד', 'אחסון עד 6TB', 'הקלטה רציפה 24/7'],
    image: 'server'
  },
  {
    id: 'nvr-8ch-poe',
    title: 'NVR 8ch PoE',
    category: 'storage',
    description: 'עד 8 מצלמות IP',
    equipmentIls: 1045,
    installIls: 0,
    finalIls: 1045,
    features: ['8 ערוצי PoE', 'תמיכה ב-4K', 'אפליקציה לנייד', 'אחסון עד 12TB', 'הקלטה רציפה 24/7'],
    image: 'server'
  },
  {
    id: 'nvr-16ch-smart',
    title: 'NVR 16ch Smart 4K',
    category: 'storage',
    description: 'AI Analytics + Onvif',
    equipmentIls: 1695,
    installIls: 0,
    finalIls: 1695,
    features: ['16 ערוצים', 'AI Analytics', 'Onvif', 'אחסון עד 24TB', 'התקנה מקצועית'],
    image: 'server'
  },
  {
    id: 'hdd-1tb-surveillance',
    title: 'HDD 1TB Surveillance',
    category: 'storage',
    description: 'דיסק Purple/WD Skyhawk',
    equipmentIls: 570,
    installIls: 0,
    finalIls: 570,
    features: ['1TB אחסון', 'Purple/Skyhawk', 'הקלטה רציפה', 'אחריות 3 שנים', 'התקנה מקצועית'],
    image: 'server'
  },
  {
    id: 'hdd-4tb-surveillance',
    title: 'HDD 4TB Surveillance',
    category: 'storage',
    description: 'דיסק Purple/WD Skyhawk',
    equipmentIls: 570,
    installIls: 0,
    finalIls: 570,
    features: ['4TB אחסון', 'Purple/Skyhawk', 'הקלטה רציפה', 'אחריות 3 שנים', 'התקנה מקצועית'],
    image: 'server'
  },

  // בקרת כניסה
  {
    id: 'rfid-keypad',
    title: 'RFID Keypad',
    category: 'access',
    description: 'פתיחה בכרטיס/קוד',
    equipmentIls: 399,
    installIls: 0,
    finalIls: 399,
    features: ['פתיחה בכרטיס RFID', 'פתיחה בקוד מספרי', 'עד 1000 כרטיסים', 'עד 100 קודים', 'התקנה קלה'],
    image: 'keypad'
  },
  {
    id: 'fingerprint-keypad',
    title: 'Fingerprint Keypad',
    category: 'access',
    description: 'סורק טביעת אצבע',
    equipmentIls: 790,
    installIls: 0,
    finalIls: 790,
    features: ['זיהוי טביעת אצבע', 'עד 1000 טביעות', 'פתיחה בקוד', 'עמידות IP65', 'התקנה מקצועית'],
    image: 'keypad'
  },
  {
    id: 'face-recognition-terminal',
    title: 'Face Recognition Terminal',
    category: 'access',
    description: 'פתיחה בזיהוי פנים',
    equipmentIls: 2700,
    installIls: 0,
    finalIls: 2700,
    features: ['זיהוי פנים', 'עד 1000 פנים', 'פתיחה בקוד', 'עמידות IP65', 'התקנה מקצועית'],
    image: 'keypad'
  },
  {
    id: 'magnetic-lock-280kg',
    title: 'Magnetic Lock 280kg',
    category: 'access',
    description: 'לדלתות סטנדרטיות',
    equipmentIls: 320,
    installIls: 0,
    finalIls: 320,
    features: ['כוח 280kg', 'דלתות סטנדרטיות', '12V DC', 'התקנה קלה', 'אחריות 2 שנים'],
    image: 'shield'
  },
  {
    id: 'magnetic-lock-500kg',
    title: 'Magnetic Lock 500kg',
    category: 'access',
    description: 'לדלתות כבדות',
    equipmentIls: 550,
    installIls: 0,
    finalIls: 550,
    features: ['כוח 500kg', 'דלתות כבדות', '12V DC', 'התקנה מקצועית', 'אחריות 2 שנים'],
    image: 'shield'
  },

  // אזעקות וחיישנים
  {
    id: 'wireless-alarm-kit',
    title: 'Wireless Alarm Kit',
    category: 'alarm',
    description: 'אזעקה + 2 חיישנים + שלטים',
    equipmentIls: 1240,
    installIls: 0,
    finalIls: 1240,
    features: ['לוח בקרה אלחוטי', '2 חיישני תנועה', 'שלטים', 'אפליקציה לנייד', 'התקנה מקצועית'],
    image: 'alert'
  },
  {
    id: 'smart-alarm-ajax',
    title: 'Smart Alarm (Ajax Style)',
    category: 'alarm',
    description: 'ניהול מהנייד + חיישני חלון',
    equipmentIls: 2140,
    installIls: 0,
    finalIls: 2140,
    features: ['ניהול מהנייד', 'חיישני חלון', 'אפליקציה מתקדמת', 'התקנה מקצועית', 'אחריות 2 שנים'],
    image: 'alert'
  },
  {
    id: 'pir-motion-sensor',
    title: 'PIR Motion Sensor',
    category: 'alarm',
    description: 'חיישן תנועה אלחוטי',
    equipmentIls: 240,
    installIls: 0,
    finalIls: 240,
    features: ['חיישן תנועה PIR', 'אלחוטי', 'עמידות IP65', 'התקנה קלה', 'אחריות 2 שנים'],
    image: 'sensor'
  },
  {
    id: 'dual-tech-sensor',
    title: 'Dual Tech Sensor',
    category: 'alarm',
    description: 'מיקרוגל + IR נגד אזעקות שווא',
    equipmentIls: 355,
    installIls: 0,
    finalIls: 355,
    features: ['מיקרוגל + IR', 'נגד אזעקות שווא', 'אלחוטי', 'התקנה מקצועית', 'אחריות 2 שנים'],
    image: 'sensor'
  },
  {
    id: 'door-window-sensor',
    title: 'Door/Window Sensor',
    category: 'alarm',
    description: 'חיישן פתיחה',
    equipmentIls: 124,
    installIls: 0,
    finalIls: 124,
    features: ['חיישן פתיחה', 'אלחוטי', 'התקנה קלה', 'עמידות IP65', 'אחריות 2 שנים'],
    image: 'sensor'
  },
  {
    id: 'smoke-detector',
    title: 'Smoke Detector',
    category: 'alarm',
    description: 'גלאי עשן אלחוטי',
    equipmentIls: 199,
    installIls: 0,
    finalIls: 199,
    features: ['גלאי עשן', 'אלחוטי', 'התקנה קלה', 'אחריות 2 שנים', 'תחזוקה שנתית'],
    image: 'sensor'
  },
  {
    id: 'gas-detector',
    title: 'Gas Detector',
    category: 'alarm',
    description: 'חיישן דליפת גז',
    equipmentIls: 249,
    installIls: 0,
    finalIls: 249,
    features: ['חיישן גז', 'אלחוטי', 'התקנה מקצועית', 'אחריות 2 שנים', 'תחזוקה שנתית'],
    image: 'sensor'
  },
  {
    id: 'siren-indoor-outdoor',
    title: 'Siren Indoor/Outdoor',
    category: 'alarm',
    description: 'סירנה פנימית/חיצונית',
    equipmentIls: 270,
    installIls: 0,
    finalIls: 270,
    features: ['סירנה חזקה', 'פנימית/חיצונית', 'אלחוטי', 'התקנה מקצועית', 'אחריות 2 שנים'],
    image: 'alert'
  },
  {
    id: 'panic-button',
    title: 'Panic Button',
    category: 'alarm',
    description: 'לחצן חירום',
    equipmentIls: 119,
    installIls: 0,
    finalIls: 119,
    features: ['לחצן חירום', 'אלחוטי', 'התקנה קלה', 'אחריות 2 שנים', 'תחזוקה שנתית'],
    image: 'alert'
  },

  // רשתות וחשמל
  {
    id: 'ethernet-cable-cat6',
    title: 'Ethernet Cable Cat6 (1-100m)',
    category: 'networking',
    description: 'כבל תקשורת - מחיר לפי מטר',
    equipmentIls: 2,
    installIls: 0,
    finalIls: 2,
    features: ['כבל Cat6', '1-100 מטר', 'מחיר מדורג', 'איכות גבוהה', 'התקנה מקצועית', 'אחריות 2 שנים'],
    image: 'network'
  },
  {
    id: 'power-cable-2x075',
    title: 'Power Cable 2×0.75 (50m)',
    category: 'networking',
    description: 'כבל מתח',
    equipmentIls: 119,
    installIls: 0,
    finalIls: 119,
    features: ['כבל מתח 2×0.75', '50 מטר', 'איכות גבוהה', 'התקנה מקצועית', 'אחריות 2 שנים'],
    image: 'network'
  },
  {
    id: 'poe-switch-4-8-16',
    title: 'PoE Switch 4/8/16 Ports',
    category: 'networking',
    description: 'מתג רשת עם אספקת חשמל - מחיר לפי פורטים',
    equipmentIls: 299,
    installIls: 0,
    finalIls: 299,
    features: ['4/8/16 פורטים', 'PoE+ עד 30W', 'ניהול מתקדם', 'איכות תעשייתית', 'התקנה מקצועית', 'אחריות 2 שנים'],
    image: 'network'
  },
  {
    id: 'nvr-4-8-16-channels',
    title: 'NVR Recorder 4/8/16 Channels',
    category: 'nvr-storage',
    description: 'מקליט וידאו רשת מתקדם',
    equipmentIls: 599,
    installIls: 0,
    finalIls: 599,
    features: ['4/8/16 ערוצים', 'הקלטה 4K', 'אחסון עד 6TB', 'אפליקציה לנייד', 'הקלטה רציפה 24/7'],
    image: 'storage'
  },
  {
    id: 'camera-bullet-varifocal',
    title: 'מצלמת Bullet Varifocal',
    category: 'cameras',
    description: 'מצלמת אבטחה עם זום אופטי',
    equipmentIls: 450,
    installIls: 0,
    finalIls: 450,
    features: ['זום אופטי מתכוונן', 'ראיית לילה IR', 'רזולוציה 4MP', 'עמידות IP67', 'התקנה מקצועית'],
    image: 'camera'
  },
  {
    id: 'poe-injector',
    title: 'PoE Injector',
    category: 'networking',
    description: 'הזנת PoE למצלמה בודדת',
    equipmentIls: 109,
    installIls: 0,
    finalIls: 109,
    features: ['הזנת PoE', 'מצלמה בודדת', 'התקנה קלה', 'אחריות 2 שנים', 'תחזוקה שנתית'],
    image: 'network'
  },
  {
    id: 'poe-splitter',
    title: 'Splitter PoE',
    category: 'networking',
    description: 'פיצול נתונים/חשמל',
    equipmentIls: 94,
    installIls: 0,
    finalIls: 94,
    features: ['פיצול PoE', 'נתונים/חשמל', 'התקנה קלה', 'אחריות 2 שנים', 'תחזוקה שנתית'],
    image: 'network'
  },

  // כלי עבודה
  {
    id: 'crimping-tool-rj45',
    title: 'Crimping Tool RJ45',
    category: 'tools',
    description: 'לחיצה לכבלי רשת',
    equipmentIls: 144,
    installIls: 0,
    finalIls: 144,
    features: ['כלי לחיצה RJ45', 'איכות מקצועית', 'אחריות 2 שנים', 'תחזוקה שנתית', 'הדרכה'],
    image: 'network'
  },
  {
    id: 'wire-stripper',
    title: 'Wire Stripper',
    category: 'tools',
    description: 'קליבת קילוף',
    equipmentIls: 74,
    installIls: 0,
    finalIls: 74,
    features: ['כלי קילוף', 'איכות מקצועית', 'אחריות 2 שנים', 'תחזוקה שנתית', 'הדרכה'],
    image: 'network'
  },
  {
    id: 'cable-tester-rj45',
    title: 'Cable Tester RJ45/RJ11',
    category: 'tools',
    description: 'בודק כבלים',
    equipmentIls: 124,
    installIls: 0,
    finalIls: 124,
    features: ['בודק RJ45/RJ11', 'איכות מקצועית', 'אחריות 2 שנים', 'תחזוקה שנתית', 'הדרכה'],
    image: 'network'
  },
  {
    id: 'poe-tester',
    title: 'PoE Tester',
    category: 'tools',
    description: 'בודק מתח PoE',
    equipmentIls: 224,
    installIls: 0,
    finalIls: 224,
    features: ['בודק PoE', 'איכות מקצועית', 'אחריות 2 שנים', 'תחזוקה שנתית', 'הדרכה'],
    image: 'network'
  },
  {
    id: 'drill-bits-set',
    title: 'Drill Bits Set',
    category: 'tools',
    description: 'מקדחים לברזל וקיר',
    equipmentIls: 104,
    installIls: 0,
    finalIls: 104,
    features: ['מקדחים לברזל', 'מקדחים לקיר', 'איכות מקצועית', 'אחריות 2 שנים', 'הדרכה'],
    image: 'network'
  },
  {
    id: 'level-laser',
    title: 'Level Laser',
    category: 'tools',
    description: 'פילוס מדויק להתקנה',
    equipmentIls: 295,
    installIls: 0,
    finalIls: 295,
    features: ['פילוס מדויק', 'לייזר', 'איכות מקצועית', 'אחריות 2 שנים', 'הדרכה'],
    image: 'network'
  },

  // חשמל וגיבוי
  {
    id: 'ups-650-1500va',
    title: 'UPS 650-1500 VA',
    category: 'power',
    description: 'גיבוי חשמל למערכות',
    equipmentIls: 690,
    installIls: 0,
    finalIls: 690,
    features: ['650-1500 VA', 'גיבוי חשמל', 'התקנה מקצועית', 'אחריות 2 שנים', 'תחזוקה שנתית'],
    image: 'battery'
  },
  {
    id: 'power-bank-12v',
    title: 'Power Bank 12V',
    category: 'power',
    description: 'גיבוי נייד למצלמות',
    equipmentIls: 370,
    installIls: 0,
    finalIls: 370,
    features: ['גיבוי נייד', '12V', 'למצלמות', 'התקנה מקצועית', 'אחריות 2 שנים'],
    image: 'battery'
  },
  {
    id: 'battery-12v-7ah',
    title: 'Battery 12V 7Ah',
    category: 'power',
    description: 'סוללה ל-UPS / אזעקה',
    equipmentIls: 199,
    installIls: 0,
    finalIls: 199,
    features: ['12V 7Ah', 'ל-UPS/אזעקה', 'התקנה מקצועית', 'אחריות 2 שנים', 'תחזוקה שנתית'],
    image: 'battery'
  },
  {
    id: 'solar-camera-panel',
    title: 'Solar Camera Panel',
    category: 'power',
    description: 'פאנל סולארי למצלמות',
    equipmentIls: 270,
    installIls: 0,
    finalIls: 270,
    features: ['פאנל סולארי', 'למצלמות', 'התקנה מקצועית', 'אחריות 2 שנים', 'תחזוקה שנתית'],
    image: 'battery'
  },
  {
    id: 'voltage-converter-24-12v',
    title: 'Voltage Converter 24→12V',
    category: 'power',
    description: 'ממיר מתח רכב',
    equipmentIls: 124,
    installIls: 0,
    finalIls: 124,
    features: ['ממיר 24→12V', 'מתח רכב', 'התקנה מקצועית', 'אחריות 2 שנים', 'תחזוקה שנתית'],
    image: 'battery'
  },

  // תחזוקה ואביזרים
  {
    id: 'cleaning-spray-optics',
    title: 'Cleaning Spray Optics',
    category: 'maintenance',
    description: 'ניקוי עדשות מצלמה',
    equipmentIls: 44,
    installIls: 0,
    finalIls: 44,
    features: ['ניקוי עדשות', 'למצלמות', 'איכות מקצועית', 'אחריות 2 שנים', 'תחזוקה שנתית'],
    image: 'network'
  },
  {
    id: 'waterproof-seal-kit',
    title: 'Waterproof Seal Kit',
    category: 'maintenance',
    description: 'ערכת אטימה',
    equipmentIls: 64,
    installIls: 0,
    finalIls: 64,
    features: ['ערכת אטימה', 'איכות מקצועית', 'אחריות 2 שנים', 'תחזוקה שנתית', 'הדרכה'],
    image: 'network'
  },
  {
    id: 'cable-clips-100',
    title: 'Cable Clips ×100',
    category: 'maintenance',
    description: 'מהדקים לכבלים',
    equipmentIls: 29,
    installIls: 0,
    finalIls: 29,
    features: ['מהדקים לכבלים', '100 יחידות', 'איכות מקצועית', 'אחריות 2 שנים', 'תחזוקה שנתית'],
    image: 'network'
  },
  {
    id: 'zip-ties-100',
    title: 'Zip Ties ×100',
    category: 'maintenance',
    description: 'אזיקונים',
    equipmentIls: 22,
    installIls: 0,
    finalIls: 22,
    features: ['אזיקונים', '100 יחידות', 'איכות מקצועית', 'אחריות 2 שנים', 'תחזוקה שנתית'],
    image: 'network'
  },
  {
    id: 'network-label-stickers',
    title: 'Network Label Stickers',
    category: 'maintenance',
    description: 'תוויות מספרים',
    equipmentIls: 29,
    installIls: 0,
    finalIls: 29,
    features: ['תוויות מספרים', 'איכות מקצועית', 'אחריות 2 שנים', 'תחזוקה שנתית', 'הדרכה'],
    image: 'network'
  },

  // בית חכם
  {
    id: 'smart-plug-wifi',
    title: 'Smart Plug Wi-Fi',
    category: 'smart',
    description: 'שליטה בחשמל מהנייד',
    equipmentIls: 164,
    installIls: 0,
    finalIls: 164,
    features: ['שליטה בחשמל', 'Wi-Fi', 'אפליקציה לנייד', 'התקנה קלה', 'אחריות 2 שנים'],
    image: 'home'
  },
  {
    id: 'smart-light-bulb',
    title: 'Smart Light Bulb',
    category: 'smart',
    description: 'נורת Wi-Fi מתכווננת',
    equipmentIls: 114,
    installIls: 0,
    finalIls: 114,
    features: ['נורת Wi-Fi', 'מתכווננת', 'אפליקציה לנייד', 'התקנה קלה', 'אחריות 2 שנים'],
    image: 'home'
  },
  {
    id: 'smart-relay-module',
    title: 'Smart Relay Module',
    category: 'smart',
    description: 'שליטה על שערים / דלתות',
    equipmentIls: 224,
    installIls: 0,
    finalIls: 224,
    features: ['שליטה על שערים', 'שליטה על דלתות', 'Wi-Fi', 'התקנה מקצועית', 'אחריות 2 שנים'],
    image: 'home'
  },
  {
    id: 'gateway-hub-spectra',
    title: 'Gateway Hub Spectra',
    category: 'smart',
    description: 'רכזת שליטה מרחוק',
    equipmentIls: 695,
    installIls: 0,
    finalIls: 695,
    features: ['רכזת שליטה', 'מרחוק', 'Wi-Fi', 'התקנה מקצועית', 'אחריות 2 שנים'],
    image: 'home'
  },

  // שירותים
  {
    id: 'installation-service',
    title: 'התקנה בשטח',
    category: 'services',
    description: 'טכנאי מוסמך עד 5 מכשירים',
    equipmentIls: 549,
    installIls: 0,
    finalIls: 549,
    features: ['טכנאי מוסמך', 'עד 5 מכשירים', 'התקנה מקצועית', 'אחריות 2 שנים', 'תחזוקה שנתית'],
    image: 'building'
  },
  {
    id: 'warranty-extension',
    title: 'הרחבת אחריות שנתית',
    category: 'services',
    description: 'הארכת שירות ותמיכה',
    equipmentIls: 249,
    installIls: 0,
    finalIls: 249,
    features: ['הרחבת אחריות', 'שירות ותמיכה', 'תחזוקה שנתית', 'אחריות 2 שנים', 'הדרכה'],
    image: 'building'
  },
  {
    id: 'online-support-zoom',
    title: 'תמיכה און-ליין (Zoom)',
    category: 'services',
    description: 'פתרון בעיות מרחוק',
    equipmentIls: 0,
    installIls: 0,
    finalIls: 0,
    features: ['תמיכה און-ליין', 'Zoom', 'פתרון בעיות', 'מרחוק', 'תיאום'],
    image: 'building'
  },
  {
    id: 'system-configuration',
    title: 'הגדרת מערכת חדשה',
    category: 'services',
    description: 'קונפיגורציה מלאה',
    equipmentIls: 199,
    installIls: 0,
    finalIls: 199,
    features: ['הגדרת מערכת', 'קונפיגורציה מלאה', 'התקנה מקצועית', 'אחריות 2 שנים', 'הדרכה'],
    image: 'building'
  }
];

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'camera': return Camera;
    case 'server': return Server;
    case 'shield': return Shield;
    case 'alert': return AlertTriangle;
    case 'battery': return Battery;
    case 'network': return Network;
    case 'home': return Home;
    case 'building': return Building;
    case 'sensor': return Activity;
    case 'keypad': return Hash;
    case 'doorbell': return Bell;
    case 'grid': return Grid3X3;
    default: return Monitor;
  }
};

const categories = [
  { id: 'all', name: 'כל המוצרים', icon: 'grid' },
  { id: 'packages', name: 'חבילות התקנה', icon: 'camera' },
  { id: 'cameras', name: 'מצלמות IP', icon: 'camera' },
  { id: 'storage', name: 'NVR/DVR/אחסון', icon: 'server' },
  { id: 'access', name: 'בקרת כניסה', icon: 'shield' },
  { id: 'alarm', name: 'אזעקות וחיישנים', icon: 'alert' },
  { id: 'networking', name: 'רשתות וחשמל', icon: 'network' },
  { id: 'tools', name: 'כלי עבודה', icon: 'network' },
  { id: 'power', name: 'חשמל וגיבוי', icon: 'battery' },
  { id: 'maintenance', name: 'תחזוקה ואביזרים', icon: 'network' },
  { id: 'smart', name: 'בית חכם', icon: 'home' },
  { id: 'services', name: 'שירותים', icon: 'building' }
];

// Filter categories based on current step
const getFilteredCategories = (step: number) => {
  if (step === 2) {
    // Don't show packages category in step 2
    return categories.filter(cat => cat.id !== 'packages');
  }
  return categories;
};

export default function BuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<Package | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);
  
  const { cart, addToCart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  
  // Load saved builder state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('aegis-builder-state');
      if (savedState) {
        try {
          const state = JSON.parse(savedState);
          // Check if the state is recent (within 1 hour)
          if (Date.now() - state.timestamp < 60 * 60 * 1000) {
            console.log('Loading saved builder state:', state);
            
            // Only restore state if we're returning from a product page
            if (state.returnFromProduct && state.preserveState) {
              setCurrentStep(state.currentStep);
              setSelectedCategory(state.selectedCategory);
              console.log('Restored builder state - step:', state.currentStep, 'category:', state.selectedCategory);
            }
            
            // Clear the saved state after loading
            localStorage.removeItem('aegis-builder-state');
          }
        } catch (error) {
          console.error('Error loading builder state:', error);
        }
      }
    }
  }, []);

  // Debug cart state
  useEffect(() => {
    console.log('Builder - cart state:', cart);
    console.log('Builder - cart length:', cart.length);
    console.log('Builder - selectedPlan:', selectedPlan);
    console.log('Builder - currentStep:', currentStep);
  }, [cart, selectedPlan, currentStep]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsCategorySidebarOpen(false);
  };

  // Check if product has dynamic pricing
  const hasDynamicPricing = (productId: string) => {
    const dynamicProducts = [
      'ethernet-cable-cat6',
      'poe-switch-4-8-16', 
      'nvr-4-8-16-channels',
      'camera-bullet-varifocal'
    ];
    return dynamicProducts.includes(productId);
  };

  const handleAddToCart = (item: { kind: 'package' | 'hardware' | 'bundle', refId: string, title: string, unitPrice: number, oneTime: boolean }) => {
    console.log('handleAddToCart called with:', item);
    
    // Check camera limits if adding a camera
    if (item.kind === 'hardware') {
      const product = products.find(p => p.id === item.refId);
      console.log('Found product:', product);
      if (product && product.category === 'cameras' && selectedPlan?.limits?.cameras) {
        const currentCameras = cart.filter(c => {
          // Find the product by name since we're using random UUIDs now
          const cartProduct = products.find(p => p.title === c.name);
          return cartProduct && cartProduct.category === 'cameras';
        }).reduce((sum, c) => sum + c.quantity, 0);
        
        console.log('Current cameras:', currentCameras, 'Limit:', selectedPlan.limits.cameras);
        
        if (currentCameras >= selectedPlan.limits.cameras) {
          toast.error(`מגבלת מצלמות: ${selectedPlan.limits.cameras} מצלמות בלבד`, {
            description: 'החבילה הנבחרת מאפשרת רק מספר מצלמות מוגבל'
          });
          return;
        }
      }
    }
    
    console.log('Adding to cart...');
    addToCart({
      id: item.refId, // Use the product ID instead of random
      name: item.title,
      price: item.unitPrice,
      quantity: 1,
      image: '/api/placeholder/300/200'
    });
    
    console.log('Toast success...');
    toast.success(`${item.title} נוסף לעגלה!`);
  };

  const handleRemoveFromCart = (itemId: string) => {
      removeFromCart(itemId);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    updateQuantity(itemId, quantity);
  };

  const getTotals = () => {
    const oneTime = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const packagePrice = selectedPlan ? selectedPlan.priceIls : 0;
    const grandTotal = oneTime + packagePrice;
    
    return {
      packagePrice,
      oneTime,
      grandTotal
    };
  };

  const filteredProducts = products.filter(product => {
    // Don't show packages in step 2 (equipment selection)
    if (currentStep === 2 && product.category === 'packages') return false;
    
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  });
  
  // Debug logs
  console.log('Current step:', currentStep);
  console.log('Selected category:', selectedCategory);
  console.log('Total products:', products.length);
  console.log('Filtered products:', filteredProducts.length);
  console.log('Filtered products:', filteredProducts);

  const totals = getTotals();

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      // Reset category selection when moving to step 2
      if (currentStep === 1) {
        setSelectedCategory('all');
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Reset category selection when moving back to step 1
      if (currentStep === 2) {
        setSelectedCategory('all');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12" dir="rtl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              <span className="gradient-text">בנה את מערכת האבטחה שלך</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              בחר חבילת התקנה וציוד מותאם אישית עם התקנה מקצועית
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Stepper */}
                <div className="mb-8">
                  <div className="flex items-center justify-center space-x-4">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          step <= currentStep 
                            ? 'bg-aegis-blue text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {step}
                        </div>
                        <span className={`ml-2 text-sm ${
                          step <= currentStep ? 'text-aegis-blue font-semibold' : 'text-gray-600'
                        }`}>
                          {step === 1 ? 'חבילה' : step === 2 ? 'ציוד' : 'סיכום'}
                        </span>
                        {step < 3 && (
                          <ArrowLeft className="h-4 w-4 text-gray-400 mx-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 1: Plan Selection */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-heading font-semibold mb-6" dir="rtl">בחר את החבילה שלך</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {packages.map((plan) => (
                        <Card 
                          key={plan.id} 
                          className={`cursor-pointer transition-all ${
                            selectedPlan?.id === plan.id 
                              ? 'ring-2 ring-aegis-blue border-aegis-blue' 
                              : 'hover:shadow-lg'
                          }`}
                          onClick={() => setSelectedPlan(plan)}
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-xl">{plan.name}</CardTitle>
                              {selectedPlan?.id === plan.id && (
                                <Check className="h-6 w-6 text-aegis-blue" />
                              )}
                            </div>
                            <CardDescription>{plan.description}</CardDescription>
                            <div className="text-3xl font-bold text-aegis-blue">
                              {fmtIls(plan.priceIls)}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 text-sm">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                  <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="flex justify-end mt-8">
                      <Button 
                        onClick={nextStep}
                        disabled={!selectedPlan}
                        size="lg"
                      >
                        הבא: ציוד
                        <ArrowLeft className="h-4 w-4 mr-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Hardware Selection */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex justify-between items-center mb-6" dir="rtl">
                      <h2 className="text-2xl font-heading font-semibold">הוסף ציוד ושדרוגים</h2>
                      <div className="text-sm text-muted-foreground">
                        חבילה: {selectedPlan?.name} (מקסימום {selectedPlan?.limits?.cameras || 0} מצלמות)
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex justify-center mb-6">
                          <Button
                        onClick={() => setIsCategorySidebarOpen(true)}
                        variant="outline"
                        size="lg"
                        className="flex items-center gap-2"
                      >
                        <Grid3X3 size={18} />
                        {selectedCategory === 'all' ? 'כל המוצרים' : getFilteredCategories(currentStep).find(c => c.id === selectedCategory)?.name}
                        <ChevronDown size={16} />
                          </Button>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredProducts.map((product) => (
                        <Card key={product.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {(() => {
                                const IconComponent = getIcon(product.image);
                                return <IconComponent className="h-8 w-8 text-aegis-blue" />;
                              })()}
                              <div>
                                  <CardTitle className="text-lg">{product.title}</CardTitle>
                                  <CardDescription>{product.description}</CardDescription>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-aegis-blue">
                                  {hasDynamicPricing(product.id) ? (
                                    <span className="text-sm">מחיר לפי בחירה</span>
                                  ) : (
                                    fmtIls(product.finalIls)
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {hasDynamicPricing(product.id) ? (
                                    <span>לחץ על "פרטים נוספים" לבחירת אפשרויות</span>
                                  ) : (
                                    <>ציוד: {fmtIls(product.equipmentIls)} + התקנה: {fmtIls(product.installIls)}</>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-1 text-sm mb-4">
                              {product.features.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                  <Check className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            {hasDynamicPricing(product.id) ? (
                              <div className="space-y-2">
                            <Button 
                                  asChild
                                  variant="outline"
                              className="w-full"
                                >
                                  <Link href={`/builder/product/${product.id}`}>
                                    פרטים נוספים
                                    <ArrowRight className="h-4 w-4 mr-2" />
                                  </Link>
                                </Button>
                                <Button 
                                  className="w-full"
                                  onClick={() => handleAddToCart({
                                kind: 'hardware',
                                refId: product.id,
                                title: product.title,
                                    unitPrice: product.finalIls,
                                oneTime: true
                              })}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              הוסף לעגלה
                            </Button>
                              </div>
                            ) : (
                              <Button 
                                className="w-full"
                                onClick={() => handleAddToCart({
                                  kind: 'hardware',
                                  refId: product.id,
                                  title: product.title,
                                  unitPrice: product.finalIls,
                                  oneTime: true
                                })}
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                הוסף לעגלה
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="flex justify-center mt-8">
                      <Button onClick={nextStep} size="lg">
                        הבא: סיכום
                        <ArrowLeft className="h-4 w-4 mr-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Summary */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-heading font-semibold mb-6" dir="rtl">סיכום הזמנה</h2>
                    
                    {/* Recurring (SaaS) */}
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center" dir="rtl">
                          <CreditCard className="h-5 w-5 ml-2" />
                          חבילה נבחרת
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4" dir="rtl">
                          <span>מחיר כולל</span>
                          <div className="text-2xl font-bold text-aegis-blue">
                            {fmtIls(selectedPlan?.priceIls || 0)}
                          </div>
                        </div>
                        {selectedPlan && (
                          <div className="space-y-2" dir="rtl">
                            <div className="flex items-center justify-between">
                              <span>{selectedPlan.name}</span>
                              <span className="font-semibold">
                                {fmtIls(selectedPlan.priceIls)}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              כולל התקנה מקצועית ואחריות 12 חודשים
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* One-time (Hardware) */}
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center" dir="rtl">
                          <Settings className="h-5 w-5 ml-2" />
                          שדרוגים נוספים
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {cart.length === 0 ? (
                          <p className="text-muted-foreground" dir="rtl">לא נבחרו שדרוגים</p>
                        ) : (
                          <div className="space-y-2">
                            {cart.map((item) => (
                              <div key={item.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span>{item.name}</span>
                                  <Badge variant="outline">x{item.quantity}</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span>{fmtIls(item.price * item.quantity)}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRemoveFromCart(item.id)}
                                  >
                                    ×
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <div className="flex justify-center">
                      <Button 
                        size="lg" 
                        className="bg-aegis-blue hover:bg-aegis-blue/90"
                        onClick={() => {
                          console.log('Buy Now clicked - current cart:', cart);
                          console.log('Buy Now clicked - selectedPlan:', selectedPlan);
                          
                          // Add selected package to cart if not already there
                          if (selectedPlan) {
                            // Check if package is already in cart
                            const packageInCart = cart.find(item => item.id === selectedPlan.id);
                            if (!packageInCart) {
                              console.log('Adding package to cart:', selectedPlan.name);
                              addToCart({
                                id: selectedPlan.id,
                                name: selectedPlan.name,
                                price: selectedPlan.priceIls,
                                quantity: 1,
                                image: '/api/placeholder/300/200'
                              });
                            } else {
                              console.log('Package already in cart');
                            }
                          }
                          
                          // All equipment is already in cart from step 2, so we just navigate
                          console.log('Navigating to checkout with cart:', cart);
                          
                          // Navigate to checkout
                          window.location.href = '/builder/checkout';
                        }}
                      >
                        קנה עכשיו
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center" dir="rtl">
                      <Calculator className="h-5 w-5 ml-2" />
                      סיכום הזמנה
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Package */}
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>חבילה נבחרת</span>
                        <span>{fmtIls(selectedPlan?.priceIls || 0)}</span>
                      </div>
                    </div>

                    {/* Upgrades */}
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>שדרוגים</span>
                        <span>{totals.oneTime.toFixed(0)} ₪</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-semibold">
                        <span>סה"כ</span>
                        <span>{fmtIls(totals.grandTotal)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        כולל התקנה מקצועית ואחריות 12 חודשים
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="text-xs text-muted-foreground pt-4 border-t" dir="rtl">
                      <p>כל המחירים כוללים התקנה מקצועית. כבלים עד 20 מטר לכל נקודה כלולים במחיר. עבודות חשמל/קידוחים/גובה חריג - מחיר נפרד.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons - Only show in step 3 */}
                {currentStep === 3 && (
                  <div className="flex justify-center items-center mt-8">
                    <Button variant="outline" onClick={prevStep}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      חזור: ציוד
                    </Button>
              </div>
                )}
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Category Sidebar */}
      {isCategorySidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="flex-1 bg-black/50" 
            onClick={() => setIsCategorySidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-80 bg-background border-l border-border shadow-xl"
            dir="rtl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">בחר קטגוריה</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCategorySidebarOpen(false)}
                >
                  <X size={20} />
                </Button>
              </div>
              
              <div className="space-y-2">
                {getFilteredCategories(currentStep).map((category) => {
                  const IconComponent = getIcon(category.icon);
                  const productCount = filteredProducts.filter(p => p.category === category.id).length;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      onClick={() => handleCategorySelect(category.id)}
                      className="w-full justify-start gap-3 h-12"
                    >
                      <IconComponent size={18} />
                      <span className="flex-1 text-right">{category.name}</span>
                      <Badge variant="secondary">
                        {productCount}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
      
      {/* Debug Component */}
      <CartDebug />
    </div>
  );
}