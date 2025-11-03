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
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Save,
  X
} from 'lucide-react';
import Link from 'next/link';
import { CatalogCategory, CatalogProduct } from '@/lib/catalog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function ProductsContent() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<CatalogProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    sku: '',
    brand: '',
    category: '',
    purchasePrice: '',
    salePrice: '',
    description: '',
    notes: ''
  });
  
  // Toast state
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [categories, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/catalog');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let products: CatalogProduct[] = [];
    
    // Get all products from all categories
    categories.forEach(category => {
      products = products.concat(category.products);
    });

    // Filter by category
    if (selectedCategory !== 'all') {
      products = products.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(products);
  };

  const getStatusBadge = (product: CatalogProduct) => {
    // Simulate stock status
    const stock = Math.floor(Math.random() * 50) + 1;
    if (stock === 0) {
      return <Badge variant="destructive">אזל מהמלאי</Badge>;
    } else if (stock <= 5) {
      return <Badge variant="secondary" className="bg-yellow-500 text-white">מלאי נמוך</Badge>;
    } else {
      return <Badge variant="default" className="bg-green-500 text-white">במלאי</Badge>;
    }
  };

  const getCategoryOptions = () => {
    const options = [{ value: 'all', label: 'כל הקטגוריות' }];
    categories.forEach(category => {
      options.push({ value: category.name, label: category.name });
    });
    return options;
  };

  // Form handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      model: '',
      sku: '',
      brand: '',
      category: '',
      purchasePrice: '',
      salePrice: '',
      description: '',
      notes: ''
    });
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Product actions
  const handleAddProduct = async () => {
    try {
      // Validate form
      if (!formData.name || !formData.sku || !formData.category) {
        showToast('אנא מלא את כל השדות הנדרשים', 'error');
        return;
      }

      // Create new product
      const newProduct: CatalogProduct = {
        id: Date.now().toString(),
        name: formData.name,
        model: formData.model,
        sku: formData.sku,
        brand: formData.brand,
        category: formData.category,
        purchasePrice: parseFloat(formData.purchasePrice) || 0,
        salePrice: parseFloat(formData.salePrice) || 0,
        description: formData.description,
        notes: formData.notes
      };

      // Add to local state (in real app, this would be an API call)
      const updatedCategories = categories.map(cat => {
        if (cat.name === formData.category) {
          return { ...cat, products: [...cat.products, newProduct] };
        }
        return cat;
      });
      
      setCategories(updatedCategories);
      resetForm();
      setIsAddDialogOpen(false);
      showToast('המוצר נוסף בהצלחה!', 'success');
    } catch (error) {
      showToast('שגיאה בהוספת המוצר', 'error');
    }
  };

  const handleEditProduct = (product: CatalogProduct) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      model: product.model,
      sku: product.sku,
      brand: product.brand,
      category: product.category,
      purchasePrice: product.purchasePrice.toString(),
      salePrice: product.salePrice.toString(),
      description: product.description || '',
      notes: product.notes || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    try {
      const updatedProduct: CatalogProduct = {
        ...selectedProduct,
        name: formData.name,
        model: formData.model,
        sku: formData.sku,
        brand: formData.brand,
        category: formData.category,
        purchasePrice: parseFloat(formData.purchasePrice) || 0,
        salePrice: parseFloat(formData.salePrice) || 0,
        description: formData.description,
        notes: formData.notes
      };

      // Update in local state
      const updatedCategories = categories.map(cat => ({
        ...cat,
        products: cat.products.map(p => p.id === selectedProduct.id ? updatedProduct : p)
      }));
      
      setCategories(updatedCategories);
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      resetForm();
      showToast('המוצר עודכן בהצלחה!', 'success');
    } catch (error) {
      showToast('שגיאה בעדכון המוצר', 'error');
    }
  };

  const handleDeleteProduct = async (product: CatalogProduct) => {
    if (!confirm(`האם אתה בטוח שברצונך למחוק את המוצר "${product.name}"?`)) {
      return;
    }

    try {
      const updatedCategories = categories.map(cat => ({
        ...cat,
        products: cat.products.filter(p => p.id !== product.id)
      }));
      
      setCategories(updatedCategories);
      showToast('המוצר נמחק בהצלחה!', 'success');
    } catch (error) {
      showToast('שגיאה במחיקת המוצר', 'error');
    }
  };

  const handleViewProduct = (product: CatalogProduct) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleExportProducts = () => {
    try {
      const csvContent = [
        ['שם מוצר', 'דגם', 'SKU', 'מותג', 'קטגוריה', 'מחיר רכישה', 'מחיר מכירה', 'תיאור'],
        ...filteredProducts.map(product => [
          product.name,
          product.model,
          product.sku,
          product.brand,
          product.category,
          product.purchasePrice.toString(),
          product.salePrice.toString(),
          product.description || ''
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      showToast('המוצרים יוצאו בהצלחה!', 'success');
    } catch (error) {
      showToast('שגיאה בייצוא המוצרים', 'error');
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
                ניהול מוצרים
              </h1>
              <p className="text-muted-foreground" style={{color: '#E0E0E0'}}>
                נהלו את כל המוצרים בחנות שלכם
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="aegis" size="sm" style={{
                backgroundColor: '#1A73E8 !important',
                color: '#FFFFFF !important',
                border: '2px solid #1A73E8 !important'
              }}>
                <Upload className="h-4 w-4 mr-2" />
                ייבוא מוצרים
              </Button>
              <Button 
                variant="aegis" 
                size="sm" 
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(true);
                }}
                style={{
                  backgroundColor: '#1A73E8 !important',
                  color: '#FFFFFF !important',
                  border: '2px solid #1A73E8 !important'
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                הוסף מוצר
              </Button>
            </div>
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
                      placeholder="חפש מוצרים לפי שם, SKU או מותג..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>
                <div className="md:w-64">
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

      {/* Products Grid */}
      <Section className="py-8">
        <div className="container-max">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold" style={{color: '#F5F5F5'}}>
                מוצרים ({filteredProducts.length})
              </h2>
              <p className="text-sm text-muted-foreground" style={{color: '#A0A0A0'}}>
                {selectedCategory === 'all' ? 'כל המוצרים' : `קטגוריה: ${selectedCategory}`}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportProducts}
              style={{
                borderColor: '#1A73E8',
                color: '#1A73E8'
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              ייצא ל-Excel
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2" style={{color: '#F5F5F5'}}>
                  לא נמצאו מוצרים
                </h3>
                <p className="text-muted-foreground mb-4" style={{color: '#A0A0A0'}}>
                  {searchTerm ? 'לא נמצאו מוצרים התואמים לחיפוש שלכם' : 'אין מוצרים בקטגוריה זו'}
                </p>
                <Button variant="aegis" style={{
                  backgroundColor: '#1A73E8 !important',
                  color: '#FFFFFF !important',
                  border: '2px solid #1A73E8 !important'
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  הוסף מוצר ראשון
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg" style={{color: '#F5F5F5'}}>
                          {product.name}
                        </CardTitle>
                        <CardDescription className="mt-1" style={{color: '#A0A0A0'}}>
                          {product.brand} • {product.sku}
                        </CardDescription>
                      </div>
                      {getStatusBadge(product)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{color: '#E0E0E0'}}>מחיר:</span>
                        <span className="font-semibold text-lg" style={{color: '#1A73E8'}}>
                          ₪{product.salePrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{color: '#E0E0E0'}}>קטגוריה:</span>
                        <span className="text-sm" style={{color: '#A0A0A0'}}>
                          {product.category}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{color: '#E0E0E0'}}>דגם:</span>
                        <span className="text-sm" style={{color: '#A0A0A0'}}>
                          {product.model}
                        </span>
                      </div>
                      
                      <div className="flex gap-2 pt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1" 
                          onClick={() => handleViewProduct(product)}
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
                          className="flex-1" 
                          onClick={() => handleEditProduct(product)}
                          style={{
                            borderColor: '#1A73E8',
                            color: '#1A73E8'
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          ערוך
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteProduct(product)}
                          style={{
                            borderColor: '#dc2626',
                            color: '#dc2626'
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle style={{color: '#F5F5F5'}}>הוסף מוצר חדש</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" style={{color: '#E0E0E0'}}>שם המוצר *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="הזן שם מוצר"
                />
              </div>
              <div>
                <Label htmlFor="model" style={{color: '#E0E0E0'}}>דגם</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="הזן דגם"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku" style={{color: '#E0E0E0'}}>SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="הזן SKU"
                />
              </div>
              <div>
                <Label htmlFor="brand" style={{color: '#E0E0E0'}}>מותג</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="הזן מותג"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category" style={{color: '#E0E0E0'}}>קטגוריה *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="purchasePrice" style={{color: '#E0E0E0'}}>מחיר רכישה</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="salePrice" style={{color: '#E0E0E0'}}>מחיר מכירה</Label>
                <Input
                  id="salePrice"
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => handleInputChange('salePrice', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description" style={{color: '#E0E0E0'}}>תיאור</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="הזן תיאור מוצר"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="notes" style={{color: '#E0E0E0'}}>הערות</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="הזן הערות"
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                ביטול
              </Button>
              <Button 
                onClick={handleAddProduct}
                style={{
                  backgroundColor: '#1A73E8 !important',
                  color: '#FFFFFF !important',
                  border: '2px solid #1A73E8 !important'
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                שמור מוצר
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle style={{color: '#F5F5F5'}}>ערוך מוצר</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name" style={{color: '#E0E0E0'}}>שם המוצר *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="הזן שם מוצר"
                />
              </div>
              <div>
                <Label htmlFor="edit-model" style={{color: '#E0E0E0'}}>דגם</Label>
                <Input
                  id="edit-model"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="הזן דגם"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-sku" style={{color: '#E0E0E0'}}>SKU *</Label>
                <Input
                  id="edit-sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="הזן SKU"
                />
              </div>
              <div>
                <Label htmlFor="edit-brand" style={{color: '#E0E0E0'}}>מותג</Label>
                <Input
                  id="edit-brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="הזן מותג"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-category" style={{color: '#E0E0E0'}}>קטגוריה *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-purchasePrice" style={{color: '#E0E0E0'}}>מחיר רכישה</Label>
                <Input
                  id="edit-purchasePrice"
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="edit-salePrice" style={{color: '#E0E0E0'}}>מחיר מכירה</Label>
                <Input
                  id="edit-salePrice"
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => handleInputChange('salePrice', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description" style={{color: '#E0E0E0'}}>תיאור</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="הזן תיאור מוצר"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-notes" style={{color: '#E0E0E0'}}>הערות</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="הזן הערות"
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                ביטול
              </Button>
              <Button 
                onClick={handleUpdateProduct}
                style={{
                  backgroundColor: '#1A73E8 !important',
                  color: '#FFFFFF !important',
                  border: '2px solid #1A73E8 !important'
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                עדכן מוצר
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle style={{color: '#F5F5F5'}}>פרטי מוצר</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label style={{color: '#E0E0E0'}}>שם המוצר</Label>
                  <p className="text-lg font-semibold" style={{color: '#F5F5F5'}}>{selectedProduct.name}</p>
                </div>
                <div>
                  <Label style={{color: '#E0E0E0'}}>דגם</Label>
                  <p style={{color: '#A0A0A0'}}>{selectedProduct.model}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label style={{color: '#E0E0E0'}}>SKU</Label>
                  <p className="font-mono" style={{color: '#A0A0A0'}}>{selectedProduct.sku}</p>
                </div>
                <div>
                  <Label style={{color: '#E0E0E0'}}>מותג</Label>
                  <p style={{color: '#A0A0A0'}}>{selectedProduct.brand}</p>
                </div>
              </div>
              <div>
                <Label style={{color: '#E0E0E0'}}>קטגוריה</Label>
                <p style={{color: '#A0A0A0'}}>{selectedProduct.category}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label style={{color: '#E0E0E0'}}>מחיר רכישה</Label>
                  <p className="text-lg font-semibold" style={{color: '#F5F5F5'}}>₪{selectedProduct.purchasePrice.toLocaleString()}</p>
                </div>
                <div>
                  <Label style={{color: '#E0E0E0'}}>מחיר מכירה</Label>
                  <p className="text-lg font-semibold" style={{color: '#1A73E8'}}>₪{selectedProduct.salePrice.toLocaleString()}</p>
                </div>
              </div>
              {selectedProduct.description && (
                <div>
                  <Label style={{color: '#E0E0E0'}}>תיאור</Label>
                  <p style={{color: '#A0A0A0'}}>{selectedProduct.description}</p>
                </div>
              )}
              {selectedProduct.notes && (
                <div>
                  <Label style={{color: '#E0E0E0'}}>הערות</Label>
                  <p style={{color: '#A0A0A0'}}>{selectedProduct.notes}</p>
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
    </PanelLayout>
  );
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <ProductsContent />
    </ProtectedRoute>
  );
}
