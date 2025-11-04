"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Shield, Camera, HardDrive, Smartphone, Wifi, Check, ArrowRight, CreditCard } from "lucide-react";
import { ProductJSONLD } from "@/components/JSONLDSchema";

type Product = {
  sku: string; name: string; price_regular: number; price_sale?: number;
  currency: "ILS"; short_desc: string;
};

const fmt = (n:number)=> new Intl.NumberFormat("he-IL",{style:"currency",currency:"ILS"}).format(n);

// מוצרים סטטיים כ-fallback אם ה-API לא זמין
const FALLBACK_PRODUCTS: Record<string, Product> = {
  "H-01-2TB": {
    sku: "H-01-2TB",
    name: "Home Cam H-01 (2 TB)",
    price_regular: 2590,
    price_sale: 2290,
    currency: "ILS",
    short_desc: "מערכת אבטחה חכמה: 2×4MP PoE + NVR 2TB + אפליקציה בעברית."
  }
};

// פרטים נוספים למוצר H-01
const PRODUCT_DETAILS: Record<string, {
  features: string[];
  specs: { label: string; value: string }[];
  includes: string[];
}> = {
  "H-01-2TB": {
    features: [
      "2× מצלמות 4MP PoE עם ראיית לילה 30 מטר",
      "NVR 4 ערוצים עם 2TB אחסון",
      "אפליקציה בעברית לנייד ולמחשב",
      "צפייה בזמן אמת והקלטה 24/7",
      "התראות חכמות לנייד",
      "התקנה Plug & Play - מוכן תוך שעה"
    ],
    specs: [
      { label: "רזולוציה", value: "4MP (2560×1440)" },
      { label: "זווית צילום", value: "90°" },
      { label: "ראיית לילה", value: "30 מטר IR" },
      { label: "אחסון", value: "2TB HDD" },
      { label: "ערוצי הקלטה", value: "4 ערוצים" },
      { label: "חיבור", value: "PoE (Power over Ethernet)" }
    ],
    includes: [
      "2× מצלמות 4MP PoE",
      "NVR עם 2TB HDD",
      "כבלי Ethernet",
      "אפליקציה בעברית",
      "התקנה מקצועית",
      "הדרכה אישית",
      "אחריות 12 חודשים"
    ]
  }
};

