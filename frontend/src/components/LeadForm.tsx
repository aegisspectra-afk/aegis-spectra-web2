"use client";

import { useState } from "react";
import { trackEvent, trackConversion } from "@/components/Analytics";
import { useReCaptcha } from "@/components/ReCaptcha";

export default function LeadForm() {
  const [status, setStatus] = useState<"idle"|"ok"|"err"|"loading">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { execute: executeRecaptcha, isReady: recaptchaReady } = useReCaptcha("lead_form");

  // Phone validation
  function validatePhone(phone: string): boolean {
    const phoneRegex = /^0[2-9]\d{7,8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  }

  // Real-time validation
  function handleBlur(name: string, value: string) {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (name === "phone" && value && !validatePhone(value)) {
      setErrors(prev => ({ ...prev, [name]: "מספר טלפון לא תקין" }));
    } else if (name === "phone" && validatePhone(value)) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const phone = formData.get("phone") as string;
    
    // Validate phone
    if (!validatePhone(phone)) {
      setErrors(prev => ({ ...prev, phone: "מספר טלפון לא תקין" }));
      setTouched(prev => ({ ...prev, phone: true }));
      return;
    }
    
    setStatus("loading");
    setErrors({});
    
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

      // Add reCAPTCHA token to form data
      if (recaptchaToken) {
        formData.append("recaptcha_token", recaptchaToken);
      }
      
      // שליחה ל-API route שישמור ב-DB
      const response = await fetch("/api/lead", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        setStatus("ok");
        form.reset();
        setTouched({});
        
        // Track conversion
        trackEvent("form_submit", "lead", "contact_form");
        trackConversion("lead_form");
      } else {
        setStatus("err");
        trackEvent("form_error", "lead", "contact_form_error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("err");
      trackEvent("form_error", "lead", "contact_form_exception");
    }
  }

  const base = "bg-black/30 border border-zinc-700 focus:outline-none focus:border-gold/70 p-3 rounded-lg transition-colors";
  const errorClass = "border-red-500 focus:border-red-500";

  return (
    <form 
      onSubmit={onSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Honeypot field for spam protection */}
      <div className="hidden">
        <label>
          Don&apos;t fill this out if you&apos;re human: <input name="bot-field" />
        </label>
      </div>

      <div className="relative md:col-span-1">
        <label htmlFor="name" className="block text-sm font-medium mb-2 text-zinc-300">
          שם מלא *
        </label>
        <input 
          id="name"
          className={`w-full ${base} ${errors.name && touched.name ? errorClass : ""}`}
          name="name" 
          type="text"
          required 
          placeholder="שם מלא" 
          disabled={status === "loading"}
          aria-label="שם מלא"
          aria-required="true"
          aria-invalid={errors.name ? "true" : "false"}
          onBlur={(e) => handleBlur("name", e.target.value)}
        />
        {errors.name && touched.name && (
          <p className="text-red-400 text-xs mt-1" role="alert">{errors.name}</p>
        )}
      </div>
      
      <div className="relative md:col-span-1">
        <label htmlFor="phone" className="block text-sm font-medium mb-2 text-zinc-300">
          טלפון *
        </label>
        <input 
          id="phone"
          className={`w-full ${base} ${errors.phone && touched.phone ? errorClass : ""}`}
          name="phone" 
          type="tel"
          required 
          placeholder="טלפון (לדוגמה: 0501234567)" 
          disabled={status === "loading"}
          aria-label="מספר טלפון"
          aria-required="true"
          aria-invalid={errors.phone ? "true" : "false"}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          onBlur={(e) => handleBlur("phone", e.target.value)}
          onChange={(e) => {
            // Format phone number
            let value = e.target.value.replace(/\D/g, "");
            if (value.length > 0 && !value.startsWith("0")) {
              value = "0" + value;
            }
            if (value.length > 10) {
              value = value.slice(0, 10);
            }
            e.target.value = value;
            if (touched.phone) {
              handleBlur("phone", value);
            }
          }}
        />
        {errors.phone && touched.phone && (
          <p id="phone-error" className="text-red-400 text-xs mt-1" role="alert">{errors.phone}</p>
        )}
      </div>
      
      <div className="relative md:col-span-1">
        <label htmlFor="city" className="block text-sm font-medium mb-2 text-zinc-300">
          עיר
        </label>
        <input 
          id="city"
          className={`w-full ${base}`}
          name="city" 
          type="text"
          placeholder="עיר" 
          disabled={status === "loading"}
          aria-label="עיר"
          onBlur={(e) => handleBlur("city", e.target.value)}
        />
      </div>
      
      <div className="relative md:col-span-1">
        <label htmlFor="product_sku" className="block text-sm font-medium mb-2 text-zinc-300">
          דגם מועדף
        </label>
        <input 
          id="product_sku"
          className={`w-full ${base}`}
          name="product_sku" 
          type="text"
          placeholder="דגם מועדף (למשל H-01-2TB)" 
          disabled={status === "loading"}
          aria-label="דגם מועדף"
          onBlur={(e) => handleBlur("product_sku", e.target.value)}
        />
      </div>
      
      <div className="relative md:col-span-2">
        <label htmlFor="message" className="block text-sm font-medium mb-2 text-zinc-300">
          הערות
        </label>
        <textarea 
          id="message"
          className={`w-full ${base} resize-none`}
          name="message" 
          placeholder="הערות" 
          rows={4}
          disabled={status === "loading"}
          aria-label="הערות"
          onBlur={(e) => handleBlur("message", e.target.value)}
        />
      </div>
      
      <div className="md:col-span-2">
        <button 
          type="submit"
          className="w-full rounded-xl bg-gold text-black font-semibold py-3 hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-charcoal"
          disabled={status === "loading"}
          aria-label="שלח טופס"
        >
          {status === "loading" ? "שולח..." : "שליחה"}
        </button>
      </div>
      
      {status === "ok" && (
        <p className="text-green-400 md:col-span-2 text-center">
          ✓ הבקשה התקבלה — נחזור אליך בהקדם.
        </p>
      )}
      
      {status === "err" && (
        <p className="text-red-400 md:col-span-2 text-center">
          שגיאה בשליחה — נסו שוב או צרו קשר ישירות.
        </p>
      )}
    </form>
  );
}

