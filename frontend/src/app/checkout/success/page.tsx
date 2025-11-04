"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Package,
  Mail,
  Phone,
  Download,
  Home,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/cart-context";
import Link from "next/link";

const ils = (n: number | undefined | null) =>
  `₪${Number(n || 0).toLocaleString("he-IL")}`;

interface OrderItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  sku?: string;
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<OrderShape | null>(null);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    try {
      const m =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)");
      if (m && "matches" in m) setPrefersReduced(m.matches);
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      headingRef.current?.focus?.();
    } catch {}
    try {
      const saved = sessionStorage.getItem("aegis-last-order");
      if (saved) {
        setOrder(JSON.parse(saved));
      } else {
        // Try to get order from URL params
        const orderId = searchParams.get("orderId");
        if (orderId) {
          setOrder({
            id: orderId,
            items: [],
            subtotal: 0,
            shipping: 0,
            discount: 0,
            total: 0,
          });
        } else {
          setOrder({
            items: [],
            subtotal: 0,
            shipping: 0,
            discount: 0,
            total: 0,
          });
        }
      }
    } catch {
      setOrder({
        items: [],
        subtotal: 0,
        shipping: 0,
        discount: 0,
        total: 0,
      });
    }

    try {
      clearCart();
    } catch {}
    try {
      localStorage.removeItem("cart");
    } catch {}
  }, [mounted, clearCart, searchParams]);

  const orderId = useMemo(() => {
    if (!order?.id) {
      const rnd = Math.floor(Math.random() * 900000 + 100000);
      return `AS-${new Date().getFullYear()}-${rnd}`;
    }
    return String(order.id);
  }, [order?.id]);

  const createdAtFormatted = useMemo(() => {
    const d = order?.createdAt
      ? new Date(order.createdAt)
      : new Date();
    return d.toLocaleDateString("he-IL");
  }, [order?.createdAt]);

  const shippingMethod = (order?.shippingMethod || "משלוח רגיל").toString();
  const etaText =
    shippingMethod === "אקספרס" ||
    shippingMethod.toLowerCase() === "express"
      ? "1–2 ימי עסקים"
      : "3–5 ימי עסקים";

  const handleDownloadInvoice = async () => {
    try {
      const res = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, order }),
      });
      if (!res.ok) throw new Error("invoice-failed");
      const blob = await res.blob();
      const contentType = res.headers.get("content-type") || "";
      const ext = contentType.includes("pdf")
        ? "pdf"
        : contentType.includes("html")
        ? "html"
        : "bin";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${orderId}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return;
    } catch {
      // Fallback: client-side HTML generation
      try {
        const date = new Date().toLocaleString("he-IL");
        const items = (order?.items || []) as OrderItem[];
        const rows = items
          .map(
            (it) => `
        <tr>
          <td style="padding:10px;border:1px solid #1f2937;">${it.name}</td>
          <td style="padding:10px;border:1px solid #1f2937;">${it.quantity}</td>
          <td style="padding:10px;border:1px solid #1f2937;">₪${(it.price || 0).toLocaleString("he-IL")}</td>
          <td style="padding:10px;border:1px solid #1f2937;">₪${((it.price || 0) * (it.quantity || 1)).toLocaleString("he-IL")}</td>
        </tr>`
          )
          .join("");

        const html = `<!doctype html><html dir="rtl" lang="he"><head>
        <meta charset="utf-8"/>
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
            a[href]:after { content: "" !important; }
            .no-print { display:none !important; }
          }
        </style>
      </head><body>
        <div class="brand">
          <div class="chip">Aegis Spectra</div>
          <h1>אישור הזמנה / קבלה זמנית</h1>
        </div>
        <div class="muted">מס' הזמנה: ${orderId} • תאריך: ${date}</div>

        <div class="grid">
          <div class="card">
            <h2>פרטי לקוח</h2>
            <div class="muted">שם: ${(order?.customer?.firstName || "") + " " + (order?.customer?.lastName || "")}</div>
            <div class="muted">אימייל: ${order?.customer?.email || ""}</div>
            <div class="muted">טלפון: ${order?.customer?.phone || ""}</div>
            <div class="muted">כתובת: ${(order?.customer?.address || "")}, ${(order?.customer?.city || "")} ${(order?.customer?.postalCode || "")}</div>
          </div>
          <div class="card">
            <h2>משלוח</h2>
            <div class="muted">שיטה: ${shippingMethod}</div>
            <div class="muted">ETA: ${etaText}</div>
          </div>
        </div>

        <h2>פריטים</h2>
        <table>
          <thead>
            <tr>
              <th style="padding:10px;border:1px solid #1f2937;text-align:right">פריט</th>
              <th style="padding:10px;border:1px solid #1f2937;text-align:right">כמות</th>
              <th style="padding:10px;border:1px solid #1f2937;text-align:right">מחיר</th>
              <th style="padding:10px;border:1px solid #1f2937;text-align:right">סך</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <div class="totals">
          <div>סכום ביניים: ${ils(order?.subtotal)}</div>
          <div>משלוח: ${ils(order?.shipping)}</div>
          <div>הנחה: ${ils(order?.discount)}</div>
          <h2>לתשלום: ${ils(order?.total)}</h2>
        </div>
        <script>window.onload=()=>{window.print();}</script>
      </body></html>`;

        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${orderId}.html`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch {}
    }
  };

  useEffect(() => {
    if (!mounted || !order) return;
    const sentKey = `aegis-order-emailed-${orderId}`;
    try {
      if (sessionStorage.getItem(sentKey)) return;
    } catch {}
    (async () => {
      try {
        await fetch("/api/orders/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, order, method: "MANUAL" }),
        });
        try {
          sessionStorage.setItem(sentKey, "1");
        } catch {}
      } catch {}
    })();
  }, [mounted, order, orderId]);

  if (!mounted || !order) {
    return (
      <main className="min-h-screen bg-charcoal text-white">
        <Navbar />
        <div className="pt-24 pb-20 text-center">
          <div className="max-w-2xl mx-auto px-4">
          <div className="size-12 border-2 border-zinc-700 border-t-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="text-zinc-400">טוען...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-charcoal text-white">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <motion.div
                initial={prefersReduced ? undefined : { scale: 0.8, opacity: 0 }}
                animate={prefersReduced ? undefined : { scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 160, damping: 18 }}
                className="mb-6 inline-flex items-center justify-center"
              >
                <div className="size-24 md:size-28 rounded-full flex items-center justify-center bg-gradient-to-br from-gold/25 to-gold/10 border-4 border-gold shadow-[0_0_40px_-10px_rgba(234,179,8,0.6)]">
                  <CheckCircle className="size-12 md:size-14 text-gold" />
                </div>
              </motion.div>

              <motion.h1
                initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
                animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold mb-4"
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
                className="text-lg text-zinc-400"
              >
                תודה על הרכישה! אישור עם פרטי ההזמנה נשלח אליך למייל.
              </motion.p>
            </div>
          </ScrollReveal>

          {/* Grid: Details + Next Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Details */}
            <ScrollReveal delay={0.25}>
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 sm:p-8 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Package className="size-6 text-gold" />
                    פרטי ההזמנה
                  </h2>
                  <p className="text-zinc-400 mb-6">מס' הזמנה: <span className="font-mono text-gold">{orderId}</span></p>

                <div className="space-y-6">
                    {/* Top meta */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-zinc-400">תאריך הזמנה</div>
                        <div className="font-semibold">{createdAtFormatted}</div>
                      </div>
                      <div>
                        <div className="text-sm text-zinc-400">סכום כולל</div>
                        <div className="font-semibold text-gold text-lg">{ils(order?.total)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-zinc-400">סטטוס</div>
                        <div className="text-green-400 font-semibold">מאושר</div>
                      </div>
                      <div>
                        <div className="text-sm text-zinc-400">שיטת משלוח</div>
                        <div className="font-semibold">{shippingMethod}</div>
                      </div>
                    </div>

                    {/* Customer */}
                    {order?.customer && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                        <div>
                          <div className="text-sm text-zinc-400">שם לקוח</div>
                          <div className="font-semibold">{`${order.customer.firstName || ""} ${order.customer.lastName || ""}`}</div>
                        </div>
                        {order.customer.email && (
                          <div>
                            <div className="text-sm text-zinc-400">אימייל</div>
                            <div className="font-semibold">{order.customer.email}</div>
                          </div>
                        )}
                        {order.customer.phone && (
                          <div>
                            <div className="text-sm text-zinc-400">טלפון</div>
                            <div className="font-semibold">{order.customer.phone}</div>
                          </div>
                        )}
                        {(order.customer.address || order.customer.city) && (
                          <div>
                            <div className="text-sm text-zinc-400">כתובת</div>
                            <div className="font-semibold">{`${order.customer.address || ""}, ${order.customer.city || ""} ${order.customer.postalCode || ""}`}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Items Table */}
                    {order?.items && order.items.length > 0 && (
                      <div className="overflow-hidden rounded-lg border border-zinc-800">
                        <table className="w-full text-sm">
                          <thead className="bg-zinc-800/50">
                            <tr className="*:*:p-3 text-right">
                              <th scope="col">פריט</th>
                              <th scope="col">כמות</th>
                              <th scope="col">מחיר יח׳</th>
                              <th scope="col">סכום</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((it, idx) => (
                              <tr key={idx} className="border-t border-zinc-800 *:*:p-3">
                                <td className="font-medium">{it.name}</td>
                                <td>{it.quantity}</td>
                                <td>{ils(it.price)}</td>
                                <td>{ils((it.price || 0) * (it.quantity || 1))}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Totals */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-zinc-800">
                      <div>
                        <div className="text-sm text-zinc-400">סכום ביניים</div>
                        <div className="font-semibold">{ils(order?.subtotal)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-zinc-400">משלוח</div>
                        <div className="font-semibold">{ils(order?.shipping)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-zinc-400">הנחה</div>
                        <div className="font-semibold text-green-400">{ils(order?.discount)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-zinc-400">לתשלום</div>
                        <div className="font-semibold text-gold text-lg">{ils(order?.total)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Next Steps / Help */}
            <ScrollReveal delay={0.32}>
              <div className="space-y-6">
                {/* Next Steps */}
                <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-4">מה קורה עכשיו?</h3>
                  <ol className="space-y-4 text-sm">
                      <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 size-6 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">1</span>
                      <div>
                        <div className="font-semibold mb-1">אישור ההזמנה</div>
                        <div className="text-zinc-400">אימייל אישור נשלח אליך עם כל הפרטים.</div>
                      </div>
                      </li>
                      <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 size-6 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">2</span>
                      <div>
                        <div className="font-semibold mb-1">הכנת ההזמנה</div>
                        <div className="text-zinc-400">הציוד נארז בקפידה ומוכן לשילוח.</div>
                      </div>
                      </li>
                      <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 size-6 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">3</span>
                      <div>
                        <div className="font-semibold mb-1">משלוח</div>
                        <div className="text-zinc-400">שיטת משלוח: {shippingMethod} • זמן הגעה משוער: {etaText}</div>
                      </div>
                      </li>
                      <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 size-6 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">4</span>
                      <div>
                        <div className="font-semibold mb-1">התקנה ותמיכה</div>
                        <div className="text-zinc-400">ניצור קשר לתיאום התקנה מקצועית והדרכה.</div>
                      </div>
                      </li>
                  </ol>
                  </div>

                {/* Help */}
                <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-4">צריך עזרה?</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Mail className="size-5 text-gold" />
                      <div>
                        <div className="font-semibold">אימייל</div>
                        <a href="mailto:aegisspectra@gmail.com" className="text-gold hover:underline">
                          aegisspectra@gmail.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="size-5 text-gold" />
                      <div>
                        <div className="font-semibold">טלפון</div>
                        <a href="tel:+972559737025" className="text-gold hover:underline">
                          +972-55-973-7025
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* CTA Row */}
          <ScrollReveal delay={0.38}>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold text-black px-8 py-4 font-semibold hover:bg-gold/90 transition"
              >
                <ShoppingCart className="size-5" />
                המשך קנייה
              </Link>
              <button
                onClick={handleDownloadInvoice}
                disabled={!order?.items || order.items.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-black/30 px-8 py-4 font-semibold hover:bg-zinc-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="size-5" />
                הורד חשבונית (HTML/PDF)
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-black/30 px-8 py-4 font-semibold hover:bg-zinc-800 transition"
              >
                <Home className="size-5" />
                חזור לדף הבית
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <Footer />
    </main>
  );
}
