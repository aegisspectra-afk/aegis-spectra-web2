import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security configuration
const SECURITY_CONFIG = {
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100, // 100 requests per window
    MAX_REQUESTS_STRICT: 10, // 10 requests for sensitive endpoints
  },
  CSRF: {
    TOKEN_LENGTH: 32,
    HEADER_NAME: 'x-csrf-token',
  },
  HEADERS: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  }
};

/**
 * Rate limiting middleware
 */
export function rateLimit(request: NextRequest, strict: boolean = false): boolean {
  const ip = getClientIP(request);
  const now = Date.now();
  const windowMs = SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS;
  const maxRequests = strict ? SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS_STRICT : SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS;
  
  const key = `${ip}:${Math.floor(now / windowMs)}`;
  const current = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };
  
  // Clean up expired entries
  if (current.resetTime < now) {
    rateLimitStore.delete(key);
    current.count = 0;
    current.resetTime = now + windowMs;
  }
  
  current.count++;
  rateLimitStore.set(key, current);
  
  if (current.count > maxRequests) {
    console.warn(`Rate limit exceeded for IP: ${ip}, count: ${current.count}, max: ${maxRequests}`);
    return false;
  }
  
  return true;
}

/**
 * Get client IP address
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return request.ip || 'unknown';
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  const crypto = require('crypto');
  return crypto.randomBytes(SECURITY_CONFIG.CSRF.TOKEN_LENGTH).toString('hex');
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(request: NextRequest, token: string): boolean {
  const headerToken = request.headers.get(SECURITY_CONFIG.CSRF.HEADER_NAME);
  return headerToken === token;
}

/**
 * Add security headers to response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_CONFIG.HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

/**
 * Validate request origin
 */
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const allowedOrigins = [
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    'http://localhost:3000',
    'https://localhost:3000'
  ].filter(Boolean);
  
  if (!origin && !referer) {
    return true; // Allow requests without origin (e.g., direct API calls)
  }
  
  const requestOrigin = origin || new URL(referer || '').origin;
  return allowedOrigins.includes(requestOrigin);
}

/**
 * Sanitize input data
 */
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove potentially dangerous characters
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

/**
 * Security audit logging
 */
export function logSecurityEvent(
  event: string,
  details: {
    ip?: string;
    userAgent?: string;
    endpoint?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    metadata?: any;
  }
) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    ...details
  };
  
  console.log(`[SECURITY] ${timestamp} - ${event.toUpperCase()} - ${details.severity.toUpperCase()}: ${details.message}`);
  
  // In production, send to security monitoring system
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to security monitoring system (e.g., Sentry, DataDog, etc.)
  }
}

/**
 * Validate file upload
 */
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain'
  ];
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }
  
  return { valid: true };
}

/**
 * Check for suspicious patterns
 */
export function detectSuspiciousActivity(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || '';
  const suspiciousPatterns = [
    /sqlmap/i,
    /nikto/i,
    /nmap/i,
    /masscan/i,
    /zap/i,
    /burp/i,
    /w3af/i,
    /havij/i,
    /acunetix/i
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(userAgent));
}

/**
 * Security middleware for API routes
 */
export function securityMiddleware(request: NextRequest) {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';
  const endpoint = request.nextUrl.pathname;
  
  // Check for suspicious activity
  if (detectSuspiciousActivity(request)) {
    logSecurityEvent('suspicious_activity', {
      ip,
      userAgent,
      endpoint,
      severity: 'high',
      message: 'Suspicious user agent detected',
      metadata: { userAgent }
    });
    
    return NextResponse.json(
      { error: 'Access denied' },
      { status: 403, headers: { 'Retry-After': '3600' } }
    );
  }
  
  // Validate origin
  if (!validateOrigin(request)) {
    logSecurityEvent('invalid_origin', {
      ip,
      userAgent,
      endpoint,
      severity: 'medium',
      message: 'Invalid origin detected',
      metadata: { origin: request.headers.get('origin') }
    });
    
    return NextResponse.json(
      { error: 'Invalid origin' },
      { status: 403 }
    );
  }
  
  // Rate limiting
  const isStrictEndpoint = endpoint.includes('/auth/') || endpoint.includes('/api/');
  if (!rateLimit(request, isStrictEndpoint)) {
    logSecurityEvent('rate_limit_exceeded', {
      ip,
      userAgent,
      endpoint,
      severity: 'medium',
      message: 'Rate limit exceeded'
    });
    
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: { 'Retry-After': '900' } }
    );
  }
  
  return null; // No security issues
}
