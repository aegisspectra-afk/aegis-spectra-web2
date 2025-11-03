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
        {/* Hidden form for Netlify Forms detection at build time */}
        <form name="lead-form" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
          <input type="hidden" name="form-name" value="lead-form" />
          <input type="text" name="name" />
          <input type="tel" name="phone" />
          <input type="text" name="city" />
          <input type="text" name="product_sku" />
          <textarea name="message"></textarea>
          <input type="text" name="bot-field" style={{ display: 'none' }} />
        </form>
        {children}
      </body>
    </html>
  );
}

