// Email service using Resend (simplified version)
// For production, configure RESEND_API_KEY in Netlify Environment Variables

export interface EmailTemplate {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export interface LeadNotificationEmail {
  lead: {
    name: string;
    email?: string;
    phone?: string;
    city?: string;
    message?: string;
    product_sku?: string;
    source?: string;
  };
}

export interface WelcomeEmail {
  user: {
    name: string;
    email: string;
    organizationName?: string;
  };
}

export interface PasswordResetEmail {
  user: {
    name: string;
    email: string;
  };
  resetLink: string;
}

export interface ConfirmationEmail {
  customerData: {
    fullName: string;
    phone: string;
    email?: string;
    city?: string;
    service?: string;
    message?: string;
  };
}

class EmailService {
  private fromEmail = 'Aegis Spectra <noreply@aegis-spectra.com>';

  async sendEmail(template: EmailTemplate) {
    // In production, use Resend API
    // For now, log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email would be sent:', {
        to: template.to,
        subject: template.subject,
        from: template.from || this.fromEmail
      });
      return { success: true, messageId: 'dev-' + Date.now() };
    }

    // Production: Use Resend
    if (!process.env.RESEND_API_KEY) {
      console.warn('Resend API key not configured, email not sent');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const resend = await import('resend');
      const resendClient = new resend.Resend(process.env.RESEND_API_KEY);
      
      const result = await resendClient.emails.send({
        from: template.from || this.fromEmail,
        to: Array.isArray(template.to) ? template.to[0] : template.to,
        subject: template.subject,
        html: template.html,
      });

      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async sendLeadNotification(data: LeadNotificationEmail) {
    const { lead } = data;
    
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
        <head>
          <meta charset="utf-8">
          <title>New Lead - Aegis Spectra</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0f766e, #134e4a); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .lead-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .field { margin: 10px 0; }
            .label { font-weight: bold; color: #0f766e; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛡️ New Lead Received</h1>
              <p>Aegis Spectra Security Solutions</p>
            </div>
            <div class="content">
              <div class="lead-info">
                <h2>Lead Details</h2>
                <div class="field"><span class="label">Name:</span> ${lead.name}</div>
                ${lead.phone ? `<div class="field"><span class="label">Phone:</span> ${lead.phone}</div>` : ''}
                ${lead.email ? `<div class="field"><span class="label">Email:</span> ${lead.email}</div>` : ''}
                ${lead.city ? `<div class="field"><span class="label">City:</span> ${lead.city}</div>` : ''}
                ${lead.product_sku ? `<div class="field"><span class="label">Product:</span> ${lead.product_sku}</div>` : ''}
                ${lead.message ? `<div class="field"><span class="label">Message:</span><div style="margin-top: 10px; padding: 15px; background: #f1f5f9; border-radius: 6px; white-space: pre-wrap;">${lead.message}</div></div>` : ''}
              </div>
            </div>
            <div class="footer">
              <p>Received: ${new Date().toLocaleString('he-IL')}</p>
              <p>© 2024 Aegis Spectra Security Solutions</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@aegis-spectra.com',
      subject: `New Lead: ${lead.name}${lead.city ? ` from ${lead.city}` : ''}`,
      html
    });
  }

  async sendConfirmationEmail(data: ConfirmationEmail) {
    const { customerData } = data;
    
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
        <head>
          <meta charset="utf-8">
          <title>תודה על פנייתך - Aegis Spectra</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0f766e, #134e4a); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 40px; border-radius: 0 0 8px 8px; }
            .highlight { background: #e0f2fe; padding: 15px; border-radius: 8px; border-right: 4px solid #0ea5e9; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛡️ Aegis Spectra Security</h1>
              <p>תודה על פנייתך!</p>
            </div>
            <div class="content">
              <h2>שלום ${customerData.fullName},</h2>
              <p>תודה רבה על פנייתך אלינו! קיבלנו את הפרטים שלך ונחזור אליך בהקדם האפשרי.</p>
              <div class="highlight">
                <strong>מה קורה עכשיו?</strong><br>
                • נחזור אליך בטלפון <strong>${customerData.phone}</strong> תוך 24 שעות<br>
                • נכין עבורך הצעת מחיר מפורטת<br>
                • נקבע פגישה לביקור מדידה (אם נדרש)
              </div>
            </div>
            <div class="footer">
              <p>© 2024 Aegis Spectra Security. כל הזכויות שמורות.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    if (customerData.email) {
      return this.sendEmail({
        to: customerData.email,
        subject: 'תודה על פנייתך - Aegis Spectra Security',
        html
      });
    }

    return { success: false, error: 'No email provided' };
  }

  async sendWelcomeEmail(data: WelcomeEmail) {
    const { user } = data;
    
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
        <head>
          <meta charset="utf-8">
          <title>Welcome to Aegis Spectra</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0f766e, #134e4a); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 40px; border-radius: 0 0 8px 8px; }
            .welcome-box { background: white; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛡️ Welcome to Aegis Spectra</h1>
              <p>Your Security Management Platform</p>
            </div>
            <div class="content">
              <div class="welcome-box">
                <h2>Hello ${user.name}!</h2>
                <p>Welcome to Aegis Spectra, the most advanced security management platform available.</p>
                ${user.organizationName ? `<p>Your account for <strong>${user.organizationName}</strong> has been successfully created.</p>` : ''}
              </div>
            </div>
            <div class="footer">
              <p>Need help? Contact us at admin@aegis-spectra.com</p>
              <p>© 2024 Aegis Spectra Security Solutions</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Welcome to Aegis Spectra - Your Security Platform is Ready!',
      html
    });
  }

  async sendPasswordResetEmail(data: PasswordResetEmail) {
    const { user, resetLink } = data;
    
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
        <head>
          <meta charset="utf-8">
          <title>Password Reset - Aegis Spectra</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0f766e, #134e4a); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .reset-box { background: white; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .cta { background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
              <p>Aegis Spectra Security Solutions</p>
            </div>
            <div class="content">
              <div class="reset-box">
                <h2>Hello ${user.name}!</h2>
                <p>We received a request to reset your password for your Aegis Spectra account.</p>
                <a href="${resetLink}" class="cta">Reset Your Password</a>
                <div class="warning">
                  <p><strong>⚠️ Security Notice:</strong></p>
                  <p>This link will expire in 1 hour for security reasons.</p>
                  <p>If you didn't request this reset, please ignore this email.</p>
                </div>
              </div>
            </div>
            <div class="footer">
              <p>Need help? Contact us at admin@aegis-spectra.com</p>
              <p>© 2024 Aegis Spectra Security Solutions</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Password Reset Request - Aegis Spectra',
      html
    });
  }
}

export const emailService = new EmailService();

