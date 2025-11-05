/**
 * Price Calculation API Endpoint - Server-side authoritative price calculation
 */
import { NextRequest, NextResponse } from 'next/server';
import { getPackageBySlug } from '@/data/packages';
import { calculatePackagePrice, PackagePriceOptions } from '@/lib/packages/calculatePrice';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packageSlug, options, promoCode }: {
      packageSlug?: string;
      options?: PackagePriceOptions;
      promoCode?: string;
    } = body;

    if (!packageSlug) {
      return NextResponse.json(
        { success: false, error: 'Package slug is required' },
        { status: 400 }
      );
    }

    // Get package
    const packageData = getPackageBySlug(packageSlug);

    if (!packageData) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      );
    }

    // Validate options
    if (options?.cameras) {
      const { min, max } = packageData.specifications.cameras;
      if (options.cameras < min || options.cameras > max) {
        return NextResponse.json(
          { success: false, error: `Cameras must be between ${min} and ${max}` },
          { status: 400 }
        );
      }
    }

    // Calculate price (authoritative server-side)
    const breakdown = calculatePackagePrice(packageData, options || {});

    // Format breakdown for response
    const formattedBreakdown = [
      { label: 'מחיר בסיס', amount: breakdown.base },
      ...(breakdown.additionalCameras > 0 ? [{
        label: `מצלמות נוספות (${options?.cameras || packageData.specifications.cameras.default - packageData.specifications.cameras.default} x ${packageData.pricing.additionalCameras?.pricePerCamera || 0})`,
        amount: breakdown.additionalCameras,
      }] : []),
      ...(breakdown.aiUpgrade > 0 ? [{ label: `AI ${options?.aiDetection || 'Upgrade'}`, amount: breakdown.aiUpgrade }] : []),
      ...(breakdown.storageUpgrade > 0 ? [{ label: `אחסון ${options?.storage}`, amount: breakdown.storageUpgrade }] : []),
      ...(breakdown.addons > 0 ? [{ label: 'תוספות', amount: breakdown.addons }] : []),
      ...(breakdown.installation > 0 ? [{ label: 'התקנה', amount: breakdown.installation }] : []),
      ...(breakdown.maintenance > 0 ? [{ label: 'תחזוקה שנתית', amount: breakdown.maintenance }] : []),
    ];

    return NextResponse.json({
      success: true,
      breakdown: formattedBreakdown,
      subtotal: breakdown.subtotal,
      discounts: breakdown.discounts,
      total: breakdown.total,
      currency: breakdown.currency,
      validated: true,
    });
  } catch (error: any) {
    console.error('Price calculation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to calculate price' },
      { status: 500 }
    );
  }
}

