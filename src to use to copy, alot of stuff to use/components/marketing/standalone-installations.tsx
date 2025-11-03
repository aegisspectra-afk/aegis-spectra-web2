'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Check, 
  Star, 
  Camera, 
  HardDrive, 
  Wifi, 
  Shield, 
  Zap,
  Wrench,
  Calculator,
  ShoppingCart,
  ExternalLink,
  Plus,
  Minus
} from 'lucide-react';
import { toast } from 'sonner';

interface InstallationItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  installationFee: number;
  category: 'cameras' | 'storage' | 'networking' | 'access' | 'alarm' | 'power';
  features: string[];
  image: string;
}

const installationItems: InstallationItem[] = [
  {
    id: 'ip-camera-basic',
    name: 'IP Camera - Basic',
    description: '1080p HD IP camera with night vision',
    basePrice: 150,
    installationFee: 50,
    category: 'cameras',
    features: ['1080p HD', 'Night Vision', 'Weather Resistant', 'Motion Detection'],
    image: 'camera'
  },
  {
    id: 'ip-camera-pro',
    name: 'IP Camera - Professional',
    description: '4K IP camera with AI detection and PTZ',
    basePrice: 300,
    installationFee: 75,
    category: 'cameras',
    features: ['4K Resolution', 'AI Detection', 'PTZ Control', 'Weather Resistant'],
    image: 'camera'
  },
  {
    id: 'dvr-8ch',
    name: 'DVR System - 8 Channel',
    description: '8-channel DVR with 2TB storage',
    basePrice: 400,
    installationFee: 100,
    category: 'storage',
    features: ['8 Channels', '2TB Storage', 'Remote Access', 'Mobile App'],
    image: 'hard-drive'
  },
  {
    id: 'nvr-16ch',
    name: 'NVR System - 16 Channel',
    description: '16-channel NVR with 4TB storage and AI analytics',
    basePrice: 800,
    installationFee: 150,
    category: 'storage',
    features: ['16 Channels', '4TB Storage', 'AI Analytics', 'Cloud Backup'],
    image: 'monitor'
  },
  {
    id: 'access-control',
    name: 'Access Control System',
    description: 'Card reader access control with management software',
    basePrice: 500,
    installationFee: 200,
    category: 'access',
    features: ['Card Reader', 'Management Software', 'Time Zones', 'Audit Logs'],
    image: 'key'
  },
  {
    id: 'alarm-system',
    name: 'Alarm System',
    description: 'Wireless alarm system with sensors and monitoring',
    basePrice: 600,
    installationFee: 150,
    category: 'alarm',
    features: ['Wireless Sensors', '24/7 Monitoring', 'Mobile Alerts', 'Backup Battery'],
    image: 'bell'
  },
  {
    id: 'ups-1500va',
    name: 'UPS - 1500VA',
    description: 'Uninterruptible power supply for critical equipment',
    basePrice: 300,
    installationFee: 50,
    category: 'power',
    features: ['1500VA Capacity', 'Battery Backup', 'Surge Protection', 'LCD Display'],
    image: 'battery'
  },
  {
    id: 'network-switch',
    name: 'Network Switch - 24 Port',
    description: 'Managed network switch with PoE support',
    basePrice: 200,
    installationFee: 75,
    category: 'networking',
    features: ['24 Ports', 'PoE Support', 'Managed', 'Gigabit'],
    image: 'network'
  }
];

const categories = [
  { id: 'all', name: 'All Products', icon: 'shopping-cart' },
  { id: 'cameras', name: 'Cameras', icon: 'camera' },
  { id: 'storage', name: 'Storage', icon: 'hard-drive' },
  { id: 'networking', name: 'Networking', icon: 'network' },
  { id: 'access', name: 'Access Control', icon: 'key' },
  { id: 'alarm', name: 'Alarm Systems', icon: 'bell' },
  { id: 'power', name: 'Power & UPS', icon: 'battery' }
];

