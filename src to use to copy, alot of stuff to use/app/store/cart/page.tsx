'use client';

import { Section } from '@/components/common/section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Package,
  CreditCard,
  Shield,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useCart } from '@/contexts/cart-context';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const getSubtotal = () => {
    return getCartTotal();
  };

  const calculateShipping = () => {
    return getSubtotal() > 1000 ? 0 : 150; // Free shipping over 1000₪
  };

  const calculateTotal = () => {
    return getSubtotal() + calculateShipping();
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <main className="pt-16">
          <Section className="py-12">
            <div className="text-center max-w-md mx-auto">
              <ShoppingCart size={64} className="mx-auto mb-6 text-foreground/30" />
              <h1 className="text-2xl font-bold mb-4">העגלה שלך ריקה</h1>
              <p className="text-foreground/70 mb-8">
                הוסף מוצרים לעגלה כדי להתחיל את תהליך הקנייה
              </p>
              <Button asChild size="lg">
                <Link href="/store">
                  <ArrowRight className="ml-2" size={20} />
                  התחל לקנות
                </Link>
              </Button>
            </div>
          </Section>
        </main>
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
            <span className="text-foreground">עגלת קניות</span>
          </div>
        </Section>

        <Section className="py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <ShoppingCart size={24} />
              <h1 className="text-3xl font-bold">עגלת קניות</h1>
              <Badge variant="secondary">{cart.length} מוצרים</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex gap-4 items-center">
                          {/* Product Image */}
                          <div className="w-24 h-24 bg-gradient-to-br from-aegis-teal/20 to-aegis-graphite/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-border">
                            {item.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img 
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain"
                                loading="lazy"
                              />
                            ) : (
                              <Package size={32} className="text-aegis-teal" />
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                            <p className="text-sm text-foreground/70 mb-2">מוצר איכותי ממותג מוביל</p>
                            <div className="flex items-center gap-4">
                              <Badge variant="outline">מוצר</Badge>
                              <span className="text-lg font-bold text-aegis-teal">
                                ₪{item.price.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center border border-border rounded-md">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus size={16} />
                              </Button>
                              <span className="px-4 py-2 min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus size={16} />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 size={16} className="ml-1" />
                              הסר
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard size={20} />
                        סיכום הזמנה
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>סכום ביניים:</span>
                          <span>₪{getSubtotal().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>משלוח:</span>
                          <span className={calculateShipping() === 0 ? 'text-green-600' : ''}>
                            {calculateShipping() === 0 ? 'חינם' : `₪${calculateShipping()}`}
                          </span>
                        </div>
                        {getSubtotal() < 1000 && (
                          <div className="text-sm text-foreground/70">
                            הוסף עוד ₪{(1000 - getSubtotal()).toLocaleString()} למשלוח חינם
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span>סה"כ:</span>
                          <span className="text-aegis-teal">₪{calculateTotal().toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button asChild className="w-full bg-aegis-blue text-white hover:bg-aegis-blue/90" size="lg">
                          <Link href="/store/checkout">
                            <CreditCard className="ml-2 text-white" size={20} />
                            <span className="font-medium whitespace-nowrap">המשך לתשלום</span>
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                          <Link href="/store">
                            <ArrowLeft className="ml-2" size={20} />
                            המשך קנייה
                          </Link>
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <Shield size={16} />
                        <span>רכישה מאובטחת עם SSL</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </Section>

        {/* Security & Trust */}
        <Section className="py-8 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">אבטחה ואמינות</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <Shield size={48} className="text-aegis-teal mb-3" />
                <h3 className="font-semibold mb-2">רכישה מאובטחת</h3>
                <p className="text-sm text-foreground/70">
                  כל התשלומים מוצפנים ומאובטחים עם SSL
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Package size={48} className="text-aegis-teal mb-3" />
                <h3 className="font-semibold mb-2">משלוח מהיר</h3>
                <p className="text-sm text-foreground/70">
                  משלוח מהיר ברחבי הארץ תוך 1-3 ימי עסקים
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Shield size={48} className="text-aegis-teal mb-3" />
                <h3 className="font-semibold mb-2">אחריות מלאה</h3>
                <p className="text-sm text-foreground/70">
                  אחריות של 12 חודשים על כל המוצרים
                </p>
              </div>
            </div>
          </div>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
}
