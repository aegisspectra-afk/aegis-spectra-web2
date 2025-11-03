'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SessionCheckOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  requiredRoles?: string[];
}

export function useSessionCheck(options: SessionCheckOptions = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const {
    redirectTo = '/login',
    requireAuth = true,
    requiredRoles = []
  } = options;

  useEffect(() => {
    const checkSession = async () => {
      setIsChecking(true);

      // If still loading, wait
      if (status === 'loading') {
        return;
      }

      // If authentication is required but no session
      if (requireAuth && !session) {
        setIsAuthorized(false);
        setIsChecking(false);
        router.push(redirectTo);
        return;
      }

      // If session exists but roles are required
      if (session && requiredRoles.length > 0) {
        const userRoles = session.user?.roles || [];
        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
        
        if (!hasRequiredRole) {
          setIsAuthorized(false);
          setIsChecking(false);
          router.push('/panel'); // Redirect to panel if insufficient permissions
          return;
        }
      }

      // Session is valid
      setIsAuthorized(true);
      setIsChecking(false);
    };

    checkSession();
  }, [session, status, router, redirectTo, requireAuth, requiredRoles]);

  return {
    session,
    isChecking,
    isAuthorized,
    status
  };
}