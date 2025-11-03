"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Camera, Lock, Package, CheckCircle, Upload, Calculator, Send } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type ServiceType = "cyber" | "physical" | "combined" | null;
type PackageType = "basic" | "professional" | "enterprise" | null;

export default function QuotePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: null as ServiceType,
    packageType: null as PackageType,
    propertySize: "",
    location: "",
    specialRequirements: "",
    budget: "",
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const validatePhone = (phone: string) => {
    const phoneRegex = /^0[2-9]\d{7,8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validatePhone(formData.phone)) {
      alert("מספר טלפון לא תקין");
      return;
    }

    setStatus("loading");
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("city", formData.location);
      formDataToSend.append("message", `
סוג שירות: ${formData.serviceType === "cyber" ? "סייבר" : formData.serviceType === "physical" ? "פיזי" : "משולב"}
חבילה: ${formData.packageType === "basic" ? "בסיסי" : formData.packageType === "professional" ? "מקצועי" : "ארגוני"}
גודל נכס: ${formData.propertySize}
מיקום: ${formData.location}
דרישות מיוחדות: ${formData.specialRequirements}
תקציב משוער: ${formData.budget}
      ${formData.message}
      `.trim());

      const response = await fetch("/api/lead", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      
      if (data.ok) {
        setStatus("success");
        setTimeout(() => {
          setStatus("idle");
          setStep(1);
          setFormData({
            serviceType: null,
            packageType: null,
            propertySize: "",
            location: "",
            specialRequirements: "",
            budget: "",
            name: "",
            phone: "",
            email: "",
            message: "",
          });
          setFiles([]);
        }, 3000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting quote:", error);
      setStatus("error");
    }
  };

  const serviceOptions = [
    { id: "cyber", label: "סייבר & AI", icon: Shield, desc: "מערכת הגנת סייבר מתקדמת" },
    { id: "physical", label: "מיגון פיזי", icon: Camera, desc: "מצלמות, חיישנים, בקרת כניסה" },
    { id: "combined", label: "משולב", icon: Package, desc: "שילוב של סייבר ומיגון פיזי" },
  ];

  const packageOptions = [
    { id: "basic", label: "בסיסי", price: "מ-2,500 ₪", desc: "לבתים קטנים" },
    { id: "professional", label: "מקצועי", price: "מ-5,000 ₪", desc: "לעסקים בינוניים" },
    { id: "enterprise", label: "ארגוני", price: "מ-10,000 ₪", desc: "לחברות גדולות" },
  ];

  return (
    <main className="min-h-screen bg-charcoal text-white">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                בקשה להצעת מחיר
              </h1>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                מלא את הפרטים הבאים ונחזור אליך עם הצעת מחיר מותאמת אישית
              </p>
            </div>
          </ScrollReveal>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex items-center">
                  <div className={`size-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s ? "bg-gold text-black" : "bg-zinc-800 text-zinc-400"
                  }`}>
                    {step > s ? <CheckCircle className="size-6" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step > s ? "bg-gold" : "bg-zinc-800"
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-zinc-400">
              <span>סוג שירות</span>
              <span>פרטים</span>
              <span>יצירת קשר</span>
            </div>
          </div>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-green-500/50 bg-green-500/20 p-12 text-center"
            >
              <CheckCircle className="size-16 mx-auto mb-6 text-green-400" />
              <h2 className="text-2xl font-bold mb-4">הבקשה נשלחה בהצלחה!</h2>
              <p className="text-zinc-300 mb-6">נחזור אליך תוך 24 שעות עם הצעת מחיר מפורטת</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Service Type */}
              {step === 1 && (
                <ScrollReveal>
                  <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold mb-6">בחר סוג שירות</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                      {serviceOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, serviceType: option.id as ServiceType });
                              setStep(2);
                            }}
                            className={`p-6 rounded-xl border-2 transition-all ${
                              formData.serviceType === option.id
                                ? "border-gold bg-gold/10"
                                : "border-zinc-800 bg-black/30 hover:border-zinc-700"
                            }`}
                          >
                            <Icon className="size-10 mb-4 text-gold mx-auto" />
                            <h3 className="font-bold text-lg mb-2">{option.label}</h3>
                            <p className="text-sm text-zinc-400">{option.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Step 2: Package & Details */}
              {step === 2 && (
                <ScrollReveal>
                  <div className="space-y-8">
                    {/* Package Selection */}
                    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
                      <h2 className="text-2xl font-bold mb-6">בחר חבילה</h2>
                      <div className="grid md:grid-cols-3 gap-6">
                        {packageOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, packageType: option.id as PackageType })}
                            className={`p-6 rounded-xl border-2 transition-all text-right ${
                              formData.packageType === option.id
                                ? "border-gold bg-gold/10"
                                : "border-zinc-800 bg-black/30 hover:border-zinc-700"
                            }`}
                          >
                            <h3 className="font-bold text-lg mb-2">{option.label}</h3>
                            <p className="text-gold font-semibold mb-2">{option.price}</p>
                            <p className="text-sm text-zinc-400">{option.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
                      <h2 className="text-2xl font-bold mb-6">פרטי הנכס</h2>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">גודל נכס (מ״ר)</label>
                          <input
                            type="text"
                            value={formData.propertySize}
                            onChange={(e) => setFormData({ ...formData, propertySize: e.target.value })}
                            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                            placeholder="לדוגמה: 100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">מיקום</label>
                          <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                            placeholder="עיר, שכונה"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">דרישות מיוחדות</label>
                          <textarea
                            rows={4}
                            value={formData.specialRequirements}
                            onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white resize-none"
                            placeholder="תאר דרישות מיוחדות, נקודות רגישות, וכו׳..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">תקציב משוער (₪)</label>
                          <input
                            type="text"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                            placeholder="לדוגמה: 5000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">העלאת קבצים (תוכניות, תמונות)</label>
                          <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center">
                            <Upload className="size-8 mx-auto mb-4 text-zinc-400" />
                            <input
                              type="file"
                              multiple
                              onChange={handleFileChange}
                              className="hidden"
                              id="file-upload"
                            />
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer text-gold hover:text-gold/80 transition"
                            >
                              לחץ לבחירת קבצים
                            </label>
                            {files.length > 0 && (
                              <p className="text-sm text-zinc-400 mt-2">{files.length} קבצים נבחרו</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 rounded-xl border border-zinc-700 bg-black/30 px-6 py-3 font-semibold hover:bg-zinc-800 transition"
                      >
                        חזרה
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        disabled={!formData.packageType || !formData.location}
                        className="flex-1 rounded-xl bg-gold text-black px-6 py-3 font-semibold hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        המשך
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Step 3: Contact Info */}
              {step === 3 && (
                <ScrollReveal>
                  <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold mb-6">פרטי יצירת קשר</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">שם מלא *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">טלפון *</label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                            placeholder="050-123-4567"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">אימייל</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">הודעה נוספת</label>
                        <textarea
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white resize-none"
                          placeholder="הודעה נוספת, הערות..."
                        />
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="flex-1 rounded-xl border border-zinc-700 bg-black/30 px-6 py-3 font-semibold hover:bg-zinc-800 transition"
                        >
                          חזרה
                        </button>
                        <button
                          type="submit"
                          disabled={status === "loading" || !formData.name || !formData.phone}
                          className="flex-1 rounded-xl bg-gold text-black px-6 py-3 font-semibold hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {status === "loading" ? (
                            <>
                              <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                              שולח...
                            </>
                          ) : (
                            <>
                              <Send className="size-5" />
                              שלח בקשה להצעה
                            </>
                          )}
                        </button>
                      </div>

                      {status === "error" && (
                        <p className="text-red-400 text-sm text-center">
                          אירעה שגיאה. אנא נסה שוב או צור קשר בטלפון.
                        </p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </form>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

