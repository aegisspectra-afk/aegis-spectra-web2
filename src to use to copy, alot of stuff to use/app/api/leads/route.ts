import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { fullName, phone, city, service, points, message } = body;
    
    if (!fullName || !phone || !city || !service || !points) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send to Google Sheets via Apps Script
    const response = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: process.env.NEXT_PUBLIC_WEBHOOK_SECRET,
        name: fullName,
        phone: phone,
        city: city,
        type: service,
        points: points,
        notes: message || '',
        source: 'אתר'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send to Google Sheets');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit lead' },
      { status: 500 }
    );
  }
}