/**
 * Cart Page - עמוד עגלת קניות
 */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package, CreditCard } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    try {
      const response = await fetch('/api/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          contact: {
            // Will be filled in checkout form
            name: '',
            phone: '',
            email: '',
            location: '',
          },
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Redirect to quote page or success page
        window.location.href = `/quote?orderId=${data.data.orderId}`;
      } else {
        alert('שגיאה בתהליך הרכישה. נא לנסות שוב.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('שגיאה בתהליך הרכישה. נא לנסות שוב.');
    } finally {
      setIsCheckingOut(false);
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

  const subtotal = getCartTotal();
  const shipping = subtotal > 5000 ? 0 : 500; // Free shipping over 5000₪
  const total = subtotal + shipping;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-charcoal text-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <ShoppingCart className="size-8 text-gold" />
                עגלת קניות
              </h1>
              <p className="text-zinc-400">{cart.length} פריט{cart.length !== 1 ? 'ים' : ''} בעגלה</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, i) => (
                <ScrollReveal key={item.sku} delay={i * 0.1}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/30 border border-zinc-800 rounded-xl p-6"
                  >
                    <div className="flex items-start gap-4">
                      {/* Image */}
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      
                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                            {item.packageSlug && (
                              <Link
                                href={`/packages/${item.packageSlug}`}
                                className="text-sm text-gold hover:text-gold/80 transition"
                              >
                                צפה בפרטים
                              </Link>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.sku)}
                            className="text-zinc-400 hover:text-red-400 transition p-2"
                          >
                            <Trash2 className="size-5" />
                          </button>
                        </div>

                        {/* Package Options */}
                        {item.packageOptions && (
                          <div className="mb-3 text-sm text-zinc-400 space-y-1">
                            {item.packageOptions.cameras && (
                              <div>מצלמות: {item.packageOptions.cameras}</div>
                            )}
                            {item.packageOptions.aiDetection && (
                              <div>AI Detection: {item.packageOptions.aiDetection}</div>
                            )}
                            {item.packageOptions.storage && (
                              <div>אחסון: {item.packageOptions.storage}</div>
                            )}
                            {item.packageOptions.addons && item.packageOptions.addons.length > 0 && (
                              <div>תוספות: {item.packageOptions.addons.join(', ')}</div>
                            )}
                          </div>
                        )}

                        {/* Quantity & Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-zinc-400 text-sm">כמות:</span>
                            <div className="flex items-center gap-2 border border-zinc-700 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                                className="p-2 hover:bg-zinc-800 transition rounded-l-lg"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="size-4" />
                              </button>
                              <span className="px-4 py-2 min-w-[3rem] text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                                className="p-2 hover:bg-zinc-800 transition rounded-r-lg"
                              >
                                <Plus className="size-4" />
                              </button>
                            </div>
                          </div>
                          <div className="text-xl font-bold text-gold">
                            {(item.price * item.quantity).toLocaleString()} ₪
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <ScrollReveal delay={0.2}>
                <div className="bg-black/30 border border-zinc-800 rounded-xl p-6 sticky top-24">
                  <h2 className="text-2xl font-bold mb-6">סיכום הזמנה</h2>
                  
                  <div className="space-y-4 mb-6">
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

                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full bg-gold text-black rounded-xl px-6 py-4 font-bold text-lg hover:bg-gold/90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCheckingOut ? (
                        'מעבד...'
                      ) : (
                        <>
                          <CreditCard className="size-5" />
                          המשך לרכישה
                          <ArrowRight className="size-5" />
                        </>
                      )}
                    </button>
                    
                    <Link
                      href="/packages"
                      className="block w-full text-center px-6 py-3 border-2 border-zinc-700 rounded-xl font-semibold hover:bg-zinc-800 transition"
                    >
                      המשך קניות
                    </Link>

                    <button
                      onClick={() => {
                        if (confirm('האם למחוק את כל הפריטים מהעגלה?')) {
                          clearCart();
                        }
                      }}
                      className="w-full text-center px-6 py-2 text-sm text-zinc-400 hover:text-red-400 transition"
                    >
                      נקה עגלה
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-zinc-700 text-xs text-zinc-500">
                    <p>✓ התקנה מקצועית כלולה</p>
                    <p>✓ אחריות מלאה על הציוד</p>
                    <p>✓ תמיכה 24/7</p>
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

