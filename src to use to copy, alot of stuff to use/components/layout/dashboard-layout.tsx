'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardNavbar } from './dashboard-navbar';
import { Footer } from './footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredSubscription?: string;
}

export function DashboardLayout({ 
  children, 
  requiredRoles = [], 
  requiredSubscription 
}: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    // Check role requirements
    if (requiredRoles.length > 0) {
      const userRoles = session.user?.roles || [];
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        router.push('/panel'); // Redirect to main dashboard
        return;
      }
    }

    // Check subscription requirements
    if (requiredSubscription) {
      const userSubscription = session.user?.subscriptionPlan || 'FREE';
      const subscriptionLevels = ['FREE', 'BASIC', 'PRO', 'BUSINESS'];
      const userLevel = subscriptionLevels.indexOf(userSubscription);
      const requiredLevel = subscriptionLevels.indexOf(requiredSubscription);
      
      if (userLevel < requiredLevel) {
        router.push('/pricing'); // Redirect to pricing
        return;
      }
    }

    setIsLoading(false);
  }, [session, status, router, requiredRoles, requiredSubscription]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aegis-teal"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userRole = session.user?.roles?.[0] || 'CLIENT';
  const subscriptionPlan = session.user?.subscriptionPlan || 'FREE';

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar userRole={userRole} subscriptionPlan={subscriptionPlan} />
      <div className="pt-16">
        {children}
      </div>
      <Footer />
    </div>
  );
}