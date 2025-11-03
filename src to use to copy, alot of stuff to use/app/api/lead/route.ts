import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema, waitlistFormSchema } from '@/lib/validate';
import { sendLeadEmail, sendWaitlistEmail } from '@/lib/mail';
import { headers } from 'next/headers';
import { apiRateLimit, validateRequestSize, sanitizeInput } from '@/lib/validation';

// Simple rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string, limit: number = 5, windowMs: number = 15 * 60 * 1000) {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= limit) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Request size validation
    if (!validateRequestSize(request, 1024 * 1024)) { // 1MB limit
      return NextResponse.json(
        { error: 'Request too large' },
        { status: 413 }
      );
    }

    // Enhanced rate limiting
    const rateLimitResult = apiRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimitResult.retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter.toString(),
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString()
          }
        }
      );
    }

    const body = await request.json();
    const { source, ...data } = body;

    // Sanitize input data
    const sanitizedData = Object.fromEntries(
      Object.entries(data).map(([key, value]: [string, any]) => [
        key, 
        typeof value === 'string' ? sanitizeInput(value) : value
      ])
    );

    if (source === 'contact') {
      // Validate contact form data with sanitized input
      const validatedData = contactFormSchema.parse(sanitizedData);
      
      // Send email
      const success = await sendLeadEmail({
        ...validatedData,
        email: validatedData.email || '',
        message: validatedData.message || '',
        source: 'contact',
      });

      if (success) {
        return NextResponse.json({ ok: true });
      } else {
        return NextResponse.json({ ok: false }, { status: 500 });
      }
    } else if (source === 'waitlist') {
      // Validate waitlist form data with sanitized input
      const validatedData = waitlistFormSchema.parse(sanitizedData);
      
      // Send email
      const success = await sendWaitlistEmail(validatedData);

      if (success) {
        return NextResponse.json({ ok: true });
      } else {
        return NextResponse.json({ ok: false }, { status: 500 });
      }
    } else {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}