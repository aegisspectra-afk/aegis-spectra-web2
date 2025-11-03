'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { WhatsAppFloat } from '@/components/common/whatsapp-float';
import { 
  Clock, 
  Shield, 
  Camera, 
  BarChart3, 
  Users, 
  Settings,
  ArrowLeft,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ComingSoonPage() {
  const features = [
    {
      icon: Camera,
      title: 'ניהול מצלמות מתקדם',
      description: 'דשבורד מלא לניהול מצלמות אבטחה עם אנליטיקס מתקדם'
    },
    {
      icon: BarChart3,
      title: 'דוחות ואנליטיקס',
      description: 'דוחות מפורטים וניתוח נתונים בזמן אמת'
    },
    {
      icon: Users,
      title: 'ניהול משתמשים',
      description: 'מערכת הרשאות מתקדמת לניהול צוותים'
    },
    {
      icon: Settings,
      title: 'הגדרות מתקדמות',
      description: 'תצורה מלאה של כל המערכות וההגדרות'
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="secondary" className="mb-6">
                <Clock className="h-3 w-3 mr-1" />
                Coming Soon
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
                <span className="gradient-text">Aegis Spectra Cloud</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                מערכת הניהול החדשה שלנו נמצאת בפיתוח מתקדם. 
                בינתיים, אנחנו מתמחים בהתקנות מקצועיות של מערכות אבטחה.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-center mb-8">תכונות עתידיות</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex flex-col items-center space-y-3">
                          <div className="p-3 rounded-full bg-aegis-teal/10">
                            <Icon className="h-8 w-8 text-aegis-teal" />
                          </div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-center">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-8"
            >
              <Card className="border-aegis-teal/20 bg-gradient-to-r from-aegis-teal/5 to-aegis-silver/5">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center text-xl">
                    <Shield className="h-6 w-6 mr-2 text-aegis-teal" />
                    מה זמין עכשיו?
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg text-muted-foreground mb-6">
                    אנחנו מתמחים בהתקנות מקצועיות של מערכות אבטחה
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild variant="aegis" size="lg" className="text-lg px-6 py-3">
                      <Link href="/pricing">
                        <Shield className="h-5 w-5 mr-2" />
                        חבילות התקנה
                      </Link>
                    </Button>
                    <Button asChild variant="aegisOutline" size="lg" className="text-lg px-6 py-3">
                      <Link href="/contact">
                        <Camera className="h-5 w-5 mr-2" />
                        תיאום ביקור מדידה
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="lg" className="text-lg px-6 py-3">
                      <a href="https://wa.me/972559737025" target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        WhatsApp
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  רוצה לקבל עדכונים על השקת הפלטפורמה החדשה?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="outline" size="lg">
                    <Link href="/">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      חזור לדף הבית
                    </Link>
                  </Button>
                  <Button asChild variant="aegis" size="lg">
                    <a href="https://wa.me/972559737025" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      צור קשר לקבלת עדכונים
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}