import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, getUserWithRolesAndSubscription, logAuditEvent, getUserRoles, getUserSubscriptionPlan } from '@/lib/auth-server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user with roles and subscription
    const user = await getUserWithRolesAndSubscription(email);

    if (!user || !user.password) {
      await logAuditEvent(null, 'LOGIN_FAILURE', request.headers.get('x-forwarded-for') || 'unknown', JSON.stringify({ 
        reason: 'User not found or no password', 
        email: email 
      }));
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      await logAuditEvent(user.id, 'LOGIN_FAILURE', request.headers.get('x-forwarded-for') || 'unknown', JSON.stringify({ 
        reason: 'Invalid password', 
        email: email 
      }));
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      await logAuditEvent(user.id, 'LOGIN_FAILURE', request.headers.get('x-forwarded-for') || 'unknown', JSON.stringify({ 
        reason: 'User inactive', 
        email: email 
      }));
      return NextResponse.json(
        { message: 'Account is inactive' },
        { status: 401 }
      );
    }


    // Log successful login
    await logAuditEvent(user.id, 'LOGIN_SUCCESS', request.headers.get('x-forwarded-for') || 'unknown', JSON.stringify({ 
      email: email,
      source: 'web'
    }));

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        organizationId: user.organizationId,
        roles: getUserRoles(user),
        subscriptionPlan: subscriptionPlan
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        type: 'refresh'
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Return user data and tokens
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
        roles: getUserRoles(user),
        subscriptionPlan: subscriptionPlan
      },
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 3600 // 1 hour
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}