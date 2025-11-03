'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getToken } from '@/lib/auth';
import { apiMe } from '@/lib/api';

type UserProfile = {
  id: number;
  email: string;
  full_name?: string;
  roles: string[];
  tenants: number[];
};

type UserProfileContextValue = {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const UserProfileContext = createContext<UserProfileContextValue | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = getToken();
      if (!token) {
        setProfile(null);
        setIsLoading(false);
        return;
      }
      let me = await apiMe(token);
      setProfile(me);
    } catch (e: any) {
      // Retry once if we had a transient 401 and token exists
      try {
        const tokenRetry = getToken();
        if (tokenRetry) {
          const me2 = await apiMe(tokenRetry);
          setProfile(me2);
        } else {
          setProfile(null);
        }
      } catch (e2: any) {
        setError(e2?.message ?? 'Failed to load profile');
        setProfile(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const value = useMemo<UserProfileContextValue>(() => ({ profile, isLoading, error, refresh: load }), [profile, isLoading, error]);
  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used within UserProfileProvider');
  return ctx;
}


