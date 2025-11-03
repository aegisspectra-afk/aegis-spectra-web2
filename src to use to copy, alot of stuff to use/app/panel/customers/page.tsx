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
  Users, 
  Search, 
  Filter,
  Download,
  Eye,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  DollarSign,
  Star,
  UserPlus,
  Activity
} from 'lucide-react';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  registrationDate: string;
  lastOrderDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'vip';
  notes?: string;
  tags: string[];
}

function CustomersContent() {
  const { data: session } = useSession();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    status: '',
    notes: '',
    tags: ''
  });
  
  // Toast state
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, selectedStatus]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // Simulate API call with mock data
      const mockCustomers: Customer[] = [
        {
          id: '1',
          name: 'יוסי כהן',
          email: 'yossi@example.com',
          phone: '050-1234567',
          address: 'רחוב הרצל 123',
          city: 'תל אביב',
          registrationDate: '2024-01-15',
          lastOrderDate: '2025-01-10',
          totalOrders: 5,
          totalSpent: 12500,
          status: 'active',
          tags: ['VIP', 'התקנה']
        },
        {
          id: '2',
          name: 'שרה לוי',
          email: 'sara@example.com',
          phone: '052-9876543',
          address: 'רחוב דיזנגוף 45',
          city: 'חיפה',
          registrationDate: '2024-03-20',
          lastOrderDate: '2025-01-08',
          totalOrders: 3,
          totalSpent: 8900,
          status: 'active',
          tags: ['רגיל']
        },
        {
          id: '3',
          name: 'דוד ישראלי',
          email: 'david@example.com',
          phone: '054-5555555',
          address: 'רחוב בן גוריון 78',
          city: 'ירושלים',
          registrationDate: '2024-02-10',
          lastOrderDate: '2024-12-15',
          totalOrders: 2,
          totalSpent: 4200,
          status: 'inactive',
          tags: ['רגיל']
        },
        {
          id: '4',
          name: 'רחל גולדברג',
          email: 'rachel@example.com',
          phone: '050-1111111',
          address: 'רחוב הרצל 200',
          city: 'באר שבע',
          registrationDate: '2023-11-05',
          lastOrderDate: '2025-01-12',
          totalOrders: 8,
          totalSpent: 25600,
          status: 'vip',
          tags: ['VIP', 'עסקי', 'התקנה']
        },
        {
          id: '5',
          name: 'מיכאל אברהם',
          email: 'michael@example.com',
          phone: '053-2222222',
          address: 'רחוב רוטשילד 90',
          city: 'תל אביב',
          registrationDate: '2024-06-18',
          lastOrderDate: '2024-11-30',
          totalOrders: 1,
          totalSpent: 1200,
          status: 'inactive',
          tags: ['רגיל']
        }
      ];
      
      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(customer => customer.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCustomers(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500 text-white">פעיל</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-500 text-white">לא פעיל</Badge>;
      case 'vip':
        return <Badge variant="default" className="bg-yellow-500 text-white">VIP</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusOptions = () => [
    { value: 'all', label: 'כל הלקוחות' },
    { value: 'active', label: 'פעילים' },
    { value: 'inactive', label: 'לא פעילים' },
    { value: 'vip', label: 'VIP' }
  ];

  // Form handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      status: '',
      notes: '',
      tags: ''
    });
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Customer actions
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewDialogOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      status: customer.status,
      notes: customer.notes || '',
      tags: customer.tags.join(', ')
    });
    setIsEditDialogOpen(true);
  };

  const handleAddCustomer = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleUpdateCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      const updatedCustomer: Customer = {
        ...selectedCustomer,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        status: formData.status as any,
        notes: formData.notes,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      // Update in local state
      setCustomers(prev => prev.map(customer => 
        customer.id === selectedCustomer.id ? updatedCustomer : customer
      ));
      
      setIsEditDialogOpen(false);
      setSelectedCustomer(null);
      resetForm();
      showToast('הלקוח עודכן בהצלחה!', 'success');
    } catch (error) {
      showToast('שגיאה בעדכון הלקוח', 'error');
    }
  };

  const handleCreateCustomer = async () => {
    try {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        status: formData.status as any,
        notes: formData.notes,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        registrationDate: new Date().toISOString(),
        lastOrderDate: '',
        totalOrders: 0,
        totalSpent: 0
      };

      // Add to local state
      setCustomers(prev => [newCustomer, ...prev]);
      
      setIsAddDialogOpen(false);
      resetForm();
      showToast('הלקוח נוסף בהצלחה!', 'success');
    } catch (error) {
      showToast('שגיאה בהוספת הלקוח', 'error');
    }
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    if (!confirm(`האם אתה בטוח שברצונך למחוק את הלקוח "${customer.name}"?`)) {
      return;
    }

    try {
      setCustomers(prev => prev.filter(c => c.id !== customer.id));
      showToast('הלקוח נמחק בהצלחה!', 'success');
    } catch (error) {
      showToast('שגיאה במחיקת הלקוח', 'error');
    }
  };

  const handleExportCustomers = () => {
    try {
      const csvContent = [
        ['שם', 'אימייל', 'טלפון', 'כתובת', 'עיר', 'סטטוס', 'תאריך רישום', 'הזמנות', 'סכום כולל', 'תגיות'],
        ...filteredCustomers.map(customer => [
          customer.name,
          customer.email,
          customer.phone,
          customer.address,
          customer.city,
          getStatusOptions().find(s => s.value === customer.status)?.label || customer.status,
          new Date(customer.registrationDate).toLocaleDateString('he-IL'),
          customer.totalOrders.toString(),
          customer.totalSpent.toString(),
          customer.tags.join('; ')
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      showToast('הלקוחות יוצאו בהצלחה!', 'success');
    } catch (error) {
      showToast('שגיאה בייצוא הלקוחות', 'error');
    }
  };

  const getCustomerStats = () => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const vipCustomers = customers.filter(c => c.status === 'vip').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    
    return { totalCustomers, activeCustomers, vipCustomers, totalRevenue };
  };

  const stats = getCustomerStats();

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
                ניהול לקוחות
              </h1>
              <p className="text-muted-foreground" style={{color: '#E0E0E0'}}>
                נהלו את בסיס הלקוחות שלכם
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button 
                variant="aegis" 
                size="sm" 
                onClick={handleExportCustomers}
                style={{
                  backgroundColor: '#1A73E8 !important',
                  color: '#FFFFFF !important',
                  border: '2px solid #1A73E8 !important'
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                ייצא לקוחות
              </Button>
              <Button 
                variant="aegis" 
                size="sm" 
                onClick={handleAddCustomer}
                style={{
                  backgroundColor: '#1A73E8 !important',
                  color: '#FFFFFF !important',
                  border: '2px solid #1A73E8 !important'
                }}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                הוסף לקוח
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
                    <p className="text-sm font-medium" style={{color: '#A0A0A0'}}>סה"כ לקוחות</p>
                    <p className="text-2xl font-bold" style={{color: '#F5F5F5'}}>
                      {stats.totalCustomers}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{color: '#A0A0A0'}}>לקוחות פעילים</p>
                    <p className="text-2xl font-bold" style={{color: '#F5F5F5'}}>
                      {stats.activeCustomers}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{color: '#A0A0A0'}}>לקוחות VIP</p>
                    <p className="text-2xl font-bold" style={{color: '#F5F5F5'}}>
                      {stats.vipCustomers}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{color: '#A0A0A0'}}>סה"כ הכנסות</p>
                    <p className="text-2xl font-bold" style={{color: '#F5F5F5'}}>
                      ₪{stats.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
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
                      placeholder="חפש לקוחות לפי שם, אימייל, טלפון או עיר..."
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

      {/* Customers List */}
      <Section className="py-8">
        <div className="container-max">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold" style={{color: '#F5F5F5'}}>
                לקוחות ({filteredCustomers.length})
              </h2>
              <p className="text-sm text-muted-foreground" style={{color: '#A0A0A0'}}>
                {selectedStatus === 'all' ? 'כל הלקוחות' : `סטטוס: ${getStatusOptions().find(o => o.value === selectedStatus)?.label}`}
              </p>
            </div>
            <Button variant="outline" size="sm" style={{
              borderColor: '#1A73E8',
              color: '#1A73E8'
            }}>
              <Download className="h-4 w-4 mr-2" />
              ייצא ל-Excel
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
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
          ) : filteredCustomers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2" style={{color: '#F5F5F5'}}>
                  לא נמצאו לקוחות
                </h3>
                <p className="text-muted-foreground mb-4" style={{color: '#A0A0A0'}}>
                  {searchTerm ? 'לא נמצאו לקוחות התואמים לחיפוש שלכם' : 'אין לקוחות בסטטוס זה'}
                </p>
                <Button variant="aegis" style={{
                  backgroundColor: '#1A73E8 !important',
                  color: '#FFFFFF !important',
                  border: '2px solid #1A73E8 !important'
                }}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  הוסף לקוח ראשון
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold" style={{color: '#F5F5F5'}}>
                              {customer.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusBadge(customer.status)}
                              {customer.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm" style={{color: '#E0E0E0'}}>{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm" style={{color: '#A0A0A0'}}>{customer.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm" style={{color: '#A0A0A0'}}>
                                {customer.address}, {customer.city}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm" style={{color: '#A0A0A0'}}>
                                נרשם: {new Date(customer.registrationDate).toLocaleDateString('he-IL')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm" style={{color: '#A0A0A0'}}>
                                {customer.totalOrders} הזמנות
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-semibold" style={{color: '#1A73E8'}}>
                                ₪{customer.totalSpent.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {customer.notes && (
                          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm" style={{color: '#A0A0A0'}}>
                              <strong>הערות:</strong> {customer.notes}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" style={{
                          borderColor: '#1A73E8',
                          color: '#1A73E8'
                        }}>
                          <Eye className="h-4 w-4 mr-1" />
                          צפה
                        </Button>
                        <Button variant="outline" size="sm" style={{
                          borderColor: '#1A73E8',
                          color: '#1A73E8'
                        }}>
                          <Edit className="h-4 w-4 mr-1" />
                          ערוך
                        </Button>
                        <Button variant="outline" size="sm" style={{
                          borderColor: '#1A73E8',
                          color: '#1A73E8'
                        }}>
                          <Mail className="h-4 w-4" />
                        </Button>
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

export default function CustomersPage() {
  return (
    <ProtectedRoute>
      <CustomersContent />
    </ProtectedRoute>
  );
}
