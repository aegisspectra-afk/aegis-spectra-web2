'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertTriangle, CheckCircle, Shield, Users, CreditCard, Camera, Lock, Zap } from 'lucide-react';

export default function LegalDisclaimerPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <FileText className="h-3 w-3 mr-1" />
                הצהרת אחריות ושימוש
              </Badge>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6" style={{color: '#F5F5F5'}}>
                הצהרת אחריות ושימוש
              </h1>
              <p className="text-xl max-w-2xl mx-auto" style={{color: '#E0E0E0'}}>
                Aegis Spectra Security - תנאי שימוש בציוד אבטחה ומוצרים
              </p>
            </div>

            <div className="mb-8 p-4 rounded-lg" style={{backgroundColor: '#1A73E8', border: '2px solid #1A73E8'}}>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" style={{color: '#FFFFFF'}} />
                <span className="text-sm font-medium" style={{color: '#FFFFFF'}}>
                  עודכן לאחרונה: אוקטובר 2025
                </span>
              </div>
            </div>

            <div className="mb-8 p-6 bg-aegis-graphite/10 border border-aegis-graphite/20 rounded-lg">
              <p className="text-lg font-semibold mb-4">
                Aegis Spectra מספקת ציוד אבטחה, מצלמות, מערכות אזעקה, קודנים, מערכות גישה וציוד רשת לשימושים פרטיים ועסקיים.
              </p>
              <p className="font-semibold text-aegis-teal">
                החברה אינה נושאת באחריות לשימוש בלתי תקין, בלתי חוקי או בניגוד לייעוד הציוד במוצרים הנרכשים באתר.
              </p>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-aegis-teal" />
                    שימוש חוקי ותקני
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    כל המוצרים באתר מיועדים לשימוש חוקי בלבד ובהתאם לדין הישראלי. על המשתמש לוודא שהשימוש בציוד עומד בדרישות החוק, לרבות:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>תקנות הגנת הפרטיות (צילום, הקלטה, שמירת מידע)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>חוק האזנת סתר, תשל"ט–1979</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>הוראות משרד התקשורת לגבי ציוד אלחוטי</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>הנחיות מכון התקנים למתח נמוך (CE / FCC)</span>
                    </li>
                  </ul>
                  <div className="p-4 rounded-lg" style={{backgroundColor: '#1A73E8', border: '2px solid #1A73E8'}}>
                    <p className="text-sm font-semibold" style={{color: '#FFFFFF'}}>
                      Aegis Spectra אינה אחראית לכל שימוש שאינו תואם את החוקים והתקנות הנ"ל.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-aegis-teal" />
                    ציוד צילום והקלטה
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    כללים חשובים לשימוש בציוד צילום והקלטה:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>מצלמות אבטחה עם מיקרופון מובנה נועדו לצילום בלבד</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>הקלטת קול של אדם ללא ידיעתו או הסכמתו אסורה על פי חוק</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>אין להשתמש במצלמות או בציוד צילום במקומות ציבוריים או רגישים ללא אישור מתאים</span>
                    </li>
                  </ul>
                  <div className="p-4 rounded-lg" style={{backgroundColor: '#1A73E8', border: '2px solid #1A73E8'}}>
                    <p className="text-sm font-semibold" style={{color: '#FFFFFF'}}>
                      השימוש במצלמות מוסוות, ציוד ריגול או הקלטת קול סמויה – אסור בהחלט, והאחריות כולה על הלקוח בלבד.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-aegis-teal" />
                    אחריות ליבוא, תקינה ושימוש
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    תנאי התקינה והאחריות:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>כל המוצרים המשווקים באתר עומדים בתקני CE / FCC למתח נמוך</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>במקרה של ייבוא עצמאי, האחריות על עמידה בדרישות מכון התקנים הישראליים חלה על הלקוח בלבד</span>
                    </li>
                  </ul>
                  <div className="p-4 rounded-lg" style={{backgroundColor: '#1A73E8', border: '2px solid #1A73E8'}}>
                    <p className="text-sm font-semibold" style={{color: '#FFFFFF'}}>
                      Aegis Spectra אינה אחראית לכל נזק, תקלה או עבירה הנובעים משימוש בציוד שאינו מאושר תקנית.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-aegis-teal" />
                    התקנות ושירותים
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    תנאי השירות וההתקנה:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>השירותים ניתנים על ידי טכנאים מוסמכים בלבד</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>הלקוח אחראי לוודא שהציוד מותקן בשטח פרטי ובאופן שאינו פוגע בפרטיות צד שלישי</span>
                    </li>
                  </ul>
                  <div className="p-4 rounded-lg" style={{backgroundColor: '#1A73E8', border: '2px solid #1A73E8'}}>
                    <p className="text-sm font-semibold" style={{color: '#FFFFFF'}}>
                      החברה אינה נושאת באחריות לכל התקנה, שינוי או חיבור שבוצעו על ידי גורם אחר.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-aegis-teal" />
                    הגבלת אחריות
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Aegis Spectra אינה אחראית לכל נזק ישיר או עקיף, אובדן, תביעה או תלונה הנובעים מ:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>שימוש בציוד בניגוד לייעודו</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>צילום, הקלטה או ניטור לא חוקיים</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>שימוש בציוד ריגול, האזנה או מעקב</span>
                    </li>
                  </ul>
                  <div className="p-4 rounded-lg" style={{backgroundColor: '#1A73E8', border: '2px solid #1A73E8'}}>
                    <p className="text-sm font-semibold" style={{color: '#FFFFFF'}}>
                      כל שימוש בציוד מהווה הסכמה מלאה לאחריות אישית של הלקוח בלבד.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-aegis-teal" />
                    שימוש באתר ובחנות
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    תנאי השימוש באתר ובחנות:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>המחירים, התמונות והתיאורים באתר ניתנים לצורכי המחשה בלבד</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>החברה שומרת לעצמה את הזכות לעדכן מחירים, מפרטים או זמינות מוצרים ללא הודעה מוקדמת</span>
                    </li>
                  </ul>
                  <div className="p-4 rounded-lg" style={{backgroundColor: '#1A73E8', border: '2px solid #1A73E8'}}>
                    <p className="text-sm font-semibold" style={{color: '#FFFFFF'}}>
                      רכישה באתר מהווה הצהרה של הלקוח כי קרא והבין את תנאי השימוש והאחריות.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-aegis-teal" />
                    פרטי יצירת קשר
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    לכל שאלה בנושא תקינה, אחריות או שימוש בציוד:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">תמיכה טכנית</h4>
                      <p className="text-sm text-muted-foreground">
                        אימייל: support@aegisspectra.com<br />
                        טלפון: +972-55-973-7025
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">שירות לקוחות</h4>
                      <p className="text-sm text-muted-foreground">
                        WhatsApp – 24/7<br />
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
