"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Shield, Camera, Lock, Zap, Phone, Star, ChevronRight, Check,
  TrendingUp, Award, Users, Clock, ArrowDown, Sparkles, Layers, Mail
} from "lucide-react";
import LeadForm from "@/components/LeadForm";
import ProductCard from "@/components/ProductCard";
import SectionTitle from "@/components/SectionTitle";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { TiltCard } from "@/components/TiltCard";
import { StickyNav } from "@/components/StickyNav";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Trust } from "@/components/Trust";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const parallaxX = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <main className="relative overflow-hidden">
      <StickyNav />
      
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Dynamic gradient background with mouse tracking */}
      <div 
        className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(
            circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
            rgba(212, 175, 55, 0.15) 0%,
            rgba(212, 175, 55, 0.05) 30%,
            transparent 70%
          ),
          radial-gradient(
            circle at 80% -10%,
            rgba(212, 175, 55, 0.12) 0%,
            transparent 50%
          ),
          linear-gradient(180deg, #0B0B0D 0%, #141418 100%)`
        }}
      />

      {/* Hero Section with Parallax */}
      <motion.header 
        style={{ opacity, y }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {typeof window !== 'undefined' && [...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gold/30"
              initial={{
                x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
                y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0,
              }}
              animate={{
                y: typeof window !== 'undefined' ? [null, Math.random() * window.innerHeight] : 0,
                x: typeof window !== 'undefined' ? [null, Math.random() * window.innerWidth] : 0,
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* NAV */}
        <nav className="absolute top-0 left-0 right-0 z-40 max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center gap-2 group" aria-label="Aegis Spectra - דף הבית">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Shield className="text-gold size-8 group-hover:text-gold/80 transition" aria-hidden="true" />
              </motion.div>
              <span className="font-bold text-gold text-xl group-hover:text-gold/80 transition">Aegis Spectra</span>
            </Link>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex items-center gap-6 text-sm"
          >
            {[
              { href: "#products", label: "מוצרים" },
              { href: "#packages", label: "חבילות" },
              { href: "#process", label: "תהליך" },
              { href: "#faq", label: "שאלות נפוצות" },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                className="hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-charcoal rounded px-2 py-1 transition relative group"
                aria-label={item.label}
                whileHover={{ y: -2 }}
              >
                {item.label}
                <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full" />
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              className="rounded-full border border-gold px-4 py-2 hover:bg-gold hover:text-black transition focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-charcoal relative overflow-hidden group"
              aria-label="הזמנת ייעוץ חינם"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">הזמנת ייעוץ חינם</span>
              <motion.span
                className="absolute inset-0 bg-gold"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          </motion.div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-20 md:pb-32 relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-4xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/10 backdrop-blur-sm mb-6"
            >
              <Sparkles className="size-4 text-gold" />
              <span className="text-sm text-gold font-semibold">המיגון המתקדם ביותר בישראל</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
            >
              <span className="block">אבטחה חכמה.</span>
              <motion.span
                className="block text-gold relative inline-block"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                נוכחות שקטה.
                <motion.span
                  className="absolute -bottom-2 right-0 w-full h-1 bg-gold/50"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                />
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="block mt-2"
              >
                התקנה מדויקת לבית ולעסק.
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-xl md:text-2xl text-zinc-300 mb-8 leading-relaxed"
            >
              Aegis Spectra Security – מיגון מתקדם בסגנון Noir: מצלמות AI, אזעקות ובקרת כניסה,
              תיעוד מלא ותמיכה אישית בעברית. כל התקנה – כמו שעון שוויצרי.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <motion.a
                href="#contact"
                className="group relative rounded-xl bg-gold text-black px-8 py-4 font-bold text-lg inline-flex items-center justify-center gap-2 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">הזמנת ייעוץ חינם</span>
                <ChevronRight className="size-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <motion.div
                  className="absolute inset-0 bg-gold/80"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
              <motion.a
                href="https://wa.me/972559737025"
                className="group rounded-xl border-2 border-gold px-8 py-4 font-bold text-lg inline-flex items-center justify-center gap-2 hover:bg-gold/10 backdrop-blur-sm relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="size-5 group-hover:rotate-12 transition-transform" />
                <span>דברו איתנו ב-WhatsApp</span>
                <motion.div
                  className="absolute inset-0 bg-gold/10"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {[
                { icon: Camera, label: "CCTV פרימיום", value: "4K+" },
                { icon: Lock, label: "בקרת כניסה חכמה", value: "AI" },
                { icon: Zap, label: "פריסה מהירה", value: "24h" },
                { icon: Star, label: "אחריות", value: "12m" },
              ].map((stat, i) => (
                <TiltCard key={i} intensity={10}>
                  <motion.div
                    className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6 hover:border-gold/50 transition-all group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <stat.icon className="size-8 text-gold mb-3 group-hover:scale-110 transition-transform" />
                    <div className="text-2xl font-bold text-gold mb-1">{stat.value}</div>
                    <div className="text-sm opacity-80">{stat.label}</div>
                  </motion.div>
                </TiltCard>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs opacity-60">גלול למטה</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown className="size-6 text-gold/60" />
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      {/* Statistics Section */}
      <section className="relative py-20 bg-gradient-to-b from-transparent to-black/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 500, suffix: "+", label: "לקוחות מרוצים", icon: Users },
              { value: 98, suffix: "%", label: "שיעור שביעות רצון", icon: Award },
              { value: 24, suffix: "h", label: "זמן תגובה ממוצע", icon: Clock },
              { value: 12, suffix: "m", label: "אחריות מלאה", icon: Shield },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <TiltCard intensity={8}>
                  <div className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-8 text-center hover:border-gold/50 transition-all group">
                    <stat.icon className="size-10 text-gold mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <div className="text-4xl font-extrabold text-gold mb-2">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-sm opacity-80">{stat.label}</div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <WhyChooseUs key="why-choose-us" />

      {/* PRODUCT HIGHLIGHT */}
      <section id="products" className="max-w-6xl mx-auto px-4 py-20 relative">
        <ScrollReveal>
          <SectionTitle title="מוצר דגל" subtitle="מערכת מוכנה להתקנה – בדוקה ומוגדרת" />
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard
              sku="H-01-2TB"
              name="Home Cam H-01 (2 TB)"
              desc="2× מצלמות 4MP PoE + NVR 2TB + אפליקציה בעברית. ראיית לילה 30 מ׳, Plug & Play."
              priceRegular={2590}
              priceSale={2290}
              ctaHref="/product/H-01-2TB"
            />
          </motion.div>
        </ScrollReveal>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="max-w-6xl mx-auto px-4 py-20 relative">
        <ScrollReveal>
          <SectionTitle title="חבילות מותאמות" subtitle="Apartment / House / Business" />
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Apartment Basic",
              price: "החל מ-₪ 2,290",
              bullets: ["2–3 מצלמות IP", "NVR 4 ערוצים", "אפליקציה בעברית", "התקנה בסיסית"],
              featured: false,
              gradient: "from-zinc-800/50 to-zinc-900/50"
            },
            {
              title: "House Pro",
              price: "החל מ-₪ 5,990",
              bullets: ["5–8 מצלמות 4K/Color", "NVR 8–16", "UPS + VLAN", "אינטרקום שער"],
              featured: true,
              gradient: "from-gold/20 to-gold/10"
            },
            {
              title: "Business Suite",
              price: "החל מ-₪ 8,900",
              bullets: ["6–12 מצלמות", "אזור קופה", "SLA Silver/Gold", "דו״חות חודשיים"],
              featured: false,
              gradient: "from-zinc-800/50 to-zinc-900/50"
            }
          ].map((p, i) => (
            <ScrollReveal key={i} delay={i * 0.15} direction="up">
              <TiltCard intensity={15}>
                <motion.div
                  className={`rounded-3xl border p-8 bg-gradient-to-br ${p.gradient} backdrop-blur-sm relative overflow-hidden group ${
                    p.featured
                      ? "border-gold shadow-[0_0_40px_rgba(212,175,55,0.3)] ring-2 ring-gold/20"
                      : "border-zinc-800/50"
                  }`}
                  whileHover={{ y: -12, scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  {p.featured && (
                    <motion.div
                      className="absolute top-0 right-0 bg-gold text-black px-4 py-1 rounded-bl-xl text-xs font-bold"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      מומלץ
                    </motion.div>
                  )}
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-gold transition">{p.title}</h3>
                  <div className="text-3xl font-extrabold text-gold mb-6">{p.price}</div>
                  <ul className="space-y-3 mb-8">
                    {p.bullets.map((b, bi) => (
                      <motion.li
                        key={bi}
                        className="flex items-center gap-3 text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: bi * 0.1 }}
                      >
                        <Check className="size-5 text-gold flex-shrink-0" />
                        <span>{b}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <motion.a
                    href="#contact"
                    className="block w-full rounded-xl border-2 border-gold px-6 py-3 text-center font-semibold hover:bg-gold hover:text-black transition relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">בקשת הצעת מחיר</span>
                    <motion.span
                      className="absolute inset-0 bg-gold"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                </motion.div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="max-w-6xl mx-auto px-4 py-20 relative">
        <ScrollReveal>
          <SectionTitle title="תהליך עבודה" subtitle="שקיפות, סדר ודיוק בכל שלב" />
        </ScrollReveal>
        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-20 right-0 left-0 h-0.5 bg-gradient-to-l from-gold/30 via-gold/50 to-gold/30" />
          
          {[
            { n: "01", h: "שיחה ופגישה באתר", p: "קובעים מועד, מגיעים וממפים נקודות.", icon: Phone },
            { n: "02", h: "תרשים והצעה", p: "סקיצה + עלויות שקופות וחבילות שדרוג.", icon: Layers },
            { n: "03", h: "התקנה נקייה", p: "תיוג כבלים, PoE, הקשחת NVR, הדרכה.", icon: Zap },
            { n: "04", h: "מסירה ו-SLA", p: "דוח תקינות, אחריות 12 ח׳, תחזוקה תקופתית.", icon: Award },
          ].map((s, i) => (
            <ScrollReveal key={i} delay={i * 0.15} direction="up">
              <TiltCard intensity={10}>
                <motion.div
                  className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-8 hover:border-gold/50 transition-all relative group"
                  whileHover={{ y: -8 }}
                >
                  <div className="absolute -top-4 right-8 size-12 rounded-full bg-gold border-4 border-charcoal flex items-center justify-center text-black font-bold text-lg group-hover:scale-110 transition-transform">
                    {s.n}
                  </div>
                  <div className="size-16 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center mb-6 mt-4 group-hover:bg-gold/20 transition-colors">
                    <s.icon className="size-8 text-gold" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-gold transition">{s.h}</h3>
                  <p className="text-sm opacity-90 leading-relaxed">{s.p}</p>
                </motion.div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-4 py-20 relative">
        <ScrollReveal>
          <SectionTitle title="מה לקוחות אומרים" subtitle="אמון שנבנה בשטח" />
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { q: "התקנה נקייה ומדויקת. סוף סוף מרגישים בטוח בבית.", a: "דנה • רחובות", rating: 5 },
            { q: "גישה שקטה ומקצועית – כמו יחידה מיוחדת.", a: "אלכס • יבנה", rating: 5 },
            { q: "מוצר מעולה ותמיכה בעברית, מומלץ לעסקים.", a: "שירה • ראשון לציון", rating: 5 },
          ].map((t, i) => (
            <ScrollReveal key={i} delay={i * 0.1} direction="up">
              <TiltCard intensity={8}>
                <motion.div
                  className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-8 hover:border-gold/50 transition-all h-full group"
                  whileHover={{ y: -8 }}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="size-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-lg mb-6 leading-relaxed">&ldquo;{t.q}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                    <div className="size-10 rounded-full bg-gold/20 flex items-center justify-center">
                      <span className="text-gold font-bold">{t.a.split(" • ")[0][0]}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gold">{t.a.split(" • ")[0]}</div>
                      <div className="text-xs opacity-70">{t.a.split(" • ")[1]}</div>
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FAQ key="faq" />

      {/* TRUST */}
      <Trust key="trust" />

      {/* CTA */}
      <CTA key="cta" />

      {/* CONTACT / LEAD */}
      <section id="contact" className="max-w-6xl mx-auto px-4 py-20 relative">
        <ScrollReveal>
          <SectionTitle title="הזמנת ייעוץ חינם" subtitle="נחזור אליך לתיאום מהיר" />
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <motion.div
            className="rounded-3xl border border-zinc-800/50 bg-gradient-to-br from-black/60 to-zinc-900/40 backdrop-blur-sm p-8 md:p-12 relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
          >
            {/* Background glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-gold/10 to-transparent opacity-50 blur-2xl" />
            <div className="relative z-10">
              <LeadForm />
              <p className="mt-6 text-sm opacity-70 text-center">
                יבנה, ישראל • aegisspectra@gmail.com • 055-973-7025
              </p>
            </div>
          </motion.div>
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800/50 mt-20 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-gold size-8" />
                <span className="font-bold text-gold text-xl">Aegis Spectra Security</span>
              </div>
              <p className="max-w-md text-zinc-400 text-sm leading-relaxed">
                אבטחה חכמה לבית ולעסק — מצלמות, בקרת כניסה וניהול מרחוק. 
                שירותי התקנה מקצועיים ותמיכה מקוונת.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4 text-gold">קישורים מהירים</h3>
              <ul className="space-y-2 text-sm">
                {[
                  { href: "/", label: "דף הבית" },
                  { href: "#products", label: "מוצרים" },
                  { href: "#packages", label: "חבילות" },
                  { href: "#contact", label: "צור קשר" },
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-zinc-400 hover:text-gold transition">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-semibold mb-4 text-gold">מידע משפטי</h3>
              <ul className="space-y-2 text-sm">
                {[
                  { href: "/privacy", label: "מדיניות פרטיות" },
                  { href: "/terms", label: "תנאי שירות" },
                  { href: "https://wa.me/972559737025", label: "WhatsApp" },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-zinc-400 hover:text-gold transition"
                      {...(link.href.startsWith("http") && {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-zinc-800/50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-zinc-400 text-sm">
                © {new Date().getFullYear()} Aegis Spectra Security — כל הזכויות שמורות
              </div>
              <div className="flex items-center gap-4 text-sm text-zinc-400">
                <a href="tel:+972559737025" className="hover:text-gold transition flex items-center gap-2">
                  <Phone className="size-4 text-gold" />
                  <span>055-973-7025</span>
                </a>
                <a href="mailto:aegisspectra@gmail.com" className="hover:text-gold transition flex items-center gap-2">
                  <Mail className="size-4 text-gold" />
                  <span>aegisspectra@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
