'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Section } from '@/components/common/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import PDFDownloader from '@/components/pdf/pdf-downloader';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  CreditCard, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  FileText,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface OrderData {
  id: string;
  status: string;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    sku: string;
    image?: string;
  }>;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
  paymentMethod: string;
  shippingMethod: string;
  notes?: string;
  totals: {
    subtotal: number;
    shipping: number;
    total: number;
  };
  paymentStatus: string;
  shippingStatus: string;
}

export default function OrderPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, you would fetch the order from the database
    // For now, we'll simulate loading
    const timer = setTimeout(() => {
      // Mock order data
      const mockOrder: OrderData = {
        id: orderId,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        items: [
          {
            id: '1',
            name: 'מצלמת IP 4MP',
            price: 475,
            quantity: 2,
            sku: 'CAM-4MP-001',
            image: '/api/placeholder/100/100'
          },
          {
            id: '2',
            name: 'NVR 8 ערוצים',
            price: 899,
            quantity: 1,
            sku: 'NVR-8CH-001',
            image: '/api/placeholder/100/100'
          }
        ],
        customerInfo: {
          firstName: 'יוסי',
          lastName: 'כהן',
          email: 'yossi@example.com',
          phone: '050-1234567',
          address: 'רחוב הרצל 123',
          city: 'תל אביב',
          zipCode: '12345'
        },
        paymentMethod: 'paypal',
        shippingMethod: 'standard',
        notes: 'אנא להתקשר לפני המשלוח',
        totals: {
          subtotal: 1849,
          shipping: 25,
          total: 1874
        },
        paymentStatus: 'completed',
        shippingStatus: 'pending'
      };
      
      setOrderData(mockOrder);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [orderId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'הושלם';
      case 'confirmed':
        return 'מאושר';
      case 'pending':
        return 'ממתין';
      case 'cancelled':
        return 'בוטל';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aegis-blue mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground">טוען פרטי הזמנה...</h2>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-foreground mb-4">שגיאה</h1>
          <p className="text-muted-foreground mb-6">
            לא ניתן לטעון את פרטי ההזמנה
          </p>
          <Button asChild>
            <Link href="/store">חזור לחנות</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <Section className="py-16">
          <div className="max-w-6xl mx-auto">
            {/* Success Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                ההזמנה שלך התקבלה!
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                תודה על הרכישה שלך. תקבל אישור במייל עם פרטי ההזמנה.
              </p>
              <div className="flex justify-center gap-4">
                <Badge className="bg-green-100 text-green-800">
                  מספר הזמנה: {orderData.id}
                </Badge>
                <Badge className={getStatusColor(orderData.status)}>
                  {getStatusText(orderData.status)}
                </Badge>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      פריטים בהזמנה
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orderData.items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4 p-4 border border-border rounded-lg"
                        >
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                            <Package className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              מק״ט: {item.sku} | כמות: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              ₪{(item.price * item.quantity).toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ₪{item.price.toLocaleString()} ליחידה
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      פרטי לקוח
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {orderData.customerInfo.firstName} {orderData.customerInfo.lastName}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <div>{orderData.customerInfo.email}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <div>{orderData.customerInfo.phone}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          {orderData.customerInfo.address}, {orderData.customerInfo.city} {orderData.customerInfo.zipCode}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                {orderData.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        הערות
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{orderData.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                {/* Order Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      סטטוס הזמנה
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>תשלום:</span>
                      <Badge className={getStatusColor(orderData.paymentStatus)}>
                        {getStatusText(orderData.paymentStatus)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>משלוח:</span>
                      <Badge className={getStatusColor(orderData.shippingStatus)}>
                        {getStatusText(orderData.shippingStatus)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>תאריך הזמנה:</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(orderData.createdAt).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Totals */}
                <Card>
                  <CardHeader>
                    <CardTitle>סיכום הזמנה</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>סכום ביניים:</span>
                      <span>₪{orderData.totals.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>משלוח:</span>
                      <span>₪{orderData.totals.shipping.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>סה״כ:</span>
                        <span className="text-aegis-blue">₪{orderData.totals.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>פעולות</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <PDFDownloader
                      orderId={orderData.id}
                      orderData={orderData}
                      className="w-full"
                    />
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/store">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        המשך קניות
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/contact">
                        צור קשר
                      </Link>
                    </Button>
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