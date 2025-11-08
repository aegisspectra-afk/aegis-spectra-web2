/**
 * Admin Package Detail API - Get, Update, Delete package
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { packages, getPackageBySlug } from '@/data/packages';
import { Package } from '@/types/packages';

// GET: Get package by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const packageData = packages.find(p => p.id === id);

    if (!packageData) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: packageData,
    });
  } catch (error: any) {
    console.error('Admin package GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch package' },
      { status: 500 }
    );
  }
}

// PUT: Update package
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const packageData: Package = body;

    // Find package
    const existingPackage = packages.find(p => p.id === id);
    if (!existingPackage) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      );
    }

    // TODO: Create version snapshot before updating
    // TODO: Save to database
    // TODO: Increment version

    const updatedPackage: Package & { version?: number; updatedAt?: string } = {
      ...packageData,
      id,
      version: ((existingPackage as any).version || 1) + 1,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: updatedPackage,
      version: updatedPackage.version,
      message: 'Package updated successfully',
    });
  } catch (error: any) {
    console.error('Admin package PUT error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update package' },
      { status: 500 }
    );
  }
}

// DELETE: Delete package
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    // Find package
    const existingPackage = packages.find(p => p.id === id);
    if (!existingPackage) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      );
    }

    // TODO: Soft delete (mark as deleted, don't actually remove)
    // TODO: Save to database

    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully',
    });
  } catch (error: any) {
    console.error('Admin package DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete package' },
      { status: 500 }
    );
  }
}

