"use client";

import { useEffect, useState } from "react";

type Product = {
  sku: string; name: string;
  price_regular: number; price_sale?: number;
  currency: "ILS";
  short_desc: string;
};

const currency = (n: number) =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(n);

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      .then(r => r.json()).then(setProducts).catch(console.error);
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <header className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold text-gold">Aegis Spectra Security</h1>
          <p className="text-sm opacity-80">אבטחה חכמה. התקנה מדויקת. דיסקרטיות מוחלטת.</p>
        </div>
        <a href="#lead" className="rounded-xl border border-gold px-4 py-2 hover:bg-gold hover:text-black transition">
          קבעו סקר אתר
        </a>
      </header>

      <section className="mb-10">
        <div className="rounded-2xl bg-[#0B0B0D] p-8 border border-zinc-800">
          <h2 className="text-2xl font-bold mb-6">מוצרים מובילים</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {products.map(p => (
              <div key={p.sku} className="rounded-xl border border-zinc-800 p-6 bg-black/30">
                <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
                <p className="text-sm opacity-80 mb-4">{p.short_desc}</p>
                <div className="flex items-center gap-3 mb-6">
                  {p.price_sale ? (
                    <>
                      <span className="text-lg font-bold text-gold">{currency(p.price_sale)}</span>
                      <span className="line-through opacity-60">{currency(p.price_regular)}</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold">{currency(p.price_regular)}</span>
                  )}
                </div>
                <a href={`/product/${p.sku}`} className="rounded-lg border border-gold px-4 py-2 hover:bg-gold hover:text-black">
                  פרטים והזמנה
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="lead" className="rounded-2xl bg-[#0B0B0D] p-8 border border-zinc-800">
        <h2 className="text-2xl font-bold mb-4">קביעת סקר אתר</h2>
        <LeadForm />
      </section>

      <footer className="mt-12 text-sm opacity-70">
        © {new Date().getFullYear()} Aegis Spectra — יבנה, ישראל
      </footer>
    </main>
  );
}

function LeadForm() {
  const [status, setStatus] = useState<"idle"|"ok"|"err">("idle");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lead`, { method: "POST", body: fd });
      setStatus(r.ok ? "ok" : "err");
    } catch { setStatus("err"); }
  }
  return (
    <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
      <input name="name" required placeholder="שם מלא" className="bg-black/30 border border-zinc-700 p-3 rounded-lg"/>
      <input name="phone" required placeholder="טלפון" className="bg-black/30 border border-zinc-700 p-3 rounded-lg"/>
      <input name="city" placeholder="עיר" className="bg-black/30 border border-zinc-700 p-3 rounded-lg"/>
      <input name="product_sku" placeholder="דגם מועדף (למשל H-01-2TB)" className="bg-black/30 border border-zinc-700 p-3 rounded-lg"/>
      <textarea name="message" placeholder="הערות" className="md:col-span-2 bg-black/30 border border-zinc-700 p-3 rounded-lg"></textarea>
      <button className="md:col-span-2 rounded-xl bg-gold text-black font-semibold py-3">שליחה</button>
      {status==="ok" && <p className="text-green-400">הבקשה התקבלה — ניצור קשר.</p>}
      {status==="err" && <p className="text-red-400">שגיאה בשליחה — נסי שוב.</p>}
    </form>
  );
}

