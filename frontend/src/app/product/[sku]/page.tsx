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

export default async function ProductPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  // נסה לטעון מה-API, אם זה נכשל - נשתמש ב-fallback
  let p: Product | null = null;
  
  try {
    const res = await fetch(`${apiUrl}/api/products/${sku}`, { 
      cache: "no-store",
      // timeout אחרי 3 שניות
      signal: AbortSignal.timeout(3000)
    });
    
    if (res.ok) {
      p = await res.json();
    } else {
      // אם המוצר לא נמצא ב-API, נבדוק ב-fallback
      p = FALLBACK_PRODUCTS[sku] || null;
    }
  } catch (error) {
    // אם יש שגיאה, נשתמש ב-fallback
    console.error('Error fetching product:', error);
    p = FALLBACK_PRODUCTS[sku] || null;
  }

  // אם לא נמצא המוצר כלל (גם לא ב-fallback)
  if (!p) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center">
          <p className="text-red-400 mb-4">מוצר לא נמצא</p>
          <a href="/" className="text-gold">← חזרה לעמוד הבית</a>
        </div>
      </main>
    );
  }

  // הצג את המוצר
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gold mb-2">{p.name}</h1>
      <p className="opacity-80 mb-4">{p.short_desc}</p>
      <div className="flex items-center gap-3 mb-8">
        {p.price_sale ? (
          <>
            <span className="text-2xl text-gold font-bold">{fmt(p.price_sale)}</span>
            <span className="line-through opacity-60">{fmt(p.price_regular)}</span>
          </>
        ) : (
          <span className="text-2xl font-bold">{fmt(p.price_regular)}</span>
        )}
      </div>
      <a href="/#lead" className="rounded-xl border border-gold px-5 py-3 hover:bg-gold hover:text-black">בקשת הצעת מחיר</a>
    </main>
  );
}

