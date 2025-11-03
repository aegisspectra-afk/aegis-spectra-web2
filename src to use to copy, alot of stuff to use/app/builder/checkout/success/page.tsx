'use client';

import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Package, 
  Phone, 
  Mail,
  ArrowRight,
  Home,
  ShoppingCart
} from 'lucide-react';

export default function BuilderCheckoutSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Package className="h-3 w-3 mr-1" />
                בונה חבילות מותאמות
              </Badge>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                <span className="gradient-text">הזמנה התקבלה בהצלחה!</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                תודה על הזמנתך. נציג שלנו יצור איתך קשר בקרוב כדי לתאם את ההתקנה.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Success Message */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    הזמנה אושרה
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    ההזמנה שלך התקבלה בהצלחה! נציג שלנו יצור איתך קשר תוך 24 שעות כדי לתאם את ההתקנה.
                  </p>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-800">
                      מספר הזמנה: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-aegis-blue" />
                    יצירת קשר
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    לכל שאלה או בקשה, אנא צור איתנו קשר:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-aegis-blue" />
                      <span>+972-55-973-7025</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-aegis-blue" />
                      <span>support@aegisspectra.com</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Next Steps */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>מה קורה עכשיו?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-aegis-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-aegis-blue font-bold">1</span>
                    </div>
                    <h3 className="font-semibold mb-2">אישור הזמנה</h3>
                    <p className="text-sm text-muted-foreground">
                      נציג שלנו יצור איתך קשר תוך 24 שעות לאישור ההזמנה
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-aegis-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-aegis-blue font-bold">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">תיאום התקנה</h3>
                    <p className="text-sm text-muted-foreground">
                      נקבע מועד נוח להתקנה מקצועית של המערכת
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-aegis-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-aegis-blue font-bold">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">התקנה ואחריות</h3>
                    <p className="text-sm text-muted-foreground">
                      התקנה מקצועית עם אחריות מלאה של 12 חודשים
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => router.push('/builder')}
                className="bg-aegis-blue hover:bg-aegis-blue/90"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                בונה חבילות נוספות
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => router.push('/')}
              >
                <Home className="h-4 w-4 mr-2" />
                חזור לדף הבית
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
