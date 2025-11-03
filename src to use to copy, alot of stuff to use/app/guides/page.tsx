import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GuidesHero } from '@/components/guides/guides-hero';
import { InstallationGuides } from '@/components/guides/installation-guides';
import { TroubleshootingGuides } from '@/components/guides/troubleshooting-guides';

export const metadata: Metadata = {
  title: 'מדריכי התקנה ופתרון בעיות - Aegis Spectra Security',
  description: 'מדריכי התקנה מפורטים, פתרון בעיות נפוצות, טיפים מקצועיים ותחזוקה למערכות אבטחה. כל מה שאתה צריך לדעת.',
  keywords: ['מדריכי התקנה', 'פתרון בעיות', 'תחזוקה', 'מצלמות אבטחה', 'אזעקות', 'קודנים', 'DIY', 'טיפים'],
  openGraph: {
    title: 'מדריכי התקנה ופתרון בעיות - Aegis Spectra Security',
    description: 'מדריכי התקנה מפורטים, פתרון בעיות נפוצות, טיפים מקצועיים ותחזוקה למערכות אבטחה.',
    type: 'website',
  },
};

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="pt-20">
        <GuidesHero />
        <InstallationGuides />
        <TroubleshootingGuides />
      </div>
      <Footer />
    </div>
  );
}
