"use client";

import { motion } from "framer-motion";
import { Shield, Camera, Lock, Zap, HardDrive, Cloud, Eye, Brain, Network, Smartphone, Car, Wifi } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { TiltCard } from "@/components/TiltCard";
import Link from "next/link";

export default function ServicesPage() {
  const cyberServices = [
    {
      icon: Brain,
      title: "Threat Detection AI",
      description: "מודול AI לזיהוי איומים - ניתוח פעילות חשודה ברשת ובמערכות המחשב, זיהוי אנומליות וחישוב Risk Score",
      features: ["זיהוי איומים בזמן אמת", "ניתוח AI מתקדם", "Risk Score אוטומטי", "החלטות אוטומטיות"]
    },
    {
      icon: Shield,
      title: "Cyber Defense Module",
      description: "מערכת הגנה אוטומטית על קבצים ומערכות, Auto-Quarantine, Event Timeline ותגובה ידנית",
      features: ["הגנה אוטומטית", "Auto-Quarantine", "Event Timeline", "תגובה ידנית"]
    },
    {
      icon: Zap,
      title: "Advanced Scanning",
      description: "סריקות מתקדמות של תהליכים, קבצים ותיקיות, אינטגרציה עם Nmap וסריקות אוטומטיות",
      features: ["סריקות מתקדמות", "אינטגרציה עם Nmap", "סריקות אוטומטיות", "ניתוח מעמיק"]
    },
    {
      icon: HardDrive,
      title: "User Management & Roles",
      description: "ניהול משתמשים והרשאות - super_admin, employee, private_client, business_client עם Dashboards מותאמים",
      features: ["ניהול משתמשים", "הרשאות גמישות", "Dashboards מותאמים", "אבטחה ברמת פרטים"]
    },
    {
      icon: Eye,
      title: "Reports & Analytics",
      description: "יצירת דוחות PDF ו-HTML, גרפים (Pie, Bar), Risk Score, ייצוא ושליחה אוטומטית",
      features: ["דוחות PDF/HTML", "גרפים מתקדמים", "Risk Score", "ייצוא אוטומטי"]
    },
    {
      icon: Cloud,
      title: "Spectra Cloud",
      description: "שמירה והצפנה של מידע בענן פרטי ללקוח, גישה מכל מכשיר, סנכרון בזמן אמת",
      features: ["ענן פרטי", "הצפנה מלאה", "גישה מכל מקום", "סנכרון בזמן אמת"]
    }
  ];

  const physicalServices = [
    {
      icon: Camera,
      title: "מצלמות חיצוניות ו-CCTV",
      description: "התקנת מערכות CCTV מתקדמות עם ציוד מוביל (Provision, Hikvision ועוד), רשתות אבטחה מקצועיות",
      features: ["ציוד מוביל (Provision, Hikvision)", "רשתות מקצועיות", "ראיית לילה", "צפייה מרחוק"]
    },
    {
      icon: Lock,
      title: "מערכות כניסה ובקרה",
      description: "התקנת מערכות כניסה ובקרה חכמות, אינטגרציה עם מערכת הסייבר, שליטה מרחוק",
      features: ["בקרת כניסה חכמה", "אינטגרציה מלאה", "שליטה מרחוק", "ניהול הרשאות"]
    },
    {
      icon: Network,
      title: "חיישנים ותיקונים אוטומטיים",
      description: "התקנת חיישנים חכמים, תגובה אוטומטית במקרה של חדירה, התראות בזמן אמת",
      features: ["חיישנים חכמים", "תגובה אוטומטית", "התראות בזמן אמת", "ניתוח AI"]
    },
    {
      icon: Car,
      title: "פתרונות IoT לרכב ואופנוע",
      description: "מערכות IoT לרכב ואופנוע עם שמירה בענן, מעקב GPS, התראות ונעילה מרחוק",
      features: ["IoT לרכב", "מעקב GPS", "שמירה בענן", "נעילה מרחוק"]
    },
    {
      icon: Smartphone,
      title: "אינטגרציה מלאה",
      description: "חיבור בין החומרה ל-Aegis Spectra - Live Feed, התראות חכמות, ניתוח AI של תנועות",
      features: ["Live Feed במערכת", "התראות חכמות", "ניתוח AI", "שמירה בענן"]
    },
    {
      icon: Wifi,
      title: "רשתות IoT ואבטחה",
      description: "התקנת רשתות IoT מאובטחות, חיבור כל החיישנים והחומרה למערכת מרכזית אחת",
      features: ["רשתות IoT", "אבטחה מתקדמת", "חיבור מרכזי", "ניהול אחוד"]
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
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              <span className="text-white">השירותים שלנו</span>
            </h1>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
              פתרונות אבטחה ומיגון מקיפים - משילוב בין סייבר מתקדם ובינה מלאכותית
              ועד מיגון פיזי מקצועי עם ציוד מוביל מהשוק
            </p>
          </div>
        </ScrollReveal>

        {/* Cyber Security Section */}
        <ScrollReveal delay={0.2}>
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-12">
              <Shield className="size-10 text-white" />
              <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                סייבר & AI
              </h2>
            </div>
            <p className="text-lg text-zinc-300 mb-12 max-w-3xl">
              מערכת סייבר מתקדמת עם בינה מלאכותית להגנה על מערכות מחשוב ונתונים,
              זיהוי איומים בזמן אמת ותגובה אוטומטית חכמה.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cyberServices.map((service, i) => {
                const Icon = service.icon;
                return (
                  <ScrollReveal key={i} delay={i * 0.1} direction="up">
                    <TiltCard intensity={10}>
                      <motion.div
                        className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6 hover:border-zinc-600 transition-all h-full flex flex-col"
                        whileHover={{ y: -8 }}
                      >
                        <div className="inline-flex items-center justify-center size-14 bg-zinc-800/50 rounded-xl mb-4 border border-zinc-700/50">
                          <Icon className="size-7 text-zinc-300" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                        <p className="text-zinc-300 leading-relaxed text-sm mb-4 flex-grow">
                          {service.description}
                        </p>
                        <ul className="space-y-2">
                          {service.features.map((feature, fi) => (
                            <li key={fi} className="flex items-center gap-2 text-sm text-zinc-400">
                              <div className="size-1.5 rounded-full bg-zinc-400" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </TiltCard>
                  </ScrollReveal>
                );
              })}
            </div>
          </section>
        </ScrollReveal>

        {/* Physical Security Section */}
        <ScrollReveal delay={0.3}>
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-12">
              <Camera className="size-10 text-white" />
              <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                מיגון פיזי
              </h2>
            </div>
            <p className="text-lg text-zinc-300 mb-12 max-w-3xl">
              התקנות מקצועיות של ציוד מוביל מהשוק (Provision, Hikvision ועוד). 
              <strong className="text-yellow-400">Aegis Spectra הינה עסק עצמאי ואינה נציג רשמי או מפיץ מורשה של המותגים הנ&quot;ל.</strong>
              מערכות CCTV, חיישנים, IoT ואינטגרציה מלאה עם מערכת הסייבר.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {physicalServices.map((service, i) => {
                const Icon = service.icon;
                return (
                  <ScrollReveal key={i} delay={i * 0.1} direction="up">
                    <TiltCard intensity={10}>
                      <motion.div
                        className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6 hover:border-zinc-600 transition-all h-full flex flex-col"
                        whileHover={{ y: -8 }}
                      >
                        <div className="inline-flex items-center justify-center size-14 bg-zinc-800/50 rounded-xl mb-4 border border-zinc-700/50">
                          <Icon className="size-7 text-zinc-300" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                        <p className="text-zinc-300 leading-relaxed text-sm mb-4 flex-grow">
                          {service.description}
                        </p>
                        <ul className="space-y-2">
                          {service.features.map((feature, fi) => (
                            <li key={fi} className="flex items-center gap-2 text-sm text-zinc-400">
                              <div className="size-1.5 rounded-full bg-zinc-400" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </TiltCard>
                  </ScrollReveal>
                );
              })}
            </div>
          </section>
        </ScrollReveal>

        {/* Integration Section */}
        <ScrollReveal delay={0.4}>
          <section className="rounded-3xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-8 md:p-12 mb-20">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <Network className="size-10 text-white" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                אינטגרציה מלאה
              </h2>
            </div>
            <p className="text-lg text-zinc-300 text-center mb-12 max-w-3xl mx-auto">
              החיבור בין החומרה ל-Aegis Spectra מאפשר קבלת Live Feed של מצלמות בתוך Dashboard,
              התראות חכמות, ניתוח AI של תנועות חשודות ושמירת מידע בענן.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Live Feed במערכת",
                  description: "צפייה ישירה במצלמות מתוך Dashboard של Aegis Spectra"
                },
                {
                  title: "התראות חכמות",
                  description: "התרעות אוטומטיות כאשר מתקיימת פעילות חשודה"
                },
                {
                  title: "ניתוח AI",
                  description: "ניתוח בינה מלאכותית של תנועות חשודות או ניסיונות פריצה"
                },
                {
                  title: "שמירה בענן",
                  description: "שמירת מידע וסטטיסטיקות בענן של החברה והלקוח"
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

        {/* CTA Section */}
        <ScrollReveal delay={0.5}>
          <div className="rounded-3xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
              מוכן להתחיל?
            </h2>
            <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">
              הזמינו ייעוץ חינם וקבלו הצעת מחיר מותאמת אישית לפתרון האבטחה המתאים לכם
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="rounded-xl bg-gold text-black px-8 py-4 font-bold text-lg inline-flex items-center justify-center gap-2 hover:bg-gold/90 transition"
              >
                הזמנת ייעוץ חינם
              </Link>
              <Link
                href="/products"
                className="rounded-xl border-2 border-zinc-600 px-8 py-4 font-bold text-lg inline-flex items-center justify-center gap-2 hover:bg-zinc-800/50 transition"
              >
                צפייה במוצרים
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}

