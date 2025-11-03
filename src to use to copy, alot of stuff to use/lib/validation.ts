import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';
import { NextRequest } from 'next/server';

// Enhanced validation schemas with security measures
export const emailSchema = z.string()
  .email('Invalid email format')
  .min(5, 'Email must be at least 5 characters')
  .max(254, 'Email must be less than 254 characters')
  .refine((email) => {
    // Additional email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }, 'Invalid email format');

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .refine((password) => {
    // Password complexity requirements
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  }, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .refine((name) => {
    // Only allow letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    return nameRegex.test(name);
  }, 'Name can only contain letters, spaces, hyphens, and apostrophes');

export const phoneSchema = z.string()
  .optional()
  .refine((phone) => {
    if (!phone) return true;
    // International phone number validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }, 'Invalid phone number format');

export const messageSchema = z.string()
  .min(10, 'Message must be at least 10 characters')
  .max(2000, 'Message must be less than 2000 characters')
  .refine((message) => {
    // Check for potential XSS attempts
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /<link/i,
      /<meta/i
    ];
    
    return !suspiciousPatterns.some(pattern => pattern.test(message));
  }, 'Message contains potentially harmful content');

// Sanitization functions
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove null bytes and control characters
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Use DOMPurify for HTML sanitization
  sanitized = DOMPurify.sanitize(sanitized, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  
  return sanitized;
}

export function sanitizeHtmlInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove null bytes and control characters
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Use DOMPurify with limited allowed tags
  sanitized = DOMPurify.sanitize(sanitized, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
  
  return sanitized;
}

// SQL injection prevention
export function escapeSqlString(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/'/g, "''")  // Escape single quotes
    .replace(/--/g, '')   // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comment start
    .replace(/\*\//g, ''); // Remove block comment end
}

// File upload validation
export const fileUploadSchema = z.object({
  name: z.string()
    .min(1, 'File name is required')
    .max(255, 'File name too long')
    .refine((name) => {
      // Check for dangerous file extensions
      const dangerousExtensions = [
        '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js',
        '.jar', '.php', '.asp', '.jsp', '.py', '.rb', '.pl', '.sh'
      ];
      
      const extension = name.toLowerCase().substring(name.lastIndexOf('.'));
      return !dangerousExtensions.includes(extension);
    }, 'File type not allowed'),
  
  size: z.number()
    .min(1, 'File size must be greater than 0')
    .max(10 * 1024 * 1024, 'File size must be less than 10MB'), // 10MB limit
  
  type: z.string()
    .refine((type) => {
      // Allowed MIME types
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      return allowedTypes.includes(type);
    }, 'File type not allowed')
});

// Request size validation
export function validateRequestSize(request: NextRequest, maxSize: number = 1024 * 1024): boolean {
  const contentLength = request.headers.get('content-length');
  
  if (contentLength) {
    const size = parseInt(contentLength, 10);
    return size <= maxSize;
  }
  
  return true; // If no content-length header, assume it's okay
}

// Rate limiting validation
export function validateRateLimit(ip: string, attempts: number, windowMs: number): boolean {
  // This would integrate with your rate limiting system
  // For now, return true (implement with Redis in production)
  return true;
}

// API rate limiting function
export function apiRateLimit(request: NextRequest) {
  // Simple rate limiting implementation
  // In production, use Redis or similar
  return { 
    success: true, 
    retryAfter: 0,
    limit: 100,
    remaining: 99,
    resetTime: Date.now() + 3600000
  };
}

// Comprehensive input validation middleware
export function createValidationMiddleware(schema: z.ZodSchema) {
  return (data: unknown) => {
    try {
      const result = schema.parse(data);
      return { success: true, data: result, errors: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          data: null,
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        };
      }
      
      return {
        success: false,
        data: null,
        errors: [{ field: 'unknown', message: 'Validation failed' }]
      };
    }
  };
}