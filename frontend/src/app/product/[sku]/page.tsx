type Product = {
  sku: string; name: string; price_regular: number; price_sale?: number;
  currency: "ILS"; short_desc: string;
};

const fmt = (n:number)=> new Intl.NumberFormat("he-IL",{style:"currency",currency:"ILS"}).format(n);

export default async function ProductPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const res = await fetch(`${apiUrl}/api/products/${sku}`, { cache: "no-store" });
    if (!res.ok) {
      return (
        <main className="max-w-4xl mx-auto px-4 py-10">
          <div className="text-center">
            <p className="text-red-400 mb-4">מוצר לא נמצא</p>
            <a href="/" className="text-gold">← חזרה לעמוד הבית</a>
          </div>
        </main>
      );
    }
    const p: Product = await res.json();

    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gold mb-2">{p.name}</h1>
        <p className="opacity-80 mb-4">{p.short_desc}</p>
        <div className="flex items-center gap-3 mb-8">
          {p.price_sale ? (<><span className="text-2xl text-gold font-bold">{fmt(p.price_sale)}</span><span className="line-through opacity-60">{fmt(p.price_regular)}</span></>) : <span className="text-2xl font-bold">{fmt(p.price_regular)}</span>}
        </div>
        <a href="/#lead" className="rounded-xl border border-gold px-5 py-3 hover:bg-gold hover:text-black">בקשת הצעת מחיר</a>
      </main>
    );
  } catch (error) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center">
          <p className="text-red-400 mb-4">שגיאה בטעינת המוצר</p>
          <p className="text-sm opacity-70 mb-4">וודא שה-API זמין</p>
          <a href="/" className="text-gold">← חזרה לעמוד הבית</a>
        </div>
      </main>
    );
  }
}

