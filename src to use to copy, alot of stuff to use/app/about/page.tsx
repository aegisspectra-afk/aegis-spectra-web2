import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { AboutClient } from '@/components/marketing/about-client';
import { PortfolioGallery } from '@/components/marketing/portfolio-gallery';

export const metadata: Metadata = {
  title: 'מי אנחנו - Aegis Spectra Security | מובילים בתחום המיגון והאבטחה',
  description: 'Aegis Spectra Security - 15+ שנות ניסיון במיגון ואבטחה. צוות מומחים מקצועי, תעודות מוסמכות ושירות 24/7. הגן על הבית והעסק שלך.',
  keywords: ['מי אנחנו', 'Aegis Spectra', 'מיגון ואבטחה', 'צוות מומחים', 'תעודות', 'ניסיון', 'אבטחה מקצועית'],
  openGraph: {
    title: 'מי אנחנו - Aegis Spectra Security',
    description: '15+ שנות ניסיון במיגון ואבטחה. צוות מומחים מקצועי ושירות 24/7.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AboutClient />
      <PortfolioGallery />
      <Footer />
    </div>
  );
}