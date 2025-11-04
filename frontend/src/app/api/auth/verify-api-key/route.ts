import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { hashApiKey } from '@/lib/auth';
import { isValidApiKeyFormat, formatApiKeyForDisplay } from '@/lib/api-keys';

const sql = neon();

// Verify API key and get user info
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json({ 
        ok: false, 
        error: 'API key נדרש' 
      }, { status: 400 });
    }

    // Validate API key format
    if (!isValidApiKeyFormat(apiKey)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'API key לא תקין' 
      }, { status: 400 });
    }

    // Hash the provided API key
    const apiKeyHash = hashApiKey(apiKey);

    // Find user by API key hash
    const users = await sql`
      SELECT u.id, u.name, u.email, u.role, u.email_verified, ak.id as api_key_id, ak.last_used, ak.is_active
      FROM users u
      INNER JOIN api_keys ak ON u.api_key_hash = ak.api_key_hash
      WHERE ak.api_key_hash = ${apiKeyHash} AND ak.is_active = true
      LIMIT 1
    `.catch(() => []);

    if (users.length === 0) {
      return NextResponse.json({ 
        ok: false, 
        error: 'API key לא תקין או לא פעיל' 
      }, { status: 401 });
    }

    const user = users[0];

    // Update last used
    await sql`
      UPDATE api_keys 
      SET last_used = NOW()
      WHERE id = ${user.api_key_id}
    `.catch(() => {});

    return NextResponse.json({ 
      ok: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.email_verified
      },
      apiKeyInfo: {
        id: user.api_key_id,
        lastUsed: user.last_used,
        isActive: user.is_active
      }
    });
  } catch (error: any) {
    console.error('Verify API key error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'שגיאה באימות API key' 
    }, { status: 500 });
  }
}

