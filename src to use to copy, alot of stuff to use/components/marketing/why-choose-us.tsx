'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, Shield, Wrench } from 'lucide-react';

const whyChooseUs = [
  {
    icon: CheckCircle,
    title: 'התקנה נקייה ומסודרת',
    description: 'כבלים נסתרים, סגירות מדויקות, הדרכה מלאה',
  },
  {
    icon: Clock,
    title: 'זמינות מהירה',
    description: 'תיאום והתקנה בתוך 24–72 שעות',
  },
  {
    icon: Shield,
    title: 'אחריות ואמון',
    description: '12 חודשי אחריות, תמיכה ב-WhatsApp, שקיפות מלאה במחיר',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            <span className="gradient-text">למה לבחור בנו?</span>
          </h2>
          <p className="text-xl text-aegis-secondary max-w-3xl mx-auto">
            אנחנו מביאים ניסיון צבאי ומקצועי להתקנות אבטחה מדויקות ואמינות
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {whyChooseUs.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center p-8 bg-background rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-aegis-blue/10 rounded-full mb-6">
                <item.icon className="h-8 w-8 text-aegis-blue" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-aegis-text leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}