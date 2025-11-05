"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useReCaptcha } from "./ReCaptcha";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const { execute: executeRecaptcha, isReady: recaptchaReady } = useReCaptcha("newsletter");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage("אנא הזן כתובת אימייל");
      setStatus("error");
      return;
    }

    if (!validateEmail(email)) {
      setMessage("כתובת אימייל לא תקינה");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      // Get reCAPTCHA token
      let recaptchaToken: string | null = null;
      if (recaptchaReady) {
        try {
          recaptchaToken = await executeRecaptcha();
        } catch (err) {
          console.warn("reCAPTCHA failed, continuing without it:", err);
        }
      }

      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          recaptcha_token: recaptchaToken,
        }),
      });

      const data = await response.json();

      if (data.ok) {
        setStatus("success");
        setEmail("");
        setMessage("הצטרפת בהצלחה! בדוק את האימייל שלך לקבלת המדריך החינמי.");
        // Reset after 5 seconds
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 5000);
      } else {
        setStatus("error");
        setMessage(data.error || "אירעה שגיאה. אנא נסה שוב מאוחר יותר.");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setStatus("error");
      setMessage("אירעה שגיאה. אנא נסה שוב מאוחר יותר.");
    }
  };

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-3 text-gold text-sm">הרשמה לניוזלטר</h3>
      <p className="text-zinc-400 text-xs mb-4 leading-relaxed">
        קבל מדריך אבטחה חינם וטיפים מקצועיים ישירות לתיבת הדואר שלך
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="הכנס אימייל"
            required
            disabled={status === "loading" || status === "success"}
            className="flex-1 bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold/70 transition text-white placeholder-zinc-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="bg-gold hover:bg-gold/90 text-black rounded-lg px-4 py-2 font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === "loading" ? (
              <div className="size-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : status === "success" ? (
              <CheckCircle className="size-4" />
            ) : (
              <Mail className="size-4" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {message && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={`text-xs flex items-center gap-2 ${
                status === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {status === "success" ? (
                <CheckCircle className="size-3" />
              ) : (
                <AlertCircle className="size-3" />
              )}
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}

