'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Key, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Plus
} from 'lucide-react';

interface SecurityConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  status: 'active' | 'warning' | 'error' | 'disabled';
  lastUpdated: string;
  category: 'encryption' | 'audit' | 'secrets' | 'access';
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  status: 'success' | 'failed' | 'warning';
  details: string;
}

const mockSecurityConfigs: SecurityConfig[] = [
  {
    id: '1',
    name: 'AES-256 Encryption at Rest',
    description: 'Encrypt all data stored in the database using AES-256',
    enabled: true,
    status: 'active',
    lastUpdated: '2025-01-15T10:30:00Z',
    category: 'encryption'
  },
  {
    id: '2',
    name: 'TLS 1.3 for Data in Transit',
    description: 'Use TLS 1.3 for all data transmission',
    enabled: true,
    status: 'active',
    lastUpdated: '2025-01-15T10:30:00Z',
    category: 'encryption'
  },
  {
    id: '3',
    name: 'Audit Logging',
    description: 'Log all user actions and system events',
    enabled: true,
    status: 'active',
    lastUpdated: '2025-01-15T10:30:00Z',
    category: 'audit'
  },
  {
    id: '4',
    name: 'Secrets Management',
    description: 'Store API keys and certificates in secure vault',
    enabled: false,
    status: 'warning',
    lastUpdated: '2025-01-15T10:30:00Z',
    category: 'secrets'
  },
  {
    id: '5',
    name: 'Multi-Factor Authentication',
    description: 'Require MFA for all administrative accounts',
    enabled: true,
    status: 'active',
    lastUpdated: '2025-01-15T10:30:00Z',
    category: 'access'
  },
  {
    id: '6',
    name: 'Session Timeout',
    description: 'Automatically log out inactive users after 30 minutes',
    enabled: true,
    status: 'active',
    lastUpdated: '2025-01-15T10:30:00Z',
    category: 'access'
  }
];

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: '2025-01-15T14:30:00Z',
    user: 'admin@aegis-spectra.com',
    action: 'LOGIN',
    resource: 'Authentication System',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Successful login from trusted IP'
  },
  {
    id: '2',
    timestamp: '2025-01-15T14:25:00Z',
    user: 'john.doe@company.com',
    action: 'FILE_DOWNLOAD',
    resource: 'Security Report - January 2025.pdf',
    ip: '192.168.1.101',
    status: 'success',
    details: 'Downloaded security report'
  },
  {
    id: '3',
    timestamp: '2025-01-15T14:20:00Z',
    user: 'admin@aegis-spectra.com',
    action: 'CONFIG_UPDATE',
    resource: 'Security Settings',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Updated encryption settings'
  },
  {
    id: '4',
    timestamp: '2025-01-15T14:15:00Z',
    user: 'unknown',
    action: 'LOGIN_ATTEMPT',
    resource: 'Authentication System',
    ip: '203.0.113.1',
    status: 'failed',
    details: 'Failed login attempt with invalid credentials'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-600 bg-green-100';
    case 'warning': return 'text-yellow-600 bg-yellow-100';
    case 'error': return 'text-red-600 bg-red-100';
    case 'disabled': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return <CheckCircle className="h-4 w-4" />;
    case 'warning': return <AlertTriangle className="h-4 w-4" />;
    case 'error': return <AlertTriangle className="h-4 w-4" />;
    case 'disabled': return <Settings className="h-4 w-4" />;
    default: return <Settings className="h-4 w-4" />;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'encryption': return <Lock className="h-4 w-4" />;
    case 'audit': return <FileText className="h-4 w-4" />;
    case 'secrets': return <Key className="h-4 w-4" />;
    case 'access': return <Shield className="h-4 w-4" />;
    default: return <Settings className="h-4 w-4" />;
  }
};

export function SecurityHardening() {
  const [configs, setConfigs] = useState<SecurityConfig[]>(mockSecurityConfigs);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [activeTab, setActiveTab] = useState('overview');

  const handleToggleConfig = (configId: string) => {
    setConfigs(prev => prev.map(config => 
      config.id === configId 
        ? { ...config, enabled: !config.enabled, lastUpdated: new Date().toISOString() }
        : config
    ));
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getLogStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="encryption">Encryption</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="secrets">Secrets</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                    <p className="text-2xl font-bold text-green-600">85%</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Policies</p>
                    <p className="text-2xl font-bold text-blue-600">12</p>
                  </div>
                  <Settings className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Audit Events</p>
                    <p className="text-2xl font-bold text-purple-600">1,247</p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Secrets Stored</p>
                    <p className="text-2xl font-bold text-orange-600">8</p>
                  </div>
                  <Key className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Recommendations</CardTitle>
                <CardDescription>
                  Actions to improve your security posture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Enable Secrets Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Store API keys and certificates in a secure vault
                    </p>
                    <Button size="sm" className="mt-2">
                      Enable Now
                    </Button>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Encryption at Rest</h4>
                    <p className="text-sm text-muted-foreground">
                      All data is encrypted using AES-256
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
                <CardDescription>
                  Latest security-related activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {auditLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${getLogStatusColor(log.status)}`}>
                      {log.status === 'success' ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{log.action}</p>
                      <p className="text-xs text-muted-foreground truncate">{log.details}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(log.timestamp)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="encryption" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-heading font-semibold">Encryption Settings</h2>
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Keys
            </Button>
          </div>

          <div className="space-y-4">
            {configs.filter(config => config.category === 'encryption').map((config) => (
              <Card key={config.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-blue-100">
                        {getCategoryIcon(config.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{config.name}</h3>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last updated: {formatTimestamp(config.lastUpdated)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(config.status)}>
                        {getStatusIcon(config.status)}
                        <span className="ml-1">{config.status}</span>
                      </Badge>
                      <Switch
                        checked={config.enabled}
                        onCheckedChange={() => handleToggleConfig(config.id)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-heading font-semibold">Audit Logs</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Timestamp</th>
                      <th className="text-left p-4">User</th>
                      <th className="text-left p-4">Action</th>
                      <th className="text-left p-4">Resource</th>
                      <th className="text-left p-4">IP Address</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-muted/50">
                        <td className="p-4 text-sm">{formatTimestamp(log.timestamp)}</td>
                        <td className="p-4 text-sm">{log.user}</td>
                        <td className="p-4 text-sm font-medium">{log.action}</td>
                        <td className="p-4 text-sm">{log.resource}</td>
                        <td className="p-4 text-sm">{log.ip}</td>
                        <td className="p-4">
                          <Badge className={getLogStatusColor(log.status)}>
                            {log.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="secrets" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-heading font-semibold">Secrets Management</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Secret
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  API Keys
                </CardTitle>
                <CardDescription>Manage API keys and tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Stripe API Key</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">PayPal API Key</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">VirusTotal API</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Database Credentials
                </CardTitle>
                <CardDescription>Database connection secrets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Main Database</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Analytics DB</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Certificates
                </CardTitle>
                <CardDescription>SSL/TLS certificates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SSL Certificate</span>
                    <Badge className="text-green-600 bg-green-100">Valid</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Code Signing</span>
                    <Badge className="text-green-600 bg-green-100">Valid</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}