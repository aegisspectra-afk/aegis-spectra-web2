'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, ExternalLink, Smartphone, Camera } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { trackPricingTierClick, trackWhatsAppClick, trackButtonClick } from '@/lib/analytics';

const pricingTiers = [
  {
    name: 'Home Cam',
    price: '1,990',
    period: ' ₪',
    description: 'חבילה בסיסית לבית - 2 מצלמות + NVR + אפליקציה',
    popular: false,
    plan: 'HOME_CAM',
    features: [
      '2× מצלמות IP 4MP (חוץ/פנים)',
      'NVR 4ch + 1TB',
      'חיווט וקונפיגורציה',
      'אפליקציה בעברית',
      'אחריות 12 חודשים'
    ],
  },
  {
    name: 'Business Cam',
    price: '3,490',
    period: ' ₪',
    description: 'חבילה מתקדמת לעסק - 4 מצלמות + NVR + הדרכה',
    popular: true,
    plan: 'BUSINESS_CAM',
    features: [
      '4× מצלמות IP 4MP',
      'NVR 8ch + 2TB',
      'גישה מרחוק',
      'ביקור תחזוקה אחרי 60 יום',
      'אחריות 12 חודשים',
      'שדרוג ל-4K: +600-1,000 ₪'
    ],
  },
  {
    name: 'Secure Entry',
    price: '2,290',
    period: ' ₪',
    description: 'קודן RFID + מנעול מגנטי 280kg + ספק כוח + לחצן יציאה + Door Closer',
    popular: false,
    plan: 'SECURE_ENTRY',
    features: [
      'קודן RFID + מנעול מגנטי 280kg',
      'ספק כוח + לחצן יציאה + Door Closer',
      'תכנות משתמשים והדרכה',
      'אחריות 12 חודשים'
    ],
  },
  {
    name: 'Alarm Basic',
    price: '2,490',
    period: ' ₪ (מ-)',
    description: 'מערכת אזעקה אלחוטית עם חיישנים',
    popular: false,
    plan: 'ALARM_BASIC',
    features: [
      'מערכת אזעקה אלחוטית',
      'חיישני תנועה/פתיחה',
      'התראות לנייד',
      'התקנה והגדרה',
      'אחריות 12 חודשים',
      'Ajax/מותגים שווי ערך'
    ],
  },
];