export function StandaloneInstallations() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [showCart, setShowCart] = useState(false);

  const filteredItems = selectedCategory === 'all' 
    ? installationItems 
    : installationItems.filter(item => item.category === selectedCategory);

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
    toast.success('Item added to cart!');
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = installationItems.find(i => i.id === itemId);
      if (item) {
        return total + ((item.basePrice + item.installationFee) * quantity);
      }
      return total;
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  const handleCheckout = () => {
    const cartItems = Object.entries(cart).map(([itemId, quantity]) => {
      const item = installationItems.find(i => i.id === itemId);
      return item ? { ...item, quantity } : null;
    }).filter(Boolean);

    const message = `Installation Request:\n\n${cartItems.map(item => 
      `${item?.name} x${item?.quantity} - $${((item?.basePrice || 0) + (item?.installationFee || 0)) * (item?.quantity || 0)}`
    ).join('\n')}\n\nTotal: $${getCartTotal()}`;
    
    window.location.href = `/contact?message=${encodeURIComponent(message)}`;
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-aegis-graphite/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold mb-6"
          >
            <span className="gradient-text">Standalone Installations</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Professional installation of security hardware and equipment
          </motion.p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <span>{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>

          {/* Cart Summary */}
          {getCartItemCount() > 0 && (
            <div className="mb-8 p-4 bg-aegis-teal/10 border border-aegis-teal/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-aegis-teal" />
                  <span className="font-semibold">
                    {getCartItemCount()} items in cart - ${getCartTotal()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCart(!showCart)}
                  >
                    {showCart ? 'Hide' : 'View'} Cart
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCheckout}
                    className="bg-aegis-teal hover:bg-aegis-teal/90"
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Cart Details */}
          {showCart && getCartItemCount() > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Shopping Cart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(cart).map(([itemId, quantity]) => {
                    const item = installationItems.find(i => i.id === itemId);
                    if (!item) return null;
                    
                    return (
                      <div key={itemId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{item.image}</span>
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              ${item.basePrice + item.installationFee} each
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(itemId)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToCart(itemId)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <span className="ml-4 font-semibold">
                            ${((item.basePrice + item.installationFee) * quantity)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${getCartTotal()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{item.image}</span>
                      <Badge variant="secondary">
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Features */}
                    <div>
                      <h4 className="font-semibold mb-2">Features:</h4>
                      <ul className="space-y-1 text-sm">
                        {item.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <Check className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Base Price:</span>
                        <span>${item.basePrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Installation:</span>
                        <span>${item.installationFee}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Total:</span>
                        <span>${item.basePrice + item.installationFee}</span>
                      </div>
                    </div>

                    {/* Add to Cart */}
                    <Button
                      className="w-full"
                      onClick={() => addToCart(item.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Installation Process */}
          <div className="mt-16">
            <h3 className="text-2xl font-heading font-semibold text-center mb-8">
              Professional Installation Process
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-aegis-teal/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">1</span>
                </div>
                <h4 className="font-semibold mb-2">Site Survey</h4>
                <p className="text-sm text-muted-foreground">
                  Professional assessment of your location and requirements
                </p>
              </div>
              
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-aegis-teal/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">2</span>
                </div>
                <h4 className="font-semibold mb-2">Equipment Delivery</h4>
                <p className="text-sm text-muted-foreground">
                  Secure delivery of all hardware and equipment
                </p>
              </div>
              
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-aegis-teal/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">3</span>
                </div>
                <h4 className="font-semibold mb-2">Professional Installation</h4>
                <p className="text-sm text-muted-foreground">
                  Certified technicians install and configure all equipment
                </p>
              </div>
              
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-aegis-teal/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">4</span>
                </div>
                <h4 className="font-semibold mb-2">Testing & Training</h4>
                <p className="text-sm text-muted-foreground">
                  System testing and user training for optimal operation
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-heading font-semibold mb-4">
              Ready to Secure Your Property?
            </h3>
            <p className="text-muted-foreground mb-6">
              Get a free consultation and custom quote for your security needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleCheckout}
                disabled={getCartItemCount() === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/contact?service=installation'}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Get Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}