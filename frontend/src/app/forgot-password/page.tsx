"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Shield, CheckCircle } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useToastContext } from "@/components/ToastProvider";
import { trackPasswordReset } from "@/lib/analytics";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.ok) {
        setSuccess(true);
        showToast("קישור לאיפוס סיסמה נשלח לאימייל שלך", "success");
        trackPasswordReset();
      } else {
        showToast(data.error || "שגיאה בשליחת אימייל", "error");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      showToast("אירעה שגיאה. אנא נסה שוב מאוחר יותר", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-charcoal text-white">
      <Navbar />
      
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-8">
              <div className="size-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-6">
                <Shield className="size-8 text-gold" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
                שכחת סיסמה?
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base">
                לא נורא, אנחנו נשלח לך קישור לאיפוס סיסמה
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 sm:p-8 backdrop-blur-sm">
              {success ? (
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="size-16 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center mx-auto"
                  >
                    <CheckCircle className="size-8 text-green-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2 text-white">נשלח בהצלחה!</h2>
                    <p className="text-zinc-300 text-sm sm:text-base mb-4">
                      קישור לאיפוס סיסמה נשלח לאימייל שלך. אנא בדוק את תיבת הדואר הנכנס שלך.
                    </p>
                    <p className="text-zinc-400 text-xs sm:text-sm">
                      אם לא קיבלת את האימייל, בדוק את תיבת הספאם או נסה שוב בעוד כמה דקות.
                    </p>
                  </div>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-xl bg-gold text-black px-6 py-3 font-semibold hover:bg-gold/90 transition w-full sm:w-auto justify-center"
                  >
                    חזרה להתחברות
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      אימייל
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                      <input
                        type="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/30 border border-zinc-700 rounded-lg px-12 py-3 focus:outline-none focus:border-gold/70 transition text-white text-sm sm:text-base"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-gold text-black px-6 py-3 sm:py-4 font-semibold hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        שולח...
                      </>
                    ) : (
                      <>
                        שלח קישור לאיפוס
                        <ArrowRight className="size-5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
                <Link
                  href="/login"
                  className="text-sm text-zinc-400 hover:text-gold transition"
                >
                  חזרה להתחברות
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <Footer />
    </main>
  );
}

