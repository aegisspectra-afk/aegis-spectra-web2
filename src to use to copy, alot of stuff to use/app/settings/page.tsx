'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { ProfileSettings } from '@/components/auth/profile-settings';
import { PanelLayout } from '@/components/layout/panel-layout';
import { Section } from '@/components/common/section';
import { useSession } from 'next-auth/react';

function SettingsContent() {
  const { data: session } = useSession();
  const userRole = session?.user?.roles?.[0] || 'CLIENT';
  const subscriptionPlan = (session?.user as any)?.subscriptionPlan || 'BASIC';

  return (
    <PanelLayout userRole={userRole} subscriptionPlan={subscriptionPlan}>
      <Section className="py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold gradient-text">
              Account Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your account information, security settings, and preferences
            </p>
          </div>
          
          <ProfileSettings />
        </div>
      </Section>
    </PanelLayout>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}