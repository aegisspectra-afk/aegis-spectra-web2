'use client';

import { LicenseManager } from '@/components/business/license-manager';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function LicenseManagerPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">License Manager</h1>
          <p className="text-muted-foreground">
            Manage your licenses, billing, and subscription settings
          </p>
        </div>
        
        <LicenseManager />
      </div>
    </DashboardLayout>
  );
}