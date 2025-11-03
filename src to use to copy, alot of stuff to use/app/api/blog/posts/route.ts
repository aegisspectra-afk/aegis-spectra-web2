import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');

    const where: any = {
      published: true
    };

    if (category) {
      where.tags = {
        some: {
          slug: category
        }
      };
    }

    if (featured) {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
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
        },
        orderBy: {
          publishedAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.blogPost.count({ where })
    ]);

    // Calculate reading time (assuming 200 words per minute)
    const postsWithReadingTime = posts.map((post: any) => {
      const wordCount = post.content.split(' ').length;
      const readingTime = Math.ceil(wordCount / 200);
      return { ...post, readingTime };
    });

    return NextResponse.json({
      posts: postsWithReadingTime,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    });
    
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' }, 
      { status: 500 }
    );
  }
}