import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

const sql = neon();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Password must be at least 6 characters' 
      }, { status: 400 });
    }

    // Check if user already exists
    const existing = await sql`
      SELECT id FROM users 
      WHERE email = ${email} OR phone = ${phone}
      LIMIT 1
    `.catch(() => null);

    if (existing && existing.length > 0) {
      return NextResponse.json({ 
        ok: false, 
        error: 'User already exists with this email or phone' 
      }, { status: 400 });
    }

    // Create user (in production, hash password!)
    // For now, simple implementation - in production, use bcrypt or similar
    const [user] = await sql`
      INSERT INTO users (name, email, phone, password_hash, role, created_at)
      VALUES (${name}, ${email}, ${phone}, ${password}, 'customer', NOW())
      RETURNING id, name, email, phone, role
    `.catch(async (e) => {
      // If users table doesn't exist, create it first
      if (e.message?.includes('does not exist') || e.message?.includes('relation')) {
        await sql`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE,
            phone VARCHAR(20) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'customer',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          )
        `;

        // Try again after creating table
        return await sql`
          INSERT INTO users (name, email, phone, password_hash, role, created_at)
          VALUES (${name}, ${email}, ${phone}, ${password}, 'customer', NOW())
          RETURNING id, name, email, phone, role
        `;
      }
      throw e;
    });

    // Send welcome email (async, don't wait)
    if (email) {
      emailService.sendWelcomeEmail({
        user: { name, email }
      }).catch(err => console.error('Failed to send welcome email:', err));
    }

    // In production, generate JWT token
    const token = `user_${user.id}_${Date.now()}`;

    return NextResponse.json({ 
      ok: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token 
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Registration failed' 
    }, { status: 500 });
  }
}

