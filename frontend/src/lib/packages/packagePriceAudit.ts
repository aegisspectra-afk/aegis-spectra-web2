/**
 * Package Price Audit Tool - כלי לבדיקת מחירי חבילות
 * 
 * כלי זה בודק את המחירים הנוכחיים של החבילות ומשווה אותם למחירים
 * המחושבים על בסיס מחירי המוצרים הבודדים
 */

import { Package } from '@/types/packages';
import { packages } from '@/data/packages';
import { calculatePackagePriceFromComponents, PackageComponents } from './productPrices';

export interface PackageAuditResult {
  packageId: string;
  packageName: string;
  currentPrice: number;
  calculatedPrice: number;
  difference: number;
  differencePercent: number;
  components: {
    cameras: number;
    nvr: number;
    storage: number;
    ups: number;
    installation: number;
    maintenance: number;
    accessories: number;
  };
  status: 'ok' | 'too-low' | 'too-high' | 'missing-data';
  issues: string[];
}

/**
 * ממיר את סוג המצלמה מהחבילה לסוג במערכת המחירים
 */
function mapCameraType(
  cameraTypes: string[],
  aiLevel?: string
): '2mp-basic' | '4mp-standard' | '4mp-ai' | '4k' | '4k-color-night' {
  if (cameraTypes.includes('4K') || cameraTypes.includes('8MP')) {
    if (cameraTypes.includes('Color Night') || cameraTypes.includes('Color')) {
      return '4k-color-night';
    }
    return '4k';
  }
  
  if (cameraTypes.includes('4MP')) {
    if (aiLevel === 'advanced' || aiLevel === 'enterprise') {
      return '4mp-ai';
    }
    return '4mp-standard';
  }
  
  return '2mp-basic';
}

/**
 * ממיר את גודל האחסון מהחבילה
 */
function mapStorageSize(size: string): '1tb' | '2tb' | '4tb' | '8tb' | '16tb' | '32tb' | '64tb' | '128tb' {
  const sizeLower = size.toLowerCase().replace('tb', 'tb');
  const match = sizeLower.match(/(\d+)tb/);
  if (match) {
    const num = parseInt(match[1]);
    if (num >= 128) return '128tb';
    if (num >= 64) return '64tb';
    if (num >= 32) return '32tb';
    if (num >= 16) return '16tb';
    if (num >= 8) return '8tb';
    if (num >= 4) return '4tb';
    if (num >= 2) return '2tb';
    return '1tb';
  }
  return '1tb';
}

/**
 * ממיר את מספר הערוצים של NVR
 */
function mapNvrChannels(channels: number): 4 | 8 | 16 | 32 | 64 | 128 {
  if (channels >= 128) return 128;
  if (channels >= 64) return 64;
  if (channels >= 32) return 32;
  if (channels >= 16) return 16;
  if (channels >= 8) return 8;
  return 4;
}

/**
 * בודק חבילה אחת
 */
