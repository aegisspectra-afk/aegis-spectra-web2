// Rate limiting utilities for API routes

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum number of requests per window
  message?: string; // Error message when limit is exceeded
  standardHeaders?: boolean; // Return rate limit info in headers
  legacyHeaders?: boolean; // Return rate limit info in legacy headers
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  message?: string;
}

// In-memory store for rate limiting (in production, use Redis)
const store = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(options: RateLimitOptions) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // 100 requests per window
    message = 'Too many requests, please try again later.',
    standardHeaders = true,
    legacyHeaders = false,
  } = options;

  return (identifier: string): RateLimitResult => {
    const now = Date.now();
    const resetTime = now + windowMs;
    
    // Get current data for this identifier
    const current = store.get(identifier);
    
    if (!current || now > current.resetTime) {
      // First request or window has expired
      store.set(identifier, { count: 1, resetTime });
      
      return {
        success: true,
        limit: max,
        remaining: max - 1,
        reset: resetTime,
      };
    }
    
    if (current.count >= max) {
      // Rate limit exceeded
      return {
        success: false,
        limit: max,
        remaining: 0,
        reset: current.resetTime,
        message,
      };
    }
    
    // Increment count
    current.count++;
    store.set(identifier, current);
    
    return {
      success: true,
      limit: max,
      remaining: max - current.count,
      reset: current.resetTime,
    };
  };
}

// Get client IP address
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  // Fallback to a default identifier
  return 'unknown';
}

// Rate limit configurations for different endpoints
export const rateLimitConfigs = {
  // General API endpoints
  api: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'Too many API requests, please try again later.',
  }),
  
  // Contact forms
  contact: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 contact form submissions per hour
    message: 'Too many contact form submissions, please try again later.',
  }),
  
  // Authentication endpoints
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 auth attempts per 15 minutes
    message: 'Too many authentication attempts, please try again later.',
  }),
  
  // Password reset
  passwordReset: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 password reset attempts per hour
    message: 'Too many password reset attempts, please try again later.',
  }),
  
  // Email sending
  email: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 emails per hour
    message: 'Too many email requests, please try again later.',
  }),
  
  // File uploads
  upload: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 uploads per hour
    message: 'Too many file uploads, please try again later.',
  }),
  
  // Search endpoints
  search: rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50, // 50 searches per 5 minutes
    message: 'Too many search requests, please try again later.',
  }),
  
  // Demo requests
  demo: rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 3, // 3 demo requests per day
    message: 'Too many demo requests, please try again tomorrow.',
  }),
  
  // Quote requests
  quote: rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 5, // 5 quote requests per day
    message: 'Too many quote requests, please try again tomorrow.',
  }),
};

// Middleware for rate limiting API routes
export function withRateLimit(
  rateLimiter: (identifier: string) => RateLimitResult,
  getIdentifier: (request: Request) => string = getClientIP
) {
  return (handler: Function) => {
    return async (request: Request, ...args: any[]) => {
      const identifier = getIdentifier(request);
      const result = rateLimiter(identifier);
      
      if (!result.success) {
        return new Response(
          JSON.stringify({ 
            error: result.message,
            limit: result.limit,
            remaining: result.remaining,
            reset: result.reset,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': result.limit.toString(),
              'X-RateLimit-Remaining': result.remaining.toString(),
              'X-RateLimit-Reset': result.reset.toString(),
              'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
            },
          }
        );
      }
      
      // Add rate limit headers to successful responses
      const response = await handler(request, ...args);
      
      if (response instanceof Response) {
        response.headers.set('X-RateLimit-Limit', result.limit.toString());
        response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
        response.headers.set('X-RateLimit-Reset', result.reset.toString());
      }
      
      return response;
    };
  };
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of Array.from(store.entries())) {
    if (now > value.resetTime) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes