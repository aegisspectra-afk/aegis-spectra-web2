'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Camera, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Shield, 
  Users,
  Gift,
  Star,
  Monitor,
  HardDrive,
  Wifi,
  Smartphone,
  ArrowRight,
  Home,
  Settings,
  Eye,
  Zap,
  Thermometer,
  ShoppingCart,
  ArrowLeft,
  Battery,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import { useCart } from '@/contexts/cart-context';
import { toast } from 'sonner';


export default function ProductPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-aegis-blue/5 to-aegis-teal/5">
          <div className="container-max">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Product Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="aspect-square bg-gradient-to-br from-aegis-teal/10 to-aegis-blue/10 rounded-2xl p-8 flex items-center justify-center">
                  <img
                    src="/products/4000-8599/product-image.png"
                    alt="Dome 2MP Starlight"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-aegis-blue text-white rounded-full p-3">
                  <Star className="h-6 w-6" />
                </div>
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-4">Dome 2MP Starlight</h1>
                  <p className="text-lg text-foreground/70 mb-6">
                    מוצר איכותי ממותג מוביל עם טכנולוגיה מתקדמת
                  </p>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    מוצר מוביל
                  </Badge>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm text-foreground/70 mr-2">(4.9)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-3xl font-bold text-aegis-blue">
                    ₪0
                  </div>
                  
                  <div className="flex gap-3">
                    <Button size="lg" className="flex-1 cta-button">
                      הוסף לעגלה
                      <ShoppingCart className="h-5 w-5 mr-2" />
                    </Button>
                    <Button variant="outline" size="lg">
                      <Phone className="h-5 w-5 mr-2" />
                      צור קשר
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="py-16">
          <div className="container-max">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Settings className="h-6 w-6 text-aegis-blue" />
                    מפרטים טכניים
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-muted-foreground">רזולוציה</span>
                        <span className="font-bold text-aegis-blue">2MP</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-muted-foreground">זווית צילום</span>
                        <span className="font-bold text-aegis-blue">90°</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-muted-foreground">תצוגת לילה</span>
                        <span className="font-bold text-aegis-blue">IR עד 30מ</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-muted-foreground">אחסון</span>
                        <span className="font-bold text-aegis-blue">MicroSD</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-muted-foreground">חיבור</span>
                        <span className="font-bold text-aegis-blue">WiFi + Ethernet</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-muted-foreground">אספקת חשמל</span>
                        <span className="font-bold text-aegis-blue">12V DC</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Gift className="h-6 w-6 text-aegis-blue" />
                    מה כלול במוצר
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-green-800">מוצר</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-green-800">אדפטר חשמל 12V</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-green-800">כבל רשת 3 מטר</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-green-800">מדבקות התקנה</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-green-800">מדריך התקנה</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-green-800">אחריות 2 שנים</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">תכונות מתקדמות</h2>
              <p className="text-lg text-foreground/70">
                טכנולוגיה מתקדמת לאבטחה מקסימלית
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Eye, title: 'צילום HD', description: 'איכות תמונה גבוהה ביום ובלילה' },
                { icon: Wifi, title: 'חיבור WiFi', description: 'חיבור אלחוטי יציב ומהיר' },
                { icon: Shield, title: 'אבטחה מתקדמת', description: 'הצפנה ופרטיות מקסימלית' },
                { icon: Smartphone, title: 'אפליקציה', description: 'ניהול מרחוק מהטלפון' },
                { icon: Clock, title: 'הקלטה רציפה', description: 'הקלטה 24/7 עם אחסון חכם' },
                { icon: MapPin, title: 'מיקום GPS', description: 'מיקום מדויק לכל אירוע' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full text-center p-6 hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 bg-aegis-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-8 w-8 text-aegis-blue" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-foreground/70">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
