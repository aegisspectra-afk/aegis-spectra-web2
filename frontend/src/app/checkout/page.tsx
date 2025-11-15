/**
 * Checkout Page - עמוד רכישה עם multi-step form
 */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ShoppingCart, CreditCard, Lock, CheckCircle, ArrowRight, ArrowLeft, Package,
  User, MapPin, Truck, Tag, Shield, Minus, Plus
} from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useReCaptcha } from '@/components/ReCaptcha';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart, addToCart } = useCart();
  const { execute: executeRecaptcha, isReady: recaptchaReady } = useReCaptcha("checkout_form");
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState<{ code: string; percent?: number; freeShip?: boolean } | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [productAdded, setProductAdded] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle URL parameters - add product to cart if sku is provided
  useEffect(() => {
    if (!mounted) return;
    
    const sku = searchParams.get('sku');
    const quantity = parseInt(searchParams.get('quantity') || '1', 10);
    
    if (sku && !productAdded) {
      // Fetch product details and add to cart
      const addProductToCart = async () => {
        try {
          const response = await fetch(`/api/products/sku/${sku}`);
          const data = await response.json();
          
          if (data.ok && data.product) {
            const product = data.product;
            addToCart({
              sku: product.sku,
              name: product.name,
              price: product.price_sale || product.price_regular,
              quantity: quantity,
            }, quantity);
            setProductAdded(true);
            
            // Clean URL - remove query params after adding
            router.replace('/checkout', { scroll: false });
          }
        } catch (error) {
          console.error('Error adding product to cart:', error);
        }
      };
      
      addProductToCart();
    }
  }, [mounted, searchParams, productAdded, addToCart, router]);

  useEffect(() => {
    // Redirect if cart is empty (only after mount and product was added)
    if (mounted && cart.length === 0 && productAdded) {
      // Small delay to allow cart to update
      const timer = setTimeout(() => {
        if (cart.length === 0) {
          router.push('/cart');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [cart, router, mounted, productAdded]);

  const getSubtotal = () => {
    return getCartTotal();
  };

  const getShipping = () => {
    if (couponApplied?.freeShip) return 0;
    if (shippingMethod === 'express') return 49;
    if (getSubtotal() < 300) return 30;
    return 0; // Free shipping over 300₪
  };

  const getTotal = () => {
    const sub = getSubtotal();
    const discount = couponApplied?.percent ? Math.round(sub * (couponApplied.percent / 100)) : 0;
    return Math.max(0, sub - discount) + getShipping();
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    if (code === 'WELCOME10') {
      setCouponApplied({ code, percent: 10 });
      setCouponCode('');
    } else if (code === 'FREESHIP') {
      setCouponApplied({ code, freeShip: true });
      setCouponCode('');
    } else {
      alert('קופון לא תקף');
    }
  };

  // Validation
  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = (phone: string) => /^[\d\-\+\(\)\s]+$/.test(phone) && phone.trim().length >= 9;
  
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !step1Valid) return;
    if (currentStep === 2 && !step2Valid) return;
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!termsAccepted) {
      alert('אנא אשר את תנאי הרכישה');
      return;
    }

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
      formDataToSend.append("name", `${formData.firstName} ${formData.lastName}`);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("city", formData.city);
      
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
      messageContent += `סה"כ: ${getTotal().toLocaleString()} ₪\n`;
      messageContent += `כתובת: ${formData.address}, ${formData.city}, ${formData.postalCode}\n`;
      messageContent += `שיטת משלוח: ${shippingMethod === 'express' ? 'אקספרס (49₪)' : 'רגיל'}\n`;
      if (couponApplied) {
        messageContent += `קופון: ${couponApplied.code}\n`;
      }
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
        
        // Save order to sessionStorage
        const orderId = `AS-${new Date().getFullYear()}-${Math.floor(Math.random()*900000+100000)}`;
        const order = {
          id: orderId,
          createdAt: new Date().toISOString(),
          items: cart,
          subtotal: getSubtotal(),
          shipping: getShipping(),
          discount: couponApplied?.percent ? Math.round(getSubtotal() * (couponApplied.percent / 100)) : 0,
          total: getTotal(),
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
        };
        sessionStorage.setItem('aegis-last-order', JSON.stringify(order));
        
        setTimeout(() => {
          router.push(`/thank-you?orderId=${orderId}`);
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

  // Show loading state only during SSR or when adding product from URL
  const skuFromUrl = mounted ? searchParams.get('sku') : null;
  const isLoadingProduct = skuFromUrl && !productAdded && cart.length === 0;
  
  if (!mounted || isLoadingProduct) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-charcoal text-white pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <div className="animate-pulse">
                <div className="h-16 w-16 bg-zinc-800 rounded-full mx-auto mb-6" />
                <div className="h-8 w-64 bg-zinc-800 rounded-lg mx-auto mb-4" />
                <div className="h-4 w-48 bg-zinc-800 rounded-lg mx-auto mb-8" />
                {isLoadingProduct && (
                  <p className="text-zinc-400 text-sm mt-4">מוסיף מוצר לעגלה...</p>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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

  const steps = [
    { number: 1, title: 'פרטים אישיים', icon: User },
    { number: 2, title: 'כתובת משלוח', icon: MapPin },
    { number: 3, title: 'תשלום', icon: CreditCard }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-charcoal text-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="size-8 text-gold" />
                  <h1 className="text-4xl font-bold">תשלום מאובטח</h1>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Shield className="size-4" />
                  SSL הצפנה מלאה
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Progress Steps */}
          <ScrollReveal delay={0.1}>
            <div className="flex items-center justify-center mb-8">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex items-center">
                    <div className={`
                      flex items-center gap-2 px-4 py-2 rounded-full transition-all
                      ${isActive
                        ? 'bg-gold text-black'
                        : isCompleted
                          ? 'bg-gold/20 text-gold border-2 border-gold'
                          : 'bg-zinc-800 text-zinc-400'
                      }
                    `}>
                      <StepIcon className="size-4" />
                      <span className="text-sm font-medium">{step.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 mx-2 ${isCompleted || isActive ? 'bg-gold/40' : 'bg-zinc-800'}`} />
                    )}
                  </div>
                );
              })}
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
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <ScrollReveal delay={0.2}>
                <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-6">
                    {currentStep === 1 && 'פרטים אישיים'}
                    {currentStep === 2 && 'כתובת משלוח'}
                    {currentStep === 3 && 'פרטי תשלום'}
                  </h2>

                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                              שם פרטי *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
                              placeholder="הזן שם פרטי"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                              שם משפחה *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
                              placeholder="הזן שם משפחה"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            אימייל *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
                            placeholder="example@email.com"
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
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
                            placeholder="050-1234567"
                          />
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            כתובת מלאה *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
                            placeholder="רחוב, מספר בית, דירה"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                              עיר *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
                              placeholder="הזן עיר"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                              מיקוד *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.postalCode}
                              onChange={(e) => handleInputChange('postalCode', e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
                              placeholder="1234567"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            שיטת משלוח
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setShippingMethod('standard')}
                              className={`
                                p-4 rounded-lg border-2 transition-all text-right
                                ${shippingMethod === 'standard'
                                  ? 'border-gold bg-gold/10 text-gold'
                                  : 'border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:border-zinc-600'
                                }
                              `}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Truck className="size-4" />
                                <span className="font-semibold">משלוח רגיל</span>
                              </div>
                              <div className="text-xs text-zinc-400">
                                {getSubtotal() >= 300 ? 'חינם' : '₪30'} • 3-5 ימי עסקים
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => setShippingMethod('express')}
                              className={`
                                p-4 rounded-lg border-2 transition-all text-right
                                ${shippingMethod === 'express'
                                  ? 'border-gold bg-gold/10 text-gold'
                                  : 'border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:border-zinc-600'
                                }
                              `}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Truck className="size-4" />
                                <span className="font-semibold">משלוח אקספרס</span>
                              </div>
                              <div className="text-xs text-zinc-400">₪49 • 1-2 ימי עסקים</div>
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            הערות נוספות
                          </label>
                          <textarea
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            rows={3}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
                            placeholder="הערות נוספות (אופציונלי)"
                          />
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700">
                          <p className="text-sm text-zinc-400 mb-4">
                            בשלב זה, תשלח הזמנה ואנו נחזור אליך בהקדם לאישור התשלום.
                          </p>
                          <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <Lock className="size-4 text-gold" />
                            <span>התשלום מאובטח עם SSL</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <input
                            id="terms"
                            type="checkbox"
                            className="h-4 w-4"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                          />
                          <label htmlFor="terms" className="text-zinc-300">
                            אני מאשר/ת את תנאי הרכישה והמדיניות *
                          </label>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 mt-6 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      disabled={currentStep === 1}
                      className={`
                        px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2
                        ${currentStep === 1
                          ? 'opacity-50 cursor-not-allowed text-zinc-500'
                          : 'border-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                        }
                      `}
                    >
                      <ArrowRight className="size-5" />
                      חזור
                    </button>
                    
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={(currentStep === 1 && !step1Valid) || (currentStep === 2 && !step2Valid)}
                        className={`
                          px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2
                          ${(currentStep === 1 && !step1Valid) || (currentStep === 2 && !step2Valid)
                            ? 'opacity-50 cursor-not-allowed bg-zinc-800 text-zinc-500'
                            : 'bg-gold text-black hover:bg-gold/90'
                          }
                        `}
                      >
                        המשך לתשלום
                        <ArrowLeft className="size-5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || !termsAccepted || status === 'success'}
                        className="px-6 py-3 rounded-xl font-bold bg-gold text-black hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loading ? (
                          'שולח...'
                        ) : (
                          <>
                            <CheckCircle className="size-5" />
                            שלם ₪{getTotal().toLocaleString()} (תשלום מאוחר יותר)
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <ScrollReveal delay={0.3}>
                <div className="bg-black/30 border border-zinc-800 rounded-xl p-6 sticky top-24">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Package className="size-6 text-gold" />
                    סיכום הזמנה
                  </h2>
                  
                  {/* Order Items */}
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div key={item.sku} className="flex items-center justify-between text-sm pb-3 border-b border-zinc-800">
                        <div className="flex-1">
                          <div className="font-semibold text-white mb-1">{item.name}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.sku, Math.max(1, item.quantity - 1))}
                              className="h-6 w-6 rounded border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="text-zinc-300 min-w-[2rem] text-center">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                              className="h-6 w-6 rounded border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition"
                            >
                              <Plus className="size-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.sku)}
                              className="text-zinc-500 hover:text-red-400 text-xs mr-2 transition"
                            >
                              הסר
                            </button>
                          </div>
                        </div>
                        <div className="font-bold text-gold ml-4">
                          {(item.price * item.quantity).toLocaleString()} ₪
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon */}
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute right-2 top-2.5 size-4 text-zinc-500" />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="קופון (WELCOME10 / FREESHIP)"
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 pr-8 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold transition"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-semibold hover:bg-zinc-700 transition"
                      >
                        החל
                      </button>
                    </div>
                    {couponApplied && (
                      <div className="mt-2 text-xs text-green-400">
                        ✓ קופון הופעל: {couponApplied.code}
                        {couponApplied.percent && ` • ${couponApplied.percent}%`}
                        {couponApplied.freeShip && ' • משלוח חינם'}
                      </div>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-zinc-300">
                      <span>סכום ביניים:</span>
                      <span>{getSubtotal().toLocaleString()} ₪</span>
                    </div>
                    {couponApplied?.percent && (
                      <div className="flex justify-between text-green-400 text-sm">
                        <span>הנחה ({couponApplied.percent}%):</span>
                        <span>-{Math.round(getSubtotal() * (couponApplied.percent / 100)).toLocaleString()} ₪</span>
                      </div>
                    )}
                    <div className="flex justify-between text-zinc-300">
                      <span>משלוח:</span>
                      <span className={getShipping() === 0 ? 'text-green-400' : ''}>
                        {getShipping() === 0 ? 'חינם' : `${getShipping().toLocaleString()} ₪`}
                      </span>
                    </div>
                    <div className="border-t border-zinc-700 pt-4 flex justify-between text-xl font-bold text-white">
                      <span>סה&quot;כ</span>
                      <span className="text-gold">{getTotal().toLocaleString()} ₪</span>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center gap-2 text-sm text-zinc-500 pt-4 border-t border-zinc-700">
                    <Shield className="size-4" />
                    <span>רכישה מאובטחת עם SSL</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
