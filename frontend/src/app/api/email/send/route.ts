import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Type and data are required' }, 
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'lead-notification':
        result = await emailService.sendLeadNotification(data);
        break;
      
      case 'confirmation':
        result = await emailService.sendConfirmationEmail(data);
        break;
      
      case 'welcome':
        result = await emailService.sendWelcomeEmail(data);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid email type' }, 
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' }, 
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' }, 
      { status: 500 }
    );
  }
}

