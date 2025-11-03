'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { AdvancedAnalytics } from '@/components/analytics/advanced-analytics';
import { PanelLayout } from '@/components/layout/panel-layout';
import { Section } from '@/components/common/section';

function AnalyticsContent() {
  return (
    <PanelLayout userRole="admin" subscriptionPlan="enterprise">
      <Section className="py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold gradient-text">
              Advanced Analytics
            </h1>
            <p className="text-muted-foreground mt-2">
              Deep insights and analytics for your security system performance
            </p>
          </div>
          
          <AdvancedAnalytics />
        </div>
      </Section>
    </PanelLayout>
  );
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsContent />
    </ProtectedRoute>
  );
}