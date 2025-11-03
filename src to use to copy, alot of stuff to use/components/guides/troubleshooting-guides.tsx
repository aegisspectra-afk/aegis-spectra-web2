'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Wifi, Camera, Bell, Lock, CheckCircle, Clock, Users, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface TroubleshootingGuide {
  id: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  category: string;
  icon: React.ElementType;
  steps: number;
  timeToFix: string;
  difficulty: 'קל' | 'בינוני' | 'מתקדם';
  rating: number;
  views: number;
  color: string;
}

const troubleshootingGuides: TroubleshootingGuide[] = [
  {
    id: '1',
    title: 'מצלמה לא מתחברת לרשת',
    description: 'פתרון מהיר לבעיות חיבור מצלמות לרשת WiFi או Ethernet.',
    problem: 'מצלמה לא מופיעה באפליקציה',
    solution: 'בדיקת חיבור רשת והגדרות IP',
    category: 'מצלמות',
    icon: Camera,
    steps: 6,
    timeToFix: '10-15 דקות',
    difficulty: 'קל',
    rating: 4.8,
    views: 2100,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: '2',
    title: 'אזעקה לא מפסיקה לצפצף',
    description: 'איך לעצור אזעקה שנתקעה ולהחזיר את המערכת לפעולה תקינה.',
    problem: 'אזעקה ממשיכה לצפצף ללא הפסקה',
    solution: 'איפוס חיישנים והגדרות מערכת',
    category: 'אזעקות',
    icon: Bell,
    steps: 4,
    timeToFix: '5-10 דקות',
    difficulty: 'קל',
    rating: 4.9,
    views: 1850,
    color: 'from-red-500 to-pink-500'
  },
  {
    id: '3',
    title: 'קודן לא מזהה את הקוד',
    description: 'פתרון בעיות זיהוי קוד בקודנים חכמים וקודנים רגילים.',
    problem: 'קודן לא מגיב לקוד הנכון',
    solution: 'ניקוי, איפוס והגדרה מחדש',
    category: 'קודנים',
    icon: Lock,
    steps: 8,
    timeToFix: '15-20 דקות',
    difficulty: 'בינוני',
    rating: 4.7,
    views: 1200,
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: '4',
    title: 'NVR לא מקליט וידאו',
    description: 'פתרון בעיות הקלטה במערכות NVR - בדיקת אחסון, הגדרות וחיבורים.',
    problem: 'הקלטות לא נשמרות או לא מופיעות',
    solution: 'בדיקת אחסון, הגדרות הקלטה וחיבורים',
    category: 'מערכות',
    icon: Wifi,
    steps: 10,
    timeToFix: '20-30 דקות',
    difficulty: 'מתקדם',
    rating: 4.6,
    views: 950,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: '5',
    title: 'אפליקציה לא מתחברת מרחוק',
    description: 'פתרון בעיות חיבור מרחוק לאפליקציה - הגדרות רשת ופורטים.',
    problem: 'לא ניתן לצפות במצלמות מהנייד',
    solution: 'הגדרות רשת, פורטים ו-DDNS',
    category: 'אפליקציות',
    icon: Wifi,
    steps: 12,
    timeToFix: '30-45 דקות',
    difficulty: 'מתקדם',
    rating: 4.5,
    views: 1600,
    color: 'from-orange-500 to-yellow-500'
  },
  {
    id: '6',
    title: 'חיישני תנועה לא עובדים',
    description: 'פתרון בעיות חיישני תנועה - בדיקת מיקום, הגדרות ורגישות.',
    problem: 'חיישנים לא מגיבים לתנועה',
    solution: 'בדיקת מיקום, ניקוי והגדרות רגישות',
    category: 'חיישנים',
    icon: AlertTriangle,
    steps: 7,
    timeToFix: '15-25 דקות',
    difficulty: 'בינוני',
    rating: 4.8,
    views: 1400,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: '6',
    title: 'מצלמה מציגה תמונה מטושטשת',
    description: 'פתרון בעיות איכות תמונה נמוכה במצלמות אבטחה.',
    problem: 'תמונה מטושטשת או לא ברורה',
    solution: 'ניקוי עדשות, בדיקת זווית ובדיקת הגדרות',
    category: 'מצלמות',
    icon: Camera,
    steps: 5,
    timeToFix: '5-10 דקות',
    difficulty: 'קל',
    rating: 4.7,
    views: 1800,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: '7',
    title: 'מערכת אזעקה לא מגיבה לקוד',
    description: 'פתרון בעיות הזנת קוד במערכת אזעקה.',
    problem: 'קוד לא מתקבל או מערכת לא נפתחת',
    solution: 'בדיקת מקלדת, איפוס קוד ובדיקת חיבורים',
    category: 'אזעקות',
    icon: Bell,
    steps: 7,
    timeToFix: '15-20 דקות',
    difficulty: 'בינוני',
    rating: 4.6,
    views: 1200,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: '8',
    title: 'הקלטות לא נשמרות במערכת',
    description: 'פתרון בעיות אחסון והקלטה במערכות אבטחה.',
    problem: 'הקלטות לא נשמרות או נמחקות',
    solution: 'בדיקת אחסון, הגדרות הקלטה וניקוי מקום',
    category: 'אחסון',
    icon: Camera,
    steps: 8,
    timeToFix: '20-30 דקות',
    difficulty: 'בינוני',
    rating: 4.8,
    views: 950,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: '9',
    title: 'חיישני תנועה לא עובדים',
    description: 'פתרון בעיות חיישני תנועה במערכות אבטחה.',
    problem: 'חיישנים לא מזההים תנועה או מפעילים התראות',
    solution: 'בדיקת מיקום, ניקוי ובדיקת הגדרות רגישות',
    category: 'חיישנים',
    icon: AlertTriangle,
    steps: 6,
    timeToFix: '10-15 דקות',
    difficulty: 'קל',
    rating: 4.9,
    views: 1600,
    color: 'from-teal-500 to-cyan-500'
  },
  {
    id: '10',
    title: 'אפליקציה לא מתחברת למערכת',
    description: 'פתרון בעיות חיבור אפליקציה למערכות אבטחה.',
    problem: 'אפליקציה לא מצליחה להתחבר למערכת',
    solution: 'בדיקת רשת, עדכון אפליקציה ובדיקת הגדרות',
    category: 'אפליקציות',
    icon: Wifi,
    steps: 9,
    timeToFix: '15-25 דקות',
    difficulty: 'בינוני',
    rating: 4.5,
    views: 1100,
    color: 'from-indigo-500 to-purple-500'
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'קל': return 'bg-green-500/20 text-green-600 border-green-500/30';
    case 'בינוני': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
    case 'מתקדם': return 'bg-red-500/20 text-red-600 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
  }
};

