import "./globals.css";
import { Heebo } from "next/font/google";

const heebo = Heebo({ subsets: ["hebrew"], weight: ["400","700"] });

export const metadata = {
  title: "Aegis Spectra Security",
  description: "מיגון ואבטחה חכמה לבית ולעסק – Aegis Spectra",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className={heebo.className}>
        {children}
      </body>
    </html>
  );
}

