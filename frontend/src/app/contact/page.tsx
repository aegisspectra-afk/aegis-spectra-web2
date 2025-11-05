"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { trackContactForm, trackPhoneCall, trackWhatsAppClick } from "@/components/Analytics";
import { useReCaptcha } from "@/components/ReCaptcha";

export default function ContactPage() {
  const { execute: executeRecaptcha, isReady: recaptchaReady } = useReCaptcha("contact_form");
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const validatePhone = (phone: string) => {
    const phoneRegex = /^0[2-9]\d{7,8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validatePhone(formData.phone)) {
      alert("מספר טלפון לא תקין");
      return;
    }

    setFormStatus("loading");
    
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
      formDataToSend.append("message", `${formData.subject}\n\n${formData.message}`);
      
      // Add reCAPTCHA token
      if (recaptchaToken) {
        formDataToSend.append("recaptcha_token", recaptchaToken);
      }

      const response = await fetch("/api/lead", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      
      if (data.ok) {
        setFormStatus("success");
        trackContactForm("contact_page");
        setTimeout(() => {
          setFormStatus("idle");
          setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
        }, 3000);
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-charcoal text-white">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                צור קשר
              </h1>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                אנחנו כאן כדי לעזור לך. צור איתנו קשר בכל נושא ונחזור אליך בהקדם
              </p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <ScrollReveal delay={0.1}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">פרטי יצירת קשר</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-6 rounded-xl border border-zinc-800 bg-black/30 hover:bg-black/50 transition">
                      <div className="size-12 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                        <Phone className="size-6 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">טלפון</h3>
                        <a 
                          href="tel:+972559737025" 
                          className="text-zinc-300 hover:text-gold transition"
                          onClick={() => trackPhoneCall("+972559737025")}
                        >
                          +972-55-973-7025
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 rounded-xl border border-zinc-800 bg-black/30 hover:bg-black/50 transition">
                      <div className="size-12 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                        <Mail className="size-6 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">אימייל</h3>
                        <a 
                          href="mailto:aegisspectra@gmail.com" 
                          className="text-zinc-300 hover:text-gold transition"
                        >
                          aegisspectra@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 rounded-xl border border-zinc-800 bg-black/30 hover:bg-black/50 transition">
                      <div className="size-12 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="size-6 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">WhatsApp</h3>
                        <a 
                          href="https://wa.me/972559737025" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-300 hover:text-gold transition inline-flex items-center gap-2"
                          onClick={() => trackWhatsAppClick("contact_page")}
                        >
                          שלח הודעה
                          <MessageSquare className="size-4" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 rounded-xl border border-zinc-800 bg-black/30 hover:bg-black/50 transition">
                      <div className="size-12 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                        <Clock className="size-6 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">שעות פעילות</h3>
                        <p className="text-zinc-300">
                          א׳-ה׳: 09:00-18:00<br />
                          ו׳: 09:00-13:00<br />
                          ש׳: סגור
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="rounded-xl border border-zinc-800 bg-black/30 overflow-hidden h-64">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.5!2d34.7818!3d32.0853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDA1JzA3LjEiTiAzNMKwNDYnNTAuNSJF!5e0!3m2!1sen!2sil!4v1234567890123!5m2!1sen!2sil"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <ScrollReveal delay={0.2}>
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6">שלח לנו הודעה</h2>
                
                {formStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl bg-green-500/20 border border-green-500/50 text-center"
                  >
                    <CheckCircle className="size-12 mx-auto mb-4 text-green-400" />
                    <h3 className="text-lg font-semibold mb-2">ההודעה נשלחה בהצלחה!</h3>
                    <p className="text-zinc-300">נחזור אליך בהקדם</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        שם מלא *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                        placeholder="הכנס את שמך המלא"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          טלפון *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                          placeholder="050-123-4567"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          אימייל (אופציונלי)
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        נושא *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                        placeholder="מה הנושא של פנייתך?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        הודעה *
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white resize-none"
                        placeholder="תאר את פנייתך בפירוט..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus === "loading"}
                      className="w-full rounded-xl bg-gold text-black px-6 py-4 font-semibold hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {formStatus === "loading" ? (
                        <>
                          <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          שולח...
                        </>
                      ) : (
                        <>
                          <Send className="size-5" />
                          שלח הודעה
                        </>
                      )}
                    </button>

                    {formStatus === "error" && (
                      <p className="text-red-400 text-sm text-center">
                        אירעה שגיאה. אנא נסה שוב או צור קשר בטלפון.
                      </p>
                    )}
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

