'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/common/section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DemoVisitForm } from '@/components/forms/demo-visit-form';
import { 
  Camera, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Shield, 
  Users,
  Gift,
  Star,
  Phone,
  Mail,
  Calendar,
  Home,
  Building,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export function DemoVisitClient() {
  const benefits = [
    {
      icon: Camera,
      title: 'בדיקת מיקומים',
      description: 'נבדוק את המיקומים הטובים ביותר למצלמות אבטחה',
      color: 'from-blue-500/20 to-blue-600/20',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      icon: CheckCircle,
      title: 'הצעת מחיר מדויקת',
      description: 'נכין לך הצעת מחיר מפורטת ומדויקת',
      color: 'from-green-500/20 to-green-600/20',
      badgeColor: 'bg-green-100 text-green-800'
    },
    {
      icon: Users,
      title: 'ייעוץ מקצועי',
      description: 'נעזור לך לבחור את הפתרון המתאים ביותר',
      color: 'from-purple-500/20 to-purple-600/20',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      icon: Shield,
      title: 'תכנון מפורט',
      description: 'נכין תכנית התקנה מפורטת עם לוח זמנים',
      color: 'from-orange-500/20 to-orange-600/20',
      badgeColor: 'bg-orange-100 text-orange-800'
    }
  ];

  const testimonials = [
    {
      name: 'דני כהן',
      location: 'תל אביב',
      text: 'הביקור היה מקצועי מאוד. הטכנאי הסביר הכל בפירוט ונתן הצעה מדויקת.',
      rating: 5,
      icon: Home
    },
    {
      name: 'שרה לוי',
      location: 'חיפה',
      text: 'שירות מעולה! קיבלתי הצעה מפורטת והתקנה מקצועית.',
      rating: 5,
      icon: Building
    },
    {
      name: 'מיכאל רוזן',
      location: 'ירושלים',
      text: 'הביקור עזר לי להבין בדיוק מה אני צריך. מומלץ בחום!',
      rating: 5,
      icon: Home
    }
  ];

  const stats = [
    { label: 'ביקורי מדידה', value: '5000+' },
    { label: 'לקוחות מרוצים', value: '98%' },
    { label: 'זמן תגובה', value: '24 שעות' },
    { label: 'אחריות', value: '12 חודשים' }
  ];

  const processSteps = [
    {
      step: '1',
      title: 'הזמנת ביקור',
      description: 'מלא את הטופס ונחזור אליך תוך 24 שעות',
      icon: Calendar,
      color: 'from-blue-500/20 to-blue-600/20'
    },
    {
      step: '2',
      title: 'ביקור מדידה',
      description: 'טכנאי מקצועי יגיע לביקור מדידה חינם',
      icon: MapPin,
      color: 'from-green-500/20 to-green-600/20'
    },
    {
      step: '3',
      title: 'הצעת מחיר',
      description: 'תקבל הצעת מחיר מפורטת ומדויקת',
      icon: CheckCircle,
      color: 'from-purple-500/20 to-purple-600/20'
    },
    {
      step: '4',
      title: 'התקנה מקצועית',
      description: 'התקנה מקצועית עם אחריות מלאה',
      icon: Zap,
      color: 'from-orange-500/20 to-orange-600/20'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <Section className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-aegis-green/10 text-aegis-green border-aegis-green/20">
              <Gift className="h-3 w-3 mr-1" />
              ביקור מדידה חינם
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              הזמן ביקור מדידה מקצועי
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              טכנאי מקצועי יגיע אליך לביקור מדידה חינם, יבדוק את הצרכים שלך 
              ויכין הצעת מחיר מדויקת ומפורטת למערכת האבטחה שלך
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Stats Section */}
      <Section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-aegis-blue mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Benefits Section */}
      <Section className="py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              מה כולל ביקור המדידה?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ביקור מקצועי שיעזור לך לקבל את הפתרון המושלם לאבטחת הנכס שלך
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-full flex items-center justify-center`}>
                        <benefit.icon className="w-8 h-8 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{benefit.title}</CardTitle>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {benefit.description}
                    </p>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Process Steps Section */}
      <Section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              איך זה עובד?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              תהליך פשוט ומהיר לקבלת הצעת מחיר מדויקת למערכת האבטחה שלך
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center`}>
                        <step.icon className="w-8 h-8 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <Badge className="mb-2 bg-aegis-blue/10 text-aegis-blue">
                          שלב {step.step}
                        </Badge>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Form Section */}
      <Section className="py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              הזמן ביקור מדידה עכשיו
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              מלא את הטופס ונחזור אליך תוך 24 שעות לקביעת מועד הביקור
            </p>
          </motion.div>

          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-center">
                טופס הזמנת ביקור מדידה
              </CardTitle>
              <CardDescription className="text-center">
                כל המידע שתמסור יישמר בסודיות ולא יועבר לצדדים שלישיים
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DemoVisitForm />
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Testimonials Section */}
      <Section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              מה הלקוחות שלנו אומרים
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              אלפי לקוחות מרוצים כבר בחרו בנו לאבטחת הנכס שלהם
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-aegis-blue/10 rounded-full flex items-center justify-center">
                        <testimonial.icon className="h-4 w-4 text-aegis-blue" />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Contact Section */}
      <Section className="py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-6">
              מוכן להתחיל?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              הזמן ביקור מדידה חינם ותקבל הצעת מחיר מדויקת תוך 24 שעות
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <CheckCircle className="w-12 h-12 text-aegis-green mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">ללא התחייבות</h3>
                  <p className="text-sm text-muted-foreground">
                    ביקור מדידה חינם ללא כל התחייבות מצדך
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <Clock className="w-12 h-12 text-aegis-blue mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">תוך 24 שעות</h3>
                  <p className="text-sm text-muted-foreground">
                    נחזור אליך תוך 24 שעות לקביעת מועד הביקור
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <Shield className="w-12 h-12 text-aegis-blue mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">אחריות מלאה</h3>
                  <p className="text-sm text-muted-foreground">
                    אחריות של 12 חודשים על כל העבודה
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">צריך עזרה נוספת?</h3>
              <p className="text-muted-foreground mb-4">
                אם יש לך שאלות או צריך עזרה, אנחנו כאן לעזור לך
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="cta-button">
                  <Link href="/contact">
                    <Phone className="w-4 h-4 mr-2" />
                    צור קשר
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="mailto:info@aegis-spectra.co.il">
                    <Mail className="w-4 h-4 mr-2" />
                    שלח מייל
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
}