export default function ProductPage() {
  const params = useParams();
  const sku = params?.sku as string;
  const [p, setP] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  
  useEffect(() => {
    if (!sku) return;
    
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try internal API first (fast, no external dependency)
        const res = await fetch(`/api/products/sku/${sku}`, { 
          cache: "no-store"
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.product) {
            setP({
              sku: data.product.sku,
              name: data.product.name,
              price_regular: data.product.price_regular,
              price_sale: data.product.price_sale,
              currency: data.product.currency || "ILS",
              short_desc: data.product.short_desc || data.product.description || ""
            });
            setLoading(false);
            return;
          }
        }
        
        // Fallback to static data if API fails
        setP(FALLBACK_PRODUCTS[sku] || null);
      } catch (error) {
        console.error('Error fetching product:', error);
        setP(FALLBACK_PRODUCTS[sku] || null);
        setError('שגיאה בטעינת המוצר');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [sku]);
  
  const handlePurchase = () => {
    if (!p) return;
    
    setPurchasing(true);
    
    // Save product to cart in localStorage before redirecting
    const cartItem = {
      sku: p.sku,
      name: p.name,
      price: p.price_sale || p.price_regular,
      quantity: 1,
    };
    
    // Get existing cart or create new one
    const existingCart = localStorage.getItem("cart");
    let cart: typeof cartItem[] = [];
    
    if (existingCart) {
      try {
        cart = JSON.parse(existingCart);
        // Check if product already exists in cart
        const existingIndex = cart.findIndex(item => item.sku === p.sku);
        if (existingIndex >= 0) {
          // Update quantity if exists
          cart[existingIndex].quantity += 1;
        } else {
          // Add new item
          cart.push(cartItem);
        }
      } catch (e) {
        console.error("Error parsing cart:", e);
        cart = [cartItem];
      }
    } else {
      cart = [cartItem];
    }
    
    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Redirect to checkout with product SKU
    window.location.href = `/checkout?sku=${encodeURIComponent(p.sku)}&quantity=1`;
  };

  if (loading) {
    return (
      <main className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(212,175,55,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-zinc-800 rounded-lg w-1/2"></div>
            <div className="h-4 bg-zinc-800 rounded-lg w-3/4"></div>
            <div className="h-10 bg-zinc-800 rounded-lg w-1/3"></div>
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <div className="h-24 bg-zinc-800 rounded-lg"></div>
              <div className="h-24 bg-zinc-800 rounded-lg"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!p) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center">
          <p className="text-red-400 mb-4">מוצר לא נמצא</p>
          <Link href="/" className="text-gold">← חזרה לעמוד הבית</Link>
        </div>
      </main>
    );
  }

  const details = PRODUCT_DETAILS[sku] || { features: [], specs: [], includes: [] };

  return (
    <main className="relative">
      <ProductJSONLD product={p} />
      {/* רקע גרעיני */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(212,175,55,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
      
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm opacity-70">
          <Link href="/" className="hover:text-gold">עמוד הבית</Link>
          <span className="mx-2">/</span>
          <span>מוצרים</span>
          <span className="mx-2">/</span>
          <span className="text-gold">{p.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-gold size-8" />
            <h1 className="text-3xl md:text-4xl font-extrabold">{p.name}</h1>
          </div>
          <p className="text-xl text-zinc-300 mb-6">{p.short_desc}</p>
          
          {/* מחיר */}
          <div className="flex items-center gap-4 mb-8">
            {p.price_sale ? (
              <>
                <span className="text-4xl text-gold font-extrabold">{fmt(p.price_sale)}</span>
                <span className="text-xl line-through opacity-60">{fmt(p.price_regular)}</span>
                <span className="px-3 py-1 bg-burgundy/30 border border-burgundy rounded-full text-sm text-gold">
                  חיסכון {fmt(p.price_regular - p.price_sale)}
                </span>
              </>
            ) : (
              <span className="text-4xl font-extrabold">{fmt(p.price_regular)}</span>
            )}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePurchase}
              disabled={purchasing || !p}
              className="rounded-xl bg-gold text-black px-8 py-4 font-bold inline-flex items-center justify-center gap-2 hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {purchasing ? (
                <>
                  <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  מעבר לתשלום...
                </>
              ) : (
                <>
                  <CreditCard className="size-5" />
                  רכוש עכשיו
                </>
              )}
            </button>
            <Link 
              href="/#contact" 
              className="rounded-xl border border-gold px-6 py-3 inline-flex items-center justify-center gap-2 hover:bg-gold/10 transition"
            >
              הזמנת ייעוץ חינם <ArrowRight className="size-4" />
            </Link>
            <Link 
              href="https://wa.me/972559737025" 
              className="rounded-xl border border-zinc-700 px-6 py-3 inline-flex items-center justify-center gap-2 hover:bg-zinc-800 transition"
            >
              שאלות ב-WhatsApp
            </Link>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* תכונות עיקריות */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Camera className="text-gold" />
            תכונות עיקריות
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {details.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-black/30 p-4">
                <Check className="text-gold size-5 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* מפרט טכני */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <HardDrive className="text-gold" />
            מפרט טכני
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {details.specs.map((spec, i) => (
              <div key={i} className="rounded-xl border border-zinc-800 bg-black/30 p-4">
                <div className="text-sm opacity-70 mb-1">{spec.label}</div>
                <div className="font-semibold text-gold">{spec.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* מה כלול */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Smartphone className="text-gold" />
            מה כלול בחבילה
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {details.includes.map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-black/30 p-4">
                <div className="size-2 rounded-full bg-gold" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* תהליך הזמנה */}
        <section className="rounded-2xl border border-zinc-800 bg-black/30 p-8 mb-10">
          <h2 className="text-2xl font-bold mb-4">תהליך הזמנה פשוט</h2>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            {[
              {n: "01", h: "שיחה", p: "נקבע מועד נוח"},
              {n: "02", h: "סקר", p: "סיור באתר ומיפוי"},
              {n: "03", h: "הצעה", p: "תרשים + מחיר שקוף"},
              {n: "04", h: "התקנה", p: "ביצוע נקי ומדויק"},
            ].map((s,i)=>(
              <div key={i} className="text-center">
                <div className="text-gold font-extrabold text-2xl mb-2">{s.n}</div>
                <div className="font-semibold mb-1">{s.h}</div>
                <p className="opacity-70 text-xs">{s.p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA אחרון */}
        <div className="rounded-2xl border border-gold/50 bg-black/30 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">מוכן להתחיל?</h2>
          <p className="opacity-80 mb-6">הזמינו ייעוץ חינם וקבלו הצעת מחיר תוך 24 שעות</p>
          <Link 
            href="/#contact" 
            className="inline-flex rounded-xl bg-gold text-black px-8 py-3 font-semibold hover:bg-gold/90 transition"
          >
            הזמנת ייעוץ חינם עכשיו
          </Link>
        </div>
      </div>
    </main>
  );
}
