import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { generateCSRFToken, validateCSRFToken } from '@/lib/csrf';
import { logSecurityEvent } from '@/lib/security';

/**
 * GET /api/security/csrf - Get CSRF token
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sessionId = session.user.id;
    const secret = process.env.CSRF_SECRET || 'default-secret';
    const token = generateCSRFToken(sessionId, secret);

    const response = NextResponse.json({
      success: true,
      data: { token }
    });

    // Set CSRF token cookie (optional)
    // response.headers.set('Set-Cookie', cookie);

    // Log CSRF token generation
    logSecurityEvent('csrf_token_generated', {
      ip: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      endpoint: '/api/security/csrf',
      severity: 'low',
      message: 'CSRF token generated',
      metadata: { userId: session.user.id }
    });

    return response;

  } catch (error) {
    console.error('Error generating CSRF token:', error);
    
    logSecurityEvent('csrf_token_error', {
      ip: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      endpoint: '/api/security/csrf',
      severity: 'high',
      message: 'Error generating CSRF token',
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
    });

    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/csrf - Validate CSRF token
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'CSRF token required' },
        { status: 400 }
      );
    }

    const sessionId = session.user.id;
    const secret = process.env.CSRF_SECRET || 'default-secret';
    const isValid = validateCSRFToken(sessionId, token, secret);

    // Log CSRF validation attempt
    logSecurityEvent('csrf_token_validated', {
      ip: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      endpoint: '/api/security/csrf',
      severity: isValid ? 'low' : 'medium',
      message: isValid ? 'CSRF token validated successfully' : 'Invalid CSRF token provided',
      metadata: { userId: session.user.id, valid: isValid }
    });

    return NextResponse.json({
      success: true,
      data: { valid: isValid }
    });

  } catch (error) {
    console.error('Error validating CSRF token:', error);
    
    logSecurityEvent('csrf_validation_error', {
      ip: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      endpoint: '/api/security/csrf',
      severity: 'high',
      message: 'Error validating CSRF token',
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
    });

    return NextResponse.json(
      { error: 'Failed to validate CSRF token' },
      { status: 500 }
    );
  }
}
