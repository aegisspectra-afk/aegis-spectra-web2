"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, Shield, Wrench } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { TiltCard } from "./TiltCard";

const whyChooseUs = [
  {
    icon: CheckCircle,
    title: "התקנה נקייה ומסודרת",
    description: "כבלים נסתרים, סגירות מדויקות, הדרכה מלאה",
  },
  {
    icon: Clock,
    title: "זמינות מהירה",
    description: "תיאום והתקנה בתוך 24–72 שעות",
  },
  {
    icon: Shield,
    title: "אחריות ואמון",
    description: "12 חודשי אחריות, תמיכה ב-WhatsApp, שקיפות מלאה במחיר",
  },
  {
    icon: Wrench,
    title: "תמיכה מקצועית",
    description: "ניסיון צבאי ומקצועי בהתקנות אבטחה מדויקות",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-black/20 relative">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              <span className="text-gold">למה לבחור בנו?</span>
            </h2>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
              אנחנו מביאים ניסיון צבאי ומקצועי להתקנות אבטחה מדויקות ואמינות
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUs.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.title} delay={index * 0.1} direction="up">
                <TiltCard intensity={10}>
                  <motion.div
                    className="text-center p-8 rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm hover:border-gold/50 transition-all group h-full"
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <div className="inline-flex items-center justify-center size-16 bg-gold/10 border border-gold/30 rounded-full mb-6 group-hover:bg-gold/20 transition-colors">
                      <Icon className="size-8 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 group-hover:text-gold transition">
                      {item.title}
                    </h3>
                    <p className="text-zinc-300 leading-relaxed">{item.description}</p>
                  </motion.div>
                </TiltCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

