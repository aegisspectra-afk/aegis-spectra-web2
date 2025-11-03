import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Find post by slug first
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' }, 
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        views: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error updating view count:', error);
    return NextResponse.json(
      { error: 'Failed to update view count' }, 
      { status: 500 }
    );
  }
}