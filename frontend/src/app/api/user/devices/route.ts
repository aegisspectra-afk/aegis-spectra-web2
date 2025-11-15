import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { neon } from '@netlify/neon';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for devices');
  sql = null;
}

export const dynamic = 'force-dynamic';

// GET - Get user devices
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    // If no database, return current device only
    if (!sql) {
      console.log('Database not available, using fallback devices');
      return NextResponse.json({
        ok: true,
        devices: [{
          id: 'current',
          name: 'מכשיר נוכחי',
          type: 'desktop',
          browser: 'Unknown',
          os: 'Unknown',
          last_active: new Date().toISOString(),
          current: true,
        }],
      });
    }

    try {
      // Create devices table if not exists
      await sql`
        CREATE TABLE IF NOT EXISTS user_devices (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          user_email VARCHAR(255),
          device_id VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          browser VARCHAR(255),
          os VARCHAR(255),
          ip_address VARCHAR(45),
          last_active TIMESTAMP DEFAULT NOW(),
          created_at TIMESTAMP DEFAULT NOW()
        )
      `.catch(() => {});

      const devices = await sql`
        SELECT id, device_id, name, type, browser, os, ip_address, last_active
        FROM user_devices
        WHERE user_id = ${user.id} OR user_email = ${user.email}
        ORDER BY last_active DESC
        LIMIT 20
      `.catch(() => []);

      return NextResponse.json({
        ok: true,
        devices: devices.map((d: any) => ({
          id: d.id.toString(),
          name: d.name,
          type: d.type,
          browser: d.browser || 'Unknown',
          os: d.os || 'Unknown',
          last_active: d.last_active,
          current: false, // TODO: Check if this is current device
          ip_address: d.ip_address,
        })),
      });
    } catch (dbError: any) {
      console.error('Database error fetching devices:', dbError);
      return NextResponse.json({
        ok: true,
        devices: [],
      });
    }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Error fetching devices:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch devices' },
      { status: 500 }
    );
  }
}

