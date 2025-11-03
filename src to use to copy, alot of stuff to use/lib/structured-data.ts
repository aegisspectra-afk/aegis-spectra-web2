// Structured Data for SEO

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Aegis Spectra Security",
  "alternateName": "Aegis Spectra",
  "url": "https://aegis-spectra.co.il",
  "logo": "https://aegis-spectra.co.il/logo.png",
  "description": "חברת מיגון ואבטחה מובילה בישראל. התקנת מצלמות אבטחה, מערכות אזעקה, קודנים ופתרונות אבטחה מתקדמים.",
  "foundingDate": "2009",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "רחוב האבטחה 123",
    "addressLocality": "תל אביב",
    "addressCountry": "IL"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+972-3-1234567",
    "contactType": "customer service",
    "availableLanguage": ["Hebrew", "English"]
  },
  "sameAs": [
    "https://www.facebook.com/aegis-spectra",
    "https://www.linkedin.com/company/aegis-spectra",
    "https://www.instagram.com/aegis_spectra"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "מערכות מיגון ואבטחה",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "מצלמות אבטחה 4K",
          "description": "מצלמות אבטחה מתקדמות עם איכות 4K וראיית לילה"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "מערכות אזעקה",
          "description": "מערכות אזעקה אלחוטיות מתקדמות"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "קודנים חכמים",
          "description": "קודנים חכמים לדלתות כניסה"
        }
      }
    ]
  }
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Aegis Spectra Security",
  "url": "https://aegis-spectra.co.il",
  "description": "התקנת מצלמות אבטחה, מערכות אזעקה ופתרונות מיגון מתקדמים לבית ולעסק",
  "inLanguage": "he-IL",
  "publisher": {
    "@type": "Organization",
    "name": "Aegis Spectra Security"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://aegis-spectra.co.il/store?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const productSchema = (product: any) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.image,
  "sku": product.sku,
  "brand": {
    "@type": "Brand",
    "name": product.brand
  },
  "offers": {
    "@type": "Offer",
    "price": product.salePrice,
    "priceCurrency": "ILS",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Aegis Spectra Security"
    }
  }
});

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "התקנת מערכות מיגון ואבטחה",
  "description": "שירותי התקנה מקצועיים למערכות מיגון ואבטחה",
  "provider": {
    "@type": "Organization",
    "name": "Aegis Spectra Security"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Israel"
  },
  "serviceType": "Security Installation",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "שירותי התקנה",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "התקנת מצלמות אבטחה"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "התקנת מערכות אזעקה"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "התקנת קודנים"
        }
      }
    ]
  }
};

export const breadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const faqSchema = (faqs: Array<{question: string, answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});