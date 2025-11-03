'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Check, 
  Star, 
  Camera, 
  Brain, 
  Bell, 
  HardDrive, 
  Monitor, 
  FileText, 
  Wrench,
  Calculator,
  ShoppingCart,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface PackageConfig {
  cameras: number;
  aiDetection: 'basic' | 'advanced' | 'custom';
  alerts: 'basic' | 'advanced';
  storage: number; // in GB
  realTimeMonitoring: boolean;
  reports: 'basic' | 'advanced';
  installations: InstallationItem[];
}

interface InstallationItem {
  id: string;
  name: string;
  basePrice: number;
  installationFee: number;
  quantity: number;
}

const installationOptions = [
  { id: 'ip-camera', name: 'IP Camera', basePrice: 150, installationFee: 50 },
  { id: 'dvr-nvr', name: 'DVR/NVR System', basePrice: 300, installationFee: 100 },
  { id: 'sensors', name: 'Security Sensors', basePrice: 80, installationFee: 30 },
  { id: 'access-control', name: 'Access Control System', basePrice: 200, installationFee: 75 },
  { id: 'alarm-system', name: 'Alarm System', basePrice: 250, installationFee: 100 },
  { id: 'ups', name: 'UPS/Networking Gear', basePrice: 400, installationFee: 150 },
];

