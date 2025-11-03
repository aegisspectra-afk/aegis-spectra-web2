'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider, RadioGroup, RadioGroupItem } from '@/components/ui';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useCart } from '@/contexts/cart-context';
import { fmtIls } from '@/utils/currency';
import { toast } from 'sonner';
import { 
  ArrowRight, 
  ShoppingCart, 
  Package, 
  Wrench, 
  Zap, 
  Wifi,
  HardDrive,
  Shield,
  Eye,
  Home,
  Check,
  ArrowLeft
} from 'lucide-react';

// Product data with dynamic pricing options
const dynamicProducts = {
  'ethernet-cable-cat6': {
    id: 'ethernet-cable-cat6',
    name: 'כבל Ethernet Cat6',
    description: 'כבל רשת איכותי לתקשורת מהירה',
    basePrice: 2, // Base price per meter (realistic price)
    minLength: 1,
    maxLength: 100,
    defaultLength: 25,
    unit: 'מטר',
    category: 'networking',
    features: [
      'תמיכה ב-Gigabit Ethernet',
      'עמידות גבוהה',
      'איכות תעשייתית',
      'תמיכה ב-PoE'
    ],
    specifications: [
      { label: 'קטגוריה', value: 'Cat6' },
      { label: 'מהירות', value: 'עד 1 Gbps' },
      { label: 'תמיכה ב-PoE', value: 'כן' },
      { label: 'עמידות', value: 'IP67' }
    ],
    image: '/api/placeholder/600/400',
    inStock: true
  },
  'poe-switch-4-8-16': {
    id: 'poe-switch-4-8-16',
    name: 'PoE Switch',
    description: 'מתג רשת עם אספקת חשמל',
    basePrice: 299, // Base price for 4 ports
    portOptions: [
      { ports: 4, price: 299, name: '4 פורטים' },
      { ports: 8, price: 499, name: '8 פורטים' },
      { ports: 16, price: 899, name: '16 פורטים' }
    ],
    defaultPorts: 4,
    category: 'networking',
    features: [
      'אספקת חשמל PoE+ (עד 30W לפורט)',
      'ניהול מתקדם עם Web Interface',
      'תמיכה ב-VLAN ו-QoS',
      'ניטור רשת בזמן אמת',
      'איכות תעשייתית - רמת Tenda/TP-Link'
    ],
    specifications: [
      { label: 'סטנדרט', value: 'IEEE 802.3af/at' },
      { label: 'מהירות', value: '10/100/1000 Mbps' },
      { label: 'הספק PoE', value: 'עד 30W לפורט' },
      { label: 'ניהול', value: 'Web Interface' }
    ],
    image: '/api/placeholder/600/400',
    inStock: true
  },
  'nvr-4-8-16-channels': {
    id: 'nvr-4-8-16-channels',
    name: 'NVR Recorder',
    description: 'מקליט וידאו רשת מתקדם',
    basePrice: 599, // Base price for 4 channels
    channelOptions: [
      { channels: 4, price: 599, name: '4 ערוצים' },
      { channels: 8, price: 999, name: '8 ערוצים' },
      { channels: 16, price: 1599, name: '16 ערוצים' }
    ],
    defaultChannels: 4,
    category: 'nvr-storage',
    features: [
      'הקלטה 4K',
      'אחסון עד 6TB',
      'אפליקציה לנייד',
      'הקלטה רציפה 24/7'
    ],
    specifications: [
      { label: 'רזולוציה', value: 'עד 4K' },
      { label: 'אחסון', value: 'עד 6TB' },
      { label: 'חיבור', value: 'Ethernet + WiFi' },
      { label: 'אפליקציה', value: 'iOS + Android' }
    ],
    image: '/api/placeholder/600/400',
    inStock: true
  },
  'camera-bullet-varifocal': {
    id: 'camera-bullet-varifocal',
    name: 'מצלמת Bullet Varifocal',
    description: 'מצלמת אבטחה עם זום אופטי',
    basePrice: 450,
    lensOptions: [
      { lens: '2.8-12mm', price: 450, name: '2.8-12mm' },
      { lens: '5-50mm', price: 650, name: '5-50mm' },
      { lens: '8-80mm', price: 850, name: '8-80mm' }
    ],
    defaultLens: '2.8-12mm',
    category: 'cameras',
    features: [
      'זום אופטי מתכוונן',
      'ראיית לילה IR',
      'רזולוציה 4MP',
      'עמידות IP67'
    ],
    specifications: [
      { label: 'רזולוציה', value: '4MP (2560×1440)' },
      { label: 'זום אופטי', value: 'מתכוונן' },
      { label: 'ראיית לילה', value: 'IR עד 50 מטר' },
      { label: 'עמידות', value: 'IP67' }
    ],
    image: '/api/placeholder/600/400',
    inStock: true
  }
};

