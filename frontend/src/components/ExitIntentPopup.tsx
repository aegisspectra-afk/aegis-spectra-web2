"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Mail, Phone } from "lucide-react";
import { useReCaptcha } from "./ReCaptcha";

interface ExitIntentPopupProps {
  onClose?: () => void;
}

export default function ExitIntentPopup({ onClose }: ExitIntentPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [hasShown, setHasShown] = useState(false);
  const { execute: executeRecaptcha, isReady: recaptchaReady } = useReCaptcha("exit_intent");

  useEffect(() => {
    // Check if already shown in this session
    const shown = sessionStorage.getItem("exit_intent_shown");
    if (shown === "true") {
      setHasShown(true);
      return;
    }

    // Detect exit intent (mouse leaving top of page)
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving through the top
      if (e.clientY <= 0 && !hasShown && !isOpen) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("exit_intent_shown", "true");
      }
    };

    // Also detect on mobile (touch end near top)
    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      if (touch.clientY <= 50 && !hasShown && !isOpen) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("exit_intent_shown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [hasShown, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

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

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("email", formData.email || "");
      formDataToSend.append("city", "");
      formDataToSend.append("message", "הצעת מחיר - Exit Intent Popup");
      formDataToSend.append("product_sku", "");
      
      if (recaptchaToken) {
        formDataToSend.append("recaptcha_token", recaptchaToken);
      }

      const response = await fetch("/api/lead", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.ok) {
        setStatus("success");
        // Auto-close after 3 seconds
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting exit intent form:", error);
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl border-2 border-gold/50 shadow-2xl max-w-md w-full p-6 sm:p-8 relative pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 left-4 text-zinc-400 hover:text-white transition-colors p-1"
                aria-label="סגור"
              >
                <X className="size-5" />
              </button>

              {/* Content */}
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="size-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-4">
                    <Gift className="size-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">תודה רבה!</h3>
                  <p className="text-zinc-300 mb-4">
                    הפרטים שלך התקבלו בהצלחה. נחזור אליך בהקדם עם הצעה מותאמת אישית.
                  </p>
                  <p className="text-sm text-zinc-400">
                    קוד הנחה: <span className="font-bold text-gold">EXIT10</span>
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="size-16 rounded-full bg-gold/20 border-2 border-gold/50 flex items-center justify-center mx-auto mb-4">
                      <Gift className="size-8 text-gold" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
                      רגע לפני שאתה עוזב! 🎁
                    </h2>
                    <p className="text-zinc-300 text-lg mb-2">
                      קבל <span className="text-gold font-bold">10% הנחה</span> על כל ההזמנה!
                    </p>
                    <p className="text-zinc-400 text-sm">
                      השאר את הפרטים שלך ונחזור אליך עם הצעה מותאמת אישית
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="שם מלא *"
                        className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white placeholder-zinc-500"
                        disabled={status === "loading"}
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="טלפון *"
                        className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white placeholder-zinc-500"
                        disabled={status === "loading"}
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="אימייל (אופציונלי)"
                        className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white placeholder-zinc-500"
                        disabled={status === "loading"}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full rounded-xl bg-gold text-black font-bold py-3 hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {status === "loading" ? (
                        <>
                          <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          שולח...
                        </>
                      ) : (
                        <>
                          <Gift className="size-5" />
                          קבל את ההנחה שלי
                        </>
                      )}
                    </button>

                    {status === "error" && (
                      <p className="text-red-400 text-sm text-center">
                        אירעה שגיאה. אנא נסה שוב או צור קשר בטלפון.
                      </p>
                    )}

                    {/* Alternative contact */}
                    <div className="pt-4 border-t border-zinc-800">
                      <p className="text-zinc-400 text-sm text-center mb-3">או צור קשר ישירות:</p>
                      <div className="flex gap-3">
                        <a
                          href="tel:+972559737025"
                          className="flex-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors py-2 px-4 text-center text-sm flex items-center justify-center gap-2"
                        >
                          <Phone className="size-4" />
                          טלפון
                        </a>
                        <a
                          href="https://wa.me/972559737025"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors py-2 px-4 text-center text-sm flex items-center justify-center gap-2"
                        >
                          <Mail className="size-4" />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

