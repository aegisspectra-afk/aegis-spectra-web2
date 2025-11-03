'use client';

import { motion } from 'framer-motion';
import { Shield, Award, Users, Clock } from 'lucide-react';

const trustItems = [
  {
    icon: Shield,
    title: 'מחירים שקופים',
    description: 'ללא עמלות נסתרות או הפתעות',
  },
  {
    icon: Award,
    title: 'איכות מוכחת',
    description: 'ציוד איכותי עם אחריות מלאה',
  },
  {
    icon: Users,
    title: 'ניסיון מקצועי',
    description: 'ניסיון צבאי ומקצועי בהתקנות אבטחה',
  },
  {
    icon: Clock,
    title: 'שירות מהיר',
    description: 'התקנה תוך 24-72 שעות',
  },
];

export function Trust() {
  return (
    <section className="py-8 bg-gradient-to-r from-aegis-graphite/50 to-background">
      <div className="container-max">
        <div className="text-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-heading font-bold mb-6"
        >
          <span className="gradient-text">אמון ואיכות</span>
        </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {trustItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mx-auto mb-4 p-6 rounded-full bg-aegis-blue/10 w-fit">
                <Icon className="h-12 w-12 text-aegis-blue" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">
                {item.title}
              </h3>
              <p className="text-aegis-text leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          );
        })}
        </div>

        {/* Trust Logos Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-aegis-secondary mb-4">מומלץ על ידי לקוחות</p>
          <div className="flex flex-wrap justify-center items-center gap-4 opacity-60">
            {/* Placeholder for partner logos */}
            <div className="h-8 w-20 bg-muted rounded flex items-center justify-center">
              <span className="text-xs text-aegis-secondary">עסק 1</span>
            </div>
            <div className="h-8 w-20 bg-muted rounded flex items-center justify-center">
              <span className="text-xs text-aegis-secondary">עסק 2</span>
            </div>
            <div className="h-8 w-20 bg-muted rounded flex items-center justify-center">
              <span className="text-xs text-aegis-secondary">עסק 3</span>
            </div>
            <div className="h-8 w-20 bg-muted rounded flex items-center justify-center">
              <span className="text-xs text-aegis-secondary">עסק 4</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}