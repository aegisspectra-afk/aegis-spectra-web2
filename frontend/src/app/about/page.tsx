"use client";

import { motion } from "framer-motion";
import { Shield, Award, Users, Clock, Target, Eye, Zap, Lock } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { TiltCard } from "@/components/TiltCard";

export default function AboutPage() {
  const stats = [
    { value: 500, suffix: "+", label: "לקוחות מרוצים", icon: Users },
    { value: 12, suffix: "", label: "שנות ניסיון", icon: Award },
    { value: 1000, suffix: "+", label: "התקנות מוצלחות", icon: Zap },
    { value: 100, suffix: "%", label: "שביעות רצון", icon: Shield },
  ];

  const values = [
    {
      icon: Shield,
      title: "מקצועיות",
      description: "ניסיון צבאי ומקצועי בהתקנות אבטחה מתקדמות"
    },
    {
      icon: Lock,
      title: "אמינות",
      description: "ציוד מוביל מהשוק (Provision ועוד) עם אחריות מלאה"
    },
    {
      icon: Eye,
      title: "שקיפות",
      description: "מחירים שקופים, תהליך ברור ותיעוד מלא"
    },
    {
      icon: Zap,
      title: "זמינות",
      description: "תמיכה 24/7, תגובה מהירה וזמינות גבוהה"
    }
  ];

  return (
    <main className="relative min-h-screen">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(113,113,122,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
      
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Hero Section */}
        <ScrollReveal>
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center size-20 bg-zinc-800/50 rounded-full border border-zinc-700/50 mb-6"
            >
              <Shield className="size-12 text-white" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              <span className="text-white">אודות Aegis Spectra</span>
            </h1>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
              חברת אבטחה ומיגון מתקדמת, המתמחה בהתקנות מקצועיות של ציוד מוביל מהשוק
              והגנה על בתים, עסקים וארגונים ברחבי ישראל
            </p>
          </div>
        </ScrollReveal>

        {/* Statistics */}
        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <TiltCard key={i} intensity={8}>
                  <motion.div
                    className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6 text-center hover:border-zinc-600 transition-all"
                    whileHover={{ y: -8 }}
                  >
                    <Icon className="size-8 text-zinc-300 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-white mb-2">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-sm text-zinc-400">{stat.label}</div>
                  </motion.div>
                </TiltCard>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Story Section */}
        <ScrollReveal delay={0.3}>
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Target className="size-8 text-white" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">הסיפור שלנו</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-8">
                <h3 className="text-xl font-bold text-white mb-4">מי אנחנו</h3>
                <p className="text-zinc-300 leading-relaxed mb-4">
                  Aegis Spectra היא חברת אבטחה ומיגון מתקדמת, המתמחה בהתקנות מקצועיות
                  של ציוד מוביל מהשוק (Provision, Hikvision ועוד) והגנה על בתים, עסקים וארגונים.
                </p>
                <p className="text-zinc-300 leading-relaxed">
                  אנו מביאים ניסיון צבאי ומקצועי להתקנות אבטחה מדויקות ואמינות,
                  עם דגש על איכות, מקצועיות ושירות אישי.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-8">
                <h3 className="text-xl font-bold text-white mb-4">מה אנחנו מציעים</h3>
                <p className="text-zinc-300 leading-relaxed mb-4">
                  אנו מתמחים בהתקנת מערכות אבטחה מתקדמות הכוללות:
                  מצלמות CCTV, אזעקות, בקרת כניסה, חיישנים חכמים ואינטגרציה מלאה.
                </p>
                <p className="text-zinc-300 leading-relaxed">
                  כל התקנה מבוצעת בצורה מקצועית ונקייה, עם הדרכה מלאה ואחריות של 12 חודשים.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Vision & Mission */}
        <ScrollReveal delay={0.4}>
          <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Eye className="size-8 text-white" />
                  <h3 className="text-2xl font-bold text-white">החזון שלנו</h3>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  להיות החברה המובילה בישראל להתקנות אבטחה ומיגון מתקדמות,
                  תוך שילוב בין טכנולוגיה מתקדמת, מקצועיות גבוהה ושירות אישי.
                  אנו שואפים לספק לכל לקוח פתרון אבטחה מותאם אישית, אמין ומקצועי.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="size-8 text-white" />
                  <h3 className="text-2xl font-bold text-white">המשימה שלנו</h3>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  לספק פתרונות אבטחה ומיגון מתקדמים, מקצועיים ואמינים,
                  תוך שימוש בציוד מוביל מהשוק (Provision, Hikvision ועוד),
                  התקנה מקצועית ונקייה, ותמיכה מלאה בעברית.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Values */}
        <ScrollReveal delay={0.5}>
          <section className="mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-12 text-center">
              הערכים שלנו
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, i) => {
                const Icon = value.icon;
                return (
                  <ScrollReveal key={i} delay={i * 0.1} direction="up">
                    <TiltCard intensity={10}>
                      <motion.div
                        className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6 text-center hover:border-zinc-600 transition-all h-full"
                        whileHover={{ y: -8 }}
                      >
                        <div className="inline-flex items-center justify-center size-16 bg-zinc-800/50 rounded-full mb-4 border border-zinc-700/50">
                          <Icon className="size-8 text-zinc-300" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                        <p className="text-zinc-300 leading-relaxed text-sm">{value.description}</p>
                      </motion.div>
                    </TiltCard>
                  </ScrollReveal>
                );
              })}
            </div>
          </section>
        </ScrollReveal>

        {/* Why Choose Us */}
        <ScrollReveal delay={0.6}>
          <section className="rounded-3xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 text-center">
              למה לבחור ב-Aegis Spectra?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "ציוד מוביל",
                  description: "אנו משתמשים בציוד מוביל מהשוק כמו Provision, Hikvision ועוד, עם אחריות מלאה"
                },
                {
                  title: "ניסיון מקצועי",
                  description: "ניסיון צבאי ומקצועי בהתקנות אבטחה מתקדמות, עם מאות התקנות מוצלחות"
                },
                {
                  title: "שירות אישי",
                  description: "תמיכה מלאה בעברית, הדרכה אישית ואחריות של 12 חודשים על כל התקנה"
                }
              ].map((item, i) => (
                <div key={i} className="rounded-xl border border-zinc-800/50 bg-black/30 p-6">
                  <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-zinc-300 leading-relaxed text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </main>
  );
}

