'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Key, Bell, Wrench } from 'lucide-react';

const features = [
  {
    icon: Camera,
    title: 'מצלמות אבטחה',
    description: 'מצלמות IP איכותיות עם רזולוציה גבוהה, ראיית לילה וזיהוי תנועה חכם',
  },
  {
    icon: Key,
    title: 'מערכות קודנים',
    description: 'קודנים מגנטיים, מנעולים חכמים ומערכות בקרת כניסה מתקדמות',
  },
  {
    icon: Bell,
    title: 'מערכות אזעקה',
    description: 'אזעקות אלחוטיות עם חיישני תנועה, חלונות ודלתות + התראות לנייד',
  },
  {
    icon: Wrench,
    title: 'התקנה ותחזוקה',
    description: 'התקנה מקצועית, הדרכה מלאה ותחזוקה שוטפת לכל המערכות',
  },
];

export function Features() {
  return (
    <section className="py-8">
      <div className="container-max">
        <div className="text-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-heading font-bold mb-6"
        >
          <span className="gradient-text">השירותים שלנו</span>
        </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
      </div>
    </section>
  );
}