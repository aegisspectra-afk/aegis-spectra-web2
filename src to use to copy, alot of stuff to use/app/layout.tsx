import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'sonner';
import { SessionProvider } from '@/components/providers/session-provider';
import { CartProvider } from '@/contexts/cart-context';
import { UserProfileProvider } from '@/contexts/user-profile';
import { organizationSchema, websiteSchema, serviceSchema, faqSchema } from '@/lib/advanced-seo';
import { ErrorBoundary } from '@/components/common/error-boundary';
import { CookiesConsent } from '@/components/common/cookies-consent';
import Script from 'next/script';
import '../styles/globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'Aegis Spectra Security - התקנת מצלמות אבטחה',
  description: 'התקנת מצלמות אבטחה, קודנים ואזעקות לבית ולעסק. אפליקציה בעברית, אחריות 12 חודשים, שירות באזור המרכז.',
  keywords: ['התקנת מצלמות', 'מצלמות אבטחה', 'קודנים', 'אזעקות', 'אבטחה', 'התקנה', 'Aegis Spectra', 'מעקב', 'ניהול מרחוק'],
  authors: [{ name: 'Aegis Spectra Security' }],
  creator: 'Aegis Spectra Security',
  publisher: 'Aegis Spectra Security',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: '/',
    title: 'Aegis Spectra Security - התקנת מצלמות אבטחה',
    description: 'התקנת מצלמות אבטחה, קודנים ואזעקות לבית ולעסק. אפליקציה בעברית, אחריות 12 חודשים, שירות באזור המרכז.',
    siteName: 'Aegis Spectra Security',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aegis Spectra Security - התקנת מצלמות אבטחה',
    description: 'התקנת מצלמות אבטחה, קודנים ואזעקות לבית ולעסק. אפליקציה בעברית, אחריות 12 חודשים, שירות באזור המרכז.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      </head>
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased`}>
        {/* Google Analytics - Only load if GA_ID is provided */}
        {process.env.NEXT_PUBLIC_GA_ID && process.env.NEXT_PUBLIC_GA_ID !== 'G-XXXXXXXXXX' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        {/* Facebook Pixel - Only load if FB_PIXEL_ID is provided */}
        {process.env.NEXT_PUBLIC_FB_PIXEL_ID && process.env.NEXT_PUBLIC_FB_PIXEL_ID !== 'XXXXXXXXXXXXXXX' && (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        <SessionProvider>
          <UserProfileProvider>
            <CartProvider>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </CartProvider>
          </UserProfileProvider>
        </SessionProvider>
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
        <Analytics />
        <CookiesConsent />
      </body>
    </html>
  );
}