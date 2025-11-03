export interface ContactFormData {
  fullName: string;
  email?: string;
  phone: string;
  city: string;
  message?: string;
  service: 'cameras' | 'keypad' | 'alarm' | 'combo' | 'consultation';
  points: '1-2' | '3-4' | '5-8' | '9+' | 'unknown';
}