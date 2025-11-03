export default function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl md:text-3xl font-extrabold">{title}</h2>
      {subtitle && <p className="text-zinc-300 mt-1">{subtitle}</p>}
    </div>
  );
}

