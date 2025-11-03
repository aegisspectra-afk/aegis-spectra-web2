'use client';

import { useRequireRole } from '@/hooks/use-require-role';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Shield, BarChart3, Settings, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ClientDashboard() {
  const result = useRequireRole({ 
    requiredRoles: ['CLIENT', 'ADMIN', 'SUPER_ADMIN'] 
  });

  if (!result || !result.session) return null;
  
  const { session, userRoles } = result;

  const stats = [
    { title: 'Active Cameras', value: '12', icon: Camera, change: '+2', positive: true },
    { title: 'Security Score', value: '98%', icon: Shield, change: '+2%', positive: true },
    { title: 'Alerts This Month', value: '3', icon: AlertTriangle, change: '-1', positive: true },
    { title: 'Uptime', value: '99.8%', icon: CheckCircle, change: '+0.2%', positive: true },
  ];

  const quickActions = [
    { title: 'SaaS Platform', description: 'Access your security dashboard', href: '/saas', icon: Camera },
    { title: 'Reports', description: 'View security reports', href: '/dashboard/reports', icon: BarChart3 },
    { title: 'Settings', description: 'Manage your account', href: '/dashboard/settings', icon: Settings },
    { title: 'Support', description: 'Get help and support', href: '/contact', icon: Shield },
  ];

  const recentAlerts = [
    { type: 'Motion Detected', location: 'Front Door', time: '2 hours ago', severity: 'low' },
    { type: 'Camera Offline', location: 'Backyard', time: '5 hours ago', severity: 'medium' },
    { type: 'System Check', location: 'All Cameras', time: '1 day ago', severity: 'info' },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container-max py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2">
            <span className="gradient-text">Client Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, {session.user?.name}! Monitor your security systems.
          </p>
          <div className="flex items-center space-x-4 mt-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              CLIENT
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {session.user?.subscriptionPlan || 'BASIC'}
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
                    <Button asChild variant="aegisOutline" className="w-full">
                      <Link href={action.href}>
                        Access
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Latest security notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      alert.severity === 'high' ? 'bg-red-500' :
                      alert.severity === 'medium' ? 'bg-yellow-500' :
                      alert.severity === 'low' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium">{alert.type}</p>
                      <p className="text-sm text-muted-foreground">{alert.location} • {alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { component: 'Main Server', status: 'Online', uptime: '99.9%' },
                  { component: 'Database', status: 'Online', uptime: '99.8%' },
                  { component: 'API Gateway', status: 'Online', uptime: '99.7%' },
                  { component: 'Monitoring', status: 'Online', uptime: '100%' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.component}</p>
                      <p className="text-sm text-muted-foreground">Uptime: {item.uptime}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}