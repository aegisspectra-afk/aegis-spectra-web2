"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, Trash2, Download, AlertTriangle, CheckCircle } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(113,113,122,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
      
      <div className="max-w-4xl mx-auto px-4 py-20">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center size-16 bg-zinc-800/50 rounded-full border border-zinc-700/50 mb-6">
              <Shield className="size-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
              פרטיות והגנת נתונים
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
              הפרטיות והאבטחה של הנתונים שלך הם העדיפות העליונה שלנו. למד איך אנחנו מגנים על המידע שלך.
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
                <Database className="size-6 text-zinc-300" />
                איסוף נתונים
              </h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                אנחנו אוספים רק את הנתונים הנדרשים לספק את שירותי האבטחה שלנו ביעילות.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">מידע חשבון:</strong>
                    <span className="text-zinc-300"> שם, אימייל, פרטי ארגון</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">נתוני אבטחה:</strong>
                    <span className="text-zinc-300"> הזנות מצלמות, לוגים של המערכת, נתוני זיהוי איומים</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">אנליטיקת שימוש:</strong>
                    <span className="text-zinc-300"> מדדי ביצועי מערכת, שימוש בתכונות</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="size-6 text-zinc-300" />
                עמידה ב-GDPR
              </h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                אנחנו עומדים במלואם ב-GDPR ומספקים זכויות פרטיות מקיפות.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-white mb-3">הזכויות שלך</h3>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li>• זכות לגשת לנתונים שלך</li>
                    <li>• זכות לתיקון</li>
                    <li>• זכות למחיקה</li>
                    <li>• זכות להעברת נתונים</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-3">צור קשר עם DPO</h3>
                  <p className="text-sm text-zinc-300">
                    אימייל: privacy@aegis-spectra.com<br />
                    זמן תגובה: תוך 24 שעות
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800/50 bg-black/40 backdrop-blur-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Lock className="size-6 text-zinc-300" />
                אמצעי אבטחה
              </h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                אנחנו מיישמים אמצעי אבטחה מקיפים להגנה על הנתונים שלך.
              </p>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>• הצפנת AES-256 במנוחה</li>
                <li>• TLS 1.3 לנתונים בתנועה</li>
                <li>• אישור SOC 2 Type II</li>
                <li>• ביקורות אבטחה קבועות</li>
              </ul>
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

