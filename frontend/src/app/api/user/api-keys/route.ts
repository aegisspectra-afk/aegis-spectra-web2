import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { neon } from '@netlify/neon';
import crypto from 'crypto';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for API keys');
  sql = null;
}

export const dynamic = 'force-dynamic';

// GET - Get user API keys
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    // If no database, return empty keys
    if (!sql) {
      console.log('Database not available, using fallback API keys');
      return NextResponse.json({
        ok: true,
        keys: [],
      });
    }

    try {
      // Create API keys table if not exists
      await sql`
        CREATE TABLE IF NOT EXISTS user_api_keys (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          user_email VARCHAR(255),
          name VARCHAR(255) NOT NULL,
          key_hash VARCHAR(255) UNIQUE NOT NULL,
          key_prefix VARCHAR(20) NOT NULL,
          status VARCHAR(50) DEFAULT 'active',
          usage_count INTEGER DEFAULT 0,
          last_used TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `.catch(() => {});

      const keys = await sql`
        SELECT id, name, key_prefix, status, usage_count, last_used, created_at
        FROM user_api_keys
        WHERE user_id = ${user.id} OR user_email = ${user.email}
        ORDER BY created_at DESC
      `.catch(() => []);

      return NextResponse.json({
        ok: true,
        keys: keys.map((k: any) => ({
          id: k.id.toString(),
          name: k.name,
          key_prefix: k.key_prefix,
          status: k.status,
          usage_count: k.usage_count || 0,
          last_used: k.last_used,
          created_at: k.created_at,
        })),
      });
    } catch (dbError: any) {
      console.error('Database error fetching API keys:', dbError);
      return NextResponse.json({
        ok: true,
        keys: [],
      });
    }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST - Create new API key
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { ok: false, error: 'שם המפתח נדרש' },
        { status: 400 }
      );
    }

    // Generate API key
    const apiKey = `aegis_${crypto.randomBytes(32).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const keyPrefix = apiKey.substring(0, 12);

    if (!sql) {
      return NextResponse.json({
        ok: true,
        key: {
          id: '1',
          name,
          key_prefix: keyPrefix,
          full_key: apiKey, // Only return full key on creation
        },
      });
    }

    try {
      const [newKey] = await sql`
        INSERT INTO user_api_keys (user_id, user_email, name, key_hash, key_prefix, status)
        VALUES (${user.id}, ${user.email}, ${name.trim()}, ${keyHash}, ${keyPrefix}, 'active')
        RETURNING id, name, key_prefix
      `.catch(() => []);

      if (!newKey) {
        throw new Error('Failed to create API key');
      }

      return NextResponse.json({
        ok: true,
        key: {
          id: newKey.id.toString(),
          name: newKey.name,
          key_prefix: newKey.key_prefix,
          full_key: apiKey, // Only return full key on creation
        },
      });
    } catch (dbError: any) {
      console.error('Database error creating API key:', dbError);
      return NextResponse.json(
        { ok: false, error: 'Failed to create API key' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Error creating API key:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

