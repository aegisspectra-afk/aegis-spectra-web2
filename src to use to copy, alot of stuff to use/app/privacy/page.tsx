'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, Database, Trash2, Download, AlertTriangle, CheckCircle } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Shield className="h-3 w-3 mr-1" />
                מדיניות פרטיות
              </Badge>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6" style={{color: '#F5F5F5'}}>
                פרטיות והגנת נתונים
              </h1>
              <p className="text-xl max-w-2xl mx-auto" style={{color: '#E0E0E0'}}>
                הפרטיות והאבטחה של הנתונים שלך הם העדיפות העליונה שלנו. למד איך אנחנו מגנים על המידע שלך.
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
                    <Database className="h-5 w-5 mr-2 text-aegis-teal" />
                    איסוף נתונים
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    אנחנו אוספים רק את הנתונים הנדרשים לספק את שירותי האבטחה שלנו ביעילות.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>מידע חשבון:</strong> שם, אימייל, פרטי ארגון</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>נתוני אבטחה:</strong> הזנות מצלמות, לוגים של המערכת, נתוני זיהוי איומים</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>אנליטיקת שימוש:</strong> מדדי ביצועי מערכת, שימוש בתכונות</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-aegis-teal" />
                    עמידה ב-GDPR
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    אנחנו עומדים במלואם ב-GDPR ומספקים זכויות פרטיות מקיפות.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">הזכויות שלך</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• זכות לגשת לנתונים שלך</li>
                        <li>• זכות לתיקון</li>
                        <li>• זכות למחיקה</li>
                        <li>• זכות להעברת נתונים</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">צור קשר עם DPO</h4>
                      <p className="text-sm text-muted-foreground">
                        אימייל: privacy@aegis-spectra.com<br />
                        זמן תגובה: תוך 24 שעות
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-aegis-teal" />
                    אמצעי אבטחה
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    אנחנו מיישמים אמצעי אבטחה מקיפים להגנה על הנתונים שלך.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>• הצפנת AES-256 במנוחה</li>
                    <li>• TLS 1.3 לנתונים בתנועה</li>
                    <li>• אישור SOC 2 Type II</li>
                    <li>• ביקורות אבטחה קבועות</li>
                  </ul>
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