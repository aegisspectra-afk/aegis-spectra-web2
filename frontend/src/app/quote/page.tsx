"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Camera, Lock, Package, CheckCircle, Upload, Calculator, Send } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useReCaptcha } from "@/components/ReCaptcha";
import { getPackageBySlug } from "@/data/packages";
import { calculatePackagePrice, PackagePriceOptions } from "@/lib/packages/calculatePrice";
import { Package as PackageType } from "@/types/packages";

type ServiceType = "cyber" | "physical" | "combined" | null;
type PackageTypeOld = "basic" | "professional" | "enterprise" | null;

export default function QuotePage() {
  const { execute: executeRecaptcha, isReady: recaptchaReady } = useReCaptcha("quote_form");
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [selectedPackageOptions, setSelectedPackageOptions] = useState<PackagePriceOptions>({});
  const [formData, setFormData] = useState({
    serviceType: null as ServiceType,
    packageType: null as PackageTypeOld,
    packageSlug: "",
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

  // Load package from URL parameter
  useEffect(() => {
    const packageSlug = searchParams.get("package");
    if (packageSlug) {
      const pkg = getPackageBySlug(packageSlug);
      if (pkg) {
        setSelectedPackage(pkg);
        setFormData(prev => ({
          ...prev,
          packageSlug: packageSlug,
          serviceType: pkg.category === "Residential" ? "physical" : pkg.category === "Commercial" ? "physical" : "combined",
        }));
        setStep(2); // Skip to step 2
      }
    }
  }, [searchParams]);

  // Calculate estimated price dynamically
  const estimatedPrice = useMemo(() => {
    // If package is selected, use package pricing
    if (selectedPackage) {
      const breakdown = calculatePackagePrice(selectedPackage, selectedPackageOptions);
      return breakdown.total;
    }

    // Otherwise, use old calculation
    let basePrice = 0;
    
    // Base price by service type
    if (formData.serviceType === "cyber") {
      basePrice = 3000;
    } else if (formData.serviceType === "physical") {
      basePrice = 2500;
    } else if (formData.serviceType === "combined") {
      basePrice = 5000;
    }
    
    // Add package multiplier
    if (formData.packageType === "basic") {
      basePrice *= 1;
    } else if (formData.packageType === "professional") {
      basePrice *= 1.5;
    } else if (formData.packageType === "enterprise") {
      basePrice *= 2.5;
    }
    
    // Add property size factor
    const size = parseInt(formData.propertySize) || 0;
    if (size > 0) {
      const sizeFactor = Math.max(1, size / 100); // 100m² = 1x, 200m² = 2x, etc.
      basePrice *= sizeFactor;
    }
    
    return Math.round(basePrice);
  }, [selectedPackage, selectedPackageOptions, formData.serviceType, formData.packageType, formData.propertySize]);

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
      formDataToSend.append("city", formData.location);
      let messageContent = `
סוג שירות: ${formData.serviceType === "cyber" ? "סייבר" : formData.serviceType === "physical" ? "פיזי" : "משולב"}
`;

      if (selectedPackage) {
        messageContent += `
חבילה: ${selectedPackage.nameHebrew} (${selectedPackage.name})
${selectedPackage.description}
`;
        if (selectedPackageOptions.cameras) {
          messageContent += `מצלמות: ${selectedPackageOptions.cameras}\n`;
        }
        if (selectedPackageOptions.aiDetection) {
          messageContent += `AI Detection: ${selectedPackageOptions.aiDetection}\n`;
        }
        if (selectedPackageOptions.storage) {
          messageContent += `אחסון: ${selectedPackageOptions.storage}\n`;
        }
        if (selectedPackageOptions.addons && selectedPackageOptions.addons.length > 0) {
          messageContent += `תוספות: ${selectedPackageOptions.addons.join(', ')}\n`;
        }
      } else {
        messageContent += `חבילה: ${formData.packageType === "basic" ? "בסיסי" : formData.packageType === "professional" ? "מקצועי" : "ארגוני"}\n`;
      }

      messageContent += `
גודל נכס: ${formData.propertySize} מ״ר
מיקום: ${formData.location}
דרישות מיוחדות: ${formData.specialRequirements}
תקציב משוער: ${formData.budget} ₪
מחיר משוער (אוטומטי): ${estimatedPrice} ₪
      ${formData.message}
      `.trim();

      formDataToSend.append("message", messageContent);
      
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
        setTimeout(() => {
          setStatus("idle");
          setStep(1);
          setFormData({
            serviceType: null,
            packageType: null,
            packageSlug: "",
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

  const legacyPackageOptions = [
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
                    {/* Package Selection - Show selected package if exists */}
                    {selectedPackage ? (
                      <div className="rounded-2xl border-2 border-gold/50 bg-gold/10 p-8 backdrop-blur-sm">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h2 className="text-2xl font-bold mb-2">{selectedPackage.nameHebrew}</h2>
                            <p className="text-zinc-400">{selectedPackage.description}</p>
                            <p className="text-gold font-bold text-xl mt-2">{selectedPackage.priceRange}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPackage(null);
                              setFormData(prev => ({ ...prev, packageSlug: "" }));
                            }}
                            className="text-zinc-400 hover:text-white transition"
                          >
                            ✕
                          </button>
                        </div>
                        <a
                          href={`/packages/${selectedPackage.slug}`}
                          className="text-gold hover:text-gold/80 text-sm underline"
                        >
                          לפרטים מלאים של החבילה →
                        </a>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-6">בחר חבילה</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                          {legacyPackageOptions.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, packageType: option.id as PackageTypeOld })}
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
                        <div className="mt-6 text-center">
                          <a
                            href="/packages/compare"
                            className="text-gold hover:text-gold/80 text-sm underline"
                          >
                            השווה בין חבילות →
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Estimated Price Display */}
                    {estimatedPrice > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-gold/10 to-gold/5 p-6 backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Calculator className="size-8 text-gold" />
                            <div>
                              <h3 className="font-bold text-lg text-white mb-1">מחיר משוער</h3>
                              <p className="text-sm text-zinc-400">לפי הבחירות שלך</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-extrabold text-gold mb-1">
                              ₪{estimatedPrice.toLocaleString("he-IL")}
                            </div>
                            <p className="text-xs text-zinc-400">מחיר משוער בלבד</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gold/20">
                          <p className="text-xs text-zinc-400">
                            המחיר הסופי ייקבע לאחר בדיקה מקצועית בשטח. מחיר זה כולל התקנה ואבטחה בסיסית.
                          </p>
                        </div>
                      </motion.div>
                    )}

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

