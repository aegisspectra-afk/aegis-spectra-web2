/**
 * Package Types - טיפוסים לחבילות מותאמות
 */

export type PackageCategory = 'Residential' | 'Commercial' | 'Enterprise';

export type PackageType = 'apartment' | 'house' | 'business' | 'enterprise';

export type AIDetectionLevel = 'basic' | 'advanced' | 'enterprise';

export type CameraType = 'IP' | '4MP' | '4K' | 'Color Night' | 'AI';

export type StorageType = 'HDD' | 'SSD' | 'Hybrid';

export type SupportLevel = 'basic' | 'professional' | 'enterprise';

export interface PackageFeature {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface PackageSpecification {
  cameras: {
    min: number;
    max: number;
    default: number;
    types: CameraType[];
  };
  nvr: {
    channels: number;
    type: string;
    model?: string;
  };
  storage: {
    size: string; // e.g., "1TB", "2TB"
    type: StorageType;
    recordingTime?: string; // e.g., "30 days"
  };
  aiDetection?: {
    level: AIDetectionLevel;
    features: string[];
  };
  app: {
    platforms: ('iOS' | 'Android')[];
    language: string;
    features: string[];
  };
  ups?: {
    included: boolean;
    model?: string;
  };
  accessControl?: {
    included: boolean;
    type?: string;
  };
  alarm?: {
    included: boolean;
    type?: string;
  };
  support: {
    level: SupportLevel;
    responseTime?: string;
    features: string[];
  };
  warranty: {
    months: number;
    coverage: string[];
  };
}

export interface PackagePricing {
  base: number;
  currency: 'ILS';
  installation: {
    included: boolean;
    price?: number;
  };
  additionalCameras?: {
    pricePerCamera: number;
    max?: number;
  };
  upgrades?: {
    ai: {
      basic: number;
      advanced: number;
      enterprise: number;
    };
    storage?: {
      [key: string]: number; // e.g., "2TB": 500, "4TB": 1000
    };
  };
  addons?: PackageAddon[];
  maintenance?: {
    annual: number;
    optional: boolean;
  };
  discountRules?: DiscountRule[];
}

export interface DiscountRule {
  condition: string; // e.g., "cameras > 6"
  discount: number; // percentage
  description: string;
}

export interface PackageAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'hardware' | 'service' | 'upgrade';
  optional: boolean;
}

export interface Package {
  id: string;
  slug: string;
  name: string;
  nameHebrew: string;
  category: PackageCategory;
  type: PackageType;
  description: string;
  shortDescription: string;
  priceRange: string; // e.g., "החל מ-₪2,290"
  pricing: PackagePricing;
  specifications: PackageSpecification;
  features: PackageFeature[];
  image?: string;
  heroImage?: string;
  equipmentImages?: string[];
  popular?: boolean;
  recommended?: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  faq?: {
    question: string;
    answer: string;
  }[];
}

