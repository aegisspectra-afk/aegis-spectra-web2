"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Shield, Camera, Lock, Zap, Phone, Star, ChevronRight, Check,
  TrendingUp, Award, Users, Clock, ArrowDown, Sparkles, Layers, Mail, User, LogOut,
  MessageSquare
} from "lucide-react";
import LeadForm from "@/components/LeadForm";
import ProductCard from "@/components/ProductCard";
import SectionTitle from "@/components/SectionTitle";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { TiltCard } from "@/components/TiltCard";
import { StickyNav } from "@/components/StickyNav";
import WhyChooseUs from "@/components/WhyChooseUs";
import Trust from "@/components/Trust";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import ExitIntentPopup from "@/components/ExitIntentPopup";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set mounted state immediately - no delay needed
    setIsMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener("mousemove", handleMouseMove);
      
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
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
        key={isMounted ? 'hero-mounted' : 'hero-loading'}
        style={{ opacity, y }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        initial={false}
        animate={{ opacity: 1 }}
      >
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {isMounted && [...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
                className="absolute w-2 h-2 rounded-full bg-gold/30"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
                  opacity: 0.3,
                }}
                animate={{
                  y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
                  x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920)],
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
        <nav className="absolute top-0 left-0 right-0 z-40 max-w-6xl mx-auto px-4 py-4 sm:py-5 hidden md:flex items-center justify-between">
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
                <Shield className="text-white size-8 group-hover:text-zinc-300 transition" aria-hidden="true" />
              </motion.div>
              <span className="font-bold text-white text-xl group-hover:text-zinc-300 transition">Aegis Spectra</span>
            </Link>
          </motion.div>
          <motion.div 
            key={isMounted ? 'nav-links-mounted' : 'nav-links-loading'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex items-center gap-6 text-sm"
          >
            {[
              { href: "/services", label: "שירותים" },
              { href: "/products", label: "מוצרים" },
              { href: "/about", label: "אודות" },
              { href: "/blog", label: "בלוג" },
              { href: "/contact", label: "צור קשר" },
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
            {/* Show login/register or dashboard/logout */}
            {typeof window !== 'undefined' && localStorage.getItem("user_token") ? (
              <div className="flex items-center gap-4">
                <motion.a
                  href="/user"
                  className="flex items-center gap-2 hover:text-gold transition"
                  whileHover={{ scale: 1.05 }}
                >
                  <User className="size-4" />
                  דשבורד
                </motion.a>
                <motion.button
                  onClick={() => {
                    localStorage.removeItem("user_token");
                    localStorage.removeItem("user_email");
                    localStorage.removeItem("user_name");
                    localStorage.removeItem("user_id");
                    localStorage.removeItem("user_role");
                    window.location.href = "/";
                  }}
                  className="flex items-center gap-2 text-zinc-400 hover:text-red-400 transition"
                  whileHover={{ scale: 1.05 }}
                >
                  <LogOut className="size-4" />
                  התנתק
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <motion.a
                  href="/login"
                  className="hover:text-gold transition"
                  whileHover={{ scale: 1.05 }}
                >
                  התחברות
                </motion.a>
                <motion.a
                  href="/register"
                  className="rounded-full border border-gold px-4 py-2 hover:bg-gold hover:text-black transition relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">הרשמה</span>
                  <motion.span
                    className="absolute inset-0 bg-gold"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              </div>
            )}
          </motion.div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-12 sm:pb-16 md:pb-20 lg:pb-32 relative z-30">
          <motion.div
            key="hero-content"
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm mb-6"
            >
              <Sparkles className="size-4 text-zinc-300" />
              <span className="text-sm text-zinc-300 font-semibold">המיגון המתקדם ביותר בישראל</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight mb-4 md:mb-6"
            >
              <span className="block">אבטחה חכמה.</span>
              <motion.span
                className="block text-white relative inline-block"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                הגנה בלתי נראית.
                <motion.span
                  className="absolute -bottom-2 right-0 w-full h-0.5 bg-zinc-600/50"
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
                פתרונות מיגון מתקדמים.
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-300 mb-6 md:mb-8 leading-relaxed"
            >
              Aegis Spectra Security – מיגון מתקדם בסגנון עילית: מצלמות AI, אזעקות ובקרת כניסה חכמה, 
              תיעוד מקיף ותמיכה מקצועית בעברית. כל התקנה – בסטנדרטים מקצועיים גבוהים.
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
                className="group relative rounded-xl bg-gold text-black px-4 sm:px-6 md:px-8 py-3 sm:py-4 font-bold text-sm sm:text-base md:text-lg inline-flex items-center justify-center gap-2 overflow-hidden w-full sm:w-auto"
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
                className="group rounded-xl border-2 border-zinc-600 px-4 sm:px-6 md:px-8 py-3 sm:py-4 font-bold text-sm sm:text-base md:text-lg inline-flex items-center justify-center gap-2 hover:bg-zinc-800/50 backdrop-blur-sm relative overflow-hidden w-full sm:w-auto"
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
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
            >
              {[
                { icon: Camera, label: "CCTV פרימיום", value: "4K+" },
                { icon: Lock, label: "בקרת כניסה חכמה", value: "AI" },
                { icon: Zap, label: "פריסה מהירה", value: "24h" },
                { icon: Star, label: "אחריות", value: "12m" },
              ].map((stat, i) => (
                <TiltCard key={i} intensity={10}>
                  <motion.div
                    className="rounded-xl sm:rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-4 sm:p-5 md:p-6 hover:border-zinc-600 transition-all group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <stat.icon className="size-6 sm:size-7 md:size-8 text-zinc-300 mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
                    <div className="text-xl sm:text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs sm:text-sm opacity-80">{stat.label}</div>
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
              <ArrowDown className="size-6 text-zinc-400" />
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      {/* Statistics Section */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-b from-transparent to-black/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { value: 500, suffix: "+", label: "לקוחות מרוצים", icon: Users },
              { value: 98, suffix: "%", label: "שיעור שביעות רצון", icon: Award },
              { value: 24, suffix: "h", label: "זמן תגובה ממוצע", icon: Clock },
              { value: 12, suffix: "m", label: "אחריות מלאה", icon: Shield },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <TiltCard intensity={8}>
                  <div className="rounded-xl sm:rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-4 sm:p-6 md:p-8 text-center hover:border-gold/50 transition-all group">
                    <stat.icon className="size-8 sm:size-9 md:size-10 text-gold mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                    <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gold mb-1 sm:mb-2">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs sm:text-sm opacity-80">{stat.label}</div>
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
      <section id="products" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative">
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
      <section id="packages" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative">
        <ScrollReveal>
          <SectionTitle title="חבילות מותאמות" subtitle="Apartment / House / Business" />
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
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
              gradient: "from-zinc-700/50 to-zinc-800/50"
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
                      ? "border-zinc-600 shadow-[0_0_20px_rgba(113,113,122,0.2)] ring-2 ring-zinc-700/30"
                      : "border-zinc-800/50"
                  }`}
                  whileHover={{ y: -12, scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  {p.featured && (
                    <motion.div
                      className="absolute top-0 right-0 bg-zinc-700 text-white px-4 py-1 rounded-bl-xl text-xs font-bold"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      מומלץ
                    </motion.div>
                  )}
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-zinc-200 transition">{p.title}</h3>
                  <div className="text-3xl font-extrabold text-white mb-6">{p.price}</div>
                  <ul className="space-y-3 mb-8">
                    {p.bullets.map((b, bi) => (
                      <motion.li
                        key={bi}
                        className="flex items-center gap-3 text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: bi * 0.1 }}
                      >
                        <Check className="size-5 text-zinc-300 flex-shrink-0" />
                        <span>{b}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <motion.a
                    href="/quote"
                    className="block w-full rounded-xl border-2 border-zinc-600 px-6 py-3 text-center font-semibold hover:bg-zinc-700 hover:text-white transition relative overflow-hidden group"
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
      <section id="process" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative">
        <ScrollReveal>
          <SectionTitle title="תהליך עבודה" subtitle="שקיפות, סדר ודיוק בכל שלב" />
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-20 right-0 left-0 h-0.5 bg-gradient-to-l from-zinc-700/30 via-zinc-600/50 to-zinc-700/30" />
          
          {[
            { n: "01", h: "שיחה ופגישה באתר", p: "קובעים מועד, מגיעים וממפים נקודות.", icon: Phone },
            { n: "02", h: "תרשים והצעה", p: "סקיצה + עלויות שקופות וחבילות שדרוג.", icon: Layers },
            { n: "03", h: "התקנה נקייה", p: "תיוג כבלים, PoE, הקשחת NVR, הדרכה.", icon: Zap },
            { n: "04", h: "מסירה ו-SLA", p: "דוח תקינות, אחריות 12 ח׳, תחזוקה תקופתית.", icon: Award },
          ].map((s, i) => (
            <ScrollReveal key={i} delay={i * 0.15} direction="up">
              <TiltCard intensity={10}>
                <motion.div
                  className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-8 hover:border-zinc-600 transition-all relative group"
                  whileHover={{ y: -8 }}
                >
                  <div className="absolute -top-4 right-8 size-12 rounded-full bg-zinc-700 border-4 border-charcoal flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                    {s.n}
                  </div>
                  <div className="size-16 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center mb-6 mt-4 group-hover:bg-zinc-700/50 transition-colors">
                    <s.icon className="size-8 text-zinc-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-zinc-200 transition">{s.h}</h3>
                  <p className="text-sm opacity-90 leading-relaxed">{s.p}</p>
                </motion.div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative">
        <ScrollReveal>
          <SectionTitle title="מה לקוחות אומרים" subtitle="אמון שנבנה בשטח" />
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {[
            { q: "התקנה נקייה ומדויקת. סוף סוף מרגישים בטוח בבית.", a: "דנה • רחובות", rating: 5 },
            { q: "גישה שקטה ומקצועית – כמו יחידה מיוחדת.", a: "אלכס • יבנה", rating: 5 },
            { q: "מוצר מעולה ותמיכה בעברית, מומלץ לעסקים.", a: "שירה • ראשון לציון", rating: 5 },
          ].map((t, i) => (
            <ScrollReveal key={i} delay={i * 0.1} direction="up">
              <TiltCard intensity={8}>
                <motion.div
                  className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-8 hover:border-zinc-600 transition-all h-full group"
                  whileHover={{ y: -8 }}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="size-4 fill-zinc-400 text-zinc-400" />
                    ))}
                  </div>
                  <p className="text-lg mb-6 leading-relaxed text-zinc-200">&ldquo;{t.q}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                    <div className="size-10 rounded-full bg-zinc-800/50 flex items-center justify-center">
                      <span className="text-zinc-300 font-bold">{t.a.split(" • ")[0][0]}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{t.a.split(" • ")[0]}</div>
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
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative">
        <ScrollReveal>
          <div className="text-center mb-12 sm:mb-16">
            <SectionTitle title="צור איתנו קשר" subtitle="נחזור אליך בהקדם לתיאום" />
            <p className="text-zinc-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
              אנחנו כאן כדי לעזור לך. צור איתנו קשר בכל נושא ונחזור אליך בהקדם
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
          {/* Contact Info */}
          <ScrollReveal delay={0.1}>
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-6">פרטי יצירת קשר</h2>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start gap-4 p-4 sm:p-6 rounded-xl border border-zinc-800 bg-black/30 hover:bg-black/50 transition">
                    <div className="size-10 sm:size-12 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Phone className="size-5 sm:size-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-sm sm:text-base">טלפון</h3>
                      <a 
                        href="tel:+972559737025" 
                        className="text-zinc-300 hover:text-gold transition text-sm sm:text-base"
                      >
                        +972-55-973-7025
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 sm:p-6 rounded-xl border border-zinc-800 bg-black/30 hover:bg-black/50 transition">
                    <div className="size-10 sm:size-12 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Mail className="size-5 sm:size-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-sm sm:text-base">אימייל</h3>
                      <a 
                        href="mailto:aegisspectra@gmail.com" 
                        className="text-zinc-300 hover:text-gold transition text-sm sm:text-base break-all"
                      >
                        aegisspectra@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 sm:p-6 rounded-xl border border-zinc-800 bg-black/30 hover:bg-black/50 transition">
                    <div className="size-10 sm:size-12 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="size-5 sm:size-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-sm sm:text-base">WhatsApp</h3>
                      <a 
                        href="https://wa.me/972559737025" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-300 hover:text-gold transition inline-flex items-center gap-2 text-sm sm:text-base"
                      >
                        שלח הודעה
                        <MessageSquare className="size-4" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 sm:p-6 rounded-xl border border-zinc-800 bg-black/30 hover:bg-black/50 transition">
                    <div className="size-10 sm:size-12 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Clock className="size-5 sm:size-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-sm sm:text-base">שעות פעילות</h3>
                      <p className="text-zinc-300 text-sm sm:text-base">
                        א׳-ה׳: 09:00-18:00<br />
                        ו׳: 09:00-13:00<br />
                        ש׳: סגור
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Contact Form */}
          <ScrollReveal delay={0.2}>
            <motion.div
              className="rounded-2xl border border-zinc-800 bg-black/30 backdrop-blur-sm p-6 sm:p-8 relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
            >
              {/* Background glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-gold/10 to-transparent opacity-50 blur-2xl" />
              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl font-bold mb-6">הזמנת ייעוץ חינם</h2>
                <LeadForm />
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800/50 mt-20 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
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
                  { href: "/services", label: "שירותים" },
                  { href: "/about", label: "אודות" },
                  { href: "/blog", label: "בלוג" },
                  { href: "#products", label: "מוצרים" },
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
                  { href: "/legal-disclaimer", label: "הצהרת אחריות" },
                  { href: "https://wa.me/972559737025", label: "WhatsApp" },
                ].map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        className="text-zinc-400 hover:text-gold transition"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-zinc-400 hover:text-gold transition">
                        {link.label}
                      </Link>
                    )}
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

      {/* Exit Intent Popup */}
      <ExitIntentPopup />
    </main>
  );
}
