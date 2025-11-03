import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailTemplate {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export interface LeadNotificationEmail {
  lead: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    message?: string;
    source: string;
  };
}

export interface WelcomeEmail {
  user: {
    name: string;
    email: string;
    organizationName: string;
  };
}

export interface PasswordResetEmail {
  user: {
    name: string;
    email: string;
  };
  resetLink: string;
}

export interface SubscriptionUpdateEmail {
  user: {
    name: string;
    email: string;
  };
  subscription: {
    plan: string;
    status: string;
    nextBillingDate?: string;
  };
}

class EmailService {
  private fromEmail = 'Aegis Spectra <noreply@aegis-spectra.com>';

  async sendEmail(template: EmailTemplate) {
    if (!process.env.RESEND_API_KEY) {
      console.warn('Resend API key not configured, email not sent');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const result = await resend.emails.send({
        from: template.from || this.fromEmail,
        to: template.to,
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
      <html>
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
            .value { margin-left: 10px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .cta { background: #0f766e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
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
                <div class="field">
                  <span class="label">Name:</span>
                  <span class="value">${lead.name}</span>
                </div>
                <div class="field">
                  <span class="label">Email:</span>
                  <span class="value">${lead.email}</span>
                </div>
                <div class="field">
                  <span class="label">Company:</span>
                  <span class="value">${lead.company || 'Not provided'}</span>
                </div>
                <div class="field">
                  <span class="label">Phone:</span>
                  <span class="value">${lead.phone || 'Not provided'}</span>
                </div>
                <div class="field">
                  <span class="label">Source:</span>
                  <span class="value">${lead.source}</span>
                </div>
                ${lead.message ? `
                <div class="field">
                  <span class="label">Message:</span>
                  <div class="value" style="margin-top: 10px; padding: 15px; background: #f1f5f9; border-radius: 6px; white-space: pre-wrap;">${lead.message}</div>
                </div>
                ` : ''}
              </div>
              
              <div style="text-align: center;">
                <a href="mailto:${lead.email}" class="cta">Reply to Lead</a>
              </div>
            </div>
            
            <div class="footer">
              <p>Lead ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              <p>Received: ${new Date().toLocaleString()}</p>
              <p>© 2024 Aegis Spectra Security Solutions</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: ['admin@aegis-spectra.com'],
      subject: `New Lead: ${lead.name} from ${lead.company || 'Website'}`,
      html
    });
  }

  async sendWelcomeEmail(data: WelcomeEmail) {
    const { user } = data;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Aegis Spectra</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0f766e, #134e4a); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 40px; border-radius: 0 0 8px 8px; }
            .welcome-box { background: white; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .cta { background: #0f766e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
            .feature { background: white; padding: 20px; border-radius: 8px; text-align: center; }
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
                <p>Your account for <strong>${user.organizationName}</strong> has been successfully created.</p>
                
                <a href="${process.env.NEXTAUTH_URL}/panel" class="cta">Access Your Dashboard</a>
              </div>
              
              <h3>What's Next?</h3>
              <div class="features">
                <div class="feature">
                  <h4>📹 Add Cameras</h4>
                  <p>Set up your security cameras and start monitoring</p>
                </div>
                <div class="feature">
                  <h4>👥 Invite Team</h4>
                  <p>Add team members and assign roles</p>
                </div>
                <div class="feature">
                  <h4>📊 View Analytics</h4>
                  <p>Monitor security events and generate reports</p>
                </div>
                <div class="feature">
                  <h4>⚙️ Configure Settings</h4>
                  <p>Customize your security preferences</p>
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
      subject: 'Welcome to Aegis Spectra - Your Security Platform is Ready!',
      html
    });
  }

  async sendPasswordResetEmail(data: PasswordResetEmail) {
    const { user, resetLink } = data;
    
    const html = `
      <!DOCTYPE html>
      <html>
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

  async sendSubscriptionUpdateEmail(data: SubscriptionUpdateEmail) {
    const { user, subscription } = data;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Subscription Update - Aegis Spectra</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0f766e, #134e4a); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .subscription-box { background: white; padding: 30px; border-radius: 8px; margin: 20px 0; }
            .status { padding: 10px 20px; border-radius: 6px; display: inline-block; font-weight: bold; }
            .status.active { background: #dcfce7; color: #166534; }
            .status.trialing { background: #fef3c7; color: #92400e; }
            .status.canceled { background: #fecaca; color: #dc2626; }
            .cta { background: #0f766e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💳 Subscription Update</h1>
              <p>Aegis Spectra Security Solutions</p>
            </div>
            
            <div class="content">
              <div class="subscription-box">
                <h2>Hello ${user.name}!</h2>
                <p>Your subscription has been updated:</p>
                
                <div style="margin: 20px 0;">
                  <p><strong>Plan:</strong> ${subscription.plan}</p>
                  <p><strong>Status:</strong> 
                    <span class="status ${subscription.status.toLowerCase()}">${subscription.status}</span>
                  </p>
                  ${subscription.nextBillingDate ? `
                    <p><strong>Next Billing Date:</strong> ${subscription.nextBillingDate}</p>
                  ` : ''}
                </div>
                
                <div style="text-align: center;">
                  <a href="${process.env.NEXTAUTH_URL}/panel/billing" class="cta">Manage Billing</a>
                </div>
              </div>
            </div>
            
            <div class="footer">
              <p>Questions? Contact us at admin@aegis-spectra.com</p>
              <p>© 2024 Aegis Spectra Security Solutions</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: `Subscription Update - ${subscription.plan} Plan`,
      html
    });
  }
}

export const emailService = new EmailService();