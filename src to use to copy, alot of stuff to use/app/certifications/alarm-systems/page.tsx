'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Award, 
  CheckCircle, 
  Calendar,
  Building,
  ArrowLeft,
  Download,
  ExternalLink,
  Star,
  Clock,
  Users
} from 'lucide-react';
import Link from 'next/link';

export default function AlarmSystemsPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <div className="py-16 bg-gradient-to-br from-aegis-teal/5 via-background to-aegis-blue/5">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center mb-6">
                <Button asChild variant="outline" size="sm" className="mr-4">
                  <Link href="/certifications">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    חזור לתעודות
                  </Link>
                </Button>
              </div>
              
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Bell className="h-12 w-12 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
                <span className="gradient-text">מערכות אזעקה מקצועיות</span>
              </h1>
              
              <p className="text-xl text-aegis-secondary max-w-3xl mx-auto mb-8">
                הסמכה מקצועית להתקנה ותחזוקה של מערכות אזעקה - 
                המומחיות הגבוהה ביותר בתחום מערכות האזעקה
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild variant="aegis" size="lg">
                  <Link href="/contact">
                    קבל ייעוץ מקצועי
                    <ExternalLink className="h-5 w-5 mr-2" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg">
                  <a href="/certificates/alarm-systems.pdf" download>
                    הורד תעודה
                    <Download className="h-5 w-5 mr-2" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Certificate Details */}
        <div className="py-16">
          <div className="container-max">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="text-2xl mb-4">פרטי התעודה</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">שם התעודה</h4>
                          <p className="text-aegis-secondary">מערכות אזעקה מקצועיות</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">מנפיק התעודה</h4>
                          <p className="text-aegis-secondary">Security Systems Institute</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">תאריך הנפקה</h4>
                          <p className="text-aegis-secondary">2024</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">תקופת תוקף</h4>
                          <p className="text-aegis-secondary">2 שנים</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">רמת הסמכה</h4>
                          <Badge variant="outline" className="text-xs">מקצועי</Badge>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">סטטוס</h4>
                          <Badge className="bg-green-500 text-white">פעיל</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="text-2xl mb-4">מה זה מערכות אזעקה מקצועיות?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-aegis-secondary mb-4">
                        הסמכה מקצועית המתמחה בהתקנה, תחזוקה ופתרון בעיות של מערכות אזעקה מתקדמות.
                        התעודה מוכיחה ידע מעמיק בטכנולוגיות אזעקה מודרניות וניהול מערכות אבטחה.
                      </p>
                      <p className="text-aegis-secondary mb-4">
                        ההסמכה כוללת הכשרה מקיפה בתחומי חיישני תנועה, חיישני פתיחה, 
                        פאנלי בקרה, מערכות התראה ואינטגרציה עם מערכות אבטחה אחרות.
                      </p>
                      <p className="text-aegis-secondary">
                        מומחי האזעקות שלנו עוברים הכשרה מתמשכת ועדכונים שוטפים 
                        על הטכנולוגיות החדישות ביותר בתחום מערכות האזעקה.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl mb-4">יתרונות התעודה</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold mb-1">התקנה מקצועית</h4>
                            <p className="text-sm text-aegis-secondary">התקנה מומחית ומדויקת</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold mb-1">תחזוקה מתקדמת</h4>
                            <p className="text-sm text-aegis-secondary">תחזוקה מקצועית שוטפת</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold mb-1">פתרון בעיות</h4>
                            <p className="text-sm text-aegis-secondary">אבחון ופתרון מהיר</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold mb-1">אינטגרציה</h4>
                            <p className="text-sm text-aegis-secondary">שילוב עם מערכות אחרות</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">פרטי התעודה</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-aegis-secondary" />
                          <span className="text-sm">Security Systems Institute</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-aegis-secondary" />
                          <span className="text-sm">תאריך: 2024</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-aegis-secondary" />
                          <span className="text-sm">תוקף: 2 שנים</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-2 text-aegis-secondary" />
                          <span className="text-sm">רמה: מקצועי</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">תחומי התמחות</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Badge variant="outline" className="mr-2 mb-2">חיישני תנועה</Badge>
                        <Badge variant="outline" className="mr-2 mb-2">חיישני פתיחה</Badge>
                        <Badge variant="outline" className="mr-2 mb-2">פאנלי בקרה</Badge>
                        <Badge variant="outline" className="mr-2 mb-2">מערכות התראה</Badge>
                        <Badge variant="outline" className="mr-2 mb-2">אינטגרציה</Badge>
                        <Badge variant="outline" className="mr-2 mb-2">תחזוקה</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">פעולות</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button asChild variant="aegis" size="sm" className="w-full">
                          <Link href="/contact">
                            קבל ייעוץ
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <a href="/certificates/alarm-systems.pdf" download>
                            הורד תעודה
                          </a>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <Link href="/solutions">
                            פתרונות אזעקות
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
