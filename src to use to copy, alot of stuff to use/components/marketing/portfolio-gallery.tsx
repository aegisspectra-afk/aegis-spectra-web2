'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Users, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Filter,
  Grid,
  List
} from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  category: string;
  client: string;
  features: string[];
  beforeImage: string;
  afterImage: string;
  testimonial?: {
    text: string;
    author: string;
    role: string;
  };
  stats: {
    cameras: number;
    installationTime: string;
    satisfaction: number;
  };
}

const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'מערכת אבטחה למתחם מגורים יוקרתי',
    description: 'התקנה מקצועית של 12 מצלמות 4K במתחם מגורים יוקרתי בתל אביב, כולל מערכת NVR מתקדמת ואפליקציה מותאמת אישית.',
    location: 'תל אביב',
    date: '2024-01-15',
    category: 'מגורים',
    client: 'מתחם מגורים יוקרתי',
    features: [
      '12 מצלמות 4K עם זיהוי פנים',
      'NVR 16 ערוצים + 4TB',
      'אפליקציה מותאמת אישית',
      'מערכת התראות חכמה',
      'תחזוקה חודשית'
    ],
    beforeImage: '/portfolio/before-1.jpg',
    afterImage: '/portfolio/after-1.jpg',
    testimonial: {
      text: 'התקנה מקצועית ומערכת מצוינת. האפליקציה עובדת מצוין ואני יכול לראות הכל מהנייד.',
      author: 'דוד כהן',
      role: 'מנהל המתחם'
    },
    stats: {
      cameras: 12,
      installationTime: '8 שעות',
      satisfaction: 5
    }
  },
  {
    id: '2',
    title: 'מערכת אבטחה לעסק קמעונאי',
    description: 'התקנה של 8 מצלמות במעגל סגור לעסק קמעונאי בחולון, כולל מערכת התראות לנייד ותחזוקה שוטפת.',
    location: 'חולון',
    date: '2024-01-10',
    category: 'עסקים',
    client: 'חנות אלקטרוניקה',
    features: [
      '8 מצלמות HD',
      'NVR 8 ערוצים + 2TB',
      'התראות לנייד',
      'תחזוקה חודשית',
      'הדרכה מלאה'
    ],
    beforeImage: '/portfolio/before-2.jpg',
    afterImage: '/portfolio/after-2.jpg',
    testimonial: {
      text: 'מערכת מצוינת! ההתראות מגיעות מיד לנייד ואני יכול לראות מה קורה בחנות בכל זמן.',
      author: 'שרה לוי',
      role: 'בעלת החנות'
    },
    stats: {
      cameras: 8,
      installationTime: '6 שעות',
      satisfaction: 5
    }
  },
  {
    id: '3',
    title: 'מערכת אבטחה למפעל ייצור',
    description: 'התקנה מקיפה של 20 מצלמות במפעל ייצור בראשון לציון, כולל מערכת PTZ וזיהוי תנועה מתקדם.',
    location: 'ראשון לציון',
    date: '2024-01-05',
    category: 'תעשייה',
    client: 'מפעל ייצור',
    features: [
      '20 מצלמות IP',
      '4 מצלמות PTZ',
      'NVR 32 ערוצים + 8TB',
      'זיהוי תנועה מתקדם',
      'תחזוקה שבועית'
    ],
    beforeImage: '/portfolio/before-3.jpg',
    afterImage: '/portfolio/after-3.jpg',
    testimonial: {
      text: 'התקנה מקצועית של 20 מצלמות במפעל. הצוות הגיע בזמן, עבד נקי והשאיר הכל מסודר.',
      author: 'מיכאל רוזן',
      role: 'מנהל המתקנים'
    },
    stats: {
      cameras: 20,
      installationTime: '2 ימים',
      satisfaction: 5
    }
  },
  {
    id: '4',
    title: 'מערכת אבטחה לבית פרטי',
    description: 'התקנה של 4 מצלמות לבית פרטי בבת ים, כולל מערכת אזעקה אלחוטית ואפליקציה בעברית.',
    location: 'בת ים',
    date: '2024-01-01',
    category: 'מגורים',
    client: 'בית פרטי',
    features: [
      '4 מצלמות 4MP',
      'NVR 4 ערוצים + 1TB',
      'מערכת אזעקה אלחוטית',
      'אפליקציה בעברית',
      'אחריות 12 חודשים'
    ],
    beforeImage: '/portfolio/before-4.jpg',
    afterImage: '/portfolio/after-4.jpg',
    testimonial: {
      text: 'שירות מעולה מההתחלה עד הסוף. התקנה מהירה, הדרכה מפורטת ואחריות מלאה.',
      author: 'רחל גרין',
      role: 'בעלת הבית'
    },
    stats: {
      cameras: 4,
      installationTime: '4 שעות',
      satisfaction: 5
    }
  }
];

