'use client';

import Link from 'next/link';
import { Section } from '@/components/common/section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Package, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const packages = [
  { code: 'H-01', name: 'Home Cam H-01 (2TB)', desc: '2× I4-340IP5 (4MP) · NVR5-4100PX+ · HDD 2TB', price: '₪2,290', href: '/products/home-cam' },
  { code: 'H-01 Lite', name: 'Home Cam H-01 Lite (1TB)', desc: '2× I4-340IP5 (4MP) · NVR5-4100PX+ · HDD 1TB', price: '₪2,190–2,290', href: '/contact?pkg=home-cam-h01-lite' },
  { code: 'H-02', name: 'Home Cam H-02 (4TB)', desc: '2× I4-340IP5 · NVR5-4100PX+ · HDD 4TB', price: '₪2,990–3,190', href: '/contact?pkg=home-cam-h02' },
  { code: 'H-02X', name: 'Home Cam H-02X (4× מצלמות, 4TB)', desc: '4× I4-340IP5 · NVR5-4100PX+ · HDD 4TB', price: '₪3,990–4,290', href: '/contact?pkg=home-cam-h02x' },
  { code: 'H-02 Pro', name: 'Home Cam H-02 Pro (2× Turret + 2× Bullet, 4TB)', desc: 'Mix אסתטי/פונקציונלי · NVR5-4100PX+ · HDD 4TB', price: '₪4,290–4,590', href: '/contact?pkg=home-cam-h02-pro' },
];

export default function HomeCamPackagesPage() {
  const [submitting, setSubmitting] = useState<string | null>(null);

  const manualPurchase = async (pkg: (typeof packages)[number], method: 'BIT' | 'PAYBOX') => {
    if (submitting) return;
    setSubmitting(`${pkg.code}:${method}`);
    try {
      const res = await fetch('/api/orders/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          pkgCode: pkg.code,
          pkgName: pkg.name,
          price: pkg.price,
        }),
      });
      if (!res.ok) throw new Error('failed');
      toast.success('הזמנה נרשמה. ניצור קשר להשלמת התשלום.');
    } catch {
      toast.error('שגיאה בשליחת ההזמנה. נסו שוב.');
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div dir="rtl">
      <Section className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border border-aegis-blue/40 bg-aegis-blue/10 text-aegis-blue">
              <Shield size={14} /> מותאם לבית – התקנה מקצועית
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mt-3">חבילות התקנה – Home Cam</h1>
            <p className="text-foreground/70 mt-2">בחר את הרמה: טוב • יותר טוב • הכי טוב. ניתן לשדרג אחסון ותוספים.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((p) => (
              <Card key={p.code} className="border-border/60">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{p.name}</span>
                    <span className="text-aegis-blue text-sm">{p.code}</span>
                  </CardTitle>
                  <CardDescription>{p.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-semibold">{p.price}</div>
                    <Button asChild className="bg-aegis-blue text-white hover:bg-aegis-blue/90">
                      <Link href={p.href} className="inline-flex items-center gap-2 whitespace-nowrap font-medium text-white !text-white visited:!text-white hover:!text-white">
                        <Package size={16}/> לפרטים / הזמנה
                      </Link>
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">4MP PoE</Badge>
                    <Badge variant="outline">NVR 4CH</Badge>
                    <Badge variant="outline">אחסון ניתן לשדרוג</Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Button onClick={() => manualPurchase(p, 'BIT')} disabled={submitting === `${p.code}:BIT`}
                      className="w-full bg-green-600 hover:bg-green-600/90 text-white">
                      תשלום Bit
                    </Button>
                    <Button onClick={() => manualPurchase(p, 'PAYBOX')} disabled={submitting === `${p.code}:PAYBOX`}
                      className="w-full bg-purple-600 hover:bg-purple-600/90 text-white">
                      תשלום PayBox
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}


