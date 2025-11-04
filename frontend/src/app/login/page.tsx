"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Eye, EyeOff, Shield } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // For now, simple authentication - in production, use proper auth system
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      });

      const data = await response.json();

      if (data.ok) {
        // Save auth token (JWT) and all user data
        // Note: Cookie is set automatically by server, but we also save to localStorage for client-side checks
        localStorage.setItem("user_token", data.token);
        localStorage.setItem("user_id", data.user.id.toString());
        localStorage.setItem("user_name", data.user.name || formData.email);
        localStorage.setItem("user_email", data.user.email || formData.email);
        if (data.user.phone) localStorage.setItem("user_phone", data.user.phone);
        localStorage.setItem("user_role", data.user.role || "customer");
        
        // Show warning if email not verified
        if (data.message && !data.user.emailVerified) {
          alert(data.message);
        }
        
        // Check for redirect parameter
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get("redirect") || "/user";
        
        // Redirect to user dashboard or requested page
        router.push(redirect);
      } else {
        setError(data.error || "שגיאה בהתחברות");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("אירעה שגיאה. אנא נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

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
                התחברות
              </h1>
              <p className="text-zinc-400">
                התחבר לחשבון שלך כדי לגשת לדשבורד
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
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    אימייל
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
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    סיסמה
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
                      placeholder="הכנס סיסמה"
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

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                      className="rounded border-zinc-700 bg-black/30 text-gold focus:ring-gold"
                    />
                    <span className="text-zinc-400">זכור אותי</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-gold hover:text-gold/80 transition"
                  >
                    שכחת סיסמה?
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
                      מתחבר...
                    </>
                  ) : (
                    <>
                      <LogIn className="size-5" />
                      התחבר
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
                <p className="text-zinc-400 text-sm mb-4">
                  עדיין אין לך חשבון?
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-black/30 px-6 py-3 font-semibold hover:bg-zinc-800 transition"
                >
                  הרשמה
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