const categories = ['כל הקטגוריות', 'מגורים', 'עסקים', 'תעשייה', 'משרדים'];

export function PortfolioGallery() {
  const [selectedCategory, setSelectedCategory] = useState('כל הקטגוריות');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filteredItems = portfolioItems.filter(item => 
    selectedCategory === 'כל הקטגוריות' || item.category === selectedCategory
  );

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            <span className="gradient-text">גלריית עבודות</span>
          </h2>
          <p className="text-xl text-aegis-secondary max-w-3xl mx-auto">
            צפה בפרויקטים המובילים שלנו והתרשם מאיכות העבודה המקצועית
          </p>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-aegis-secondary" />
                  <span className="text-sm font-medium">קטגוריות:</span>
                </div>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'aegis' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'aegis' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'aegis' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Portfolio Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => setSelectedItem(item)}>
                <div className="aspect-video bg-muted/30 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                  <div className="text-aegis-secondary">תמונה: {item.title}</div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="aegis" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      צפה בפרויקט
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="aegis" className="text-xs">
                      {item.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.stats.cameras} מצלמות
                    </Badge>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-aegis-secondary text-sm mb-4 line-clamp-3">
                    {item.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-aegis-secondary">
                      <MapPin className="h-4 w-4" />
                      {item.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-aegis-secondary">
                      <Calendar className="h-4 w-4" />
                      {new Date(item.date).toLocaleDateString('he-IL')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-aegis-secondary">
                      <Users className="h-4 w-4" />
                      {item.client}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Shield 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < item.stats.satisfaction 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <Button variant="outline" size="sm">
                      <ArrowRight className="h-4 w-4 mr-1" />
                      פרטים
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-aegis-blue/10 to-aegis-green/10 border-aegis-blue/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">רוצה לראות את הפרויקט שלך כאן?</h3>
              <p className="text-aegis-secondary mb-6">
                צור קשר איתנו ונתחיל לתכנן את מערכת האבטחה המושלמת עבורך
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="aegis" size="lg" asChild>
                  <a href="https://wa.me/972559737025" target="_blank" rel="noopener noreferrer">
                    <Camera className="h-5 w-5 mr-2" />
                    קבל הצעת מחיר
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="/contact">
                    <Users className="h-5 w-5 mr-2" />
                    צור קשר
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedItem(null)}
                  >
                    ×
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">לפני</h3>
                    <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
                      <div className="text-aegis-secondary">תמונה לפני: {selectedItem.title}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">אחרי</h3>
                    <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
                      <div className="text-aegis-secondary">תמונה אחרי: {selectedItem.title}</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">פרטי הפרויקט</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-aegis-secondary">מיקום:</span>
                        <span>{selectedItem.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-aegis-secondary">תאריך:</span>
                        <span>{new Date(selectedItem.date).toLocaleDateString('he-IL')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-aegis-secondary">לקוח:</span>
                        <span>{selectedItem.client}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-aegis-secondary">מצלמות:</span>
                        <span>{selectedItem.stats.cameras}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-aegis-secondary">זמן התקנה:</span>
                        <span>{selectedItem.stats.installationTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">תכונות</h3>
                    <ul className="space-y-1">
                      {selectedItem.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-aegis-green" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {selectedItem.testimonial && (
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold mb-2">עדות לקוח</h3>
                    <p className="italic mb-2">"{selectedItem.testimonial.text}"</p>
                    <p className="text-sm text-aegis-secondary">
                      - {selectedItem.testimonial.author}, {selectedItem.testimonial.role}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
