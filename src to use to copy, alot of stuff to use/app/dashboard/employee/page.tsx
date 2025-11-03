'use client';

import { useRequireRole } from '@/hooks/use-require-role';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Clock, CheckCircle, AlertTriangle, Settings, BarChart3 } from 'lucide-react';

export default function EmployeeDashboard() {
  const result = useRequireRole({ 
    requiredRoles: ['EMPLOYEE', 'ADMIN', 'SUPER_ADMIN'] 
  });

  if (!result || !result.session) return null;
  
  const { session, userRoles } = result;

  const stats = [
    { title: 'Tasks Today', value: '8', icon: CheckCircle, change: '+2', positive: true },
    { title: 'Hours Worked', value: '6.5', icon: Clock, change: '+0.5', positive: true },
    { title: 'Pending Tickets', value: '3', icon: AlertTriangle, change: '-1', positive: true },
    { title: 'Client Satisfaction', value: '4.8/5', icon: Users, change: '+0.2', positive: true },
  ];

  const tasks = [
    { title: 'Install security system', client: 'ABC Company', priority: 'high', due: 'Today' },
    { title: 'Update camera firmware', client: 'XYZ Corp', priority: 'medium', due: 'Tomorrow' },
    { title: 'Client consultation', client: 'DEF Ltd', priority: 'low', due: 'This week' },
    { title: 'System maintenance', client: 'GHI Inc', priority: 'medium', due: 'Next week' },
  ];

  const quickActions = [
    { title: 'View Tasks', description: 'See your assigned tasks', href: '/employee/tasks', icon: CheckCircle },
    { title: 'Time Tracking', description: 'Log your work hours', href: '/employee/time', icon: Clock },
    { title: 'Client Support', description: 'Handle support tickets', href: '/employee/support', icon: Users },
    { title: 'Settings', description: 'Manage your profile', href: '/employee/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container-max py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2">
            <span className="gradient-text">Employee Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, {session.user?.name}! Here's your work overview.
          </p>
          <div className="flex items-center space-x-4 mt-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              EMPLOYEE
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Active
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Tasks</CardTitle>
              <CardDescription>Your assigned tasks for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.client} • Due: {task.due}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent work activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Completed installation', time: '2 hours ago', type: 'success' },
                  { action: 'Updated client report', time: '4 hours ago', type: 'info' },
                  { action: 'Resolved support ticket', time: '6 hours ago', type: 'success' },
                  { action: 'Started new task', time: '8 hours ago', type: 'info' },
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
    </div>
  );
}