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
  Package, 
  Search, 
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Edit,
  BarChart3,
  Activity,
  Save,
  X,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { CatalogCategory, CatalogProduct } from '@/lib/catalog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InventoryItem extends CatalogProduct {
  currentStock: number;
  minStock: number;
  maxStock: number;
  lastUpdated: string;
  reservedStock: number;
  availableStock: number;
}

function InventoryContent() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    currentStock: '',
    minStock: '',
    maxStock: '',
    notes: ''
  });
  
  // Toast state
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    filterItems();
  }, [inventoryItems, searchTerm, selectedCategory, stockFilter]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/catalog');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        
        // Convert catalog products to inventory items with mock stock data
        const inventory: InventoryItem[] = [];
        data.forEach((category: CatalogCategory) => {
          category.products.forEach((product: CatalogProduct) => {
            const currentStock = Math.floor(Math.random() * 100) + 1;
            const minStock = Math.floor(Math.random() * 10) + 5;
            const maxStock = Math.floor(Math.random() * 200) + 100;
            const reservedStock = Math.floor(Math.random() * 10);
            
            inventory.push({
              ...product,
              currentStock,
              minStock,
              maxStock,
              lastUpdated: new Date().toISOString(),
              reservedStock,
              availableStock: currentStock - reservedStock
            });
          });
        });
        
        setInventoryItems(inventory);
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = inventoryItems;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by stock status
    if (stockFilter !== 'all') {
      switch (stockFilter) {
        case 'low':
          filtered = filtered.filter(item => item.currentStock <= item.minStock);
          break;
        case 'out':
          filtered = filtered.filter(item => item.currentStock === 0);
          break;
        case 'high':
          filtered = filtered.filter(item => item.currentStock >= item.maxStock * 0.8);
          break;
      }
    }

    setFilteredItems(filtered);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) {
      return { status: 'out', label: 'אזל מהמלאי', color: 'bg-red-500', icon: AlertTriangle };
    } else if (item.currentStock <= item.minStock) {
      return { status: 'low', label: 'מלאי נמוך', color: 'bg-yellow-500', icon: AlertTriangle };
    } else if (item.currentStock >= item.maxStock * 0.8) {
      return { status: 'high', label: 'מלאי גבוה', color: 'bg-green-500', icon: CheckCircle };
    } else {
      return { status: 'normal', label: 'במלאי', color: 'bg-blue-500', icon: CheckCircle };
    }
  };

  const getStockTrend = (item: InventoryItem) => {
    // Simulate stock trend
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    return trend;
  };

  const getCategoryOptions = () => {
    const options = [{ value: 'all', label: 'כל הקטגוריות' }];
    categories.forEach(category => {
      options.push({ value: category.name, label: category.name });
    });
    return options;
  };

  const getStockFilterOptions = () => [
    { value: 'all', label: 'כל המלאי' },
    { value: 'low', label: 'מלאי נמוך' },
    { value: 'out', label: 'אזל מהמלאי' },
    { value: 'high', label: 'מלאי גבוה' }
  ];

  // Form handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      currentStock: '',
      minStock: '',
      maxStock: '',
      notes: ''
    });
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Inventory actions
  const handleViewItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setFormData({
      currentStock: item.currentStock.toString(),
      minStock: item.minStock.toString(),
      maxStock: item.maxStock.toString(),
      notes: item.notes || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateItem = async () => {
    if (!selectedItem) return;

    try {
      const updatedItem: InventoryItem = {
        ...selectedItem,
        currentStock: parseInt(formData.currentStock) || 0,
        minStock: parseInt(formData.minStock) || 0,
        maxStock: parseInt(formData.maxStock) || 0,
        notes: formData.notes,
        availableStock: parseInt(formData.currentStock) || 0 - selectedItem.reservedStock,
        lastUpdated: new Date().toISOString()
      };

      // Update in local state
      setInventoryItems(prev => prev.map(item => 
        item.id === selectedItem.id ? updatedItem : item
      ));
      
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      resetForm();
      showToast('המלאי עודכן בהצלחה!', 'success');
    } catch (error) {
      showToast('שגיאה בעדכון המלאי', 'error');
    }
  };

  const handleAdjustStock = (item: InventoryItem, adjustment: number) => {
    try {
      const newStock = Math.max(0, item.currentStock + adjustment);
      const updatedItem: InventoryItem = {
        ...item,
        currentStock: newStock,
        availableStock: newStock - item.reservedStock,
        lastUpdated: new Date().toISOString()
      };

      setInventoryItems(prev => prev.map(i => 
        i.id === item.id ? updatedItem : i
      ));
      
      showToast(`המלאי עודכן ל-${newStock} יחידות`, 'success');
    } catch (error) {
      showToast('שגיאה בעדכון המלאי', 'error');
    }
  };

  const handleExportInventory = () => {
    try {
      const csvContent = [
        ['שם מוצר', 'SKU', 'קטגוריה', 'מלאי נוכחי', 'מלאי מינימלי', 'מלאי מקסימלי', 'מלאי זמין', 'מלאי שמור', 'תאריך עדכון אחרון'],
        ...filteredItems.map(item => [
          item.name,
          item.sku,
          item.category,
          item.currentStock.toString(),
          item.minStock.toString(),
          item.maxStock.toString(),
          item.availableStock.toString(),
          item.reservedStock.toString(),
          new Date(item.lastUpdated).toLocaleDateString('he-IL')
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      showToast('המלאי יוצא בהצלחה!', 'success');
    } catch (error) {
      showToast('שגיאה בייצוא המלאי', 'error');
    }
  };

  const getInventoryStats = () => {
    const totalItems = inventoryItems.length;
    const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minStock).length;
    const outOfStockItems = inventoryItems.filter(item => item.currentStock === 0).length;
    const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.salePrice), 0);
    
    return { totalItems, lowStockItems, outOfStockItems, totalValue };
  };

  const stats = getInventoryStats();

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
                מעקב מלאי
              </h1>
              <p className="text-muted-foreground" style={{color: '#E0E0E0'}}>
                נהלו ומעקבו אחר המלאי שלכם
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button 
                variant="aegis" 
                size="sm" 
                onClick={handleExportInventory}
                style={{
                  backgroundColor: '#1A73E8 !important',
                  color: '#FFFFFF !important',
                  border: '2px solid #1A73E8 !important'
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                ייצא דוח מלאי
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
                    <p className="text-sm font-medium" style={{color: '#A0A0A0'}}>סה"כ פריטים</p>
                    <p className="text-2xl font-bold" style={{color: '#F5F5F5'}}>
                      {stats.totalItems}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{color: '#A0A0A0'}}>מלאי נמוך</p>
                    <p className="text-2xl font-bold" style={{color: '#F5F5F5'}}>
                      {stats.lowStockItems}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{color: '#A0A0A0'}}>אזל מהמלאי</p>
                    <p className="text-2xl font-bold" style={{color: '#F5F5F5'}}>
                      {stats.outOfStockItems}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{color: '#A0A0A0'}}>ערך המלאי</p>
                    <p className="text-2xl font-bold" style={{color: '#F5F5F5'}}>
                      ₪{stats.totalValue.toLocaleString()}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-500" />
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
                      placeholder="חפש פריטים לפי שם, SKU או מותג..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>
                <div className="md:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    style={{color: '#E0E0E0'}}
                  >
                    {getCategoryOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:w-48">
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    style={{color: '#E0E0E0'}}
                  >
                    {getStockFilterOptions().map(option => (
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

      {/* Inventory Table */}
      <Section className="py-8">
        <div className="container-max">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold" style={{color: '#F5F5F5'}}>
                פריטי מלאי ({filteredItems.length})
              </h2>
              <p className="text-sm text-muted-foreground" style={{color: '#A0A0A0'}}>
                {selectedCategory === 'all' ? 'כל הפריטים' : `קטגוריה: ${selectedCategory}`}
              </p>
            </div>
          </div>

          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 animate-pulse">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-4 bg-muted rounded w-1/6"></div>
                      <div className="h-4 bg-muted rounded w-1/6"></div>
                      <div className="h-4 bg-muted rounded w-1/6"></div>
                      <div className="h-4 bg-muted rounded w-1/6"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : filteredItems.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2" style={{color: '#F5F5F5'}}>
                  לא נמצאו פריטים
                </h3>
                <p className="text-muted-foreground" style={{color: '#A0A0A0'}}>
                  {searchTerm ? 'לא נמצאו פריטים התואמים לחיפוש שלכם' : 'אין פריטים בקטגוריה זו'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-right p-4 font-medium" style={{color: '#F5F5F5'}}>מוצר</th>
                        <th className="text-right p-4 font-medium" style={{color: '#F5F5F5'}}>SKU</th>
                        <th className="text-right p-4 font-medium" style={{color: '#F5F5F5'}}>מלאי נוכחי</th>
                        <th className="text-right p-4 font-medium" style={{color: '#F5F5F5'}}>מלאי מינימלי</th>
                        <th className="text-right p-4 font-medium" style={{color: '#F5F5F5'}}>מלאי זמין</th>
                        <th className="text-right p-4 font-medium" style={{color: '#F5F5F5'}}>סטטוס</th>
                        <th className="text-right p-4 font-medium" style={{color: '#F5F5F5'}}>פעולות</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((item) => {
                        const stockStatus = getStockStatus(item);
                        const trend = getStockTrend(item);
                        const StatusIcon = stockStatus.icon;
                        
                        return (
                          <tr key={item.id} className="border-b border-border hover:bg-muted/50">
                            <td className="p-4">
                              <div>
                                <div className="font-medium" style={{color: '#F5F5F5'}}>{item.name}</div>
                                <div className="text-sm" style={{color: '#A0A0A0'}}>{item.brand}</div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-sm font-mono" style={{color: '#E0E0E0'}}>{item.sku}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium" style={{color: '#F5F5F5'}}>{item.currentStock}</span>
                                {trend === 'up' ? (
                                  <TrendingUp className="h-4 w-4 text-green-500" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <span style={{color: '#E0E0E0'}}>{item.minStock}</span>
                            </td>
                            <td className="p-4">
                              <span style={{color: '#E0E0E0'}}>{item.availableStock}</span>
                            </td>
                            <td className="p-4">
                              <Badge className={`${stockStatus.color} text-white`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {stockStatus.label}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleViewItem(item)}
                                  style={{
                                    borderColor: '#1A73E8',
                                    color: '#1A73E8'
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEditItem(item)}
                                  style={{
                                    borderColor: '#1A73E8',
                                    color: '#1A73E8'
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleAdjustStock(item, 1)}
                                  style={{
                                    borderColor: '#16a34a',
                                    color: '#16a34a'
                                  }}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleAdjustStock(item, -1)}
                                  style={{
                                    borderColor: '#dc2626',
                                    color: '#dc2626'
                                  }}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
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

      {/* View Item Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle style={{color: '#F5F5F5'}}>פרטי מלאי</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6">
              {/* Item Header */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label style={{color: '#E0E0E0'}}>שם מוצר</Label>
                  <p className="text-lg font-semibold" style={{color: '#F5F5F5'}}>{selectedItem.name}</p>
                </div>
                <div>
                  <Label style={{color: '#E0E0E0'}}>SKU</Label>
                  <p className="font-mono" style={{color: '#A0A0A0'}}>{selectedItem.sku}</p>
                </div>
              </div>

              {/* Stock Info */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label style={{color: '#E0E0E0'}}>מלאי נוכחי</Label>
                  <p className="text-2xl font-bold" style={{color: '#1A73E8'}}>{selectedItem.currentStock}</p>
                </div>
                <div>
                  <Label style={{color: '#E0E0E0'}}>מלאי מינימלי</Label>
                  <p className="text-lg font-semibold" style={{color: '#F5F5F5'}}>{selectedItem.minStock}</p>
                </div>
                <div>
                  <Label style={{color: '#E0E0E0'}}>מלאי מקסימלי</Label>
                  <p className="text-lg font-semibold" style={{color: '#F5F5F5'}}>{selectedItem.maxStock}</p>
                </div>
              </div>

              {/* Available & Reserved Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label style={{color: '#E0E0E0'}}>מלאי זמין</Label>
                  <p className="text-lg font-semibold" style={{color: '#16a34a'}}>{selectedItem.availableStock}</p>
                </div>
                <div>
                  <Label style={{color: '#E0E0E0'}}>מלאי שמור</Label>
                  <p className="text-lg font-semibold" style={{color: '#dc2626'}}>{selectedItem.reservedStock}</p>
                </div>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label style={{color: '#E0E0E0'}}>מותג</Label>
                  <p style={{color: '#A0A0A0'}}>{selectedItem.brand}</p>
                </div>
                <div>
                  <Label style={{color: '#E0E0E0'}}>קטגוריה</Label>
                  <p style={{color: '#A0A0A0'}}>{selectedItem.category}</p>
                </div>
                <div>
                  <Label style={{color: '#E0E0E0'}}>מחיר מכירה</Label>
                  <p className="text-lg font-semibold" style={{color: '#1A73E8'}}>₪{selectedItem.salePrice.toLocaleString()}</p>
                </div>
                <div>
                  <Label style={{color: '#E0E0E0'}}>ערך מלאי</Label>
                  <p className="text-lg font-semibold" style={{color: '#F5F5F5'}}>₪{(selectedItem.currentStock * selectedItem.salePrice).toLocaleString()}</p>
                </div>
              </div>

              {/* Last Updated */}
              <div>
                <Label style={{color: '#E0E0E0'}}>תאריך עדכון אחרון</Label>
                <p style={{color: '#A0A0A0'}}>{new Date(selectedItem.lastUpdated).toLocaleString('he-IL')}</p>
              </div>

              {/* Notes */}
              {selectedItem.notes && (
                <div>
                  <Label style={{color: '#E0E0E0'}}>הערות</Label>
                  <p style={{color: '#A0A0A0'}}>{selectedItem.notes}</p>
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

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle style={{color: '#F5F5F5'}}>ערוך מלאי</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currentStock" style={{color: '#E0E0E0'}}>מלאי נוכחי</Label>
                <Input
                  id="currentStock"
                  type="number"
                  value={formData.currentStock}
                  onChange={(e) => handleInputChange('currentStock', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="minStock" style={{color: '#E0E0E0'}}>מלאי מינימלי</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => handleInputChange('minStock', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="maxStock" style={{color: '#E0E0E0'}}>מלאי מקסימלי</Label>
                <Input
                  id="maxStock"
                  type="number"
                  value={formData.maxStock}
                  onChange={(e) => handleInputChange('maxStock', e.target.value)}
                  placeholder="0"
                />
              </div>
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
                onClick={handleUpdateItem}
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

export default function InventoryPage() {
  return (
    <ProtectedRoute>
      <InventoryContent />
    </ProtectedRoute>
  );
}
