import { neon } from '@netlify/neon';
import { NextRequest } from 'next/server';
import { hashPassword, verifyPassword, generateToken, verifyToken } from '@/lib/auth';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for auth-server');
  sql = null;
}

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'customer' | 'support';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  email_verified: boolean;
  created_at: string;
  last_login?: string;
}

export interface AuthResult {
  ok: boolean;
  user?: User;
  token?: string;
  error?: string;
}

/**
 * Authenticate user by email and password
 */
export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  try {
    if (!sql) {
      return { ok: false, error: 'Database not available' };
    }

    const [user] = await sql`
      SELECT id, name, email, phone, password_hash, role, email_verified, created_at, last_login
      FROM users
      WHERE LOWER(email) = LOWER(${email.trim()})
      LIMIT 1
    `.catch(() => []);

    if (!user || !user.password_hash) {
      console.error('User not found or no password:', { email: email.trim(), userExists: !!user });
      return { ok: false, error: 'אימייל או סיסמה שגויים' };
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      console.error('Password verification failed:', { 
        email: email.trim(), 
        userId: user.id,
        hashPreview: user.password_hash.substring(0, 30)
      });
      return { ok: false, error: 'אימייל או סיסמה שגויים' };
    }

    // Update last login
    await sql`
      UPDATE users
      SET last_login = NOW()
      WHERE id = ${user.id}
    `.catch(() => {});

    // Generate token
    const sessionId = `session_${user.id}_${Date.now()}`;
    const token = generateToken(
      user.id,
      user.email,
      user.role,
      sessionId,
      false // rememberMe
    );

    return {
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role as UserRole,
        email_verified: user.email_verified,
        created_at: user.created_at,
        last_login: user.last_login,
      },
      token,
    };
  } catch (error: any) {
    console.error('Authentication error:', error);
    return { ok: false, error: 'שגיאה בהתחברות' };
  }
}

/**
 * Get user from request (from token or session)
 */
export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  try {
    // Try to get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || 
                  request.cookies.get('user_token')?.value ||
                  request.cookies.get('admin_token')?.value ||
                  request.headers.get('x-user-token');

    if (!token) {
      return null;
    }

    // Check if it's an admin token (base64 encoded email:timestamp)
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [email] = decoded.split(':');
      
      // If it's an admin token, return admin user
      if (email && (email.includes('@aegis-spectra.com') || email.includes('@gmail.com'))) {
        // Try to find user in database
        if (sql) {
          const [user] = await sql`
            SELECT id, name, email, phone, role, email_verified, created_at, last_login
            FROM users
            WHERE LOWER(email) = LOWER(${email})
            LIMIT 1
          `.catch(() => []);

          if (user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone || '',
              role: (user.role as UserRole) || 'admin',
              email_verified: user.email_verified || false,
              created_at: user.created_at,
              last_login: user.last_login,
            };
          }
        }

        // If user not found in DB, return admin user from token
        return {
          id: 1,
          name: 'Admin',
          email: email,
          phone: '',
          role: 'admin' as UserRole,
          email_verified: true,
          created_at: new Date().toISOString(),
          last_login: undefined,
        };
      }
    } catch {
      // Not a base64 admin token, continue with regular token verification
    }

    // Verify regular user token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return null;
    }

    // Get user from database
    if (!sql) {
      // Fallback: return user from token if no database
      return {
        id: decoded.userId,
        name: (decoded as any).name || 'User',
        email: decoded.email,
        phone: '',
        role: (decoded.role as UserRole) || 'customer',
        email_verified: true,
        created_at: new Date().toISOString(),
        last_login: undefined,
      };
    }

    const [user] = await sql`
      SELECT id, name, email, phone, role, email_verified, created_at, last_login
      FROM users
      WHERE id = ${decoded.userId}
      LIMIT 1
    `.catch(() => []);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role as UserRole,
      email_verified: user.email_verified,
      created_at: user.created_at,
      last_login: user.last_login,
    };
  } catch (error) {
    console.error('Error getting user from request:', error);
    return null;
  }
}

/**
 * Check if user has required role
 */
export function hasRole(user: User | null, requiredRoles: UserRole[]): boolean {
  if (!user) return false;
  return requiredRoles.includes(user.role);
}

/**
 * Check if user has permission for admin access
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, ['super_admin', 'admin']);
}

/**
 * Check if user has permission for manager access
 */
export function isManager(user: User | null): boolean {
  return hasRole(user, ['super_admin', 'admin', 'manager']);
}

/**
 * Check if user can access admin panel
 */
export function canAccessAdmin(user: User | null): boolean {
  return hasRole(user, ['super_admin', 'admin', 'manager']);
}

/**
 * Require authentication - returns user or throws error
 */
export async function requireAuth(request: NextRequest): Promise<User> {
  const user = await getUserFromRequest(request);
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

/**
 * Require admin role - returns user or throws error
 */
export async function requireAdmin(request: NextRequest): Promise<User> {
  const user = await requireAuth(request);
  if (!isAdmin(user)) {
    throw new Error('Forbidden - Admin access required');
  }
  return user;
}

/**
 * Require manager role - returns user or throws error
 */
export async function requireManager(request: NextRequest): Promise<User> {
  const user = await requireAuth(request);
  if (!isManager(user)) {
    throw new Error('Forbidden - Manager access required');
  }
  return user;
}

