'use client';

import { useState, useEffect } from 'react';
import { Section } from '@/components/common/section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Camera,
  Package,
  Wrench,
  Star,
  Search,
  Filter,
  ShoppingCart,
  ArrowRight,
  Shield,
  Wifi,
  Eye,
  Zap,
  Thermometer,
  Car,
  Grid3X3,
  HardDrive,
  Home,
  ChevronDown,
  X,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useCart } from '@/contexts/cart-context';
import { toast } from 'sonner';
import { CartDebug } from '@/components/debug/cart-debug';
import { CatalogProduct, CatalogCategory, loadCatalog, getAllProducts } from '@/lib/catalog';

// Fetch products from new catalog API
const useProducts = () => {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from new catalog API...');
        const response = await fetch('/api/catalog');
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        const catalogData: CatalogCategory[] = await response.json();
        console.log('Catalog data:', catalogData);
        
        setCategories(catalogData);
        setProducts(getAllProducts(catalogData));
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, categories, loading, error };
};

const getCategories = (categories: CatalogCategory[]) => {
  const categoryMap = [
    { id: 'all', name: 'כל המוצרים', icon: Grid3X3 },
    { id: 'Cameras & Kits (וידאו ואבטחה)', name: 'מצלמות IP', icon: Camera },
    { id: 'NVR / DVR / Storage', name: 'NVR/DVR/אחסון', icon: HardDrive },
    { id: 'Access Control & Entry', name: 'בקרת כניסה', icon: Shield },
    { id: 'Alarm Systems & Sensors', name: 'אזעקות וחיישנים', icon: Eye },
    { id: 'Networking & Power Accessories', name: 'רשתות וחשמל', icon: Wifi },
    { id: 'Tools & Installation', name: 'כלי עבודה', icon: Wrench },
    { id: 'Power & Backup', name: 'חשמל וגיבוי', icon: Zap },
    { id: 'Accessories & Maintenance', name: 'תחזוקה ואביזרים', icon: Wrench },
    { id: 'Smart Home & Integration', name: 'בית חכם', icon: Home },
    { id: 'שירותים', name: 'שירותים', icon: Shield }
  ];

  return categoryMap.map(cat => {
    const category = categories.find(c => c.name === cat.id);
    return {
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      count: category ? category.products.length : 0
    };
  });
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'camera': return Camera;
    case 'cameras': return Camera;
    case 'packages': return Package;
    case 'nvr': return HardDrive;
    case 'nvr-storage': return HardDrive;
    case 'access': return Shield;
    case 'access-control': return Shield;
    case 'alarm': return Eye;
    case 'alarm-sensors': return Eye;
    case 'networking': return Wifi;
    case 'tools': return Wrench;
    case 'power': return Zap;
    case 'power-backup': return Zap;
    case 'accessories': return Wrench;
    case 'maintenance': return Wrench;
    case 'smart-home': return Home;
    case 'services': return Shield;
    default: return Grid3X3;
  }
};

