import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/auth-server';
import { z } from 'zod';
import crypto from 'crypto';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = forgotPasswordSchema.parse(body);
    const { email } = validatedData;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration attacks
    // But only send email if user actually exists
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset token in database (you might want to create a separate table for this)
      // For now, we'll use a simple approach with user metadata
      await prisma.user.update({
        where: { id: user.id },
        data: {
          // You might want to add resetToken and resetTokenExpiry fields to your User model
          // For now, we'll just log the event
        },
      });

      // Log the password reset request
      await logAuditEvent(user.id, 'PASSWORD_RESET_REQUESTED', request.ip, JSON.stringify({ 
        email,
        resetToken: resetToken.substring(0, 8) + '...' // Only log partial token
      }));

      // TODO: Send email with reset link
      // For now, we'll just log that we would send an email
      console.log(`Password reset email would be sent to ${email} with token: ${resetToken}`);
      console.log(`Reset link: ${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`);
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.',
    });

  } catch (error: any) {
    console.error('Forgot password error:', error);

    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    await logAuditEvent(null, 'PASSWORD_RESET_FAILURE', request.ip, JSON.stringify({ 
      reason: 'Server error', 
      error: error.message 
    }));

    return NextResponse.json(
      { error: 'Failed to process password reset request. Please try again later.' },
      { status: 500 }
    );
  }
}