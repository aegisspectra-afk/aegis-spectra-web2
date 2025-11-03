"use client";

import { useState } from "react";

export default function LeadForm() {
  const [status, setStatus] = useState<"idle"|"ok"|"err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    setStatus("idle");
    try {
      const r = await fetch(`${apiUrl}/api/lead`, { method: "POST", body: fd });
      setStatus(r.ok ? "ok" : "err");
      if (r.ok) (e.target as HTMLFormElement).reset();
    } catch { 
      setStatus("err"); 
    }
  }

  const base = "bg-black/30 border border-zinc-700 focus:outline-none focus:border-gold/70 p-3 rounded-lg";

  return (
    <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
      <input className={base} name="name" required placeholder="שם מלא" />
      <input className={base} name="phone" required placeholder="טלפון" />
      <input className={base} name="city" placeholder="עיר" />
      <input className={base} name="product_sku" placeholder="דגם מועדף (למשל H-01-2TB)" />
      <textarea className={`${base} md:col-span-2`} name="message" placeholder="הערות" rows={4} />
      <button className="md:col-span-2 rounded-xl bg-gold text-black font-semibold py-3">שליחה</button>
      {status==="ok" && <p className="text-green-400 md:col-span-2">הבקשה התקבלה — נחזור אליך בהקדם.</p>}
      {status==="err" && <p className="text-red-400 md:col-span-2">שגיאה בשליחה — נסו שוב.</p>}
    </form>
  );
}

