'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SecurityEvent {
  id: string;
  event: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  ip?: string;
  userAgent?: string;
  endpoint?: string;
  userId?: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

interface SecurityStats {
  totalEvents: number;
  criticalEvents: number;
  highEvents: number;
  mediumEvents: number;
  lowEvents: number;
  recentEvents: SecurityEvent[];
}

const severityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

const severityIcons = {
  low: CheckCircle,
  medium: AlertTriangle,
  high: AlertTriangle,
  critical: XCircle
};

export function SecurityDashboard() {
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    severity: '',
    event: '',
    search: '',
    page: 1
  });

  const fetchSecurityStats = async () => {
    try {
      const response = await fetch('/api/security/stats');
      if (!response.ok) throw new Error('Failed to fetch security stats');
      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      console.error('Error fetching security stats:', err);
    }
  };

  const fetchSecurityEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.severity) params.append('severity', filters.severity);
      if (filters.event) params.append('event', filters.event);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page.toString());
      params.append('limit', '20');

      const response = await fetch(`/api/security/audit?${params}`);
      if (!response.ok) throw new Error('Failed to fetch security events');
      const data = await response.json();
      setEvents(data.data.logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityStats();
    fetchSecurityEvents();
  }, [filters]);

  const handleRefresh = () => {
    fetchSecurityStats();
    fetchSecurityEvents();
  };

  const handleExportLogs = async () => {
    try {
      const response = await fetch('/api/security/audit/export');
      if (!response.ok) throw new Error('Failed to export logs');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-audit-logs-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error exporting logs:', err);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">לוח בקרת אבטחה</h1>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            רענן
          </Button>
          <Button onClick={handleExportLogs} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            ייצא לוגים
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Security Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">סה"כ אירועים</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">אירועים קריטיים</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.criticalEvents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">אירועים גבוהים</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.highEvents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">אירועים בינוניים</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.mediumEvents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">אירועים נמוכים</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.lowEvents}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            אירועי אבטחה אחרונים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="events">אירועים</TabsTrigger>
              <TabsTrigger value="filters">מסננים</TabsTrigger>
            </TabsList>
            
            <TabsContent value="filters" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">חומרה</label>
                  <Select value={filters.severity} onValueChange={(value) => setFilters(prev => ({ ...prev, severity: value, page: 1 }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר חומרה" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">כל החומרות</SelectItem>
                      <SelectItem value="critical">קריטי</SelectItem>
                      <SelectItem value="high">גבוה</SelectItem>
                      <SelectItem value="medium">בינוני</SelectItem>
                      <SelectItem value="low">נמוך</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">סוג אירוע</label>
                  <Input
                    placeholder="חיפוש סוג אירוע..."
                    value={filters.event}
                    onChange={(e) => setFilters(prev => ({ ...prev, event: e.target.value, page: 1 }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">חיפוש</label>
                  <Input
                    placeholder="חיפוש בהודעות..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="events">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => {
                    const SeverityIcon = severityIcons[event.severity];
                    return (
                      <div key={event.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <SeverityIcon className={`h-5 w-5 mt-0.5 ${
                              event.severity === 'critical' ? 'text-red-500' :
                              event.severity === 'high' ? 'text-orange-500' :
                              event.severity === 'medium' ? 'text-yellow-500' :
                              'text-green-500'
                            }`} />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge className={severityColors[event.severity]}>
                                  {event.severity}
                                </Badge>
                                <span className="text-sm font-medium">{event.event}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(event.createdAt).toLocaleString('he-IL')}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{event.message}</p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                {event.ip && <span>IP: {event.ip}</span>}
                                {event.endpoint && <span>Endpoint: {event.endpoint}</span>}
                                {event.user && <span>User: {event.user.email}</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {events.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      לא נמצאו אירועי אבטחה
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