const getCategoryIcon = (category: string) => {
  const icons: { [key: string]: any } = {
    'cameras': Package,
    'networking': Wifi,
    'nvr-storage': HardDrive,
    'access-control': Shield,
    'alarm-sensors': Eye,
    'tools': Wrench,
    'power-backup': Zap,
    'maintenance': Wrench,
    'smart-home': Home
  };
  return icons[category] || Package;
};

export default function DynamicProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const [currentPrice, setCurrentPrice] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (productId && dynamicProducts[productId as keyof typeof dynamicProducts]) {
      const foundProduct = dynamicProducts[productId as keyof typeof dynamicProducts];
      setProduct(foundProduct);
      
      // Set default options
      if (foundProduct.basePrice && 'defaultLength' in foundProduct) {
        setSelectedOptions({ length: foundProduct.defaultLength });
        // Use the same pricing logic for default price
        const length = foundProduct.defaultLength;
        let pricePerMeter = foundProduct.basePrice;
        if (length >= 50) {
          pricePerMeter = 1.5;
        } else if (length >= 20) {
          pricePerMeter = 1.8;
        } else if (length >= 10) {
          pricePerMeter = 2.2;
        } else {
          pricePerMeter = 2.5;
        }
        setCurrentPrice(pricePerMeter * length);
      } else if ('portOptions' in foundProduct) {
        const defaultOption = foundProduct.portOptions.find((opt: any) => opt.ports === foundProduct.defaultPorts);
        setSelectedOptions({ ports: foundProduct.defaultPorts });
        setCurrentPrice(defaultOption?.price || foundProduct.basePrice);
      } else if ('channelOptions' in foundProduct) {
        const defaultOption = foundProduct.channelOptions.find((opt: any) => opt.channels === foundProduct.defaultChannels);
        setSelectedOptions({ channels: foundProduct.defaultChannels });
        setCurrentPrice(defaultOption?.price || foundProduct.basePrice);
      } else if ('lensOptions' in foundProduct) {
        const defaultOption = foundProduct.lensOptions.find((opt: any) => opt.lens === foundProduct.defaultLens);
        setSelectedOptions({ lens: foundProduct.defaultLens });
        setCurrentPrice(defaultOption?.price || foundProduct.basePrice);
      } else {
        setCurrentPrice(foundProduct.basePrice);
      }
      
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [productId]);

  const handleLengthChange = (value: number[]) => {
    const length = value[0];
    setSelectedOptions({ ...selectedOptions, length });
    
    // Bulk pricing - cheaper per meter for longer cables
    let pricePerMeter = product.basePrice;
    if (length >= 50) {
      pricePerMeter = 1.5; // ₪1.5 per meter for 50+ meters
    } else if (length >= 20) {
      pricePerMeter = 1.8; // ₪1.8 per meter for 20+ meters
    } else if (length >= 10) {
      pricePerMeter = 2.2; // ₪2.2 per meter for 10+ meters
    } else {
      pricePerMeter = 2.5; // ₪2.5 per meter for short lengths
    }
    
    setCurrentPrice(pricePerMeter * length);
  };

  const handlePortChange = (value: string) => {
    const ports = parseInt(value);
    const option = (product as any).portOptions?.find((opt: any) => opt.ports === ports);
    setSelectedOptions({ ...selectedOptions, ports });
    setCurrentPrice(option?.price || product.basePrice);
  };

  const handleChannelChange = (value: string) => {
    const channels = parseInt(value);
    const option = (product as any).channelOptions?.find((opt: any) => opt.channels === channels);
    setSelectedOptions({ ...selectedOptions, channels });
    setCurrentPrice(option?.price || product.basePrice);
  };

  const handleLensChange = (lens: string) => {
    const option = (product as any).lensOptions?.find((opt: any) => opt.lens === lens);
    setSelectedOptions({ ...selectedOptions, lens });
    setCurrentPrice(option?.price || product.basePrice);
  };

  const handleAddToCart = () => {
    if (!product) return;

    let productName = product.name;
    const productDescription = product.description;

    // Add selected options to product name
    if (selectedOptions.length) {
      productName += ` (${selectedOptions.length} ${product.unit})`;
    }
    if (selectedOptions.ports) {
      productName += ` (${selectedOptions.ports} פורטים)`;
    }
    if (selectedOptions.channels) {
      productName += ` (${selectedOptions.channels} ערוצים)`;
    }
    if (selectedOptions.lens) {
      productName += ` (${selectedOptions.lens})`;
    }

    addToCart({
      id: `${product.id}-${JSON.stringify(selectedOptions)}`,
      name: productName,
      price: currentPrice,
      quantity: 1,
      image: product.image
    });

    setAddedToCart(true);
    toast.success(`${productName} נוסף לעגלה!`);
    
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aegis-blue mx-auto"></div>
              <p className="mt-4 text-muted-foreground">טוען מוצר...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">מוצר לא נמצא</h1>
              <Button onClick={() => router.push('/builder')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                חזור לבונה החבילות
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(product.category);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 mb-8 text-sm text-muted-foreground">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  // Save current state to localStorage before going back
                  const builderState = {
                    currentStep: 2, // Always go back to step 2 (equipment selection)
                    selectedCategory: 'all',
                    timestamp: Date.now(),
                    returnFromProduct: true, // Flag to indicate we're returning from a product page
                    preserveState: true // Keep the selected plan and other state
                  };
                  localStorage.setItem('aegis-builder-state', JSON.stringify(builderState));
                  console.log('Saved builder state:', builderState);
                  router.push('/builder');
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                בונה חבילות
              </Button>
              <span>/</span>
              <span>{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div>
                <Card>
                  <CardContent className="p-6">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CategoryIcon className="h-5 w-5 text-aegis-blue" />
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                  <p className="text-muted-foreground text-lg mb-6">{product.description}</p>
                  
                  {/* Dynamic Price Display */}
                  <div className="bg-aegis-graphite/10 p-4 rounded-lg mb-6">
                    <div className="text-3xl font-bold text-aegis-blue">
                      {fmtIls(currentPrice)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      מחיר סופי כולל מע"מ
                    </div>
                  </div>
                </div>

                {/* Configuration Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wrench className="h-5 w-5 mr-2" />
                      התאמת המוצר
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Length Slider for Cables */}
                    {product.basePrice && product.minLength && product.maxLength && (
                      <div>
                        <Label className="text-base font-medium mb-4 block">
                          אורך הכבל: {selectedOptions.length} {product.unit}
                          {selectedOptions.length && (
                            <span className="text-sm text-muted-foreground block mt-1">
                              מחיר למטר: {(() => {
                                const length = selectedOptions.length;
                                if (length >= 50) return '₪1.5';
                                if (length >= 20) return '₪1.8';
                                if (length >= 10) return '₪2.2';
                                return '₪2.5';
                              })()}
                            </span>
                          )}
                        </Label>
                        <Slider
                          value={[selectedOptions.length || product.defaultLength]}
                          onValueChange={handleLengthChange}
                          min={product.minLength}
                          max={product.maxLength}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-2" dir="ltr">
                          <span>{product.minLength} {product.unit}</span>
                          <span>{product.maxLength} {product.unit}</span>
                        </div>
                      </div>
                    )}

                    {/* Port Selection for Switches */}
                    {product.portOptions && (
                      <div>
                        <Label className="text-base font-medium mb-4 block">
                          מספר פורטים
                        </Label>
                        <RadioGroup
                          value={selectedOptions.ports?.toString()}
                          onValueChange={handlePortChange}
                          className="space-y-3"
                        >
                          {product.portOptions.map((option: any) => (
                            <div key={option.ports} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.ports.toString()} id={`port-${option.ports}`} />
                              <Label htmlFor={`port-${option.ports}`} className="flex-1 cursor-pointer">
                                <div className="flex justify-between items-center">
                                  <span>{option.name}</span>
                                  <span className="font-medium">{fmtIls(option.price)}</span>
                                </div>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}

                    {/* Channel Selection for NVR */}
                    {product.channelOptions && (
                      <div>
                        <Label className="text-base font-medium mb-4 block">
                          מספר ערוצים
                        </Label>
                        <RadioGroup
                          value={selectedOptions.channels?.toString()}
                          onValueChange={handleChannelChange}
                          className="space-y-3"
                        >
                          {product.channelOptions.map((option: any) => (
                            <div key={option.channels} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.channels.toString()} id={`channel-${option.channels}`} />
                              <Label htmlFor={`channel-${option.channels}`} className="flex-1 cursor-pointer">
                                <div className="flex justify-between items-center">
                                  <span>{option.name}</span>
                                  <span className="font-medium">{fmtIls(option.price)}</span>
                                </div>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}

                    {/* Lens Selection for Cameras */}
                    {product.lensOptions && (
                      <div>
                        <Label className="text-base font-medium mb-4 block">
                          סוג עדשה
                        </Label>
                        <RadioGroup
                          value={selectedOptions.lens}
                          onValueChange={handleLensChange}
                          className="space-y-3"
                        >
                          {product.lensOptions.map((option: any) => (
                            <div key={option.lens} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.lens} id={`lens-${option.lens}`} />
                              <Label htmlFor={`lens-${option.lens}`} className="flex-1 cursor-pointer">
                                <div className="flex justify-between items-center">
                                  <span>{option.name}</span>
                                  <span className="font-medium">{fmtIls(option.price)}</span>
                                </div>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
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
                </div>
              </div>
            </div>

            {/* Product Features and Specifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>תכונות עיקריות</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle>מפרטים טכניים</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {product.specifications?.map((spec: any, index: number) => (
                      <div key={index} className="flex justify-between py-2 border-b border-border/50">
                        <span className="font-medium">{spec.label}:</span>
                        <span className="text-foreground/70">{spec.value}</span>
                      </div>
                    )) || (
                      <div className="text-center text-muted-foreground">
                        אין מפרטים טכניים זמינים
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