export function TroubleshootingGuides() {
  return (
    <section id="troubleshooting" className="py-16 bg-gradient-to-b from-muted/20 to-background">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            <span className="gradient-text">פתרון בעיות נפוצות</span>
          </h2>
          <p className="text-xl text-aegis-secondary max-w-3xl mx-auto">
            פתרונות מהירים לבעיות הנפוצות ביותר במערכות אבטחה. 
            כל מה שאתה צריך כדי לפתור בעיות בעצמך.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {troubleshootingGuides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`h-full hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br ${guide.color}/10 border-${guide.color.split('-')[1]}-500/20 hover:scale-105`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${guide.color}`}>
                      <guide.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge className={getDifficultyColor(guide.difficulty)}>
                      {guide.difficulty}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg font-bold mb-2 group-hover:text-aegis-teal transition-colors">
                    {guide.title}
                  </CardTitle>
                  
                  <p className="text-sm text-aegis-secondary line-clamp-3">
                    {guide.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3 mb-4">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <p className="text-xs text-red-600 font-medium mb-1">בעיה:</p>
                      <p className="text-sm text-red-700">{guide.problem}</p>
                    </div>
                    
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <p className="text-xs text-green-600 font-medium mb-1">פתרון:</p>
                      <p className="text-sm text-green-700">{guide.solution}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-aegis-blue" />
                        <span>{guide.timeToFix}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-aegis-teal" />
                        <span>{guide.steps} שלבים</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{guide.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-green-500" />
                        <span>{guide.views} צפיות</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1" size="sm">
                      <Link href={`/guides/troubleshooting/${guide.id}`}>
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        פתור עכשיו
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild variant="aegis" size="lg">
            <Link href="/guides/troubleshooting">
              <AlertTriangle className="h-5 w-5 mr-2" />
              כל מדריכי פתרון הבעיות
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
