'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SessionState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  hasValidSession: boolean;
}

export function useSessionState(): SessionState {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessionState, setSessionState] = useState<SessionState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    hasValidSession: false
  });

  useEffect(() => {
    const checkSession = async () => {
      if (status === 'loading') {
        setSessionState(prev => ({ ...prev, isLoading: true }));
        return;
      }

      if (!session) {
        setSessionState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          hasValidSession: false
        });
        return;
      }

      // Additional server-side session validation
      try {
        const response = await fetch('/api/auth/session-check', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const serverSession = await response.json();
          
          if (serverSession.authenticated && serverSession.user) {
            setSessionState({
              isAuthenticated: true,
              isLoading: false,
              user: serverSession.user,
              hasValidSession: true
            });
          } else {
            // Server says no valid session, clear client session
            setSessionState({
              isAuthenticated: false,
              isLoading: false,
              user: null,
              hasValidSession: false
            });
          }
        } else {
          // Server validation failed
          setSessionState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            hasValidSession: false
          });
        }
      } catch (error) {
        console.error('Session validation error:', error);
        // On error, assume no valid session
        setSessionState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          hasValidSession: false
        });
      }
    };

    checkSession();
  }, [session, status]);

  return sessionState;
}