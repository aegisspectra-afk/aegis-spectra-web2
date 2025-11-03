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
  ShoppingCart, 
  Search, 
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  AlertTriangle,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Edit,
  Save,
  X,
  Plus,
  Minus
} from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  items: OrderItem[];
  paymentMethod: string;
  notes?: string;
  trackingNumber?: string;
  carrier?: string;
}

interface OrderItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

function OrdersContent() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    status: '',
    notes: '',
    trackingNumber: '',
    carrier: ''
  });
  
  // Toast state
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Simulate API call with mock data
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'ORD-2025-001',
          customerName: 'יוסי כהן',
          customerEmail: 'yossi@example.com',
          customerPhone: '050-1234567',
          shippingAddress: 'רחוב הרצל 123, תל אביב',
          total: 1250,
          status: 'pending',
          createdAt: new Date().toISOString(),
          items: [
            { id: '1', productName: 'IP Camera 2 MP', sku: '4000-8591', quantity: 2, price: 320, total: 640 },
            { id: '2', productName: 'Dome Camera Mini', sku: '4000-8594', quantity: 1, price: 380, total: 380 }
          ],
          paymentMethod: 'אשראי',
          notes: 'התקנה נדרשת'
        },
        {
          id: '2',
          orderNumber: 'ORD-2025-002',
          customerName: 'שרה לוי',
          customerEmail: 'sara@example.com',
          customerPhone: '052-9876543',
          shippingAddress: 'רחוב דיזנגוף 45, חיפה',
          total: 890,
          status: 'confirmed',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          items: [
            { id: '3', productName: 'Wi-Fi Camera Could', sku: '4000-8597', quantity: 1, price: 420, total: 420 }
          ],
          paymentMethod: 'העברה בנקאית'
        },
        {
          id: '3',
          orderNumber: 'ORD-2025-003',
          customerName: 'דוד ישראלי',
          customerEmail: 'david@example.com',
          customerPhone: '054-5555555',
          shippingAddress: 'רחוב בן גוריון 78, ירושלים',
          total: 2100,
          status: 'shipped',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          items: [
            { id: '4', productName: 'PTZ Camera 20x zoom', sku: '4000-8596', quantity: 1, price: 2490, total: 2490 }
          ],
          paymentMethod: 'אשראי'
        },
        {
          id: '4',
          orderNumber: 'ORD-2025-004',
          customerName: 'רחל גולדברג',
          customerEmail: 'rachel@example.com',
          customerPhone: '050-1111111',
          shippingAddress: 'רחוב הרצל 200, באר שבע',
          total: 1680,
          status: 'delivered',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          items: [
            { id: '5', productName: 'Thermal Camera', sku: '4000-8598', quantity: 1, price: 3290, total: 3290 }
          ],
          paymentMethod: 'אשראי'
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">ממתין</Badge>;
      case 'confirmed':
        return <Badge variant="default" className="bg-blue-500 text-white">מאושר</Badge>;
      case 'shipped':
        return <Badge variant="default" className="bg-green-500 text-white">נשלח</Badge>;
      case 'delivered':
        return <Badge variant="default" className="bg-green-600 text-white">הושלם</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">בוטל</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusOptions = () => [
    { value: 'all', label: 'כל הסטטוסים' },
    { value: 'pending', label: 'ממתין' },
    { value: 'confirmed', label: 'מאושר' },
    { value: 'shipped', label: 'נשלח' },
    { value: 'delivered', label: 'הושלם' },
    { value: 'cancelled', label: 'בוטל' }
  ];

  // Form handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      status: '',
      notes: '',
      trackingNumber: '',
      carrier: ''
    });
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Order actions
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setFormData({
      status: order.status,
      notes: order.notes || '',
      trackingNumber: order.trackingNumber || '',
      carrier: order.carrier || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    try {
      const updatedOrder: Order = {
        ...selectedOrder,
        status: formData.status as any,
        notes: formData.notes,
        trackingNumber: formData.trackingNumber,
        carrier: formData.carrier
      };

      // Update in local state
      setOrders(prev => prev.map(order => 
        order.id === selectedOrder.id ? updatedOrder : order
      ));
      
      setIsEditDialogOpen(false);
      setSelectedOrder(null);
      resetForm();
      showToast('ההזמנה עודכנה בהצלחה!', 'success');
    } catch (error) {
      showToast('שגיאה בעדכון ההזמנה', 'error');
    }
  };

  const handleUpdateOrderStatus = async (order: Order, newStatus: string) => {
    try {
      const updatedOrder: Order = {
        ...order,
        status: newStatus as any
      };

      setOrders(prev => prev.map(o => 
        o.id === order.id ? updatedOrder : o
      ));
      
      showToast(`סטטוס ההזמנה עודכן ל-${getStatusOptions().find(s => s.value === newStatus)?.label}`, 'success');
    } catch (error) {
      showToast('שגיאה בעדכון סטטוס ההזמנה', 'error');
    }
  };

  const handleExportOrders = () => {
    try {
      const csvContent = [
        ['מספר הזמנה', 'שם לקוח', 'אימייל', 'טלפון', 'כתובת', 'סכום', 'סטטוס', 'תאריך יצירה', 'אמצעי תשלום'],
        ...filteredOrders.map(order => [
          order.orderNumber,
          order.customerName,
          order.customerEmail,
          order.customerPhone,
          order.shippingAddress,
          order.total.toString(),
          getStatusOptions().find(s => s.value === order.status)?.label || order.status,
          new Date(order.createdAt).toLocaleDateString('he-IL'),
          order.paymentMethod
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      showToast('ההזמנות יוצאו בהצלחה!', 'success');
    } catch (error) {
      showToast('שגיאה בייצוא ההזמנות', 'error');
    }
  };

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
                ניהול הזמנות
              </h1>
              <p className="text-muted-foreground" style={{color: '#E0E0E0'}}>
                נהלו את כל ההזמנות והמשלוחים
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button 
                variant="aegis" 
                size="sm" 
                onClick={handleExportOrders}
                style={{
                  backgroundColor: '#1A73E8 !important',
                  color: '#FFFFFF !important',
                  border: '2px solid #1A73E8 !important'
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                ייצא הזמנות
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
                    <p className="text-sm font-medium" style={{color: '#A0A0A0'}}>הזמנות ממתינות</p>
                    <p className="text-2xl font-bold" style={{color: '#F5F5F5'}}>
                      {orders.filter(o => o.status === 'pending').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{color: '#A0A0A0'}}>הזמנות מאושרות</p>
                    <p className="text-2xl font-bold" style={{color: '#F5F5F5'}}>
                      {orders.filter(o => o.status === 'confirmed').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{color: '#A0A0A0'}}>במשלוח</p>
                    <p className="text-2xl font-bold" style={{color: '#F5F5F5'}}>
                      {orders.filter(o => o.status === 'shipped').length}
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
                    <p className="text-sm font-medium" style={{color: '#A0A0A0'}}>הושלמו היום</p>
                    <p className="text-2xl font-bold" style={{color: '#F5F5F5'}}>
                      {orders.filter(o => o.status === 'delivered').length}
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
                      placeholder="חפש הזמנות לפי מספר הזמנה, שם לקוח או אימייל..."
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

      {/* Orders List */}
      <Section className="py-8">
        <div className="container-max">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold" style={{color: '#F5F5F5'}}>
                הזמנות ({filteredOrders.length})
              </h2>
              <p className="text-sm text-muted-foreground" style={{color: '#A0A0A0'}}>
                {selectedStatus === 'all' ? 'כל ההזמנות' : `סטטוס: ${getStatusOptions().find(o => o.value === selectedStatus)?.label}`}
              </p>
            </div>
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
                <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2" style={{color: '#F5F5F5'}}>
                  לא נמצאו הזמנות
                </h3>
                <p className="text-muted-foreground" style={{color: '#A0A0A0'}}>
                  {searchTerm ? 'לא נמצאו הזמנות התואמות לחיפוש שלכם' : 'אין הזמנות בסטטוס זה'}
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
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold" style={{color: '#F5F5F5'}}>
                              {order.orderNumber}
                            </h3>
                            <p className="text-sm" style={{color: '#A0A0A0'}}>
                              {new Date(order.createdAt).toLocaleDateString('he-IL')}
                            </p>
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
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm" style={{color: '#A0A0A0'}}>{order.customerEmail}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm" style={{color: '#A0A0A0'}}>{order.customerPhone}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm" style={{color: '#A0A0A0'}}>{order.shippingAddress}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm" style={{color: '#A0A0A0'}}>
                                {order.items.length} פריטים • {order.paymentMethod}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm" style={{color: '#E0E0E0'}}>סה"כ:</span>
                            <span className="text-lg font-semibold mr-2" style={{color: '#1A73E8'}}>
                              ₪{order.total.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewOrder(order)}
                              style={{
                                borderColor: '#1A73E8',
                                color: '#1A73E8'
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              צפה
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditOrder(order)}
                              style={{
                                borderColor: '#1A73E8',
                                color: '#1A73E8'
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              ערוך
                            </Button>
                            {order.status === 'pending' && (
                              <Button 
                                variant="aegis" 
                                size="sm" 
                                onClick={() => handleUpdateOrderStatus(order, 'confirmed')}
                                style={{
                                  backgroundColor: '#1A73E8 !important',
                                  color: '#FFFFFF !important',
                                  border: '2px solid #1A73E8 !important'
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                אשר הזמנה
                              </Button>
                            )}
                            {order.status === 'confirmed' && (
                              <Button 
                                variant="aegis" 
                                size="sm" 
                                onClick={() => handleUpdateOrderStatus(order, 'shipped')}
                                style={{
                                  backgroundColor: '#1A73E8 !important',
                                  color: '#FFFFFF !important',
                                  border: '2px solid #1A73E8 !important'
                                }}
                              >
                                <Truck className="h-4 w-4 mr-1" />
                                שלח
                              </Button>
                            )}
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

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle style={{color: '#F5F5F5'}}>פרטי הזמנה</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label style={{color: '#E0E0E0'}}>מספר הזמנה</Label>
                  <p className="text-lg font-semibold" style={{color: '#F5F5F5'}}>{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <Label style={{color: '#E0E0E0'}}>סטטוס</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label style={{color: '#E0E0E0'}}>שם לקוח</Label>
                  <p style={{color: '#A0A0A0'}}>{selectedOrder.customerName}</p>
                </div>
                <div>
                  <Label style={{color: '#E0E0E0'}}>אימייל</Label>
                  <p style={{color: '#A0A0A0'}}>{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <Label style={{color: '#E0E0E0'}}>טלפון</Label>
                  <p style={{color: '#A0A0A0'}}>{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <Label style={{color: '#E0E0E0'}}>אמצעי תשלום</Label>
                  <p style={{color: '#A0A0A0'}}>{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <Label style={{color: '#E0E0E0'}}>כתובת משלוח</Label>
                <p style={{color: '#A0A0A0'}}>{selectedOrder.shippingAddress}</p>
              </div>

              {/* Order Items */}
              <div>
                <Label style={{color: '#E0E0E0'}}>פריטים בהזמנה</Label>
                <div className="mt-2 space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium" style={{color: '#F5F5F5'}}>{item.productName}</p>
                        <p className="text-sm" style={{color: '#A0A0A0'}}>SKU: {item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p style={{color: '#A0A0A0'}}>כמות: {item.quantity}</p>
                        <p className="font-semibold" style={{color: '#1A73E8'}}>₪{item.total.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold" style={{color: '#F5F5F5'}}>סה"כ הזמנה:</span>
                  <span className="text-2xl font-bold" style={{color: '#1A73E8'}}>₪{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <Label style={{color: '#E0E0E0'}}>הערות</Label>
                  <p style={{color: '#A0A0A0'}}>{selectedOrder.notes}</p>
                </div>
              )}

              {/* Tracking Info */}
              {selectedOrder.trackingNumber && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label style={{color: '#E0E0E0'}}>מספר מעקב</Label>
                    <p style={{color: '#A0A0A0'}}>{selectedOrder.trackingNumber}</p>
                  </div>
                  <div>
                    <Label style={{color: '#E0E0E0'}}>חברת משלוחים</Label>
                    <p style={{color: '#A0A0A0'}}>{selectedOrder.carrier}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  סגור
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle style={{color: '#F5F5F5'}}>ערוך הזמנה</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status" style={{color: '#E0E0E0'}}>סטטוס</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סטטוס" />
                </SelectTrigger>
                <SelectContent>
                  {getStatusOptions().filter(option => option.value !== 'all').map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="trackingNumber" style={{color: '#E0E0E0'}}>מספר מעקב</Label>
              <Input
                id="trackingNumber"
                value={formData.trackingNumber}
                onChange={(e) => handleInputChange('trackingNumber', e.target.value)}
                placeholder="הזן מספר מעקב"
              />
            </div>
            
            <div>
              <Label htmlFor="carrier" style={{color: '#E0E0E0'}}>חברת משלוחים</Label>
              <Input
                id="carrier"
                value={formData.carrier}
                onChange={(e) => handleInputChange('carrier', e.target.value)}
                placeholder="הזן חברת משלוחים"
              />
            </div>
            
            <div>
              <Label htmlFor="notes" style={{color: '#E0E0E0'}}>הערות</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="הזן הערות"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                ביטול
              </Button>
              <Button 
                onClick={handleUpdateOrder}
                style={{
                  backgroundColor: '#1A73E8 !important',
                  color: '#FFFFFF !important',
                  border: '2px solid #1A73E8 !important'
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                שמור שינויים
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PanelLayout>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}
