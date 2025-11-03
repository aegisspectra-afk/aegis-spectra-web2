// PayPal Configuration
export const paypalConfig = {
  // Sandbox credentials (for testing)
  clientId: process.env.PAYPAL_CLIENT_ID || 'AXKnrcgfXhlRm6yv_NWi8mqmuTFrNmFBpzPfDvDX8m4i7KdjsoNxzK2E62aBgZFyOyHOhiAs8mJcRKAp',
  clientSecret: process.env.PAYPAL_CLIENT_SECRET || 'YOUR_PAYPAL_CLIENT_SECRET_HERE',
  
  // Environment
  environment: process.env.PAYPAL_ENVIRONMENT || 'sandbox',
  
  // API URLs
  apiBaseUrl: process.env.PAYPAL_API_BASE_URL || 'https://api-m.sandbox.paypal.com',
  webUrl: process.env.PAYPAL_WEB_URL || 'https://www.sandbox.paypal.com',
  
  // Currency
  currency: 'ILS', // Israeli Shekel
  
  // Intent
  intent: 'CAPTURE', // or 'AUTHORIZE'
  
  // Webhook configuration
  webhookId: process.env.PAYPAL_WEBHOOK_ID || '',
  webhookSecret: process.env.PAYPAL_WEBHOOK_SECRET || '',
};

// Validate PayPal configuration
export function validatePayPalConfig() {
  const errors: string[] = [];
  
  if (!paypalConfig.clientId) {
    errors.push('PAYPAL_CLIENT_ID is required');
  }
  
  if (!paypalConfig.clientSecret || paypalConfig.clientSecret === 'YOUR_PAYPAL_CLIENT_SECRET_HERE') {
    errors.push('PAYPAL_CLIENT_SECRET is required');
  }
  
  if (paypalConfig.environment === 'live' && !paypalConfig.webhookId) {
    errors.push('PAYPAL_WEBHOOK_ID is required for live environment');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// PayPal SDK Configuration
export const paypalSDKConfig = {
  clientId: paypalConfig.clientId,
  environment: paypalConfig.environment as 'sandbox' | 'live',
  currency: paypalConfig.currency,
  intent: paypalConfig.intent,
};