import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.blogTag.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                published: true
              }
            }
          }
        }
      },
      orderBy: {
        posts: {
          _count: 'desc'
        }
      }
    });

    const categoriesWithCount = categories.map((category: any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      color: category.color,
      postCount: category._count.posts
    }));

    return NextResponse.json({
      categories: categoriesWithCount
    });
    
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog categories' }, 
      { status: 500 }
    );
  }
}