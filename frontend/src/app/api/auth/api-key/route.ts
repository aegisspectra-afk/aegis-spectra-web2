import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, generateApiKey, hashApiKey } from '@/lib/auth';

const sql = neon();

// Get user's API keys
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ 
        ok: false, 
        error: 'לא מאומת' 
      }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Token לא תקין' 
      }, { status: 401 });
    }

    // Get user's API keys
    const apiKeys = await sql`
      SELECT id, name, last_used, created_at, expires_at, is_active
      FROM api_keys 
      WHERE user_id = ${decoded.userId}
      ORDER BY created_at DESC
    `.catch(() => []);

    return NextResponse.json({ 
      ok: true, 
      apiKeys: apiKeys.map(key => ({
        id: key.id,
        name: key.name || 'Default API Key',
        lastUsed: key.last_used,
        createdAt: key.created_at,
        expiresAt: key.expires_at,
        isActive: key.is_active,
        // Don't return actual API key - user should save it when created
        displayKey: `aegis_••••${key.id.toString().padStart(8, '0')}`
      }))
    });
  } catch (error: any) {
    console.error('Get API keys error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'שגיאה בטעינת API keys' 
    }, { status: 500 });
  }
}

// Create new API key
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ 
        ok: false, 
        error: 'לא מאומת' 
      }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Token לא תקין' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    // Generate new API key
    const apiKey = generateApiKey();
    const apiKeyHash = hashApiKey(apiKey);

    // Store API key
    const [newKey] = await sql`
      INSERT INTO api_keys (user_id, api_key_hash, name, is_active, created_at)
      VALUES (${decoded.userId}, ${apiKeyHash}, ${name || 'API Key'}, true, NOW())
      RETURNING id, name, created_at
    `.catch(async (e) => {
      // Create table if doesn't exist
      if (e.message?.includes('does not exist') || e.message?.includes('relation')) {
        await sql`
          CREATE TABLE IF NOT EXISTS api_keys (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            api_key_hash VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255),
            last_used TIMESTAMP,
            created_at TIMESTAMP DEFAULT NOW(),
            expires_at TIMESTAMP,
            is_active BOOLEAN DEFAULT true
          )
        `;

        return await sql`
          INSERT INTO api_keys (user_id, api_key_hash, name, is_active, created_at)
          VALUES (${decoded.userId}, ${apiKeyHash}, ${name || 'API Key'}, true, NOW())
          RETURNING id, name, created_at
        `;
      }
      throw e;
    });

    // Return API key (shown only once!)
    return NextResponse.json({ 
      ok: true, 
      apiKey,
      apiKeyInfo: {
        id: newKey.id,
        name: newKey.name,
        createdAt: newKey.created_at
      },
      message: 'API Key נוצר בהצלחה! אנא שמור אותו - הוא יוצג רק פעם אחת.'
    });
  } catch (error: any) {
    console.error('Create API key error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'שגיאה ביצירת API key' 
    }, { status: 500 });
  }
}

// Delete API key
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ 
        ok: false, 
        error: 'לא מאומת' 
      }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Token לא תקין' 
      }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const keyId = searchParams.get('id');

    if (!keyId) {
      return NextResponse.json({ 
        ok: false, 
        error: 'ID של API key נדרש' 
      }, { status: 400 });
    }

    // Delete API key (only if belongs to user)
    await sql`
      DELETE FROM api_keys 
      WHERE id = ${keyId} AND user_id = ${decoded.userId}
    `;

    return NextResponse.json({ 
      ok: true, 
      message: 'API key נמחק בהצלחה' 
    });
  } catch (error: any) {
    console.error('Delete API key error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'שגיאה במחיקת API key' 
    }, { status: 500 });
  }
}

