import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, logAuditEvent } from '@/lib/auth-server';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = resetPasswordSchema.parse(body);
    const { token, password } = validatedData;

    // TODO: Implement proper token validation and user lookup
    // For now, we'll simulate the process
    // In a real implementation, you would:
    // 1. Validate the reset token against the database
    // 2. Find the user associated with the token
    // 3. Check if the token has expired
    // 4. Update the user's password
    // 5. Invalidate the reset token

    // For demo purposes, we'll assume the token is valid
    // and find a user by some criteria (this is not secure for production)
    const user = await prisma.user.findFirst({
      where: {
        // In production, you would find by reset token
        // For now, we'll just find any user for demo
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        // TODO: Clear reset token fields
      },
    });

    // Log the password reset
    await logAuditEvent(user.id, 'PASSWORD_RESET_SUCCESS', request.ip, JSON.stringify({ 
      email: user.email 
    }));

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });

  } catch (error: any) {
    console.error('Password reset error:', error);

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
      { error: 'Failed to reset password. Please try again later.' },
      { status: 500 }
    );
  }
}