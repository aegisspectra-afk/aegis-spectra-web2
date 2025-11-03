'use client';

import { DeploymentTemplates } from '@/components/deployment/deployment-templates';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function DeploymentPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Deployment</h1>
          <p className="text-muted-foreground">
            Deploy Aegis Spectra using pre-configured templates for cloud, on-premise, or hybrid environments
          </p>
        </div>
        
        <DeploymentTemplates />
      </div>
    </DashboardLayout>
  );
}