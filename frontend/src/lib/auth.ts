// Authentication utilities - secure password hashing and JWT tokens
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'aegis-spectra-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // 7 days

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate unique API key for user
export function generateApiKey(): string {
  // Generate a secure random API key
  const randomBytes = crypto.randomBytes(32);
  const apiKey = `aegis_${randomBytes.toString('hex')}`;
  return apiKey;
}

// Hash API key for storage (store both hashed and plain for now)
export function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

// JWT Token generation
export function generateToken(userId: number, email: string, role: string): string {
  return jwt.sign(
    { 
      userId, 
      email, 
      role,
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Verify JWT token
export function verifyToken(token: string): { userId: number; email: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; role: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone format (Israeli)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^0[2-9]\d{7,8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Validate password strength
export function isStrongPassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('סיסמה חייבת להכיל לפחות 8 תווים');
  }
  if (!/[A-Z]/.test(password) && !/[א-ת]/.test(password)) {
    errors.push('סיסמה חייבת להכיל אות גדולה או אות עברית');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('סיסמה חייבת להכיל אות קטנה');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('סיסמה חייבת להכיל מספר');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('סיסמה חייבת להכיל תו מיוחד');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Generate email verification token
export function generateEmailVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Rate limiting store (simple in-memory, in production use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxAttempts) {
    return false;
  }
  
  record.count++;
  return true;
}

// Clean up old rate limit records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Clean every minute

// Get API key from request headers
export function getApiKeyFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.replace('Bearer ', '');
  }
  const apiKeyHeader = request.headers.get('x-api-key');
  return apiKeyHeader || null;
}

// Validate API key format
export function isValidApiKeyFormat(apiKey: string): boolean {
  return apiKey.startsWith('aegis_') && apiKey.length === 70; // 6 + 1 + 64 hex chars
}

