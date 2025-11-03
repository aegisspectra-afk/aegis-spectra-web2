"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Camera, Lock, Zap, Phone, Star, ChevronRight, Check } from "lucide-react";
import LeadForm from "@/components/LeadForm";
import ProductCard from "@/components/ProductCard";
import SectionTitle from "@/components/SectionTitle";

export default function Home() {
  return (
    <main className="relative">
      {/* רקע גרעיני עדין */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(212,175,55,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />

      {/* NAV */}
      <nav className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="text-gold" />
          <span className="font-bold text-gold">Aegis Spectra</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#products" className="hover:text-gold">מוצרים</a>
          <a href="#packages" className="hover:text-gold">חבילות</a>
          <a href="#process" className="hover:text-gold">תהליך</a>
          <a href="#faq" className="hover:text-gold">שאלות נפוצות</a>
          <a href="#contact" className="rounded-full border border-gold px-4 py-2 hover:bg-gold hover:text-black transition">הזמנת ייעוץ חינם</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-10 md:pb-20">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            אבטחה חכמה. <span className="text-gold">נוכחות שקטה.</span><br />
            התקנה מדויקת לבית ולעסק.
          </h1>
          <p className="mt-4 text-zinc-300">
            Aegis Spectra Security – מיגון מתקדם בסגנון Noir: מצלמות AI, אזעקות ובקרת כניסה,
            תיעוד מלא ותמיכה אישית בעברית. כל התקנה – כמו שעון שוויצרי.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a href="#contact" className="rounded-xl bg-gold text-black px-5 py-3 font-semibold inline-flex items-center justify-center gap-2">
              הזמנת ייעוץ חינם <ChevronRight className="size-4" />
            </a>
            <a href="https://wa.me/9720000000000" className="rounded-xl border border-gold px-5 py-3 inline-flex items-center justify-center gap-2 hover:bg-gold/10">
              דברו איתנו ב-WhatsApp <Phone className="size-4" />
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            {[
              {icon: <Camera className="text-gold" />, t: "CCTV פרימיום"},
              {icon: <Lock className="text-gold" />, t: "בקרת כניסה חכמה"},
              {icon: <Zap className="text-gold" />, t: "פריסה נקייה ומהירה"},
              {icon: <Star className="text-gold" />, t: "אחריות 12 חודשים"},
            ].map((f,i)=>(
              <div key={i} className="flex items-center gap-2 opacity-90">
                {f.icon}<span>{f.t}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </header>

      {/* WHY US */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <SectionTitle title="למה Aegis Spectra?" subtitle="דיסקרטיות, טכנולוגיה ודיוק צבאי" />
        <div className="grid md:grid-cols-4 gap-4">
          {[
            {h:"דיסקרטיות זה ה-DNA", p:"עובדים נקי ושקט. אתם ישנים רגוע."},
            {h:"טכנולוגיה פרימיום", p:"מצלמות AI, אזעקות חכמות, אפליקציות בעברית."},
            {h:"תכנון כמו מבצע", p:"סיור, תרשים, פריסה, הדרכה. תיעוד מלא."},
            {h:"אחריות ושירות", p:"12 ח׳ ציוד, SLA לפי רמה, תמיכה אישית."},
          ].map((c,i)=>(
            <div key={i} className="rounded-2xl border border-zinc-800 bg-black/30 p-6">
              <h3 className="font-semibold mb-2 text-gold">{c.h}</h3>
              <p className="text-sm opacity-90">{c.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT HIGHLIGHT */}
      <section id="products" className="max-w-6xl mx-auto px-4 py-10">
        <SectionTitle title="מוצר דגל" subtitle="מערכת מוכנה להתקנה – בדוקה ומוגדרת" />
        <ProductCard
          sku="H-01-2TB"
          name="Home Cam H-01 (2 TB)"
          desc="2× מצלמות 4MP PoE + NVR 2TB + אפליקציה בעברית. ראיית לילה 30 מ׳, Plug & Play."
          priceRegular={2590}
          priceSale={2290}
          ctaHref="/product/H-01-2TB"
        />
      </section>

      {/* PACKAGES */}
      <section id="packages" className="max-w-6xl mx-auto px-4 py-10">
        <SectionTitle title="חבילות מותאמות" subtitle="Apartment / House / Business" />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title:"Apartment Basic",
              price:"החל מ-₪ 2,290",
              bullets:["2–3 מצלמות IP","NVR 4 ערוצים","אפליקציה בעברית","התקנה בסיסית"],
              featured:false
            },
            {
              title:"House Pro",
              price:"החל מ-₪ 5,990",
              bullets:["5–8 מצלמות 4K/Color","NVR 8–16","UPS + VLAN","אינטרקום שער"],
              featured:true
            },
            {
              title:"Business Suite",
              price:"החל מ-₪ 8,900",
              bullets:["6–12 מצלמות","אזור קופה","SLA Silver/Gold","דו״חות חודשיים"],
              featured:false
            }
          ].map((p,i)=>(
            <div key={i} className={`rounded-2xl border p-6 bg-black/30 ${p.featured ? "border-gold shadow-[0_0_0_1px_rgba(212,175,55,0.3)]" : "border-zinc-800"}`}>
              <h3 className="text-xl font-bold mb-2">{p.title}</h3>
              <p className="text-gold font-semibold mb-4">{p.price}</p>
              <ul className="space-y-2 text-sm">
                {p.bullets.map((b,bi)=>(
                  <li key={bi} className="flex items-center gap-2"><Check className="size-4 text-gold"/>{b}</li>
                ))}
              </ul>
              <a href="#contact" className="mt-6 inline-flex rounded-xl border border-gold px-4 py-2 hover:bg-gold hover:text-black">בקשת הצעת מחיר</a>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="max-w-6xl mx-auto px-4 py-10">
        <SectionTitle title="תהליך עבודה" subtitle="שקיפות, סדר ודיוק בכל שלב" />
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          {[
            {n:"01", h:"שיחה ופגישה באתר", p:"קובעים מועד, מגיעים וממפים נקודות."},
            {n:"02", h:"תרשים והצעה", p:"סקיצה + עלויות שקופות וחבילות שדרוג."},
            {n:"03", h:"התקנה נקייה", p:"תיוג כבלים, PoE, הקשחת NVR, הדרכה."},
            {n:"04", h:"מסירה ו-SLA", p:"דוח תקינות, אחריות 12 ח׳, תחזוקה תקופתית."},
          ].map((s,i)=>(
            <div key={i} className="rounded-2xl border border-zinc-800 bg-black/30 p-6">
              <div className="text-gold font-extrabold">{s.n}</div>
              <div className="font-semibold">{s.h}</div>
              <p className="opacity-90 mt-1">{s.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <SectionTitle title="מה לקוחות אומרים" subtitle="אמון שנבנה בשטח" />
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          {[
            {q:"התקנה נקייה ומדויקת. סוף סוף מרגישים בטוח בבית.", a:"דנה • רחובות"},
            {q:"גישה שקטה ומקצועית – כמו יחידה מיוחדת.", a:"אלכס • יבנה"},
            {q:"מוצר מעולה ותמיכה בעברית, מומלץ לעסקים.", a:"שירה • ראשון לציון"},
          ].map((t,i)=>(
            <div key={i} className="rounded-2xl border border-zinc-800 bg-black/30 p-6">
              <p className="mb-3">&ldquo;{t.q}&rdquo;</p>
              <div className="text-gold text-xs">{t.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-6xl mx-auto px-4 py-10">
        <SectionTitle title="שאלות נפוצות" subtitle="קצר ולעניין" />
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {[
            {q:"תוך כמה זמן מתקינים?", a:"בדרך כלל בתוך 1–3 ימי עסקים מרגע אישור ההצעה."},
            {q:"האם יש אחריות?", a:"כן. 12 חודשים לציוד ולעבודה, עם אפשרות הארכה."},
            {q:"אפשר צפייה מהנייד?", a:"כן. אפליקציה בעברית, הרשאות משתמשים והקשחה."},
            {q:"מה לגבי פרטיות?", a:"מתקינים שילוט, מגבילים צילום לשטח פרטי ומסבירים ללקוח."},
          ].map((f,i)=>(
            <div key={i} className="rounded-2xl border border-zinc-800 bg-black/30 p-6">
              <div className="font-semibold mb-1">{f.q}</div>
              <p className="opacity-90">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT / LEAD */}
      <section id="contact" className="max-w-6xl mx-auto px-4 py-10">
        <SectionTitle title="הזמנת ייעוץ חינם" subtitle="נחזור אליך לתיאום מהיר" />
        <div className="rounded-3xl border border-zinc-800 bg-black/30 p-6 md:p-8">
          <LeadForm />
          <p className="mt-4 text-xs opacity-70">יבנה, ישראל • support@aegisspectra.com • ‎+972-XX-XXX-XXXX</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 mt-10">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="opacity-80">© {new Date().getFullYear()} Aegis Spectra Security — כל הזכויות שמורות</div>
          <div className="flex gap-4 opacity-80">
            <a href="/legal" className="hover:text-gold">מדיניות פרטיות</a>
            <a href="/terms" className="hover:text-gold">תנאי שימוש</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
