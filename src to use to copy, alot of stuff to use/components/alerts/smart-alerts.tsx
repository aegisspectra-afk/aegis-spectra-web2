'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, CheckCircle, Clock, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface Alert {
  id: string;
  type: 'motion' | 'sound' | 'security' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  cameraId: string;
  cameraName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  thumbnail?: string;
}

interface SmartAlertsProps {
  userRole: string;
  subscriptionPlan: string;
}

export function SmartAlerts({ userRole, subscriptionPlan }: SmartAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Check if user has smart alerts access
  const hasSmartAlerts = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' || 
    (userRole === 'CLIENT' && ['BASIC', 'PRO', 'BUSINESS'].includes(subscriptionPlan));

  useEffect(() => {
    if (hasSmartAlerts) {
      fetchAlerts();
    }
  }, [hasSmartAlerts]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/alerts');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId: string) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}/read`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        setAlerts(prev => 
          prev.map(alert => 
            alert.id === alertId ? { ...alert, isRead: true } : alert
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        toast.success('Alert marked as read');
      }
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
      toast.error('Failed to mark alert as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/alerts/mark-all-read', {
        method: 'PATCH',
      });
      
      if (response.ok) {
        setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
        setUnreadCount(0);
        toast.success('All alerts marked as read');
      }
    } catch (error) {
      console.error('Failed to mark all alerts as read:', error);
      toast.error('Failed to mark all alerts as read');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'motion': return 'activity';
      case 'sound': return 'volume-2';
      case 'security': return 'shield';
      case 'system': return 'settings';
      default: return 'bell';
    }
  };

  if (!hasSmartAlerts) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-aegis-teal" />
            Smart Alerts
          </CardTitle>
          <CardDescription>
            Real-time security notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Smart Alerts Not Available</h3>
            <p className="text-muted-foreground mb-4">
              Smart alerts are available with Basic, Pro, and Business plans.
            </p>
            <Button variant="aegis" asChild>
              <a href="/pricing">Upgrade Your Plan</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-aegis-teal" />
            Smart Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aegis-teal"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-aegis-teal" />
              Smart Alerts
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Real-time security notifications and alerts
            </CardDescription>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark All Read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Alerts</h3>
            <p className="text-muted-foreground">
              Your security system is running smoothly. No alerts at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border rounded-lg transition-colors ${
                  alert.isRead 
                    ? 'bg-muted/50 border-muted' 
                    : 'bg-background border-border hover:bg-muted/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getTypeIcon(alert.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold">{alert.title}</h4>
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        {!alert.isRead && (
                          <div className="w-2 h-2 bg-aegis-teal rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                        <span>Camera: {alert.cameraName}</span>
                      </div>
                    </div>
                  </div>
                  {!alert.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(alert.id)}
                    >
                      Mark Read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}