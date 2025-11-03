import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  // Temporarily disable Prisma adapter to avoid errors
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Simple hardcoded admin user for testing
        if (credentials?.email === 'admin@aegis-spectra.com' && credentials?.password === '123456789') {
          return {
            id: 'admin-1',
            email: 'admin@aegis-spectra.com',
            name: 'Admin User',
            roles: ['SUPER_ADMIN'],
          };
        }
        return null;
      },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 2 * 60 * 60, // 2 hours (much shorter for security)
    updateAge: 30 * 60, // 30 minutes (refresh session every 30 minutes)
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.roles = (user as any).roles;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).roles = token.roles;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects after login
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login page on error
  },
  secret: process.env.NEXTAUTH_SECRET,
};