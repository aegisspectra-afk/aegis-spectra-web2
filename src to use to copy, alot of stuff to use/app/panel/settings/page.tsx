'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { PanelLayout } from '@/components/layout/panel-layout';
import { getUserPermissions } from '@/lib/user-permissions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Camera, 
  Users, 
  BarChart3, 
  FileText, 
  Shield,
  Check,
  X,
  Search
} from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [permissions, setPermissions] = useState<any>(null);

  useEffect(() => {
    if (session?.user) {
      const userRole = session.user.roles?.[0] || 'CLIENT';
      const subscriptionPlan = (session.user as any)?.subscriptionPlan || 'BASIC';
      setPermissions(getUserPermissions(userRole, subscriptionPlan));
    }
  }, [session]);

  if (!permissions) {
    return (
      <PanelLayout userRole="CLIENT" subscriptionPlan="BASIC">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Loading Settings...</h2>
          </div>
        </div>
      </PanelLayout>
    );
  }

  const userRole = session?.user?.roles?.[0] || 'CLIENT';
  const subscriptionPlan = (session?.user as any)?.subscriptionPlan || 'BASIC';

  return (
    <PanelLayout userRole={userRole} subscriptionPlan={subscriptionPlan}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Plan Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Current Plan
            </CardTitle>
            <CardDescription>
              Your current subscription plan and features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant="aegis" className="text-lg px-4 py-2">
                {subscriptionPlan}
              </Badge>
              <div className="text-sm text-muted-foreground">
                {userRole === 'SUPER_ADMIN' && 'Full system access'}
                {userRole === 'ADMIN' && 'Administrative access'}
                {userRole === 'CLIENT' && `Client plan with ${subscriptionPlan} features`}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Access */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Access</CardTitle>
            <CardDescription>
              Features available in your current plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5" />
                <span>Cameras</span>
                {permissions.features.cameras ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5" />
                <span>Search</span>
                {permissions.features.search ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                <span>User Management</span>
                {permissions.features.users ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5" />
                <span>Analytics</span>
                {permissions.features.analytics ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5" />
                <span>Reports</span>
                {permissions.features.reports ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5" />
                <span>System Settings</span>
                {permissions.features.system ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Limits */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Limits</CardTitle>
            <CardDescription>
              Current limits for your subscription plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-aegis-teal">
                  {permissions.limits.cameras === Infinity ? '∞' : permissions.limits.cameras}
                </div>
                <div className="text-sm text-muted-foreground">Cameras</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-aegis-teal">
                  {permissions.limits.users === Infinity ? '∞' : permissions.limits.users}
                </div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-aegis-teal">
                  {permissions.limits.storage === Infinity ? '∞' : `${permissions.limits.storage} days`}
                </div>
                <div className="text-sm text-muted-foreground">Storage</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Access */}
        <Card>
          <CardHeader>
            <CardTitle>Settings Access</CardTitle>
            <CardDescription>
              Settings sections available to you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Basic Settings</span>
                {permissions.settings.basic ? (
                  <Badge variant="default" className="bg-green-500">
                    Available
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Not Available
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span>Advanced Settings</span>
                {permissions.settings.advanced ? (
                  <Badge variant="default" className="bg-green-500">
                    Available
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Not Available
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span>System Settings</span>
                {permissions.settings.system ? (
                  <Badge variant="default" className="bg-green-500">
                    Available
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Not Available
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Button for CLIENT users */}
        {userRole === 'CLIENT' && subscriptionPlan !== 'BUSINESS' && (
          <Card>
            <CardHeader>
              <CardTitle>Upgrade Your Plan</CardTitle>
              <CardDescription>
                Get access to more features and higher limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="aegis" asChild>
                <a href="/pricing">View Available Plans</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PanelLayout>
  );
}