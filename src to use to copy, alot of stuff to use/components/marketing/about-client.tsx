'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/common/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Users, 
  Award, 
  Clock, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  Star,
  Camera,
  Lock,
  Bell,
  Wrench,
  ExternalLink
} from 'lucide-react';

export function AboutClient() {
  return (
    <>
      {/* Hero Section */}
      <Section className="pt-24 pb-16">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-aegis-heading">
              מי אנחנו
            </h1>
            <p className="text-xl text-aegis-secondary leading-relaxed">
              Aegis Spectra Security - מובילים בתחום המיגון והאבטחה בישראל עם למעלה מ-15 שנות ניסיון
            </p>
          </motion.div>

          {/* Company Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20"
          >
            <div>
              <h2 className="text-3xl font-heading font-bold mb-6 text-aegis-heading">
                החזון שלנו
              </h2>
              <p className="text-lg text-aegis-text mb-6 leading-relaxed">
                אנו מאמינים שכל בית ועסק ראויים לאבטחה מתקדמת ואמינה. 
                המשימה שלנו היא לספק פתרונות אבטחה מקצועיים, מותאמים אישית 
                ומבוססי טכנולוגיה מתקדמת.
              </p>
              <p className="text-lg text-aegis-text mb-8 leading-relaxed">
                עם צוות מומחים מנוסה ותשתית טכנולוגית מתקדמת, 
                אנו מבטיחים שירות מקצועי, אמין ויעיל לכל לקוח.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  15+ שנות ניסיון
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <Users className="h-4 w-4 mr-2" />
                  צוות מומחים
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <Award className="h-4 w-4 mr-2" />
                  תעודות מוסמכות
                </Badge>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-aegis-blue/10 to-aegis-teal/10 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-aegis-blue mb-2">500+</div>
                    <div className="text-sm text-aegis-secondary">התקנות מוצלחות</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-aegis-blue mb-2">24/7</div>
                    <div className="text-sm text-aegis-secondary">תמיכה טכנית</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-aegis-blue mb-2">100%</div>
                    <div className="text-sm text-aegis-secondary">שביעות רצון</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-aegis-blue mb-2">12</div>
                    <div className="text-sm text-aegis-secondary">חודשי אחריות</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4 text-aegis-heading">
                הצוות שלנו
              </h2>
              <p className="text-lg text-aegis-secondary max-w-2xl mx-auto">
                צוות מומחים מקצועי עם ניסיון רב בתחום האבטחה והמיגון
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center card-hover">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-aegis-blue to-aegis-teal rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl">מנהל טכני</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-aegis-secondary mb-4">
                    מומחה עם 15+ שנות ניסיון בהתקנת מערכות אבטחה מתקדמות
                  </p>
                  <div className="flex justify-center">
                    <Badge variant="outline">תעודת מתקין מיגון</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center card-hover">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-aegis-teal to-aegis-silver rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Camera className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl">מומחה מצלמות</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-aegis-secondary mb-4">
                    התמחות במצלמות IP, מערכות NVR/DVR וטכנולוגיות AI
                  </p>
                  <div className="flex justify-center">
                    <Badge variant="outline">תעודת טכנאי</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center card-hover">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-aegis-silver to-aegis-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Wrench className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl">מתקין בכיר</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-aegis-secondary mb-4">
                    התמחות בהתקנת מערכות אזעקה, קודנים ומערכות בקרת כניסה
                  </p>
                  <div className="flex justify-center">
                    <Badge variant="outline">תעודת התקנה</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Services Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4 text-aegis-heading">
                השירותים שלנו
              </h2>
              <p className="text-lg text-aegis-secondary max-w-2xl mx-auto">
                מגוון רחב של שירותי אבטחה מקצועיים
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center card-hover">
                <CardHeader>
                  <Camera className="h-12 w-12 text-aegis-blue mx-auto mb-4" />
                  <CardTitle className="text-lg">מצלמות אבטחה</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-aegis-secondary">
                    מצלמות IP איכותיות עם רזולוציה גבוהה וראיית לילה
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center card-hover">
                <CardHeader>
                  <Lock className="h-12 w-12 text-aegis-teal mx-auto mb-4" />
                  <CardTitle className="text-lg">מערכות קודנים</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-aegis-secondary">
                    קודנים מגנטיים ומערכות בקרת כניסה מתקדמות
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center card-hover">
                <CardHeader>
                  <Bell className="h-12 w-12 text-aegis-silver mx-auto mb-4" />
                  <CardTitle className="text-lg">מערכות אזעקה</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-aegis-secondary">
                    אזעקות אלחוטיות עם חיישני תנועה והתראות לנייד
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center card-hover">
                <CardHeader>
                  <Wrench className="h-12 w-12 text-aegis-blue mx-auto mb-4" />
                  <CardTitle className="text-lg">התקנה ותחזוקה</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-aegis-secondary">
                    התקנה מקצועית, הדרכה מלאה ותחזוקה שוטפת
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Certifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4 text-aegis-heading">
                התעודות וההסמכות שלנו
              </h2>
              <p className="text-lg text-aegis-secondary max-w-2xl mx-auto">
                תעודות מוסמכות ואישורים מקצועיים
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center card-hover">
                <CardHeader>
                  <Award className="h-16 w-16 text-aegis-blue mx-auto mb-4" />
                  <CardTitle className="text-xl">תעודת מתקין מיגון</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-aegis-secondary mb-4">
                    תעודה רשמית מטעם משרד התקשורת להתקנת מערכות מיגון
                  </p>
                  <Badge variant="secondary">תעודה רשמית</Badge>
                </CardContent>
              </Card>

              <Card className="text-center card-hover">
                <CardHeader>
                  <CheckCircle className="h-16 w-16 text-aegis-teal mx-auto mb-4" />
                  <CardTitle className="text-xl">תקני CE/FCC</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-aegis-secondary mb-4">
                    כל הציוד שלנו עומד בתקני CE האירופיים ותקני FCC האמריקניים
                  </p>
                  <Badge variant="secondary">תקנים בינלאומיים</Badge>
                </CardContent>
              </Card>

              <Card className="text-center card-hover">
                <CardHeader>
                  <Star className="h-16 w-16 text-aegis-silver mx-auto mb-4" />
                  <CardTitle className="text-xl">אישור משרד התקשורת</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-aegis-secondary mb-4">
                    אישור רשמי מטעם משרד התקשורת לפעילות בתחום המיגון
                  </p>
                  <Badge variant="secondary">אישור רשמי</Badge>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center bg-gradient-to-r from-aegis-blue/10 to-aegis-teal/10 rounded-2xl p-12"
          >
            <h2 className="text-3xl font-heading font-bold mb-6 text-aegis-heading">
              מוכנים להתחיל?
            </h2>
            <p className="text-lg text-aegis-secondary mb-8 max-w-2xl mx-auto">
              צרו קשר עכשיו לקבלת הצעת מחיר מותאמת אישית למערכת האבטחה שלכם
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="aegis" className="text-lg px-8 py-4">
                <a href="https://wa.me/972559737025" target="_blank" rel="noopener noreferrer">
                  <Phone className="h-5 w-5 mr-2" />
                  קבל הצעת מחיר ב-WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="aegisOutline" className="text-lg px-8 py-4">
                <a href="tel:+972559737025">
                  <Phone className="h-5 w-5 mr-2" />
                  התקשר עכשיו
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
}