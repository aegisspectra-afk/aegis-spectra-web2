"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ShoppingCart, CreditCard, Lock, CheckCircle, ArrowRight, Package, Trash2,
  User, MapPin, Phone, Mail, Shield, Truck, Tag, Minus, Plus, ArrowLeft
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/cart-context";
import { useToastContext } from "@/components/ToastProvider";
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
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { showToast } = useToastContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState<{ code: string; percent?: number; freeShip?: boolean } | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  useEffect(() => {
    const loadCart = async () => {
      // Load cart from context first
      let cart: CartItem[] = [];
      
      if (cart && cart.length > 0) {
        cart = cart.map(item => ({
          sku: item.sku,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }));
      } else {
        // Fallback to localStorage
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          try {
            cart = JSON.parse(savedCart);
          } catch (e) {
            console.error("Error parsing cart:", e);
            cart = [];
          }
        }
      }

      // Check URL params for new product to add
      const sku = searchParams.get("sku");
      const quantity = parseInt(searchParams.get("quantity") || "1");
      
      if (sku) {
        // Check if product already exists in cart
        const existingIndex = cart.findIndex(item => item.sku === sku);
        
        if (existingIndex >= 0) {
          // Update quantity if exists
          cart[existingIndex].quantity = quantity;
        } else {
          // Fetch product details from SKU API and add to cart
          try {
            const res = await fetch(`/api/products/sku/${encodeURIComponent(sku)}`);
            const data = await res.json();
            
            if (data.ok && data.product) {
              const newItem: CartItem = {
                sku: data.product.sku,
                name: data.product.name,
                price: data.product.price_sale || data.product.price_regular,
                quantity: quantity,
                image: data.product.images?.[0] || undefined,
              };
              
              cart.push(newItem);
            } else {
              console.error("Product not found:", sku);
              // Use fallback data if available
              const fallbackProducts: Record<string, { name: string; price: number }> = {
                "H-01-2TB": { name: "Home Cam H-01 (2 TB)", price: 2290 }
              };
              
              if (fallbackProducts[sku]) {
                cart.push({
                  sku: sku,
                  name: fallbackProducts[sku].name,
                  price: fallbackProducts[sku].price,
                  quantity: quantity,
                });
              }
            }
          } catch (e) {
            console.error("Error fetching product:", e);
            // Use fallback data if available
            const fallbackProducts: Record<string, { name: string; price: number }> = {
              "H-01-2TB": { name: "Home Cam H-01 (2 TB)", price: 2290 }
            };
            
            if (fallbackProducts[sku]) {
              cart.push({
                sku: sku,
                name: fallbackProducts[sku].name,
                price: fallbackProducts[sku].price,
                quantity: quantity,
              });
            }
          }
        }
        
        // Save updated cart to localStorage
        if (cart.length > 0) {
          localStorage.setItem("cart", JSON.stringify(cart));
        }
      }
      
      // Set cart items (even if empty, to show empty state)
      setCartItems(cart);
      setCartLoading(false);
    };

    loadCart();
  }, [searchParams, cart]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const getShipping = () => {
    if (couponApplied?.freeShip) return 0;
    if (shippingMethod === 'express') return 49;
    if (subtotal >= 300) return 0; // Free shipping over 300 ILS
    return 30; // Small order fee
  };

  const getDiscount = () => {
    if (couponApplied?.percent) {
      return Math.round(subtotal * (couponApplied.percent / 100));
    }
    return 0;
  };

  const total = subtotal - getDiscount() + getShipping();

  const validatePhone = (phone: string) => {
    const phoneRegex = /^0[2-9]\d{7,8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isPhoneValid = (phone: string) => {
    return /^[\d\-\+\(\)\s]+$/.test(phone) && phone.trim().length >= 9;
  };

  const step1Valid = (
    formData.firstName.trim().length > 0 &&
    formData.lastName.trim().length > 0 &&
    isEmailValid(formData.email) &&
    isPhoneValid(formData.phone)
  );

  const step2Valid = (
    formData.address.trim().length > 0 &&
    formData.city.trim().length > 0 &&
    formData.postalCode.trim().length > 0
  );

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      showToast("אנא הכנס קוד קופון", "error");
      return;
    }
    if (code === 'WELCOME10') {
      setCouponApplied({ code, percent: 10 });
      showToast("קופון הופעל בהצלחה! 10% הנחה", "success");
    } else if (code === 'FREESHIP') {
      setCouponApplied({ code, freeShip: true });
      showToast("קופון הופעל בהצלחה! משלוח חינם", "success");
    } else {
      showToast("קופון לא תקף", "error");
      return;
    }
    setCouponCode('');
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !step1Valid) {
      showToast("אנא מלא את כל השדות הנדרשים", "error");
      return;
    }
    if (currentStep === 2 && !step2Valid) {
      showToast("אנא מלא את כל השדות הנדרשים", "error");
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePayment = async () => {
    if (!step1Valid || !step2Valid) {
      showToast("אנא מלא את כל השדות הנדרשים", "error");
      return;
    }

    if (!termsAccepted) {
      showToast("אנא אשר את תנאי השירות", "error");
      return;
    }

    if (cartItems.length === 0) {
      showToast("העגלה ריקה", "error");
      return;
    }

    setLoading(true);

    try {
      // Create order
      const orderId = `AS-${new Date().getFullYear()}-${Math.floor(Math.random()*900000+100000)}`;
      const order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        items: cartItems.map(item => ({
          sku: item.sku,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        shipping: getShipping(),
        discount: getDiscount(),
        total,
        shippingMethod,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        notes: formData.notes,
      };

      // Save order to sessionStorage for success page
      sessionStorage.setItem('aegis-last-order', JSON.stringify(order));

      // Create order via API
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (data.success || data.ok) {
        // Clear cart
        clearCart();
        localStorage.removeItem("cart");
        
        // Redirect to success page
        router.push(`/checkout/success?orderId=${orderId}`);
      } else {
        throw new Error(data.error || "שגיאה ביצירת הזמנה");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      showToast("אירעה שגיאה בתהליך התשלום. אנא נסה שוב.", "error");
      setLoading(false);
    }
  };

  const handleRemoveItem = (sku: string) => {
    removeFromCart(sku);
    setCartItems(prev => prev.filter(item => item.sku !== sku));
    showToast("המוצר הוסר מהעגלה", "success");
  };

  const handleUpdateQuantity = (sku: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveItem(sku);
      return;
    }
    updateQuantity(sku, quantity);
    setCartItems(prev => prev.map(item => 
      item.sku === sku ? { ...item, quantity } : item
    ));
  };

  const steps = [
    { number: 1, title: 'פרטים אישיים', icon: User },
    { number: 2, title: 'כתובת משלוח', icon: MapPin },
    { number: 3, title: 'תשלום', icon: CreditCard }
  ];

  if (cartLoading) {
    return (
      <main className="min-h-screen bg-charcoal text-white">
        <Navbar />
        <div className="pt-24 pb-20 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <div className="size-20 mx-auto mb-6 border-4 border-zinc-700 border-t-gold rounded-full animate-spin" />
            <h1 className="text-3xl font-bold mb-4">טוען את העגלה שלך...</h1>
            <p className="text-zinc-400 mb-8">אנא המתן</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

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
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <CreditCard className="size-6 text-gold" />
                <h1 className="text-3xl md:text-4xl font-bold">תשלום מאובטח</h1>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Shield className="size-4" />
                SSL הצפנה מלאה
              </div>
            </div>
          </ScrollReveal>

          {/* Progress Steps */}
          <ScrollReveal delay={0.1}>
            <div className="flex items-center justify-center mb-8 flex-wrap gap-2 sm:gap-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                      isActive
                        ? 'bg-gold text-black'
                        : isCompleted
                          ? 'bg-gold/20 text-gold border border-gold/50'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      <StepIcon className="size-4" />
                      <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
                      <span className="text-sm font-medium sm:hidden">{step.number}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-4 sm:w-8 h-0.5 mx-2 ${isCompleted ? 'bg-gold/40' : 'bg-zinc-700'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              <ScrollReveal delay={0.2}>
                <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 sm:p-8 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    {currentStep === 1 && <User className="size-6 text-gold" />}
                    {currentStep === 2 && <MapPin className="size-6 text-gold" />}
                    {currentStep === 3 && <CreditCard className="size-6 text-gold" />}
                    {currentStep === 1 && 'פרטים אישיים'}
                    {currentStep === 2 && 'כתובת משלוח'}
                    {currentStep === 3 && 'פרטי תשלום'}
                  </h2>

                  {/* Step 1: Personal Info */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">שם פרטי *</label>
                          <input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                            placeholder="הזן שם פרטי"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">שם משפחה *</label>
                          <input
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                            placeholder="הזן שם משפחה"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">אימייל *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                          placeholder="example@email.com"
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
                    </motion.div>
                  )}

                  {/* Step 2: Shipping Address */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2">כתובת מלאה *</label>
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                          placeholder="רחוב, מספר בית, דירה"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">עיר *</label>
                          <input
                            type="text"
                            required
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                            placeholder="הזן עיר"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">מיקוד *</label>
                          <input
                            type="text"
                            required
                            value={formData.postalCode}
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gold/70 transition text-white"
                            placeholder="1234567"
                          />
                        </div>
                      </div>
                      {/* Shipping Method */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium mb-2">שיטת משלוח *</label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setShippingMethod('standard')}
                            className={`p-4 rounded-xl border transition text-right ${
                              shippingMethod === 'standard'
                                ? 'border-gold bg-gold/10 text-gold'
                                : 'border-zinc-700 bg-black/30 hover:bg-black/50'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Truck className="size-4" />
                              <span className="font-semibold">משלוח רגיל</span>
                            </div>
                            <div className="text-xs text-zinc-400">
                              {subtotal >= 300 ? 'חינם מעל ₪300' : '₪30 (חינם מעל ₪300)'}
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setShippingMethod('express')}
                            className={`p-4 rounded-xl border transition text-right ${
                              shippingMethod === 'express'
                                ? 'border-gold bg-gold/10 text-gold'
                                : 'border-zinc-700 bg-black/30 hover:bg-black/50'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Truck className="size-4" />
                              <span className="font-semibold">משלוח אקספרס</span>
                            </div>
                            <div className="text-xs text-zinc-400">₪49 • 1–2 ימי עסקים</div>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Payment */}
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="size-5 text-green-400" />
                          <span className="text-sm font-semibold">תשלום מאובטח</span>
                        </div>
                        <p className="text-xs text-zinc-400">
                          התשלום יתבצע מאוחר יותר. נחזור אליך תוך 24 שעות לאישור ההזמנה.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <input
                          id="terms"
                          type="checkbox"
                          className="size-4 rounded border-zinc-700 bg-black/30 text-gold focus:ring-gold"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                        />
                        <label htmlFor="terms" className="text-zinc-400">
                          אני מאשר/ת את{" "}
                          <Link href="/terms" className="text-gold hover:underline">
                            תנאי השירות
                          </Link>{" "}
                          ו-{" "}
                          <Link href="/privacy" className="text-gold hover:underline">
                            מדיניות הפרטיות
                          </Link>
                        </label>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 mt-6 border-t border-zinc-800">
                    <button
                      onClick={handlePrevStep}
                      disabled={currentStep === 1}
                      className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-black/30 px-6 py-3 font-semibold hover:bg-zinc-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="size-4" />
                      חזור
                    </button>
                    
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={(currentStep === 1 && !step1Valid) || (currentStep === 2 && !step2Valid)}
                        className="flex items-center gap-2 rounded-xl bg-gold text-black px-6 py-3 font-semibold hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        המשך
                        <ArrowRight className="size-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handlePayment}
                        disabled={loading || !termsAccepted}
                        className="flex items-center gap-2 rounded-xl bg-gold text-black px-6 py-3 font-semibold hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="size-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            מעבד...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="size-4" />
                            שלם ₪{total.toLocaleString()}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Order Summary */}
            <ScrollReveal delay={0.3}>
              <div className="lg:sticky lg:top-24">
                <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 sm:p-8 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Package className="size-6 text-gold" />
                    סיכום הזמנה
                  </h2>
                  
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.sku} className="flex items-center justify-between text-sm pb-4 border-b border-zinc-800 last:border-0">
                        <div className="flex-1 min-w-0 mr-2">
                          <div className="font-medium truncate">{item.name}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              aria-label="הפחת כמות"
                              onClick={() => handleUpdateQuantity(item.sku, item.quantity - 1)}
                              className="size-6 rounded border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              aria-label="הגדל כמות"
                              onClick={() => handleUpdateQuantity(item.sku, item.quantity + 1)}
                              className="size-6 rounded border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition"
                            >
                              <Plus className="size-3" />
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item.sku)}
                              className="text-red-400 hover:text-red-300 text-xs mr-2 transition"
                            >
                              הסר
                            </button>
                          </div>
                        </div>
                        <div className="font-semibold text-gold">
                          ₪{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-zinc-800">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">סכום ביניים:</span>
                      <span className="font-semibold">₪{subtotal.toLocaleString()}</span>
                    </div>
                    
                    {/* Coupon */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                          <input
                            type="text"
                            placeholder="קופון (WELCOME10 / FREESHIP)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-8 py-2 text-sm focus:outline-none focus:border-gold/70 transition text-white pr-8"
                          />
                        </div>
                        <button
                          onClick={handleApplyCoupon}
                          className="rounded-lg border border-zinc-700 bg-black/30 px-4 py-2 text-sm font-semibold hover:bg-zinc-800 transition"
                        >
                          החל
                        </button>
                      </div>
                      {couponApplied && (
                        <div className="text-xs text-green-400">
                          קופון הופעל: {couponApplied.code}
                          {couponApplied.percent ? ` • ${couponApplied.percent}%` : ''}
                          {couponApplied.freeShip ? ' • משלוח חינם' : ''}
                        </div>
                      )}
                    </div>

                    {getDiscount() > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>הנחה:</span>
                        <span className="font-semibold">-₪{getDiscount().toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-zinc-400">משלוח:</span>
                      <span className={getShipping() === 0 ? 'text-green-400 font-semibold' : 'font-semibold'}>
                        {getShipping() === 0 ? 'חינם' : `₪${getShipping()}`}
                      </span>
                    </div>
                    
                    <div className="border-t border-zinc-800 pt-3 flex justify-between text-lg font-bold">
                      <span>סה״כ לתשלום:</span>
                      <span className="text-gold">₪{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center gap-2 text-sm text-zinc-400">
                    <Shield className="size-4" />
                    <span>רכישה מאובטחת עם SSL</span>
                  </div>
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
