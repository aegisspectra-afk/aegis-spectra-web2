'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  Phone, 
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Shield,
  Camera,
  Bell
} from 'lucide-react';
import Link from 'next/link';

const areas = [
  {
    id: 'tel-aviv',
    name: 'תל אביב',
    description: 'שירות מקצועי בכל רחבי תל אביב והמרכז',
    coverage: 'כל העיר',
    responseTime: '30-60 דקות',
    installations: '500+',
    rating: 4.9,
    color: 'from-blue-500 to-cyan-500',
    neighborhoods: [
      'רמת אביב', 'פלורנטין', 'נווה צדק', 'הצפון הישן',
      'הדרום הישן', 'יפו', 'רמת גן', 'גבעתיים'
    ]
  },
  {
    id: 'rishon-lezion',
    name: 'ראשון לציון',
    description: 'התקנות מקצועיות בראשון לציון וסביבתה',
    coverage: 'כל העיר',
    responseTime: '45-90 דקות',
    installations: '300+',
    rating: 4.8,
    color: 'from-green-500 to-emerald-500',
    neighborhoods: [
      'מרכז העיר', 'קרית ראשון', 'נווה אור', 'רמת אליהו',
      'קרית שרת', 'מערב ראשון', 'מזרח ראשון'
    ]
  },
  {
    id: 'holon',
    name: 'חולון',
    description: 'שירות אמין ומהיר בחולון',
    coverage: 'כל העיר',
    responseTime: '30-60 דקות',
    installations: '250+',
    rating: 4.9,
    color: 'from-purple-500 to-pink-500',
    neighborhoods: [
      'מרכז העיר', 'קרית שרת', 'נווה איתן', 'תחנת הרכבת',
      'גבעת אולגה', 'קרית עבודה'
    ]
  },
  {
    id: 'bat-yam',
    name: 'בת ים',
    description: 'התקנות מקצועיות בבת ים',
    coverage: 'כל העיר',
    responseTime: '30-60 דקות',
    installations: '200+',
    rating: 4.8,
    color: 'from-orange-500 to-red-500',
    neighborhoods: [
      'מרכז העיר', 'רמת יוסף', 'קרית שלום', 'השדרה',
      'הטיילת', 'קרית הלאום'
    ]
  },
  {
    id: 'ashdod',
    name: 'אשדוד',
    description: 'שירות מקצועי באשדוד וסביבתה',
    coverage: 'כל העיר',
    responseTime: '60-120 דקות',
    installations: '150+',
    rating: 4.7,
    color: 'from-teal-500 to-cyan-500',
    neighborhoods: [
      'מרכז העיר', 'קרית יובל', 'קרית גולדה', 'רמת יוחנן',
      'הנמל', 'קרית ביאליק'
    ]
  }
];

const services = [
  {
    title: 'התקנת מצלמות',
    description: 'התקנה מקצועית של מצלמות אבטחה',
    icon: Camera,
    features: ['מצלמות HD', 'ראיית לילה', 'הקלטה 24/7', 'ניטור מרחוק']
  },
  {
    title: 'מערכות אזעקה',
    description: 'התקנה ותחזוקה של מערכות אזעקה',
    icon: Bell,
    features: ['חיישני תנועה', 'חיישני דלת', 'פאנל בקרה', 'התראות מיידיות']
  },
  {
    title: 'בקרת כניסה',
    description: 'מערכות בקרת כניסה מתקדמות',
    icon: Shield,
    features: ['קודנים דיגיטליים', 'כרטיסי גישה', 'ניהול משתמשים', 'לוגים מפורטים']
  }
];

const benefits = [
  {
    title: 'שירות מקומי',
    description: 'טכנאים מקומיים עם הכרת האזור',
    icon: MapPin
  },
  {
    title: 'זמן תגובה מהיר',
    description: 'זמן תגובה מהיר לכל קריאה',
    icon: Clock
  },
  {
    title: 'תמיכה מקומית',
    description: 'תמיכה טכנית זמינה באזור',
    icon: Phone
  },
  {
    title: 'אחריות מקומית',
    description: 'אחריות מלאה עם שירות מקומי',
    icon: CheckCircle
  }
];

export default function AreasPage() {
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
                <span className="gradient-text">אזורי שירות</span>
              </h1>
              
              <p className="text-xl text-aegis-secondary max-w-3xl mx-auto mb-8">
                אנו מספקים שירות מקצועי בכל רחבי המרכז, 
                עם טכנאים מקומיים וזמן תגובה מהיר
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild variant="aegis" size="lg">
                  <Link href="/contact">
                    קבל הצעת מחיר
                    <ArrowRight className="h-5 w-5 mr-2" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg">
                  <Link href="#areas">
                    צפה באזורים
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Areas Grid */}
        <section id="areas" className="py-16">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                הערים שאנו משרתים
              </h2>
              <p className="text-lg text-aegis-secondary max-w-2xl mx-auto">
                שירות מקצועי בכל רחבי המרכז
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {areas.map((area, index) => (
                <motion.div
                  key={area.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${area.color} rounded-full flex items-center justify-center`}>
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold">{area.rating}</span>
                        </div>
                      </div>
                      
                      <CardTitle className="text-xl mb-2">{area.name}</CardTitle>
                      <CardDescription className="text-base mb-4">
                        {area.description}
                      </CardDescription>
                      
                      <div className="flex flex-wrap gap-2 text-sm text-aegis-secondary">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {area.responseTime}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {area.installations}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">שכונות שאנו משרתים:</h4>
                        <div className="flex flex-wrap gap-1">
                          {area.neighborhoods.slice(0, 4).map((neighborhood, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {neighborhood}
                            </Badge>
                          ))}
                          {area.neighborhoods.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{area.neighborhoods.length - 4} נוספות
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href={`/areas/${area.id}`}>
                          פרטים נוספים
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

        {/* Services Section */}
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
                השירותים שלנו
              </h2>
              <p className="text-lg text-aegis-secondary max-w-2xl mx-auto">
                מגוון רחב של שירותי אבטחה מקצועיים
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-aegis-teal to-aegis-blue rounded-full flex items-center justify-center">
                        <service.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">{service.title}</h3>
                      <p className="text-sm text-aegis-secondary mb-4">{service.description}</p>
                      
                      <ul className="space-y-1 text-xs text-aegis-secondary">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
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
                למה לבחור בשירות המקומי שלנו?
              </h2>
              <p className="text-lg text-aegis-secondary max-w-2xl mx-auto">
                יתרונות השירות המקומי שלנו
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
                מוכנים לקבל שירות מקצועי?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                צרו קשר עכשיו לקבלת הצעת מחיר מותאמת לאזור שלכם
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild variant="secondary" size="lg">
                  <Link href="/contact">
                    קבל הצעת מחיר
                    <ArrowRight className="h-5 w-5 mr-2" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-aegis-teal">
                  <Link href="/demo-visit">
                    קבע ביקור מדידה
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