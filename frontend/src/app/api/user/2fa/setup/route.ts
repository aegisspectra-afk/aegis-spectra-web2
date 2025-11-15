import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-server';
import { neon } from '@netlify/neon';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

// Simple base32 secret generator
function generateSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for 2FA setup');
  sql = null;
}

// GET - Generate 2FA secret and QR code
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || !user.email) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate secret
    const secret = generateSecret();
    const serviceName = 'Aegis Spectra';
    const otpAuthUrl = `otpauth://totp/${encodeURIComponent(serviceName)}:${encodeURIComponent(user.email || '')}?secret=${secret}&issuer=${encodeURIComponent(serviceName)}&algorithm=SHA1&digits=6&period=30`;

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl);

    // Store temporary secret in database (will be verified and saved after user confirms)
    if (sql) {
      try {
        await sql`
          UPDATE users
          SET two_factor_secret_temp = ${secret},
              two_factor_secret_temp_created = NOW()
          WHERE id = ${user.id}
        `.catch(() => {});
      } catch (dbError: any) {
        console.error('Database error storing temp 2FA secret:', dbError);
      }
    }

    return NextResponse.json({
      ok: true,
      secret: secret,
      qrCode: qrCodeUrl,
      manualEntryKey: secret,
    });
  } catch (error: any) {
    console.error('Error generating 2FA secret:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to generate 2FA secret' },
      { status: 500 }
    );
  }
}

// POST - Verify and enable 2FA
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || !user.email) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    // Get temporary secret from database
    if (!sql) {
      return NextResponse.json(
        { ok: false, error: 'Database not available' },
        { status: 503 }
      );
    }

    const [userData] = await sql`
      SELECT two_factor_secret_temp, two_factor_secret_temp_created
      FROM users
      WHERE id = ${user.id}
    `.catch(() => []);

    if (!userData || !userData.two_factor_secret_temp) {
      return NextResponse.json(
        { ok: false, error: '2FA setup not initiated. Please start setup first.' },
        { status: 400 }
      );
    }

    // Verify token
    let verified = false;
    try {
      verified = authenticator.verify({
        token,
        secret: userData.two_factor_secret_temp,
        window: 2, // Allow 2 time steps before/after
      });
    } catch (verifyError: any) {
      console.error('Token verification error:', verifyError);
      verified = false;
    }

    if (!verified) {
      return NextResponse.json(
        { ok: false, error: 'Invalid token. Please try again.' },
        { status: 400 }
      );
    }

    // Enable 2FA and save secret
    await sql`
      UPDATE users
      SET 
        two_factor_enabled = true,
        two_factor_secret = ${userData.two_factor_secret_temp},
        two_factor_secret_temp = NULL,
        two_factor_secret_temp_created = NULL,
        updated_at = NOW()
      WHERE id = ${user.id}
    `.catch(() => {
      throw new Error('Failed to enable 2FA');
    });

    return NextResponse.json({
      ok: true,
      message: '2FA enabled successfully',
    });
  } catch (error: any) {
    console.error('Error enabling 2FA:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Failed to enable 2FA' },
      { status: 500 }
    );
  }
}

// DELETE - Disable 2FA
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || !user.email) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { token, password } = body;

    if (!sql) {
      return NextResponse.json(
        { ok: false, error: 'Database not available' },
        { status: 503 }
      );
    }

    // Verify 2FA token if provided
    if (token) {
      const [userData] = await sql`
        SELECT two_factor_secret
        FROM users
        WHERE id = ${user.id}
      `.catch(() => []);

      if (userData?.two_factor_secret) {
        let verified = false;
        try {
          verified = authenticator.verify({
            token,
            secret: userData.two_factor_secret,
            window: 2,
          });
        } catch (verifyError: any) {
          verified = false;
        }

        if (!verified) {
          return NextResponse.json(
            { ok: false, error: 'Invalid 2FA token' },
            { status: 400 }
          );
        }
      }
    }

    // Disable 2FA
    await sql`
      UPDATE users
      SET 
        two_factor_enabled = false,
        two_factor_secret = NULL,
        two_factor_secret_temp = NULL,
        two_factor_secret_temp_created = NULL,
        updated_at = NOW()
      WHERE id = ${user.id}
    `.catch(() => {
      throw new Error('Failed to disable 2FA');
    });

    return NextResponse.json({
      ok: true,
      message: '2FA disabled successfully',
    });
  } catch (error: any) {
    console.error('Error disabling 2FA:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Failed to disable 2FA' },
      { status: 500 }
    );
  }
}

