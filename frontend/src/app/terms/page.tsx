"use client";

import { motion } from "framer-motion";
import { FileText, AlertTriangle, CheckCircle, Shield, Users, CreditCard } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(113,113,122,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
      
      <div className="max-w-4xl mx-auto px-4 py-20">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center size-16 bg-zinc-800/50 rounded-full border border-zinc-700/50 mb-6">
              <FileText className="size-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
              תנאי שירות
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
              אנא קרא את התנאים האלה בעיון לפני השימוש בשירותים שלנו.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mb-8 p-4 rounded-lg border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">
                עודכן לאחרונה: 15 בינואר 2025
              </span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="size-6 text-zinc-300" />
                תיאור השירות
              </h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                Aegis Spectra מספק שירותי התקנה מקצועיים של מערכות אבטחה כולל:
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">התקנת מצלמות אבטחה IP איכותיות</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">מערכות קודנים ומנעולים מגנטיים</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">מערכות אזעקה אלחוטיות עם חיישנים</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">תצורה והדרכה מלאה על כל המערכות</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="size-6 text-zinc-300" />
                אחריות המשתמש
              </h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                על ידי שימוש בשירותים שלנו, אתה מסכים ל:
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">לספק מידע מדויק ומלא במהלך הרישום</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">לשמור על אבטחת פרטי החשבון שלך</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">להשתמש בשירות רק למטרות חוקיות</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">לעמוד בכל החוקים והתקנות החלים</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard className="size-6 text-zinc-300" />
                תשלומים ואחריות
              </h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                תנאי התשלום והאחריות שלנו:
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">תשלום מראש או במזומן בעת ההתקנה</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">אחריות 12 חודשים על חלקים ועבודה (נזקי כוח עליון/ונדליזם לא כלול)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">ביקור תחזוקה חינם אחרי 60 יום</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">תמיכה טכנית ב-WhatsApp בימים א׳-ה׳ 09:00-18:00</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="size-6 text-zinc-300" />
                התחייבויות שירות
              </h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                אנחנו מתחייבים לספק שירות מקצועי ואמין עם ההבטחות הבאות:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">זמן התקנה</h3>
                  <p className="text-sm text-zinc-300">
                    התקנה תוך 24-72 שעות<br />
                    ביקור מדידה חינם תוך 48 שעות<br />
                    זמינות: א׳-ה׳ 09:00-18:00
                  </p>
                </div>
                <div className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">אחריות ותמיכה</h3>
                  <p className="text-sm text-zinc-300">
                    אחריות 12 חודשים על חלקים ועבודה<br />
                    תמיכה ב-WhatsApp: 09:00-18:00<br />
                    ביקור תחזוקה אחרי 60 יום
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="size-6 text-zinc-300" />
                הגבלת אחריות
              </h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                במידה המקסימלית המותרת בחוק:
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">האחריות שלנו מוגבלת לסכום ששילמת עבור השירות</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">אנחנו לא אחראים לנזקים עקיפים, מקריים או תוצאיים</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">אנחנו מספקים את השירות &quot;כפי שהוא&quot; ללא ערבויות</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="size-6 text-zinc-300" />
                פרטי יצירת קשר
              </h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                לשאלות על התנאים האלה:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-white mb-2">מחלקה משפטית</h3>
                  <p className="text-sm text-zinc-300">
                    אימייל: legal@aegis-spectra.com<br />
                    טלפון: +972-55-973-7025
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">תמיכה כללית</h3>
                  <p className="text-sm text-zinc-300">
                    אימייל: support@aegis-spectra.com<br />
                    טלפון: +972-55-973-7025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-12 text-center">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gold text-black px-8 py-4 font-bold text-lg hover:bg-gold/90 transition"
            >
              צור קשר
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}

