'use client';

import { useRequireRole } from '@/hooks/use-require-role';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, Settings, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SuperAdminDashboard() {
  const result = useRequireRole({ 
    requiredRoles: ['SUPER_ADMIN'] 
  });

  if (!result || !result.session) return null;
  
  const { session, userRoles } = result;

  const stats = [
    { title: 'Total Users', value: '1,234', icon: Users, change: '+12%', positive: true },
    { title: 'Active Subscriptions', value: '856', icon: CheckCircle, change: '+8%', positive: true },
    { title: 'System Alerts', value: '3', icon: AlertTriangle, change: '-2', positive: false },
    { title: 'Revenue (Monthly)', value: '₪45,678', icon: BarChart3, change: '+15%', positive: true },
  ];

  const quickActions = [
    { title: 'User Management', description: 'Manage users and roles', href: '/admin/users', icon: Users },
    { title: 'System Settings', description: 'Configure system parameters', href: '/admin/settings', icon: Settings },
    { title: 'Security Dashboard', description: 'Monitor security events', href: '/admin/security', icon: Shield },
    { title: 'Analytics', description: 'View detailed analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container-max py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2">
            <span className="gradient-text">Super Admin Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, {session.user?.name}! Manage the entire system from here.
          </p>
          <div className="flex items-center space-x-4 mt-4">
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              SUPER_ADMIN
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {session.user?.subscriptionPlan || 'BUSINESS'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className={`text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </p>
                    </div>
                    <Icon className="h-8 w-8 text-aegis-teal" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card key={index} className="card-hover cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Icon className="h-6 w-6 text-aegis-teal" />
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                    </div>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="aegisOutline" className="w-full">
                      Access
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
            <CardDescription>Latest events and changes in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New user registered', time: '2 minutes ago', type: 'success' },
                { action: 'Subscription upgraded', time: '15 minutes ago', type: 'info' },
                { action: 'Failed login attempt', time: '1 hour ago', type: 'warning' },
                { action: 'System backup completed', time: '2 hours ago', type: 'success' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}