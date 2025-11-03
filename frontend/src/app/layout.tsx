import "./globals.css";
import { Heebo } from "next/font/google";
import { GoogleAnalytics } from "@/components/Analytics";

const heebo = Heebo({ subsets: ["hebrew"], weight: ["400","700"] });

export const metadata = {
  title: "Aegis Spectra Security - מיגון ואבטחה חכמה",
  description: "מיגון ואבטחה חכמה לבית ולעסק – Aegis Spectra. מצלמות AI, אזעקות, בקרת כניסה ותמיכה בעברית.",
  keywords: ["אבטחה", "מצלמות", "CCTV", "אזעקה", "בקרת כניסה", "מיגון", "ישראל"],
  authors: [{ name: "Aegis Spectra" }],
  openGraph: {
    title: "Aegis Spectra Security - מיגון ואבטחה חכמה",
    description: "מיגון ואבטחה חכמה לבית ולעסק – Aegis Spectra",
    type: "website",
    locale: "he_IL",
    siteName: "Aegis Spectra",
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://aegis-spectra.netlify.app" />
      </head>
      <body className={heebo.className}>
        {gaId && <GoogleAnalytics gaId={gaId} />}
        {children}
      </body>
    </html>
  );
}

