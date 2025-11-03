'use client';

import { CyberDefenseModules } from '@/components/cyber-defense/cyber-defense-modules';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function CyberDefensePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Cyber Defense</h1>
          <p className="text-muted-foreground">
            Advanced threat detection and security monitoring
          </p>
        </div>
        
        <CyberDefenseModules />
      </div>
    </DashboardLayout>
  );
}