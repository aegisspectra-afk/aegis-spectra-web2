// CSRF protection utilities

import { randomBytes, createHmac } from 'crypto';

interface CSRFToken {
  token: string;
  expires: number;
}

// In-memory store for CSRF tokens (in production, use Redis or database)
const tokenStore = new Map<string, CSRFToken>();

// Generate a secure random token
function generateToken(): string {
  return randomBytes(32).toString('hex');
}

// Create HMAC signature for token validation
function createSignature(token: string, secret: string): string {
  return createHmac('sha256', secret).update(token).digest('hex');
}

// Generate CSRF token
export function generateCSRFToken(sessionId: string, secret: string): string {
  const token = generateToken();
  const signature = createSignature(token, secret);
  const fullToken = `${token}.${signature}`;
  
  // Store token with expiration (1 hour)
  tokenStore.set(sessionId, {
    token: fullToken,
    expires: Date.now() + 60 * 60 * 1000,
  });
  
  return fullToken;
}

// Validate CSRF token
export function validateCSRFToken(
  sessionId: string, 
  token: string, 
  secret: string
): boolean {
  const stored = tokenStore.get(sessionId);
  
  if (!stored || Date.now() > stored.expires) {
    // Token expired or doesn't exist
    tokenStore.delete(sessionId);
    return false;
  }
  
  if (stored.token !== token) {
    return false;
  }
  
  // Verify signature
  const [tokenPart, signature] = token.split('.');
  if (!tokenPart || !signature) {
    return false;
  }
  
  const expectedSignature = createSignature(tokenPart, secret);
  return signature === expectedSignature;
}

// Clean up expired tokens
export function cleanupExpiredTokens(): void {
  const now = Date.now();
  for (const [sessionId, token] of Array.from(tokenStore.entries())) {
    if (now > token.expires) {
      tokenStore.delete(sessionId);
    }
  }
}

// Middleware for CSRF protection
export function withCSRFProtection(secret: string) {
  return (handler: Function) => {
    return async (request: Request, ...args: any[]) => {
      // Skip CSRF check for GET requests
      if (request.method === 'GET') {
        return handler(request, ...args);
      }
      
      // Get session ID from headers or cookies
      const sessionId = request.headers.get('x-session-id') || 
                       request.headers.get('cookie')?.match(/sessionId=([^;]+)/)?.[1];
      
      if (!sessionId) {
        return new Response(
          JSON.stringify({ error: 'Session ID required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Get CSRF token from headers
      const csrfToken = request.headers.get('x-csrf-token');
      
      if (!csrfToken) {
        return new Response(
          JSON.stringify({ error: 'CSRF token required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Validate CSRF token
      if (!validateCSRFToken(sessionId, csrfToken, secret)) {
        return new Response(
          JSON.stringify({ error: 'Invalid CSRF token' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      return handler(request, ...args);
    };
  };
}

// Generate CSRF token for client-side forms
export function getCSRFToken(sessionId: string, secret: string): string {
  return generateCSRFToken(sessionId, secret);
}

// Clean up expired tokens periodically
setInterval(cleanupExpiredTokens, 5 * 60 * 1000); // Every 5 minutes