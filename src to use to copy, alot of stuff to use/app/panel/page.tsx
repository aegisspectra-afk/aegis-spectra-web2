'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { useSession } from 'next-auth/react';
import { useUserProfile } from '@/contexts/user-profile';
import { useState, useEffect } from 'react';
import { PanelLayout } from '@/components/layout/panel-layout';
import { Section } from '@/components/common/section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp,
  Plus,
  Eye,
  AlertTriangle,
  DollarSign,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';

// Types
interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  isActive: boolean;
  updatedAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  items: number;
}

interface LowStockAlert {
  id: string;
  productName: string;
  sku: string;
  currentStock: number;
  minStock: number;
  category: string;
}

function PanelContent() {
  const { data: session } = useSession();
  const { profile } = useUserProfile();
  const [stats, setStats] = useState([
    { title: 'הכנסות היום', value: '₪0', icon: DollarSign, change: '+0%', positive: true },
    { title: 'הזמנות חדשות', value: '0', icon: ShoppingCart, change: '+0', positive: true },
    { title: 'מוצרים במלאי', value: '0', icon: Package, change: '+0', positive: true },
    { title: 'לקוחות פעילים', value: '0', icon: Users, change: '+0', positive: true },
  ]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch catalog data
      const catalogResponse = await fetch('/api/catalog');
      if (catalogResponse.ok) {
        const catalogData = await catalogResponse.json();
        
        // Calculate stats from catalog
        const totalProducts = catalogData.reduce((sum: number, category: any) => sum + category.products.length, 0);
        const totalValue = catalogData.reduce((sum: number, category: any) => 
          sum + category.products.reduce((catSum: number, product: any) => catSum + product.salePrice, 0), 0
        );
        
        // Simulate some demo data for now
        const todayRevenue = Math.floor(Math.random() * 5000) + 1000;
        const newOrders = Math.floor(Math.random() * 20) + 5;
        const activeCustomers = Math.floor(Math.random() * 100) + 50;
        
        setStats([
          { title: 'הכנסות היום', value: `₪${todayRevenue.toLocaleString()}`, icon: DollarSign, change: '+12%', positive: true },
          { title: 'הזמנות חדשות', value: newOrders.toString(), icon: ShoppingCart, change: '+8', positive: true },
          { title: 'מוצרים במלאי', value: totalProducts.toString(), icon: Package, change: '+2', positive: true },
          { title: 'לקוחות פעילים', value: activeCustomers.toString(), icon: Users, change: '+5', positive: true },
        ]);

        // Generate low stock alerts
        const alerts: LowStockAlert[] = [];
        catalogData.forEach((category: any) => {
          category.products.forEach((product: any) => {
            if (Math.random() < 0.1) { // 10% chance of low stock
              alerts.push({
                id: product.sku,
                productName: product.name,
                sku: product.sku,
                currentStock: Math.floor(Math.random() * 5) + 1,
                minStock: 10,
                category: category.name
              });
            }
          });
        });
        setLowStockAlerts(alerts.slice(0, 5));
      }

      // Simulate recent orders
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'ORD-2025-001',
          customerName: 'יוסי כהן',
          customerEmail: 'yossi@example.com',
          total: 1250,
          status: 'pending',
          createdAt: new Date().toISOString(),
          items: 3
        },
        {
          id: '2',
          orderNumber: 'ORD-2025-002',
          customerName: 'שרה לוי',
          customerEmail: 'sara@example.com',
          total: 890,
          status: 'confirmed',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          items: 2
        },
        {
          id: '3',
          orderNumber: 'ORD-2025-003',
          customerName: 'דוד ישראלי',
          customerEmail: 'david@example.com',
          total: 2100,
          status: 'shipped',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          items: 1
        }
      ];
      setRecentOrders(mockOrders);
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const roles: string[] = (profile?.roles || session?.user?.roles || []).map(r => String(r).toUpperCase());
  const isAdmin = roles.includes('ADMIN') || roles.includes('SUPER_ADMIN');
  const effectiveRole = isAdmin ? 'ADMIN' : (roles[0] || 'CLIENT');
  const effectivePlan = isAdmin ? 'PRO' : (session?.user?.subscriptionPlan || 'BASIC');

  return (
    <PanelLayout
      userRole={effectiveRole}
      subscriptionPlan={effectivePlan}
    >
        {/* Header */}
        <Section className="py-8 bg-gradient-to-b from-background to-aegis-graphite/20">
          <div className="container-max">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2" style={{color: '#F5F5F5'}}>
                  פאנל ניהול החנות
                </h1>
                <p className="text-muted-foreground" style={{color: '#E0E0E0'}}>
                  ברוכים הבאים, {session?.user?.name || 'משתמש'}! נהלו את החנות שלכם.
                </p>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button variant="aegis" size="sm" style={{
                  backgroundColor: '#1A73E8 !important',
                  color: '#FFFFFF !important',
                  border: '2px solid #1A73E8 !important'
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  הוסף מוצר
                </Button>
              </div>
            </div>
          </div>
        </Section>

        {/* Stats Overview */}
        <Section className="py-8">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="card-hover glow-effect">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading ? (
                        <div className="animate-pulse bg-muted h-8 w-16 rounded"></div>
                      ) : (
                        stat.value
                      )}
                    </div>
                    <p className={`text-xs ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                      {loading ? (
                        <div className="animate-pulse bg-muted h-3 w-20 rounded"></div>
                      ) : (
                        `${stat.change} from yesterday`
                      )}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        {/* Main Content Grid */}
        <Section className="py-8">
          <div className="container-max">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center" style={{color: '#F5F5F5'}}>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      הזמנות אחרונות
                    </CardTitle>
                    <CardDescription style={{color: '#E0E0E0'}}>
                      הזמנות חדשות שדורשות טיפול
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                          <p className="text-sm text-muted-foreground mt-2" style={{color: '#A0A0A0'}}>טוען הזמנות...</p>
                        </div>
                      ) : recentOrders.length === 0 ? (
                        <div className="text-center py-8">
                          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground" style={{color: '#A0A0A0'}}>אין הזמנות חדשות</p>
                          <p className="text-xs text-muted-foreground mt-1" style={{color: '#8B8B8B'}}>כל ההזמנות מטופלות!</p>
                        </div>
                      ) : (
                        recentOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center space-x-4">
                              <div className={`w-3 h-3 rounded-full ${
                                order.status === 'pending' ? 'bg-yellow-500' :
                                order.status === 'confirmed' ? 'bg-blue-500' :
                                order.status === 'shipped' ? 'bg-green-500' : 'bg-gray-500'
                              }`} />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold" style={{color: '#F5F5F5'}}>{order.orderNumber}</h3>
                                  <Badge variant={
                                    order.status === 'pending' ? 'secondary' :
                                    order.status === 'confirmed' ? 'default' :
                                    order.status === 'shipped' ? 'default' : 'outline'
                                  }>
                                    {order.status === 'pending' ? 'ממתין' :
                                     order.status === 'confirmed' ? 'מאושר' :
                                     order.status === 'shipped' ? 'נשלח' : 'הושלם'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground" style={{color: '#E0E0E0'}}>{order.customerName}</p>
                                <p className="text-xs text-muted-foreground" style={{color: '#A0A0A0'}}>
                                  {order.items} פריטים • ₪{order.total.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t flex space-x-2">
                      <Button asChild variant="aegis" className="flex-1" style={{
                        backgroundColor: '#1A73E8 !important',
                        color: '#FFFFFF !important',
                        border: '2px solid #1A73E8 !important'
                      }}>
                        <Link href="/panel/orders">
                          <Plus className="h-4 w-4 mr-2" />
                          צפה בכל ההזמנות
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Low Stock Alerts */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center" style={{color: '#F5F5F5'}}>
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      התראות מלאי
                    </CardTitle>
                    <CardDescription style={{color: '#E0E0E0'}}>
                      מוצרים עם מלאי נמוך
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                          <p className="text-sm text-muted-foreground mt-2" style={{color: '#A0A0A0'}}>טוען התראות...</p>
                        </div>
                      ) : lowStockAlerts.length === 0 ? (
                        <div className="text-center py-8">
                          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                          <p className="text-muted-foreground" style={{color: '#A0A0A0'}}>אין התראות מלאי</p>
                          <p className="text-xs text-muted-foreground mt-1" style={{color: '#8B8B8B'}}>כל המוצרים במלאי תקין!</p>
                        </div>
                      ) : (
                        lowStockAlerts.map((alert) => (
                          <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="w-2 h-2 rounded-full mt-2 bg-red-500" />
                            <div className="flex-1">
                              <p className="text-sm font-medium" style={{color: '#F5F5F5'}}>{alert.productName}</p>
                              <p className="text-xs text-muted-foreground" style={{color: '#A0A0A0'}}>
                                SKU: {alert.sku} • קטגוריה: {alert.category}
                              </p>
                              <p className="text-xs text-red-500 font-medium">
                                מלאי: {alert.currentStock} (מינימום: {alert.minStock})
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <Button variant="outline" className="w-full mt-4" style={{
                      borderColor: '#1A73E8',
                      color: '#1A73E8'
                    }}>
                      צפה בכל המוצרים
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Section>


    </PanelLayout>
  );
}

export default function PanelPage() {
  return (
    <ProtectedRoute>
      <PanelContent />
    </ProtectedRoute>
  );
}