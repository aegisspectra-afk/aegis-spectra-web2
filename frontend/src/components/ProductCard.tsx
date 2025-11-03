import Link from "next/link";

const fmt = (n:number)=> new Intl.NumberFormat("he-IL",{style:"currency",currency:"ILS"}).format(n);

export default function ProductCard({
  sku, name, desc, priceRegular, priceSale, ctaHref
}: {
  sku: string; name: string; desc: string; priceRegular: number; priceSale?: number; ctaHref: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800/50 bg-black/30 p-6 grid md:grid-cols-3 gap-6 items-center">
      <div className="md:col-span-2">
        <h3 className="text-xl font-bold mb-1 text-white">{name}</h3>
        <p className="opacity-90 text-zinc-300">{desc}</p>
        <div className="mt-4 flex items-center gap-3">
          {priceSale ? (
            <>
              <span className="text-2xl text-white font-extrabold">{fmt(priceSale)}</span>
              <span className="line-through opacity-60 text-zinc-400">{fmt(priceRegular)}</span>
            </>
          ) : (
            <span className="text-2xl font-extrabold text-white">{fmt(priceRegular)}</span>
          )}
        </div>
      </div>
      <div className="flex md:justify-end">
        <Link href={ctaHref} className="h-11 inline-flex items-center justify-center rounded-xl border border-zinc-600 px-5 hover:bg-zinc-700 hover:text-white transition">
          פרטים והזמנה
        </Link>
      </div>
    </div>
  );
}

