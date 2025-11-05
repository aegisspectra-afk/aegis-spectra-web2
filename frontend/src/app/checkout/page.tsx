/**
 * Checkout Page - עמוד רכישה
 */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, CreditCard, Lock, CheckCircle, ArrowRight, Package } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useReCaptcha } from '@/components/ReCaptcha';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const { execute: executeRecaptcha, isReady: recaptchaReady } = useReCaptcha("checkout_form");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    notes: '',
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + shipping;

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0 && step === 1) {
      router.push('/cart');
    }
  }, [cart, router, step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      // Get reCAPTCHA token
      let recaptchaToken: string | null = null;
      if (recaptchaReady) {
        try {
          recaptchaToken = await executeRecaptcha();
        } catch (err) {
          console.warn("reCAPTCHA failed, continuing without it:", err);
        }
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("address", formData.address);
      
      let messageContent = `הזמנה מהעגלה:\n\n`;
      cart.forEach((item, index) => {
        messageContent += `${index + 1}. ${item.name}\n`;
        messageContent += `   מחיר: ${item.price.toLocaleString()} ₪\n`;
        messageContent += `   כמות: ${item.quantity}\n`;
        if (item.packageSlug) {
          messageContent += `   חבילה: ${item.packageSlug}\n`;
        }
        if (item.packageOptions) {
          if (item.packageOptions.cameras) {
            messageContent += `   מצלמות: ${item.packageOptions.cameras}\n`;
          }
          if (item.packageOptions.aiDetection) {
            messageContent += `   AI Detection: ${item.packageOptions.aiDetection}\n`;
          }
          if (item.packageOptions.storage) {
            messageContent += `   אחסון: ${item.packageOptions.storage}\n`;
          }
        }
        messageContent += `\n`;
      });
      messageContent += `סה"כ: ${total.toLocaleString()} ₪\n`;
      messageContent += `כתובת: ${formData.address}, ${formData.city}\n`;
      if (formData.notes) {
        messageContent += `הערות: ${formData.notes}\n`;
      }

      formDataToSend.append("message", messageContent);
      
      if (recaptchaToken) {
        formDataToSend.append("recaptcha_token", recaptchaToken);
      }

      const response = await fetch("/api/lead", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      
      if (data.ok) {
        setStatus("success");
        clearCart();
        
        setTimeout(() => {
          router.push(`/thank-you?orderId=${data.id || 'unknown'}`);
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting checkout:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-charcoal text-white pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center py-20">
                <ShoppingCart className="size-16 text-zinc-600 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4">העגלה שלך ריקה</h1>
                <p className="text-zinc-400 mb-8">אין פריטים בעגלה שלך כרגע</p>
                <Link
                  href="/packages"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black rounded-xl font-semibold hover:bg-gold/90 transition"
                >
                  <Package className="size-5" />
                  צפה בחבילות
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-charcoal text-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <CreditCard className="size-8 text-gold" />
                השלמת הזמנה
              </h1>
              <p className="text-zinc-400">שלב {step} מתוך 2</p>
            </div>
          </ScrollReveal>

          {status === 'success' && (
            <div className="bg-green-500/20 border border-green-500 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 text-green-400">
                <CheckCircle className="size-6" />
                <span>ההזמנה נשלחה בהצלחה! מעביר לדף הודיה...</span>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 text-red-400">
                <span>שגיאה בשליחת ההזמנה. נא לנסות שוב.</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <ScrollReveal delay={0.2}>
                <div className="bg-black/30 border border-zinc-800 rounded-xl p-6 sticky top-24">
                  <h2 className="text-2xl font-bold mb-6">סיכום הזמנה</h2>
                  
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.sku} className="flex justify-between text-sm">
                        <div>
                          <p className="text-white font-semibold">{item.name}</p>
                          <p className="text-zinc-400 text-xs">כמות: {item.quantity}</p>
                        </div>
                        <p className="text-gold font-bold">
                          {(item.price * item.quantity).toLocaleString()} ₪
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-zinc-700 pt-4 space-y-2">
                    <div className="flex justify-between text-zinc-300">
                      <span>ביניים</span>
                      <span>{subtotal.toLocaleString()} ₪</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>משלוח</span>
                      <span>{shipping === 0 ? 'חינם' : `${shipping.toLocaleString()} ₪`}</span>
                    </div>
                    <div className="border-t border-zinc-700 pt-4 flex justify-between text-xl font-bold text-white">
                      <span>סה&quot;כ</span>
                      <span className="text-gold">{total.toLocaleString()} ₪</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-zinc-700 text-xs text-zinc-500 space-y-2">
                    <p className="flex items-center gap-2">
                      <Lock className="size-4" />
                      תשלום מאובטח
                    </p>
                    <p>✓ התקנה מקצועית כלולה</p>
                    <p>✓ אחריות מלאה על הציוד</p>
                    <p>✓ תמיכה 24/7</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Checkout Form */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <ScrollReveal delay={0.1}>
                <form onSubmit={handleSubmit} className="bg-black/30 border border-zinc-800 rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-6">פרטי התקשרות</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        שם מלא *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
                        placeholder="שם מלא"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        טלפון *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
                        placeholder="05X-XXX-XXXX"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      אימייל *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        עיר *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
                        placeholder="עיר"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        כתובת *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
                        placeholder="רחוב ומספר בית"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      הערות נוספות
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={4}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
                      placeholder="הערות נוספות (אופציונלי)"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Link
                      href="/cart"
                      className="flex-1 px-6 py-3 border-2 border-zinc-700 rounded-xl font-semibold text-center hover:bg-zinc-800 transition"
                    >
                      חזרה לעגלה
                    </Link>
                    <button
                      type="submit"
                      disabled={loading || status === 'success'}
                      className="flex-1 bg-gold text-black rounded-xl px-6 py-3 font-bold hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        'שולח...'
                      ) : (
                        <>
                          <Lock className="size-5" />
                          שלח הזמנה
                          <ArrowRight className="size-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
