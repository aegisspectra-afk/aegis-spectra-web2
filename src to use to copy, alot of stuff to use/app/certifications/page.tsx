'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Shield, 
  CheckCircle, 
  Star,
  Calendar,
  Building,
  Users,
  ArrowRight,
  Download,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const certifications = [
  {
    id: 'iso-27001',
    title: 'ISO 27001 - ניהול אבטחת מידע',
    description: 'תקן בינלאומי לניהול אבטחת מידע בארגונים',
    issuer: 'International Organization for Standardization',
    date: '2024',
    validity: '3 שנים',
    level: 'בינלאומי',
    icon: Shield,
    color: 'from-blue-500 to-cyan-500',
    benefits: [
      'הכרה בינלאומית',
      'תקן איכות מחמיר',
      'שקיפות מלאה',
      'עדכונים שוטפים'
    ]
  },
  {
    id: 'cctv-expert',
    title: 'מומחה מצלמות אבטחה',
    description: 'הסמכה מקצועית להתקנה ותחזוקה של מערכות CCTV',
    issuer: 'Aegis Spectra Academy',
    date: '2024',
    validity: '2 שנים',
    level: 'מקצועי',
    icon: Award,
    color: 'from-green-500 to-emerald-500',
    benefits: [
      'ידע טכני מתקדם',
      'התמחות במצלמות HD',
      'תחזוקה מקצועית',
      'פתרון בעיות'
    ]
  },
  {
    id: 'cyber-security',
    title: 'אבטחת סייבר מתקדמת',
    description: 'הסמכה מתקדמת באבטחת מערכות דיגיטליות',
    issuer: 'Cyber Security Institute',
    date: '2024',
    validity: '2 שנים',
    level: 'מתקדם',
    icon: Shield,
    color: 'from-purple-500 to-pink-500',
    benefits: [
      'הגנה מפני איומים',
      'ניתוח סיכונים',
      'תגובה מהירה',
      'מניעת פריצות'
    ]
  },
  {
    id: 'alarm-systems',
    title: 'מערכות אזעקה מקצועיות',
    description: 'הסמכה להתקנה ותחזוקה של מערכות אזעקה',
    issuer: 'Security Systems Association',
    date: '2024',
    validity: '2 שנים',
    level: 'מקצועי',
    icon: Award,
    color: 'from-orange-500 to-red-500',
    benefits: [
      'התקנה מקצועית',
      'תחזוקה שוטפת',
      'בדיקות תקופתיות',
      'תמיכה טכנית'
    ]
  }
];

const achievements = [
  {
    title: 'לקוחות מרוצים',
    number: '500+',
    description: 'לקוחות מרוצים ברחבי הארץ'
  },
  {
    title: 'שנות ניסיון',
    number: '15+',
    description: 'שנות ניסיון בתחום האבטחה'
  },
  {
    title: 'התקנות מוצלחות',
    number: '2000+',
    description: 'התקנות מוצלחות ללא תקלות'
  },
  {
    title: 'דירוג ממוצע',
    number: '4.9/5',
    description: 'דירוג ממוצע מלקוחות'
  }
];

const partners = [
  {
    name: 'Hikvision',
    description: 'יצרנית מצלמות אבטחה מובילה',
    logo: '/partners/hikvision.png'
  },
  {
    name: 'Dahua',
    description: 'טכנולוגיות אבטחה מתקדמות',
    logo: '/partners/dahua.png'
  },
  {
    name: 'Axis',
    description: 'מצלמות רשת מקצועיות',
    logo: '/partners/axis.png'
  },
  {
    name: 'Bosch',
    description: 'מערכות אבטחה תעשייתיות',
    logo: '/partners/bosch.png'
  }
];

export default function CertificationsPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-aegis-teal/5 via-background to-aegis-blue/5">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
                <span className="gradient-text">תעודות והסמכות</span>
              </h1>
              
              <p className="text-xl text-aegis-secondary max-w-3xl mx-auto mb-8">
                אנו גאים להציג את התעודות וההסמכות המקצועיות שלנו, 
                המבטיחות שירות איכותי ואמין ברמה הגבוהה ביותר
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild variant="aegis" size="lg">
                  <Link href="/contact">
                    קבל ייעוץ מקצועי
                    <ArrowRight className="h-5 w-5 mr-2" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg">
                  <Link href="#certifications">
                    צפה בתעודות
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-16">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                ההישגים שלנו
              </h2>
              <p className="text-lg text-aegis-secondary max-w-2xl mx-auto">
                מספרים שמדברים בעד עצמם
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-aegis-teal mb-2">
                        {achievement.number}
                      </div>
                      <h3 className="font-semibold mb-2">{achievement.title}</h3>
                      <p className="text-sm text-aegis-secondary">{achievement.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="py-16 bg-muted/30">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                התעודות שלנו
              </h2>
              <p className="text-lg text-aegis-secondary max-w-2xl mx-auto">
                הסמכות מקצועיות המבטיחות איכות שירות גבוהה
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-16 h-16 bg-gradient-to-r ${cert.color} rounded-full flex items-center justify-center`}>
                          <cert.icon className="h-8 w-8 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {cert.level}
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-xl mb-2">{cert.title}</CardTitle>
                      <CardDescription className="text-base mb-4">
                        {cert.description}
                      </CardDescription>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-aegis-secondary">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {cert.issuer}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {cert.date}
                        </div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-1" />
                          {cert.validity}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <h4 className="font-semibold mb-3">יתרונות התעודה:</h4>
                      <ul className="space-y-2 mb-6">
                        {cert.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href={`/certifications/${cert.id}`}>
                          צפה בתעודה
                          <ExternalLink className="h-4 w-4 mr-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-16">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                שותפים אסטרטגיים
              </h2>
              <p className="text-lg text-aegis-secondary max-w-2xl mx-auto">
                אנו עובדים עם היצרנים המובילים בעולם בתחום האבטחה
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                        <Building className="h-8 w-8 text-aegis-secondary" />
                      </div>
                      <h3 className="font-semibold mb-2">{partner.name}</h3>
                      <p className="text-sm text-aegis-secondary">{partner.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-aegis-teal to-aegis-blue text-white">
          <div className="container-max text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                מוכנים לעבוד עם המומחים?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                קבלו שירות מקצועי ממומחים מוסמכים עם תעודות בינלאומיות
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild variant="secondary" size="lg">
                  <Link href="/contact">
                    קבל הצעת מחיר
                    <ArrowRight className="h-5 w-5 mr-2" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-aegis-teal">
                  <Link href="/about">
                    למד עוד עלינו
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}