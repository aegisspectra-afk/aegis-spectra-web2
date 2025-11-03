"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, CreditCard, Lock, CheckCircle, ArrowRight, Package, Trash2 } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

type CartItem = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  });

  useEffect(() => {
    // Load cart from localStorage or URL params
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart:", e);
      }
    }

    // Load from URL params (single product)
    const sku = searchParams.get("sku");
    const quantity = parseInt(searchParams.get("quantity") || "1");
    if (sku && !savedCart) {
      // Fetch product details
      fetch(`/api/products/${sku}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.ok && data.product) {
            setCartItems([
              {
                sku: data.product.sku,
                name: data.product.name,
                price: data.product.price_sale || data.product.price_regular,
                quantity: quantity,
              },
            ]);
          }
        })
        .catch((e) => console.error("Error fetching product:", e));
    }
  }, [searchParams]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over 1000 ILS
  const total = subtotal + shipping;

  const validatePhone = (phone: string) => {
    const phoneRegex = /^0[2-9]\d{7,8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const handlePayment = async () => {
    if (!validatePhone(formData.phone)) {
      alert("מספר טלפון לא תקין");
      return;
    }

    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      alert("אנא מלא את כל השדות הנדרשים");
      return;
    }

    if (cartItems.length === 0) {
      alert("העגלה ריקה");
      return;
    }

    setLoading(true);

    try {
      const items = cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const response = await fetch("/api/payments/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          totalAmount: total,
        }),
      });

      const data = await response.json();

      if (data.approvalUrl) {
        // Redirect to PayPal
        window.location.href = data.approvalUrl;
      } else {
        throw new Error("No approval URL received");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      alert("אירעה שגיאה בתהליך התשלום. אנא נסה שוב.");
      setLoading(false);
    }
  };

  const removeItem = (sku: string) => {
    const newCart = cartItems.filter((item) => item.sku !== sku);
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const updateQuantity = (sku: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(sku);
      return;
    }
    const newCart = cartItems.map((item) =>
      item.sku === sku ? { ...item, quantity } : item
    );
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-charcoal text-white">
        <Navbar />
        <div className="pt-24 pb-20 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <ShoppingCart className="size-20 mx-auto mb-6 text-zinc-600" />
            <h1 className="text-3xl font-bold mb-4">העגלה שלך ריקה</h1>
            <p className="text-zinc-400 mb-8">הוסף מוצרים לעגלה כדי להמשיך</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-gold text-black px-8 py-4 font-semibold hover:bg-gold/90 transition"
            >
              <ArrowRight className="size-5" />
              עבר לחנות
            </Link>
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
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">
              תשלום
            </h1>
          </ScrollReveal>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Items */}
              <ScrollReveal delay={0.1}>
                <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Package className="size-6 text-gold" />
                    סיכום הזמנה
                  </h2>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.sku}
                        className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-black/30"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="size-16 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                            <Package className="size-8 text-zinc-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{item.name}</h3>
                            <p className="text-sm text-zinc-400">{item.sku}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                              className="size-8 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                            >
                              -
                            </button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                              className="size-8 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-left w-24">
                            <p className="font-bold text-gold">
                              {(item.price * item.quantity).toLocaleString()} ₪
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.sku)}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                          >
                            <Trash2 className="size-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Contact Info */}
              <ScrollReveal delay={0.2}>
                <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-6">פרטי יצירת קשר</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">שם מלא *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">טלפון *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                        placeholder="050-123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">אימייל</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">עיר *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">כתובת *</label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">הערות</label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white resize-none"
                        placeholder="הערות נוספות להזמנה..."
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Payment Summary */}
            <ScrollReveal delay={0.3}>
              <div className="lg:sticky lg:top-24">
                <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard className="size-6 text-gold" />
                    סיכום תשלום
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">סה״כ מוצרים</span>
                      <span className="font-semibold">{subtotal.toLocaleString()} ₪</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">משלוח</span>
                      <span className="font-semibold">
                        {shipping === 0 ? (
                          <span className="text-green-400">חינם</span>
                        ) : (
                          `${shipping} ₪`
                        )}
                      </span>
                    </div>
                    <div className="border-t border-zinc-800 pt-4 flex justify-between">
                      <span className="text-xl font-bold">סה״כ לתשלום</span>
                      <span className="text-2xl font-bold text-gold">{total.toLocaleString()} ₪</span>
                    </div>
                  </div>

                  <div className="mb-6 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="size-5 text-green-400" />
                      <span className="text-sm font-semibold">תשלום מאובטח</span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      התשלום מתבצע דרך PayPal - מאובטח ומאושר
                    </p>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full rounded-xl bg-gold text-black px-6 py-4 font-semibold hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        מעבד...
                      </>
                    ) : (
                      <>
                        <CreditCard className="size-5" />
                        המשך לתשלום PayPal
                      </>
                    )}
                  </button>

                  <p className="text-xs text-zinc-400 text-center mt-4">
                    על ידי המשך, אתה מסכים ל-
                    <Link href="/terms" className="text-gold hover:underline">
                      תנאי השירות
                    </Link>{" "}
                    ו-
                    <Link href="/privacy" className="text-gold hover:underline">
                      מדיניות הפרטיות
                    </Link>
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

