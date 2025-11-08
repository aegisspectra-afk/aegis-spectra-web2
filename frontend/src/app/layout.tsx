import "./globals.css";
import { Heebo } from "next/font/google";
import { GoogleAnalytics } from "@/components/Analytics";
import { JSONLDSchema } from "@/components/JSONLDSchema";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ServiceWorker } from "@/components/ServiceWorker";
import { ToastProvider } from "@/components/ToastProvider";
import { CartProvider } from "@/contexts/cart-context";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import AccessibilityMenu from "@/components/AccessibilityMenu";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

const heebo = Heebo({ subsets: ["hebrew"], weight: ["400","700"] });

export const metadata = {
  title: "Aegis Spectra Security - מיגון ואבטחה חכמה",
  description: "מיגון ואבטחה חכמה לבית ולעסק – Aegis Spectra. מצלמות AI, אזעקות, בקרת כניסה ותמיכה בעברית.",
  keywords: ["אבטחה", "מצלמות", "CCTV", "אזעקה", "בקרת כניסה", "מיגון", "ישראל"],
  authors: [{ name: "Aegis Spectra" }],
  openGraph: {
    title: "Aegis Spectra Security - מיגון ואבטחה חכמה",
    description: "מיגון ואבטחה חכמה לבית ולעסק – Aegis Spectra. מצלמות AI, אזעקות, בקרת כניסה ותמיכה בעברית.",
    type: "website",
    locale: "he_IL",
    siteName: "Aegis Spectra",
    url: "https://aegis-spectra.netlify.app",
    images: [
      {
        url: "https://aegis-spectra.netlify.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aegis Spectra Security",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aegis Spectra Security",
    description: "מיגון ואבטחה חכמה לבית ולעסק",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon.svg" sizes="any" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://aegis-spectra.netlify.app" />
        <meta name="theme-color" content="#D4AF37" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Aegis Spectra" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={heebo.className}>
        <ErrorBoundary>
          <AccessibilityProvider>
            <ToastProvider>
              <CartProvider>
                <ServiceWorker />
                <JSONLDSchema />
                {gaId && <GoogleAnalytics gaId={gaId} />}
              <a href="#main-content" className="skip-to-main">
                דלג לתוכן הראשי
              </a>
              <main id="main-content">
                {children}
              </main>
              <AccessibilityMenu />
              <WhatsAppFloatingButton />
              </CartProvider>
            </ToastProvider>
          </AccessibilityProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

