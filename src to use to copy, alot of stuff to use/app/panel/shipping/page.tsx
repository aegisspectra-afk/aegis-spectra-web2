'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { PanelLayout } from '@/components/layout/panel-layout';
import { Section } from '@/components/common/section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Truck, 
  Search, 
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Calendar,
  User,
  Phone,
  Mail,
  AlertTriangle,
  Plus,
  Edit
} from 'lucide-react';
import Link from 'next/link';

interface ShippingOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  status: 'preparing' | 'ready' | 'shipped' | 'delivered' | 'failed';
  trackingNumber?: string;
  carrier: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  items: ShippingItem[];
  totalWeight: number;
  shippingCost: number;
  notes?: string;
  createdAt: string;
}

interface ShippingItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  weight: number;
}

function ShippingContent() {
  const { data: session } = useSession();
  const [shippingOrders, setShippingOrders] = useState<ShippingOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ShippingOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShippingOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [shippingOrders, searchTerm, selectedStatus]);

  const fetchShippingOrders = async () => {
    try {
      setLoading(true);
      // Simulate API call with mock data
      const mockOrders: ShippingOrder[] = [
        {
          id: '1',
          orderNumber: 'ORD-2025-001',
          customerName: 'יוסי כהן',
          customerPhone: '050-1234567',
          shippingAddress: 'רחוב הרצל 123',
          city: 'תל אביב',
          status: 'preparing',
          carrier: 'דואר ישראל',
          estimatedDelivery: '2025-01-15',
          items: [
            { id: '1', productName: 'IP Camera 2 MP', sku: '4000-8591', quantity: 2, weight: 1.5 },
            { id: '2', productName: 'Dome Camera Mini', sku: '4000-8594', quantity: 1, weight: 0.8 }
          ],
          totalWeight: 3.8,
          shippingCost: 25,
          notes: 'התקנה נדרשת',
          createdAt: '2025-01-10'
        },
        {
          id: '2',
          orderNumber: 'ORD-2025-002',
          customerName: 'שרה לוי',
          customerPhone: '052-9876543',
          shippingAddress: 'רחוב דיזנגוף 45',
          city: 'חיפה',
          status: 'ready',
          carrier: 'שליח עד הבית',
          estimatedDelivery: '2025-01-14',
          items: [
            { id: '3', productName: 'Wi-Fi Camera Could', sku: '4000-8597', quantity: 1, weight: 0.6 }
          ],
          totalWeight: 0.6,
          shippingCost: 35,
          createdAt: '2025-01-08'
        },
        {
          id: '3',
          orderNumber: 'ORD-2025-003',
          customerName: 'דוד ישראלי',
          customerPhone: '054-5555555',
          shippingAddress: 'רחוב בן גוריון 78',
          city: 'ירושלים',
          status: 'shipped',
          trackingNumber: 'TRK123456789',
          carrier: 'דואר ישראל',
          estimatedDelivery: '2025-01-13',
          items: [
            { id: '4', productName: 'PTZ Camera 20x zoom', sku: '4000-8596', quantity: 1, weight: 2.5 }
          ],
          totalWeight: 2.5,
          shippingCost: 30,
          createdAt: '2025-01-07'
        },
        {
          id: '4',
          orderNumber: 'ORD-2025-004',
          customerName: 'רחל גולדברג',
          customerPhone: '050-1111111',
          shippingAddress: 'רחוב הרצל 200',
          city: 'באר שבע',
          status: 'delivered',
          trackingNumber: 'TRK987654321',
          carrier: 'שליח עד הבית',
          estimatedDelivery: '2025-01-12',
          actualDelivery: '2025-01-12',
          items: [
            { id: '5', productName: 'Thermal Camera', sku: '4000-8598', quantity: 1, weight: 1.2 }
          ],
          totalWeight: 1.2,
          shippingCost: 40,
          createdAt: '2025-01-05'
        }
      ];
      
      setShippingOrders(mockOrders);
    } catch (error) {
      console.error('Failed to fetch shipping orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = shippingOrders;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'preparing':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">מכין למשלוח</Badge>;
      case 'ready':
        return <Badge variant="default" className="bg-blue-500 text-white">מוכן למשלוח</Badge>;
      case 'shipped':
        return <Badge variant="default" className="bg-green-500 text-white">נשלח</Badge>;
      case 'delivered':
        return <Badge variant="default" className="bg-green-600 text-white">נמסר</Badge>;
      case 'failed':
        return <Badge variant="destructive">נכשל</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing':
        return <Package className="h-4 w-4" />;
      case 'ready':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusOptions = () => [
    { value: 'all', label: 'כל הסטטוסים' },
    { value: 'preparing', label: 'מכין למשלוח' },
    { value: 'ready', label: 'מוכן למשלוח' },
    { value: 'shipped', label: 'נשלח' },
    { value: 'delivered', label: 'נמסר' },
    { value: 'failed', label: 'נכשל' }
  ];

  const getShippingStats = () => {
    const totalOrders = shippingOrders.length;
    const preparingOrders = shippingOrders.filter(o => o.status === 'preparing').length;
    const shippedOrders = shippingOrders.filter(o => o.status === 'shipped').length;
    const deliveredOrders = shippingOrders.filter(o => o.status === 'delivered').length;
    
    return { totalOrders, preparingOrders, shippedOrders, deliveredOrders };
  };

  const stats = getShippingStats();

  return (
    <PanelLayout
      userRole={session?.user?.roles?.[0] || 'CLIENT'}
      subscriptionPlan={session?.user?.subscriptionPlan || 'FREE'}
    >
      {/* Header */}
      <Section className="py-8 bg-gradient-to-b from-background to-aegis-graphite/20">
        <div className="container-max">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2" style={{color: '#F5F5F5'}}>
                ניהול משלוחים
              </h1>
              <p className="text-muted-foreground" style={{color: '#E0E0E0'}}>
                נהלו ומעקבו אחר המשלוחים שלכם
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="aegis" size="sm" style={{
                backgroundColor: '#1A73E8 !important',
                color: '#FFFFFF !important',
                border: '2px solid #1A73E8 !important'
              }}>
                <Plus className="h-4 w-4 mr-2" />
                הוסף משלוח
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Stats Cards */}
      <Section className="py-6">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{color: '#A0A0A0'}}>סה"כ משלוחים</p>
                    <p className="text-2xl font-bold" style={{color: '#F5F5F5'}}>
                      {stats.totalOrders}
                    </p>
                  </div>
                  <Truck className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{color: '#A0A0A0'}}>מכינים למשלוח</p>
                    <p className="text-2xl font-bold" style={{color: '#F5F5F5'}}>
                      {stats.preparingOrders}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{color: '#A0A0A0'}}>בדרך</p>
                    <p className="text-2xl font-bold" style={{color: '#F5F5F5'}}>
                      {stats.shippedOrders}
                    </p>
                  </div>
                  <Truck className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{color: '#A0A0A0'}}>נמסרו</p>
                    <p className="text-2xl font-bold" style={{color: '#F5F5F5'}}>
                      {stats.deliveredOrders}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Filters and Search */}
      <Section className="py-6">
        <div className="container-max">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="חפש משלוחים לפי מספר הזמנה, שם לקוח, מספר מעקב או עיר..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>
                <div className="md:w-48">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    style={{color: '#E0E0E0'}}
                  >
                    {getStatusOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Button variant="outline" style={{
                  borderColor: '#1A73E8',
                  color: '#1A73E8'
                }}>
                  <Filter className="h-4 w-4 mr-2" />
                  מסננים נוספים
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Shipping Orders List */}
      <Section className="py-8">
        <div className="container-max">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold" style={{color: '#F5F5F5'}}>
                משלוחים ({filteredOrders.length})
              </h2>
              <p className="text-sm text-muted-foreground" style={{color: '#A0A0A0'}}>
                {selectedStatus === 'all' ? 'כל המשלוחים' : `סטטוס: ${getStatusOptions().find(o => o.value === selectedStatus)?.label}`}
              </p>
            </div>
            <Button variant="outline" size="sm" style={{
              borderColor: '#1A73E8',
              color: '#1A73E8'
            }}>
              <Download className="h-4 w-4 mr-2" />
              ייצא דוח משלוחים
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-1/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Truck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2" style={{color: '#F5F5F5'}}>
                  לא נמצאו משלוחים
                </h3>
                <p className="text-muted-foreground" style={{color: '#A0A0A0'}}>
                  {searchTerm ? 'לא נמצאו משלוחים התואמים לחיפוש שלכם' : 'אין משלוחים בסטטוס זה'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold" style={{color: '#F5F5F5'}}>
                              {order.orderNumber}
                            </h3>
                            {order.trackingNumber && (
                              <p className="text-sm font-mono" style={{color: '#1A73E8'}}>
                                מעקב: {order.trackingNumber}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm" style={{color: '#E0E0E0'}}>{order.customerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm" style={{color: '#A0A0A0'}}>{order.customerPhone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm" style={{color: '#A0A0A0'}}>
                                {order.shippingAddress}, {order.city}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Truck className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm" style={{color: '#A0A0A0'}}>{order.carrier}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm" style={{color: '#A0A0A0'}}>
                                אספקה צפויה: {new Date(order.estimatedDelivery).toLocaleDateString('he-IL')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm" style={{color: '#A0A0A0'}}>
                                {order.items.length} פריטים • {order.totalWeight} ק"ג
                              </span>
                            </div>
                          </div>
                        </div>

                        {order.notes && (
                          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm" style={{color: '#A0A0A0'}}>
                              <strong>הערות:</strong> {order.notes}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm" style={{color: '#E0E0E0'}}>עלות משלוח:</span>
                            <span className="text-lg font-semibold mr-2" style={{color: '#1A73E8'}}>
                              ₪{order.shippingCost}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" style={{
                              borderColor: '#1A73E8',
                              color: '#1A73E8'
                            }}>
                              <Eye className="h-4 w-4 mr-1" />
                              צפה
                            </Button>
                            {order.status === 'preparing' && (
                              <Button variant="aegis" size="sm" style={{
                                backgroundColor: '#1A73E8 !important',
                                color: '#FFFFFF !important',
                                border: '2px solid #1A73E8 !important'
                              }}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                מוכן למשלוח
                              </Button>
                            )}
                            {order.status === 'ready' && (
                              <Button variant="aegis" size="sm" style={{
                                backgroundColor: '#1A73E8 !important',
                                color: '#FFFFFF !important',
                                border: '2px solid #1A73E8 !important'
                              }}>
                                <Truck className="h-4 w-4 mr-1" />
                                שלח
                              </Button>
                            )}
                            <Button variant="outline" size="sm" style={{
                              borderColor: '#1A73E8',
                              color: '#1A73E8'
                            }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Section>
    </PanelLayout>
  );
}

export default function ShippingPage() {
  return (
    <ProtectedRoute>
      <ShippingContent />
    </ProtectedRoute>
  );
}
