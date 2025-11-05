/**
 * Package Price Calculator - Utility Function לחישוב מחיר חבילה
 */
import { Package, PackagePricing } from '@/types/packages';

export interface PackagePriceOptions {
  cameras?: number;
  aiDetection?: 'basic' | 'advanced' | 'enterprise';
  storage?: string; // e.g., "2TB", "4TB"
  addons?: string[]; // Array of addon IDs
  installationIncluded?: boolean;
  maintenance?: boolean;
}

export interface PackagePriceBreakdown {
  base: number;
  additionalCameras: number;
  aiUpgrade: number;
  storageUpgrade: number;
  addons: number;
  installation: number;
  maintenance: number;
  subtotal: number;
  discounts: number;
  total: number;
  currency: 'ILS';
}

/**
 * Calculate package price based on options
 */
export function calculatePackagePrice(
  packageData: Package,
  options: PackagePriceOptions = {}
): PackagePriceBreakdown {
  const pricing = packageData.pricing;
  let breakdown: PackagePriceBreakdown = {
    base: pricing.base,
    additionalCameras: 0,
    aiUpgrade: 0,
    storageUpgrade: 0,
    addons: 0,
    installation: 0,
    maintenance: 0,
    subtotal: 0,
    discounts: 0,
    total: 0,
    currency: pricing.currency,
  };

  // Calculate additional cameras cost
  if (options.cameras && pricing.additionalCameras) {
    const defaultCameras = packageData.specifications.cameras.default;
    const additionalCount = Math.max(0, options.cameras - defaultCameras);
    const maxAdditional = pricing.additionalCameras.max || Infinity;
    const actualAdditional = Math.min(additionalCount, maxAdditional);
    breakdown.additionalCameras = actualAdditional * pricing.additionalCameras.pricePerCamera;
  }

  // Calculate AI upgrade cost
  if (options.aiDetection && pricing.upgrades?.ai) {
    const aiUpgrades = pricing.upgrades.ai;
    const defaultAI = packageData.specifications.aiDetection?.level || 'basic';
    
    if (options.aiDetection === 'advanced' && defaultAI === 'basic') {
      breakdown.aiUpgrade = aiUpgrades.advanced - (aiUpgrades.basic || 0);
    } else if (options.aiDetection === 'enterprise') {
      breakdown.aiUpgrade = aiUpgrades.enterprise - (aiUpgrades[defaultAI] || 0);
    }
  }

  // Calculate storage upgrade cost
  if (options.storage && pricing.upgrades?.storage) {
    const storageUpgrades = pricing.upgrades.storage;
    breakdown.storageUpgrade = storageUpgrades[options.storage] || 0;
  }

  // Calculate addons cost
  if (options.addons && pricing.addons) {
    breakdown.addons = pricing.addons
      .filter((addon) => options.addons?.includes(addon.id))
      .reduce((sum, addon) => sum + addon.price, 0);
  }

  // Calculate installation cost
  if (!pricing.installation.included || options.installationIncluded === false) {
    breakdown.installation = pricing.installation.price || 0;
  }

  // Calculate maintenance cost
  if (options.maintenance && pricing.maintenance) {
    breakdown.maintenance = pricing.maintenance.annual;
  }

  // Calculate subtotal
  breakdown.subtotal =
    breakdown.base +
    breakdown.additionalCameras +
    breakdown.aiUpgrade +
    breakdown.storageUpgrade +
    breakdown.addons +
    breakdown.installation +
    breakdown.maintenance;

  // Apply discount rules
  if (pricing.discountRules && options.cameras) {
    for (const rule of pricing.discountRules) {
      // Simple rule evaluation (can be extended)
      if (rule.condition.includes('cameras >')) {
        const threshold = parseInt(rule.condition.match(/\d+/)?.[0] || '0');
        if (options.cameras > threshold) {
          const discountAmount = (breakdown.subtotal * rule.discount) / 100;
          breakdown.discounts += discountAmount;
        }
      } else if (rule.condition.includes('storage >=') && options.storage) {
        const threshold = rule.condition.match(/\d+TB/)?.[0];
        if (threshold && options.storage >= threshold) {
          const discountAmount = (breakdown.subtotal * rule.discount) / 100;
          breakdown.discounts += discountAmount;
        }
      }
    }
  }

  // Calculate total
  breakdown.total = Math.max(0, breakdown.subtotal - breakdown.discounts);

  return breakdown;
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: 'ILS' = 'ILS'): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get price range for package
 */
export function getPackagePriceRange(
  packageData: Package,
  options: PackagePriceOptions = {}
): string {
  const minPrice = calculatePackagePrice(packageData, {
    ...options,
    cameras: packageData.specifications.cameras.min,
  }).total;

  const maxPrice = calculatePackagePrice(packageData, {
    ...options,
    cameras: packageData.specifications.cameras.max,
    aiDetection: 'enterprise',
    storage: Object.keys(packageData.pricing.upgrades?.storage || {})[
      Object.keys(packageData.pricing.upgrades?.storage || {}).length - 1
    ],
    addons: packageData.pricing.addons?.map((a) => a.id) || [],
    maintenance: true,
  }).total;

  if (minPrice === maxPrice) {
    return formatPrice(minPrice);
  }

  return `החל מ-${formatPrice(minPrice)}`;
}