export default function StorePage() {
  const { products, categories, loading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  
  // Advanced filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    getCartItemCount,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  // Debug cart state
  useEffect(() => {
    console.log('Store: Cart state changed:', cart);
  }, [cart]);

  const categoryList = getCategories(categories);

  // Get unique brands from products
  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
  // For now, we'll use a static list of common features
  const features = ['4K', 'WiFi', 'Night Vision', 'Weatherproof', 'Motion Detection', 'Remote Access', 'Mobile App', 'Cloud Storage', 'Local Storage', 'Two-Way Audio'];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsCategorySidebarOpen(false);
  };

  // Advanced filtering logic
  const getFilteredProducts = () => {
    let filtered = products;

    // Category filter
    if (selectedCategory !== 'all') {
      const category = categories.find(c => c.name === selectedCategory);
      if (category) {
        filtered = category.products;
      }
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(product => 
      product.salePrice >= priceRange[0] && product.salePrice <= priceRange[1]
    );

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        product.brand && selectedBrands.includes(product.brand)
      );
    }

    // Features filter (for now, we'll skip this since features aren't in the product model)
    // if (selectedFeatures.length > 0) {
    //   filtered = filtered.filter(product => 
    //     product.features && selectedFeatures.some(feature => 
    //       product.features!.includes(feature)
    //     )
    //   );
    // }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.salePrice - b.salePrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.salePrice - a.salePrice);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popular':
      default:
        // Keep original order for popular
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const handleAddToCart = (product: any) => {
    console.log('Store: Adding to cart:', product);
    addToCart(product);
    setAddedItems(prev => new Set(prev).add(product.id));
    toast.success(`${product.name} נוסף לעגלה!`, {
      duration: 2000,
    });
    
    // Reset animation after 2 seconds
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 2000);
  };

  const handleBuyNow = (product: any) => {
    addToCart(product);
    toast.success(`${product.name} נוסף לעגלה!`, {
      duration: 2000,
    });
    // Navigate to checkout
    window.location.href = '/store/checkout';
  };


  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.salePrice - b.salePrice;
      case 'price-high':
        return b.salePrice - a.salePrice;
      case 'popular':
        return a.name.localeCompare(b.name);
      case 'new':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <div className="pt-20">
          <Section className="py-16">
            <div className="container-max text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aegis-blue mx-auto mb-4"></div>
              <p className="text-muted-foreground">טוען מוצרים...</p>
            </div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <div className="pt-20">
          <Section className="py-16">
            <div className="container-max text-center">
              <p className="text-red-500 mb-4">שגיאה בטעינת המוצרים</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <Section className="py-12 bg-gradient-to-b from-aegis-blue/10 to-background">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-foreground mb-6"
            >
              חנות Aegis Spectra
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-foreground/80 mb-8"
            >
              מגוון רחב של מוצרי אבטחה מקצועיים - מצלמות, NVR/DVR, מערכות התראה ועוד
            </motion.p>
            
            
            {/* Search and Filter */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-4 max-w-4xl mx-auto"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={20} />
                  <Input
                    placeholder="חיפוש מוצרים..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="popular">הכי פופולריים</option>
                  <option value="new">החדשים ביותר</option>
                  <option value="price-low">מחיר: נמוך לגבוה</option>
                  <option value="price-high">מחיר: גבוה לנמוך</option>
                  <option value="name">שם: א-ת</option>
                </select>
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Filter size={18} />
                  פילטרים
                </Button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-muted/50 rounded-lg p-6 space-y-6"
                >
                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold mb-3">טווח מחירים</h3>
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        placeholder="מ-"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-24"
                      />
                      <span>עד</span>
                      <Input
                        type="number"
                        placeholder="עד"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-24"
                      />
                    </div>
                  </div>

                  {/* Brands */}
                  {brands.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">מותגים</h3>
                      <div className="flex flex-wrap gap-2">
                        {brands.map(brand => (
                          <Button
                            key={brand}
                            variant={selectedBrands.includes(brand) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setSelectedBrands(prev => 
                                prev.includes(brand) 
                                  ? prev.filter(b => b !== brand)
                                  : [...prev, brand]
                              );
                            }}
                          >
                            {brand}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {features.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">תכונות</h3>
                      <div className="flex flex-wrap gap-2">
                        {features.slice(0, 10).map(feature => (
                          <Button
                            key={feature}
                            variant={selectedFeatures.includes(feature) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setSelectedFeatures(prev => 
                                prev.includes(feature) 
                                  ? prev.filter(f => f !== feature)
                                  : [...prev, feature]
                              );
                            }}
                          >
                            {feature}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clear Filters */}
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPriceRange([0, 10000]);
                        setSelectedBrands([]);
                        setSelectedFeatures([]);
                      }}
                    >
                      <X size={16} className="mr-2" />
                      נקה פילטרים
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </Section>

        {/* Cart Button */}
        <div className="fixed top-20 right-4 z-40">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsCartOpen(true)}
            className="relative shadow-lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            עגלה
            {getCartItemCount() > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-aegis-blue text-white">
                {getCartItemCount()}
              </Badge>
            )}
          </Button>
        </div>


        {/* Category Filter */}
        <Section className="py-8">
          <div className="flex justify-center mb-8">
            <Button
              onClick={() => setIsCategorySidebarOpen(true)}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <Grid3X3 size={18} />
              {selectedCategory === 'all' ? 'כל המוצרים' : categoryList.find(c => c.id === selectedCategory)?.name}
              <ChevronDown size={16} />
            </Button>
          </div>
        </Section>

    {/* Cart Sidebar */}
    {isCartOpen && (
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <div 
          className="flex-1 bg-black/50" 
          onClick={() => setIsCartOpen(false)}
        />
        
        {/* Cart Sidebar */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="w-96 bg-background border-l border-border shadow-xl"
          dir="rtl"
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">עגלת קניות</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(false)}
              >
                <X size={20} />
              </Button>
            </div>
            
            {cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingCart size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">העגלה ריקה</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-muted-foreground text-sm">{item.price} ₪</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-6 w-6 p-0"
                          >
                            -
                          </Button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 p-0"
                          >
                            +
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="h-6 w-6 p-0 text-red-500"
                          >
                            <X size={12} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold">סה"כ:</span>
                    <span className="font-bold text-lg">{getCartTotal()} ₪</span>
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => {
                      // Navigate to checkout
                      window.location.href = '/store/checkout';
                    }}
                  >
                    המשך לרכישה
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    )}

        {/* Products Grid */}
        <Section className="py-8">
          {/* Results Count */}
          <div className="mb-6 text-center">
            <p className="text-muted-foreground">
              מציג {filteredProducts.length} מתוך {products.length} מוצרים
              {searchQuery && ` עבור "${searchQuery}"`}
            </p>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">לא נמצאו מוצרים</h3>
              <p className="text-muted-foreground mb-4">
                נסה לשנות את הפילטרים או החיפוש
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setPriceRange([0, 10000]);
                  setSelectedBrands([]);
                  setSelectedFeatures([]);
                }}
              >
                נקה פילטרים
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product, index) => {
              const CategoryIcon = getCategoryIcon(product.category);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                    <CardHeader className="pb-4">
                      <div className="relative">
                        <div className="aspect-video bg-gradient-to-br from-aegis-blue/20 to-aegis-graphite/20 rounded-lg mb-4 flex items-center justify-center">
                          {product.sku === '4000-8591' ? (
                            <img 
                              src="/products/4000-8591/product-image.png" 
                              alt={product.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : product.sku === '4000-8592' ? (
                            <img 
                              src="/products/4000-8592/product-image.png" 
                              alt={product.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : product.sku === '4000-8593' ? (
                            <img 
                              src="/products/4000-8593/product-image.png" 
                              alt={product.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : product.sku === '4000-8594' ? (
                            <img 
                              src="/products/4000-8594/product-image.png" 
                              alt={product.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : product.sku === '4000-8595' ? (
                            <img 
                              src="/products/4000-8595/product-image.png" 
                              alt={product.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : product.sku === '4000-8596' ? (
                            <img 
                              src="/products/4000-8596/product-image.png" 
                              alt={product.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : product.sku === '4000-8597' ? (
                            <img 
                              src="/products/4000-8597/product-image.png" 
                              alt={product.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : product.sku === '4000-8598' ? (
                            <img 
                              src="/products/4000-8598/product-image.png" 
                              alt={product.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : product.sku === '4000-8599' ? (
                            <img 
                              src="/products/4000-8599/product-image.png" 
                              alt={product.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : (
                            <CategoryIcon size={48} className="text-aegis-blue" />
                          )}
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {product.category === 'cameras' ? product.model : product.sku}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                      <CardDescription className="text-sm text-foreground/70 mb-3">
                        {product.model} - {product.brand}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Price */}
                        <div className="text-center">
                          <div className="text-2xl font-bold text-aegis-blue mb-2">
                            ₪{product.salePrice.toLocaleString()}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Button 
                              asChild 
                              className="flex-1 cta-button font-bold text-base"
                              size="sm"
                            >
                              <Link href={`/products/${product.sku}`}>
                                פרטים נוספים
                                <ArrowRight size={16} className="mr-1" />
                              </Link>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className={`px-3 transition-all duration-300 ${
                                addedItems.has(product.id) 
                                  ? 'bg-green-500 text-white border-green-500' 
                                  : 'hover:bg-aegis-blue hover:text-white'
                              }`}
                              onClick={() => handleAddToCart(product)}
                              disabled={addedItems.has(product.id)}
                            >
                              {addedItems.has(product.id) ? (
                                <Check size={16} />
                              ) : (
                                <ShoppingCart size={16} />
                              )}
                            </Button>
                          </div>
                          <Button 
                            variant="default" 
                            size="sm"
                            className="w-full bg-aegis-blue hover:bg-aegis-blue/90"
                            onClick={() => handleBuyNow(product)}
                          >
                            קנה עכשיו
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
            </div>
          )}
        </Section>

        {/* CTA Section */}
        <Section className="py-12 bg-gradient-to-r from-aegis-blue to-aegis-graphite text-white">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              לא מוצאים מה שאתה מחפש?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              צוות המומחים שלנו יעזור לך לבנות את מערכת האבטחה המושלמת
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/contact">
                  צור קשר עם מומחה
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-aegis-graphite">
                <Link href="/builder">
                  בונה חבילות מותאמות
                </Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>

      {/* Category Sidebar */}
      {isCategorySidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="flex-1 bg-black/50" 
            onClick={() => setIsCategorySidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-80 bg-background border-l border-border shadow-xl"
            dir="rtl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">בחר קטגוריה</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCategorySidebarOpen(false)}
                >
                  <X size={20} />
                </Button>
              </div>
              
              <div className="space-y-2">
                {categoryList.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      onClick={() => handleCategorySelect(category.id)}
                      className="w-full justify-start gap-3 h-12"
                    >
                      <Icon size={18} />
                      <span className="flex-1 text-right">{category.name}</span>
                      <Badge variant="secondary">
                        {category.count}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      <Footer />
      <CartDebug />
    </div>
  );
}
