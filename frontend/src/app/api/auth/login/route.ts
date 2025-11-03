import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Email and password required' 
      }, { status: 400 });
    }

    // Find user
    const users = await sql`
      SELECT id, name, email, phone, password_hash, role 
      FROM users 
      WHERE email = ${email} OR phone = ${email}
      LIMIT 1
    `.catch(() => []);

    if (users.length === 0) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid email or password' 
      }, { status: 401 });
    }

    const user = users[0];

    // In production, verify password hash!
    // For now, simple comparison (NOT SECURE - use bcrypt in production!)
    if (user.password_hash !== password) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid email or password' 
      }, { status: 401 });
    }

    // Generate token (in production, use JWT)
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
    console.error('Login error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Login failed' 
    }, { status: 500 });
  }
}

