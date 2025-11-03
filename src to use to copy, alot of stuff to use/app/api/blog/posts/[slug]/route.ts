import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug: params.slug,
        published: true
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        tags: {
          select: {
            name: true,
            color: true
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' }, 
        { status: 404 }
      );
    }

    // Calculate reading time
    const wordCount = post.content.split(' ').length;
    const readingTime = Math.ceil(wordCount / 200);

    return NextResponse.json({
      ...post,
      readingTime
    });
    
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' }, 
      { status: 500 }
    );
  }
}