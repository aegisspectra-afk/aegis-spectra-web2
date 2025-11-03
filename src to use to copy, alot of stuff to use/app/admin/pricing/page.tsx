'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  DollarSign, 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  equipmentUsd: number;
  installUsd: number;
  markupPct: number;
  finalUsd: number;
  active: boolean;
}

interface Plan {
  id: string;
  code: string;
  name: string;
  monthlyUsd: number;
  yearlyUsd: number;
  active: boolean;
}

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'IP Camera – Basic (1080p)',
    category: 'cameras',
    description: '1080p HD IP camera with night vision',
    equipmentUsd: 180,
    installUsd: 70,
    markupPct: 40,
    finalUsd: 250,
    active: true
  },
  {
    id: '2',
    title: 'IP Camera – Pro (4K + AI)',
    category: 'cameras',
    description: '4K IP camera with AI detection and PTZ',
    equipmentUsd: 350,
    installUsd: 100,
    markupPct: 40,
    finalUsd: 450,
    active: true
  },
  {
    id: '3',
    title: 'DVR – 8CH (2TB)',
    category: 'recorders',
    description: '8-channel DVR with 2TB storage',
    equipmentUsd: 420,
    installUsd: 120,
    markupPct: 40,
    finalUsd: 540,
    active: true
  },
  {
    id: '4',
    title: 'NVR 4CH + 1TB (Home)',
    category: 'recorders',
    description: '4-channel NVR with 1TB storage for home use',
    equipmentUsd: 250,
    installUsd: 80,
    markupPct: 40,
    finalUsd: 330,
    active: true
  },
  {
    id: '5',
    title: 'NVR 32CH + 8TB (Enterprise)',
    category: 'recorders',
    description: '32-channel enterprise NVR with 8TB storage',
    equipmentUsd: 1500,
    installUsd: 300,
    markupPct: 40,
    finalUsd: 1800,
    active: true
  },
  {
    id: '6',
    title: 'IP Dome Camera – Indoor (2K)',
    category: 'cameras',
    description: '2K indoor dome camera with 360° coverage',
    equipmentUsd: 160,
    installUsd: 60,
    markupPct: 40,
    finalUsd: 220,
    active: true
  },
  {
    id: '7',
    title: 'Smoke / Motion Sensors',
    category: 'sensors',
    description: 'Wireless smoke and motion detection sensors',
    equipmentUsd: 85,
    installUsd: 35,
    markupPct: 40,
    finalUsd: 120,
    active: true
  },
  {
    id: '8',
    title: 'Keypad Entry System',
    category: 'access',
    description: 'Digital keypad entry system with access codes',
    equipmentUsd: 300,
    installUsd: 100,
    markupPct: 40,
    finalUsd: 400,
    active: true
  },
  {
    id: '9',
    title: 'Smart Doorbell (Video + Intercom)',
    category: 'access',
    description: 'Video doorbell with two-way intercom and mobile app',
    equipmentUsd: 220,
    installUsd: 80,
    markupPct: 40,
    finalUsd: 300,
    active: true
  }
];

const mockPlans: Plan[] = [
  {
    id: '1',
    code: 'basic',
    name: 'Basic',
    monthlyUsd: 29,
    yearlyUsd: 290,
    active: true
  },
  {
    id: '2',
    code: 'pro',
    name: 'Pro',
    monthlyUsd: 79,
    yearlyUsd: 853, // 10% discount
    active: true
  },
  {
    id: '3',
    code: 'business',
    name: 'Business',
    monthlyUsd: 199,
    yearlyUsd: 2149, // 10% discount
    active: true
  }
];

