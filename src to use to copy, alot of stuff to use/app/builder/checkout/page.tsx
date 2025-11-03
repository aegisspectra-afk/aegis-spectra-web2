'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/cart-context';
import { fmtIls } from '@/utils/currency';
import PayPalButton from '@/components/payments/paypal-button';
import { 
  ShoppingCart, 
  CreditCard, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  ArrowRight,
  CheckCircle,
  Package
} from 'lucide-react';

export default function BuilderCheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Redirect if cart is empty (with delay to allow cart to load)
  useEffect(() => {
    console.log('Builder checkout - cart:', cart);
    console.log('Builder checkout - cart length:', cart.length);
    console.log('Builder checkout - orderComplete:', orderComplete);
    
    const timer = setTimeout(() => {
      if (cart.length === 0 && !orderComplete) {
        console.log('Cart is empty, redirecting to builder');
        router.push('/builder');
      }
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, [cart, orderComplete, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName.trim()) {
      alert('אנא הכנס שם מלא');
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
    
    setIsSubmitting(true);

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and show success
      clearCart();
      setOrderComplete(true);
      
      // Redirect to success page after 3 seconds
      setTimeout(() => {
        router.push('/builder/checkout/success');
      }, 3000);
      
    } catch (error) {
      console.error('Order submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-4">הזמנה התקבלה בהצלחה!</h1>
                <p className="text-muted-foreground">
                  תודה על הזמנתך. נציג שלנו יצור איתך קשר בקרוב.
                </p>
              </div>
              <Button onClick={() => router.push('/builder')}>
                חזור לבונה החבילות
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-4">העגלה ריקה</h1>
              <p className="text-muted-foreground mb-8">
                אין פריטים בעגלה. חזור לבונה החבילות כדי לבחור מוצרים.
              </p>
              <Button onClick={() => router.push('/builder')}>
                חזור לבונה החבילות
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Package className="h-3 w-3 mr-1" />
                בונה חבילות מותאמות
              </Badge>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                <span className="gradient-text">סיום הזמנה</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                השלם את פרטיך כדי לסיים את ההזמנה
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShoppingCart className="h-5 w-5 mr-2 text-aegis-blue" />
                      סיכום הזמנה
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-muted-foreground text-sm">
                            {fmtIls(item.price)} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{fmtIls(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>סה"כ:</span>
                      <span className="text-aegis-blue">{fmtIls(getCartTotal())}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Checkout Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-aegis-blue" />
                      פרטי הזמנה
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          פרטים אישיים
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="fullName">שם מלא *</Label>
                            <Input
                              id="fullName"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              required
                              placeholder="הכנס שם מלא"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">אימייל *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              placeholder="הכנס אימייל"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="phone">טלפון *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            placeholder="הכנס מספר טלפון"
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Address Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          כתובת
                        </h3>
                        
                        <div>
                          <Label htmlFor="address">כתובת מלאה *</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            placeholder="הכנס כתובת מלאה"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">עיר *</Label>
                            <Input
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              placeholder="הכנס עיר"
                            />
                          </div>
                          <div>
                            <Label htmlFor="zipCode">מיקוד</Label>
                            <Input
                              id="zipCode"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              placeholder="הכנס מיקוד"
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Additional Notes */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">הערות נוספות</h3>
                        <div>
                          <Label htmlFor="notes">הערות (אופציונלי)</Label>
                          <Textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="הכנס הערות נוספות..."
                            rows={4}
                          />
                        </div>
                      </div>

                      {/* Payment Options */}
                      <div className="space-y-4">
                        {/* PayPal Button */}
                        <PayPalButton 
                          onSuccess={(orderId) => {
                            console.log('PayPal payment successful:', orderId);
                            setOrderComplete(true);
                            clearCart();
                            router.push('/checkout/success');
                          }}
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

                        {/* Traditional Form Submit Button */}
                        <Button 
                          type="submit" 
                          size="lg" 
                          className="w-full bg-aegis-blue hover:bg-aegis-blue/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              מעבד הזמנה...
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-4 w-4 mr-2" />
                              שלח הזמנה (תשלום מאוחר יותר)
                              <ArrowRight className="h-4 w-4 mr-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
