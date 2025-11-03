import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <main className="container-max py-16 space-y-8">
        <h1 className="text-3xl md:text-4xl font-heading text-white">תקנים, תאימות ואמון</h1>
        <p className="text-muted-foreground max-w-3xl">ארכיטקטורת אבטחה, בקרות טכניות, הצפנה, גיבויים, ניהול גישה (RBAC), והפרדת דומים בין אתר שיווקי למערכת (SaaS).</n>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border border-border bg-muted/20">
            <h2 className="text-xl font-semibold text-white mb-2">ארכיטקטורה</h2>
            <p className="text-muted-foreground">CSP מוקפד, CORS סלקטיבי, JWT, הפרדת נתונים Multi‑tenant ורולבייס.</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-muted/20">
            <h2 className="text-xl font-semibold text-white mb-2">תאימות</h2>
            <p className="text-muted-foreground">יישור קו ל‑ISO 27001/SOC 2 (בשלבים), DPA, הצפנת נתונים במעבר ובמנוחה.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


