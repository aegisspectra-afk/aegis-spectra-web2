'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Section } from '@/components/common/section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Edit, Trash2, Shield, UserCheck } from 'lucide-react';

export default function UsersPage() {
  return (
    <DashboardLayout requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
      <Section className="py-8">
        <div className="container-max">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                <span className="gradient-text">User Management</span>
              </h1>
              <p className="text-muted-foreground">
                Manage users and their permissions
              </p>
            </div>
            <Button variant="aegis" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Users
              </CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">User Management</h3>
                <p className="text-muted-foreground mb-4">
                  This feature is coming soon. You'll be able to manage users, roles, and permissions.
                </p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </DashboardLayout>
  );
}