// Email service supporting both Resend API and Gmail SMTP
// For production, configure either:
// - RESEND_API_KEY (recommended for production)
// - GMAIL_USER and GMAIL_APP_PASSWORD (alternative using Gmail SMTP)

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
    // Try Resend first (if configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resendClient = new Resend(process.env.RESEND_API_KEY);
        
        // Handle multiple recipients
        const recipients = Array.isArray(template.to) ? template.to : [template.to];
        
        // Send to all recipients
        const sendPromises = recipients.map(recipient =>
          resendClient.emails.send({
            from: template.from || this.fromEmail,
            to: recipient,
            subject: template.subject,
            html: template.html,
          })
        );
        
        const results = await Promise.all(sendPromises);
        const result = results[0]; // Return first result for compatibility

        console.log('✅ Email sent via Resend:', { to: template.to, messageId: result.data?.id });
        return { success: true, messageId: result.data?.id };
      } catch (error) {
        console.error('Resend email sending failed, trying Gmail SMTP:', error);
        // Fall through to Gmail SMTP
      }
    }

    // Try Gmail SMTP (if configured)
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      try {
        const nodemailer = await import('nodemailer');
        
        // Remove spaces from App Password (Gmail sometimes displays with spaces)
        const appPassword = process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, '');
        const gmailUser = process.env.GMAIL_USER.trim();
        
        const transporter = nodemailer.default.createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: gmailUser,
            pass: appPassword, // Use App Password, not regular password
          },
        });

        // Handle multiple recipients
        const recipients = Array.isArray(template.to) ? template.to : [template.to];
        
        // Send to all recipients
        const sendPromises = recipients.map(recipient =>
          transporter.sendMail({
            from: template.from || `Aegis Spectra <${process.env.GMAIL_USER}>`,
            to: recipient,
            subject: template.subject,
            html: template.html,
          })
        );
        
        const results = await Promise.all(sendPromises);
        const result = results[0]; // Return first result for compatibility

        console.log('✅ Email sent via Gmail SMTP:', { to: template.to, messageId: result.messageId });
        return { success: true, messageId: result.messageId };
      } catch (error: any) {
        console.error('❌ Gmail SMTP email sending failed:', error.message);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    // No email service configured
    console.warn('⚠️ No email service configured. Email not sent:', {
      to: template.to,
      subject: template.subject,
      from: template.from || this.fromEmail
    });
    
    // In development, still return success for testing
    if (process.env.NODE_ENV === 'development') {
      return { success: true, messageId: 'dev-' + Date.now() };
    }
    
    return { success: false, error: 'Email service not configured. Please set RESEND_API_KEY or GMAIL_USER + GMAIL_APP_PASSWORD' };
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
                ${lead.phone ? `<div class="field"><span class="label">Phone:</span> <a href="tel:${lead.phone}">${lead.phone}</a></div>` : ''}
                ${lead.email ? `<div class="field"><span class="label">Email:</span> <a href="mailto:${lead.email}">${lead.email}</a></div>` : ''}
                ${lead.city ? `<div class="field"><span class="label">City:</span> ${lead.city}</div>` : ''}
                ${lead.product_sku ? `<div class="field"><span class="label">Product:</span> ${lead.product_sku}</div>` : ''}
                ${lead.source ? `<div class="field"><span class="label">Source:</span> ${lead.source}</div>` : ''}
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

    // Send to company email (aegisspectra@gmail.com)
    return this.sendEmail({
      to: process.env.ADMIN_EMAIL || 'aegisspectra@gmail.com',
      subject: `🛡️ New Lead: ${lead.name}${lead.city ? ` from ${lead.city}` : ''}`,
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
            .contact-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
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
              ${customerData.message ? `<div class="contact-info"><strong>ההודעה שלך:</strong><div style="margin-top: 10px; padding: 15px; background: #f1f5f9; border-radius: 6px; white-space: pre-wrap;">${customerData.message}</div></div>` : ''}
              <div class="contact-info">
                <strong>פרטי יצירת קשר:</strong><br>
                📞 טלפון: <a href="tel:+972559737025">+972-55-973-7025</a><br>
                📧 אימייל: <a href="mailto:aegisspectra@gmail.com">aegisspectra@gmail.com</a>
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

