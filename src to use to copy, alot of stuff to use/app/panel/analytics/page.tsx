'use client';

import { useState, useEffect } from 'react';
import { PanelLayout } from '@/components/layout/panel-layout';
import { requireFeatureAccess } from '@/lib/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Camera,
  AlertTriangle,
  Users,
  Activity,
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AnalyticsData {
  totalEvents: number;
  eventsByType: { type: string; count: number; percentage: number }[];
  eventsBySeverity: { severity: string; count: number; color: string }[];
  eventsByCamera: { camera: string; count: number }[];
  eventsByHour: { hour: number; count: number }[];
  eventsByDay: { day: string; count: number }[];
  topAlerts: { id: string; title: string; count: number; severity: string }[];
  systemHealth: {
    camerasOnline: number;
    camerasOffline: number;
    totalCameras: number;
    uptime: number;
  };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedCamera, setSelectedCamera] = useState('all');
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      await requireFeatureAccess('analytics');
      setHasAccess(true);
      fetchAnalytics();
    } catch (error) {
      setHasAccess(false);
    }
  };

  useEffect(() => {
    if (hasAccess) {
      fetchAnalytics();
    }
  }, [timeRange, selectedCamera, hasAccess]);

  const fetchAnalytics = async () => {
    try {
      // Mock data for now
      const mockData: AnalyticsData = {
        totalEvents: 1247,
        eventsByType: [
          { type: 'Motion Detection', count: 456, percentage: 36.6 },
          { type: 'Person Detection', count: 234, percentage: 18.8 },
          { type: 'Vehicle Detection', count: 189, percentage: 15.2 },
          { type: 'Object Detection', count: 156, percentage: 12.5 },
          { type: 'Audio Detection', count: 98, percentage: 7.9 },
          { type: 'Other', count: 114, percentage: 9.1 }
        ],
        eventsBySeverity: [
          { severity: 'Low', count: 234, color: 'bg-green-500' },
          { severity: 'Medium', count: 456, color: 'bg-yellow-500' },
          { severity: 'High', count: 389, color: 'bg-orange-500' },
          { severity: 'Critical', count: 168, color: 'bg-red-500' }
        ],
        eventsByCamera: [
          { camera: 'Main Entrance', count: 234 },
          { camera: 'Parking Lot', count: 189 },
          { camera: 'Loading Dock', count: 156 },
          { camera: 'Reception', count: 98 },
          { camera: 'Storage Room', count: 67 }
        ],
        eventsByHour: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          count: Math.floor(Math.random() * 50) + 10
        })),
        eventsByDay: [
          { day: 'Mon', count: 156 },
          { day: 'Tue', count: 189 },
          { day: 'Wed', count: 234 },
          { day: 'Thu', count: 198 },
          { day: 'Fri', count: 267 },
          { day: 'Sat', count: 123 },
          { day: 'Sun', count: 98 }
        ],
        topAlerts: [
          { id: '1', title: 'Unauthorized Access Attempt', count: 23, severity: 'Critical' },
          { id: '2', title: 'Motion After Hours', count: 45, severity: 'High' },
          { id: '3', title: 'Camera Offline', count: 12, severity: 'Medium' },
          { id: '4', title: 'Multiple Failed Logins', count: 8, severity: 'High' },
          { id: '5', title: 'Suspicious Activity', count: 15, severity: 'Medium' }
        ],
        systemHealth: {
          camerasOnline: 8,
          camerasOffline: 2,
          totalCameras: 10,
          uptime: 99.7
        }
      };
      
      setData(mockData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'text-red-600';
      case 'High':
        return 'text-orange-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!hasAccess) {
    return (
      <PanelLayout userRole="CLIENT" subscriptionPlan="BASIC">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Analytics Not Available</h2>
            <p className="text-muted-foreground mb-4">
              Analytics is only available for PRO and BUSINESS plans.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Upgrade your plan to access advanced analytics and insights.
            </p>
            <Button variant="aegis" asChild>
              <a href="/pricing">Upgrade Plan</a>
            </Button>
          </div>
        </div>
      </PanelLayout>
    );
  }

  if (loading) {
    return (
      <PanelLayout userRole="ADMIN" subscriptionPlan="PRO">
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </PanelLayout>
    );
  }

  if (!data) {
    return (
      <PanelLayout userRole="ADMIN" subscriptionPlan="PRO">
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No analytics data</h3>
          <p className="text-muted-foreground">Analytics data will appear here once events are generated.</p>
        </div>
      </PanelLayout>
    );
  }

  return (
    <PanelLayout userRole="ADMIN" subscriptionPlan="PRO">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Analytics</h1>
            <p className="text-muted-foreground">
              Security insights and performance metrics
            </p>
          </div>
          <div className="flex space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                  <p className="text-3xl font-bold">{data.totalEvents.toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-aegis-teal" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">+12.5%</span>
                <span className="text-sm text-muted-foreground ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                  <p className="text-3xl font-bold">{data.systemHealth.uptime}%</p>
                </div>
                <Camera className="h-8 w-8 text-green-500" />
              </div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-muted-foreground">
                  {data.systemHealth.camerasOnline}/{data.systemHealth.totalCameras} cameras online
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                  <p className="text-3xl font-bold text-red-600">
                    {data.eventsBySeverity.find(s => s.severity === 'Critical')?.count || 0}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">-8.2%</span>
                <span className="text-sm text-muted-foreground ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-3xl font-bold">24</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">+5.3%</span>
                <span className="text-sm text-muted-foreground ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Events by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Events by Type</CardTitle>
              <CardDescription asChild>
                <p>Distribution of security events by detection type</p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.eventsByType.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-aegis-teal"></div>
                      <span className="text-sm font-medium">{item.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{item.count}</span>
                      <Badge variant="secondary">{item.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Events by Severity */}
          <Card>
            <CardHeader>
              <CardTitle>Events by Severity</CardTitle>
              <CardDescription asChild>
                <p>Security events categorized by severity level</p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.eventsBySeverity.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-medium">{item.severity}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{item.count}</span>
                      <Badge variant="secondary">
                        {((item.count / data.totalEvents) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Top Security Alerts</CardTitle>
            <CardDescription asChild>
              <p>Most frequent security alerts and their severity</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <AlertTriangle className="h-5 w-5 text-aegis-teal" />
                    <div>
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {alert.count} occurrences in the selected period
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  );
}