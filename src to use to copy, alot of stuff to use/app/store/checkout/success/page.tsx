'use client';

import { Section } from '@/components/common/section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Package,
  Mail,
  Phone,
  Download,
  Home,
  ShoppingCart,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useCart } from '@/contexts/cart-context';
import { useEffect, useMemo, useRef, useState } from 'react';

// =====================
// Utils
// =====================
const ils = (n: number | undefined | null) =>
  `₪${Number(n || 0).toLocaleString('he-IL')}`;

const now = () => new Date();

// =====================
// Types (loose to avoid TS pain if order shape changes)
// =====================
interface OrderItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
}
interface Customer {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}
interface OrderShape {
  id?: string;
  createdAt?: string | number | Date;
  items?: OrderItem[];
  subtotal?: number;
  shipping?: number;
  discount?: number;
  total?: number;
  shippingMethod?: string;
  trackingUrl?: string;
  customer?: Customer;
}

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<OrderShape | null>(null);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  // Mount only on client (prevents SSR hydration flashes)
  useEffect(() => setMounted(true), []);

  // Reduced motion preference
  useEffect(() => {
    try {
      const m = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)');
      if (m && 'matches' in m) setPrefersReduced(m.matches);
    } catch {}
  }, []);

  // Load order + clear cart once
  useEffect(() => {
    if (!mounted) return;
    try { headingRef.current?.focus?.(); } catch {}
    try {
      const saved = sessionStorage.getItem('aegis-last-order');
      if (saved) {
        setOrder(JSON.parse(saved));
      } else {
        setOrder({ items: [], subtotal: 0, shipping: 0, discount: 0, total: 0 });
      }
    } catch {
      setOrder({ items: [], subtotal: 0, shipping: 0, discount: 0, total: 0 });
    }

    // Clear cart AFTER reading order
    try { clearCart(); } catch {}
    try { localStorage.setItem('aegis-cart', JSON.stringify([])); } catch {}
  }, [mounted, clearCart]);

  // Derived
  const orderId = useMemo(() => {
    if (!order?.id) {
      // Generate a short, readable fallback
      const rnd = Math.floor(Math.random() * 900000 + 100000);
      return `AS-${new Date().getFullYear()}-${rnd}`;
    }
    return String(order.id);
  }, [order?.id]);

  const createdAtFormatted = useMemo(() => {
    const d = order?.createdAt ? new Date(order.createdAt) : now();
    return d.toLocaleDateString('he-IL');
  }, [order?.createdAt]);

  const shippingMethod = (order?.shippingMethod || 'משלוח רגיל').toString();
  const etaText =
    shippingMethod === 'אקספרס' || shippingMethod.toLowerCase() === 'express'
      ? '1–2 ימי עסקים'
      : '3–5 ימי עסקים';

  // JSON-LD Order (no PII)
  const orderJsonLd = useMemo(() => {
    if (!order) return null;
    try {
      return {
        '@context': 'https://schema.org',
        '@type': 'Order',
        orderNumber: orderId,
        priceCurrency: 'ILS',
        price: order?.total || 0,
        orderDate: order?.createdAt
          ? new Date(order.createdAt as unknown as string).toISOString()
          : new Date().toISOString(),
        seller: { '@type': 'Organization', name: 'Aegis Spectra Security' },
        acceptedOffer: (order?.items || []).map((it: OrderItem) => ({
          '@type': 'Offer',
          price: it.price || 0,
          priceCurrency: 'ILS',
          itemOffered: { '@type': 'Product', name: it.name },
        })),
      } as const;
    } catch {
      return null;
    }
  }, [order, orderId]);

  const handleDownloadInvoice = async () => {
    // Prefer server-side PDF; fallback to client HTML
    try {
      const res = await fetch('/api/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, order }),
      });
      if (!res.ok) throw new Error('invoice-failed');
      const blob = await res.blob();
      const contentType = res.headers.get('content-type') || '';
      const ext = contentType.includes('pdf') ? 'pdf' : (contentType.includes('html') ? 'html' : 'bin');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderId}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return;
    } catch {}

    try {
      const date = now().toLocaleString('he-IL');
      const items = (order?.items || []) as OrderItem[];
      const rows = items
        .map(
          (it) => `
        <tr>
          <td style="padding:10px;border:1px solid #1f2937;">${it.name}</td>
          <td style="padding:10px;border:1px solid #1f2937;">${it.quantity}</td>
          <td style="padding:10px;border:1px solid #1f2937;">₪${(it.price || 0).toLocaleString('he-IL')}</td>
          <td style="padding:10px;border:1px solid #1f2937;">₪${((it.price || 0) * (it.quantity || 1)).toLocaleString('he-IL')}</td>
        </tr>`
        )
        .join('');

      const html = `<!doctype html><html dir=\"rtl\" lang=\"he\"><head>
        <meta charset=\"utf-8\"/>
        <title>חשבונית ${orderId}</title>
        <style>
          :root{color-scheme:dark light}
          body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Heebo,Arial,sans-serif;margin:0;padding:32px;background:#0b1020;color:#e5e7eb}
          .brand{display:flex;align-items:center;gap:12px}
          .chip{display:inline-block;padding:4px 10px;border-radius:999px;background:#0ea5a4; color:#04111a; font-weight:700; font-size:12px}
          h1{margin:0 0 4px;font-size:22px}
          h2{margin:22px 0 8px;font-size:16px;color:#93c5fd}
          table{border-collapse:collapse;width:100%;margin-top:12px;border-radius:12px;overflow:hidden}
          thead th{background:#0b1c33}
          .muted{color:#9ca3af}
          .totals{margin-top:16px;float:left;text-align:left}
          .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:14px}
          .card{background:#0b1c33;border:1px solid #1f3460;border-radius:12px;padding:14px}
          @media print {
            body { background:#fff; color:#000; padding:16px; }
            .card{ background:#fff; border-color:#ddd; }
            thead th{ background:#f2f2f2; }
            a[href]:after { content: \"\" !important; }
            .no-print { display:none !important; }
          }
        </style>
      </head><body>
        <div class=\"brand\">
          <div class=\"chip\">Aegis Spectra</div>
          <h1>אישור הזמנה / קבלה זמנית</h1>
        </div>
        <div class=\"muted\">מס' הזמנה: ${orderId} • תאריך: ${date}</div>

        <div class=\"grid\">
          <div class=\"card\">
            <h2>פרטי לקוח</h2>
            <div class=\"muted\">שם: ${(order?.customer?.firstName || '') + ' ' + (order?.customer?.lastName || '')}</div>
            <div class=\"muted\">אימייל: ${order?.customer?.email || ''}</div>
            <div class=\"muted\">טלפון: ${order?.customer?.phone || ''}</div>
            <div class=\"muted\">כתובת: ${(order?.customer?.address || '')}, ${(order?.customer?.city || '')} ${(order?.customer?.postalCode || '')}</div>
          </div>
          <div class=\"card\">
            <h2>משלוח</h2>
            <div class=\"muted\">שיטה: ${shippingMethod}</div>
            <div class=\"muted\">ETA: ${etaText}</div>
          </div>
        </div>

        <h2>פריטים</h2>
        <table>
          <thead>
            <tr>
              <th style=\"padding:10px;border:1px solid #1f2937;text-align:right\">פריט</th>
              <th style=\"padding:10px;border:1px solid #1f2937;text-align:right\">כמות</th>
              <th style=\"padding:10px;border:1px solid #1f2937;text-align:right\">מחיר</th>
              <th style=\"padding:10px;border:1px solid #1f2937;text-align:right\">סך</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <div class=\"totals\">
          <div>סכום ביניים: ${ils(order?.subtotal)}</div>
          <div>משלוח: ${ils(order?.shipping)}</div>
          <div>הנחה: ${ils(order?.discount)}</div>
          <h2>לתשלום: ${ils(order?.total)}</h2>
        </div>
        <script>window.onload=()=>{window.print();}</script>
      </body></html>`;

      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderId}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {}
  };

  // Send order email once when order is present
  useEffect(() => {
    if (!mounted || !order) return;
    const sentKey = `aegis-order-emailed-${orderId}`;
    try {
      if (sessionStorage.getItem(sentKey)) return;
    } catch {}
    (async () => {
      try {
        await fetch('/api/orders/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, order, method: 'PAYPAL' }),
        });
        try { sessionStorage.setItem(sentKey, '1'); } catch {}
      } catch {}
    })();
  }, [mounted, order, orderId]);

  // Show full details on page; strip PII on leave (and after timeout fallback)
  useEffect(() => {
    if (!mounted || !order) return;
    const strip = () => {
      try {
        const minimal = {
          id: orderId,
          createdAt: order.createdAt || new Date().toISOString(),
          items: order.items || [],
          subtotal: order.subtotal,
          shipping: order.shipping,
          discount: order.discount,
          total: order.total,
          shippingMethod: order.shippingMethod,
          trackingUrl: order.trackingUrl,
        };
        sessionStorage.setItem('aegis-last-order', JSON.stringify(minimal));
      } catch {}
    };
    window.addEventListener('beforeunload', strip);
    const t = window.setTimeout(strip, 120000);
    return () => {
      window.removeEventListener('beforeunload', strip);
      window.clearTimeout(t);
    };
  }, [mounted, orderId, order]);

  // GA4 purchase event
  useEffect(() => {
    if (!mounted || !order) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: 'purchase',
        transaction_id: orderId,
        value: order?.total || 0,
        currency: 'ILS',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: (order?.items || []).map((it: any) => ({ item_name: it.name, price: it.price, quantity: it.quantity })),
      });
    } catch {}
  }, [mounted, orderId, order]);

  if (!mounted || !order) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <main className="pt-16">
          <Section className="py-20">
            <div className="max-w-2xl mx-auto text-center text-foreground/70">טוען…</div>
          </Section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden" dir="rtl">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_20%,#000_30%,transparent_80%)]"
      >
        <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-[conic-gradient(at_top_right,theme(colors.aegis.blue)/40%,transparent_40%)] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-[conic-gradient(at_bottom_left,theme(colors.aegis.teal)/35%,transparent_40%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,transparent_0,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:22px_22px]" />
      </div>

      <Navbar />

      <main className="pt-16">
        <Section className="py-12">
          <div className="max-w-6xl mx-auto">
            {/* Hero */}
            <div className="text-center">
              <motion.div
                initial={prefersReduced ? undefined : { scale: 0.8, opacity: 0 }}
                animate={prefersReduced ? undefined : { scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 160, damping: 18 }}
                className="mb-6 inline-flex items-center justify-center"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center bg-gradient-to-br from-aegis-teal/25 to-aegis-blue/25 ring-2 ring-aegis-blue/40 shadow-[0_0_40px_-10px_rgba(21,128,255,0.6)]">
                  <CheckCircle size={56} className="text-aegis-blue" />
                </div>
              </motion.div>

              <motion.h1
                initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
                animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold tracking-tight text-aegis-blue outline-none"
                tabIndex={-1}
                aria-live="polite"
                ref={headingRef}
              >
                ההזמנה בוצעה בהצלחה
              </motion.h1>
              <motion.p
                initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
                animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-2 text-base md:text-lg text-foreground/70"
              >
                תודה על הרכישה! אישור עם פרטי ההזמנה נשלח אליך למייל.
              </motion.p>
            </div>

            {/* Grid: Details + Next Steps */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Details */}
              <motion.div
                initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
                animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="lg:col-span-2"
              >
                <Card className="border-aegis-blue/20 shadow-[0_0_25px_-12px_rgba(21,128,255,0.5)]">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="flex items-center gap-2">
                      <Package size={20} />
                      פרטי ההזמנה
                    </CardTitle>
                    <CardDescription>מס' הזמנה <span className="font-mono">#{orderId}</span></CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Top meta */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Meta label="תאריך הזמנה" value={createdAtFormatted} />
                      <Meta label="סכום כולל" value={<span className="font-semibold text-aegis-teal">{ils(order?.total)}</span>} />
                      <Meta label="סטטוס" value={<span className="text-green-500">מאושר</span>} />
                      <Meta label="שיטת משלוח" value={shippingMethod} />
                    </div>

                    {/* Customer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Meta label="שם לקוח" value={`${order?.customer?.firstName || ''} ${order?.customer?.lastName || ''}`} />
                      <Meta label="אימייל" value={order?.customer?.email || ''} />
                      <Meta label="טלפון" value={order?.customer?.phone || ''} />
                      <Meta label="כתובת" value={`${order?.customer?.address || ''}, ${order?.customer?.city || ''} ${order?.customer?.postalCode || ''}`} />
                    </div>

                    {/* Items Table */}
                    <div className="overflow-hidden rounded-lg border border-border/60">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/40">
                          <tr className="*:*:p-3 text-right">
                            <th scope="col">פריט</th>
                            <th scope="col">כמות</th>
                            <th scope="col">מחיר יח׳</th>
                            <th scope="col">סכום</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(order?.items || []).map((it, idx) => (
                            <tr key={idx} className="border-t border-border/60 *:*:p-3">
                              <td className="font-medium">{it.name}</td>
                              <td>{it.quantity}</td>
                              <td>{ils(it.price)}</td>
                              <td>{ils((it.price || 0) * (it.quantity || 1))}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                      <Kpi label="סכום ביניים" value={ils(order?.subtotal)} />
                      <Kpi label="משלוח" value={ils(order?.shipping)} />
                      <Kpi label="הנחה" value={ils(order?.discount)} />
                      <Kpi label="לתשלום" value={ils(order?.total)} highlight />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Next Steps / Help */}
              <motion.div
                initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
                animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                className="space-y-6"
              >
                {/* Next Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle>מה קורה עכשיו?</CardTitle>
                    <CardDescription>להלן השלבים הבאים בתהליך</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-4">
                      <Step n={1} title="אישור ההזמנה" text="אימייל אישור נשלח אליך עם כל הפרטים." />
                      <Step n={2} title="הכנת ההזמנה" text="הציוד נארז בקפידה ומוכן לשילוח." />
                      <Step
                        n={3}
                        title="משלוח"
                        text={`שיטת משלוח: ${shippingMethod} • זמן הגעה משוער: ${etaText}`}
                        linkLabel={order?.trackingUrl ? 'מעקב אחר המשלוח' : undefined}
                        linkHref={order?.trackingUrl}
                      />
                      <Step n={4} title="התקנה ותמיכה" text="ניצור קשר לתיאום התקנה מקצועית והדרכה." />
                    </ol>
                  </CardContent>
                </Card>

                {/* Help */}
                <Card>
                  <CardHeader>
                    <CardTitle>צריך עזרה?</CardTitle>
                    <CardDescription>הצוות שלנו כאן בשבילך</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-3">
                        <Mail size={20} className="text-aegis-teal" />
                        <div>
                          <div className="font-medium">אימייל</div>
                          <div className="text-sm text-foreground/70">support@aegis-spectra.com</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone size={20} className="text-aegis-teal" />
                        <div>
                          <div className="font-medium">טלפון</div>
                          <div className="text-sm text-foreground/70">03-1234567</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-5">
                      <Button asChild variant="outline" size="sm">
                        <a href="mailto:support@aegis-spectra.com">שליחת מייל</a>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <a href="tel:+97231234567">התקשר עכשיו</a>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <a href={`https://wa.me/972501234567?text=${encodeURIComponent('היי, הזמנה #' + orderId)}`} target="_blank" rel="noopener noreferrer">צ׳אט ב‑WhatsApp</a>
                      </Button>
                      <Button asChild size="sm" variant="aegis" className="bg-aegis-blue text-white hover:bg-aegis-blue/90">
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-2 whitespace-nowrap font-medium text-white !text-white visited:!text-white hover:!text-white focus:!text-white active:!text-white hover:no-underline"
                        >
                          פתח קריאת שירות
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href="/guides">מדריכים ושאלות נפוצות</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* CTA Row */}
            <motion.div
              initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
              animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button asChild size="lg" className="bg-aegis-blue text-white hover:bg-aegis-blue/90">
                <Link href="/store" className="inline-flex items-center gap-2 whitespace-nowrap font-medium text-white">
                  <ShoppingCart size={20} className="text-white" />
                  <span className="whitespace-nowrap">המשך קנייה</span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={handleDownloadInvoice} disabled={!order?.items || (order.items as any[]).length === 0} className="inline-flex items-center gap-2">
                <Download size={20} /> הורד חשבונית (HTML/PDF)
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/" className="inline-flex items-center gap-2 whitespace-nowrap">
                  <Home size={20} /> <span className="whitespace-nowrap">חזור לדף הבית</span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </Section>
      </main>
      {orderJsonLd ? (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orderJsonLd) }}
        />
      ) : null}
      <Footer />
    </div>
  );
}

// =====================
// Small presentational helpers
// =====================
function Meta({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="text-right">
      <div className="text-xs text-foreground/60">{label}</div>
      <div className="font-medium break-words">{value || '—'}</div>
    </div>
  );
}

function Kpi({ label, value, highlight }: { label: string; value?: React.ReactNode; highlight?: boolean }) {
  return (
    <div
      className={
        'rounded-lg border px-4 py-3 text-right ' +
        (highlight ? 'border-aegis-blue/50 bg-aegis-blue/10' : 'border-border/60')
      }
    >
      <div className="text-xs text-foreground/60">{label}</div>
      <div className="text-lg font-semibold">{value || '—'}</div>
    </div>
  );
}

function Step({ n, title, text, linkLabel, linkHref }: { n: number; title: string; text: string; linkLabel?: string; linkHref?: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="w-8 h-8 bg-aegis-blue text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
        {n}
      </div>
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-foreground/70">
          {text}
          {linkLabel && linkHref ? (
            <>
              {' '}
              <Link
                href={linkHref}
                className="inline-flex items-center gap-1 whitespace-nowrap font-medium text-aegis-blue !text-aegis-blue hover:underline"
              >
                {linkLabel}
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </li>
  );
}
