"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useToastContext } from "@/components/ToastProvider";
import { trackEmailVerification } from "@/lib/analytics";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToastContext();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("קישור לא תקין");
      showToast("קישור לא תקין", "error");
      return;
    }

    // Verify email
    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setStatus("success");
          setMessage(data.message || "האימייל אומת בהצלחה!");
          showToast("האימייל אומת בהצלחה!", "success");
          trackEmailVerification();
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.error || "שגיאה באימות אימייל");
          showToast(data.error || "שגיאה באימות אימייל", "error");
        }
      })
      .catch((error) => {
        console.error("Email verification error:", error);
        setStatus("error");
        setMessage("שגיאה באימות אימייל");
        showToast("שגיאה באימות אימייל", "error");
      });
  }, [searchParams, router, showToast]);

  return (
    <main className="min-h-screen bg-charcoal text-white">
      <Navbar />
      
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-8">
              <div className="size-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-6">
                <Mail className="size-8 text-gold" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
                אימות אימייל
              </h1>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 sm:p-8 backdrop-blur-sm text-center">
              {status === "loading" && (
                <div className="space-y-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="size-16 rounded-full bg-zinc-800/50 border-2 border-gold/50 flex items-center justify-center mx-auto"
                  >
                    <Loader2 className="size-8 text-gold" />
                  </motion.div>
                  <p className="text-zinc-300 text-sm sm:text-base">מאמת את האימייל שלך...</p>
                </div>
              )}

              {status === "success" && (
                <div className="space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="size-16 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center mx-auto"
                  >
                    <CheckCircle className="size-8 text-green-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2 text-white">האימייל אומת!</h2>
                    <p className="text-zinc-300 text-sm sm:text-base">{message}</p>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-2">
                      אתה מועבר לדף ההתחברות...
                    </p>
                  </div>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-xl bg-gold text-black px-6 py-3 font-semibold hover:bg-gold/90 transition text-sm sm:text-base"
                  >
                    המשך להתחברות
                  </Link>
                </div>
              )}

              {status === "error" && (
                <div className="space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="size-16 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center mx-auto"
                  >
                    <XCircle className="size-8 text-red-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2 text-white">שגיאה באימות</h2>
                    <p className="text-zinc-300 text-sm sm:text-base">{message}</p>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-2">
                      הקישור פג תוקף או לא תקין. אנא נסה שוב או פנה לתמיכה.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold text-black px-6 py-3 font-semibold hover:bg-gold/90 transition text-sm sm:text-base"
                    >
                      חזרה להתחברות
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-black/30 px-6 py-3 font-semibold hover:bg-zinc-800 transition text-sm sm:text-base"
                    >
                      צור קשר
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>

      <Footer />
    </main>
  );
}

