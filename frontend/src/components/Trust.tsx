"use client";

import { motion } from "framer-motion";
import { Shield, Award, Users, Clock } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { TiltCard } from "./TiltCard";

const trustItems = [
  {
    icon: Shield,
    title: "מחירים שקופים",
    description: "ללא עמלות נסתרות או הפתעות",
  },
  {
    icon: Award,
    title: "איכות מוכחת",
    description: "ציוד איכותי עם אחריות מלאה",
  },
  {
    icon: Users,
    title: "ניסיון מקצועי",
    description: "ניסיון רב שנים בהתקנות אבטחה מקצועיות",
  },
  {
    icon: Clock,
    title: "שירות מהיר",
    description: "התקנה תוך 24-72 שעות",
  },
];

export default function Trust() {
  return (
    <section className="py-20 bg-gradient-to-b from-black/20 to-black/40 relative">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              <span className="text-white">אמון ואיכות</span>
            </h2>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
              מומלץ על ידי לקוחות ברחבי ישראל
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.title} delay={index * 0.1} direction="up">
                <TiltCard intensity={8}>
                  <motion.div
                    className="text-center p-8 rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm hover:border-zinc-600 transition-all group h-full flex flex-col"
                    whileHover={{ y: -8 }}
                  >
                    <div className="mx-auto mb-4 p-6 rounded-full bg-zinc-800/50 border border-zinc-700/50 w-fit group-hover:bg-zinc-700/50 transition-colors flex-shrink-0">
                      <Icon className="size-12 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-zinc-200 transition flex-shrink-0">
                      {item.title}
                    </h3>
                    <p className="text-zinc-300 leading-relaxed flex-grow">{item.description}</p>
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

