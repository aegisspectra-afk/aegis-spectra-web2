"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Shield, Camera, Building, Home, Star, CheckCircle, 
  Users, TrendingUp, Award, Clock, ArrowRight, Filter 
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type CaseStudy = {
  id: number;
  title: string;
  client: string;
  type: "residential" | "commercial" | "industrial";
  location: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  beforeImage?: string;
  afterImage?: string;
  stats: {
    cameras: number;
    responseTime: string;
    satisfaction: number;
  };
  testimonial?: {
    text: string;
    author: string;
    role: string;
  };
  tags: string[];
  completedAt: string;
};

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: "מערכת אבטחה מתקדמת לבית פרטי",
    client: "משפחה בתל אביב",
    type: "residential",
    location: "תל אביב",
    description: "התקנת מערכת אבטחה מלאה לבית פרטי עם 8 מצלמות 4MP, NVR 4TB, ואפליקציה בעברית.",
    challenge: "הצורך במערכת אבטחה מקצועית שתאפשר מעקב מרחוק, התראות חכמות, ואבטחה מלאה של הבית והחצר.",
    solution: "התקנו מערכת PoE מתקדמת עם 8 מצלמות 4MP, NVR 4TB עם הקלטה 24/7, אפליקציה בעברית עם התראות חכמות, והתקנה מקצועית תוך 6 שעות.",
    results: [
      "הגנה מלאה על הבית והחצר",
      "צפייה מרחוק בכל זמן",
      "התראות חכמות לנייד",
      "הקלטה 24/7 עם אחסון 4TB"
    ],
    stats: {
      cameras: 8,
      responseTime: "< 24 שעות",
      satisfaction: 100
    },
    testimonial: {
      text: "המערכת עובדת מושלם! אנחנו יכולים לראות את הבית מכל מקום, וההתראות מגיעות בזמן אמת. התקנה מקצועית ותמיכה מעולה.",
      author: "דוד כהן",
      role: "בעל הבית"
    },
    tags: ["מצלמות", "PoE", "אפליקציה", "התקנה"],
    completedAt: "2024-03-15"
  },
  {
    id: 2,
    title: "מערכת אבטחה לעסק קטן",
    client: "מסעדה בתל אביב",
    type: "commercial",
    location: "תל אביב",
    description: "התקנת מערכת אבטחה לעסק קטן עם 6 מצלמות, NVR 2TB, ואפליקציה לניהול מרחוק.",
    challenge: "הצורך במערכת אבטחה שתגן על העסק, תאפשר מעקב אחר פעילות העובדים, ותספק הקלטות איכותיות.",
    solution: "התקנו מערכת עם 6 מצלמות 4MP, NVR 2TB, אפליקציה לניהול מרחוק, והתקנה מקצועית תוך 4 שעות.",
    results: [
      "הגנה מלאה על העסק",
      "מעקב אחר פעילות העובדים",
      "הקלטות איכותיות",
      "ניהול מרחוק"
    ],
    stats: {
      cameras: 6,
      responseTime: "< 12 שעות",
      satisfaction: 98
    },
    testimonial: {
      text: "המערכת עובדת מעולה! אנחנו יכולים לראות את מה שקורה בעסק מכל מקום, וההקלטות עוזרות לנו לפתור בעיות. התקנה מקצועית ותמיכה מעולה.",
      author: "שרה לוי",
      role: "בעלת העסק"
    },
    tags: ["מצלמות", "עסק", "ניהול מרחוק"],
    completedAt: "2024-04-20"
  },
  {
    id: 3,
    title: "מערכת אבטחה מתקדמת למשרד",
    client: "חברת הייטק",
    type: "commercial",
    location: "הרצליה",
    description: "התקנת מערכת אבטחה מתקדמת למשרד עם 12 מצלמות, NVR 8TB, ואפליקציה לניהול מרחוק.",
    challenge: "הצורך במערכת אבטחה מתקדמת שתגן על המשרד, תאפשר מעקב אחר פעילות העובדים, ותספק הקלטות איכותיות.",
    solution: "התקנו מערכת עם 12 מצלמות 4MP, NVR 8TB, אפליקציה לניהול מרחוק, והתקנה מקצועית תוך יום אחד.",
    results: [
      "הגנה מלאה על המשרד",
      "מעקב אחר פעילות העובדים",
      "הקלטות איכותיות",
      "ניהול מרחוק מתקדם"
    ],
    stats: {
      cameras: 12,
      responseTime: "< 6 שעות",
      satisfaction: 100
    },
    testimonial: {
      text: "המערכת עובדת מעולה! אנחנו יכולים לראות את מה שקורה במשרד מכל מקום, וההקלטות עוזרות לנו לפתור בעיות. התקנה מקצועית ותמיכה מעולה.",
      author: "רון כהן",
      role: "מנהל IT"
    },
    tags: ["מצלמות", "משרד", "ניהול מרחוק", "מתקדם"],
    completedAt: "2024-05-10"
  }
];

const getTypeIcon = (type: CaseStudy["type"]) => {
  switch (type) {
    case "residential":
      return Home;
    case "commercial":
      return Building;
    case "industrial":
      return Shield;
    default:
      return Camera;
  }
};

const getTypeLabel = (type: CaseStudy["type"]) => {
  switch (type) {
    case "residential":
      return "מגורים";
    case "commercial":
      return "עסקי";
    case "industrial":
      return "תעשייתי";
    default:
      return "אחר";
  }
};

