'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Home, 
  Building,
  CheckCircle,
  ArrowRight,
  Camera,
  Shield,
  Bell,
  Lock
} from 'lucide-react';
import { useState } from 'react';

const visitTypes = [
  {
    id: 'home',
    title: 'בית פרטי',
    description: 'מדידה והתקנה לבית פרטי',
    icon: Home,
    duration: '1-2 שעות',
    price: 'חינם',
    features: [
      'מדידה מקצועית',
      'תכנון מערכת מותאמת',
      'הצעת מחיר מפורטת',
      'הדגמה של ציוד'
    ],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'business',
    title: 'עסק',
    description: 'מדידה והתקנה לעסק',
    icon: Building,
    duration: '2-4 שעות',
    price: 'חינם',
    features: [
      'ניתוח צרכים עסקיים',
      'תכנון מערכת מקיפה',
      'הצעת מחיר מפורטת',
      'הדגמה מקצועית'
    ],
    color: 'from-green-500 to-emerald-500'
  }
];

const processSteps = [
  {
    step: 1,
    title: 'תיאום פגישה',
    description: 'נקבע פגישה נוחה לכם',
    icon: Calendar
  },
  {
    step: 2,
    title: 'ביקור מקצועי',
    description: 'טכנאי מומחה מגיע למקום',
    icon: MapPin
  },
  {
    step: 3,
    title: 'מדידה וניתוח',
    description: 'מדידה מקצועית וניתוח צרכים',
    icon: Camera
  },
  {
    step: 4,
    title: 'הצעת מחיר',
    description: 'הצעת מחיר מפורטת תוך 24 שעות',
    icon: CheckCircle
  }
];

const benefits = [
  {
    title: 'מדידה מקצועית',
    description: 'טכנאים מומחים עם ניסיון של שנים',
    icon: Camera
  },
  {
    title: 'הצעת מחיר מדויקת',
    description: 'מחיר מדויק ללא הפתעות',
    icon: CheckCircle
  },
  {
    title: 'ייעוץ מקצועי',
    description: 'ייעוץ חינם לבחירת המערכת המושלמת',
    icon: Shield
  },
  {
    title: 'ללא התחייבות',
    description: 'אין התחייבות לרכישה',
    icon: Lock
  }
];

export default function DemoVisitPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    visitType: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
                <span className="gradient-text">ביקור מדידה חינם</span>
              </h1>
              
              <p className="text-xl text-aegis-secondary max-w-3xl mx-auto mb-8">
                קבלו ביקור מדידה מקצועי חינם! טכנאי מומחה יגיע אליכם, 
                ימדוד את המקום ויתאים לכם את המערכת המושלמת
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild variant="aegis" size="lg">
                  <a href="#booking-form">
                    קבע ביקור עכשיו
                    <Calendar className="h-5 w-5 mr-2" />
                  </a>
                </Button>
                
                <Button asChild variant="outline" size="lg">
                  <a href="#process">
                    למד על התהליך
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Visit Types Section */}
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
                סוגי ביקורים
              </h2>
              <p className="text-lg text-aegis-secondary max-w-2xl mx-auto">
                אנו מציעים ביקורי מדידה מותאמים לצרכים שלכם
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {visitTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="hover:shadow-xl transition-shadow">
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${type.color} rounded-full flex items-center justify-center`}>
                        <type.icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <CardTitle className="text-2xl mb-2">{type.title}</CardTitle>
                      <CardDescription className="text-base mb-4">
                        {type.description}
                      </CardDescription>
                      
                      <div className="flex justify-center gap-4 text-sm text-aegis-secondary">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {type.duration}
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {type.price}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <h4 className="font-semibold mb-3">מה כלול בביקור:</h4>
                      <ul className="space-y-2">
                        {type.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
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

        {/* Process Section */}
        <section id="process" className="py-16 bg-muted/30">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                איך זה עובד?
              </h2>
              <p className="text-lg text-aegis-secondary max-w-2xl mx-auto">
                תהליך פשוט ונוח לקבלת הצעת מחיר מקצועית
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-aegis-teal to-aegis-blue rounded-full flex items-center justify-center">
                        <step.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-aegis-teal mb-2">
                        {step.step}
                      </div>
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-aegis-secondary">{step.description}</p>
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
                למה לבחור בביקור מדידה?
              </h2>
              <p className="text-lg text-aegis-secondary max-w-2xl mx-auto">
                יתרונות הביקור המקצועי שלנו
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

        {/* Booking Form Section */}
        <section id="booking-form" className="py-16 bg-gradient-to-r from-aegis-teal to-aegis-blue text-white">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                קבע ביקור מדידה עכשיו
              </h2>
              <p className="text-xl max-w-2xl mx-auto">
                מלא את הטופס ונחזור אליך תוך 24 שעות לקביעת פגישה
              </p>
            </motion.div>

            <div className="max-w-2xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-white">שם מלא *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                          placeholder="הכנס את שמך המלא"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone" className="text-white">טלפון *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                          placeholder="050-123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-white">אימייל</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-white">כתובת *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                        placeholder="הכנס את הכתובת המלאה"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="visitType" className="text-white">סוג ביקור *</Label>
                        <select
                          id="visitType"
                          name="visitType"
                          value={formData.visitType}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 rounded-md bg-white/10 border border-white/20 text-white"
                        >
                          <option value="">בחר סוג ביקור</option>
                          <option value="home">בית פרטי</option>
                          <option value="business">עסק</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="preferredDate" className="text-white">תאריך מועדף</Label>
                        <Input
                          id="preferredDate"
                          name="preferredDate"
                          type="date"
                          value={formData.preferredDate}
                          onChange={handleInputChange}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="preferredTime" className="text-white">שעה מועדפת</Label>
                      <select
                        id="preferredTime"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-md bg-white/10 border border-white/20 text-white"
                      >
                        <option value="">בחר שעה</option>
                        <option value="morning">בוקר (8:00-12:00)</option>
                        <option value="afternoon">צהריים (12:00-16:00)</option>
                        <option value="evening">ערב (16:00-20:00)</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-white">הודעה נוספת</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                        placeholder="ספר לנו על הצרכים שלך או שאלות נוספות..."
                        rows={4}
                      />
                    </div>

                    <Button type="submit" variant="secondary" size="lg" className="w-full">
                      שלח בקשה לביקור
                      <ArrowRight className="h-5 w-5 mr-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}