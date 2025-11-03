import nodemailer from 'nodemailer';
import { google } from 'googleapis';

type MailArgs = { to: string; subject: string; html: string };

async function getTransport() {
  const host = process.env.GMAIL_SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.GMAIL_SMTP_PORT || 465);
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD; // use App Password (not account password)

  // Prefer OAuth2 if configured
  const clientId = process.env.GMAIL_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GMAIL_OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.GMAIL_OAUTH_REDIRECT_URI || 'https://developers.google.com/oauthplayground';
  const refreshToken = process.env.GMAIL_OAUTH_REFRESH_TOKEN;

  if (clientId && clientSecret && refreshToken && user) {
    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    oAuth2Client.setCredentials({ refresh_token: refreshToken });
    const accessToken = await oAuth2Client.getAccessToken();
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user,
        clientId,
        clientSecret,
        refreshToken,
        accessToken: (accessToken as any)?.token,
      },
    });
  }

  if (!user || !pass) throw new Error('Gmail SMTP not configured');
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
}

export async function sendMail({ to, subject, html }: MailArgs) {
  const transporter = await getTransport();
  const fromName = process.env.MAIL_FROM_NAME || 'Aegis Spectra';
  const from = `${fromName} <${process.env.GMAIL_USER}>`;
  await transporter.sendMail({ from, to, subject, html });
}


