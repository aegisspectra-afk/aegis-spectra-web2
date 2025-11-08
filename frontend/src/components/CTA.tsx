"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { AnimatedCounter } from "./AnimatedCounter";

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-b from-black/40 via-zinc-900/30 to-black/40 relative">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              <span className="text-white">הגיע הזמן להצטרף אלינו</span>
            </h2>
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
              השאר את הפרטים שלך ונחזור אליך עם הצעה מותאמת אישית לאבטחה מתקדמת.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/quote"
                className="rounded-xl bg-gold text-black px-8 py-4 font-bold text-lg inline-flex items-center justify-center gap-2 hover:bg-gold/90 transition relative overflow-hidden group"
              >
                <motion.span
                  className="relative z-10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  קבל הצעת מחיר
                </motion.span>
                <ArrowRight className="size-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <motion.div
                  className="absolute inset-0 bg-gold/80"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
              <motion.a
                href="https://wa.me/972559737025"
                className="rounded-xl border-2 border-zinc-600 px-8 py-4 font-bold text-lg inline-flex items-center justify-center gap-2 hover:bg-zinc-800/50 backdrop-blur-sm transition relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="size-5 group-hover:rotate-12 transition-transform" />
                <span>דברו איתנו ב-WhatsApp</span>
              </motion.a>
            </div>

            {/* Stats */}
            <ScrollReveal delay={0.2}>
              <div className="mb-12">
                <p className="text-zinc-300 mb-6 text-lg">
                  הצטרף למאות לקוחות מרוצים שכבר בחרו באבטחה מתקדמת
                </p>
                <div className="flex justify-center items-center gap-8 opacity-80">
                  {[
                    { value: 500, suffix: "+", label: "לקוחות מרוצים" },
                    { value: 100, suffix: "%", label: "שביעות רצון" },
                    { value: 24, suffix: "h", label: "זמן תגובה" },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl font-bold text-white mb-2">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-sm text-zinc-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Contact Info */}
            <ScrollReveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-zinc-400">
                <a
                  href="tel:+972559737025"
                  className="flex items-center gap-2 hover:text-zinc-300 transition-colors"
                >
                  <Phone className="size-5 text-zinc-300" />
                  <span>055-973-7025</span>
                </a>
                <a
                  href="mailto:aegisspectra@gmail.com"
                  className="flex items-center gap-2 hover:text-zinc-300 transition-colors"
                >
                  <Mail className="size-5 text-zinc-300" />
                  <span>aegisspectra@gmail.com</span>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

