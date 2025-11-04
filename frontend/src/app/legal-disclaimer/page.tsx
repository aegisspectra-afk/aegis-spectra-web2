"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { FileText, AlertTriangle, CheckCircle, Shield, Users, CreditCard, Camera, Lock, Zap } from "lucide-react";
import Link from "next/link";

export default function LegalDisclaimerPage() {
  return (
    <main className="min-h-screen bg-charcoal text-white">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm mb-6">
                <FileText className="size-4 text-zinc-300" />
                <span className="text-sm text-zinc-300 font-semibold">הצהרת אחריות ושימוש</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
                הצהרת אחריות ושימוש
              </h1>
              <p className="text-xl max-w-2xl mx-auto text-zinc-300">
                Aegis Spectra Security - תנאי שימוש בציוד אבטחה ומוצרים
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mb-8 p-4 rounded-lg bg-blue-500/20 border-2 border-blue-500/50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">
                  עודכן לאחרונה: אוקטובר 2025
                </span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="mb-8 p-6 bg-zinc-800/30 border border-zinc-700/50 rounded-lg">
              <p className="text-lg font-semibold mb-4 text-white">
                Aegis Spectra מספקת ציוד אבטחה, מצלמות, מערכות אזעקה, קודנים, מערכות גישה וציוד רשת לשימושים פרטיים ועסקיים.
              </p>
              <p className="font-semibold text-gold">
                החברה אינה נושאת באחריות לשימוש בלתי תקין, בלתי חוקי או בניגוד לייעוד הציוד במוצרים הנרכשים באתר.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-6">
            <ScrollReveal delay={0.3}>
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                  <Shield className="size-6 text-gold" />
                  שימוש חוקי ותקני
                </h2>
                <div className="space-y-4">
                  <p className="text-zinc-300">
                    כל המוצרים באתר מיועדים לשימוש חוקי בלבד ובהתאם לדין הישראלי. על המשתמש לוודא שהשימוש בציוד עומד בדרישות החוק, לרבות:
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>תקנות הגנת הפרטיות (צילום, הקלטה, שמירת מידע)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>חוק האזנת סתר, תשל"ט–1979</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>הוראות משרד התקשורת לגבי ציוד אלחוטי</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>הנחיות מכון התקנים למתח נמוך (CE / FCC)</span>
                    </li>
                  </ul>
                  <div className="p-4 rounded-lg bg-blue-500/20 border-2 border-blue-500/50">
                    <p className="text-sm font-semibold text-blue-300">
                      Aegis Spectra אינה אחראית לכל שימוש שאינו תואם את החוקים והתקנות הנ"ל.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                  <Camera className="size-6 text-gold" />
                  ציוד צילום והקלטה
                </h2>
                <div className="space-y-4">
                  <p className="text-zinc-300">
                    כללים חשובים לשימוש בציוד צילום והקלטה:
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>מצלמות אבטחה עם מיקרופון מובנה נועדו לצילום בלבד</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>הקלטת קול של אדם ללא ידיעתו או הסכמתו אסורה על פי חוק</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>אין להשתמש במצלמות או בציוד צילום במקומות ציבוריים או רגישים ללא אישור מתאים</span>
                    </li>
                  </ul>
                  <div className="p-4 rounded-lg bg-blue-500/20 border-2 border-blue-500/50">
                    <p className="text-sm font-semibold text-blue-300">
                      השימוש במצלמות מוסוות, ציוד ריגול או הקלטת קול סמויה – אסור בהחלט, והאחריות כולה על הלקוח בלבד.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                  <Zap className="size-6 text-gold" />
                  אחריות ליבוא, תקינה ושימוש
                </h2>
                <div className="space-y-4">
                  <p className="text-zinc-300">
                    תנאי התקינה והאחריות:
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>כל המוצרים המשווקים באתר עומדים בתקני CE / FCC למתח נמוך</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>במקרה של ייבוא עצמאי, האחריות על עמידה בדרישות מכון התקנים הישראליים חלה על הלקוח בלבד</span>
                    </li>
                  </ul>
                  <div className="p-4 rounded-lg bg-blue-500/20 border-2 border-blue-500/50">
                    <p className="text-sm font-semibold text-blue-300">
                      Aegis Spectra אינה אחראית לכל נזק, תקלה או עבירה הנובעים משימוש בציוד שאינו מאושר תקנית.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                  <Users className="size-6 text-gold" />
                  התקנות ושירותים
                </h2>
                <div className="space-y-4">
                  <p className="text-zinc-300">
                    תנאי השירות וההתקנה:
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>השירותים ניתנים על ידי טכנאים מוסמכים בלבד</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>הלקוח אחראי לוודא שהציוד מותקן בשטח פרטי ובאופן שאינו פוגע בפרטיות צד שלישי</span>
                    </li>
                  </ul>
                  <div className="p-4 rounded-lg bg-blue-500/20 border-2 border-blue-500/50">
                    <p className="text-sm font-semibold text-blue-300">
                      החברה אינה נושאת באחריות לכל התקנה, שינוי או חיבור שבוצעו על ידי גורם אחר.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.7}>
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                  <AlertTriangle className="size-6 text-gold" />
                  הגבלת אחריות
                </h2>
                <div className="space-y-4">
                  <p className="text-zinc-300">
                    Aegis Spectra אינה אחראית לכל נזק ישיר או עקיף, אובדן, תביעה או תלונה הנובעים מ:
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>שימוש בציוד בניגוד לייעודו</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>צילום, הקלטה או ניטור לא חוקיים</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>שימוש בציוד ריגול, האזנה או מעקב</span>
                    </li>
                  </ul>
                  <div className="p-4 rounded-lg bg-blue-500/20 border-2 border-blue-500/50">
                    <p className="text-sm font-semibold text-blue-300">
                      כל שימוש בציוד מהווה הסכמה מלאה לאחריות אישית של הלקוח בלבד.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.8}>
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                  <CreditCard className="size-6 text-gold" />
                  שימוש באתר ובחנות
                </h2>
                <div className="space-y-4">
                  <p className="text-zinc-300">
                    תנאי השימוש באתר ובחנות:
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>המחירים, התמונות והתיאורים באתר ניתנים לצורכי המחשה בלבד</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>החברה שומרת לעצמה את הזכות לעדכן מחירים, מפרטים או זמינות מוצרים ללא הודעה מוקדמת</span>
                    </li>
                  </ul>
                  <div className="p-4 rounded-lg bg-blue-500/20 border-2 border-blue-500/50">
                    <p className="text-sm font-semibold text-blue-300">
                      רכישה באתר מהווה הצהרה של הלקוח כי קרא והבין את תנאי השימוש והאחריות.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.9}>
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                  <FileText className="size-6 text-gold" />
                  פרטי יצירת קשר
                </h2>
                <div className="space-y-4">
                  <p className="text-zinc-300">
                    לכל שאלה בנושא תקינה, אחריות או שימוש בציוד:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-white">תמיכה טכנית</h4>
                      <p className="text-sm text-zinc-300">
                        אימייל: support@aegisspectra.com<br />
                        טלפון: +972-55-973-7025
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-white">שירות לקוחות</h4>
                      <p className="text-sm text-zinc-300">
                        WhatsApp – 24/7<br />
                        טלפון: +972-55-973-7025
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={1}>
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
      </div>

      <Footer />
    </main>
  );
}

