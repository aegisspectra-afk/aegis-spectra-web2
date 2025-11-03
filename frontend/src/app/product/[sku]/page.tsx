type Product = {
  sku: string; name: string; price_regular: number; price_sale?: number;
  currency: "ILS"; short_desc: string;
};

const fmt = (n:number)=> new Intl.NumberFormat("he-IL",{style:"currency",currency:"ILS"}).format(n);

export default async function ProductPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${sku}`, { cache: "no-store" });
  if (!res.ok) return <div className="p-10">לא נמצא</div>;
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
}

