import { neon } from '@netlify/neon';
import { NextRequest } from 'next/server';
import { hashPassword, verifyPassword, generateToken, verifyToken } from '@/lib/auth';

const sql = neon();

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
    const [user] = await sql`
      SELECT id, name, email, phone, password_hash, role, email_verified, created_at, last_login
      FROM users
      WHERE email = ${email.toLowerCase().trim()}
      LIMIT 1
    `.catch(() => []);

    if (!user || !user.password_hash) {
      return { ok: false, error: 'אימייל או סיסמה שגויים' };
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
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
                  request.headers.get('x-user-token');

    if (!token) {
      return null;
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return null;
    }

    // Get user from database
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

