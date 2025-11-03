'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface CSRFTokenProps {
  name?: string;
}

export function CSRFToken({ name = 'csrf_token' }: CSRFTokenProps) {
  const [token, setToken] = useState<string>('');
  const { data: session } = useSession();

  useEffect(() => {
    // Generate CSRF token when component mounts
    if (session) {
      const generateToken = async () => {
        try {
          // In a real implementation, you would get this from the server
          const response = await fetch('/api/auth/csrf-token');
          const data = await response.json();
          setToken(data.token);
        } catch (error) {
          // Fallback: generate client-side token
          const array = new Uint8Array(32);
          crypto.getRandomValues(array);
          const clientToken = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
          setToken(clientToken);
        }
      };

      generateToken();
    }
  }, [session]);

  if (!token) {
    return null;
  }

  return (
    <input
      type="hidden"
      name={name}
      value={token}
    />
  );
}

// Hook for getting CSRF token
export function useCSRFToken() {
  const [token, setToken] = useState<string>('');
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      const generateToken = async () => {
        try {
          const response = await fetch('/api/auth/csrf-token');
          const data = await response.json();
          setToken(data.token);
        } catch (error) {
          // Fallback: generate client-side token
          const array = new Uint8Array(32);
          crypto.getRandomValues(array);
          const clientToken = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
          setToken(clientToken);
        }
      };

      generateToken();
    }
  }, [session]);

  return token;
}