export function Pricing() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  // Check for success message
  useEffect(() => {
    const success = searchParams.get('success');
    const plan = searchParams.get('plan');
    
    if (success && plan) {
      toast.success('Payment Successful!', {
        description: `Your ${plan.toUpperCase()} plan has been activated. Our team will contact you soon.`,
      });
    }
  }, [searchParams]);

  const handleChoosePlan = async (planName: string, plan: string) => {
    setIsLoading(plan);
    
    try {
      const tier = pricingTiers.find(tier => tier.plan === plan);
      const price = parseInt(tier?.price.replace(',', '') || '0');
      
      // Track pricing tier selection
      trackPricingTierClick(planName, price);
      trackButtonClick(`Choose Plan - ${planName}`, 'Pricing Page');
      
      // Redirect to dedicated product page
      const productRoutes: { [key: string]: string } = {
        'HOME_CAM': '/products/home-cam/packages',
        'BUSINESS_CAM': '/products/business-cam',
        'SECURE_ENTRY': '/products/secure-entry',
        'ALARM_BASIC': '/products/alarm-basic'
      };
      
      const productRoute = productRoutes[plan];
      if (productRoute) {
        window.location.href = productRoute;
      } else {
        // Fallback to contact page for other plans
        const planInfo = encodeURIComponent(`${planName} - ${tier?.description}`);
        window.location.href = `/contact?plan=${plan}&info=${planInfo}`;
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('שגיאה בניווט', {
        description: 'אנא נסה שוב או צור קשר',
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <section className="py-8 bg-gradient-to-b from-background to-aegis-graphite/20">
      <div className="container-max">
        <div className="text-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-heading font-bold mb-6"
        >
          <span className="gradient-text">חבילות התקנה</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl text-aegis-secondary max-w-2xl mx-auto mb-6"
        >
          בחר את החבילה המתאימה לך - כולל התקנה מקצועית
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button asChild variant="outline" size="lg">
            <Link href="/store">
              <Camera className="ml-2" size={20} />
              חנות מוצרים בודדים
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/builder">
              <ExternalLink className="ml-2" size={20} />
              בונה חבילות מותאמות
            </Link>
          </Button>
        </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {pricingTiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={tier.popular ? 'md:-mt-4' : ''}
          >
            <Card className={`h-full card-hover ${tier.popular ? 'border-aegis-blue shadow-lg shadow-aegis-blue/20' : ''}`}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge variant="aegis" className="px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-heading" style={{color: '#F5F5F5'}}>
                  {tier.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold" style={{color: '#1A73E8'}}>
                    {tier.price}
                  </span>
                  <span style={{color: '#A0A0A0'}}>{tier.period}</span>
                </div>
                <CardDescription className="text-base mt-2" style={{color: '#E0E0E0'}}>
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 flex-shrink-0" style={{color: '#1A73E8'}} />
                      <span className="text-sm" style={{color: '#E0E0E0'}}>{feature}</span>
                    </li>
                  ))}
                </ul>

                    <Button
                      variant={tier.popular ? 'aegis' : 'aegisOutline'}
                      className="w-full"
                      size="lg"
                      onClick={() => handleChoosePlan(tier.name, tier.plan)}
                      disabled={isLoading === tier.plan}
                      style={tier.popular ? {
                        backgroundColor: '#1A73E8 !important',
                        color: '#FFFFFF !important',
                        border: '2px solid #1A73E8 !important'
                      } : {
                        borderColor: '#1A73E8 !important',
                        color: '#1A73E8 !important'
                      }}
                    >
                      {isLoading === tier.plan ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : tier.name === 'Business' || tier.name === 'Enterprise' ? (
                        <>
                          Contact Sales
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        <>
                          בחר {tier.name}
                          <Star className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        </div>

        <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <p className="text-aegis-footer mb-4 text-sm">
          *המחירים כוללים ציוד והתקנה בסיסית עד 20 מ׳ כבל לנקודה, תצורה ואפליקציה. עבודות חשמל/מעברים ארוכים/קידוח בטון/גובה חריג יתומחרו בנפרד. אחריות 12 חודשים על חלקים ועבודה.
        </p>
        {/* Upsells */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-center mb-6">שדרוגים נפוצים</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <div className="font-semibold text-aegis-blue">שדרוג ל-4K למצלמה</div>
              <div className="text-sm text-aegis-secondary">+₪200–₪300 ליח׳</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <div className="font-semibold text-aegis-blue">נקודת מצלמה נוספת</div>
              <div className="text-sm text-aegis-secondary">₪550–₪750 (כולל כבל עד 20 מ׳)</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <div className="font-semibold text-aegis-blue">כל מטר כבל מעבר ל-20 מ׳</div>
              <div className="text-sm text-aegis-secondary">₪10–₪15</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <div className="font-semibold text-aegis-blue">קידוח בטון/אבן קשה</div>
              <div className="text-sm text-aegis-secondary">₪120 לנק׳</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <div className="font-semibold text-aegis-blue">גובה מעל 3 מ׳</div>
              <div className="text-sm text-aegis-secondary">+₪150–₪300 (סולם מיוחד/במה)</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <div className="font-semibold text-aegis-blue">PoE Switch איכותי (8 פורטים)</div>
              <div className="text-sm text-aegis-secondary">₪220–₪390</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <div className="font-semibold text-aegis-blue">UPS קטן ל-NVR/ראוטר</div>
              <div className="text-sm text-aegis-secondary">₪250–₪380</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <div className="font-semibold text-aegis-blue">מיקרופון/אודיו דו-כיווני</div>
              <div className="text-sm text-aegis-secondary">₪150–₪300 לנק׳</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <div className="font-semibold text-aegis-blue">תחזוקה חודשית</div>
              <div className="text-sm text-aegis-secondary">₪59–₪149 (בית/עסק קטן)</div>
            </div>
          </div>
        </motion.div>

        <p className="text-aegis-secondary mb-4">
          רוצה חבילה מותאמת אישית? צור קשר לקבלת הצעה מותאמת
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          variant="aegis" 
          size="lg" 
          asChild
          onClick={() => {
            trackWhatsAppClick('Pricing Page');
            trackButtonClick('WhatsApp - Pricing', 'Pricing Page');
          }}
        >
          <a href="https://wa.me/972559737025" target="_blank" rel="noopener noreferrer">
            <Smartphone className="h-5 w-5 mr-2" />
            קבל הצעת מחיר ב-WhatsApp
          </a>
        </Button>
          <Button variant="aegisOutline" size="lg" asChild>
            <Link href="/contact">
              <Camera className="h-5 w-5 mr-2" />
              תיאום ביקור מדידה
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/builder">
              <Star className="h-5 w-5 mr-2" />
              בנה מערכת מותאמת
            </Link>
          </Button>
        </div>
        </motion.div>
      </div>
    </section>
  );
}