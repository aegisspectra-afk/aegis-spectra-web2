'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { SubscriptionManager } from '@/components/payments/subscription-manager';
import { PanelLayout } from '@/components/layout/panel-layout';
import { Section } from '@/components/common/section';
import { useSession } from 'next-auth/react';

function BillingContent() {
  const { data: session } = useSession();
  const userRole = session?.user?.roles?.[0] || 'CLIENT';
  const subscriptionPlan = (session?.user as any)?.subscriptionPlan || 'BASIC';

  return (
    <PanelLayout userRole={userRole} subscriptionPlan={subscriptionPlan}>
      <Section className="py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold gradient-text">
              Billing & Subscription
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your subscription, billing information, and payment methods
            </p>
          </div>
          
          <SubscriptionManager />
        </div>
      </Section>
    </PanelLayout>
  );
}

export default function BillingPage() {
  return (
    <ProtectedRoute>
      <BillingContent />
    </ProtectedRoute>
  );
}