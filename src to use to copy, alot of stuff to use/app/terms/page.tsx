'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertTriangle, CheckCircle, Shield, Users, CreditCard } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <FileText className="h-3 w-3 mr-1" />
                תנאי שירות
              </Badge>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6" style={{color: '#F5F5F5'}}>
                תנאי שירות
              </h1>
              <p className="text-xl max-w-2xl mx-auto" style={{color: '#E0E0E0'}}>
                אנא קרא את התנאים האלה בעיון לפני השימוש בשירותים שלנו.
              </p>
            </div>

            <div className="mb-8 p-4 rounded-lg" style={{backgroundColor: '#1A73E8', border: '2px solid #1A73E8'}}>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" style={{color: '#FFFFFF'}} />
                <span className="text-sm font-medium" style={{color: '#FFFFFF'}}>
                  עודכן לאחרונה: 15 בינואר 2025
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-aegis-teal" />
                    תיאור השירות
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Aegis Spectra מספק שירותי התקנה מקצועיים של מערכות אבטחה כולל:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>התקנת מצלמות אבטחה IP איכותיות</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>מערכות קודנים ומנעולים מגנטיים</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>מערכות אזעקה אלחוטיות עם חיישנים</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>תצורה והדרכה מלאה על כל המערכות</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-aegis-teal" />
                    אחריות המשתמש
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    על ידי שימוש בשירותים שלנו, אתה מסכים ל:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>לספק מידע מדויק ומלא במהלך הרישום</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>לשמור על אבטחת פרטי החשבון שלך</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>להשתמש בשירות רק למטרות חוקיות</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>לעמוד בכל החוקים והתקנות החלים</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>לא לנסות להנדס לאחור או לסכן את המערכות שלנו</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-aegis-teal" />
                    תשלומים ואחריות
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    תנאי התשלום והאחריות שלנו:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>תשלום מראש או במזומן בעת ההתקנה</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>אחריות 12 חודשים על חלקים ועבודה (נזקי כוח עליון/ונדליזם לא כלול)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>ביקור תחזוקה חינם אחרי 60 יום</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>תמיכה טכנית ב-WhatsApp בימים א׳-ה׳ 09:00-18:00</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-aegis-teal" />
                    התחייבויות שירות
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    אנחנו מתחייבים לספק שירות מקצועי ואמין עם ההבטחות הבאות:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-aegis-teal/5 border border-aegis-teal/20 rounded-lg">
                      <h4 className="font-semibold mb-2 text-aegis-teal">זמן התקנה</h4>
                      <p className="text-sm text-muted-foreground">
                        התקנה תוך 24-72 שעות<br />
                        ביקור מדידה חינם תוך 48 שעות<br />
                        זמינות: א׳-ה׳ 09:00-18:00
                      </p>
                    </div>
                    <div className="p-4 bg-aegis-teal/5 border border-aegis-teal/20 rounded-lg">
                      <h4 className="font-semibold mb-2 text-aegis-teal">אחריות ותמיכה</h4>
                      <p className="text-sm text-muted-foreground">
                        אחריות 12 חודשים על חלקים ועבודה<br />
                        תמיכה ב-WhatsApp: 09:00-18:00<br />
                        ביקור תחזוקה אחרי 60 יום
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-aegis-teal" />
                    הגבלת אחריות
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    במידה המקסימלית המותרת בחוק:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>האחריות שלנו מוגבלת לסכום ששילמת עבור השירות</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>אנחנו לא אחראים לנזקים עקיפים, מקריים או תוצאיים</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>אנחנו מספקים את השירות "כפי שהוא" ללא ערבויות</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-aegis-teal" />
                    פרטי יצירת קשר
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    לשאלות על התנאים האלה:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">מחלקה משפטית</h4>
                      <p className="text-sm text-muted-foreground">
                        אימייל: legal@aegis-spectra.com<br />
                        טלפון: +972-55-973-7025
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">תמיכה כללית</h4>
                      <p className="text-sm text-muted-foreground">
                        אימייל: support@aegis-spectra.com<br />
                        טלפון: +972-55-973-7025
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}