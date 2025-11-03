'use client';

import { motion } from 'framer-motion';
import { Wrench, Camera, Shield, Bell, Lock, Download, Clock, Users, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface InstallationGuide {
  id: string;
  title: string;
  description: string;
  difficulty: 'קל' | 'בינוני' | 'מתקדם';
  duration: string;
  category: string;
  icon: React.ElementType;
  steps: number;
  tools: string[];
  rating: number;
  downloads: number;
  color: string;
}

const installationGuides: InstallationGuide[] = [
  {
    id: '1',
    title: 'התקנת מצלמת אבטחה IP - מדריך מלא',
    description: 'מדריך מפורט להתקנת מצלמת אבטחה IP, כולל חיווט, הגדרות רשת ובדיקות.',
    difficulty: 'בינוני',
    duration: '2-3 שעות',
    category: 'מצלמות',
    icon: Camera,
    steps: 12,
    tools: ['מקדחה', 'כבלי רשת', 'מחברים', 'מד חום'],
    rating: 4.8,
    downloads: 1250,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: '2',
    title: 'התקנת מערכת אזעקה אלחוטית',
    description: 'איך להתקין מערכת אזעקה אלחוטית ללא חיווט מסובך - מדריך שלב אחר שלב.',
    difficulty: 'קל',
    duration: '1-2 שעות',
    category: 'אזעקות',
    icon: Bell,
    steps: 8,
    tools: ['מברגה', 'דבק דו-צדדי', 'סוללות'],
    rating: 4.9,
    downloads: 980,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: '3',
    title: 'התקנת קודן כניסה חכם',
    description: 'התקנה מקצועית של קודן כניסה חכם עם חיבור לחשמל ובדיקות אבטחה.',
    difficulty: 'מתקדם',
    duration: '3-4 שעות',
    category: 'קודנים',
    icon: Lock,
    steps: 15,
    tools: ['מקדחה', 'כבלי חשמל', 'מחברים', 'מד חום', 'מברגה'],
    rating: 4.7,
    downloads: 750,
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: '4',
    title: 'התקנת NVR ומערכת הקלטה',
    description: 'איך להתקין NVR, לחבר מצלמות ולהגדיר מערכת הקלטה מתקדמת.',
    difficulty: 'מתקדם',
    duration: '4-5 שעות',
    category: 'מערכות',
    icon: Shield,
    steps: 18,
    tools: ['NVR', 'כבלי רשת', 'מחברים', 'מקדחה', 'מד חום'],
    rating: 4.6,
    downloads: 650,
    color: 'from-orange-500 to-yellow-500'
  },
  {
    id: '5',
    title: 'התקנת מצלמות WiFi לבית',
    description: 'מדריך פשוט להתקנת מצלמות WiFi ללא חיווט - מושלם למתחילים.',
    difficulty: 'קל',
    duration: '30-60 דקות',
    category: 'מצלמות',
    icon: Camera,
    steps: 6,
    tools: ['מברגה', 'דבק דו-צדדי', 'סוללות'],
    rating: 4.9,
    downloads: 2100,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: '6',
    title: 'התקנת מערכת אבטחה מלאה',
    description: 'מדריך מקיף להתקנת מערכת אבטחה מלאה עם מצלמות, אזעקות וקודנים.',
    difficulty: 'מתקדם',
    duration: '6-8 שעות',
    category: 'מערכות',
    icon: Shield,
    steps: 25,
    tools: ['כל הכלים הבסיסיים', 'כבלים', 'מחברים', 'מקדחה', 'מד חום'],
    rating: 4.8,
    downloads: 890,
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: '6',
    title: 'התקנת מצלמות אבטחה 4K - מדריך מקצועי',
    description: 'מדריך מקצועי להתקנת מצלמות 4K, כולל תכנון, חיווט והגדרות מתקדמות.',
    difficulty: 'מתקדם',
    duration: '4-6 שעות',
    category: 'מצלמות',
    icon: Camera,
    steps: 18,
    tools: ['מקדחה', 'כבלי Cat6', 'מחברים', 'מד חום', 'מפלס'],
    rating: 4.9,
    downloads: 890,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: '7',
    title: 'התקנת מערכת בקרת כניסה דיגיטלית',
    description: 'איך להתקין מערכת בקרת כניסה עם קודנים דיגיטליים וזיהוי כרטיסים.',
    difficulty: 'מתקדם',
    duration: '3-4 שעות',
    category: 'בקרת כניסה',
    icon: Lock,
    steps: 15,
    tools: ['מקדחה', 'כבלי רשת', 'מחברים', 'מברגה'],
    rating: 4.7,
    downloads: 650,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: '8',
    title: 'התקנת מערכת אזעקה תעשייתית',
    description: 'מדריך להתקנת מערכת אזעקה מתקדמת לעסקים ומפעלים.',
    difficulty: 'מתקדם',
    duration: '6-8 שעות',
    category: 'אזעקות',
    icon: Bell,
    steps: 25,
    tools: ['מקדחה', 'כבלים', 'מחברים', 'מד חום', 'מפלס'],
    rating: 4.8,
    downloads: 420,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: '9',
    title: 'התקנת מערכת אבטחה היברידית',
    description: 'שילוב מערכות חוטיות ואלחוטיות למערכת אבטחה מקיפה.',
    difficulty: 'מתקדם',
    duration: '5-7 שעות',
    category: 'מערכות',
    icon: Shield,
    steps: 20,
    tools: ['מקדחה', 'כבלים', 'מחברים', 'מד חום', 'מפלס'],
    rating: 4.6,
    downloads: 380,
    color: 'from-teal-500 to-cyan-500'
  },
  {
    id: '10',
    title: 'התקנת מערכת ניטור מרחוק',
    description: 'התקנה והגדרה של מערכת ניטור מרחוק עם אפליקציה לנייד.',
    difficulty: 'בינוני',
    duration: '2-3 שעות',
    category: 'ניטור',
    icon: Camera,
    steps: 10,
    tools: ['כבלי רשת', 'מחברים', 'סמארטפון'],
    rating: 4.8,
    downloads: 720,
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

export function InstallationGuides() {
  return (
    <section id="installation" className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            <span className="gradient-text">מדריכי התקנה מפורטים</span>
          </h2>
          <p className="text-xl text-aegis-secondary max-w-3xl mx-auto">
            מדריכים מקצועיים להתקנה עצמית של מערכות אבטחה. כל מה שאתה צריך לדעת כדי להתקין בעצמך.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {installationGuides.map((guide, index) => (
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
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-aegis-blue" />
                        <span>{guide.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wrench className="h-4 w-4 text-aegis-teal" />
                        <span>{guide.steps} שלבים</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{guide.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4 text-green-500" />
                        <span>{guide.downloads}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-aegis-secondary mb-2">כלים נדרשים:</p>
                    <div className="flex flex-wrap gap-1">
                      {guide.tools.slice(0, 3).map((tool, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                      {guide.tools.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{guide.tools.length - 3} עוד
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1" size="sm">
                      <Link href={`/guides/installation/${guide.id}`}>
                        <Wrench className="h-4 w-4 mr-1" />
                        התחל התקנה
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
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
            <Link href="/guides/installation">
              <Wrench className="h-5 w-5 mr-2" />
              כל מדריכי ההתקנה
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
