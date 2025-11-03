'use client';

import { motion } from 'framer-motion';
import { Wrench, AlertTriangle, BookOpen, Video, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export function GuidesHero() {
  return (
    <section className="py-16 bg-gradient-to-br from-aegis-teal/5 via-background to-aegis-blue/5">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
            <span className="gradient-text">מדריכי התקנה ופתרון בעיות</span>
          </h1>
          
          <p className="text-xl text-aegis-secondary max-w-3xl mx-auto mb-8">
            מדריכים מפורטים להתקנה עצמית, פתרון בעיות נפוצות, תחזוקה שוטפת 
            וטיפים מקצועיים למערכות האבטחה שלך.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-aegis-secondary" />
              <Input
                placeholder="חפש במדריכים..."
                className="w-full px-4 py-3 pr-10 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-aegis-teal/50 focus:border-aegis-teal"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button asChild variant="aegis" size="lg">
              <Link href="#installation">
                <Wrench className="h-5 w-5 mr-2" />
                מדריכי התקנה
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link href="#troubleshooting">
                <AlertTriangle className="h-5 w-5 mr-2" />
                פתרון בעיות
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link href="#maintenance">
                <BookOpen className="h-5 w-5 mr-2" />
                תחזוקה
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-aegis-teal mb-2">50+</div>
              <div className="text-sm text-aegis-secondary">מדריכי התקנה</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-aegis-blue mb-2">30+</div>
              <div className="text-sm text-aegis-secondary">פתרונות בעיות</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">25+</div>
              <div className="text-sm text-aegis-secondary">וידאו הדרכות</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">100%</div>
              <div className="text-sm text-aegis-secondary">הצלחה מובטחת</div>
            </div>
          </div>
        </motion.div>

        {/* Quick Access Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">התקנה עצמית</h3>
              <p className="text-aegis-secondary mb-4">
                מדריכים מפורטים להתקנת מצלמות, אזעקות וקודנים בעצמך
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="#installation">
                  התחל עכשיו
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">פתרון בעיות</h3>
              <p className="text-aegis-secondary mb-4">
                פתרונות מהירים לבעיות נפוצות במערכות האבטחה שלך
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="#troubleshooting">
                  פתור עכשיו
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">וידאו הדרכות</h3>
              <p className="text-aegis-secondary mb-4">
                הדרכות וידאו מפורטות עם הסברים ברורים וטיפים מקצועיים
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="#videos">
                  צפה עכשיו
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
