/**
 * Admin Packages API - CRUD operations for packages
 */
import { NextRequest, NextResponse } from 'next/server';
import { packages, getPackageBySlug } from '@/data/packages';
import { Package } from '@/types/packages';

// GET: List all packages (admin)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // if (!isAdmin(request)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let filteredPackages = [...packages];

    if (category && category !== 'all') {
      filteredPackages = filteredPackages.filter(p => p.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredPackages = filteredPackages.filter(p =>
        p.nameHebrew.toLowerCase().includes(searchLower) ||
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredPackages,
      total: filteredPackages.length,
    });
  } catch (error: any) {
    console.error('Admin packages GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}

// POST: Create new package
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    const body = await request.json();
    const packageData: Package = body;

    // Validate required fields
    if (!packageData.slug || !packageData.name || !packageData.nameHebrew) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    if (getPackageBySlug(packageData.slug)) {
      return NextResponse.json(
        { success: false, error: 'Package slug already exists' },
        { status: 400 }
      );
    }

    // TODO: Save to database
    // For now, just return success
    const newPackage: Package = {
      ...packageData,
      id: `pkg_${Date.now()}`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newPackage,
      message: 'Package created successfully',
    });
  } catch (error: any) {
    console.error('Admin packages POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create package' },
      { status: 500 }
    );
  }
}

