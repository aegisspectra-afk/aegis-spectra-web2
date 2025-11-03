// Placeholder for email functionality
// TODO: Integrate with email provider (SendGrid, Resend, etc.)

export interface LeadData {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  service: 'cameras' | 'keypad' | 'alarm' | 'combo' | 'consultation' | 'installation' | 'saas';
  source: 'contact' | 'waitlist';
}

export interface WaitlistData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
}

export const sendLeadEmail = async (data: LeadData): Promise<boolean> => {
  // TODO: Implement actual email sending
  console.log('Lead email would be sent:', {
    to: 'aegisspectra@gmail.com',
    data: {
      ...data,
      phone: data.phone ? data.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2') : undefined, // Mask phone
      email: data.email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Mask email
    }
  });
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
};

export const sendWaitlistEmail = async (data: WaitlistData): Promise<boolean> => {
  // TODO: Implement actual email sending
  console.log('Waitlist email would be sent:', {
    to: 'aegisspectra@gmail.com',
    data: {
      ...data,
      email: data.email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Mask email
    }
  });
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
};