export function auditPackage(packageData: Package): PackageAuditResult {
  const issues: string[] = [];
  
  // בניית רכיבי החבילה
  const cameraType = mapCameraType(
    packageData.specifications.cameras.types,
    packageData.specifications.aiDetection?.level
  );
  
  const components: PackageComponents = {
    cameras: {
      count: packageData.specifications.cameras.default,
      type: cameraType,
    },
    nvr: {
      channels: mapNvrChannels(packageData.specifications.nvr.channels),
    },
    storage: {
      size: mapStorageSize(packageData.specifications.storage.size),
    },
    installation: {
      included: packageData.pricing.installation.included,
      type: packageData.specifications.cameras.default <= 4 ? 'basic' :
            packageData.specifications.cameras.default <= 8 ? 'standard' :
            packageData.specifications.cameras.default <= 16 ? 'advanced' : 'enterprise',
    },
  };

  // הוספת UPS אם קיים
  if (packageData.specifications.ups?.included) {
    const upsModel = packageData.specifications.ups.model || '1000va';
    if (upsModel.includes('500')) {
      components.ups = { type: '500va', included: true };
    } else if (upsModel.includes('1000')) {
      components.ups = { type: '1000va', included: true };
    } else if (upsModel.includes('1500')) {
      components.ups = { type: '1500va', included: true };
    }
  }

  // הוספת תחזוקה אם קיימת
  if (packageData.pricing.maintenance) {
    const maintenanceType = 
      packageData.category === 'Enterprise' ? 'enterprise' :
      packageData.category === 'Commercial' ? 'advanced' :
      packageData.specifications.cameras.default >= 8 ? 'standard' : 'basic';
    
    components.maintenance = {
      included: !packageData.pricing.maintenance.optional,
      type: maintenanceType,
    };
  }

  // הוספת תוספות
  if (packageData.pricing.addons && packageData.pricing.addons.length > 0) {
    components.accessories = packageData.pricing.addons
      .filter(addon => !addon.optional || addon.price > 0)
      .map(addon => {
        // מיפוי תוספות
        if (addon.id.includes('ups')) return 'ups-1000va';
        if (addon.id.includes('alarm')) {
          if (addon.id.includes('enterprise')) return 'alarm-enterprise';
          if (addon.id.includes('advanced')) return 'alarm-advanced';
          return 'alarm-basic';
        }
        if (addon.id.includes('access-control')) {
          if (addon.id.includes('enterprise')) return 'access-control-enterprise';
          return 'access-control-basic';
        }
        if (addon.id.includes('intercom')) {
          if (addon.id.includes('pro')) return 'gate-intercom-pro';
          return 'gate-intercom';
        }
        return '';
      })
      .filter(id => id !== '');
  }

  // חישוב מחיר מחושב
  const calculated = calculatePackagePriceFromComponents(components);
  
  // מחיר נוכחי
  const currentPrice = packageData.pricing.base;
  
  // חישוב הבדל
  const difference = currentPrice - calculated.total;
  const differencePercent = currentPrice > 0 
    ? (difference / currentPrice) * 100 
    : 0;

  // זיהוי בעיות
  let status: 'ok' | 'too-low' | 'too-high' | 'missing-data' = 'ok';
  
  if (Math.abs(differencePercent) < 5) {
    status = 'ok';
  } else if (differencePercent < -10) {
    status = 'too-low';
    issues.push(`המחיר נמוך מדי - ${Math.abs(differencePercent).toFixed(1)}% פחות מהמחיר המחושב`);
  } else if (differencePercent > 20) {
    status = 'too-high';
    issues.push(`המחיר גבוה מדי - ${differencePercent.toFixed(1)}% יותר מהמחיר המחושב`);
  }

  // בדיקות נוספות
  if (packageData.pricing.base === 0) {
    status = 'missing-data';
    issues.push('מחיר בסיס לא מוגדר');
  }

  if (!packageData.specifications.cameras.default) {
    issues.push('מספר מצלמות ברירת מחדל לא מוגדר');
  }

  if (!packageData.specifications.storage.size) {
    issues.push('גודל אחסון לא מוגדר');
  }

  return {
    packageId: packageData.id,
    packageName: packageData.nameHebrew,
    currentPrice,
    calculatedPrice: calculated.total,
    difference,
    differencePercent,
    components: {
      cameras: calculated.cameras,
      nvr: calculated.nvr,
      storage: calculated.storage,
      ups: calculated.ups,
      installation: calculated.installation,
      maintenance: calculated.maintenance,
      accessories: calculated.accessories,
    },
    status,
    issues,
  };
}

/**
 * בודק את כל החבילות
 */
export function auditAllPackages(): PackageAuditResult[] {
  return packages.map(pkg => auditPackage(pkg));
}

/**
 * מציג דוח מפורט
 */
export function generateAuditReport(): {
  summary: {
    total: number;
    ok: number;
    tooLow: number;
    tooHigh: number;
    missingData: number;
  };
  results: PackageAuditResult[];
} {
  const results = auditAllPackages();
  
  const summary = {
    total: results.length,
    ok: results.filter(r => r.status === 'ok').length,
    tooLow: results.filter(r => r.status === 'too-low').length,
    tooHigh: results.filter(r => r.status === 'too-high').length,
    missingData: results.filter(r => r.status === 'missing-data').length,
  };

  return {
    summary,
    results,
  };
}

