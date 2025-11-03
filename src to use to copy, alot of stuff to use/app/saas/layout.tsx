'use client';

import React from 'react';
import { PanelLayout } from '@/components/layout/panel-layout';
import { useSession } from 'next-auth/react';

export default function SaasLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.roles?.[0] || 'CLIENT';
  const subscriptionPlan = (session?.user as any)?.subscriptionPlan || 'FREE';
  return (
    <PanelLayout userRole={userRole} subscriptionPlan={subscriptionPlan} hideSidebar>
      {children}
    </PanelLayout>
  );
}


