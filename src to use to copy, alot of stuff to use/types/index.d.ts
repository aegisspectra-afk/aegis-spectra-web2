declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export interface Locale {
  code: 'he' | 'en';
  name: string;
  dir: 'ltr' | 'rtl';
}

export interface LeadFormData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  service: 'installation' | 'consultation' | 'saas';
}

export interface WaitlistFormData {
  name: string;
  email: string;
  company?: string;
  pilot: boolean;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}