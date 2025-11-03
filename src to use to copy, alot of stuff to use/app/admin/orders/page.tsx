'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/common/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import PDFDownloader from '@/components/pdf/pdf-downloader';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Package,
  User,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw
} from 'lucide-react';

interface Order {
  id: string;
  status: string;
  createdAt: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  totals: {
    total: number;
  };
  paymentStatus: string;
  shippingStatus: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockOrders: Order[] = [
      {
        id: 'ORD-1704067200000-ABC12345',
        status: 'confirmed',
        createdAt: '2024-01-01T10:00:00Z',
        customerInfo: {
          firstName: 'יוסי',
          lastName: 'כהן',
          email: 'yossi@example.com',
          phone: '050-1234567'
        },
        totals: { total: 1874 },
        paymentStatus: 'completed',
        shippingStatus: 'pending',
        items: [
          { name: 'מצלמת IP 4MP', quantity: 2, price: 475 },
          { name: 'NVR 8 ערוצים', quantity: 1, price: 899 }
        ]
      },
      {
        id: 'ORD-1704067200001-DEF67890',
        status: 'pending',
        createdAt: '2024-01-01T11:30:00Z',
        customerInfo: {
          firstName: 'שרה',
          lastName: 'לוי',
          email: 'sarah@example.com',
          phone: '050-7654321'
        },
        totals: { total: 1299 },
        paymentStatus: 'pending',
        shippingStatus: 'pending',
        items: [
          { name: 'מערכת אזעקה אלחוטית', quantity: 1, price: 1299 }
        ]
      }
    ];

    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerInfo.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerInfo.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerInfo.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === paymentFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter, paymentFilter]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aegis-blue mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground">טוען הזמנות...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <Section className="py-16">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-4">
                ניהול הזמנות
              </h1>
              <p className="text-muted-foreground">
                ניהול ועקיבה אחר כל ההזמנות במערכת
              </p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={20} />
                    <Input
                      placeholder="חיפוש הזמנות..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="all">כל הסטטוסים</option>
                    <option value="pending">ממתין</option>
                    <option value="confirmed">מאושר</option>
                    <option value="completed">הושלם</option>
                    <option value="cancelled">בוטל</option>
                  </select>
                  
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="px-4 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="all">כל התשלומים</option>
                    <option value="pending">ממתין לתשלום</option>
                    <option value="completed">שולם</option>
                    <option value="failed">נכשל</option>
                  </select>
                  
                  <Button variant="outline" className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    רענן
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  הזמנות ({filteredOrders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">לא נמצאו הזמנות</h3>
                    <p className="text-muted-foreground">
                      {searchQuery || statusFilter !== 'all' || paymentFilter !== 'all'
                        ? 'נסה לשנות את הפילטרים'
                        : 'אין הזמנות במערכת'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-right py-3 px-4">מספר הזמנה</th>
                          <th className="text-right py-3 px-4">לקוח</th>
                          <th className="text-right py-3 px-4">תאריך</th>
                          <th className="text-right py-3 px-4">סכום</th>
                          <th className="text-right py-3 px-4">סטטוס</th>
                          <th className="text-right py-3 px-4">תשלום</th>
                          <th className="text-right py-3 px-4">פעולות</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order, index) => (
                          <motion.tr
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-border hover:bg-muted/50"
                          >
                            <td className="py-4 px-4">
                              <div className="font-mono text-sm">
                                {order.id}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-medium">
                                  {order.customerInfo.firstName} {order.customerInfo.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {order.customerInfo.email}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm">
                                {new Date(order.createdAt).toLocaleDateString('he-IL')}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-medium">
                                ₪{order.totals.total.toLocaleString()}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusIcon(order.status)}
                                <span className="mr-1">{getStatusText(order.status)}</span>
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <Badge className={getStatusColor(order.paymentStatus)}>
                                {getStatusText(order.paymentStatus)}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <PDFDownloader
                                  orderId={order.id}
                                  orderData={order}
                                  className="!p-2"
                                />
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}