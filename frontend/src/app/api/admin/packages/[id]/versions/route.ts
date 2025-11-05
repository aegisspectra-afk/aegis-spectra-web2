/**
 * Package Versions API - Get version history and rollback
 */
import { NextRequest, NextResponse } from 'next/server';

// GET: Get version history for a package
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // TODO: Load from database (package_versions table)
    // For now, return mock data
    const versions = [
      {
        id: 'v1',
        version: 1,
        data: {},
        changedBy: 'admin',
        changesSummary: 'Initial version',
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      data: versions,
    });
  } catch (error: any) {
    console.error('Package versions GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch versions' },
      { status: 500 }
    );
  }
}