export function CustomPackageBuilder() {
  const [config, setConfig] = useState<PackageConfig>({
    cameras: 5,
    aiDetection: 'basic',
    alerts: 'basic',
    storage: 100,
    realTimeMonitoring: false,
    reports: 'basic',
    installations: []
  });

  const [pricing, setPricing] = useState({
    monthly: 0,
    yearly: 0,
    installationTotal: 0,
    total: 0
  });

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Calculate pricing based on configuration
  useEffect(() => {
    let basePrice = 0;
    
    // Base pricing by cameras
    if (config.cameras <= 5) {
      basePrice = 29; // Basic plan
    } else if (config.cameras <= 100) {
      basePrice = 79; // Pro plan
    } else {
      basePrice = 199; // Business plan
    }

    // AI Detection pricing
    const aiMultiplier = config.aiDetection === 'basic' ? 1 : 
                        config.aiDetection === 'advanced' ? 1.5 : 2;

    // Storage pricing (per 100GB)
    const storagePrice = Math.ceil(config.storage / 100) * 10;

    // Real-time monitoring
    const monitoringPrice = config.realTimeMonitoring ? 20 : 0;

    // Reports pricing
    const reportsPrice = config.reports === 'advanced' ? 15 : 0;

    // Alerts pricing
    const alertsPrice = config.alerts === 'advanced' ? 10 : 0;

    const monthlyPrice = Math.round((basePrice * aiMultiplier) + storagePrice + monitoringPrice + reportsPrice + alertsPrice);
    const yearlyPrice = Math.round(monthlyPrice * 12 * 0.9); // 10% discount for yearly

    // Installation total
    const installationTotal = config.installations.reduce((total, item) => 
      total + ((item.basePrice + item.installationFee) * item.quantity), 0
    );

    setPricing({
      monthly: monthlyPrice,
      yearly: yearlyPrice,
      installationTotal,
      total: (billingCycle === 'monthly' ? monthlyPrice : yearlyPrice) + installationTotal
    });
  }, [config, billingCycle]);

  const addInstallation = (item: typeof installationOptions[0]) => {
    const existingItem = config.installations.find(i => i.id === item.id);
    if (existingItem) {
      setConfig(prev => ({
        ...prev,
        installations: prev.installations.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        installations: [...prev.installations, { ...item, quantity: 1 }]
      }));
    }
  };

  const removeInstallation = (id: string) => {
    setConfig(prev => ({
      ...prev,
      installations: prev.installations.filter(i => i.id !== id)
    }));
  };

  const updateInstallationQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeInstallation(id);
      return;
    }
    setConfig(prev => ({
      ...prev,
      installations: prev.installations.map(i => 
        i.id === id ? { ...i, quantity } : i
      )
    }));
  };

  const handleContactSales = () => {
    const configString = JSON.stringify(config, null, 2);
    const message = `Custom Package Request:\n\n${configString}\n\nEstimated Price: $${pricing.total}`;
    window.location.href = `/contact?message=${encodeURIComponent(message)}`;
  };

  const handleAddToCart = () => {
    toast.success('Package added to cart!', {
      description: 'Proceeding to checkout...',
    });
    // Here you would integrate with your cart/checkout system
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
            <span className="gradient-text">Custom Package Builder</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Build your perfect security solution with our custom package builder
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="software" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="software">Software Features</TabsTrigger>
                <TabsTrigger value="hardware">Hardware Installations</TabsTrigger>
              </TabsList>

              <TabsContent value="software" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="h-5 w-5 mr-2" />
                      Camera Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="cameras">Number of Cameras</Label>
                      <Input
                        id="cameras"
                        type="number"
                        min="1"
                        max="1000"
                        value={config.cameras}
                        onChange={(e) => setConfig(prev => ({ ...prev, cameras: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="h-5 w-5 mr-2" />
                      AI Detection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={config.aiDetection} onValueChange={(value: 'basic' | 'advanced' | 'custom') => 
                      setConfig(prev => ({ ...prev, aiDetection: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic Detection</SelectItem>
                        <SelectItem value="advanced">Advanced AI</SelectItem>
                        <SelectItem value="custom">Custom AI Models</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Alerts & Monitoring
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="alerts">Alert Type</Label>
                      <Select value={config.alerts} onValueChange={(value: 'basic' | 'advanced') => 
                        setConfig(prev => ({ ...prev, alerts: value }))
                      }>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="monitoring">Real-time Monitoring</Label>
                      <Switch
                        id="monitoring"
                        checked={config.realTimeMonitoring}
                        onCheckedChange={(checked) => setConfig(prev => ({ ...prev, realTimeMonitoring: checked }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <HardDrive className="h-5 w-5 mr-2" />
                      Storage & Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="storage">Storage (GB)</Label>
                      <Input
                        id="storage"
                        type="number"
                        min="10"
                        max="10000"
                        value={config.storage}
                        onChange={(e) => setConfig(prev => ({ ...prev, storage: parseInt(e.target.value) || 10 }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reports">Report Type</Label>
                      <Select value={config.reports} onValueChange={(value: 'basic' | 'advanced') => 
                        setConfig(prev => ({ ...prev, reports: value }))
                      }>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="hardware" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wrench className="h-5 w-5 mr-2" />
                      Hardware Installations
                    </CardTitle>
                    <CardDescription>
                      Add hardware components with professional installation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {installationOptions.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              ${item.basePrice} + ${item.installationFee} installation
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addInstallation(item)}
                          >
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {config.installations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Selected Installations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {config.installations.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                ${item.basePrice + item.installationFee} each
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateInstallationQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateInstallationQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeInstallation(item.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Pricing Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Pricing Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Billing Cycle Toggle */}
                <div className="flex items-center justify-between">
                  <Label>Billing Cycle</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant={billingCycle === 'monthly' ? 'default' : 'outline'}
                      onClick={() => setBillingCycle('monthly')}
                    >
                      Monthly
                    </Button>
                    <Button
                      size="sm"
                      variant={billingCycle === 'yearly' ? 'default' : 'outline'}
                      onClick={() => setBillingCycle('yearly')}
                    >
                      Yearly
                    </Button>
                  </div>
                </div>

                {/* Software Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Software Package</span>
                    <span>${billingCycle === 'monthly' ? pricing.monthly : pricing.yearly}</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <div className="text-sm text-green-600">
                      Save ${(pricing.monthly * 12) - pricing.yearly} per year
                    </div>
                  )}
                </div>

                {/* Installation Pricing */}
                {pricing.installationTotal > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Hardware & Installation</span>
                      <span>${pricing.installationTotal}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      One-time cost
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${pricing.total}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {billingCycle === 'monthly' ? 'per month' : 'per year'} + installation
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={pricing.total === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleContactSales}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Contact Sales
                  </Button>
                </div>

                {/* Features Summary */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Package Includes:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      {config.cameras} cameras
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      {config.aiDetection} AI detection
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      {config.storage}GB storage
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      {config.alerts} alerts
                    </li>
                    {config.realTimeMonitoring && (
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-2" />
                        Real-time monitoring
                      </li>
                    )}
                    {config.installations.length > 0 && (
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-2" />
                        {config.installations.length} hardware items
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}