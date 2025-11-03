'use client';

import { SecurityHardening } from '@/components/security/security-hardening';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function SecurityPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Security Hardening</h1>
          <p className="text-muted-foreground">
            Configure encryption, audit logging, and secrets management for enhanced security
          </p>
        </div>
        
        <SecurityHardening />
      </div>
    </DashboardLayout>
  );
}