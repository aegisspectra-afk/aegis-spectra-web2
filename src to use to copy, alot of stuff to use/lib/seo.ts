import { NextSeoProps } from 'next-seo';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const defaultSEO: NextSeoProps = {
  title: 'Aegis Spectra Security',
  description: 'Smart protection for home & business — cameras, access control, and remote management (SaaS).',
  canonical: siteUrl,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Aegis Spectra Security',
    description: 'Smart protection for home & business — cameras, access control, and remote management (SaaS).',
    siteName: 'Aegis Spectra Security',
    images: [
      {
        url: `${siteUrl}/og/og-default.png`,
        width: 1200,
        height: 630,
        alt: 'Aegis Spectra Security',
      },
    ],
  },
  twitter: {
    handle: '@aegisspectra',
    site: '@aegisspectra',
    cardType: 'summary_large_image',
  },
};

export const getPageSEO = (title: string, description: string, path: string = '') => ({
  ...defaultSEO,
  title: `${title} | Aegis Spectra Security`,
  description,
  canonical: `${siteUrl}${path}`,
  openGraph: {
    ...defaultSEO.openGraph,
    title: `${title} | Aegis Spectra Security`,
    description,
    url: `${siteUrl}${path}`,
  },
});