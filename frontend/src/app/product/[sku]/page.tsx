import Link from "next/link";
import { Shield, Camera, HardDrive, Smartphone, Wifi, Check, ArrowRight } from "lucide-react";

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

export default async function ProductPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  // נסה לטעון מה-API, אם זה נכשל - נשתמש ב-fallback
  let p: Product | null = null;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const res = await fetch(`${apiUrl}/api/products/${sku}`, { 
      cache: "no-store",
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (res.ok) {
      p = await res.json();
    } else {
      p = FALLBACK_PRODUCTS[sku] || null;
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    p = FALLBACK_PRODUCTS[sku] || null;
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
            <Link 
              href="/#contact" 
              className="rounded-xl bg-gold text-black px-6 py-3 font-semibold inline-flex items-center justify-center gap-2 hover:bg-gold/90 transition"
            >
              קבעו סקר אתר <ArrowRight className="size-4" />
            </Link>
            <Link 
              href="https://wa.me/9720000000000" 
              className="rounded-xl border border-gold px-6 py-3 inline-flex items-center justify-center gap-2 hover:bg-gold/10 transition"
            >
              שאלות ב-WhatsApp
            </Link>
          </div>
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
          <p className="opacity-80 mb-6">קבעו סקר אתר חינם וקבלו הצעת מחיר תוך 24 שעות</p>
          <Link 
            href="/#contact" 
            className="inline-flex rounded-xl bg-gold text-black px-8 py-3 font-semibold hover:bg-gold/90 transition"
          >
            קבעו סקר אתר עכשיו
          </Link>
        </div>
      </div>
    </main>
  );
}
