'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { getToken } from '@/lib/auth';
import { useUserProfile } from '@/contexts/user-profile';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  fallbackUrl?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  fallbackUrl = '/login' 
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const localJwt = typeof window !== 'undefined' ? getToken() : null;
  const isAuthenticated = !!session || !!localJwt;

  useEffect(() => {
    if (status === 'loading' || profileLoading) return; // Still loading

    if (!isAuthenticated) {
      // Not authenticated, redirect to login
      router.push(fallbackUrl);
      return;
    }

    if (requiredRoles.length > 0) {
      const userRoles = (profile?.roles) || (session?.user?.roles) || [];
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        // User doesn't have required role, redirect to panel
        router.push('/panel');
        return;
      }
    }
  }, [session, status, profileLoading, isAuthenticated, profile, router, requiredRoles, fallbackUrl]);

  // Show loading state
  if (status === 'loading' || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-aegis-teal mx-auto mb-4" />
            <p className="text-muted-foreground">Verifying authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You need to be logged in to access this page.
            </p>
            <button 
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-aegis-teal text-white rounded-md hover:bg-aegis-teal/90 transition-colors"
            >
              Go to Login
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role requirements
  if (requiredRoles.length > 0) {
    const userRoles = (profile?.roles) || (session?.user?.roles) || [];
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Insufficient Permissions</h2>
              <p className="text-muted-foreground mb-4">
                You don't have the required permissions to access this page.
              </p>
              <button 
                onClick={() => router.push('/panel')}
                className="px-4 py-2 bg-aegis-teal text-white rounded-md hover:bg-aegis-teal/90 transition-colors"
              >
                Go to Panel
              </button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // User is authenticated and has required roles
  return <>{children}</>;
}