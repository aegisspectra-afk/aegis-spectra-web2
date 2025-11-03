'use client';

import { useState, useEffect } from 'react';
import { Section } from '@/components/common/section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard,
  Package,
  Shield,
  ArrowLeft,
  CheckCircle,
  User,
  MapPin,
  Phone,
  Mail,
  Lock,
  Truck,
  Tag,
  Minus,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import PayPalButton from '@/components/payments/paypal-button';
import { useCart } from '@/contexts/cart-context';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState<{ code: string; percent?: number; freeShip?: boolean } | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Address
    address: '',
    city: '',
    postalCode: '',
    // Payment
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  // Load cart items on mount
  useEffect(() => {
    setMounted(true);
    if (cart && cart.length > 0) {
      const items = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
      setCheckoutItems(items);
    }
  }, [cart]);

  const getSubtotal = () => {
    return checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getShipping = () => {
    if (couponApplied?.freeShip) return 0;
    const base = shippingMethod === 'express' ? 49 : 0; // standard = 0, express = 49
    if (shippingMethod === 'standard' && getSubtotal() < 300) return 30; // small-order fee
    return base;
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
    } else if (code === 'FREESHIP') {
      setCouponApplied({ code, freeShip: true });
    } else {
      alert('קופון לא תקף');
      return;
    }
    setCouponCode('');
  };

  // Per-step validation helpers
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

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.firstName.trim()) {
      alert('אנא הכנס שם פרטי');
      return;
    }
    
    if (!formData.lastName.trim()) {
      alert('אנא הכנס שם משפחה');
      return;
    }
    
    if (!formData.email.trim()) {
      alert('אנא הכנס אימייל');
      return;
    }
    
    if (!formData.phone.trim()) {
      alert('אנא הכנס מספר טלפון');
      return;
    }
    
    if (!formData.address.trim()) {
      alert('אנא הכנס כתובת');
      return;
    }
    
    if (!formData.city.trim()) {
      alert('אנא הכנס עיר');
      return;
    }
    
    if (!formData.postalCode.trim()) {
      alert('אנא הכנס מיקוד');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('אנא הכנס אימייל תקין');
      return;
    }
    
    // Validate phone format (basic Israeli phone validation)
    const phoneRegex = /^[\d\-\+\(\)\s]+$/;
    if (!phoneRegex.test(formData.phone) || formData.phone.length < 9) {
      alert('אנא הכנס מספר טלפון תקין');
      return;
    }
    
    // Snapshot order summary for success page
    try {
      const orderId = `AS-${new Date().getFullYear()}-${Math.floor(Math.random()*900000+100000)}`;
      const order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        items: checkoutItems,
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
    } catch {}
    window.location.href = '/store/checkout/success';
  };

  const steps = [
    { number: 1, title: 'פרטים אישיים', icon: User },
    { number: 2, title: 'כתובת משלוח', icon: MapPin },
    { number: 3, title: 'תשלום', icon: CreditCard }
  ];

  // Check if cart is empty
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <Section className="py-16">
          <div className="max-w-2xl mx-auto text-center text-foreground/70">טוען…</div>
        </Section>
        <Footer />
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <Section className="py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-heading font-bold mb-4">עגלה ריקה</h1>
            <p className="text-muted-foreground mb-8">לא נמצאו מוצרים בעגלה</p>
            <Link href="/store">
              <Button size="lg">
                <Package className="h-4 w-4 mr-2" />
                חזור לחנות
              </Button>
            </Link>
          </div>
        </Section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      <main className="pt-16">
        {/* Breadcrumb */}
        <Section className="py-4 bg-muted/30">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/store" className="text-foreground/70 hover:text-foreground">
              חנות
            </Link>
            <span className="text-foreground/50">/</span>
            <Link href="/store/cart" className="text-foreground/70 hover:text-foreground">
              עגלת קניות
            </Link>
            <span className="text-foreground/50">/</span>
            <span className="text-foreground">תשלום</span>
          </div>
        </Section>

        <Section className="py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <CreditCard size={24} />
                <h1 className="text-3xl font-bold">תשלום מאובטח</h1>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/70">
                <Shield size={16} /> SSL הצפנה מלאה
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      isActive
                        ? 'bg-aegis-blue text-white'
                        : isCompleted
                          ? 'bg-aegis-blue/15 text-aegis-blue'
                          : 'bg-muted text-foreground/70'
                    }`}>
                      <StepIcon size={16} />
                      <span className="text-sm font-medium">{step.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 mx-2 ${isCompleted ? 'bg-aegis-blue/40' : 'bg-muted'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {currentStep === 1 && 'פרטים אישיים'}
                      {currentStep === 2 && 'כתובת משלוח'}
                      {currentStep === 3 && 'פרטי תשלום'}
                    </CardTitle>
                    <CardDescription>
                      {currentStep === 1 && 'אנא מלא את הפרטים האישיים שלך'}
                      {currentStep === 2 && 'אנא הזן את כתובת המשלוח'}
                      {currentStep === 3 && 'אנא הזן את פרטי כרטיס האשראי'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {currentStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">שם פרטי *</Label>
                            <Input
                              id="firstName"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              placeholder="הזן שם פרטי"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">שם משפחה *</Label>
                            <Input
                              id="lastName"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              placeholder="הזן שם משפחה"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">אימייל *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="example@email.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">טלפון *</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="050-1234567"
                          />
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <Label htmlFor="address">כתובת מלאה *</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="רחוב, מספר בית, דירה"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">עיר *</Label>
                            <Input
                              id="city"
                              value={formData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              placeholder="הזן עיר"
                            />
                          </div>
                          <div>
                            <Label htmlFor="postalCode">מיקוד *</Label>
                            <Input
                              id="postalCode"
                              value={formData.postalCode}
                              onChange={(e) => handleInputChange('postalCode', e.target.value)}
                              placeholder="1234567"
                            />
                          </div>
                        </div>
                        {/* Shipping method */}
                        <div className="space-y-2">
                          <Label>שיטת משלוח</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button type="button" onClick={() => setShippingMethod('standard')} className={`p-3 rounded border ${shippingMethod==='standard' ? 'border-aegis-blue' : 'border-border'}`}>
                              <div className="flex items-center gap-2 text-sm"><Truck size={16} /> משלוח רגיל</div>
                              <div className="text-xs text-foreground/70">חינם מעל ₪300, אחרת ₪30</div>
                            </button>
                            <button type="button" onClick={() => setShippingMethod('express')} className={`p-3 rounded border ${shippingMethod==='express' ? 'border-aegis-blue' : 'border-border'}`}>
                              <div className="flex items-center gap-2 text-sm"><Truck size={16} /> משלוח אקספרס</div>
                              <div className="text-xs text-foreground/70">₪49 • 1–2 ימי עסקים</div>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <Label htmlFor="cardName">שם על הכרטיס *</Label>
                          <Input
                            id="cardName"
                            value={formData.cardName}
                            onChange={(e) => handleInputChange('cardName', e.target.value)}
                            placeholder="שם מלא כפי שמופיע על הכרטיס"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardNumber">מספר כרטיס אשראי *</Label>
                          <Input
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">תאריך תפוגה *</Label>
                            <Input
                              id="expiryDate"
                              value={formData.expiryDate}
                              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              value={formData.cvv}
                              onChange={(e) => handleInputChange('cvv', e.target.value)}
                              placeholder="123"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-foreground/70">
                          <Lock size={16} />
                          <span>התשלום מאובטח עם SSL</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <input id="terms" type="checkbox" className="h-4 w-4" checked={termsAccepted} onChange={(e)=>setTermsAccepted(e.target.checked)} />
                          <label htmlFor="terms">אני מאשר/ת את תנאי הרכישה והמדיניות</label>
                        </div>
                      </motion.div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6">
                      <Button
                        variant="outline"
                        onClick={handlePrevStep}
                        disabled={currentStep === 1}
                      >
                        <ArrowLeft className="ml-2" size={16} />
                        חזור
                      </Button>
                      
                      {currentStep < 3 ? (
                        (() => {
                          const nextDisabled = (currentStep===1 && !step1Valid) || (currentStep===2 && !step2Valid);
                          return (
                            <button
                              type="button"
                              onClick={handleNextStep}
                              disabled={nextDisabled}
                              aria-disabled={nextDisabled}
                              className={`px-5 py-3 rounded-md inline-flex items-center gap-2 transition-colors ${nextDisabled ? 'bg-muted text-foreground/80 border border-border cursor-not-allowed' : 'bg-aegis-blue text-white hover:bg-aegis-blue/90'}`}
                            >
                              <span className="whitespace-nowrap font-medium">המשך לתשלום</span>
                              <ArrowLeft size={16} />
                            </button>
                          );
                        })()
                      ) : (
                        <div className="space-y-4">
                          {/* PayPal Button */}
                          <PayPalButton 
                            onSuccess={(paypalOrderId) => {
                              try {
                                // Build order snapshot similar to manual checkout
                                const orderId = paypalOrderId || `AS-${new Date().getFullYear()}-${Math.floor(Math.random()*900000+100000)}`;
                                const subtotal = getSubtotal();
                                const discount = couponApplied?.percent ? Math.round(subtotal * (couponApplied.percent / 100)) : 0;
                                const order = {
                                  id: orderId,
                                  createdAt: new Date().toISOString(),
                                  items: checkoutItems,
                                  subtotal,
                                  shipping: getShipping(),
                                  discount,
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
                              } catch {}
                              window.location.href = '/store/checkout/success';
                            }}
                            getDraft={() => ({
                              items: checkoutItems,
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
                            })}
                            onError={(error) => {
                              console.error('PayPal payment error:', error);
                              alert(`שגיאה בתשלום PayPal: ${error}`);
                            }}
                          />
                          
                          {/* Divider */}
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-background px-2 text-muted-foreground">
                                או
                              </span>
                            </div>
                          </div>

                          {/* Traditional Payment Button */}
                          <Button onClick={handleSubmit} disabled={!termsAccepted} className="w-full bg-aegis-green hover:bg-aegis-green/90 disabled:opacity-60">
                            <CheckCircle className="ml-2" size={16} />
                            שלם ₪{getTotal().toLocaleString()} (תשלום מאוחר יותר)
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package size={20} />
                      סיכום הזמנה
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {checkoutItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div className="mr-2">
                            <div className="font-medium">{item.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <button aria-label="הפחת כמות" className="h-6 w-6 rounded border border-border flex items-center justify-center" onClick={()=> updateQuantity(item.id, Math.max(1, item.quantity-1))}><Minus size={12} /></button>
                              <span>{item.quantity}</span>
                              <button aria-label="הגדל כמות" className="h-6 w-6 rounded border border-border flex items-center justify-center" onClick={()=> updateQuantity(item.id, item.quantity+1)}><Plus size={12} /></button>
                              <button className="text-foreground/60 hover:text-foreground" onClick={()=> removeFromCart(item.id)}>הסר</button>
                            </div>
                          </div>
                          <div className="font-medium">₪{(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>סכום ביניים:</span>
                        <span>₪{getSubtotal().toLocaleString()}</span>
                      </div>
                      {/* Coupon */}
                      <div className="flex gap-2 mt-2">
                        <div className="relative flex-1">
                          <Tag size={14} className="absolute right-2 top-2.5 text-foreground/50" />
                          <Input placeholder="קופון (WELCOME10 / FREESHIP)" value={couponCode} onChange={(e)=>setCouponCode(e.target.value)} className="pr-8" />
                        </div>
                        <Button variant="outline" onClick={handleApplyCoupon}>החל</Button>
                      </div>
                      {couponApplied && (
                        <div className="text-xs text-emerald-700">קופון הופעל: {couponApplied.code}{couponApplied.percent ? ` • ${couponApplied.percent}%` : couponApplied.freeShip ? ' • משלוח חינם' : ''}</div>
                      )}
                      <div className="flex justify-between">
                        <span>משלוח:</span>
                        <span className={getShipping() === 0 ? 'text-green-600' : ''}>
                          {getShipping() === 0 ? 'חינם' : `₪${getShipping()}`}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>סה"כ:</span>
                        <span className="text-aegis-blue">₪{getTotal().toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center gap-2 text-sm text-foreground/70 pt-4 border-t">
                      <Shield size={16} />
                      <span>רכישה מאובטחת עם SSL</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
}
