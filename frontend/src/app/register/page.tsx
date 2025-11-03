"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Eye, EyeOff, Shield, CheckCircle } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^0[2-9]\d{7,8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("הסיסמאות לא תואמות");
      return;
    }

    if (formData.password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError("מספר טלפון לא תקין");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login?registered=true");
        }, 2000);
      } else {
        setError(data.error || "שגיאה בהרשמה");
      }
    } catch (error) {
      console.error("Register error:", error);
      setError("אירעה שגיאה. אנא נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-charcoal text-white">
        <Navbar />
        <div className="pt-24 pb-20">
          <div className="max-w-md mx-auto px-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="size-20 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="size-10 text-green-400" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-4">ההרשמה הושלמה בהצלחה!</h2>
            <p className="text-zinc-400 mb-6">מעבירים אותך לעמוד ההתחברות...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-charcoal text-white">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-md mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-8">
              <div className="size-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-6">
                <Shield className="size-8 text-gold" />
              </div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                הרשמה
              </h1>
              <p className="text-zinc-400">
                צור חשבון חדש כדי לגשת לדשבורד שלך
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    שם מלא *
                  </label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/30 border border-zinc-700 rounded-lg px-12 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                      placeholder="הכנס שם מלא"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    אימייל *
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black/30 border border-zinc-700 rounded-lg px-12 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    טלפון *
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-black/30 border border-zinc-700 rounded-lg px-12 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                      placeholder="050-123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    סיסמה *
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-black/30 border border-zinc-700 rounded-lg px-12 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                      placeholder="מינימום 6 תווים"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300 transition"
                    >
                      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    אימות סיסמה *
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full bg-black/30 border border-zinc-700 rounded-lg px-12 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                      placeholder="הכנס סיסמה שוב"
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

                <div className="text-xs text-zinc-400">
                  על ידי הרשמה, אתה מסכים ל-
                  <Link href="/terms" className="text-gold hover:underline">
                    תנאי השירות
                  </Link>{" "}
                  ו-
                  <Link href="/privacy" className="text-gold hover:underline">
                    מדיניות הפרטיות
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gold text-black px-6 py-4 font-semibold hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      נרשם...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="size-5" />
                      הרשמה
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
                <p className="text-zinc-400 text-sm mb-4">
                  כבר יש לך חשבון?
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-black/30 px-6 py-3 font-semibold hover:bg-zinc-800 transition"
                >
                  התחברות
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

