'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Section } from '@/components/common/section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Camera, 
  Package, 
  Wrench, 
  Star,
  ShoppingCart,
  ArrowRight,
  Shield,
  Wifi,
  Eye,
  Zap,
  Thermometer,
  Car,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  Gift,
  ArrowLeft,
  Minus,
  Plus,
  HardDrive,
  Home,
  AlertTriangle,
  Hash,
  Bell,
  Network,
  Battery,
  Building,
  Activity,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useCart } from '@/contexts/cart-context';
import { toast } from 'sonner';

// Product interface
interface Product {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  category: string;
  features: string[];
  specifications?: Array<{ label: string; value: string }>;
  image: string;
  popular?: boolean;
  new?: boolean;
  inStock?: boolean;
  stockCount?: number;
}

// Fetch product from API
const useProduct = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product:', productId);
        const response = await fetch(`/api/store/products/${productId}`);
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }
        const data = await response.json();
        console.log('Product data:', data);
        setProduct(data.product || data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return { product, loading, error };
};

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  
  const { product, loading, error } = useProduct(productId);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAddedToCart(true);
      toast.success(`${product.name} נוסף לעגלה!`, {
        duration: 2000,
      });
      
      // Reset animation after 2 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      toast.success(`${product.name} נוסף לעגלה!`, {
        duration: 2000,
      });
      // Navigate to checkout
      window.location.href = '/store/checkout';
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <main className="pt-16">
          <Section className="py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">טוען מוצר...</h1>
              <p className="text-muted-foreground">אנא המתן בזמן שאנו מביאים את פרטי המוצר.</p>
            </div>
          </Section>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <main className="pt-16">
          <Section className="py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">מוצר לא נמצא</h1>
              <p className="text-muted-foreground mb-4">{error || 'המוצר המבוקש לא נמצא'}</p>
              <Button asChild>
                <Link href="/store">
                  <ArrowLeft className="ml-2" size={16} />
                  חזור לחנות
                </Link>
              </Button>
            </div>
          </Section>
        </main>
        <Footer />
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cameras': return Camera;
      case 'packages': return Package;
      case 'accessories': return Wrench;
      case 'services': return Shield;
      case 'storage': return HardDrive;
      case 'access': return Shield;
      case 'alarm': return AlertTriangle;
      case 'networking': return Network;
      case 'tools': return Wrench;
      case 'power': return Battery;
      case 'maintenance': return Wrench;
      case 'smart': return Home;
      default: return Package;
    }
  };

  const CategoryIcon = getCategoryIcon(product.category);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      <main className="pt-16">
        {/* Breadcrumb */}
        <Section className="py-4 bg-muted/30">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/store" className="text-foreground/70 hover:text-foreground">
              חנות
            </Link>
            <span className="text-foreground/50">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </Section>

        <Section className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="aspect-video bg-gradient-to-br from-aegis-blue/20 to-aegis-graphite/20 rounded-lg flex items-center justify-center">
                <CategoryIcon size={120} className="text-aegis-blue" />
              </div>
              <div className="flex gap-2">
                {product.popular && (
                  <Badge className="bg-aegis-blue text-white">
                    <Star size={12} className="ml-1" />
                    פופולרי
                  </Badge>
                )}
                {product.new && (
                  <Badge variant="secondary">
                    חדש
                  </Badge>
                )}
                <Badge variant={product.inStock ? "default" : "destructive"}>
                  {product.inStock ? `במלאי (${product.stockCount})` : 'אזל מהמלאי'}
                </Badge>
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-xl text-foreground/70 mb-4">{product.description}</p>
                <div className="text-3xl font-bold text-aegis-blue mb-6">
                  {product.priceRange}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">כמות:</span>
                <div className="flex items-center border border-border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.inStock}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className={`flex-1 transition-all duration-300 ${
                    addedToCart 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-aegis-blue hover:bg-aegis-blue/90'
                  }`}
                  disabled={!product.inStock || addedToCart}
                  onClick={handleAddToCart}
                >
                  {addedToCart ? (
                    <>
                      <Check size={20} className="ml-2" />
                      נוסף לעגלה!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} className="ml-2" />
                      הוסף לעגלה
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  disabled={!product.inStock}
                  onClick={handleBuyNow}
                >
                  קנה עכשיו
                </Button>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold mb-3">תכונות עיקריות:</h3>
                <div className="space-y-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle size={16} className="text-aegis-blue ml-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* Specifications */}
        <Section className="py-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">מפרטים טכניים</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.specifications?.map((spec, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-border/50">
                  <span className="font-medium">{spec.label}:</span>
                  <span className="text-foreground/70">{spec.value}</span>
                </div>
              )) || (
                <div className="col-span-2 text-center text-muted-foreground">
                  אין מפרטים טכניים זמינים
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* Related Products */}
        <Section className="py-8">
          <h2 className="text-2xl font-bold mb-6 text-center">מוצרים קשורים</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* This would be populated with related products */}
            <Card>
              <CardHeader>
                <CardTitle>מוצר קשור 1</CardTitle>
                <CardDescription>תיאור מוצר קשור</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/store/product/related-1">צפה במוצר</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>מוצר קשור 2</CardTitle>
                <CardDescription>תיאור מוצר קשור</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/store/product/related-2">צפה במוצר</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>מוצר קשור 3</CardTitle>
                <CardDescription>תיאור מוצר קשור</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/store/product/related-3">צפה במוצר</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* CTA */}
        <Section className="py-12 bg-gradient-to-r from-aegis-blue to-aegis-graphite text-white">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              יש לך שאלות על המוצר?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              המומחים שלנו יעזרו לך לבחור את המוצר המתאים ביותר
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/contact">
                  צור קשר עם מומחה
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-aegis-graphite">
                <Link href="/store">
                  חזור לחנות
                </Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
}
