import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function HybridPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <main className="container-max py-16 space-y-8">
        <h1 className="text-3xl md:text-4xl font-heading text-white">On‑Prem / Hybrid</h1>
        <p className="text-muted-foreground max-w-3xl">פריסה גמישה: SaaS בענן, On‑Prem לארגונים רגישים, או Hybrid עם Agent Desktop וחיבור מאובטח ל‑Panel.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border border-border bg-muted/20">
            <h2 className="text-lg font-semibold text-white mb-2">SaaS</h2>
            <p className="text-muted-foreground">ניהול מלא מהענן, עדכונים אוטומטיים, סקיילינג מהיר, RBAC.</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-muted/20">
            <h2 className="text-lg font-semibold text-white mb-2">On‑Prem</h2>
            <p className="text-muted-foreground">שליטה מלאה על נתונים, בידוד רשת, התאמה למדיניות ארגונית.</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-muted/20">
            <h2 className="text-lg font-semibold text-white mb-2">Hybrid</h2>
            <p className="text-muted-foreground">Agent Desktop, טאנלים מאובטחים, סנכרון מוגן בין סביבות.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


