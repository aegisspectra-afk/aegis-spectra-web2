"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Package, Mail, Phone, ArrowRight, Download } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const token = searchParams.get("token");
    const payerId = searchParams.get("PayerID");

    if (token && payerId) {
      // Capture PayPal order
      fetch("/api/payments/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "COMPLETED") {
            setOrderId(data.orderId);
            setOrderDetails(data);
            setLoading(false);
            
            // Clear cart
            localStorage.removeItem("cart");
            
            // Track conversion
            if (typeof window !== "undefined" && (window as any).gtag) {
              (window as any).gtag("event", "purchase", {
                transaction_id: data.orderId,
                value: data.amount?.value || 0,
                currency: data.amount?.currency_code || "ILS",
              });
            }
          } else {
            router.push("/checkout?error=payment_failed");
          }
        })
        .catch((error) => {
          console.error("Error capturing order:", error);
          router.push("/checkout?error=payment_failed");
        });
    } else if (sessionId) {
      // Mock order for development
      setOrderId(sessionId);
      setOrderDetails({
        status: "COMPLETED",
        orderId: sessionId,
        amount: { value: "0", currency_code: "ILS" },
      });
      setLoading(false);
      localStorage.removeItem("cart");
    } else {
      setLoading(false);
    }
  }, [searchParams, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-charcoal text-white flex items-center justify-center">
        <div className="text-center">
          <div className="size-12 border-2 border-zinc-700 border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">מאמת תשלום...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-charcoal text-white">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="size-24 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="size-12 text-green-400" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                תשלום הושלם בהצלחה!
              </h1>
              <p className="text-zinc-400 text-lg">
                תודה על רכישתך. ההזמנה שלך התקבלה ומתעבדת
              </p>
            </div>
          </ScrollReveal>

          {orderId && (
            <ScrollReveal delay={0.1}>
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm mb-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                    <div className="flex items-center gap-3">
                      <Package className="size-6 text-gold" />
                      <div>
                        <p className="text-sm text-zinc-400">מספר הזמנה</p>
                        <p className="font-bold text-lg">{orderId}</p>
                      </div>
                    </div>
                    {orderDetails?.amount && (
                      <div className="text-left">
                        <p className="text-sm text-zinc-400">סה״כ שולם</p>
                        <p className="font-bold text-xl text-gold">
                          {orderDetails.amount.value} {orderDetails.amount.currency_code}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-6 rounded-xl bg-zinc-800/30 border border-zinc-700">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Mail className="size-5 text-gold" />
                      מה קורה עכשיו?
                    </h3>
                    <ul className="space-y-3 text-sm text-zinc-300">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>קיבלנו את פרטי התשלום שלך</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>נטפל בהזמנה שלך ונחזור אליך תוך 24 שעות</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>נשלח אליך אישור במייל (אם צוין) או SMS</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>נקבע מועד התקנה/מסירה בהתאם למוצר שביקשת</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-xl bg-zinc-800/30 border border-zinc-700">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Phone className="size-5 text-gold" />
                      שאלות?
                    </h3>
                    <p className="text-sm text-zinc-300 mb-4">
                      אם יש לך שאלות או דרישות מיוחדות, אנא צור איתנו קשר:
                    </p>
                    <div className="space-y-2">
                      <a
                        href="tel:+972559737025"
                        className="block text-gold hover:text-gold/80 transition"
                      >
                        📞 +972-55-973-7025
                      </a>
                      <a
                        href="https://wa.me/972559737025"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-gold hover:text-gold/80 transition"
                      >
                        💬 WhatsApp
                      </a>
                      <a
                        href="mailto:aegisspectra@gmail.com"
                        className="block text-gold hover:text-gold/80 transition"
                      >
                        📧 aegisspectra@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/user"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold text-black px-8 py-4 font-semibold hover:bg-gold/90 transition"
              >
                <ArrowRight className="size-5" />
                לדשבורד שלי
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-black/30 px-8 py-4 font-semibold hover:bg-zinc-800 transition"
              >
                <Package className="size-5" />
                המשך קניות
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <Footer />
    </main>
  );
}