export default function PortfolioPage() {
  const [filterType, setFilterType] = useState<CaseStudy["type"] | "all">("all");

  const filteredStudies = filterType === "all" 
    ? caseStudies 
    : caseStudies.filter(study => study.type === filterType);

  const types: Array<{ value: CaseStudy["type"] | "all"; label: string; icon: any }> = [
    { value: "all", label: "הכל", icon: Camera },
    { value: "residential", label: "מגורים", icon: Home },
    { value: "commercial", label: "עסקי", icon: Building },
    { value: "industrial", label: "תעשייתי", icon: Shield },
  ];

  return (
    <main className="min-h-screen bg-charcoal text-white">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                פורטפוליו וסיפורי הצלחה
              </h1>
              <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
                גלה את הפרויקטים שלנו ולראות איך עזרנו ללקוחות להגן על הבית והעסק שלהם
              </p>
            </div>
          </ScrollReveal>

          {/* Filter */}
          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              {types.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setFilterType(type.value)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all ${
                      filterType === type.value
                        ? "bg-gold text-black border-gold font-semibold"
                        : "bg-black/30 border-zinc-700 text-zinc-300 hover:border-zinc-600"
                    }`}
                  >
                    <Icon className="size-5" />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Case Studies Grid */}
          <div className="space-y-16">
            {filteredStudies.map((study, index) => {
              const TypeIcon = getTypeIcon(study.type);
              return (
                <ScrollReveal key={study.id} delay={index * 0.1} direction="up">
                  <motion.div
                    className="rounded-2xl border border-zinc-800 bg-black/30 backdrop-blur-sm overflow-hidden"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid lg:grid-cols-2 gap-0">
                      {/* Images */}
                      {(study.beforeImage || study.afterImage) && (
                        <div className="grid grid-cols-2 gap-0">
                          {study.beforeImage && (
                            <div className="relative h-64 bg-zinc-800">
                              <div className="absolute top-4 right-4 z-10 bg-red-500/90 text-white px-3 py-1 rounded text-xs font-semibold">
                                לפני
                              </div>
                              <Image
                                src={study.beforeImage}
                                alt={`${study.title} - לפני`}
                                fill
                                className="object-cover"
                                loading="lazy"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            </div>
                          )}
                          {study.afterImage && (
                            <div className="relative h-64 bg-zinc-800">
                              <div className="absolute top-4 right-4 z-10 bg-green-500/90 text-white px-3 py-1 rounded text-xs font-semibold">
                                אחרי
                              </div>
                              <Image
                                src={study.afterImage}
                                alt={`${study.title} - אחרי`}
                                fill
                                className="object-cover"
                                loading="lazy"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-8 lg:p-12">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <TypeIcon className="size-5 text-gold" />
                              <span className="text-sm text-zinc-400">{getTypeLabel(study.type)}</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                              {study.title}
                            </h2>
                            <p className="text-zinc-400 text-sm">
                              {study.client} • {study.location}
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-zinc-300 mb-6 leading-relaxed">
                          {study.description}
                        </p>

                        {/* Challenge & Solution */}
                        <div className="space-y-4 mb-6">
                          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                            <h3 className="font-semibold text-gold mb-2 flex items-center gap-2">
                              <Shield className="size-4" />
                              האתגר
                            </h3>
                            <p className="text-zinc-300 text-sm leading-relaxed">
                              {study.challenge}
                            </p>
                          </div>
                          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                            <h3 className="font-semibold text-gold mb-2 flex items-center gap-2">
                              <CheckCircle className="size-4" />
                              הפתרון
                            </h3>
                            <p className="text-zinc-300 text-sm leading-relaxed">
                              {study.solution}
                            </p>
                          </div>
                        </div>

                        {/* Results */}
                        <div className="mb-6">
                          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <TrendingUp className="size-5 text-gold" />
                            התוצאות
                          </h3>
                          <ul className="space-y-2">
                            {study.results.map((result, i) => (
                              <li key={i} className="flex items-start gap-2 text-zinc-300 text-sm">
                                <CheckCircle className="size-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span>{result}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gold mb-1">
                              {study.stats.cameras}
                            </div>
                            <div className="text-xs text-zinc-400">מצלמות</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gold mb-1">
                              {study.stats.responseTime}
                            </div>
                            <div className="text-xs text-zinc-400">זמן תגובה</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gold mb-1 flex items-center justify-center gap-1">
                              <Star className="size-5 fill-yellow-400 text-yellow-400" />
                              {study.stats.satisfaction}%
                            </div>
                            <div className="text-xs text-zinc-400">שביעות רצון</div>
                          </div>
                        </div>

                        {/* Testimonial */}
                        {study.testimonial && (
                          <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-lg p-6 border border-gold/20 mb-6">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="size-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                                <Users className="size-6 text-gold" />
                              </div>
                              <div className="flex-1">
                                <p className="text-zinc-200 leading-relaxed mb-3 italic">
                                  &quot;{study.testimonial.text}&quot;
                                </p>
                                <div>
                                  <div className="font-semibold text-white">
                                    {study.testimonial.author}
                                  </div>
                                  <div className="text-sm text-zinc-400">
                                    {study.testimonial.role}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {study.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* CTA Section */}
          <ScrollReveal delay={0.3}>
            <div className="mt-20 text-center">
              <div className="rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-gold/10 to-gold/5 p-12 backdrop-blur-sm">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  רוצה לראות את הפרויקט שלך כאן?
                </h2>
                <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
                  צור איתנו קשר ונבנה לך מערכת אבטחה מותאמת אישית
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold text-black px-8 py-4 font-bold text-lg hover:bg-gold/90 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    צור קשר
                    <ArrowRight className="size-5" />
                  </motion.a>
                  <motion.a
                    href="/quote"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-zinc-600 px-8 py-4 font-bold text-lg hover:bg-zinc-800/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    בקשת הצעת מחיר
                    <ArrowRight className="size-5" />
                  </motion.a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <Footer />
    </main>
  );
}

