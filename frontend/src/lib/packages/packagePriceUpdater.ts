/**
 * Package Price Updater - כלי לעדכון אוטומטי של מחירי חבילות
 * 
 * כלי זה מעדכן את המחירים של החבילות על בסיס מחירי המוצרים הבודדים
 */

import { Package } from '@/types/packages';
import { auditPackage, PackageAuditResult } from './packagePriceAudit';
import { calculatePackagePriceFromComponents } from './productPrices';

export interface PriceUpdateResult {
  packageId: string;
  packageName: string;
  oldPrice: number;
  newPrice: number;
  difference: number;
  differencePercent: number;
  updated: boolean;
  reason?: string;
}

/**
 * מעדכן מחיר של חבילה אחת
 */
export function updatePackagePrice(
  packageData: Package,
  options: {
    autoUpdate?: boolean; // האם לעדכן אוטומטית
    minDifferencePercent?: number; // עדכון רק אם ההבדל גדול מ-X%
    maxDifferencePercent?: number; // עדכון רק אם ההבדל קטן מ-X%
  } = {}
): PriceUpdateResult {
  const audit = auditPackage(packageData);
  
  const {
    autoUpdate = false,
    minDifferencePercent = 5, // עדכון רק אם ההבדל גדול מ-5%
    maxDifferencePercent = 50, // עדכון רק אם ההבדל קטן מ-50%
  } = options;

  const shouldUpdate = autoUpdate && 
    Math.abs(audit.differencePercent) >= minDifferencePercent &&
    Math.abs(audit.differencePercent) <= maxDifferencePercent;

  return {
    packageId: packageData.id,
    packageName: packageData.nameHebrew,
    oldPrice: audit.currentPrice,
    newPrice: audit.calculatedPrice,
    difference: audit.difference,
    differencePercent: audit.differencePercent,
    updated: shouldUpdate,
    reason: shouldUpdate 
      ? `מחיר עודכן מ-${audit.currentPrice} ל-${audit.calculatedPrice} (הבדל של ${audit.differencePercent.toFixed(1)}%)`
      : !autoUpdate 
        ? 'עדכון אוטומטי לא מופעל'
        : Math.abs(audit.differencePercent) < minDifferencePercent
          ? `ההבדל קטן מדי (${audit.differencePercent.toFixed(1)}% < ${minDifferencePercent}%)`
          : `ההבדל גדול מדי (${audit.differencePercent.toFixed(1)}% > ${maxDifferencePercent}%) - דורש בדיקה ידנית`,
  };
}

/**
 * מעדכן את כל החבילות
 */
export function updateAllPackagePrices(
  packages: Package[],
  options: {
    autoUpdate?: boolean;
    minDifferencePercent?: number;
    maxDifferencePercent?: number;
  } = {}
): {
  results: PriceUpdateResult[];
  summary: {
    total: number;
    updated: number;
    skipped: number;
    totalDifference: number;
  };
} {
  const results = packages.map(pkg => updatePackagePrice(pkg, options));
  
  const summary = {
    total: results.length,
    updated: results.filter(r => r.updated).length,
    skipped: results.filter(r => !r.updated).length,
    totalDifference: results.reduce((sum, r) => sum + (r.updated ? r.difference : 0), 0),
  };

  return {
    results,
    summary,
  };
}

/**
 * יוצר קוד לעדכון המחירים בקובץ packages.ts
 */
export function generatePriceUpdateCode(
  updateResults: PriceUpdateResult[]
): string {
  const updates = updateResults
    .filter(r => r.updated)
    .map(r => {
      return `    // ${r.packageName}
    {
      id: '${r.packageId}',
      pricing: {
        base: ${r.newPrice},
        // עודכן מ-${r.oldPrice} (הבדל של ${r.differencePercent > 0 ? '+' : ''}${r.differencePercent.toFixed(1)}%)
      },
    },`;
    });

  if (updates.length === 0) {
    return '// אין עדכונים נדרשים';
  }

  return `// עדכוני מחירים אוטומטיים
// נא להעתיק את הקוד הזה לקובץ packages.ts ולעדכן את המחירים

${updates.join('\n\n')}

// סה"כ עודכנו ${updates.length} חבילות`;
}

