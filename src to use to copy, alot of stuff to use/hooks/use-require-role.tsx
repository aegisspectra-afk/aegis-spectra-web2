'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';

interface UseRequireRoleOptions {
  requiredRoles: string[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function useRequireRole({ 
  requiredRoles, 
  redirectTo = '/login',
  fallback = null 
}: UseRequireRoleOptions) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      router.push(redirectTo);
      return;
    }

    const userRoles = session.user?.roles || [];
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      router.push('/dashboard/client'); // Default fallback
      return;
    }
  }, [session, status, requiredRoles, redirectTo, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aegis-teal"></div>
      </div>
    );
  }

  if (!session) {
    return fallback;
  }

  const userRoles = session.user?.roles || [];
  const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

  if (!hasRequiredRole) {
    return fallback as any;
  }

  return { session, userRoles, hasAccess: true };
}

export function useRequireSubscription(requiredPlan: string) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    const userPlan = session.user?.subscriptionPlan;
    const planHierarchy = ['FREE', 'BASIC', 'PRO', 'BUSINESS'];
    const userPlanLevel = planHierarchy.indexOf(userPlan || 'FREE');
    const requiredPlanLevel = planHierarchy.indexOf(requiredPlan);

    if (userPlanLevel < requiredPlanLevel) {
      router.push('/pricing');
      return;
    }
  }, [session, status, requiredPlan, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aegis-teal"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userPlan = session.user?.subscriptionPlan;
  const planHierarchy = ['FREE', 'BASIC', 'PRO', 'BUSINESS'];
  const userPlanLevel = planHierarchy.indexOf(userPlan || 'FREE');
  const requiredPlanLevel = planHierarchy.indexOf(requiredPlan);

  return { 
    session, 
    userPlan, 
    hasAccess: userPlanLevel >= requiredPlanLevel 
  };
}