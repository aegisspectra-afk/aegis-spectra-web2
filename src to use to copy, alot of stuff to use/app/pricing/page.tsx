'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PriceCalculator } from '@/components/marketing/price-calculator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Star, Shield, Camera, Bell, Lock, Calculator } from 'lucide-react';
import { useState } from 'react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'בסיסי',
      description: 'מושלם לבתים קטנים',
      price: { monthly: 299, yearly: 2990 },
      originalPrice: { monthly: 399, yearly: 3990 },
      features: [
        'מצלמת אבטחה אחת',
        'הקלטה 24/7',
        'אחסון 7 ימים',
        'אפליקציה לנייד',
        'התראות מיידיות',
        'תמיכה טכנית'
      ],
      limitations: [
        'ללא זיהוי פנים',
        'ללא אחסון בענן',
        'ללא הקלטת שמע'
      ],
      popular: false,
      icon: Camera
    },
    {
      name: 'מתקדם',
      description: 'הכי פופולרי - מושלם לרוב המשפחות',
      price: { monthly: 599, yearly: 5990 },
      originalPrice: { monthly: 799, yearly: 7990 },
      features: [
        'עד 4 מצלמות אבטחה',
        'הקלטה 24/7 באיכות HD',
        'אחסון 30 ימים',
        'זיהוי פנים וחפצים',
        'אפליקציה מתקדמת',
        'התראות חכמות',
        'אחסון בענן',
        'תמיכה טכנית 24/7'
      ],
      limitations: [
        'ללא מערכת אזעקה',
        'ללא בקרת כניסה'
      ],
      popular: true,
      icon: Shield
    },
    {
      name: 'מקצועי',
      description: 'פתרון מלא לעסקים קטנים ובינוניים',
      price: { monthly: 999, yearly: 9990 },
      originalPrice: { monthly: 1299, yearly: 12990 },
      features: [
        'עד 8 מצלמות אבטחה',
        'הקלטה 4K',
        'אחסון 90 ימים',
        'זיהוי פנים מתקדם',
        'מערכת אזעקה',
        'בקרת כניסה',
        'ניטור מרחוק',
        'דוחות מפורטים',
        'תמיכה טכנית ייעודית',
        'התקנה מקצועית'
      ],
      limitations: [],
      popular: false,
      icon: Star
    }
  ];

  const addOns = [
    {
      name: 'מצלמה נוספת',
      price: { monthly: 199, yearly: 1990 },
      description: 'הוסף מצלמות נוספות למערכת שלך'
    },
    {
      name: 'אחסון בענן מורחב',
      price: { monthly: 99, yearly: 990 },
      description: 'עד 1TB אחסון בענן'
    },
    {
      name: 'תמיכה טכנית מתקדמת',
      price: { monthly: 149, yearly: 1490 },
      description: 'תמיכה 24/7 עם תגובה מיידית'
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            תמחור
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            בחר את התוכנית המתאימה לך. כל התוכניות כוללות התקנה מקצועית ואחריות מלאה.
          </p>
          <div className="mb-8">
            <Button asChild variant="aegis" size="lg">
              <a href="#calculator">
                <Calculator className="h-5 w-5 mr-2" />
                מחשבון מחירים מתקדם
              </a>
            </Button>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
              חודשי
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative"
            >
              <div className={`absolute top-0 left-0 h-full w-1/2 bg-primary rounded transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-full' : 'translate-x-0'
              }`} />
              <span className="relative z-10 px-4 py-2">שנתי</span>
            </Button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
              שנתי
            </span>
            {billingCycle === 'yearly' && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                חיסכון של 20%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      הכי פופולרי
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold text-foreground">
                        ₪{plan.price[billingCycle]}
                      </span>
                      <span className="text-muted-foreground">
                        /{billingCycle === 'monthly' ? 'חודש' : 'שנה'}
                      </span>
                    </div>
                    {plan.originalPrice && (
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-sm text-muted-foreground line-through">
                          ₪{plan.originalPrice[billingCycle]}
                        </span>
                        <Badge variant="destructive" className="text-xs">
                          חיסכון ₪{plan.originalPrice[billingCycle] - plan.price[billingCycle]}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <Button 
                    className={`w-full mb-6 ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.popular ? 'התחל עכשיו' : 'בחר תוכנית'}
                  </Button>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-foreground">כולל:</h4>
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations.length > 0 && (
                      <>
                        <h4 className="font-semibold text-sm text-foreground mt-4">לא כולל:</h4>
                        {plan.limitations.map((limitation, limitationIndex) => (
                          <div key={limitationIndex} className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{limitation}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add-ons */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">תוספות</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {addOns.map((addon, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{addon.name}</h3>
                  <span className="text-lg font-bold text-primary">
                    ₪{addon.price[billingCycle]}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{addon.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  הוסף
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">שאלות נפוצות</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">האם יש התחייבות?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  לא! אתה יכול לבטל בכל עת ללא עמלות. אנחנו מאמינים שאם אתה לא מרוצה מהשירות, 
                  אתה לא צריך לשלם עליו.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">מה כולל ההתקנה?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  ההתקנה כוללת: התקנת החומרה, הגדרת האפליקציה, בדיקת המערכת, 
                  והדרכה מלאה לשימוש. הכל ללא עלות נוספת.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">איך עובד האחסון בענן?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  כל ההקלטות נשמרות בענן מאובטח שלנו. אתה יכול לצפות בהן מכל מקום, 
                  והן נשמרות לפי תקופת האחסון של התוכנית שלך.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Price Calculator Section */}
        <div id="calculator" className="mt-16">
          <PriceCalculator />
        </div>
      </main>

      <Footer />
    </div>
  );
}
