/**
 * Package Detail Page - עמוד פרטי חבילה
 */
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPackageBySlug, packages } from '@/data/packages';
import { PackageHero } from '@/components/packages/PackageHero';
import { PackageFeatures } from '@/components/packages/PackageFeatures';
import { PackageSpecs } from '@/components/packages/PackageSpecs';
import { PackageAddons } from '@/components/packages/PackageAddons';
import { PackageCalculator } from '@/components/packages/PackageCalculator';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return packages.map((pkg) => ({
    slug: pkg.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const packageData = getPackageBySlug(params.slug);

  if (!packageData) {
    return {
      title: 'חבילה לא נמצאה - Aegis Spectra',
    };
  }

  const title = packageData.seo?.title || `${packageData.nameHebrew} - Aegis Spectra`;
  const description = packageData.seo?.description || packageData.description;

  return {
    title,
    description,
    keywords: packageData.seo?.keywords || [],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'he_IL',
      siteName: 'Aegis Spectra',
      images: packageData.heroImage ? [
        {
          url: packageData.heroImage,
          width: 1200,
          height: 630,
          alt: packageData.nameHebrew,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function PackagePage({ params }: PageProps) {
  const packageData = getPackageBySlug(params.slug);

  if (!packageData) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: packageData.nameHebrew,
            description: packageData.description,
            image: packageData.heroImage || packageData.image,
            offers: {
              '@type': 'Offer',
              price: packageData.pricing.base,
              priceCurrency: packageData.pricing.currency,
              availability: 'https://schema.org/InStock',
              url: `https://aegis-spectra.netlify.app/packages/${packageData.slug}`,
            },
            ...(packageData.popular ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5',
                reviewCount: '10',
              },
            } : {}),
          }),
        }}
      />
      <Navbar />
      <main className="min-h-screen bg-charcoal text-white">
        <PackageHero packageData={packageData} />
        <PackageFeatures packageData={packageData} />
        <PackageSpecs packageData={packageData} />
        <PackageCalculator packageData={packageData} />
        <PackageAddons packageData={packageData} />
      </main>
      <Footer />
    </>
  );
}

