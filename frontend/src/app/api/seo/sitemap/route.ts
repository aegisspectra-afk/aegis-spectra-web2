import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@netlify/neon';

const sql = neon();

// GET - Generate sitemap
export async function GET(request: NextRequest) {
  try {
    // Get all products
    const products = await sql`
      SELECT sku, name, updated_at, created_at FROM products
      WHERE stock IS NULL OR stock > 0
      ORDER BY created_at DESC
    `.catch(() => []);

    // Get all pages (static routes)
    const staticPages = [
      { url: '/', priority: 1.0, changefreq: 'daily' },
      { url: '/products', priority: 0.9, changefreq: 'daily' },
      { url: '/about', priority: 0.8, changefreq: 'monthly' },
      { url: '/contact', priority: 0.8, changefreq: 'monthly' },
      { url: '/blog', priority: 0.7, changefreq: 'weekly' },
      { url: '/services', priority: 0.8, changefreq: 'monthly' },
      { url: '/checkout', priority: 0.5, changefreq: 'weekly' },
      { url: '/privacy', priority: 0.3, changefreq: 'yearly' },
      { url: '/terms', priority: 0.3, changefreq: 'yearly' }
    ];

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aegis-spectra.netlify.app';
    const currentDate = new Date().toISOString();

    // Generate sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static pages
    staticPages.forEach((page) => {
      sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    // Add product pages
    products.forEach((product: any) => {
      const lastmod = product.updated_at 
        ? new Date(product.updated_at).toISOString() 
        : (product.created_at 
          ? new Date(product.created_at).toISOString() 
          : currentDate);
      sitemap += `  <url>
    <loc>${baseUrl}/product/${encodeURIComponent(product.sku)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    sitemap += `</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error: any) {
    console.error('Error generating sitemap:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to generate sitemap' },
      { status: 500 }
    );
  }
}

