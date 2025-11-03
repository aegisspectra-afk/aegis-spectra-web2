"use client";

import { useState } from "react";

export default function LeadForm() {
  const [status, setStatus] = useState<"idle"|"ok"|"err"|"loading">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      // שליחה ל-API route שישמור ב-DB
      const response = await fetch("/api/lead", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("err");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("err");
    }
  }

  const base = "bg-black/30 border border-zinc-700 focus:outline-none focus:border-gold/70 p-3 rounded-lg transition-colors";

  return (
    <form 
      onSubmit={onSubmit}
      className="grid md:grid-cols-2 gap-4"
    >
      {/* Honeypot field for spam protection */}
      <div className="hidden">
        <label>
          Don&apos;t fill this out if you&apos;re human: <input name="bot-field" />
        </label>
      </div>

      <input 
        className={base} 
        name="name" 
        type="text"
        required 
        placeholder="שם מלא" 
        disabled={status === "loading"}
      />
      
      <input 
        className={base} 
        name="phone" 
        type="tel"
        required 
        placeholder="טלפון" 
        disabled={status === "loading"}
      />
      
      <input 
        className={base} 
        name="city" 
        type="text"
        placeholder="עיר" 
        disabled={status === "loading"}
      />
      
      <input 
        className={base} 
        name="product_sku" 
        type="text"
        placeholder="דגם מועדף (למשל H-01-2TB)" 
        disabled={status === "loading"}
      />
      
      <textarea 
        className={`${base} md:col-span-2`} 
        name="message" 
        placeholder="הערות" 
        rows={4}
        disabled={status === "loading"}
      />
      
      <button 
        type="submit"
        className="md:col-span-2 rounded-xl bg-gold text-black font-semibold py-3 hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={status === "loading"}
      >
        {status === "loading" ? "שולח..." : "שליחה"}
      </button>
      
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

