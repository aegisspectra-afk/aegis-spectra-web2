'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface UseRequireRoleOptions {
  requiredRoles?: string[];
  redirectTo?: string;
  requireAuth?: boolean;
}

export function useRequireRole({
  requiredRoles = [],
  redirectTo = '/login',
  requireAuth = true
}: UseRequireRoleOptions = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    // Check if user is authenticated
    if (requireAuth && !session) {
      router.push(redirectTo);
      return;
    }

    // Check if user has required roles
    if (requiredRoles.length > 0 && session) {
      const userRoles = session.user?.roles || [];
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        router.push('/panel?error=insufficient_permissions');
        return;
      }
    }
  }, [session, status, requiredRoles, redirectTo, requireAuth, router]);

  return {
    session,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    userRoles: session?.user?.roles || [],
    hasRequiredRole: requiredRoles.length === 0 || 
      (session && requiredRoles.some(role => session.user?.roles?.includes(role)))
  };
}