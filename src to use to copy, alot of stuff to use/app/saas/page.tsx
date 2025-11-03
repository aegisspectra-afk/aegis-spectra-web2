'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { waitlistFormSchema, type WaitlistFormData } from '@/lib/validate';
import { Section } from '@/components/common/section';
import { Monitor, Bell, Shield, Cloud, Smartphone, Settings, Phone, Mail, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';

export default function SaaSPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistFormSchema),
  });

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    try {
      // Send to Google Sheets via Apps Script
      const response = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: process.env.NEXT_PUBLIC_WEBHOOK_SECRET,
          name: data.name,
          phone: data.phone || '',
          city: data.company || 'לא צוין',
          type: 'waitlist',
          points: 'לא רלוונטי',
          notes: data.message || '',
          source: 'waitlist'
        }),
        mode: 'no-cors'
      });

      // Since we're using no-cors mode, we can't check response status
      // But we'll assume success if no error is thrown
      
      toast.success("✅ קיבלנו את הפרטים! נחזור אליך עד סוף היום.");
      reset();
      
    } catch (error) {
      toast.error('שגיאה בשליחת הטופס. אנא נסה שוב.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: Monitor,
      title: 'כניסה יחידה לכל האתרים/התקנים',
      description: 'גישה לכל מערכות האבטחה שלך מדשבורד מאוחד אחד',
    },
    {
      icon: Bell,
      title: 'בדיקת סטטוס התקנים וחיבוריות',
      description: 'ניטור בזמן אמת של כל ההתקנים המחוברים ובריאותם',
    },
    {
      icon: Shield,
      title: 'ניתוב התראות תנועה',
      description: 'התראות חכמות דרך אימייל/טלגרם/WhatsApp*',
    },
    {
      icon: Cloud,
      title: 'גיבוי ענן אופציונלי ודוחות בריאות',
      description: 'אחסון ענן מאובטח עם אנליטיקה מפורטת של בריאות המערכת',
    },
    {
      icon: Smartphone,
      title: 'גישה מבוססת תפקידים לצוותים',
      description: 'הרשאות מפורטות וניהול משתמשים לארגון שלך',
    },
    {
      icon: Settings,
      title: 'התאמה מתקדמת',
      description: 'התאמת המערכת לדרישות האבטחה הספציפיות שלך',
    },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="pt-20">
        {/* Hero Section */}
        <Section className="py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              <span className="gradient-text">פלטפורמת ניהול מצלמות מרחוק (בפיתוח)</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              פורטל לקוחות מאוחד עם סטטוס התקנים, התראות חכמות וגיבוי ענן אופציונלי — בכל מקום, בכל זמן.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="aegis" size="lg">
                <Link href="/coming-soon">
                  גישה לפאנל (בקרוב)
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/pricing">
                  צפה במחירים
                </Link>
              </Button>
            </div>
          </motion.div>
        </Section>

        {/* Features Grid */}
        <Section className="py-20 bg-gradient-to-b from-background to-aegis-graphite/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full card-hover glow-effect">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-4 rounded-full bg-aegis-teal/10 w-fit">
                        <Icon className="h-8 w-8 text-aegis-teal" />
                      </div>
                      <CardTitle className="text-xl font-heading">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </Section>

        {/* Waitlist Section */}
        <Section className="py-20">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                <span className="gradient-text">הצטרף לרשימת המתנה</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                הזמנות לבדיקה פרטית יוצאות בהדרגה. הצטרף לרשימת המתנה לקבלת גישה מוקדמת.
              </p>
            </motion.div>

            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-heading">
                  הרשמה מוקדמת
                </CardTitle>
                <CardDescription className="text-center">
                  השאר את הפרטים שלך ונשוחח על השירות החדש
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        שם מלא *
                      </label>
                      <Input
                        id="name"
                        {...register('name')}
                        className={errors.name ? 'border-destructive' : ''}
                        placeholder="הזן את שמך המלא"
                      />
                      {errors.name && (
                        <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        אימייל *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        className={errors.email ? 'border-destructive' : ''}
                        placeholder="example@email.com"
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      חברה (אופציונלי)
                    </label>
                    <Input
                      id="company"
                      {...register('company')}
                      placeholder="שם החברה"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      טלפון (אופציונלי)
                    </label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      placeholder="מספר טלפון"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      הודעה (אופציונלי)
                    </label>
                    <textarea
                      id="message"
                      {...register('message')}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-aegis-teal focus:border-transparent"
                      rows={3}
                      placeholder="ספר לנו על צרכי האבטחה שלך..."
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="aegis"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'מצטרף...' : 'הצטרף לרשימת המתנה'}
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-muted-foreground mb-3">או צור קשר ישירות:</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a 
                      href="https://wa.me/972559737025" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-aegis-teal hover:underline"
                    >
                      <Phone className="h-4 w-4" />
                      <span>+972-55-973-7025</span>
                    </a>
                    <a 
                      href="mailto:aegisspectra@gmail.com"
                      className="flex items-center space-x-2 text-aegis-teal hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      <span>aegisspectra@gmail.com</span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>
      </div>
      <Footer />
    </div>
  );
}