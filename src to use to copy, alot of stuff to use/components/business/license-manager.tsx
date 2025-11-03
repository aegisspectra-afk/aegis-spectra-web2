'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Settings,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield
} from 'lucide-react';

interface License {
  id: string;
  name: string;
  type: 'basic' | 'pro' | 'business' | 'enterprise';
  status: 'active' | 'expired' | 'suspended' | 'trial';
  startDate: string;
  endDate: string;
  users: number;
  maxUsers: number;
  features: string[];
  price: number;
  billingCycle: 'monthly' | 'yearly';
  autoRenew: boolean;
  lastPayment: string;
  nextPayment: string;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoice: string;
  description: string;
}

const mockLicenses: License[] = [
  {
    id: '1',
    name: 'Aegis Spectra Pro',
    type: 'pro',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    users: 8,
    maxUsers: 10,
    features: ['Real-time Monitoring', 'Advanced Analytics', 'API Access'],
    price: 79,
    billingCycle: 'monthly',
    autoRenew: true,
    lastPayment: '2024-12-15',
    nextPayment: '2025-01-15'
  },
  {
    id: '2',
    name: 'Aegis Spectra Business',
    type: 'business',
    status: 'trial',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    users: 0,
    maxUsers: 50,
    features: ['Everything in Pro', 'Policy Management', 'Playbooks', 'Scheduler'],
    price: 199,
    billingCycle: 'monthly',
    autoRenew: false,
    lastPayment: '',
    nextPayment: '2025-01-31'
  }
];

const mockBillingHistory: BillingHistory[] = [
  {
    id: '1',
    date: '2024-12-15',
    amount: 79,
    status: 'paid',
    invoice: 'INV-2024-001',
    description: 'Aegis Spectra Pro - Monthly'
  },
  {
    id: '2',
    date: '2024-11-15',
    amount: 79,
    status: 'paid',
    invoice: 'INV-2024-002',
    description: 'Aegis Spectra Pro - Monthly'
  },
  {
    id: '3',
    date: '2024-10-15',
    amount: 79,
    status: 'paid',
    invoice: 'INV-2024-003',
    description: 'Aegis Spectra Pro - Monthly'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-600 bg-green-100';
    case 'expired': return 'text-red-600 bg-red-100';
    case 'suspended': return 'text-orange-600 bg-orange-100';
    case 'trial': return 'text-blue-600 bg-blue-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return <CheckCircle className="h-4 w-4" />;
    case 'expired': return <AlertTriangle className="h-4 w-4" />;
    case 'suspended': return <Clock className="h-4 w-4" />;
    case 'trial': return <Clock className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'basic': return 'text-gray-600 bg-gray-100';
    case 'pro': return 'text-blue-600 bg-blue-100';
    case 'business': return 'text-purple-600 bg-purple-100';
    case 'enterprise': return 'text-indigo-600 bg-indigo-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export function LicenseManager() {
  const [licenses, setLicenses] = useState<License[]>(mockLicenses);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>(mockBillingHistory);
  const [activeTab, setActiveTab] = useState('licenses');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleRenewLicense = (licenseId: string) => {
    // In a real app, this would call the API
    console.log('Renewing license:', licenseId);
  };

  const handleCancelLicense = (licenseId: string) => {
    // In a real app, this would call the API
    console.log('Cancelling license:', licenseId);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    // In a real app, this would download the invoice
    console.log('Downloading invoice:', invoiceId);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="licenses">Licenses</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="licenses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-heading font-semibold">License Management</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add License
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {licenses.map((license) => (
              <Card key={license.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {license.name}
                        <Badge className={getTypeColor(license.type)}>
                          {license.type.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {formatDate(license.startDate)} - {formatDate(license.endDate)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(license.status)}>
                        {getStatusIcon(license.status)}
                        <span className="ml-1">{license.status}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Usage Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Users</Label>
                      <div className="text-2xl font-bold">
                        {license.users} / {license.maxUsers}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(license.users / license.maxUsers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Price</Label>
                      <div className="text-2xl font-bold">
                        {formatCurrency(license.price)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        per {license.billingCycle}
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <Label className="text-sm text-muted-foreground">Features</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {license.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Expiry Warning */}
                  {license.status === 'active' && getDaysUntilExpiry(license.endDate) <= 30 && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2 text-orange-800">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          License expires in {getDaysUntilExpiry(license.endDate)} days
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    {license.status === 'active' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleRenewLicense(license.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Renew
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-heading font-semibold">Billing History</h2>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Date</th>
                      <th className="text-left p-4">Description</th>
                      <th className="text-left p-4">Amount</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Invoice</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingHistory.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">{formatDate(item.date)}</td>
                        <td className="p-4">{item.description}</td>
                        <td className="p-4 font-semibold">{formatCurrency(item.amount)}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadInvoice(item.invoice)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {item.invoice}
                          </Button>
                        </td>
                        <td className="p-4">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <h2 className="text-2xl font-heading font-semibold">Billing Settings</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
                <CardDescription>
                  Manage your payment methods and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/26</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Billing Preferences
                </CardTitle>
                <CardDescription>
                  Configure your billing and renewal preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-renewal</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically renew licenses before expiry
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive billing and renewal notifications
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}