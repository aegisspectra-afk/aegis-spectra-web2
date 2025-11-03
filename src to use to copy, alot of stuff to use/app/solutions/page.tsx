'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Camera, 
  Bell, 
  Lock, 
  Home, 
  Building, 
  Users, 
  CheckCircle,
  ArrowRight,
  Star,
  Clock,
  Wrench
} from 'lucide-react';
import Link from 'next/link';

const solutions = [
  {
    id: 'home-security',
    title: 'אבטחה ביתית',
    description: 'מערכות אבטחה מתקדמות לבתים פרטיים',
    icon: Home,
    features: [
      'מצלמות אבטחה HD',
      'מערכת אזעקה חכמה',
      'בקרת כניסה דיגיטלית',
      'ניטור מרחוק 24/7',
      'אפליקציה לנייד'
    ],
    price: 'מ-₪1,990',
    color: 'from-blue-500 to-cyan-500',
    popular: true
  },
  {
    id: 'business-security',
    title: 'אבטחה עסקית',
    description: 'פתרונות אבטחה מקיפים לעסקים קטנים ובינוניים',
    icon: Building,
    features: [
      'מערכת מצלמות מתקדמת',
      'בקרת כניסה מקצועית',
      'מערכת אזעקה תעשייתית',
      'ניהול משתמשים',
      'דוחות מפורטים'
    ],
    price: 'מ-₪3,490',
    color: 'from-green-500 to-emerald-500',
    popular: false
  },
  {
    id: 'retail-security',
    title: 'אבטחה לחנויות',
    description: 'מערכות אבטחה מיוחדות לחנויות ומרכזי קניות',
    icon: Users,
    features: [
      'מצלמות זיהוי גניבות',
      'מערכת התראות מיידיות',
      'ניתוח התנהגות לקוחות',
      'אינטגרציה עם מערכות POS',
      'דוחות אנליטיקה'
    ],
    price: 'מ-₪2,490',
    color: 'from-purple-500 to-pink-500',
    popular: false
  }
];

const technologies = [
  {
    name: 'מצלמות HD',
    description: 'איכות תמונה גבוהה עם ראיית לילה',
    icon: Camera
  },
  {
    name: 'זיהוי פנים',
    description: 'טכנולוגיית AI מתקדמת לזיהוי אנשים',
    icon: Shield
  },
  {
    name: 'התראות חכמות',
    description: 'מערכת התראות מתקדמת עם סינון רעשים',
    icon: Bell
  },
  {
    name: 'אבטחת מידע',
    description: 'הצפנה מתקדמת ופרטיות מלאה',
    icon: Lock
  }
];

const benefits = [
  {
    title: 'התקנה מקצועית',
    description: 'צוות טכנאים מקצועיים עם ניסיון של שנים',
    icon: Wrench
  },
  {
    title: 'אחריות מלאה',
    description: 'אחריות 12 חודשים על כל המערכת',
    icon: CheckCircle
  },
  {
    title: 'תמיכה 24/7',
    description: 'שירות לקוחות זמין בכל שעות היממה',
    icon: Clock
  },
  {
    title: 'עדכונים חינם',
    description: 'עדכוני תוכנה ואבטחה ללא עלות נוספת',
    icon: Star
  }
];

export default function SolutionsPage() {
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
                <span className="gradient-text">פתרונות אבטחה מתקדמים</span>
              </h1>
              
              <p className="text-xl text-aegis-secondary max-w-3xl mx-auto mb-8">
                מערכות אבטחה מקצועיות המותאמות לצרכים שלך - 
                מבית פרטי ועד עסק גדול, יש לנו את הפתרון המושלם
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild variant="aegis" size="lg">
                  <Link href="/builder">
                    בנה מערכת מותאמת
                    <ArrowRight className="h-5 w-5 mr-2" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">
                    קבל ייעוץ חינם
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Solutions Grid */}
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
                פתרונות מותאמים אישית
              </h2>
              <p className="text-lg text-aegis-secondary max-w-2xl mx-auto">
                כל פתרון מותאם במיוחד לצרכים שלך ולסביבה שלך
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {solutions.map((solution, index) => (
                <motion.div
                  key={solution.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className={`relative overflow-hidden hover:shadow-xl transition-shadow ${
                    solution.popular ? 'ring-2 ring-aegis-teal' : ''
                  }`}>
                    {solution.popular && (
                      <Badge className="absolute top-4 left-4 bg-aegis-teal text-white">
                        הכי פופולרי
                      </Badge>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${solution.color} rounded-full flex items-center justify-center`}>
                        <solution.icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <CardTitle className="text-2xl mb-2">{solution.title}</CardTitle>
                      <CardDescription className="text-base">
                        {solution.description}
                      </CardDescription>
                      
                      <div className="text-2xl font-bold text-aegis-teal mt-4">
                        {solution.price}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <ul className="space-y-3 mb-6">
                        {solution.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button asChild className="w-full" variant={solution.popular ? "aegis" : "outline"}>
                        <Link href={`/builder?solution=${solution.id}`}>
                          בחר פתרון זה
                          <ArrowRight className="h-4 w-4 mr-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-16 bg-muted/30">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                טכנולוגיות מתקדמות
              </h2>
              <p className="text-lg text-aegis-secondary max-w-2xl mx-auto">
                אנו משתמשים בטכנולוגיות החדישות ביותר בתחום האבטחה
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-aegis-teal to-aegis-blue rounded-full flex items-center justify-center">
                        <tech.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">{tech.name}</h3>
                      <p className="text-sm text-aegis-secondary">{tech.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
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
                למה לבחור בנו?
              </h2>
              <p className="text-lg text-aegis-secondary max-w-2xl mx-auto">
                אנו מציעים שירות מקצועי ואמין עם תמיכה מלאה
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <benefit.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-sm text-aegis-secondary">{benefit.description}</p>
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
                מוכנים להתחיל?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                קבלו הצעת מחיר מותאמת אישית עבור המערכת המושלמת שלכם
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild variant="secondary" size="lg">
                  <Link href="/builder">
                    בנה מערכת עכשיו
                    <ArrowRight className="h-5 w-5 mr-2" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-aegis-teal">
                  <Link href="/contact">
                    דברו איתנו
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