export default function AdminPricingPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [globalMarkup, setGlobalMarkup] = useState(40);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [activeTab, setActiveTab] = useState('products');

  const calculateFinalPrice = (equipment: number, install: number, markup: number) => {
    return Math.round((equipment * (1 + markup / 100) + install) * 100) / 100;
  };

  const handleProductEdit = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleProductSave = () => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id ? editingProduct : p
      ));
      setEditingProduct(null);
    }
  };

  const handlePlanEdit = (plan: Plan) => {
    setEditingPlan({ ...plan });
  };

  const handlePlanSave = () => {
    if (editingPlan) {
      setPlans(prev => prev.map(p => 
        p.id === editingPlan.id ? editingPlan : p
      ));
      setEditingPlan(null);
    }
  };

  const handleGlobalMarkupChange = (newMarkup: number) => {
    setGlobalMarkup(newMarkup);
    // Apply to all products
    setProducts(prev => prev.map(p => ({
      ...p,
      markupPct: newMarkup,
      finalUsd: calculateFinalPrice(p.equipmentUsd, p.installUsd, newMarkup)
    })));
  };

  const toggleProductActive = (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, active: !p.active } : p
    ));
  };

  const togglePlanActive = (planId: string) => {
    setPlans(prev => prev.map(p => 
      p.id === planId ? { ...p, active: !p.active } : p
    ));
  };

  return (
    <DashboardLayout requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Pricing Management</h1>
          <p className="text-muted-foreground">
            Manage products, plans, and pricing settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="markup">Markup</TabsTrigger>
            <TabsTrigger value="bundles">Bundles</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-semibold">Product Catalog</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{product.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={product.active ? 'default' : 'secondary'}>
                          {product.active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleProductActive(product.id)}
                        >
                          {product.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Equipment (USD)</Label>
                        <div className="text-lg font-semibold">${product.equipmentUsd}</div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Installation (USD)</Label>
                        <div className="text-lg font-semibold">${product.installUsd}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Markup</Label>
                        <div className="text-lg font-semibold">{product.markupPct}%</div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Final Price</Label>
                        <div className="text-lg font-semibold text-aegis-teal">${product.finalUsd}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleProductEdit(product)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Recalculate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-semibold">SaaS Plans</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Plan
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <Badge variant={plan.active ? 'default' : 'secondary'}>
                        {plan.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Monthly (USD)</Label>
                      <div className="text-2xl font-bold text-aegis-teal">${plan.monthlyUsd}</div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Yearly (USD)</Label>
                      <div className="text-2xl font-bold text-aegis-teal">${plan.yearlyUsd}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePlanEdit(plan)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => togglePlanActive(plan.id)}
                      >
                        {plan.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="markup" className="space-y-6">
            <h2 className="text-2xl font-heading font-semibold">Global Markup Settings</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Markup Configuration
                </CardTitle>
                <CardDescription>
                  Set global markup percentage for all products
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="global-markup">Global Markup (%)</Label>
                  <Input
                    id="global-markup"
                    type="number"
                    value={globalMarkup}
                    onChange={(e) => setGlobalMarkup(Number(e.target.value))}
                    className="w-32"
                  />
                  <Button onClick={() => handleGlobalMarkupChange(globalMarkup)}>
                    <Save className="h-4 w-4 mr-2" />
                    Apply to All
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  This will recalculate all product prices with the new markup percentage.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Markup Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>• Equipment: Markup applied to base cost</div>
                  <div>• Installation: Usually no markup (labor cost)</div>
                  <div>• Recommended range: 40-60% for equipment</div>
                  <div>• Higher markup for specialized/rare items</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bundles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-semibold">Product Bundles</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Bundle
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Bundles Created</h3>
                  <p className="text-muted-foreground mb-4">
                    Create product bundles to offer discounted packages
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Bundle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Edit Product</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Product Title</Label>
                  <Input
                    id="title"
                    value={editingProduct.title}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, title: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="equipment">Equipment Price (USD)</Label>
                  <Input
                    id="equipment"
                    type="number"
                    value={editingProduct.equipmentUsd}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, equipmentUsd: Number(e.target.value) } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="install">Installation Price (USD)</Label>
                  <Input
                    id="install"
                    type="number"
                    value={editingProduct.installUsd}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, installUsd: Number(e.target.value) } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="markup">Markup (%)</Label>
                  <Input
                    id="markup"
                    type="number"
                    value={editingProduct.markupPct}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, markupPct: Number(e.target.value) } : null)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleProductSave} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setEditingProduct(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Plan Modal */}
        {editingPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Edit Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="plan-name">Plan Name</Label>
                  <Input
                    id="plan-name"
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="monthly">Monthly Price (USD)</Label>
                  <Input
                    id="monthly"
                    type="number"
                    value={editingPlan.monthlyUsd}
                    onChange={(e) => setEditingPlan(prev => prev ? { ...prev, monthlyUsd: Number(e.target.value) } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="yearly">Yearly Price (USD)</Label>
                  <Input
                    id="yearly"
                    type="number"
                    value={editingPlan.yearlyUsd}
                    onChange={(e) => setEditingPlan(prev => prev ? { ...prev, yearlyUsd: Number(e.target.value) } : null)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handlePlanSave} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setEditingPlan(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}