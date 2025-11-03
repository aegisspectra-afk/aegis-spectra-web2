import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      roles: string[];
      subscriptionPlan?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    roles: string[];
    subscriptionPlan?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    roles: string[];
    subscriptionPlan?: string | null;
  }
}