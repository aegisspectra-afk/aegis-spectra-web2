"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Shield, CheckCircle } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useToastContext } from "@/components/ToastProvider";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToastContext();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      showToast("קישור לא תקין", "error");
      router.push("/forgot-password");
      return;
    }
    setToken(tokenParam);
  }, [searchParams, router, showToast]);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return "סיסמה חייבת להכיל לפחות 8 תווים";
    if (!/[A-Z]/.test(pwd) && !/[א-ת]/.test(pwd)) return "סיסמה חייבת להכיל אות גדולה או אות עברית";
    if (!/[a-z]/.test(pwd)) return "סיסמה חייבת להכיל אות קטנה";
    if (!/[0-9]/.test(pwd)) return "סיסמה חייבת להכיל מספר";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) return "סיסמה חייבת להכיל תו מיוחד";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      showToast("קישור לא תקין", "error");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      showToast(passwordError, "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("הסיסמאות לא תואמות", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (data.ok) {
        setSuccess(true);
        showToast("סיסמה עודכנה בהצלחה! אתה יכול להתחבר עכשיו", "success");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        showToast(data.error || "שגיאה באיפוס סיסמה", "error");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      showToast("אירעה שגיאה. אנא נסה שוב מאוחר יותר", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

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
                איפוס סיסמה
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base">
                אנא הזן סיסמה חדשה
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
                    <h2 className="text-2xl font-bold mb-2 text-white">סיסמה עודכנה!</h2>
                    <p className="text-zinc-300 text-sm sm:text-base">
                      הסיסמה שלך עודכנה בהצלחה. אתה מועבר לדף ההתחברות...
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                      סיסמה חדשה
                    </label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/30 border border-zinc-700 rounded-lg px-12 py-3 focus:outline-none focus:border-gold/70 transition text-white text-sm sm:text-base"
                        placeholder="הכנס סיסמה חדשה"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300 transition"
                      >
                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      לפחות 8 תווים, אות גדולה, אות קטנה, מספר ותו מיוחד
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                      אימות סיסמה
                    </label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-black/30 border border-zinc-700 rounded-lg px-12 py-3 focus:outline-none focus:border-gold/70 transition text-white text-sm sm:text-base"
                        placeholder="הכנס שוב את הסיסמה"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300 transition"
                      >
                        {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !password || !confirmPassword}
                    className="w-full rounded-xl bg-gold text-black px-6 py-3 sm:py-4 font-semibold hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        מעדכן...
                      </>
                    ) : (
                      "אפס סיסמה"
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

